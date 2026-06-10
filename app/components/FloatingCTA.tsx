"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LanguageProvider";
import { content, SITE } from "../lib/content";

export function FloatingCTA() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={SITE.whatsapp}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          className="fixed bottom-5 end-5 z-50 flex items-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_-12px_rgba(206,132,133,0.95)]"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">{t(content.trial.cta)}</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
