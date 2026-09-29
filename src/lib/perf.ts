/**
 * PERFORMANCE MODE — computed once on the client.
 * Detects low-end hardware / constrained connections so heavy effects
 * (character travel, mouse-follow, particles) can degrade gracefully.
 */

export interface PerfMode {
  /** low-end device: reduce node counts, disable travel + mouse-follow */
  low: boolean;
  /** touch / small screen */
  mobile: boolean;
  /** prefers-reduced-motion */
  reducedMotion: boolean;
  /** fine pointer available (custom cursor only here) */
  finePointer: boolean;
  /** server render or first pass — effects not yet decided */
  ready: boolean;
}

function detect(): PerfMode {
  if (typeof window === "undefined") {
    return { low: false, mobile: false, reducedMotion: false, finePointer: false, ready: false };
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
    (nav.maxTouchPoints ?? 0) === 0; // headless/desktops without touch still count as fine
  const touchPrimary = (nav.maxTouchPoints ?? 0) > 0 && !window.matchMedia("(pointer: fine)").matches;
  const mobile = touchPrimary || window.innerWidth < 768;
  /* spec §18: an i5 8th-gen laptop (4 cores) should still get the full
     experience — "low" is reserved for genuinely constrained devices */
  const low = cores <= 2 || mem <= 2 || saveData;

  return { low, mobile, reducedMotion, finePointer, ready: true };
}

let cached: PerfMode | null = null;

export function getPerfMode(): PerfMode {
  if (!cached) cached = detect();
  return cached;
}

/** Node count for the network canvas, by capability. */
export function networkNodeCount(perf: PerfMode): number {
  if (perf.reducedMotion) return 30; // static frame
  if (perf.low) return 26;
  if (perf.mobile) return 30;
  return 64;
}
