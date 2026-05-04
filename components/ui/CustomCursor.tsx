"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    const enableRaf = requestAnimationFrame(() => setEnabled(true));
    document.body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], [data-cursor="hover"], input, textarea, label'
      );
      targetScale = interactive ? 2.6 : 1;
    };

    const tick = () => {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      scale += (targetScale - scale) * 0.18;
      const el = cursorRef.current;
      if (el) {
        el.style.transform = `translate3d(${curX - 8}px, ${curY - 8}px, 0) scale(${scale})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(enableRaf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] h-4 w-4 rounded-full bg-paper mix-blend-difference will-change-transform"
      style={{ transition: "background 0.2s" }}
    />
  );
}
