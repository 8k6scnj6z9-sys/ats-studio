"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function ScrollReveal({
  children,
  delay = 0,
  y,
  className,
  once = true,
}: Props) {
  const custom = y !== undefined ? { hidden: { opacity: 0, y } } : undefined;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      variants={{ ...variants, ...custom }}
    >
      {children}
    </motion.div>
  );
}
