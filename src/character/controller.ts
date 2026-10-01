/**
 * CHARACTER CONTROLLER — a single rAF loop driving SVG transforms directly.
 *
 * Architecture (spec §9):
 *   Current pose ──▶ target pose ──▶ exponential smoothing ──▶ SVG transform
 *
 * - No React state updates per frame; joint transforms are written via
 *   setAttribute / style.transform with change-detection epsilons.
 * - Pivot points are ABSOLUTE local coordinates (drift-free composition).
 * - Movement between anchors: quick lerp for small distances, time-based
 *   0.45s dash-arc for long jumps (spec §14 — navigation never waits).
 * - Degradation: reduced-motion → instant teleport poses; low-end → no
 *   mouse-follow, instant repositioning; any failure → silent no-op.
 */

import { characterBus, sectionStaging, type CharacterEvent } from "@/lib/bus";
import { getPerfMode } from "@/lib/perf";
import { poses, ZERO_POSE, type Pose } from "./poses";

/* ---------- geometry constants (must match CharacterSVG viewBox) ----------
   Chinmai avatar rig: viewBox 125.87 x 402.48, feet centre mapped through
   the #character matrix (scale 0.5334). Pivots are in the character's LOCAL
   space (pre-matrix), exactly as the joint groups use them. */
const VB = { x: 195.161, y: 36.2549, w: 125.8725, h: 402.4796 };
const FEET = { x: 258.097, y: 431.801 }; // viewBox units
/* feet -> eye-line distance in viewBox units (look-at target height) */
const EYE_LIFT = 293;
/* the avatar's local units render ~2.36x smaller than the old 100-unit
   viewBox — px-based look/breath offsets are compensated so the on-screen
   motion magnitude stays identical */
const LOOK_SCALE = 2.36;
const PIVOT = {
  rootRot: [200, 754],
  torso: [200, 552],
  head: [200, 276],
  eyes: [23.961, 304.279], // cj-eyes local space (inside group-1 translate)
  armL: [134, 352],
  armLelbow: [134, 440],
  armR: [266, 352],
  armRelbow: [266, 440],
  legL: [170, 544],
  legLknee: [170, 650],
  legR: [230, 544],
  legRknee: [230, 650],
  shadow: [200, 758],
} as const;

