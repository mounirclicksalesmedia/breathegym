"use client";

import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  light?: boolean;
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-start"}`}
    >
      <Reveal>
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider ${
            light
              ? "bg-white/15 text-white"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className={`display mt-4 text-[clamp(1.9rem,4.5vw,3.2rem)] font-extrabold leading-tight ${
            light ? "text-white" : "text-foreground"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p
            className={`mt-4 text-base leading-relaxed md:text-lg ${
              light ? "text-white/80" : "text-muted"
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
