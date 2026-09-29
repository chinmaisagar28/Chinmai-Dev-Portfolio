"use client";

import { useEffect, useState } from "react";
import { navigation, profile } from "@/data/profile";
import { characterBus, scrollToSection } from "@/lib/bus";

/**
 * NAVBAR — fixed, paper-blur after scroll, scroll-spy underline.
 * Clicking a link scrolls immediately; the character follows in parallel
 * (spec §13 — navigation never waits for the animation).
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const line = window.scrollY + window.innerHeight * 0.45;
      let current = "hero";
      for (const item of navigation) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= line) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    characterBus.emit({ type: "navigate", section: id });
    scrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between">
          <button
            onClick={() => go("hero")}
            className="group flex items-center gap-2"
            aria-label="Back to top — Chinmai Sagar"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink font-display text-sm font-semibold text-paper transition-colors group-hover:bg-signal">
              {profile.monogram}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-2">
              Chinmai<span className="text-signal">.</span>Sagar
            </span>
          </button>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`group relative font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  active === item.id ? "text-signal" : "text-ink-2 hover:text-ink"
                }`}
              >
                <span className="mr-1 text-[9px] opacity-60">{item.index}</span>
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-signal transition-all duration-300 ${
                    active === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
            <button
              onClick={() => go("contact")}
              className="group flex items-center gap-2 rounded-full border border-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-all hover:bg-ink hover:text-paper"
            >
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" />
              Let&apos;s talk
            </button>
          </nav>

          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* mobile overlay menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-paper transition-all duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-2">Menu</span>
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <span className="h-px w-6 translate-y-[3.5px] rotate-45 bg-ink" />
            <span className="h-px w-6 -translate-y-[3.5px] -rotate-45 bg-ink" />
          </button>
        </div>
        <nav className="container-site flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
          {[{ id: "hero", label: "Home", index: "00" }, ...navigation].map((item, i) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="group flex items-baseline gap-4 border-b border-line py-4 text-left"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <span className="font-mono text-[11px] text-ink-3">{item.index}</span>
              <span className="font-display text-3xl font-medium text-ink transition-colors group-hover:text-signal">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="container-site pb-10">
          <a href={`mailto:${profile.email}`} className="font-mono text-xs text-ink-2">
            {profile.email}
          </a>
        </div>
      </div>
    </>
  );
}
