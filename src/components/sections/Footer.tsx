"use client";

import { profile } from "@/data/profile";
import { characterBus, scrollToSection } from "@/lib/bus";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-night pb-10 pt-12 text-cream">
      <div className="container-site">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cream font-display text-sm font-semibold text-night">
              {profile.monogram}
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em]">{profile.name}</p>
              <p className="mt-0.5 font-mono text-[10px] text-cream-3">
                © {new Date().getFullYear()} — all systems operational
              </p>
            </div>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-3">
            Designed &amp; engineered with intent · Next.js · the guide SVG is hand-drawn, not generated
          </p>

          <button
            onClick={() => {
              characterBus.emit({ type: "navigate", section: "hero" });
              scrollToSection("hero");
            }}
            className="group flex items-center gap-2 rounded-full border border-cream/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-2 transition-colors hover:border-cream hover:text-cream"
            aria-label="Back to top"
          >
            Back to top
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
