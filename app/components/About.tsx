"use client";

import { ShieldCheck, Dumbbell, HeartPulse, Flower2 } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

const icons = [ShieldCheck, Dumbbell, HeartPulse, Flower2];

export function About() {
  const { t } = useLang();
  const a = content.about;

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-brand-700">
                {t(a.eyebrow)}
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display mt-4 text-[clamp(1.9rem,4.5vw,3.2rem)] font-extrabold leading-tight text-foreground">
                {t(a.title)}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                {t(a.body)}
              </p>
            </Reveal>
          </div>

          <StaggerGroup className="grid grid-cols-2 gap-3 sm:gap-5">
            {a.features.map((f, i) => {
              const Icon = icons[i];
              return (
                <StaggerItem
                  key={i}
                  className="group rounded-3xl border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_50px_-24px_rgba(206,132,133,0.6)] sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold leading-tight text-foreground sm:text-lg">
                    {t(f.title)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                    {t(f.desc)}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
