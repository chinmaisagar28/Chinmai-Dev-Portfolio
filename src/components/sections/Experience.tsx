"use client";

import { experience } from "@/data/experience";
import { Reveal } from "@/effects/Reveal";

/**
 * EXPERIENCE — interactive dark timeline (spec §28).
 * Line draws in, entries reveal, tool chips hover-lift.
 */
export function Experience() {
  return (
    <section
      id="experience"
      data-section="experience"
      className="relative bg-night py-24 text-cream sm:py-32"
      aria-label="Work experience"
    >
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="mono-label-dark">( 02 ) — Experience</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="display-2 mt-5 text-cream">
                  Where I&apos;ve
                  <br />
                  <span className="italic text-signal">shipped</span>
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-7 max-w-xs text-sm leading-relaxed text-cream-2">
                  Two internships, one constant: making systems behave the way
                  the business actually works.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="relative lg:col-span-7 lg:col-start-6">
            {/* timeline spine */}
            <span
              aria-hidden
              className="absolute bottom-6 left-[7px] top-2 w-px origin-top bg-cream/20"
              style={{ animation: "draw-line 1.4s cubic-bezier(0.22,0.61,0.36,1) both" }}
            />

            <ol className="space-y-16">
              {experience.map((job, i) => (
                <li key={job.company} className="relative pl-10">
                  {/* node */}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 ${
                      i === 0 ? "border-signal bg-night" : "border-cream/40 bg-night"
                    }`}
                  />
                  <Reveal>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="font-display text-2xl font-medium text-cream sm:text-[1.7rem]">
                        {job.role}
                      </h3>
                      <time className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-3">
                        {job.period}
                      </time>
                    </div>
                    <p className="mt-1.5 font-mono text-xs uppercase tracking-[0.16em] text-signal">
                      {job.company}
                      <span className="ml-3 text-cream-3">{job.kind}</span>
                    </p>
                  </Reveal>

                  <Reveal delay={90}>
                    <ul className="mt-5 space-y-3">
                      {job.points.map((point, j) => (
                        <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-cream-2">
                          <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-signal/80" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={140}>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-cream/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cream-2 transition-colors hover:border-signal hover:text-cream"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
