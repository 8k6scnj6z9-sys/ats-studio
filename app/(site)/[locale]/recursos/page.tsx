import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceCTA from "@/components/resources/ResourceCTA";
import ResourceHero from "@/components/resources/ResourceHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { company } from "@/lib/site-content";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";
import { getResources } from "@/lib/resources";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/recursos">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  const metadata = dict.resourcesPage.metadata;
  const canonical = `${company.siteUrl}/${locale}/recursos`;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical,
      languages: {
        "pt-PT": `${company.siteUrl}/pt/recursos`,
        en: `${company.siteUrl}/en/recursos`,
        "x-default": `${company.siteUrl}/pt/recursos`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "ATS Studio",
      title: metadata.title,
      description: metadata.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function ResourcesPage(props: PageProps<"/[locale]/recursos">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const [dict, resources] = await Promise.all([
    getDictionary(typedLocale),
    getResources(),
  ]);
  const copy = dict.resourcesPage;

  return (
    <>
      <Navbar locale={typedLocale} dict={dict} solid />
      <main className="relative z-10 overflow-hidden">
        <ResourceHero locale={typedLocale} copy={copy} />

        <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <p className="h-eyebrow flex items-center gap-3">
                  <span className="inline-block h-px w-8 bg-flame" />
                  {copy.gridEyebrow}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="h-display mt-6 text-5xl text-balance md:text-7xl">
                  {copy.gridTitle}
                </h2>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:col-span-8">
              {resources.map((resource, index) => (
                <ScrollReveal key={resource.slug} delay={Math.min(index * 0.04, 0.2)}>
                  <ResourceCard
                    resource={resource}
                    locale={typedLocale}
                    readLabel={copy.readArticle}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-5 pb-16 md:px-10 md:pb-24">
          <ResourceCTA
            locale={typedLocale}
            title={copy.intermediate.title}
            text={copy.intermediate.text}
            label={copy.intermediate.label}
            href="/diagnostico"
            variant="outline"
          />
        </section>

        <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-32">
          <div className="border-t border-line pt-12">
            <div className="max-w-4xl">
              <h2 className="font-display text-5xl leading-none text-balance md:text-7xl">
                {copy.final.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/72 md:text-lg">
                {copy.final.text}
              </p>
              <Link
                href={`/${typedLocale}#contact`}
                className="mt-8 inline-flex rounded-full bg-flame px-6 py-4 text-sm font-medium text-ink transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                {copy.final.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={typedLocale} dict={dict} />
    </>
  );
}
