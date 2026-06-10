"use client";

import { Gift, ShieldCheck, Clock3, Sparkles } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";
import { Reveal } from "./Reveal";
import { LeadForm } from "./LeadForm";
import type { LandingPackage } from "../lib/landing-types";

export function FreeTrial({ packages }: { packages: LandingPackage[] }) {
  const { t } = useLang();
  const tr = content.trial;

  const perks = [
    { icon: ShieldCheck, text: content.about.features[0].title },
    { icon: Clock3, text: content.footer.hoursTitle },
    { icon: Sparkles, text: content.about.features[3].title },
  ];

  return (
    <section id="trial" className="relative px-5 py-12 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand-600 to-brand-700 px-6 py-14 md:px-16 md:py-20">
        {/* decorative rings */}
        <div className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -end-10 -top-10 h-52 w-52 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-24 -start-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="text-center lg:text-start">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-white">
                <Gift className="h-4 w-4" />
                {t(tr.eyebrow)}
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display mt-5 text-[clamp(1.9rem,4.5vw,3.2rem)] font-extrabold leading-tight text-white">
                {t(tr.title)}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg lg:mx-0">
                {t(tr.body)}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ul className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                {perks.map(({ icon: Icon, text }) => (
                  <li
                    key={text.en}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {t(text)}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-6 text-sm font-medium text-white/75">{t(tr.note)}</p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            <LeadForm packages={packages} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
