"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export default function DiagnosticInvite({ locale, dict }: Props) {
  const content = dict.diagnosticInvite;

  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24 section-line">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 gap-8 border border-line bg-ash/80 p-6 md:grid-cols-12 md:p-10 lg:p-12"
      >
        <div className="md:col-span-4">
          <p className="h-eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-flame" />
            {content.eyebrow}
          </p>
          <div className="mt-10 grid max-w-sm grid-cols-3 gap-px bg-line">
            {content.metrics.map((metric) => (
              <div key={metric.label} className="bg-ash-2 p-4">
                <p className="font-display text-4xl text-flame">{metric.value}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-8">
          <h2 className="h-display max-w-4xl text-5xl text-balance md:text-7xl lg:text-8xl">
            {content.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-smoke md:text-lg text-pretty">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={`/${locale}/diagnostico`}
              className="inline-flex justify-center rounded-full bg-flame px-6 py-4 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              {content.cta}
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-paper/58">
              {content.note}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
