import type { Dictionary, Locale } from "@/lib/i18n";
import type { Resource } from "@/lib/resources";
import ResourceCard from "@/components/resources/ResourceCard";

type Props = {
  locale: Locale;
  resources: Resource[];
  copy: Dictionary["resourcesPage"];
};

export default function RelatedResources({ locale, resources, copy }: Props) {
  if (!resources.length) return null;

  return (
    <section className="border-t border-line pt-12">
      <h2 className="font-display text-4xl md:text-5xl">
        {copy.article.related}
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.slug}
            resource={resource}
            locale={locale}
            readLabel={copy.readArticle}
          />
        ))}
      </div>
    </section>
  );
}
