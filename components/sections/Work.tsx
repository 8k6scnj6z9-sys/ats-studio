"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import type { Locale, Dictionary } from "@/lib/i18n";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectMockup from "@/components/mockups/ProjectMockup";

type Props = { locale: Locale; dict: Dictionary; projects: Project[] };

export default function Work({ locale, dict, projects }: Props) {
  return (
    <section
      id="work"
      className="relative py-24 md:py-40 mx-auto max-w-[1600px] px-5 md:px-10 section-line"
    >
      <SectionHeader
        eyebrow={dict.work.eyebrow}
        title={dict.work.title}
        subtitle={dict.work.subtitle}
      />

      <div className="mt-16 md:mt-24 flex flex-col gap-16 md:gap-32">
        {projects.map((p, i) => (
          <ProjectRow
            key={p.slug}
            locale={locale}
            project={p}
            dict={dict}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  locale,
  dict,
  reverse,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  reverse?: boolean;
}) {
  const cats = project.categories[locale];
  const tagline = project.tagline[locale];
  const status = project.status[locale];

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`group grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center border-t border-line pt-10 md:pt-14 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <Link
        href={`/${locale}/work/${project.slug}`}
        className="lg:col-span-7 group block"
      >
        <div className="relative overflow-hidden rounded-lg md:rounded-xl">
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.025] group-hover:-rotate-[0.35deg]">
            <ProjectMockup project={project} locale={locale} />
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-lg md:rounded-xl pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-flame origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100" />
        </div>
      </Link>

      <div className="lg:col-span-5 flex flex-col gap-5 md:pl-6">
        <div className="flex flex-wrap items-center gap-4 text-smoke">
          <span className="font-mono text-xs">{project.index}</span>
          <span className="block w-8 h-px bg-line" />
          <span className="font-mono text-xs uppercase tracking-widest">
            {project.year}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-flame">
            {status}
          </span>
        </div>

        <h3 className="h-display text-4xl md:text-6xl group-hover:text-flame">
          {project.name}
        </h3>

        <p className="text-smoke text-base md:text-lg max-w-md">{tagline}</p>

        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <span
              key={c}
              className="rounded-full border border-line text-paper/80 px-3 py-1 text-xs font-mono"
            >
              {c}
            </span>
          ))}
        </div>

        <Link
          href={`/${locale}/work/${project.slug}`}
          className="group inline-flex items-center gap-3 mt-2 text-sm text-paper hover:text-flame"
        >
          <span className="block w-12 h-px bg-paper group-hover:bg-flame transition-colors" />
          {dict.work.viewProject} →
        </Link>
      </div>
    </motion.article>
  );
}
