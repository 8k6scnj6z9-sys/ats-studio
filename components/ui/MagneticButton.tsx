"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ReactNode,
  useRef,
  MouseEvent as ReactMouseEvent,
  ComponentPropsWithoutRef,
} from "react";

type Props = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export default function MagneticButton({
  children,
  strength = 0.35,
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
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

  return (
    <motion.button
      ref={ref}
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
