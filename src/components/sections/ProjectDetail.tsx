"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { logoUrl } from "@/lib/logos";

/**
 * PROJECT DETAIL (spec §34) — full-screen case-study overlay.
 * Overview · Problem · Approach · Implementation · Technology · Links · Result.
 * Nothing is invented: every claim traces back to the resumes.
 */
export function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const blocks = [
    { label: "Overview", text: project.caseStudy.overview },
    { label: "Problem", text: project.caseStudy.problem },
    { label: "Approach", text: project.caseStudy.approach },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      className="fixed inset-0 z-[80] overflow-y-auto bg-paper"
    >
      {/* top bar */}
      <div className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="container-site flex h-16 items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
            Case study <span className="text-signal">/</span> {project.index}
          </p>
          <button
            ref={closeRef}
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-full border border-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Close
            <span aria-hidden>✕</span>
          </button>
        </div>
      </div>

      <div className="container-site pb-24 pt-12">
        {/* header */}
        <p className="mono-label" style={{ color: project.accent }}>
          {project.category} · {project.role}
        </p>
        <h2 className="display-1 mt-4">{project.title}</h2>
        <p className="mt-4 max-w-2xl font-display text-xl italic text-ink-2">{project.tagline}</p>

        {/* hero image */}
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line-strong bg-card">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 1240px) 100vw, 1200px"
            className="object-cover object-top"
            priority
          />
        </div>

        {/* meta strip */}
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          <div className="bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Role</p>
            <p className="mt-2 text-sm text-ink">{project.role}</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Stack</p>
            <p className="mt-2 text-sm text-ink">{project.technologies.join(" · ")}</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Deployment</p>
            <p className="mt-2 text-sm text-ink">Zoho Catalyst — serverless</p>
          </div>
        </div>

        {/* narrative */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            {blocks.map((b) => (
              <div key={b.label}>
                <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
                  <span className="inline-block h-px w-8 bg-signal" />
                  {b.label}
                </h3>
                <p className="body-lg mt-4">{b.text}</p>
              </div>
            ))}

            <div>
              <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
                <span className="inline-block h-px w-8 bg-signal" />
                Implementation
              </h3>
              <ul className="mt-5 space-y-3">
                {project.caseStudy.implementation.map((step, i) => (
                  <li key={i} className="flex gap-4 text-[15px] leading-relaxed text-ink-2">
                    <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
                <span className="inline-block h-px w-8 bg-signal" />
                Result
              </h3>
              <p className="body-lg mt-4">{project.caseStudy.result}</p>
            </div>
          </div>

          {/* side rail */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-line bg-card p-6">
                <p className="mono-label">Technology</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => {
                    const key = tech.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const logo = logoUrl(key);
                    return (
                      <li
                        key={tech}
                        className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2"
                      >
                        {logo ? (
                          <img src={logo} alt="" width={12} height={12} loading="lazy" aria-hidden="true" />
                        ) : null}
                        {tech}
                      </li>
                    );
                  })}
                </ul>

                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-signal"
                  >
                    Open live site
                    <span aria-hidden>↗</span>
                  </a>
                )}
                <p className="mt-4 text-center font-mono text-[10px] leading-relaxed text-ink-3">
                  opens in a new tab — the real deployed product
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
