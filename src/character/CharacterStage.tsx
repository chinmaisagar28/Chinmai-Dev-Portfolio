"use client";

import { useEffect, useRef } from "react";
import { CharacterSVG } from "./CharacterSVG";
import { characterController } from "./controller";

/**
 * CHARACTER STAGE — fixed, pointer-transparent overlay hosting the guide.
 * The site renders and functions perfectly without this component
 * (spec §42: if anything fails, it simply stays invisible).
 */
export function CharacterStage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      characterController.mount(el);
    } catch {
      return; // silent fallback — content always wins
    }
    return () => {
      try {
        characterController.unmount();
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="char-stage"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <CharacterSVG className="h-full w-full" />
    </div>
  );
}