type Vec = { x: number; y: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

class CharacterController {
  private stage: HTMLElement | null = null;
  private joints: Partial<Record<string, Element | null>> = {};
  private raf = 0;
  private running = false;
  private last = 0;
  private time = 0;

  /* motion state */
  private pos: Vec = { x: 0, y: 0 };
  private target: Vec = { x: 0, y: 0 };
  private dash: { from: Vec; to: Vec; start: number; dur: number; arc: number } | null = null;
  private walkPhase = 0;
  private walkAmp = 0;
  private moveBoost = 0;

  /* pose state */
  private cur: Pose = { ...ZERO_POSE };
  private tgt: Pose = { ...poses.hero };
  private poseName = "hero";

  /* behaviour layers */
  private blinkAt = 2500;
  private blinkT = -1;
  private look = { x: 0, y: 0, hx: 0, hy: 0 }; // smoothed mouse/lookAt influence
  private lookAtUntil = 0;
  private lookAtPoint: Vec | null = null;
  private gestureUntil = 0;
  private gesturePose: string | null = null;
  private revealed = false;
  private hidden = false;
  private mobileFocusDim = false;

  /* staging */
  private section = "hero";
  private unit = 1.1;
  private charW = 116;

  /** Full margin-riding journey needs a real gutter — narrow screens get hero-only */
  private get journeyActive(): boolean {
    return !this.mobile && (typeof window === "undefined" || window.innerWidth >= 1440);
  }

  /* perf */
  private low = false;
  private reduced = false;
  private mobile = false;

  /* caches */
  private sectionEls: { id: string; top: number }[] = [];
  private lastWritten = new Map<string, string>();

  /* ------------------------------------------------------------------ */
  mount(stage: HTMLElement) {
    this.stage = stage;
    try {
      const perf = getPerfMode();
      this.low = perf.low;
      this.reduced = perf.reducedMotion;
      this.mobile = perf.mobile || window.innerWidth < 820;
      this.charW = this.mobile ? 84 : 116;
      this.unit = this.charW / VB.w;
      stage.style.width = `${this.charW}px`;
      stage.style.height = `${this.charW * (VB.h / VB.w)}px`;
      stage.style.opacity = "0";
    } catch {
      return; // never break the site for the character (spec §42)
    }

    /* bind joints */
    const ids = [
      "cj-root", "shadow", "cj-bob", "torso-rig", "head", "cj-eyes",
      "left-arm", "left-forearm", "right-arm", "right-forearm",
      "left-leg", "left-shin", "right-leg", "right-shin",
    ];
    for (const id of ids) this.joints[id] = document.getElementById(id);

    this.cacheSections();
    this.stage.style.transform = this.stageTransform(this.pos);
    this.applyPose(ZERO_POSE, 1);

    /* listeners */
    characterBus.on(this.onBus);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize);
    if (!this.low && !this.reduced) window.addEventListener("mousemove", this.onMouse, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    this.resizeChar();
    this.start();
  }

  unmount() {
    this.stop();
    characterBus.off(this.onBus);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouse);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  /* ------------------------------ bus ------------------------------ */

  private onBus = (e: CharacterEvent) => {
    switch (e.type) {
      case "reveal":
        this.reveal(false);
        break;
      case "section":
        this.setStaging(e.section, false);
        break;
      case "navigate":
        if (!this.revealed) this.reveal(true);
        this.setStaging(e.section, true);
        break;
      case "projectHover":
        this.onProjectHover(e.index);
        break;
      case "projectOpen":
        this.hide();
        break;
      case "projectClose":
        this.show();
        break;
      case "formFocus":
        this.onFormFocus(e.field);
        break;
      case "formSend":
        this.gesture("click", 900);
        break;
      case "formSuccess":
        this.gesture("happy", 2600);
        break;
      case "formError":
        this.gesture("think", 2600);
        break;
    }
  };

  /* ---------------------------- staging ---------------------------- */

  private cacheSections() {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    this.sectionEls = els.map((el) => ({ id: el.dataset.section!, top: 0 }));
    this.measureSections();
  }

  private measureSections() {
    const sy = window.scrollY;
    this.sectionEls.forEach((s) => {
      const el = document.querySelector<HTMLElement>(`[data-section="${s.id}"]`);
      if (el) s.top = el.getBoundingClientRect().top + sy;
    });
  }

  private activeSection(): string {
    const line = window.scrollY + window.innerHeight * 0.45;
    let active = "hero";
    for (const s of this.sectionEls) {
      if (s.top <= line) active = s.id;
    }
    return active;
  }

  private stagingTarget(section: string): { pos: Vec; pose: string } {
    const st = sectionStaging[section] ?? { side: "right" as const, pose: "idle" };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (section === "hero") {
      const ped = document.getElementById("char-pedestal");
      if (ped) {
        const r = ped.getBoundingClientRect();
        return { pos: { x: r.left + r.width / 2, y: r.bottom - 4 }, pose: st.pose };
      }
    }

    if (this.mobile) {
      return { pos: { x: vw - (FEET.x - VB.x) * this.unit - 14, y: vh * 0.88 }, pose: st.pose };
    }

    const cont = document.querySelector<HTMLElement>(".container-site");
    const contLeft = cont ? cont.getBoundingClientRect().left : Math.max(24, vw * 0.06);
    const gutter = clamp(contLeft * 0.6, 100, 380);
    const x = st.side === "left" ? gutter : vw - gutter;
    return { pos: { x, y: vh * 0.76 }, pose: st.pose };
  }

  private setStaging(section: string, viaNav: boolean) {
    this.section = section;

    /* Content always wins (spec §39/§52): on mobile and narrow desktops the
       guide appears in the hero frame and steps out of the way elsewhere */
    if (!this.journeyActive) {
      if (section === "hero") {
        const { pos, pose } = this.stagingTarget("hero");
        this.target = pos;
        this.tgt = poses[pose] ?? poses.idle;
        this.poseName = pose;
        this.setMobileVisible(true);
      } else {
        this.setMobileVisible(false);
      }
      this.pos = { ...this.target };
      if (this.stage) this.stage.style.transform = this.stageTransform(this.pos);
      return;
    }

    /* the guide grows a little while presenting in the hero frame */
    const wantW = section === "hero" ? 150 : 116;
    if (wantW !== this.charW) {
      this.charW = wantW;
      this.unit = this.charW / VB.w;
      if (this.stage) {
        this.stage.style.width = `${this.charW}px`;
        this.stage.style.height = `${this.charW * (VB.h / VB.w)}px`;
      }
    }
    const { pos, pose } = this.stagingTarget(section);
    this.target = pos;
    this.tgt = poses[pose] ?? poses.idle;
    this.poseName = pose;

    if (this.reduced || this.low) {
      this.pos = { ...pos };
      if (this.stage) this.stage.style.transform = this.stageTransform(this.pos);
      return;
    }

    const dist = Math.hypot(pos.x - this.pos.x, pos.y - this.pos.y);
    if (viaNav || dist > 240) {
      /* fast jump: 0.45s deterministic dash with a small arc (spec §14) */
      this.dash = {
        from: { ...this.pos },
        to: { ...pos },
        start: performance.now(),
        dur: 450,
        arc: clamp(dist * 0.08, 10, 46),
      };
      this.moveBoost = 1;
    } else if (dist > 10) {
      this.walkAmp = 1;
      this.moveBoost = 0.6;
    }
  }

  /* ---------------------------- gestures ---------------------------- */

  private gesture(name: string, ms: number) {
    this.gesturePose = name;
    this.gestureUntil = performance.now() + ms;
    this.tgt = poses[name] ?? poses.idle;
    if (this.reduced || this.low) {
      window.setTimeout(() => {
        if (this.gesturePose === name) {
          this.gesturePose = null;
          this.setStaging(this.section, false);
        }
      }, ms);
    }
  }

  private onProjectHover(index: number | null) {
    if (index === null) {
      this.setStaging(this.section, false);
      return;
    }
    const el = document.getElementById(`project-card-${index}`);
    if (el) {
      const r = el.getBoundingClientRect();
      this.lookAtPoint = { x: r.left + r.width * 0.4, y: r.top + r.height * 0.35 };
      this.lookAtUntil = performance.now() + 2500;
    }
    const dir = this.pos.x < window.innerWidth / 2 ? "pointRight" : "pointLeft";
    this.tgt = poses[dir] ?? poses.look;
    this.poseName = dir;
  }

  private onFormFocus(field: string | null) {
    if (this.mobile) {
      this.mobileFocusDim = field !== null;
      if (this.stage) this.stage.style.opacity = field ? "0.14" : this.revealed ? "1" : "0";
      return;
    }
    if (!field) {
      this.lookAtPoint = null;
      this.setStaging(this.section, false);
      return;
    }
    const el = document.getElementById(`contact-field-${field}`);
    if (el) {
      const r = el.getBoundingClientRect();
      this.lookAtPoint = { x: r.left + r.width * 0.25, y: r.top + r.height * 0.5 };
      this.lookAtUntil = performance.now() + 4000;
    }
    if (field === "attachment") {
      this.tgt = poses.pointUp;
      this.poseName = "pointUp";
    } else {
      this.tgt = poses.guide;
      this.poseName = "guide";
    }
  }

  private reveal(instant: boolean) {
    if (this.revealed) return;
    this.revealed = true;
    if (!this.stage) return;
    this.stage.style.opacity = "1";
    if (instant || this.reduced || this.low) {
      this.setStaging(this.section, false);
      return;
    }
    /* entrance: a small wave, then settle into the hero pose */
    this.pos = { ...this.target };
    this.tgt = poses.wave;
    this.poseName = "wave";
    window.setTimeout(() => {
      if (this.poseName === "wave") this.setStaging(this.section, false);
    }, 1900);
  }

  private setMobileVisible(v: boolean) {
    if (!this.stage || this.hidden) return;
    const o = v && this.revealed ? "1" : "0";
    if (this.stage.style.opacity !== o) this.stage.style.opacity = o;
  }

  private hide() {
    this.hidden = true;
    if (this.stage) this.stage.style.opacity = "0";
  }

  private show() {
    this.hidden = false;
    if (this.stage && this.revealed) this.stage.style.opacity = "1";
  }

  /* ---------------------------- listeners ---------------------------- */

  private onScroll = () => {
    if (this.hidden) return;
    const active = this.activeSection();
    if (active !== this.section) {
      /* scrolling away from hero before the intro finished? reveal instantly */
      if (!this.revealed && active !== "hero") this.reveal(true);
      this.setStaging(active, false);
    } else if (this.section === "hero") {
      /* keep glued to the pedestal while it scrolls */
      const { pos } = this.stagingTarget("hero");
      this.target = pos;
      if (this.reduced || this.low) this.pos = { ...pos };
    }
  };

  private onResize = () => {
    const perf = getPerfMode();
    const wasMobile = this.mobile;
    this.mobile = perf.mobile || window.innerWidth < 820;
    this.charW = this.journeyActive ? (this.section === "hero" ? 150 : 116) : 84;
    this.unit = this.charW / VB.w;
    if (this.stage) {
      this.stage.style.width = `${this.charW}px`;
      this.stage.style.height = `${this.charW * (VB.h / VB.w)}px`;
    }
    if (wasMobile !== this.mobile || !this.journeyActive) {
      /* breakpoint or journey change — re-stage for the new layout */
      this.setStaging(this.section, false);
      return;
    }
    this.measureSections();
    const { pos } = this.stagingTarget(this.section);
    this.target = pos;
    this.pos = { ...pos };
    if (this.stage) this.stage.style.transform = this.stageTransform(this.pos);
  };

  private onMouse = (e: MouseEvent) => {
    if (performance.now() < this.lookAtUntil) return;
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    this.look.x = nx;
    this.look.y = ny;
  };

  private onVisibility = () => {
    if (document.hidden) this.stop();
    else this.start();
  };

  /* ------------------------------ loop ------------------------------ */

  private start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;

    this.updateLook(now);
    this.updateMovement(now);
    this.updatePose(dt, now);
    this.render(now);

    this.raf = requestAnimationFrame(this.tick);
  };

  private updateLook(now: number) {
    let tx = this.look.x;
    let ty = this.look.y;
    if (this.lookAtPoint && now < this.lookAtUntil) {
      const dx = this.lookAtPoint.x - this.pos.x;
      const dy = this.lookAtPoint.y - (this.pos.y - EYE_LIFT * this.unit);
      const len = Math.max(1, Math.hypot(dx, dy));
      tx = clamp(dx / len, -1, 1);
      ty = clamp(dy / len, -1, 1);
    } else if (now >= this.lookAtUntil) {
      this.lookAtPoint = null;
    }
    const k = 1 - Math.exp(-0.016 * 6);
    this.look.hx = lerp(this.look.hx, tx, k);
    this.look.hy = lerp(this.look.hy, ty, k);
  }

  private updateMovement(now: number) {
    if (this.dash) {
      const p = clamp((now - this.dash.start) / this.dash.dur, 0, 1);
      const e = easeInOutCubic(p);
      this.pos.x = lerp(this.dash.from.x, this.dash.to.x, e);
      this.pos.y = lerp(this.dash.from.y, this.dash.to.y, e);
      this.walkAmp = 0;
      if (p >= 1) this.dash = null;
      return;
    }
    const dist = Math.hypot(this.target.x - this.pos.x, this.target.y - this.pos.y);
    if (dist > 2) {
      const k = 1 - Math.exp(-0.016 * 9);
      this.pos.x = lerp(this.pos.x, this.target.x, k);
      this.pos.y = lerp(this.pos.y, this.target.y, k);
      this.walkPhase += 0.016 * 13;
      this.walkAmp = lerp(this.walkAmp, 1, 0.12);
    } else {
      this.walkAmp = lerp(this.walkAmp, 0, 0.09);
      this.moveBoost = lerp(this.moveBoost, 0, 0.06);
    }
  }

  private updatePose(dt: number, now: number) {
    /* gesture expiry */
    if (this.gesturePose && now > this.gestureUntil && !this.reduced && !this.low) {
      this.gesturePose = null;
      this.setStaging(this.section, false);
    }

    /* exponential smoothing toward target pose */
    const k = 1 - Math.exp(-dt * 8.5);
    const snap = this.reduced || this.low ? 1 : k;
    for (const key of Object.keys(this.tgt) as (keyof Pose)[]) {
      this.cur[key] = lerp(this.cur[key], this.tgt[key], snap);
    }

    /* blink scheduler */
    if (now > this.blinkAt) {
      this.blinkT = now;
      this.blinkAt = now + 2600 + Math.random() * 3000;
    }
  }

  /* ------------------------------ render ------------------------------ */

  private applyPose(p: Pose, _t: number) {
    const set = (id: string, v: string) => {
      if (this.lastWritten.get(id) === v) return;
      this.lastWritten.set(id, v);
      this.joints[id]?.setAttribute?.("transform", v);
    };
    const rot = (a: number, cx: number, cy: number) => `rotate(${a.toFixed(2)} ${cx} ${cy})`;

    set("cj-root", `translate(0 ${(-p.jump).toFixed(2)}) ${rot(p.rootRot, ...PIVOT.rootRot)}`);
    set("torso-rig", rot(p.torsoRot, ...PIVOT.torso));
    set("head", `translate(${p.headX.toFixed(2)} ${p.headY.toFixed(2)}) ${rot(p.headRot, ...PIVOT.head)}`);
    set("left-arm", rot(p.armLux, ...PIVOT.armL));
    set("left-forearm", rot(p.armLelbow, ...PIVOT.armLelbow));
    set("right-arm", rot(p.armRux, ...PIVOT.armR));
    set("right-forearm", rot(p.armRelbow, ...PIVOT.armRelbow));
    set("left-leg", rot(p.legLhip, ...PIVOT.legL));
    set("left-shin", rot(p.legLknee, ...PIVOT.legLknee));
    set("right-leg", rot(p.legRhip, ...PIVOT.legR));
    set("right-shin", rot(p.legRknee, ...PIVOT.legRknee));
  }

  private render(now: number) {
    const p: Pose = { ...this.cur };

    /* breathing + weight shift (subtle, always-on unless reduced) */
    if (!this.reduced) {
      const breath = Math.sin((this.time / 3.4) * Math.PI * 2);
      const shift = Math.sin((this.time / 7.2) * Math.PI * 2);
      p.headX += this.look.hx * 2.4 * LOOK_SCALE;
      p.headY += this.look.hy * 1.5 * LOOK_SCALE;
      p.headRot += this.look.hx * 3 + shift * 0.6;
      p.eyeX += this.look.hx * 2 * LOOK_SCALE;
      p.eyeY += this.look.hy * 1.1 * LOOK_SCALE;
      p.armLux += breath * 0.7;
      p.armRux += breath * 0.7;
      p.torsoRot += shift * 1.1;
      if (!this.low) p.headY += breath * 0.5 * LOOK_SCALE;
    } else {
      p.headX += this.look.hx * 2 * LOOK_SCALE;
      p.eyeX += this.look.hx * 1.6 * LOOK_SCALE;
    }

    /* dash arc hop */
    if (this.dash) {
      const prog = clamp((now - this.dash.start) / this.dash.dur, 0, 1);
      const arc = Math.sin(prog * Math.PI) * this.dash.arc;
      p.jump += arc;
      p.shadow = 1 - arc / 90;
      /* limbs tuck slightly mid-air */
      p.legLhip += 12;
      p.legLknee += 26;
      p.legRhip -= 8;
      p.legRknee += 16;
      p.armLux += 12;
      p.armRux -= 12;
      const dir = Math.sign(this.dash.to.x - this.dash.from.x) || 1;
      p.rootRot += dir * 3.5;
      p.headRot += dir * 3;
    }

    /* walk cycle for small moves */
    if (this.walkAmp > 0.02 && !this.dash) {
      const s = Math.sin(this.walkPhase);
      const c = Math.cos(this.walkPhase);
      const a = this.walkAmp;
      p.legLhip += s * 20 * a;
      p.legRhip += -s * 20 * a;
      p.legLknee += Math.max(0, -c) * 18 * a;
      p.legRknee += Math.max(0, c) * 18 * a;
      p.armLux += -s * 12 * a;
      p.armRux += -s * 12 * a;
      p.jump += Math.abs(c) * 2.2 * a;
      p.shadow = 1 - Math.abs(c) * 0.05 * a;
    }

    /* wave wiggle */
    if (this.poseName === "wave" && !this.reduced) {
      p.armRelbow += Math.sin(this.time * 9) * 13;
      p.headRot += Math.sin(this.time * 4.6) * 1.4;
    }

    this.applyPose(p, now);

    /* blink */
    let sy = 1;
    if (this.blinkT > 0) {
      const bt = now - this.blinkT;
      if (bt < 130) sy = Math.abs(Math.cos((bt / 130) * Math.PI)) * 0.85 + 0.1;
      else this.blinkT = -1;
    }
    const blinkTransform =
      `translate(${p.eyeX.toFixed(2)} ${p.eyeY.toFixed(2)}) ` +
      `translate(${PIVOT.eyes[0]} ${PIVOT.eyes[1]}) scale(1 ${sy.toFixed(2)}) translate(${-PIVOT.eyes[0]} ${-PIVOT.eyes[1]})`;
    if (this.lastWritten.get("cj-eyes") !== blinkTransform) {
      this.lastWritten.set("cj-eyes", blinkTransform);
      this.joints["cj-eyes"]?.setAttribute?.("transform", blinkTransform);
    }
    /* (cj-eyes id unchanged — it now wraps the avatar's pupil groups) */

    /* breathing bob + shadow */
    const bob = this.reduced ? 0 : Math.sin((this.time / 3.4) * Math.PI * 2) * 1.5;
    const setBob = `translate(0 ${bob.toFixed(2)})`;
    if (this.lastWritten.get("cj-bob") !== setBob) {
      this.lastWritten.set("cj-bob", setBob);
      this.joints["cj-bob"]?.setAttribute?.("transform", setBob);
    }
    const sh = clamp(p.shadow, 0.6, 1.15);
    const shadowT = `translate(${PIVOT.shadow[0]} ${PIVOT.shadow[1]}) scale(${sh.toFixed(3)} 1) translate(${-PIVOT.shadow[0]} ${-PIVOT.shadow[1]})`;
    if (this.lastWritten.get("shadow") !== shadowT) {
      this.lastWritten.set("shadow", shadowT);
      this.joints["shadow"]?.setAttribute?.("transform", shadowT);
    }

    /* stage position */
    if (this.stage && !this.dash) {
      this.stage.style.transform = this.stageTransform(this.pos);
    } else if (this.stage) {
      this.stage.style.transform = this.stageTransform(this.pos);
    }

    /* narrow/mobile dim during form focus (hero only — other sections hide anyway) */
    if (!this.journeyActive && this.stage && !this.hidden && this.section === "hero") {
      const o = this.mobileFocusDim ? "0.14" : this.revealed ? "1" : "0";
      if (this.stage.style.opacity !== o) this.stage.style.opacity = o;
    }
  }

  private stageTransform(pos: Vec): string {
    const x = pos.x - (FEET.x - VB.x) * this.unit;
    const y = pos.y - (FEET.y - VB.y) * this.unit;
    return `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }

  private resizeChar() {
    const { pos } = this.stagingTarget("hero");
    this.pos = { ...pos };
    this.target = { ...pos };
    if (this.stage) this.stage.style.transform = this.stageTransform(this.pos);
  }
}

export const characterController = new CharacterController();
