import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";
import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { getProject } from "@/lib/projects";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "ATS Studio";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const project = hasLocale(locale) ? await getProject(slug) : undefined;
  if (!project) notFound();
  const typedLocale = locale as Locale;
  const pt = typedLocale === "pt";
  return renderOg({
    eyebrow: project.projectKind === "product" ? "Case study" : pt ? "Estudo conceptual" : "Concept study",
    title: project.name,
    subtitle: project.tagline[typedLocale],
    footer: `atstudio.pt/${typedLocale}/work/${project.slug}`,
    palette: project.palette,
  });
}
