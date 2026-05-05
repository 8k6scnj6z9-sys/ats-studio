import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, getDictionary, locales, type Locale } from "@/lib/i18n";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";

const stepSlugs = ["discovery", "design", "development", "launch"] as const;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    stepSlugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/process/[slug]">
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  const step = dict.process.steps.find((s) => s.slug === slug);
  if (!step) return {};

  const url = `https://atstudio.pt/${locale}/process/${step.slug}`;
  const title = `${step.title} — ${dict.process.eyebrow} | ATS Studio`;

  return {
    title,
    description: step.longDescription,
    alternates: {
      canonical: url,
      languages: {
        "pt-PT": `https://atstudio.pt/pt/process/${step.slug}`,
        en: `https://atstudio.pt/en/process/${step.slug}`,
      },
    },
    openGraph: {
      type: "article",
      url,
      siteName: "ATS Studio",
      title,
      description: step.longDescription,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: step.longDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function ProcessStepPage(
  props: PageProps<"/[locale]/process/[slug]">
) {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const idx = dict.process.steps.findIndex((s) => s.slug === slug);
  if (idx === -1) notFound();
  const step = dict.process.steps[idx];
  const next = dict.process.steps[(idx + 1) % dict.process.steps.length];

  return (
    <>
      <Navbar locale={locale as Locale} dict={dict} solid />
      <main className="relative z-10 pt-28 md:pt-36 bg-paper text-ink">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 pb-24 md:pb-40">
          <Link
            href={`/${locale}#process`}
            className="inline-flex items-center gap-2 text-sm text-ink/55 hover:text-ink"
          >
            <span aria-hidden>←</span> {dict.process.back}
          </Link>

          <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <p className="font-mono text-xs text-flame">
                {step.id} / {dict.process.steps.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-ink/55">
                {dict.process.stepLabel} {step.id}
              </p>
            </div>
            <div className="lg:col-span-9">
              <ScrollReveal>
                <h1 className="h-display text-6xl md:text-8xl lg:text-9xl text-balance text-ink">
                  {step.title}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <p className="mt-6 text-xl md:text-2xl text-ink/65 max-w-3xl text-pretty">
                  {step.longDescription}
                </p>
              </ScrollReveal>
            </div>
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/55 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-flame" />
                {dict.process.details}
              </p>
              <ul className="mt-8 border-t border-ink/15">
                {step.details.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-b border-ink/15 py-5 text-base md:text-lg text-ink/80"
                  >
                    <span aria-hidden className="mt-2 inline-block h-px w-4 bg-flame shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/55 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-flame" />
                {dict.process.deliverables}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {step.outputs.map((output) => (
                  <span
                    key={output}
                    className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/55"
                  >
                    {output}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 md:mt-40 border-t border-ink/15 pt-10">
            <Link
              href={`/${locale}/process/${next.slug}`}
              className="group flex items-center justify-between gap-6"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink/55">
                  {dict.process.next}
                </p>
                <h3 className="h-display text-4xl md:text-6xl mt-3 text-ink group-hover:text-flame transition-colors">
                  {next.title}
                </h3>
              </div>
              <span
                aria-hidden
                className="text-3xl text-ink/35 group-hover:text-flame group-hover:translate-x-2 transition-all"
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
