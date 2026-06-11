"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Thin brand progress bar across the top of the page, scrubbed to scroll. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3, invalidateOnRefresh: true },
      }
    );
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="scroll-progress fixed inset-x-0 top-0 z-[70] h-[3px] bg-gradient-to-r from-brand-200 via-brand to-brand-700"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
