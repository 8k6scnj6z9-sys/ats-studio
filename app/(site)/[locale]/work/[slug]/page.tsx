import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, getDictionary, type Locale } from "@/lib/i18n";
import { getProject, getProjects, getProjectSlugs } from "@/lib/projects";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import ProjectMockup from "@/components/mockups/ProjectMockup";
import ScrollReveal from "@/components/ui/ScrollReveal";

export async function generateStaticParams() {
  const locales: Locale[] = ["pt", "en"];
  const slugs = await getProjectSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/work/[slug]">
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) return {};
  const project = await getProject(slug);
  if (!project) return {};

  const typedLocale = locale as Locale;
  const tagline = project.tagline[typedLocale];
  const url = `https://atstudio.pt/${typedLocale}/work/${project.slug}`;
  const suffix =
    typedLocale === "pt"
      ? "Estudo conceptual pela ATS Studio"
      : "Concept study by ATS Studio";

  return {
    title: `${project.name} — ${suffix}`,
    description: tagline,
    alternates: {
      canonical: url,
      languages: {
        "pt-PT": `https://atstudio.pt/pt/work/${project.slug}`,
        en: `https://atstudio.pt/en/work/${project.slug}`,
      },
    },
    openGraph: {
      type: "article",
      url,
      siteName: "ATS Studio",
      title: `${project.name} — ATS Studio`,
      description: tagline,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ATS Studio`,
      description: tagline,
      images: ["/og-image.png"],
    },
  };
}

export default async function ProjectPage(
  props: PageProps<"/[locale]/work/[slug]">
) {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const project = await getProject(slug);
  if (!project) notFound();

  const [dict, projects] = await Promise.all([
    getDictionary(locale as Locale),
    getProjects(),
  ]);
  const cats = project.categories[locale as Locale];
  const role = project.role[locale as Locale];
  const tagline = project.tagline[locale as Locale];
  const description = project.description[locale as Locale];
  const status = project.status[locale as Locale];

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <Navbar locale={locale as Locale} dict={dict} />
      <main className="relative z-10 pt-28 md:pt-36">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Link
            href={`/${locale}#work`}
            className="inline-flex items-center gap-2 text-sm text-smoke hover:text-paper"
          >
            <span aria-hidden>←</span> {dict.work.back}
          </Link>

          <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <p className="font-mono text-xs text-flame">{project.index} / {projects.length.toString().padStart(2, "0")}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-smoke">
                {status}
              </p>
            </div>
            <div className="lg:col-span-9">
              <ScrollReveal>
                <h1 className="h-display text-6xl md:text-8xl lg:text-9xl text-balance">
                  {project.name}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <p className="mt-6 text-xl md:text-2xl text-smoke max-w-2xl">
                  {tagline}
                </p>
              </ScrollReveal>
            </div>
          </div>

          <div className="mt-16 md:mt-24">
            <ScrollReveal>
              <ProjectMockup project={project} locale={locale as Locale} />
            </ScrollReveal>
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            <div className="lg:col-span-7 space-y-6">
              <p className="h-eyebrow">{dict.work.credits}</p>
              <p className="text-base md:text-lg text-paper/85 max-w-2xl">
                {description}
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-6 text-sm">
              <Field label={dict.work.year} value={project.year} />
              <Field label={dict.work.category} value={cats.join(" · ")} />
              <Field
                label={dict.work.role}
                value={role.join(", ")}
                full
              />
              <div className="col-span-2">
                <p className="h-eyebrow mb-3">{dict.work.palette}</p>
                <div className="flex gap-2">
                  {project.palette.map((c) => (
                    <div
                      key={c}
                      className="flex-1 h-12 rounded-md border border-line"
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 md:mt-40 border-t border-line pt-10">
            <Link
              href={`/${locale}/work/${next.slug}`}
              className="group flex items-center justify-between gap-6"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-smoke">
                  {dict.work.next}
                </p>
                <h3 className="h-display text-4xl md:text-6xl mt-3 group-hover:text-flame transition-colors">
                  {next.name}
                </h3>
              </div>
              <span
                aria-hidden
                className="text-3xl text-smoke group-hover:text-flame group-hover:translate-x-2 transition-all"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}

function Field({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="h-eyebrow mb-2">{label}</p>
      <p className="text-paper">{value}</p>
    </div>
  );
}
