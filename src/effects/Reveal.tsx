"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * SCROLL REVEAL — IntersectionObserver adds .is-inview once; CSS does the rest.
 * One observer per element, disconnected after reveal (zero ongoing cost).
 */

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number; // ms
  variant?: "up" | "scale";
  id?: string;
}

export function Reveal({ children, as: Tag = "div", className = "", delay = 0, variant = "up", id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-inview");
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <Tag
      ref={ref}
      id={id}
      className={`${variant === "scale" ? "reveal-scale" : "reveal"} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
