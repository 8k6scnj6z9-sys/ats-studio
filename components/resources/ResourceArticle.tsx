import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Resource } from "@/lib/resources";
import ResourceCTA from "@/components/resources/ResourceCTA";
import ResourceMeta from "@/components/resources/ResourceMeta";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Props = {
  locale: Locale;
  resource: Resource;
  copy: Dictionary["resourcesPage"];
};

export default function ResourceArticle({ locale, resource, copy }: Props) {
  const content = resource.content[locale];
  const headings = content.sections.map((section) => ({
    label: section.heading,
    id: toHeadingId(section.heading),
  }));

  return (
    <article className="mx-auto max-w-[1600px] px-5 pb-20 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Link
        href={`/${locale}/recursos`}
        className="font-mono text-xs uppercase tracking-[0.18em] text-smoke transition-colors hover:text-flame"
      >
        ← {copy.article.back}
      </Link>

      <header className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-3">
          <ResourceMeta
            locale={locale}
            category={content.category}
            readTime={content.readTime}
            date={resource.date}
            publishedLabel={copy.article.published}
          />
        </div>
        <div className="lg:col-span-9">
          <ScrollReveal>
            <h1 className="h-display text-5xl text-balance md:text-7xl lg:text-8xl">
              {content.title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-paper/78 md:text-2xl">
              {content.intro}
            </p>
          </ScrollReveal>
        </div>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-3">
          <div className="sticky top-32 hidden rounded-xl border border-line bg-ash p-5 lg:block">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-flame">
              {copy.article.contents}
            </h2>
            <nav aria-label={copy.article.contents} className="mt-5">
              <ol className="space-y-3">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className="text-sm leading-relaxed text-paper/68 transition-colors hover:text-paper"
                    >
                      {heading.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-7">
          <div className="space-y-14">
            {content.sections.map((section, index) => (
              <section key={section.heading} id={headings[index].id} className="scroll-mt-32">
                <ScrollReveal>
                  <h2 className="font-display text-4xl leading-none text-balance md:text-5xl">
                    {section.heading}
                  </h2>
                </ScrollReveal>
                <div className="mt-6 space-y-5 text-base leading-relaxed text-paper/74 md:text-lg">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.checklist?.length ? (
                  <div className="mt-8 rounded-xl border border-line bg-ash p-5 md:p-6">
                    <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-flame">
                      {copy.article.checklist}
                    </h3>
                    <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {section.checklist.map((item) => (
                        <li key={item} className="flex gap-3 text-sm text-paper/72">
                          <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-flame" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-16 border-t border-line pt-10">
            <p className="text-xl leading-relaxed text-paper/82">
              {content.conclusion}
            </p>
          </section>

          <div className="mt-12">
            <ResourceCTA
              locale={locale}
              title={content.cta.title}
              text={content.cta.text}
              label={content.cta.label}
              href={content.cta.href}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function toHeadingId(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
