import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import TrustSignals from "@/components/sections/TrustSignals";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";
import { aboutPageContent, company } from "@/lib/site-content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/about">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const content = aboutPageContent[locale];

  return {
    title: `${content.title} - ATS Studio`,
    description: content.description,
    alternates: {
      canonical: `https://atstudio.pt/${locale}/about`,
      languages: {
        "pt-PT": "https://atstudio.pt/pt/about",
        en: "https://atstudio.pt/en/about",
      },
    },
    openGraph: {
      type: "profile",
      url: `https://atstudio.pt/${locale}/about`,
      siteName: "ATS Studio",
      title: `${content.title} - ATS Studio`,
      description: content.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function AboutPage(props: PageProps<"/[locale]/about">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const [dict] = await Promise.all([getDictionary(typedLocale)]);
  const content = aboutPageContent[typedLocale];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: content.title,
    description: content.description,
    url: `${company.siteUrl}/${typedLocale}/about`,
    mainEntity: {
      "@type": "ProfessionalService",
      name: company.name,
      founder: company.founder,
      address: {
        "@type": "PostalAddress",
        addressLocality: company.addressLocality,
        addressCountry: company.addressCountry,
      },
    },
  };

  return (
    <>
      <Navbar locale={typedLocale} dict={dict} solid />
      <main className="relative z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <section className="mx-auto max-w-[1600px] px-5 pb-20 pt-36 md:px-10 md:pb-32 md:pt-48">
          <Link
            href={`/${typedLocale}`}
            className="font-mono text-xs uppercase tracking-[0.18em] text-smoke hover:text-flame"
          >
            ← ATS Studio
          </Link>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <h1 className="h-display text-6xl text-balance md:text-8xl lg:text-9xl">
                  {content.title}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <p className="mt-8 max-w-3xl text-xl leading-relaxed text-paper/78 md:text-2xl">
                  {content.intro}
                </p>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-lg border border-line bg-paper p-6 text-ink md:p-8">
                <div className="absolute inset-0 mesh-bg opacity-35 invert" aria-hidden />
                <div className="relative">
                  <Image
                    src="/logos/logo-full-black.png"
                    alt="ATS Studio"
                    width={420}
                    height={150}
                    className="h-auto w-64"
                    priority
                    loading="eager"
                  />
                  <dl className="mt-10 space-y-4 border-t border-ink/15 pt-6 text-sm">
                    <Row label="Founder" value={company.founder} />
                    <Row label="Base" value={company.location} />
                    <Row label="Email" value={company.email} />
                    {company.phone && <Row label="Phone" value={company.phone} />}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <section className="lg:col-span-7">
              <h2 className="font-display text-4xl md:text-6xl">{content.storyTitle}</h2>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-paper/72 md:text-lg">
                {content.story}
              </p>
            </section>
            <section className="lg:col-span-5">
              <h2 className="font-display text-4xl md:text-6xl">{content.missionTitle}</h2>
              <p className="mt-6 text-base leading-relaxed text-paper/72 md:text-lg">
                {content.mission}
              </p>
            </section>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16">
            <section className="lg:col-span-4">
              <h2 className="font-display text-4xl md:text-5xl">{content.valuesTitle}</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.values.map((value) => (
                  <span key={value} className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper/78">
                    {value}
                  </span>
                ))}
              </div>
            </section>

            <section className="lg:col-span-4">
              <h2 className="font-display text-4xl md:text-5xl">{content.servicesTitle}</h2>
              <ul className="mt-6 space-y-3">
                {content.services.map((service) => (
                  <li key={service} className="flex gap-3 text-sm text-paper/72">
                    <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-flame" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="lg:col-span-4">
              <h2 className="font-display text-4xl md:text-5xl">{content.timelineTitle}</h2>
              <div className="mt-6 space-y-5">
                {content.timeline.map((item) => (
                  <article key={item.year} className="border-l border-line pl-5">
                    <p className="font-mono text-xs text-flame">{item.year}</p>
                    <p className="mt-2 text-sm leading-relaxed text-paper/72">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-20 border-t border-line pt-12">
            <h2 className="font-display text-4xl md:text-5xl">{content.techTitle}</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {dict.about.skillsList.map((tool, index) => (
                <span key={`${tool}-${index}`} className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper/78">
                  {tool}
                </span>
              ))}
            </div>
          </section>
        </section>
        <TrustSignals locale={typedLocale} />
      </main>
      <Footer locale={typedLocale} dict={dict} />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-ink/10 pb-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
        {label}
      </dt>
      <dd className="text-right text-ink/72">{value}</dd>
    </div>
  );
}
