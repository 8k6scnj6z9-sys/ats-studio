import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Props = { dict: Dictionary };

export default function About({ dict }: Props) {
  return (
    <section
      id="about"
      className="relative py-24 md:py-40 mx-auto max-w-[1600px] px-5 md:px-10 section-line"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
        <div className="lg:col-span-7">
          <SectionHeader
            eyebrow={dict.about.eyebrow}
            title={dict.about.title}
          />
          <div className="mt-10 md:mt-14 space-y-6 text-base md:text-lg text-paper/85 max-w-2xl">
            <ScrollReveal>
              <p>{dict.about.p1}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <p>{dict.about.p2}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="italic text-flame">{dict.about.p3}</p>
            </ScrollReveal>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <ScrollReveal>
            <div className="relative min-h-[560px] rounded-lg overflow-hidden bg-paper text-ink border border-line p-6 md:p-8 flex flex-col justify-between">
              <div className="absolute inset-0 mesh-bg opacity-40 invert" aria-hidden />
              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                      {dict.about.card.label}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-3 border-b border-ink/15 pb-5">
                      <Image
                        src="/logos/logo-mark-black.png"
                        alt="ATS Studio"
                        width={72}
                        height={72}
                        className="h-14 w-14 object-contain"
                      />
                      <Image
                        src="/logos/logo-full-black.png"
                        alt="ATS Studio"
                        width={420}
                        height={150}
                        className="h-auto w-48 md:w-56 object-contain"
                        loading="eager"
                      />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-ink/45">
                    40.5373° N
                  </span>
                </div>

                <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink/62">
                  {dict.about.card.note}
                </p>
              </div>

              <div className="relative mt-12">
                <p className="font-display text-4xl md:text-6xl leading-[0.9]">
                  Alexandre
                  <br />
                  <span className="italic text-flame">Terras Simões</span>
                </p>
                <div className="mt-7 grid grid-cols-1 gap-3 border-t border-ink/15 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/55">
                  <div className="flex items-center justify-between gap-4">
                    <span>{dict.about.card.founder}</span>
                    <span className="text-right">{dict.about.card.location}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>{dict.about.card.focus}</span>
                    <span className="text-right">{dict.about.card.availability}</span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {dict.about.card.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="border border-ink/15 p-3 min-h-24 flex flex-col justify-between"
                    >
                      <span className="font-display text-2xl text-flame">
                        {metric.value}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/50">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div>
              <p className="h-eyebrow mb-4">{dict.about.skills}</p>
              <ul className="flex flex-wrap gap-2">
                {dict.about.skillsList.map((s, index) => (
                  <li
                    key={`${s}-${index}`}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-mono text-paper/80"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
