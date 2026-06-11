"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, Star, Sparkles } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { content } from "../lib/content";
import { HeroBackground } from "./HeroBackground";
import { REVEAL_EVENT, isRevealed } from "../lib/reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t, lang } = useLang();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      gsap.set([".hero-media", ".hero-stage"], { xPercent: -50, yPercent: -50 });
      gsap.set(".mega-word", { yPercent: -50 });

      // Reduced motion: show everything, no entrance, no pin.
      if (reduce) {
        gsap.set([".hero-eyebrow", ".hero-bottom .reveal-up"], { autoAlpha: 1, y: 0 });
        gsap.set([".hero-media", ".hero-stage"], { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(".mega-word", { autoAlpha: 1, y: 0 });
        return;
      }

      // Subtle cursor parallax — armed only after the entrance settles so it
      // never fights the intro tween. Media drifts with the cursor, the big
      // word counters it for gentle depth.
      let cleanupParallax: (() => void) | undefined;
      const armParallax = () => {
        if (!finePointer || !root.current) return;
        const mediaX = gsap.quickTo(".hero-media", "x", { duration: 0.8, ease: "power3.out" });
        const mediaY = gsap.quickTo(".hero-media", "y", { duration: 0.8, ease: "power3.out" });
        const wordX = gsap.quickTo(".mega-word", "x", { duration: 1.1, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          mediaX(nx * 12);
          mediaY(ny * 9);
          wordX(nx * -7);
        };
        root.current.addEventListener("mousemove", onMove);
        cleanupParallax = () => root.current?.removeEventListener("mousemove", onMove);
      };

      // Entrance: eyebrow + spotlight + video + bottom content come in. Built
      // paused so the preloader triggers it — the reveal is the first motion
      // the visitor sees, nothing plays hidden behind the loader.
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        paused: true,
        onComplete: armParallax,
      });
      tl.from(".hero-eyebrow", { y: 18, autoAlpha: 0, duration: 0.7 })
        .fromTo(
          ".hero-stage",
          { autoAlpha: 0, scale: 0.85 },
          { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" },
          "-=0.35"
        )
        .fromTo(
          ".hero-media",
          { y: 90, autoAlpha: 0, scale: 0.94 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 1.25, ease: "power3.out" },
          "<"
        )
        .from(
          ".hero-bottom .reveal-up",
          { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.12 },
          "-=0.75"
        );

      // Count the stats up as their row fades in.
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el, i) => {
        const target = parseFloat(el.dataset.target ?? "0");
        const decimals = Number(el.dataset.decimals ?? "0");
        const prefix = el.dataset.prefix ?? "";
        const num = { v: 0 };
        tl.to(
          num,
          {
            v: target,
            duration: 1.3,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent =
                prefix +
                num.v.toLocaleString("en-US", {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                });
            },
          },
          i === 0 ? "-=0.9" : "<"
        );
      });

      // Video autoplays on its own. We only pin briefly (≈half a screen — about
      // 2–3 scrolls) so the big word reveals in front and holds for a beat,
      // then the page releases and continues down. No full-video scrubbing.
      // Transform/opacity only — no blur or letter-spacing tweens, which force
      // a re-rasterize/re-layout of the huge headline on every scroll frame.
      gsap.set(".mega-word", { autoAlpha: 0 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=55%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      master
        .fromTo(
          ".mega-word",
          { autoAlpha: 0, y: 64, scale: 1.08 },
          { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.7 },
          0
        )
        .to(".hero-media", { scale: 1.04, ease: "none", duration: 1 }, 0)
        .to(".hero-eyebrow", { autoAlpha: 0, y: -14, ease: "power1.in", duration: 0.3 }, 0.05)
        // brief hold so the revealed word reads before release
        .to({}, { duration: 0.4 });

      // Play the entrance when the preloader lifts (or immediately if it already
      // did / there is no loader), then re-measure the pin.
      let started = false;
      let fallback = 0;
      const startEntrance = () => {
        if (started) return;
        started = true;
        window.clearTimeout(fallback);
        tl.play(0);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      if (isRevealed()) {
        startEntrance();
      } else {
        window.addEventListener(REVEAL_EVENT, startEntrance, { once: true });
        fallback = window.setTimeout(startEntrance, 5000);
      }

      return () => {
        window.removeEventListener(REVEAL_EVENT, startEntrance);
        window.clearTimeout(fallback);
        cleanupParallax?.();
      };
    },
    { scope: root }
  );

  // Decode the loop only while the hero is actually on screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Language flips change text width / RTL — recompute pin & triggers
  // without tearing the pinned ScrollTrigger down (avoids stale pin-spacers).
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  const stats = [
    { target: 2500, prefix: "+", initial: "+2,500", label: content.hero.stat1 },
    { target: 15, prefix: "+", initial: "+15", label: content.hero.stat2 },
  ];

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-background pt-24 pb-10 md:pt-28"
    >
      {/* animated brand grid + falling beams background */}
      <HeroBackground />

      {/* eyebrow */}
      <div className="relative z-20 mb-1 text-center">
        <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-[12px] font-semibold text-brand-700 md:text-[13px]">
          <Sparkles className="h-3.5 w-3.5" />
          {t(content.hero.eyebrow)}
        </span>
      </div>

      {/* mega word + product stage */}
      <div className="relative mx-auto h-[clamp(360px,50svh,520px)] w-full max-w-[80rem] px-4 sm:h-[clamp(420px,52svh,560px)] md:h-[clamp(500px,58svh,640px)]">
        <h1
          className="mega-word mega pointer-events-none absolute inset-x-0 top-1/2 z-30 select-none px-2 text-center font-black text-foreground will-change-transform"
          style={{
            fontSize: "clamp(2.75rem, 12.8vw, 12rem)",
            fontFamily: "var(--font-anton), var(--font-poppins), sans-serif",
            textShadow: "0 0 36px rgba(251,249,248,0.85), 0 2px 60px rgba(251,249,248,0.7)",
          }}
          aria-label={t(content.hero.bigWord)}
        >
          {t(content.hero.bigWord)}
        </h1>

        {/* spotlight: clears the grid behind the runner and adds a soft rose
            floor glow — the multiply-blended video melts into this */}
        <div className="hero-stage pointer-events-none absolute left-1/2 top-1/2 z-[6]" aria-hidden>
          <div
            className="h-[clamp(420px,64svh,700px)] w-[min(82vw,600px)]"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, #ffffff 0%, rgba(255,255,255,0.9) 38%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div
            className="absolute bottom-[10%] left-1/2 h-24 w-[110%] -translate-x-1/2 rounded-[100%]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(206,132,133,0.3) 0%, rgba(206,132,133,0) 70%)",
            }}
          />
        </div>

        {/* multiply blend drops the clip's white studio backdrop so only the
            runner + treadmill (and their natural floor shadow) remain */}
        <div className="hero-media pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(62vw,295px)] mix-blend-multiply will-change-transform sm:w-[min(48vw,340px)] md:w-[380px] lg:w-[420px]">
          <div className="relative aspect-[9/16] w-full">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/videos/hero.mp4"
              poster="/videos/hero-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-label={t(content.brand.name)}
            />
          </div>
        </div>
      </div>

      {/* bottom content */}
      <div className="hero-bottom relative z-20 mx-auto mt-14 grid w-full max-w-6xl items-end gap-8 px-5 md:mt-16 md:grid-cols-2 md:px-8">
        {/* left: subhead + body + CTA */}
        <div className="reveal-up order-2 text-center md:order-1 md:text-start">
          <h2 className="display text-2xl font-extrabold text-foreground md:text-3xl">
            {t(content.hero.subhead)}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted md:mx-0 md:text-base">
            {t(content.hero.subtitle)}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row justify-center md:justify-start">
            <a
              href="#trial"
              className="btn-shine inline-flex items-center justify-center rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_18px_40px_-16px_rgba(206,132,133,0.95)] transition-all duration-300 hover:scale-[1.04] hover:bg-brand-600 hover:shadow-[0_22px_50px_-16px_rgba(206,132,133,1)] active:scale-[0.98]"
            >
              {t(content.hero.ctaPrimary)}
            </a>
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/70 px-7 py-3.5 text-[15px] font-semibold text-brand-700 transition-all duration-300 hover:scale-[1.04] hover:bg-brand-50 active:scale-[0.98]"
            >
              {t(content.hero.ctaSecondary)}
            </a>
          </div>
        </div>

        {/* right: rating + stats + thumbnails */}
        <div className="reveal-up order-1 flex flex-col items-center gap-4 md:order-2 md:items-end">
          <div className="flex items-center gap-5">
            {stats.map((s) => (
              <div key={s.initial} className="text-center">
                <div
                  className="stat-num text-2xl font-extrabold tabular-nums text-brand-700 md:text-3xl"
                  data-target={s.target}
                  data-prefix={s.prefix}
                >
                  {s.initial}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-muted md:text-xs">
                  {t(s.label)}
                </div>
              </div>
            ))}
            <div className="text-center">
              <div className="flex items-center gap-1 text-2xl font-extrabold text-brand-700 md:text-3xl">
                <span className="stat-num tabular-nums" data-target="4.9" data-decimals="1">
                  4.9
                </span>
                <Star className="h-4 w-4 fill-brand text-brand" />
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-muted md:text-xs">
                {t(content.hero.stat3)}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {["/images/club-3.jpg", "/images/club-1.jpg"].map((src) => (
              <div
                key={src}
                className="relative h-16 w-24 overflow-hidden rounded-xl border border-brand-100 shadow-sm md:h-20 md:w-28"
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute inset-x-0 bottom-5 mx-auto hidden w-fit flex-col items-center gap-1 text-muted lg:flex"
      >
        <span className="text-xs font-medium">{t(content.hero.scroll)}</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
