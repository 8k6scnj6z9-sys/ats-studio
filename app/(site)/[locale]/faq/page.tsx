import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";
import { trustContent } from "@/lib/site-content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/faq">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const title =
    locale === "pt"
      ? "Perguntas Frequentes - ATS Studio"
      : "FAQ - ATS Studio";
  const description =
    locale === "pt"
      ? "Perguntas frequentes sobre a ATS Studio, serviços, SEO, cookies, dados, CMS e desenvolvimento digital."
      : "Frequently asked questions about ATS Studio, services, SEO, cookies, data, CMS and digital development.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://atstudio.pt/${locale}/faq`,
      languages: {
        "pt-PT": "https://atstudio.pt/pt/faq",
        en: "https://atstudio.pt/en/faq",
      },
    },
    openGraph: {
      type: "website",
      url: `https://atstudio.pt/${locale}/faq`,
      siteName: "ATS Studio",
      title,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function FaqPage(props: PageProps<"/[locale]/faq">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const content = trustContent[typedLocale];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Navbar locale={typedLocale} dict={dict} solid />
      <main className="relative z-10 mx-auto max-w-[1100px] px-5 pb-24 pt-36 md:px-10 md:pb-36 md:pt-48">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Link
          href={`/${typedLocale}`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-smoke hover:text-flame"
        >
          ← ATS Studio
        </Link>
        <p className="h-eyebrow mt-14">{content.eyebrow}</p>
        <h1 className="h-display mt-5 text-5xl text-balance md:text-7xl lg:text-8xl">
          {content.faqTitle}
        </h1>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-paper/78 md:text-xl">
          {content.subtitle}
        </p>

        <div className="mt-16 divide-y divide-line border-y border-line">
          {content.faq.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg text-paper md:text-xl">
                <span>{item.question}</span>
                <span
                  className="text-2xl text-flame transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-paper/68">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </main>
      <Footer locale={typedLocale} dict={dict} />
    </>
  );
}
