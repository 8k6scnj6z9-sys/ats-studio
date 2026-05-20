import type { Locale } from "@/lib/i18n";
import { trustContent } from "@/lib/site-content";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Props = { locale: Locale };

export default function TrustSignals({ locale }: Props) {
  const content = trustContent[locale];

  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-40 section-line">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <ScrollReveal>
            <p className="h-eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-flame" />
              {content.eyebrow}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h2 className="h-display mt-6 text-5xl text-balance md:text-7xl">
              {content.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-smoke md:text-lg">
              {content.subtitle}
            </p>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-7">
          <ScrollReveal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {content.process.map((item, index) => (
                <article key={item.title} className="border border-line bg-ash/55 p-5 md:p-6">
                  <span className="font-mono text-xs text-flame">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 font-display text-3xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/68">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <ScrollReveal>
            <h3 className="font-display text-4xl md:text-5xl">
              {content.proofTitle}
            </h3>
            <ul className="mt-8 space-y-3">
              {content.proof.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-paper/75">
                  <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-flame" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-8">
          <ScrollReveal>
            <h3 className="font-display text-4xl md:text-5xl">
              {content.testimonialsTitle}
            </h3>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {content.testimonials.map((item) => (
                <figure key={item.name} className="border-t border-line pt-5">
                  <blockquote className="text-sm leading-relaxed text-paper/72">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-5">
                    <p className="text-sm text-paper">{item.name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke">
                      {item.role}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

    </section>
  );
}
