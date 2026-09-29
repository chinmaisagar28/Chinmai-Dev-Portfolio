"use client";

import { profile, socials } from "@/data/profile";
import { education } from "@/data/experience";
import { Reveal } from "@/effects/Reveal";

const FACTS = [
  { k: "Based in", v: "Avadi, Chennai — India" },
  { k: "Education", v: "BCA · University of Madras · 2024" },
  { k: "Focus", v: "Zoho ecosystem · React · Python" },
  { k: "Status", v: "Open to opportunities" },
];

export function About() {
  return (
    <section
      id="about"
      data-section="about"
      className="relative py-24 sm:py-32"
      aria-label="About Chinmai"
    >
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* sticky heading */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="mono-label">( 01 ) — About</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="display-2 mt-5">
                  The person
                  <br />
                  behind <span className="italic text-signal">the work</span>
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <div className="mt-8 hidden flex-col gap-3 lg:flex">
                  {FACTS.map((f) => (
                    <div key={f.k} className="flex items-baseline justify-between border-b border-line pb-2.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{f.k}</span>
                      <span className="text-right text-sm text-ink-2">{f.v}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* body */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <p className="body-lg">
                I&apos;m a developer from Chennai who grew from a BCA at DRBCCC
                College (University of Madras) into hands-on product work — most
                of it inside the <strong className="font-medium text-ink">Zoho ecosystem</strong>.
                Over the past year I&apos;ve customized Zoho CRM, built ERP-style
                modules in Zoho Creator, and written the Deluge functions that
                make business workflows run themselves instead of being run.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="body-lg mt-6">
                The thread through my work is <strong className="font-medium text-ink">connection</strong>:
                wiring Zoho Books into CRM so invoicing happens on its own,
                integrating Zoho APIs with external systems for real-time
                synchronization, and building the async pipeline behind an AI
                dress-advisor that handled 200 requests a minute. When something
                manual repeats twice, I start wondering why it repeats at all.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="body-lg mt-6">
                On the web side I work with <strong className="font-medium text-ink">React,
                JavaScript and Python</strong> — Redux, Context API, Tailwind,
                Node, Express and MongoDB behind them. I&apos;m comfortable
                letting AI tooling like Claude Code and Cursor accelerate the
                boring parts, as long as the thinking stays mine. Problem-solving
                first, tools second — everything else is implementation detail.
              </p>
            </Reveal>

            {/* mobile facts */}
            <Reveal delay={100}>
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 lg:hidden">
                {FACTS.map((f) => (
                  <div key={f.k} className="border-t border-line pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{f.k}</p>
                    <p className="mt-1.5 text-sm text-ink-2">{f.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* stats */}
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
              {profile.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 70} className="bg-paper">
                  <div className="flex h-full flex-col gap-1.5 p-5">
                    <span className="font-display text-3xl font-medium text-ink">{s.value}</span>
                    <span className="text-xs leading-snug text-ink-3">{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* education strip */}
            <Reveal delay={120}>
              <div className="mt-12">
                <p className="mono-label mb-5">Education</p>
                <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                  {education.map((e) => (
                    <div key={e.degree} className="bg-card p-5">
                      <p className="font-display text-lg font-medium leading-snug text-ink">{e.degree}</p>
                      <p className="mt-2 text-sm text-ink-2">
                        {e.institution}
                        {e.board ? ` · ${e.board}` : ""}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-ink-3">
                        {e.period} — {e.score}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-10 font-mono text-xs text-ink-3">
                Find the receipts —{" "}
                <a href={socials.github.url} target="_blank" rel="noopener noreferrer" className="u-link text-ink-2">
                  GitHub
                </a>{" "}
                ·{" "}
                <a href={socials.linkedin.url} target="_blank" rel="noopener noreferrer" className="u-link text-ink-2">
                  LinkedIn
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
