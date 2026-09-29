/**
 * CHARACTER BUS — a tiny imperative pub/sub so any client component can talk
 * to the character controller without prop drilling or re-renders.
 * Events are fire-and-forget; the controller decides how (or whether) to react.
 */

export type CharacterEvent =
  | { type: "reveal" }                       // photo → character transition done in hero
  | { type: "section"; section: string }     // active section changed
  | { type: "navigate"; section: string }    // user clicked a nav item
  | { type: "projectHover"; index: number | null }
  | { type: "projectOpen" }
  | { type: "projectClose" }
  | { type: "formFocus"; field: string | null }
  | { type: "formSend" }
  | { type: "formSuccess" }
  | { type: "formError" };

type Listener = (e: CharacterEvent) => void;

const listeners = new Set<Listener>();

export const characterBus = {
  emit(e: CharacterEvent) {
    listeners.forEach((fn) => fn(e));
  },
  on(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  off(fn: Listener) {
    listeners.delete(fn);
  },
};

/**
 * SECTION → CHARACTER STAGING.
 * Each section declares where the character should stand and what it should do.
 * side: which margin the character occupies; pose: base pose while there.
 */
export const sectionStaging: Record<
  string,
  { side: "left" | "right"; pose: string; label?: string }
> = {
  hero: { side: "right", pose: "hero", label: "hero" },
  about: { side: "right", pose: "think", label: "reading" },
  experience: { side: "left", pose: "pointRight", label: "pointing" },
  zoho: { side: "right", pose: "inspect", label: "observing" },
  stack: { side: "right", pose: "pointLeft", label: "pointing" },
  projects: { side: "left", pose: "pointRight", label: "presenting" },
  resume: { side: "left", pose: "wave", label: "waving" },
  contact: { side: "left", pose: "guide", label: "guiding" },
};

/** Smooth-scroll helper shared by nav + buttons. Instant under reduced motion. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}
