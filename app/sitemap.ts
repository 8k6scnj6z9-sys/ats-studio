import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { getProcessStepSlugs } from "@/lib/process";
import { locales } from "@/lib/i18n";

const siteUrl = "https://atstudio.pt";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, processSlugs] = await Promise.all([
    getProjects(),
    getProcessStepSlugs(),
  ]);
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

  const processRoutes = locales.flatMap((locale) =>
    processSlugs.map((slug) => ({
      url: `${siteUrl}/${locale}/process/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }))
  );

  return [...staticRoutes, ...projectRoutes, ...processRoutes];
}
