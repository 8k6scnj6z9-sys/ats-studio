import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    project.projectKind === "product"
      ? typedLocale === "pt"
        ? "Produto digital da ATS Studio"
        : "Digital product by ATS Studio"
      : typedLocale === "pt"
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
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ATS Studio`,
      description: tagline,
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
  const typedLocale = locale as Locale;
  const projectCaseStudy = project.caseStudy?.[typedLocale];
  const features = project.features?.[typedLocale];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description[typedLocale],
    url: `https://atstudio.pt/${typedLocale}/work/${project.slug}`,
    inLanguage: typedLocale === "pt" ? "pt-PT" : "en",
    dateCreated: project.year,
    ...(project.localImage ? { image: `https://atstudio.pt${project.localImage}` } : {}),
    ...(project.projectUrl ? { sameAs: project.projectUrl } : {}),
    creator: { "@type": "Organization", name: "ATS Studio", url: "https://atstudio.pt" },
  };
  const caseStudy =
    locale === "pt"
      ? {
          goals: "Objetivos do projeto",
          beforeAfter: "Antes / depois",
          results: "Resultados esperados",
          technologies: "Tecnologias e abordagem",
          before: "Presenca inicial com oportunidades de clarificar mensagem, hierarquia visual e percurso do utilizador.",
          after: "Sistema digital mais consistente, com narrativa clara, interface cuidada e base tecnica preparada para evoluir.",
          goalsList: [
            "Aumentar credibilidade da marca",
            "Organizar conteudo e prioridades",
            "Melhorar leitura em mobile",
            "Criar uma experiencia coerente do primeiro contacto a conversao",
          ],
          resultsList: [
            "Direcao visual mais profissional",
            "Arquitetura de informacao mais clara",
            "Componentes reutilizaveis para crescimento futuro",
            "Base preparada para SEO tecnico e medicao com consentimento",
          ],
        }
      : {
          goals: "Project goals",
          beforeAfter: "Before / after",
          results: "Expected results",
          technologies: "Technologies and approach",
          before: "Initial presence with opportunities to clarify messaging, visual hierarchy and user journey.",
          after: "A more consistent digital system with clear narrative, refined interface and a technical base prepared to evolve.",
          goalsList: [
            "Increase brand credibility",
            "Organize content and priorities",
            "Improve mobile readability",
            "Create a coherent experience from first contact to conversion",
          ],
          resultsList: [
            "More professional visual direction",
            "Clearer information architecture",
            "Reusable components for future growth",
            "Base prepared for technical SEO and consent-based measurement",
          ],
        };

  if (projectCaseStudy) {
    caseStudy.goalsList = projectCaseStudy.goals;
    caseStudy.before = projectCaseStudy.before;
    caseStudy.after = projectCaseStudy.after;
    caseStudy.resultsList = projectCaseStudy.results;
    caseStudy.results =
      locale === "pt" ? "Impacto da solução" : "Solution impact";
  }

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1
    ? projects[(idx + 1) % projects.length]
    : undefined;

  return (
    <>
      <Navbar locale={locale as Locale} dict={dict} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
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
                <h1 className="h-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-balance break-words">
                  {project.name}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <p className="mt-6 text-xl md:text-2xl text-smoke max-w-2xl">
                  {tagline}
                </p>
              </ScrollReveal>
              {project.projectUrl ? (
                <ScrollReveal delay={0.1}>
                  <a
                    href={project.projectUrl}
                    data-umami-event="project-visit"
                    data-umami-event-project={project.slug}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-3 border border-line px-5 py-3 text-sm text-paper transition-colors hover:border-flame hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                  >
                    {locale === "pt" ? `Visitar o ${project.name}` : `Visit ${project.name}`}
                    <span aria-hidden>↗</span>
                  </a>
                </ScrollReveal>
              ) : null}
              {project.metrics?.length ? (
                <ScrollReveal delay={0.15}>
                  <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
                    {project.metrics.map((metric) => (
                      <div key={metric.label.pt}>
                        <dt className="sr-only">{metric.label[typedLocale]}</dt>
                        <dd className="font-display text-4xl md:text-5xl text-paper">{metric.value}</dd>
                        <dd className="mt-2 text-sm text-smoke">{metric.label[typedLocale]}</dd>
                      </div>
                    ))}
                  </dl>
                </ScrollReveal>
              ) : null}
            </div>
          </div>

          <div className="mt-16 md:mt-24">
            <ScrollReveal>
              <div aria-hidden>
                <ProjectMockup project={project} locale={locale as Locale} />
              </div>
            </ScrollReveal>
          </div>

          {project.galleryImages?.length ? (
            <section className="mt-16 md:mt-24" aria-labelledby="project-gallery-title">
              <ScrollReveal>
                <h2
                  id="project-gallery-title"
                  className="font-display text-4xl md:text-6xl"
                >
                  {locale === "pt" ? "A plataforma em detalhe." : "The platform in detail."}
                </h2>
              </ScrollReveal>
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                {project.galleryImages.map((item, index) => (
                  <ScrollReveal
                    key={item.src}
                    delay={index * 0.05}
                    className={index === 0 ? "md:col-span-2" : undefined}
                  >
                    <figure>
                      <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-line bg-ash md:rounded-xl">
                        <Image
                          src={item.src}
                          alt={item.alt[locale as Locale]}
                          fill
                          sizes={index === 0 ? "(min-width: 768px) 95vw, 100vw" : "(min-width: 768px) 48vw, 100vw"}
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">
                        {item.caption[locale as Locale]}
                      </figcaption>
                    </figure>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          ) : null}

          {features?.length ? (
            <section className="mt-16 md:mt-24" aria-labelledby="project-features-title">
              <ScrollReveal>
                <h2 id="project-features-title" className="font-display text-4xl md:text-6xl">
                  {locale === "pt" ? "O que construímos." : "What we built."}
                </h2>
              </ScrollReveal>
              <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                  <li key={feature.title} className="bg-ink p-6">
                    <h3 className="font-medium text-paper">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/65">{feature.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

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

          <div className="mt-20 md:mt-28 border-t border-line pt-10 md:pt-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
              <section className="lg:col-span-4">
                <h2 className="font-display text-4xl md:text-5xl">
                  {caseStudy.goals}
                </h2>
                <ul className="mt-6 space-y-3">
                  {caseStudy.goalsList.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-paper/72">
                      <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-flame" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="lg:col-span-4">
                <h2 className="font-display text-4xl md:text-5xl">
                  {caseStudy.beforeAfter}
                </h2>
                <div className="mt-6 grid gap-4">
                  <div className="border border-line bg-ash p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-smoke">
                      {locale === "pt" ? "Antes" : "Before"}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-paper/70">
                      {caseStudy.before}
                    </p>
                  </div>
                  <div className="border border-line bg-paper p-5 text-ink">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65">
                      {locale === "pt" ? "Depois" : "After"}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {caseStudy.after}
                    </p>
                  </div>
                </div>
              </section>

              <section className="lg:col-span-4">
                <h2 className="font-display text-4xl md:text-5xl">
                  {caseStudy.results}
                </h2>
                <ul className="mt-6 space-y-3">
                  {caseStudy.resultsList.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-paper/72">
                      <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-flame" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="mt-14 border-t border-line pt-8">
              <h2 className="font-display text-4xl md:text-5xl">
                {caseStudy.technologies}
              </h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {(project.stack?.length ? project.stack : [...cats, ...role]).map((item, index) => (
                  <span
                    key={`${project.slug}-${item}-${index}`}
                    className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper/78"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-20 md:mt-28 rounded-xl border border-line bg-ash p-8 md:p-14" aria-labelledby="project-cta-title">
            <p className="h-eyebrow">{locale === "pt" ? "Próximo projeto" : "Next project"}</p>
            <h2 id="project-cta-title" className="mt-4 font-display text-4xl md:text-6xl text-balance max-w-3xl">
              {locale === "pt" ? "Tens uma ideia para uma plataforma assim?" : "Have an idea for a platform like this?"}
            </h2>
            <p className="mt-5 max-w-2xl text-paper/70">
              {locale === "pt"
                ? "Desenhamos, desenvolvemos e alojamos produtos digitais completos, do primeiro esboço à operação diária. Conta-nos o que queres construir e respondemos com próximos passos em dias úteis."
                : "We design, build and host complete digital products, from the first sketch to day-to-day operation. Tell us what you want to build and we reply with next steps within business days."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}#contact`}
                data-umami-event="cta-contact"
                data-umami-event-project={project.slug}
                className="rounded-full bg-flame px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ash"
              >
                {locale === "pt" ? "Falar sobre o meu projeto" : "Talk about my project"}
              </Link>
              <Link
                href={`/${locale}/diagnostico`}
                data-umami-event="cta-diagnostic"
                data-umami-event-project={project.slug}
                className="rounded-full border border-line px-6 py-3 text-sm text-paper transition-colors hover:border-flame hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ash"
              >
                {locale === "pt" ? "Diagnóstico digital gratuito" : "Free digital diagnosis"}
              </Link>
            </div>
          </section>

          {next ? (
            <div className="mt-24 mb-20 border-t border-line pt-10 md:mt-40 md:mb-28">
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
          ) : (
            <div className="h-20 md:h-28" aria-hidden />
          )}
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
