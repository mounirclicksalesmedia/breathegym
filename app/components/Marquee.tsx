"use client";

import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";

// 6 copies of the word set: -50% of the track is exactly 3 sets, so the loop
// restart lands on an identical frame (last word → first word, seamlessly),
// and the always-visible half of the track out-covers even ultra-wide screens.
const COPIES = 6;

export function Marquee() {
  const { lang } = useLang();
  const words = content.marquee[lang];
  const row = Array.from({ length: COPIES }, () => words).flat();

  return (
    // slight editorial tilt; the strip is widened a touch so the rotated
    // corners never expose the page background
    <div className="relative z-10 -mx-[2%] w-[104%] -rotate-[1.1deg]">
      <div className="border-y border-white/10 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 py-4 shadow-[0_24px_60px_-32px_rgba(168,90,91,0.8)]">
        {/* dir=ltr anchors the w-max track to the LEFT edge in both languages.
            In RTL the track would anchor right and the translateX loop would
            expose a blank region then visibly jump on restart. Arabic still
            travels right (animation-direction: reverse) and each word renders
            its own bidi direction correctly. */}
        <div className="marquee-mask overflow-hidden" dir="ltr">
          <div className="animate-marquee flex w-max items-center">
            {row.map((w, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap text-lg font-semibold tracking-wide text-white/90"
              >
                <span className="px-5">{w}</span>
                <span className="px-5 text-brand-200" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
