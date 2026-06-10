"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { markRevealed } from "../lib/reveal";

/**
 * Branded intro overlay. Holds the page (scroll locked) until fonts + the hero
 * video are ready, then lifts like a curtain while the hero entrance plays
 * underneath. Never hangs: it always reveals within a hard time cap.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    html.classList.add("is-loading");
    window.scrollTo(0, 0);

    // looping intro animation while we wait
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.to(".pl-logo", { scale: 1.06, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.fromTo(
        ".pl-ring",
        { scale: 0.85, opacity: 0.5 },
        { scale: 1.35, opacity: 0, duration: 1.7, ease: "power2.out", repeat: -1 }
      );
      gsap.fromTo(".pl-bar-fill", { scaleX: 0 }, { scaleX: 0.9, duration: 2.2, ease: "power2.out" });
    }, root);

    let revealed = false;
    let hardCap = 0;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      window.clearTimeout(hardCap);
      html.classList.remove("is-loading");
      window.scrollTo(0, 0);

      if (reduce) {
        markRevealed();
        setHidden(true);
        return;
      }

      gsap
        .timeline({ onComplete: () => setHidden(true) })
        .to(".pl-bar-fill", { scaleX: 1, duration: 0.25, ease: "power2.out" })
        .to([".pl-logo", ".pl-ring"], { autoAlpha: 0, scale: 0.94, duration: 0.35, ease: "power2.in" }, "-=0.05")
        .to(".pl-bar", { autoAlpha: 0, duration: 0.3 }, "<")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1")
        // hand off to the hero entrance ~0.3s into the curtain lift, so the
        // reveal arrives as the curtain clears
        .add(markRevealed, "-=0.6");
    };

    // Readiness: min display time + fonts + hero video buffered, capped so a
    // slow connection never blocks the page.
    const waits: Promise<unknown>[] = [
      new Promise((r) => setTimeout(r, reduce ? 300 : 700)),
    ];
    if (document.fonts?.ready) waits.push(document.fonts.ready);

    const video = document.querySelector<HTMLVideoElement>('video[src="/videos/hero.mp4"]');
    if (video) {
      waits.push(
        new Promise<void>((res) => {
          if (video.readyState >= 2) return res();
          const done = () => {
            ["loadeddata", "canplay", "error"].forEach((e) => video.removeEventListener(e, done));
            res();
          };
          ["loadeddata", "canplay", "error"].forEach((e) => video.addEventListener(e, done));
        })
      );
    }

    Promise.race([
      Promise.all(waits),
      new Promise((r) => setTimeout(r, 4500)),
    ]).then(reveal);
    hardCap = window.setTimeout(reveal, 6500);

    return () => {
      window.clearTimeout(hardCap);
      html.classList.remove("is-loading");
      ctx.revert();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={root}
      id="preloader"
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-background to-brand-50"
    >
      <noscript>
        <style>{`#preloader{display:none!important}`}</style>
      </noscript>
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="pl-ring absolute h-28 w-28 rounded-full border border-brand-200" />
        <Image
          src="/logo.png"
          alt=""
          width={112}
          height={112}
          priority
          className="pl-logo relative h-auto w-24 object-contain"
        />
      </div>
      <div className="pl-bar mt-8 h-[3px] w-40 overflow-hidden rounded-full bg-brand-100">
        <div className="pl-bar-fill h-full w-full origin-left rounded-full bg-brand" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
