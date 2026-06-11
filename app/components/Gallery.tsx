"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";
import { SectionHeading } from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();
  const g = content.gallery;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.utils.toArray<HTMLElement>(".gal-img").forEach((el) => {
        const inner = el.querySelector("img");
        if (!inner) return;
        // scale lives in the same tween so the parallax never outruns the
        // overscan and exposes the card background
        gsap.fromTo(
          inner,
          { yPercent: -6, scale: 1.16 },
          {
            yPercent: 6,
            scale: 1.16,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      gsap.fromTo(
        ".gal-card",
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".gal-grid", start: "top 80%", once: true },
        }
      );
    },
    // No lang dependency: re-running on language flips created duplicate
    // from-tweens that re-hid the cards and froze them near opacity 0.
    // Layout shifts from RTL flips are handled by Hero's ScrollTrigger.refresh().
    { scope: root }
  );

  return (
    <section id="gallery" ref={root} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow={t(g.eyebrow)} title={t(g.title)} />

        <div className="gal-grid mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {g.items.map((item, i) => (
            <div
              key={i}
              className="gal-card group relative overflow-hidden rounded-3xl"
            >
              <div className="gal-img relative aspect-[3/4] w-full overflow-hidden transition-transform duration-700 group-hover:scale-[1.06]">
                <Image
                  src={item.src}
                  alt={t(item.label)}
                  fill
                  sizes="(max-width: 768px) 90vw, 40vw"
                  quality={88}
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
              <span className="absolute bottom-4 start-4 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-bold text-brand-700 backdrop-blur">
                {t(item.label)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
