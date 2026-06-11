"use client";

import Image from "next/image";
import { MapPin, Clock, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content, SITE } from "../lib/content";
import { Reveal } from "./Reveal";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function FinalCTA() {
  const { t } = useLang();
  const c = content.cta;
  return (
    <section className="px-5 pb-4 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-border bg-surface px-6 py-16 text-center md:py-20">
        {/* soft rose wash behind the closing pitch */}
        <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-brand-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-64 w-64 rounded-full bg-brand-50 blur-3xl" />
        <div className="relative">
          <Reveal>
            <h2 className="display mx-auto max-w-3xl text-[clamp(1.9rem,4.5vw,3.3rem)] font-extrabold leading-tight text-foreground">
              {t(c.title)}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted md:text-lg">
              {t(c.body)}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-shine mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-[0_20px_45px_-18px_rgba(206,132,133,0.95)] transition hover:scale-[1.03] hover:bg-brand-600"
            >
              {t(c.cta)}
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  const f = content.footer;

  const links = [
    content.nav.about,
    content.nav.packages,
    content.nav.gallery,
    content.nav.reviews,
  ];
  const ids = ["about", "packages", "gallery", "reviews"];

  return (
    <footer id="contact" className="mt-12 bg-brand-700 text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex rounded-2xl bg-white px-4 py-3">
              <Image
                src="/logo.png"
                alt={t(content.brand.name)}
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">
              {t({
                ar: "نادٍ نسائي راقٍ في قلب الملقا بالرياض، يجمع بين اللياقة والعناية والخصوصية.",
                en: "An elegant women-only club in the heart of Al Malqa, Riyadh — where fitness, care and privacy meet.",
              })}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
              {t(f.quickLinks)}
            </h3>
            <ul className="mt-5 space-y-3">
              {links.map((l, i) => (
                <li key={i}>
                  <a
                    href={`#${ids[i]}`}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {t(l)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
              {t(f.location)}
            </h3>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-start gap-2.5 text-sm text-white/75 transition hover:text-white"
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{t(f.address)}</span>
            </a>
            <div className="mt-4 flex items-center gap-2.5 text-sm text-white/75">
              <Phone className="h-5 w-5 shrink-0" />
              <span dir="ltr">{SITE.phone}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
              {t(f.hoursTitle)}
            </h3>
            <div className="mt-5 flex items-start gap-2.5 text-sm text-white/75">
              <Clock className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{t(f.hours)}</span>
            </div>
            <a
              href="#trial"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              {t(content.trial.cta)}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-sm text-white/60 md:flex-row">
          <span>
            © {new Date().getFullYear()} {t(content.brand.name)} {t(content.brand.tagline)}. {t(f.rights)}.
          </span>
          <span>{t(f.address)}</span>
        </div>
      </div>
    </footer>
  );
}
