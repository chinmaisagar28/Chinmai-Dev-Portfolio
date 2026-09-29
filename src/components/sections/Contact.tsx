"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { profile, socials } from "@/data/profile";
import { characterBus } from "@/lib/bus";
import { Reveal } from "@/effects/Reveal";

/**
 * CONTACT (spec §35–38) — functional form with honest states.
 * Success message renders ONLY after the backend confirms (HTTP 200).
 * Security lives server-side (see /api/contact): honeypot, rate limiting,
 * input sanitization, attachment validation. Frontend checks are UX, not trust.
 */

const ALLOWED_TYPES = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".zip"];
const MAX_MB = 5;

type Status = "idle" | "sending" | "success" | "error";

const FIELDS = [
  { id: "name", label: "Name", type: "text", placeholder: "Your name", required: true, half: true },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true, half: true },
  { id: "subject", label: "Subject", type: "text", placeholder: "What's this about?", required: true, half: false },
] as const;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [clock, setClock] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(Date.now());

  /* small Chennai clock — the site is alive */
  useEffect(() => {
    const update = () => {
      setClock(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: profile.timezone,
          hour12: false,
        }).format(new Date())
      );
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFileError("");
    if (!f) {
      setFile(null);
      return;
    }
    const ext = `.${f.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!ALLOWED_TYPES.includes(ext)) {
      setFileError(`Allowed: ${ALLOWED_TYPES.join(", ")}`);
      e.target.value = "";
      setFile(null);
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`Max ${MAX_MB}MB — yours is ${(f.size / 1024 / 1024).toFixed(1)}MB`);
      e.target.value = "";
      setFile(null);
      return;
    }
    setFile(f);
  };

  const onFocus = (e: FocusEvent<HTMLElement>) => {
    const field = e.target.id.replace("contact-field-", "");
    characterBus.emit({ type: "formFocus", field });
  };
  const onBlur = () => characterBus.emit({ type: "formFocus", field: null });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = formRef.current;
    if (!form) return;

    characterBus.emit({ type: "formSend" });
    setStatus("sending");
    setErrorMsg("");

    try {
      const fd = new FormData(form);
      if (file) fd.set("attachment", file);
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || `Server responded ${res.status}`);
      }
      setStatus("success");
      characterBus.emit({ type: "formSuccess" });
      form.reset();
      setFile(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      characterBus.emit({ type: "formError" });
    }
  };

  return (
    <section
      id="contact"
      data-section="contact"
      className="relative bg-night py-24 text-cream sm:py-32"
      aria-label="Contact"
    >
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* left rail */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="mono-label-dark">( 07 ) — Contact</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-2 mt-5 text-cream">
                Let&apos;s build
                <br />
                <span className="italic text-signal">something.</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-cream-2">
                A role, a Zoho problem, a web idea — or just a question about
                this site. Messages land directly with me, attachments welcome.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 space-y-4">
                <a
                  href={socials.email.url}
                  className="group flex items-center justify-between border-b border-cream/15 pb-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3">Email</span>
                  <span className="u-link font-mono text-sm text-cream">{profile.email}</span>
                </a>
                <a
                  href={socials.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border-b border-cream/15 pb-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3">LinkedIn</span>
                  <span className="u-link font-mono text-sm text-cream">chinmai-sagar</span>
                </a>
                <a
                  href={socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border-b border-cream/15 pb-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3">GitHub</span>
                  <span className="u-link font-mono text-sm text-cream">@chinmaisagar28</span>
                </a>
                <div className="flex items-center justify-between border-b border-cream/15 pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3">Chennai</span>
                  <span className="font-mono text-sm text-cream">{clock} IST</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-8 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-3">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                Open to opportunities
              </p>
            </Reveal>
          </div>

          {/* form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={120} variant="scale">
              {status === "success" ? (
                <div className="flex min-h-[420px] flex-col items-start justify-center rounded-2xl border border-cream/15 bg-night-2/60 p-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal font-display text-2xl text-paper">✓</span>
                  <h3 className="mt-6 font-display text-3xl font-medium text-cream">Message sent successfully.</h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-cream-2">
                    It&apos;s stored and on its way to my inbox. I usually reply
                    within a day — thanks for reaching out.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full border border-cream/30 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition-colors hover:border-cream hover:bg-cream hover:text-night"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={submit}
                  className="rounded-2xl border border-cream/15 bg-night-2/60 p-7 sm:p-9"
                  noValidate={false}
                >
                  {/* honeypot — invisible to humans */}
                  <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Company website
                      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {FIELDS.map((f) => (
                      <div key={f.id} className={f.half ? "" : "sm:col-span-2"}>
                        <label
                          htmlFor={`contact-field-${f.id}`}
                          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3"
                        >
                          {f.label} {f.required && <span className="text-signal">*</span>}
                        </label>
                        <input
                          id={`contact-field-${f.id}`}
                          name={f.id}
                          type={f.type}
                          required={f.required}
                          placeholder={f.placeholder}
                          maxLength={f.id === "subject" ? 120 : 80}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          className="w-full rounded-lg border border-cream/20 bg-night px-4 py-3 text-[15px] text-cream placeholder:text-cream-3/60 focus:border-signal focus:outline-none"
                        />
                      </div>
                    ))}

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="contact-field-message"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3"
                      >
                        Message <span className="text-signal">*</span>
                      </label>
                      <textarea
                        id="contact-field-message"
                        name="message"
                        required
                        rows={5}
                        maxLength={5000}
                        placeholder="Tell me what you're thinking…"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        className="w-full resize-y rounded-lg border border-cream/20 bg-night px-4 py-3 text-[15px] text-cream placeholder:text-cream-3/60 focus:border-signal focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="contact-field-attachment"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream-3"
                      >
                        Attachment <span className="text-cream-3/70">(optional)</span>
                      </label>
                      <label
                        htmlFor="contact-field-attachment"
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-cream/25 bg-night px-4 py-3.5 transition-colors hover:border-cream/50"
                        onFocus={onFocus}
                        onBlur={onBlur}
                      >
                        <span className="text-sm text-cream-2">
                          {file ? file.name : "PDF, DOC, DOCX, PNG, JPG, ZIP — max 5MB"}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                          {file ? "Replace" : "Browse"}
                        </span>
                      </label>
                      <input
                        id="contact-field-attachment"
                        type="file"
                        name="attachment"
                        accept={ALLOWED_TYPES.join(",")}
                        onChange={onFile}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        className="sr-only"
                      />
                      {fileError && (
                        <p className="mt-2 font-mono text-[11px] text-signal">{fileError}</p>
                      )}
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="mt-6 rounded-lg border border-signal/40 bg-signal/10 px-4 py-3">
                      <p className="text-sm text-cream">
                        Something went wrong. Please try again or email me directly.
                      </p>
                      {errorMsg && <p className="mt-1 font-mono text-[11px] text-cream-3">{errorMsg}</p>}
                      <a href={socials.email.url} className="mt-2 inline-block u-link font-mono text-xs text-signal">
                        {profile.email}
                      </a>
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <p className="font-mono text-[10px] leading-relaxed text-cream-3">
                      Validated &amp; rate-limited server-side.
                      <br />
                      Your details are never shared.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group flex items-center gap-2.5 rounded-full bg-signal px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-all hover:bg-signal-deep disabled:cursor-wait disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending…" : "Send message"}
                      {status !== "sending" && (
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
