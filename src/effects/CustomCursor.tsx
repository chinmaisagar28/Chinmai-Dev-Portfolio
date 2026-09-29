"use client";

import { useEffect, useRef } from "react";
import { getPerfMode } from "@/lib/perf";

/**
 * CUSTOM CURSOR (spec §24) — small red dot + trailing ring, desktop only.
 * - Activates only with (hover:hover) and (pointer:fine).
 * - Ring lerps behind the dot; expands over interactive elements.
 * - Low-end devices keep the dot but skip the ring trail.
 */

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const perf = getPerfMode();
    if (!perf.finePointer || perf.reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let down = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement | null;
      hovering = !!t?.closest("a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']");
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      const ringSize = hovering ? 46 : 30;
      const ringOpacity = hovering ? 0.9 : 0.5;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${down ? 0.7 : 1})`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%) scale(${ringSize / 30})`;
      ring.style.opacity = String(ringOpacity);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-[30px] w-[30px] rounded-full border border-signal opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-signal opacity-0"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
