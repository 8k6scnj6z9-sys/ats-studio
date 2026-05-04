"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import SectionHeader from "@/components/ui/SectionHeader";

type Props = { dict: Dictionary };

export default function Audience({ dict }: Props) {
  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-40 section-line">
      <SectionHeader
        eyebrow={dict.audience.eyebrow}
        title={dict.audience.title}
        subtitle={dict.audience.subtitle}
      />

      <div className="mt-14 grid grid-cols-1 gap-px bg-line md:mt-20 md:grid-cols-2">
        {dict.audience.items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group min-h-[240px] bg-ink p-6 transition-colors hover:bg-ash md:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-flame">{item.id}</span>
              <span className="h-px w-10 origin-left scale-x-50 bg-paper/25 transition-transform group-hover:scale-x-100 group-hover:bg-flame" />
            </div>
            <h3 className="h-display mt-14 text-4xl text-paper transition-colors group-hover:text-flame md:text-6xl">
              {item.title}
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-smoke md:text-base">
              {item.description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
