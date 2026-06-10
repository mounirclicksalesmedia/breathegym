"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, Loader2, Send, User, Phone, Package2 } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";
import type { LandingPackage } from "../lib/landing-types";

type Status = "idle" | "submitting" | "success" | "error";

/** Other components (package cards, CTAs) can pre-select a package in the form. */
export const SELECT_PACKAGE_EVENT = "breathe:select-package";

export function LeadForm({ packages }: { packages: LandingPackage[] }) {
  const { t } = useLang();
  const f = content.form;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pkg, setPkg] = useState("trial");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (slug === "trial" || packages.some((p) => p.slug === slug)) setPkg(slug);
    };
    window.addEventListener(SELECT_PACKAGE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PACKAGE_EVENT, onSelect);
  }, [packages]);

  const validate = () => {
    if (name.trim().length < 2) return t(f.errName);
    const digits = phone.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[\s\-().]/g, "");
    if (!/^(?:\+?966|0)?5\d{8}$/.test(digits)) return t(f.errPhone);
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          packageSlug: pkg,
          website: honeypot.current?.value ?? "",
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        setError(data.error === "invalid_phone" ? t(f.errPhone) : t(f.errServer));
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError(t(f.errServer));
      setStatus("error");
    }
  }

  const reset = () => {
    setName("");
    setPhone("");
    setPkg("trial");
    setError(null);
    setStatus("idle");
  };

  const inputBase =
    "w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted/70 outline-none backdrop-blur transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15";

  return (
    <div className="relative w-full max-w-md rounded-[2rem] border border-white/40 bg-white/30 p-6 shadow-[0_40px_90px_-40px_rgba(90,40,41,0.55)] backdrop-blur-xl md:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-brand"
            >
              <CheckCircle2 className="h-11 w-11" />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-white">{t(f.successTitle)}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-white/85">{t(f.successBody)}</p>
            <button
              onClick={reset}
              className="mt-2 rounded-full border border-white/50 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              {t(f.successAgain)}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={false}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="text-center md:text-start">
              <h3 className="text-xl font-extrabold text-white md:text-2xl">{t(f.title)}</h3>
              <p className="mt-1 text-[13px] text-white/80">{t(f.subtitle)}</p>
            </div>

            {/* honeypot — humans never see or fill this */}
            <input
              ref={honeypot}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-white/90">
                <User className="h-3.5 w-3.5" /> {t(f.name)}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(f.namePlaceholder)}
                autoComplete="name"
                required
                className={inputBase}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-white/90">
                <Phone className="h-3.5 w-3.5" /> {t(f.phone)}
              </span>
              <input
                type="tel"
                inputMode="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t(f.phonePlaceholder)}
                autoComplete="tel"
                required
                className={`${inputBase} text-left`}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-white/90">
                <Package2 className="h-3.5 w-3.5" /> {t(f.package)}
              </span>
              <div className="relative">
                <select
                  value={pkg}
                  onChange={(e) => setPkg(e.target.value)}
                  className={`${inputBase} appearance-none pe-10`}
                >
                  <option value="trial">{t(f.freeTrialOption)}</option>
                  {packages.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {t(p.name)} — {p.priceSar.toLocaleString()} {t(content.packages.currency)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
            </label>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-white/90 px-4 py-2.5 text-[13px] font-semibold text-brand-700"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={status === "submitting"}
              whileTap={{ scale: 0.97 }}
              className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-bold text-brand-700 shadow-xl transition hover:shadow-2xl disabled:opacity-70"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  {t(f.submitting)}
                </>
              ) : (
                <>
                  {t(f.submit)}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" />
                </>
              )}
            </motion.button>

            <p className="text-center text-[11px] text-white/70">{t(f.privacy)}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
