"use client";

import { Star, Quote } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content, SITE } from "../lib/content";
import { SectionHeading } from "./SectionHeading";
import { StaggerGroup, StaggerItem, Reveal } from "./Reveal";

export function Reviews() {
  const { t } = useLang();
  const r = content.reviews;

  return (
    <section id="reviews" className="relative overflow-hidden bg-brand-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow={t(r.eyebrow)} title={t(r.title)} subtitle={t(r.note)} />

        <StaggerGroup className="mt-16 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {r.items.map((item, i) => (
            <StaggerItem
              key={i}
              className="flex h-full flex-col rounded-3xl bg-surface p-4 shadow-[0_24px_50px_-32px_rgba(168,90,91,0.5)] sm:p-6"
            >
              <Quote className="h-6 w-6 text-brand-200 sm:h-7 sm:w-7" />
              <p className="mt-3 flex-1 text-xs leading-relaxed text-foreground/85 sm:text-[15px]">
                {t(item.text)}
              </p>
              <div className="mt-5 flex items-center gap-1">
                {Array.from({ length: item.rating }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-brand text-brand sm:h-4 sm:w-4" />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 sm:h-10 sm:w-10 sm:text-sm">
                  {t(item.name).charAt(0)}
                </div>
                <span className="min-w-0 text-xs font-bold leading-tight text-foreground sm:text-sm">
                  {t(item.name)}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1} className="mt-12 text-center">
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
          >
            <Star className="h-4 w-4 fill-brand text-brand" />
            {t({ ar: "اقرئي جميع التقييمات على خرائط جوجل", en: "Read all reviews on Google Maps" })}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
