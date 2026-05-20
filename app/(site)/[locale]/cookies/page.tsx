import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";
import { getLegalPage } from "@/lib/legal-pages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/cookies">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const content = await getLegalPage(locale as Locale, "cookies");

  return {
    title: `${content.title} - ATS Studio`,
    description: content.intro,
    alternates: {
      canonical: `https://atstudio.pt/${locale}/cookies`,
    },
  };
}

export default async function CookiesPage(
  props: PageProps<"/[locale]/cookies">
) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const [dict, content] = await Promise.all([
    getDictionary(typedLocale),
    getLegalPage(typedLocale, "cookies"),
  ]);

  return (
    <>
      <Navbar locale={typedLocale} dict={dict} solid />
      <main className="relative z-10 mx-auto max-w-[1100px] px-5 pb-24 pt-36 md:px-10 md:pb-36 md:pt-48">
        <Link
          href={`/${typedLocale}`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-smoke hover:text-flame"
        >
          ← ATS Studio
        </Link>
        <p className="h-eyebrow mt-14">{content.eyebrow}</p>
        <h1 className="h-display mt-5 text-5xl text-balance md:text-7xl lg:text-8xl">
          {content.title}
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-flame">
          {content.updated}
        </p>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-paper/78 md:text-xl">
          {content.intro}
        </p>

        <div className="mt-16 border-t border-line">
          {content.sections.map((section) => (
            <section
              key={section.title}
              className="grid grid-cols-1 gap-6 border-b border-line py-8 md:grid-cols-12 md:py-10"
            >
              <h2 className="font-display text-3xl md:col-span-4 md:text-4xl">
                {section.title}
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-paper/72 md:col-span-8 md:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer locale={typedLocale} dict={dict} />
    </>
  );
}
