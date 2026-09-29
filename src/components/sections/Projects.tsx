"use client";

import { useState } from "react";
import Image from "next/image";
import { projects, type Project } from "@/data/projects";
import { logoUrl } from "@/lib/logos";
import { characterBus } from "@/lib/bus";
import { Reveal } from "@/effects/Reveal";
import { ProjectDetail } from "./ProjectDetail";

/**
 * PROJECT SYSTEM (spec §32–34) — fully data-driven. Each entry in
 * src/data/projects.ts renders as an asymmetric editorial card; clicking
 * opens the full-screen case study. Adding a project = adding one object.
 */
export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = projects.find((p) => p.id === openId) ?? null;

  const open = (p: Project) => {
    setOpenId(p.id);
    characterBus.emit({ type: "projectOpen" });
  };
  const close = () => {
    setOpenId(null);
    characterBus.emit({ type: "projectClose" });
  };

  return (
    <section
      id="projects"
      data-section="projects"
      className="relative border-t border-line bg-paper-2/50 py-24 sm:py-32"
      aria-label="Selected projects"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="mono-label">( 05 ) — Projects</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-2 mt-5">
                Built &amp; <span className="italic text-signal">deployed</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p className="max-w-xs text-sm leading-relaxed text-ink-2">
              Both products below are live — no mockups, no dead links. Click
              one for the full case study.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 space-y-24">
          {projects.map((project, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={project.id}
                id={`project-card-${i}`}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10"
                onMouseEnter={() => characterBus.emit({ type: "projectHover", index: i })}
                onMouseLeave={() => characterBus.emit({ type: "projectHover", index: null })}
              >
                {/* figure */}
                <Reveal
                  variant="scale"
                  className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                >
                  <button
                    onClick={() => open(project)}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-line-strong bg-card text-left"
                    aria-label={`Open case study — ${project.title}`}
                    data-cursor="hover"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                    <span
                      className="absolute left-5 top-5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper"
                      style={{ backgroundColor: project.accent }}
                    >
                      {project.category}
                    </span>
                    <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-paper font-display text-lg text-ink shadow-lg transition-all duration-300 group-hover:bg-signal group-hover:text-paper">
                      →
                    </span>
                  </button>
                </Reveal>

                {/* meta */}
                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <Reveal delay={60}>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-ink-3">
                      {project.index} <span className="mx-1 text-signal">/</span> {String(projects.length).padStart(2, "0")}
                    </p>
                  </Reveal>
                  <Reveal delay={100}>
                    <h3 className="display-3 mt-3">{project.title}</h3>
                  </Reveal>
                  <Reveal delay={140}>
                    <p className="mt-2 font-display text-lg italic text-ink-2">{project.tagline}</p>
                  </Reveal>
                  <Reveal delay={180}>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                      {project.description}
                    </p>
                  </Reveal>
                  <Reveal delay={220}>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies used">
                      {project.technologies.map((tech) => {
                        const key = tech.toLowerCase().replace(/[^a-z0-9]/g, "");
                        const logo =
                          logoUrl(key) ??
                          (key.includes("opencv") ? logoUrl("opencv") : null);
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
                  </Reveal>
                  <Reveal delay={260}>
                    <div className="mt-7 flex flex-wrap items-center gap-5">
                      <button
                        onClick={() => open(project)}
                        className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink"
                      >
                        <span className="u-link">Case study</span>
                        <span className="text-signal transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </button>
                      {project.liveDemo && (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 transition-colors hover:text-ink"
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          Live site
                        </a>
                      )}
                    </div>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {openProject && <ProjectDetail project={openProject} onClose={close} />}
    </section>
  );
}
