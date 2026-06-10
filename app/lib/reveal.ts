// Tiny coordination channel between the Preloader and the Hero so the hero
// entrance only plays once the intro overlay starts lifting.
export const REVEAL_EVENT = "breathe:reveal";

type RevealWindow = Window & { __breatheRevealed?: boolean };

export function markRevealed() {
  if (typeof window === "undefined") return;
  (window as RevealWindow).__breatheRevealed = true;
  window.dispatchEvent(new Event(REVEAL_EVENT));
}

export function isRevealed() {
  return typeof window !== "undefined" && !!(window as RevealWindow).__breatheRevealed;
}
