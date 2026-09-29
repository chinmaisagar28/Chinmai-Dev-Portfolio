"use client";

import { useState } from "react";
import { constellationEdges, constellationNodes, techGroups } from "@/data/technologies";
import { logoUrl } from "@/lib/logos";
import { Reveal } from "@/effects/Reveal";

/**
 * TECHNOLOGY ECOSYSTEM (spec §30) — a constellation of the primary stack
 * (visual nodes, hover-lit edges) plus honest grouped lists with icons.
 * Only technologies confirmed by the resumes appear here.
 */

function TechIcon({ logo, name, size = 18 }: { logo?: string | null; name: string; size?: number }) {
  const url = logoUrl(logo);
  if (!url) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full border border-current font-mono text-[8px] font-medium"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      aria-hidden="true"
      className="opacity-80"
    />
  );
}

export function TechStack() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const litSet = new Set<string>();
  if (activeNode) {
    litSet.add(activeNode);
    for (const [a, b] of constellationEdges) {
      if (a === activeNode) litSet.add(b);
      if (b === activeNode) litSet.add(a);
    }
  }

  return (
    <section
      id="stack"
      data-section="stack"
      className="relative py-24 sm:py-32"
      aria-label="Technology stack"
    >
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="mono-label">( 04 ) — Technical Stack</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="display-2 mt-5">
                  Tools I
                  <br />
                  <span className="italic text-signal">actually use</span>
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-7 max-w-xs text-sm leading-relaxed text-ink-2">
                  A constellation, not a checklist — the primary nodes connect
                  to each other the way they connect in my projects.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            {/* ---------------- constellation (desktop) ---------------- */}
            <Reveal variant="scale">
              <div className="constellation relative mb-12 hidden rounded-2xl border border-line bg-card/60 md:block">
                <svg viewBox="0 0 520 420" className="h-auto w-full" aria-hidden="true">
                  {constellationEdges.map(([a, b]) => {
                    const na = constellationNodes.find((n) => n.id === a)!;
                    const nb = constellationNodes.find((n) => n.id === b)!;
                    const lit = activeNode === a || activeNode === b;
                    return (
                      <line
                        key={`${a}-${b}`}
                        x1={na.x}
                        y1={na.y}
                        x2={nb.x}
                        y2={nb.y}
                        className={`c-edge ${lit ? "lit" : ""}`}
                      />
                    );
                  })}
                  {constellationNodes.map((node, i) => {
                    const url = logoUrl(node.logo);
                    return (
                      <g
                        key={node.id}
                        className={`c-node ${activeNode === node.id ? "active" : ""}`}
                        onMouseEnter={() => setActiveNode(node.id)}
                        onMouseLeave={() => setActiveNode(null)}
                        style={{ animation: `floaty ${6 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` }}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.primary ? 26 : 21}
                          className={activeNode && !litSet.has(node.id) ? "fill-paper opacity-40" : "fill-card"}
                          stroke={activeNode === node.id ? "#d9482b" : "rgba(27,21,17,0.25)"}
                          strokeWidth="1"
                        />
                        {url ? (
                          <image
                            href={url}
                            x={node.x - 11}
                            y={node.y - 11}
                            width="22"
                            height="22"
                            style={{ color: "#1b1511" }}
                          />
                        ) : (
                          <text
                            x={node.x}
                            y={node.y + 4}
                            textAnchor="middle"
                            className="fill-ink font-mono"
                            fontSize="9"
                          >
                            {node.name.slice(0, 2).toUpperCase()}
                          </text>
                        )}
                        <text
                          x={node.x}
                          y={node.y + (node.primary ? 42 : 37)}
                          textAnchor="middle"
                          className="pointer-events-none fill-ink-2"
                          fontSize="10.5"
                          fontFamily="var(--font-jbmono), monospace"
                          letterSpacing="0.5"
                        >
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </Reveal>

            {/* ---------------- grouped lists ---------------- */}
            <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {techGroups.map((group, gi) => (
                <Reveal key={group.id} delay={gi * 70} className="bg-card">
                  <div className="flex h-full flex-col p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl font-medium text-ink">{group.title}</h3>
                      <span className="font-mono text-[10px] text-ink-3">0{gi + 1}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                      {group.caption}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item.name}
                          className="group flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-ink hover:text-ink"
                        >
                          <span className="text-ink transition-colors group-hover:text-signal">
                            <TechIcon logo={item.logo} name={item.name} size={14} />
                          </span>
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <p className="mt-6 font-mono text-[11px] leading-relaxed text-ink-3">
                + core concepts the resumes list: OOP · component-driven
                architecture · asynchronous programming · API integration ·
                debugging.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
