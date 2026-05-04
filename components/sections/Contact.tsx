"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Props = { dict: Dictionary };
type Status = "idle" | "sending" | "success" | "error";

export default function Contact({ dict }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  };

  const c = dict.contact;
  const f = c.form;

  return (
    <section
      id="contact"
      className="relative py-24 md:py-40 mx-auto max-w-[1600px] px-5 md:px-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
        <div className="lg:col-span-7">
          <ScrollReveal>
            <p className="h-eyebrow flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-flame" />
              {c.eyebrow}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h2 className="h-display mt-6 text-5xl md:text-7xl lg:text-8xl text-balance">
              {c.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-lg text-smoke max-w-md">{c.subtitle}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <a
              href={`mailto:${c.email}`}
              className="block mt-10 font-display text-3xl md:text-5xl underline decoration-flame decoration-2 underline-offset-8 hover:text-flame transition-colors break-all"
            >
              {c.email}
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-10">
              <p className="font-mono text-xs uppercase tracking-widest text-smoke">
                {c.projectTypes.title}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.projectTypes.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm">
              {Object.entries(c.social).map(([k, social]) => (
                <a
                  key={k}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-paper/80 hover:text-flame"
                >
                  <span>{social.label}</span>
                  <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-5">
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            onSubmit={onSubmit}
            className="rounded-xl md:rounded-2xl border border-line p-6 md:p-8 bg-ash"
          >
            <Field
              id="name"
              label={f.name}
              placeholder={f.namePlaceholder}
              required
            />
            <Field
              id="email"
              label={f.email}
              type="email"
              placeholder={f.emailPlaceholder}
              required
            />
            <div className="mb-6">
              <label
                htmlFor="message"
                className="font-mono text-xs uppercase tracking-widest text-smoke block mb-2"
              >
                {f.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder={f.messagePlaceholder}
                className="w-full bg-transparent border-b border-line py-3 text-base text-paper placeholder:text-smoke/60 focus:outline-none focus:border-flame resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-flame text-ink py-4 text-sm font-medium hover:bg-paper transition-colors disabled:opacity-60"
            >
              {status === "sending" ? f.sending : f.submit}
            </button>

            {status === "success" && (
              <p className="mt-4 text-sm text-flame">{f.success}</p>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-red-400">{f.error}</p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-widest text-smoke block mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-line py-3 text-base text-paper placeholder:text-smoke/60 focus:outline-none focus:border-flame"
      />
    </div>
  );
}
