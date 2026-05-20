"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";
import Marquee from "@/components/ui/Marquee";
import MagneticButton from "@/components/ui/MagneticButton";

type Props = { locale: Locale; dict: Dictionary };

export default function Hero({ locale, dict }: Props) {
  const statement = dict.hero.statement.split(" ");

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-24 md:pt-32 pb-6 md:pb-10">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.15 }}
        className="absolute inset-0 mesh-bg opacity-70"
      />
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="absolute left-5 right-5 md:left-10 md:right-10 top-24 origin-left border-t border-line"
      />

      <div className="mx-auto max-w-[1600px] w-full px-5 md:px-10 flex-1 flex flex-col justify-end relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-7 md:mb-10 grid grid-cols-1 md:grid-cols-12 gap-5 font-mono text-xs uppercase tracking-widest text-smoke"
        >
          <span className="md:col-span-3 text-flame">{dict.hero.eyebrow}</span>
          <span className="hidden md:block md:col-span-4">Web development / design</span>
          <span className="hidden md:block md:col-span-5 text-right">Professional digital studio · 2026</span>
        </motion.div>

        <h1 className="h-display text-[5.7rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] leading-[0.78] text-balance">
          <motion.span
            initial={{ opacity: 0, y: 110 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            ATS
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 110 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="block pl-[0.32em] italic text-flame"
          >
            Studio
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:items-end"
        >
          <div className="md:col-span-7">
            <p className="max-w-3xl text-2xl md:text-5xl font-display leading-[1.02] text-pretty">
              {statement.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
                  <motion.span
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.75,
                      delay: 0.85 + i * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`inline-block ${/presen|presence/i.test(word) ? "text-flame italic" : ""}`}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-xl text-base md:text-lg text-smoke text-pretty">
              {dict.hero.subtitle}
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end items-start md:items-end gap-4">
            <Link
              href={`/${locale}#work`}
              className="inline-block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
            >
              <MagneticButton
                as="span"
                className="group flex items-center gap-3 rounded-full border border-line px-6 py-4 text-sm transition-colors hover:bg-paper hover:text-ink"
              >
                <span>{dict.hero.cta}</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  ↓
                </span>
              </MagneticButton>
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center gap-3 px-1 py-4 text-sm text-smoke hover:text-flame transition-colors"
            >
              <span className="block w-8 h-px bg-current" />
              {dict.hero.secondaryCta}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute right-5 md:right-10 bottom-32 md:bottom-40 hidden md:flex flex-col items-center gap-3 text-smoke"
      >
        <span className="font-mono text-xs uppercase tracking-widest [writing-mode:vertical-rl]">
          {dict.hero.scroll}
        </span>
        <span className="block w-px h-12 bg-line relative overflow-hidden">
          <span className="absolute top-0 left-0 w-px h-5 bg-flame animate-[scan_2s_linear_infinite]" />
        </span>
      </motion.div>

      <div className="mt-10">
        <Marquee items={dict.marquee} />
      </div>
    </section>
  );
}
