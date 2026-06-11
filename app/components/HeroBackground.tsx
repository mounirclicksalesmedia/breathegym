"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const GRID = 44; // grid cell size in px
const BEAM_LEN = 88;

// Column fraction + vertical placement + timing for each falling beam.
const BEAMS = [
  { frac: 0.08, top: 0, duration: 3.5, repeatDelay: 5, delay: 2 },
  { frac: 0.18, top: GRID * 10, duration: 3.5, repeatDelay: 10, delay: 4 },
  { frac: 0.32, top: GRID * 2, duration: 4, repeatDelay: 6, delay: 1 },
  { frac: 0.74, top: GRID * 7, duration: 2.5, repeatDelay: 7.5, delay: 3.5 },
  { frac: 0.62, top: 0, duration: 3, repeatDelay: 3, delay: 1 },
  { frac: 0.92, top: GRID * 3, duration: 5, repeatDelay: 5, delay: 5 },
];

export function HeroBackground() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const beams = gsap.utils.toArray<HTMLElement>(".hero-beam");

      // snap each beam to a grid column for the current viewport width
      const placeBeams = () => {
        const w = window.innerWidth;
        beams.forEach((el, i) => {
          gsap.set(el, { left: Math.floor((w * BEAMS[i].frac) / GRID) * GRID });
        });
      };
      placeBeams();

      gsap.set(".hero-glow", { xPercent: -50 });

      if (reduce) {
        gsap.set(".hero-grid", { opacity: 1 });
        gsap.set(".hero-glow", { opacity: 0.35 });
        return;
      }

      gsap.fromTo(".hero-grid", { opacity: 0 }, { opacity: 1, duration: 2.5, ease: "sine.inOut" });

      // slowly breathing rose glow
      gsap.fromTo(
        ".hero-glow",
        { opacity: 0.3, scale: 0.9 },
        { opacity: 0.55, scale: 1.05, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 }
      );

      beams.forEach((el, i) => {
        const b = BEAMS[i];
        const half = b.duration / 2;
        gsap
          .timeline({ repeat: -1, repeatDelay: b.repeatDelay, delay: b.delay })
          .fromTo(el, { y: 0 }, { y: GRID * 9, duration: b.duration, ease: "sine.inOut" }, 0)
          .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: half, ease: "sine.in" }, 0)
          .to(el, { autoAlpha: 0, duration: half, ease: "sine.out" }, half);
      });

      window.addEventListener("resize", placeBeams);
      return () => window.removeEventListener("resize", placeBeams);
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      style={{ opacity: 0.55 }}
    >
      {/* soft, slowly breathing rose glow */}
      <div
        className="hero-glow absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(206,132,133,0.35) 0%, rgba(206,132,133,0.12) 40%, transparent 70%)",
          opacity: 0.3,
        }}
      />
      <div
        className="hero-grid absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44' width='44' height='44' fill='none' stroke-width='1.4' stroke='rgb(206 132 133 / 0.5)'%3e%3cpath d='M0 .5H43.5V44'/%3e%3c/svg%3e\")",
          // fade the grid out toward the centre/bottom so it reads as a soft
          // ambient texture rather than a hard graph-paper sheet
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 85%)",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 85%)",
        }}
      />
      {BEAMS.map((b, i) => (
        <div
          key={i}
          className="hero-beam absolute w-px bg-gradient-to-b from-brand/0 to-brand opacity-0"
          style={{ top: b.top, height: BEAM_LEN }}
        />
      ))}
    </div>
  );
}
