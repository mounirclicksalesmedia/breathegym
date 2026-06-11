"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";

const sections = [
  { id: "about", label: content.nav.about },
  { id: "packages", label: content.nav.packages },
  { id: "gallery", label: content.nav.gallery },
  { id: "reviews", label: content.nav.reviews },
  { id: "contact", label: content.nav.contact },
];

export function Navbar() {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-[0_10px_40px_-20px_rgba(168,90,91,0.45)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt={t(content.brand.name)}
            width={132}
            height={44}
            className="h-9 w-auto object-contain md:h-10"
            priority
          />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="font-auto text-[15px] font-medium text-foreground/80 transition-colors hover:text-brand-700"
              >
                {t(s.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            aria-label="Switch language"
            className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/60 px-3.5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            {lang === "ar" ? "EN" : "ع"}
          </button>

          <a
            href="#trial"
            className="btn-shine hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(206,132,133,0.9)] transition hover:bg-brand-600 sm:inline-block"
          >
            {t(content.nav.cta)}
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white/60 text-brand-700 lg:hidden cursor-pointer"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden glass lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 font-auto font-medium text-foreground/85 transition hover:bg-brand-50"
                  >
                    {t(s.label)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#trial"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-full bg-brand px-5 py-3 text-center font-semibold text-white"
                >
                  {t(content.nav.cta)}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
