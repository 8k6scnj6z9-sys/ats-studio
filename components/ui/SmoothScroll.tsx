"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
      touchMultiplier: 1.4,
    });

    const refreshScrollBounds = () => lenis.resize();
    const refreshFrames = [100, 350, 900, 1600].map((delay) =>
      window.setTimeout(refreshScrollBounds, delay)
    );

    window.addEventListener("load", refreshScrollBounds);
    window.addEventListener("resize", refreshScrollBounds);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      refreshFrames.forEach(window.clearTimeout);
      window.removeEventListener("load", refreshScrollBounds);
      window.removeEventListener("resize", refreshScrollBounds);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
