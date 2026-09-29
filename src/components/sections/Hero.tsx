"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { profile, socials } from "@/data/profile";
import { characterBus, scrollToSection } from "@/lib/bus";
import { Reveal } from "@/effects/Reveal";

/**
 * HERO — cinematic entry (spec §26):
 *   real photograph → 2.5s → geometric wipe → SVG character on the pedestal.
 * The transition is skippable with a click; reduced-motion swaps instantly.
 */

const MARQUEE = [
  "Zoho CRM", "Zoho Creator", "Deluge", "Zoho Books", "Zoho API",
  "React", "JavaScript", "Python", "Node.js", "REST APIs",
  "MongoDB", "Tailwind", "OpenCV", "Flask", "Git",
];

type Phase = "photo" | "scanning" | "swapped";

export function Hero() {
  const [phase, setPhase] = useState<Phase>("photo");
  const [seconds, setSeconds] = useState(3);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      /* calm, instant identity hand-off */
      const t = window.setTimeout(() => {
        setPhase("swapped");
        characterBus.emit({ type: "reveal" });
      }, 900);
      timers.current.push(t);
      return () => timers.current.forEach(clearTimeout);
    }
    const tick = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    const t1 = window.setTimeout(() => setPhase("scanning"), 2500);
    const t2 = window.setTimeout(() => {
      setPhase("swapped");
      characterBus.emit({ type: "reveal" });
    }, 3550);
    timers.current.push(t1, t2);
    return () => {
      clearInterval(tick);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const skip = useCallback(() => {
    if (phase === "swapped") return;
    timers.current.forEach(clearTimeout);
    setPhase("swapped");
    characterBus.emit({ type: "reveal" });
  }, [phase]);

  const go = (id: string) => {
    characterBus.emit({ type: "navigate", section: id === "hero" ? "hero" : id });
    scrollToSection(id);
  };

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16"
      aria-label="Introduction"
    >
      <div className="container-site grid flex-1 items-center gap-10 py-12 lg:grid-cols-12 lg:gap-6">
        {/* ------------------------- left: identity ------------------------- */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="mono-label flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-signal" />
              Portfolio — Chennai, India · {new Date().getFullYear()}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="display-1 mt-6">
              Chinmai
              <br />
              <span className="italic text-ink-2">Sagar</span>
              <span className="ml-3 align-super font-mono text-sm font-normal tracking-normal text-signal">
                A.V
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
              <span className="font-medium text-ink">Developer in the Zoho ecosystem.</span>{" "}
              I build automated workflows, custom CRM solutions and clean API
              integrations — with React, JavaScript and Python on the web side.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={() => go("projects")}
                className="group flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-signal"
              >
                Projects
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() => go("about")}
                className="rounded-full border border-line-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                About
              </button>
              <a
                href="/resume/Chinmai-Sagar-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Resume
              </a>
              <button
                onClick={() => go("contact")}
                className="rounded-full border border-line-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Contact
              </button>
            </div>
          </Reveal>

          <Reveal delay={330}>
            <div className="mt-10 flex items-center gap-6 border-t border-line pt-6">
              <a
                href={socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="u-link font-mono text-xs text-ink-2"
              >
                GitHub — {socials.github.handle}
              </a>
              <a
                href={socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="u-link font-mono text-xs text-ink-2"
              >
                LinkedIn
              </a>
              <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 sm:block">
                {profile.location.split("—")[0].trim()}
              </span>
            </div>
          </Reveal>
        </div>

        {/* ------------------- right: photo → character ------------------- */}
        <div className="lg:col-span-5">
          <Reveal variant="scale" delay={200} className="mx-auto max-w-[340px] lg:ml-auto">
            <figure className="relative">
              {/* corner ticks */}
              <span aria-hidden className="absolute -left-3 -top-3 h-5 w-5 border-l border-t border-ink" />
              <span aria-hidden className="absolute -right-3 -top-3 h-5 w-5 border-r border-t border-ink" />
              <span aria-hidden className="absolute -bottom-3 -left-3 h-5 w-5 border-b border-l border-ink" />
              <span aria-hidden className="absolute -bottom-3 -right-3 h-5 w-5 border-b border-r border-ink" />

              <button
                onClick={skip}
                className="photo-frame block w-full rounded-t-[170px] border border-line-strong bg-paper-2 p-2 text-left"
                aria-label={phase === "swapped" ? "Portrait transition complete" : "Skip portrait transition"}
              >
                <div
                  className={`relative aspect-[4/5] overflow-hidden rounded-t-[160px] bg-paper-2 ${
                    phase === "scanning" ? "is-scanning" : ""
                  } ${phase === "swapped" ? "is-swapped" : ""}`}
                >
                  <Image
                    src="/images/chinmai-portrait.webp"
                    alt={`${profile.name} — portrait photograph`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 400px"
                    className="photo-img object-cover"
                  />
                  <span aria-hidden className="photo-scan" />

                  {/* pedestal where the SVG guide stands after the swap */}
                  <div
                    className={`absolute inset-x-0 bottom-0 flex flex-col items-center transition-opacity duration-700 ${
                      phase === "swapped" ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="char-fade-in is-on flex h-[190px] w-[76px] items-end justify-center" />
                    <div id="char-pedestal" className="relative h-[3px] w-24 rounded-full bg-line-strong" />
                    <p className="mt-1.5 pb-3 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-3">
                      guide online
                    </p>
                  </div>
                </div>
              </button>

              <figcaption className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
                <span>Fig. 01 — the person</span>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      phase === "swapped" ? "bg-signal animate-pulse-dot" : "bg-ink-3"
                    }`}
                  />
                  {phase === "photo" && `identity loading · ${seconds}s`}
                  {phase === "scanning" && "transcoding…"}
                  {phase === "swapped" && "web edition active"}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>

      {/* ------------------------- tech marquee ------------------------- */}
      <div className="relative border-t border-line" aria-hidden="true">
        <div className="flex overflow-hidden py-3.5">
          <div className="flex min-w-max animate-marquee items-center gap-8 pr-8">
            {[...MARQUEE, ...MARQUEE].map((tech, i) => (
              <span key={i} className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
                {tech}
                <span className="inline-block h-1 w-1 rounded-full bg-signal/70" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
