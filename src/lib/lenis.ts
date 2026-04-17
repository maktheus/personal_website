"use client";

import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis!.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollTo(target: string | number, options?: { offset?: number }) {
  if (!lenis) {
    if (typeof target === "string" && target.startsWith("#")) {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }
  lenis.scrollTo(target as HTMLElement | string | number, { offset: options?.offset ?? -80 });
}
