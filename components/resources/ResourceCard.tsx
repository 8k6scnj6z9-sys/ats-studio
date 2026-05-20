import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Resource } from "@/lib/resources";
import ResourceMeta from "@/components/resources/ResourceMeta";

type Props = {
  resource: Resource;
  locale: Locale;
  readLabel: string;
};

export default function ResourceCard({ resource, locale, readLabel }: Props) {
  const content = resource.content[locale];

  return (
    <Link
      href={`/${locale}/recursos/${resource.slug}`}
      className="group flex min-h-[310px] flex-col justify-between rounded-xl border border-line bg-ash p-5 transition-colors hover:border-flame/70 hover:bg-ash-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink md:p-6"
    >
      <div>
        <ResourceMeta
          locale={locale}
          category={content.category}
          readTime={content.readTime}
        />
        <h3 className="mt-8 font-display text-4xl leading-none text-balance transition-colors group-hover:text-flame md:text-5xl">
          {content.title}
        </h3>
        <p className="mt-5 text-sm leading-relaxed text-paper/68">
          {content.description}
        </p>
      </div>
      <span className="mt-10 inline-flex items-center gap-3 text-sm text-paper">
        {readLabel}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
