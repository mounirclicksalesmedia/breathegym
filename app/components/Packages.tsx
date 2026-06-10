"use client";

import { Check, Crown } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";
import { SectionHeading } from "./SectionHeading";
import { StaggerGroup, StaggerItem } from "./Reveal";
import { SELECT_PACKAGE_EVENT } from "./LeadForm";
import type { LandingPackage } from "../lib/landing-types";

export function Packages({ packages }: { packages: LandingPackage[] }) {
  const { t } = useLang();
  const p = content.packages;

  const choose = (slug: string) => {
    window.dispatchEvent(new CustomEvent(SELECT_PACKAGE_EVENT, { detail: slug }));
  };

  return (
    <section id="packages" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute start-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={t(p.eyebrow)}
          title={t(p.title)}
          subtitle={t(p.subtitle)}
        />

        <StaggerGroup className="mt-16 grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 xl:grid-cols-4">
          {packages.map((item) => {
            const featured = item.featured;
            return (
              <StaggerItem key={item.slug}>
                <div
                  className={`relative flex h-full flex-col rounded-[1.75rem] p-4 transition-all duration-300 hover:-translate-y-2 sm:p-6 lg:p-7 ${
                    featured
                      ? "bg-brand-700 text-white shadow-[0_40px_80px_-30px_rgba(168,90,91,0.85)] ring-1 ring-brand-700"
                      : "border border-border bg-surface hover:shadow-[0_30px_60px_-30px_rgba(206,132,133,0.55)]"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 start-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#c9a47a] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg sm:px-4 sm:text-xs">
                      <Crown className="h-3.5 w-3.5" />
                      {t(p.bestValue)}
                    </span>
                  )}

                  <h3
                    className={`text-base font-bold leading-tight sm:text-lg ${
                      featured ? "text-white" : "text-foreground"
                    }`}
                  >
                    {t(item.name)}
                  </h3>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      featured ? "text-white/70" : "text-muted"
                    }`}
                  >
                    {t(item.duration)}
                  </p>

                  <div className="mt-5 flex flex-wrap items-end gap-x-2 gap-y-1 sm:mt-6">
                    <span
                      className={`text-[clamp(1.75rem,8vw,3rem)] font-extrabold leading-none tabular-nums tracking-tight ${
                        featured ? "text-white" : "text-brand-700"
                      }`}
                    >
                      {item.priceSar.toLocaleString()}
                    </span>
                    <span
                      className={`mb-2 text-sm font-semibold ${
                        featured ? "text-white/80" : "text-muted"
                      }`}
                    >
                      {t(p.currency)}
                    </span>
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-3 sm:mt-7 sm:gap-3.5">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed sm:gap-2.5 sm:text-sm">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            featured
                              ? "bg-white/20 text-white"
                              : "bg-brand-50 text-brand"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span
                          className={
                            featured ? "text-white/90" : "text-foreground/80"
                          }
                        >
                          {t(f)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#trial"
                    onClick={() => choose(item.slug)}
                    className={`mt-7 inline-flex items-center justify-center rounded-full px-4 py-3 text-xs font-bold transition sm:mt-8 sm:px-5 sm:text-sm ${
                      featured
                        ? "bg-white text-brand-700 hover:bg-brand-50"
                        : "bg-brand text-white hover:bg-brand-600"
                    }`}
                  >
                    {t(p.cta)}
                  </a>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
