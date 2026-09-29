"use client";

import { useEffect, useRef, useState } from "react";
import { zohoEdges, zohoIntro, zohoNodes } from "@/data/zoho";
import { Reveal } from "@/effects/Reveal";

/**
 * ZOHO ECOSYSTEM (spec §29) — interactive hub-spoke diagram.
 * Only products supported by the resumes. Hover/tap a node to see the
 * actual work behind it; auto-cycles gently until first interaction.
 */
export function ZohoEcosystem() {
  const [activeId, setActiveId] = useState("deluge");
  const [interacted, setInteracted] = useState(false);
  const timer = useRef<number | null>(null);

  /* gentle auto-cycle until the visitor takes over */
  useEffect(() => {
    if (interacted) return;
    timer.current = window.setInterval(() => {
      setActiveId((prev) => {
        const idx = zohoNodes.findIndex((n) => n.id === prev);
        return zohoNodes[(idx + 1) % zohoNodes.length].id;
      });
    }, 3200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [interacted]);

  const select = (id: string) => {
    setInteracted(true);
    setActiveId(id);
  };

  const active = zohoNodes.find((n) => n.id === activeId) ?? zohoNodes[2];

  return (
    <section
      id="zoho"
      data-section="zoho"
      className="relative border-t border-cream/10 bg-night py-24 text-cream sm:py-32"
      aria-label="Zoho ecosystem"
    >
      <div className="container-site">
        <div className="max-w-2xl">
          <Reveal>
            <p className="mono-label-dark">( 03 ) — Zoho Ecosystem</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-2 mt-5 text-cream">
              One ecosystem,
              <br />
              <span className="italic text-signal">wired end to end</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 text-base leading-relaxed text-cream-2">{zohoIntro}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-12">
          {/* ---------------- diagram ---------------- */}
          <Reveal className="lg:col-span-7" variant="scale">
            <div
              className="relative mx-auto hidden aspect-[10/9] w-full max-w-[560px] md:block"
              onMouseEnter={() => setInteracted(true)}
              onTouchStart={() => setInteracted(true)}
            >
              {/* connection lines */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {zohoEdges.map(([a, b]) => {
                  const na = zohoNodes.find((n) => n.id === a)!;
                  const nb = zohoNodes.find((n) => n.id === b)!;
                  const lit = a === activeId || b === activeId;
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={na.x}
                      y1={na.y}
                      x2={nb.x}
                      y2={nb.y}
                      className={`zoho-edge ${lit ? "lit" : ""}`}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>

              {zohoNodes.map((node) => {
                const isActive = node.id === activeId;
                return (
                  <button
                    key={node.id}
                    onClick={() => select(node.id)}
                    onMouseEnter={() => select(node.id)}
                    className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-pressed={isActive}
                    aria-label={`${node.name} — ${node.detail}`}
                  >
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border font-mono text-[11px] font-medium uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? "scale-110 border-signal bg-signal/15 text-cream shadow-[0_0_0_4px_rgba(217,72,43,0.12)]"
                          : "border-cream/25 bg-night text-cream-2 group-hover:border-cream/50 group-hover:text-cream"
                      }`}
                      style={isActive ? { borderColor: node.color, color: "#f2ede3" } : { color: node.color }}
                    >
                      {node.short}
                    </span>
                    <span
                      className={`whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors ${
                        isActive ? "text-cream" : "text-cream-3"
                      }`}
                    >
                      {node.name}
                    </span>
                  </button>
                );
              })}

              {/* orbit hint */}
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.24em] text-cream-3">
                hover a node — every link is real work
              </p>
            </div>

            {/* mobile chip grid */}
            <div className="grid grid-cols-2 gap-2.5 md:hidden">
              {zohoNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => select(node.id)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    node.id === activeId ? "border-signal bg-signal/10" : "border-cream/20"
                  }`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[9px] font-medium uppercase"
                    style={{ backgroundColor: `${node.color}26`, color: node.color }}
                  >
                    {node.short}
                  </span>
                  <span className="text-xs font-medium text-cream">{node.name}</span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* ---------------- detail panel ---------------- */}
          <Reveal delay={120} className="lg:col-span-5">
            <div className="rounded-2xl border border-cream/15 bg-night-2/60 p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: active.color }}
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3">
                  {active.kind === "core" ? "Core skill" : active.kind === "practice" ? "Practice" : "Product"}
                </p>
              </div>
              <h3 className="mt-4 font-display text-3xl font-medium text-cream">{active.name}</h3>
              <p className="mt-1.5 text-sm text-signal">{active.detail}</p>
              <blockquote className="mt-6 border-l-2 border-signal/70 pl-5 text-[15px] leading-relaxed text-cream-2">
                {active.evidence}
              </blockquote>
              <div className="mt-8 flex items-center gap-2.5 border-t border-cream/10 pt-6">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" />
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-3">
                  1+ year hands-on · ERP modules in production
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
