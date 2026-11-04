import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getProcessSteps } from "@/lib/process";
import { getProject } from "@/lib/projects";
import { getServicePage } from "@/lib/service-pages";
import { company } from "@/lib/site-content";

const pageUrl = (locale: string, slug: string) => `${company.siteUrl}/${locale}/servicos/${slug}`;

export async function generateMetadata(props: PageProps<"/[locale]/servicos/[slug]">): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) return {};
  const page = await getServicePage(slug);
  if (!page) return {};
  const content = page.content[locale as Locale];
  return {
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: {
      canonical: pageUrl(locale, slug),
      languages: { "pt-PT": pageUrl("pt", slug), en: pageUrl("en", slug) },
    },
    openGraph: {
      type: "website",
      url: pageUrl(locale, slug),
      siteName: "ATS Studio",
      title: content.seoTitle,
      description: content.seoDescription,
    },
  };
}

export default async function ServicePageRoute(props: PageProps<"/[locale]/servicos/[slug]">) {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const page = await getServicePage(slug);
  if (!page) notFound();

  const [dict, steps, proof] = await Promise.all([
    getDictionary(typedLocale),
    getProcessSteps(),
    page.proofProject ? getProject(page.proofProject) : undefined,
  ]);
  const content = page.content[typedLocale];
  const pt = typedLocale === "pt";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: content.title,
      serviceType: page.serviceType,
      description: content.seoDescription,
      url: pageUrl(typedLocale, page.slug),
      areaServed: (page.areaServed ?? ["Portugal"]).map((name) => ({ "@type": "Place", name })),
      provider: {
        "@type": "ProfessionalService",
        name: company.name,
        url: company.siteUrl,
        email: company.email,
        ...(company.phone ? { telephone: company.phone } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: company.addressLocality,
          addressCountry: company.addressCountry,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <Navbar locale={typedLocale} dict={dict} solid />
      <main className="relative z-10 pt-28 md:pt-40">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <header className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <p className="h-eyebrow text-flame">{content.eyebrow}</p>
              <h1 className="h-display mt-6 text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl text-balance break-words">
                {content.title}
              </h1>
              <p className="mt-8 max-w-2xl text-lg md:text-xl text-paper/75 text-pretty">{content.intro}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href={`/${typedLocale}#contact`}
                  data-umami-event="cta-proposal"
                  data-umami-event-service={page.slug}
                  className="rounded-full bg-flame px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  {pt ? "Pedir proposta" : "Request a proposal"}
                </Link>
                <Link
                  href={`/${typedLocale}/diagnostico`}
                  data-umami-event="cta-diagnostic"
                  data-umami-event-service={page.slug}
                  className="rounded-full border border-line px-6 py-3 text-sm text-paper transition-colors hover:border-flame hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  {pt ? "Diagnóstico digital gratuito" : "Free digital diagnosis"}
                </Link>
              </div>
            </div>
          </header>

          <section className="mt-20 md:mt-28" aria-labelledby="benefits-title">
            <h2 id="benefits-title" className="font-display text-4xl md:text-6xl">
              {pt ? "O que ganhas." : "What you get."}
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {content.benefits.map((item) => (
                <li key={item.title} className="bg-ink p-6 md:p-8">
                  <h3 className="font-medium text-paper">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/65">{item.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-20 md:mt-28 grid grid-cols-1 gap-10 lg:grid-cols-12" aria-labelledby="deliverables-title">
            <h2 id="deliverables-title" className="font-display text-4xl md:text-5xl lg:col-span-4">
              {pt ? "O que inclui." : "What's included."}
            </h2>
            <ul className="lg:col-span-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {content.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-paper/80">
                  <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-flame" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {proof ? (
            <section className="mt-20 md:mt-28" aria-labelledby="proof-title">
              <Link
                href={`/${typedLocale}/work/${proof.slug}`}
                data-umami-event="service-proof"
                data-umami-event-service={page.slug}
                className="group grid grid-cols-1 overflow-hidden rounded-xl border border-line bg-ash md:grid-cols-2"
              >
                {proof.localImage ? (
                  <div className="relative aspect-[3/2] md:aspect-auto md:min-h-80">
                    <Image
                      src={proof.localImage}
                      alt={proof.imageAlt?.[typedLocale] ?? proof.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : null}
                <div className="p-8 md:p-12">
                  <p className="h-eyebrow">{pt ? "Trabalho real" : "Real work"}</p>
                  <h2 id="proof-title" className="mt-4 font-display text-3xl md:text-5xl">
                    {content.proofTitle || proof.name}
                  </h2>
                  <p className="mt-4 text-paper/70">{content.proofText || proof.tagline[typedLocale]}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm text-flame">
                    {pt ? `Ver o caso ${proof.name}` : `See the ${proof.name} case`} <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </section>
          ) : null}

          {steps.length ? (
            <section className="mt-20 md:mt-28" aria-labelledby="process-title">
              <h2 id="process-title" className="font-display text-4xl md:text-5xl">
                {pt ? "Como trabalhamos." : "How we work."}
              </h2>
              <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step) => (
                  <li key={step.slug}>
                    <Link
                      href={`/${typedLocale}/process/${step.slug}`}
                      className="block h-full rounded-lg border border-line p-6 transition-colors hover:border-flame"
                    >
                      <p className="font-mono text-xs text-flame">{step.id}</p>
                      <h3 className="mt-3 font-medium">{step.title[typedLocale]}</h3>
                      <p className="mt-2 text-sm text-paper/65">{step.description[typedLocale]}</p>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="mt-20 md:mt-28 max-w-3xl" aria-labelledby="faq-title">
            <h2 id="faq-title" className="font-display text-4xl md:text-5xl">
              {pt ? "Perguntas frequentes." : "Frequently asked questions."}
            </h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {content.faq.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-medium">
                    {item.question}
                    <span aria-hidden className="text-flame transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-paper/70">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-20 mb-24 md:mt-28 md:mb-32 rounded-xl border border-line bg-ash p-8 md:p-14" aria-labelledby="service-cta-title">
            <h2 id="service-cta-title" className="font-display text-4xl md:text-6xl text-balance max-w-3xl">
              {content.ctaTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-paper/70">{content.ctaText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${typedLocale}#contact`}
                data-umami-event="cta-contact"
                data-umami-event-service={page.slug}
                className="rounded-full bg-flame px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
              >
                {pt ? "Falar com a ATS Studio" : "Talk to ATS Studio"}
              </Link>
              <a
                href={`mailto:${company.email}`}
                data-umami-event="email-click"
                className="rounded-full border border-line px-6 py-3 text-sm text-paper transition-colors hover:border-flame hover:text-flame"
              >
                {company.email}
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={typedLocale} dict={dict} />
    </>
  );
}
