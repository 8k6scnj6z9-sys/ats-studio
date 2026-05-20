import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Props = {
  locale: Locale;
  copy: Dictionary["resourcesPage"];
};

export default function ResourceHero({ locale, copy }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      <div aria-hidden className="absolute inset-0 mesh-bg opacity-55" />
      <div className="absolute left-5 right-5 top-24 border-t border-line md:left-10 md:right-10" />

      <div className="relative mx-auto max-w-[1600px] px-5 pb-16 md:px-10 md:pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <ScrollReveal>
              <p className="h-eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-flame" />
                {copy.eyebrow}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <h1 className="h-display mt-6 text-6xl text-balance sm:text-7xl md:text-8xl lg:text-9xl">
                {copy.title}
              </h1>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4 lg:pt-20">
            <ScrollReveal delay={0.12}>
              <p className="text-xl leading-relaxed text-paper/82 text-pretty">
                {copy.subtitle}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.18}>
              <p className="mt-6 text-sm leading-relaxed text-smoke text-pretty">
                {copy.supportCopy}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href={`/${locale}/diagnostico`}
                  className="inline-flex justify-center rounded-full bg-flame px-5 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  {copy.primaryCta}
                </Link>
                <Link
                  href={`/${locale}#contact`}
                  className="inline-flex justify-center rounded-full border border-line px-5 py-3.5 text-sm font-medium text-paper transition-colors hover:border-flame hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  {copy.secondaryCta}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
