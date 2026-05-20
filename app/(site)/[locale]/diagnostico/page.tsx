import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import DiagnosticForm from "@/components/diagnostico/DiagnosticForm";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { company } from "@/lib/site-content";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/diagnostico">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const canonical = `${company.siteUrl}/${locale}/diagnostico`;
  const dict = await getDictionary(locale as Locale);
  const metadata = dict.diagnosticPage.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical,
      languages: {
        "pt-PT": `${company.siteUrl}/pt/diagnostico`,
        en: `${company.siteUrl}/en/diagnostico`,
        "x-default": `${company.siteUrl}/pt/diagnostico`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "ATS Studio",
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "ATS Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function DiagnosticoPage(props: PageProps<"/[locale]/diagnostico">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const page = dict.diagnosticPage;

  return (
    <>
      <Navbar locale={typedLocale} dict={dict} solid />
      <main className="relative z-10 overflow-hidden">
        <section className="relative min-h-screen pt-32 md:pt-40">
          <div aria-hidden className="absolute inset-0 mesh-bg opacity-60" />
          <div className="absolute left-5 right-5 top-24 border-t border-line md:left-10 md:right-10" />

          <div className="relative mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-32">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <ScrollReveal>
                  <p className="h-eyebrow flex items-center gap-3">
                    <span className="inline-block h-px w-8 bg-flame" />
                    {page.eyebrow}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.05}>
                  <h1 className="h-display mt-6 text-6xl text-balance sm:text-7xl md:text-8xl lg:text-9xl">
                    {page.title}
                  </h1>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-4 lg:pt-20">
                <ScrollReveal delay={0.12}>
                  <p className="text-xl leading-relaxed text-paper/82 text-pretty">
                    {page.subtitle}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.18}>
                  <p className="mt-6 text-sm leading-relaxed text-smoke text-pretty">
                    {page.supportCopy}
                  </p>
                </ScrollReveal>
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              <DiagnosticForm
                locale={typedLocale}
                copy={page}
                contactHref={`/${typedLocale}#contact`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer locale={typedLocale} dict={dict} />
    </>
  );
}
