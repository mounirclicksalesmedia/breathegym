"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GRID = 44; // grid cell size in px
const BEAM_LEN = 88;

function useWindowWidth() {
  const [w, setW] = useState<number | undefined>(undefined);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}

function Beam({
  top,
  left,
  transition = {},
}: {
  top: number;
  left: number;
  transition?: object;
}) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ opacity: [0, 1, 0], y: GRID * 9 }}
      transition={{
        ease: "easeInOut",
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1.5,
        ...transition,
      }}
      style={{ top, left, height: BEAM_LEN }}
      className="absolute w-px bg-gradient-to-b from-brand/0 to-brand"
    />
  );
}

function Beams() {
  const width = useWindowWidth();
  const cols = width ? Math.floor(width / GRID) : 0;
  const placements = [
    { top: 0, left: Math.floor(cols * 0.08) * GRID, transition: { duration: 3.5, repeatDelay: 5, delay: 2 } },
    { top: GRID * 10, left: Math.floor(cols * 0.18) * GRID, transition: { duration: 3.5, repeatDelay: 10, delay: 4 } },
    { top: GRID * 2, left: Math.floor(cols * 0.32) * GRID, transition: { duration: 4, repeatDelay: 6, delay: 1 } },
    { top: GRID * 7, left: Math.floor(cols * 0.74) * GRID, transition: { duration: 2.5, repeatDelay: 7.5, delay: 3.5 } },
    { top: 0, left: Math.floor(cols * 0.62) * GRID, transition: { duration: 3, repeatDelay: 3, delay: 1 } },
    { top: GRID * 3, left: Math.floor(cols * 0.92) * GRID, transition: { duration: 5, repeatDelay: 5, delay: 5 } },
  ];
  return (
    <>
      {placements.map((p, i) => (
        <Beam key={i} top={p.top} left={p.left} transition={p.transition} />
      ))}
    </>
  );
}

function GradientGrid() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
      className="absolute inset-0"
    >
      <div
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44' width='44' height='44' fill='none' stroke-width='1.4' stroke='rgb(206 132 133 / 0.5)'%3e%3cpath d='M0 .5H43.5V44'/%3e%3c/svg%3e\")",
          // fade the grid out toward the centre/bottom so it reads as a soft
          // ambient texture rather than a hard graph-paper sheet
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 85%)",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 85%)",
        }}
        className="absolute inset-0"
      />
    </motion.div>
  );
}

export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden mix-blend-multiply"
      style={{ opacity: 0.55 }}
    >
      {/* soft, slowly breathing rose glow */}
      <motion.div
        initial={{ opacity: 0.35, scale: 0.9 }}
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(206,132,133,0.35) 0%, rgba(206,132,133,0.12) 40%, transparent 70%)",
        }}
      />
      <GradientGrid />
      <Beams />
    </div>
  );
}
