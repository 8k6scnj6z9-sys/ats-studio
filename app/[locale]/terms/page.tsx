import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";
import { legalContent } from "../legal-content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/terms">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const content = legalContent[locale].terms;

  return {
    title: `${content.title} — ATS Studio`,
    description: content.intro,
    alternates: {
      canonical: `https://atstudio.pt/${locale}/terms`,
    },
  };
}

export default async function TermsPage(props: PageProps<"/[locale]/terms">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const content = legalContent[locale as Locale].terms;

  return (
    <>
      <Navbar locale={locale as Locale} dict={dict} />
      <main className="relative z-10 mx-auto max-w-[1100px] px-5 md:px-10 pt-36 md:pt-48 pb-24 md:pb-36">
        <Link
          href={`/${locale}`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-smoke hover:text-flame"
        >
          ← ATS Studio
        </Link>
        <p className="h-eyebrow mt-14">{content.eyebrow}</p>
        <h1 className="h-display mt-5 text-5xl md:text-7xl lg:text-8xl text-balance">
          {content.title}
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-flame">
          {content.updated}
        </p>
        <p className="mt-10 max-w-3xl text-lg md:text-xl text-paper/78 leading-relaxed">
          {content.intro}
        </p>

        <div className="mt-16 border-t border-line">
          {content.sections.map((section) => (
            <section
              key={section.title}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-line py-8 md:py-10"
            >
              <h2 className="md:col-span-4 font-display text-3xl md:text-4xl">
                {section.title}
              </h2>
              <div className="md:col-span-8 space-y-4 text-sm md:text-base leading-relaxed text-paper/72">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}
