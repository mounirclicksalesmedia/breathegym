"use client";

import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";

export function Marquee() {
  const { lang } = useLang();
  const words = content.marquee[lang];
  const row = [...words, ...words];

  return (
    // slight editorial tilt; the strip is widened a touch so the rotated
    // corners never expose the page background
    <div className="relative z-10 -mx-[2%] w-[104%] -rotate-[1.1deg]">
      <div className="border-y border-white/10 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 py-4 shadow-[0_24px_60px_-32px_rgba(168,90,91,0.8)]">
        <div className="marquee-mask overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
            {row.map((w, i) => (
              <span key={i} className="flex items-center gap-10 text-lg font-semibold tracking-wide text-white/90">
                {w}
                <span className="text-brand-200">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
