"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";
import { Reveal } from "./Reveal";

export function VideoSection() {
  const { t } = useLang();
  const v = content.video;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // once the visitor explicitly mutes, never auto-unmute again
  const userMuted = useRef(false);

  const tryUnmute = () => {
    const el = videoRef.current;
    if (!el || userMuted.current) return;
    el.muted = false;
    el.play()
      .then(() => setMuted(false))
      .catch(() => {
        // browser refused audible playback (no interaction yet) — keep rolling silently
        el.muted = true;
        el.play().catch(() => {});
        setMuted(true);
      });
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Sound on by default whenever the clip is actually on screen, off when
    // it scrolls away. Browsers only allow this after the first interaction,
    // so retry on the first gesture if the early attempt is refused.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryUnmute();
        } else if (!el.muted) {
          el.muted = true;
          setMuted(true);
        }
      },
      { threshold: 0.45 }
    );
    io.observe(el);

    const onGesture = () => {
      if (el.muted === false) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
      if (inView) tryUnmute();
    };
    const gestures = ["pointerdown", "touchend", "click", "keydown"] as const;
    gestures.forEach((g) => window.addEventListener(g, onGesture));

    return () => {
      io.disconnect();
      gestures.forEach((g) => window.removeEventListener(g, onGesture));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.muted) {
      userMuted.current = false;
      el.muted = false;
      setMuted(false);
      el.play().catch(() => {});
    } else {
      userMuted.current = true;
      el.muted = true;
      setMuted(true);
    }
  };

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="text-center lg:text-start">
            <Reveal>
              <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-brand-700">
                {t(v.eyebrow)}
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display mt-4 text-[clamp(1.9rem,4.5vw,3.2rem)] font-extrabold leading-tight text-foreground">
                {t(v.title)}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg lg:mx-0">
                {t(v.body)}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-7 flex justify-center lg:justify-start">
                <a
                  href="#trial"
                  className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(206,132,133,0.95)] transition-all duration-300 hover:scale-[1.04] hover:bg-brand-600 active:scale-[0.98]"
                >
                  {t(content.trial.cta)}
                  <ArrowUpRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="flex justify-center">
            {/* portrait clip framed like a phone story */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -rotate-3 rounded-[2.5rem] bg-brand-100/70" />
              <div className="relative aspect-[9/16] w-[280px] overflow-hidden rounded-[2rem] brand-glow sm:w-[320px] md:w-[360px]">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src="/videos/tour.mp4"
                  poster="/images/tour-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={t(v.title)}
                />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/30" />
                <button
                  onClick={toggleSound}
                  aria-label={muted ? t(v.soundOn) : t(v.soundOff)}
                  className="absolute bottom-4 end-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2.5 text-[13px] font-bold text-brand-700 shadow-lg backdrop-blur transition hover:scale-105 active:scale-95"
                >
                  {muted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                  {muted ? t(v.soundOn) : t(v.soundOff)}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
