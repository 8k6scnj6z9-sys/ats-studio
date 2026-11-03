import { getEntry, listEntries } from "@/lib/cms/db";
import type { Locale } from "@/lib/i18n";

export type ResourceSection = {
  heading: string;
  body: string[];
  checklist?: string[];
};

export type ResourceContent = {
  title: string;
  description: string;
  category: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: ResourceSection[];
  conclusion: string;
  cta: {
    title: string;
    text: string;
    label: string;
    href: string;
  };
};

export type Resource = {
  slug: string;
  order: number;
  date?: string;
  relatedSlugs: string[];
  content: Record<Locale, ResourceContent>;
};

export async function getResources(): Promise<Resource[]> {
  const rows = await listEntries<Resource>("resource");
  return rows.map((row) => ({ ...row.data, relatedSlugs: row.data.relatedSlugs ?? [] })).sort((a, b) => a.order - b.order);
}

export async function getResource(slug: string): Promise<Resource | undefined> {
  const row = await getEntry<Resource>("resource", slug);
  return row && { ...row.data, relatedSlugs: row.data.relatedSlugs ?? [] };
}

export async function getResourceSlugs(): Promise<string[]> {
  return (await getResources()).map((resource) => resource.slug);
}

export function getRelatedResources(
  current: Resource,
  resources: Resource[],
  limit = 3,
) {
  const preferred = current.relatedSlugs
    .map((slug) => resources.find((resource) => resource.slug === slug))
    .filter((resource): resource is Resource => Boolean(resource));
  const fallback = resources.filter(
    (resource) =>
      resource.slug !== current.slug &&
      !preferred.some((item) => item.slug === resource.slug),
  );

  return [...preferred, ...fallback].slice(0, limit);
}

export function localizedResourceHref(locale: Locale, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  if (href === "/diagnostico") return `/${locale}/diagnostico`;
  if (href === "/recursos") return `/${locale}/recursos`;
  if (href.startsWith("/recursos/")) return `/${locale}${href}`;
  if (href === "/#contact") return `/${locale}#contact`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return href.startsWith(`/${locale}`) ? href : `/${locale}${href}`;
}
