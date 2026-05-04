import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { locales } from "@/lib/i18n";

const siteUrl = "https://atstudio.pt";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: locale === "pt" ? 1 : 0.9,
      alternates: {
        languages: {
          "pt-PT": `${siteUrl}/pt`,
          en: `${siteUrl}/en`,
        },
      },
    },
    {
      url: `${siteUrl}/${locale}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/${locale}/terms`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]);

  const projectRoutes = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${siteUrl}/${locale}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))
  );

  return [...staticRoutes, ...projectRoutes];
}
