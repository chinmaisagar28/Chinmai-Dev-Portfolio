"use client";

import { useEffect, useRef } from "react";
import { getPerfMode, networkNodeCount } from "@/lib/perf";

/**
 * INTERACTIVE NETWORK BACKGROUND (spec §21–23).
 * Single fixed <canvas>, sparse drifting nodes, short links, cursor influence
 * with a bounded radius. Pauses when the tab is hidden. Static single frame
 * under reduced motion. Node count adapts to device capability.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number; // cursor-offset (lerped)
  oy: number;
  r: number;
  signal: boolean; // rare red node
}

export function InteractiveNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const perf = getPerfMode();
    const reduced = perf.reducedMotion;
    const low = perf.low;
    const isMobile = perf.mobile;
    const COUNT = networkNodeCount(perf);

    const INFLUENCE = isMobile ? 0 : 150; // no cursor physics on touch
    const LINK_DIST = isMobile ? 110 : 135;
    const DPR = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);

    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const ink = "27, 21, 17";
    const red = "217, 72, 43";

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.floor(W * DPR);
      canvas!.height = Math.floor(H * DPR);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    }

    function seed() {
      nodes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        ox: 0,
        oy: 0,
        r: Math.random() * 1.3 + 0.7,
        signal: Math.random() < 0.08,
      }));
    }

    function step() {
      /* smooth the virtual cursor */
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      ctx!.clearRect(0, 0, W, H);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;

        /* cursor influence — bounded radius, smooth return */
        if (INFLUENCE > 0) {
          const dx = n.x + n.ox - mouse.x;
          const dy = n.y + n.oy - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < INFLUENCE * INFLUENCE && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / INFLUENCE) * 14;
            n.ox += (dx / d) * force * 0.06;
            n.oy += (dy / d) * force * 0.06;
          }
          n.ox *= 0.94;
          n.oy *= 0.94;
        }
      }

      /* links */
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x + a.ox - (b.x + b.ox);
          const dy = a.y + a.oy - (b.y + b.oy);
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.14;
            ctx!.strokeStyle = `rgba(${ink}, ${alpha.toFixed(3)})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x + a.ox, a.y + a.oy);
            ctx!.lineTo(b.x + b.ox, b.y + b.oy);
            ctx!.stroke();
          }
        }
      }

      /* nodes */
      for (const n of nodes) {
        ctx!.beginPath();
        ctx!.fillStyle = n.signal ? `rgba(${red}, 0.55)` : `rgba(${ink}, 0.28)`;
        ctx!.arc(n.x + n.ox, n.y + n.oy, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop() {
      if (!running) return;
      step();
      raf = requestAnimationFrame(loop);
    }

    function onMouse(e: MouseEvent) {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    }

    resize();
    window.addEventListener("resize", resize);
    if (!isMobile) window.addEventListener("mousemove", onMouse, { passive: true });

    if (reduced || low) {
      /* static, calm frame — no continuous animation */
      step();
    } else {
      /* pause entirely when tab is hidden (spec §23) */
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(raf);
        } else if (!reduced && !low) {
          running = true;
          loop();
        }
      });
      loop();
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
