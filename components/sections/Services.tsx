"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import SectionHeader from "@/components/ui/SectionHeader";

type Props = { dict: Dictionary };

export default function Services({ dict }: Props) {
  const [openId, setOpenId] = useState<string | null>(dict.services.items[0].id);

  return (
    <section
      id="services"
      className="relative py-24 md:py-40 mx-auto max-w-[1600px] px-5 md:px-10"
    >
      <SectionHeader
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        subtitle={dict.services.subtitle}
      />

      <div className="mt-12 md:mt-20 border-t border-line">
        {dict.services.items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <motion.div
              key={item.id}
              className="border-b border-line"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-6 py-6 md:py-8 text-left hover:text-flame transition-colors"
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="font-mono text-xs text-smoke">{item.id}</span>
                  <span className="h-display text-3xl md:text-5xl lg:text-6xl">
                    {item.title}
                  </span>
                </div>
                <span
                  className={`text-2xl transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 md:pb-10 md:pl-20">
                      <p className="md:col-span-7 text-smoke text-base md:text-lg max-w-2xl">
                        {item.description}
                      </p>
                      <div className="md:col-span-5 flex flex-wrap gap-2 md:justify-end items-start">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line px-3 py-1 text-xs font-mono text-paper/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 border border-line bg-ash/70 p-6 md:p-10"
      >
        <div className="lg:col-span-4">
          <p className="h-eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-flame" />
            {dict.services.network.eyebrow}
          </p>
        </div>
        <div className="lg:col-span-8">
          <h3 className="h-display max-w-4xl text-4xl md:text-6xl text-balance">
            {dict.services.network.title}
          </h3>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-smoke text-pretty">
            {dict.services.network.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {dict.services.network.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
