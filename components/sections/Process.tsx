"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";

type Props = { dict: Dictionary };

export default function Process({ dict }: Props) {
  return (
    <section
      id="process"
      className="relative py-24 md:py-40 bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-xs uppercase tracking-[0.18em] text-ink/55 flex items-center gap-3"
          >
            <span className="inline-block h-px w-8 bg-flame" />
            {dict.process.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="h-display mt-6 text-5xl md:text-7xl lg:text-8xl text-balance text-ink"
          >
            {dict.process.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-lg text-ink/60 text-pretty"
          >
            {dict.process.subtitle}
          </motion.p>
        </div>

        <div className="mt-16 md:mt-24 border-t border-ink/15">
          {dict.process.steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-5 border-b border-ink/15 py-8 md:py-10 hover:text-flame transition-colors"
            >
              <span className="md:col-span-2 font-mono text-xs text-flame">{step.id}</span>
              <h3 className="md:col-span-5 h-display text-4xl md:text-6xl">
                {step.title}
              </h3>
              <div className="md:col-span-4">
                <p className="text-sm md:text-base text-ink/60 max-w-xl group-hover:text-ink/75">
                  {step.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {step.outputs.map((output) => (
                    <span
                      key={output}
                      className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/50"
                    >
                      {output}
                    </span>
                  ))}
                </div>
              </div>
              <span
                aria-hidden
                className="md:col-span-1 justify-self-start md:justify-self-end text-3xl text-ink/35 group-hover:text-flame group-hover:translate-x-2 transition-all"
              >
                →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
