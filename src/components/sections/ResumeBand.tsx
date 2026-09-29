"use client";

import { profile, resumePath } from "@/data/profile";
import { characterBus } from "@/lib/bus";
import { Reveal } from "@/effects/Reveal";

/**
 * RESUME — slim band (spec: Resume in primary IA). The served PDF is the
 * newest resume (Zoho Developer V2) converted losslessly.
 */
export function ResumeBand() {
  const go = (id: string) => {
    characterBus.emit({ type: "navigate", section: id });
  };

  return (
    <section
      id="resume"
      data-section="resume"
      className="relative border-t border-line py-20 sm:py-24"
      aria-label="Resume download"
    >
      <div className="container-site">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="mono-label">( 06 ) — Resume</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-2 mt-4">
                Prefer reading the <span className="italic text-signal">original?</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-2">
                Everything on this page traces back to it — internships, Zoho
                work, projects, education. Freshly formatted, one page of truth.
              </p>
            </Reveal>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <Reveal delay={100}>
              <div className="flex flex-wrap gap-3">
                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-signal"
                >
                  View PDF
                  <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↗</span>
                </a>
                <a
                  href={resumePath}
                  download="Chinmai-Sagar-Resume.pdf"
                  className="rounded-full border border-line-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  Download
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* contact shortcut strip */}
        <Reveal delay={160}>
          <button
            onClick={() => {
              go("contact");
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-12 flex w-full items-center justify-between rounded-2xl border border-line bg-card px-6 py-5 text-left transition-colors hover:border-ink"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal font-display text-sm font-semibold text-paper">
                {profile.monogram}
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">Rather just talk?</span>
                <span className="block font-mono text-[11px] text-ink-3">{profile.email}</span>
              </span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">
              Contact <span aria-hidden className="ml-1 text-signal">→</span>
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
