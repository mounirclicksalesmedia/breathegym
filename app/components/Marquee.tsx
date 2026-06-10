"use client";

import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";

export function Marquee() {
  const { lang } = useLang();
  const words = content.marquee[lang];
  const row = [...words, ...words];

  return (
    <div className="relative overflow-hidden border-y border-border bg-brand-700 py-4">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 text-lg font-semibold text-white/90">
            {w}
            <span className="text-brand-200">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
