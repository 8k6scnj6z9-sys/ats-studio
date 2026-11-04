import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";
import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { getServicePage } from "@/lib/service-pages";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "ATS Studio";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const page = hasLocale(locale) ? await getServicePage(slug) : undefined;
  if (!page) notFound();
  const content = page.content[locale as Locale];
  return renderOg({
    eyebrow: content.eyebrow,
    title: content.title,
    subtitle: content.seoDescription.length > 140 ? undefined : content.seoDescription,
    footer: `atstudio.pt/${locale}/servicos/${page.slug}`,
  });
}
