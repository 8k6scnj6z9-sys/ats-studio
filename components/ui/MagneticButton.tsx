"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";

type BaseProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

type Props =
  | (BaseProps & ComponentPropsWithoutRef<"button"> & { as?: "button" })
  | (BaseProps & ComponentPropsWithoutRef<"span"> & { as: "span" });

export default function MagneticButton({
  as = "button",
  children,
  strength = 0.35,
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (as === "span") {
    return (
      <motion.span
        ref={setRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x: sx, y: sy }}
        className={className}
        {...(rest as ComponentPropsWithoutRef<typeof motion.span>)}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.button
      ref={setRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
      {...(rest as ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
