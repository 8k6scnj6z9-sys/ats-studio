import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { getProcessStepSlugs } from "@/lib/process";
import { getResources } from "@/lib/resources";
import { locales } from "@/lib/i18n";

const siteUrl = "https://atstudio.pt";
const portalUrl = "https://portal.atstudio.pt";
const siteLastModified = "2026-06-11";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, processSlugs, resources] = await Promise.all([
    getProjects(),
    getProcessStepSlugs(),
    getResources(),
  ]);
  const staticRoutes = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      lastModified: siteLastModified,
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
      lastModified: siteLastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/${locale}/terms`,
      lastModified: siteLastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/${locale}/cookies`,
      lastModified: siteLastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/${locale}/about`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/${locale}/faq`,
      lastModified: siteLastModified,
      changeFrequency: "yearly" as const,
      priority: 0.45,
    },
    {
      url: `${siteUrl}/${locale}/diagnostico`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: locale === "pt" ? 0.8 : 0.45,
      alternates: {
        languages: {
          "pt-PT": `${siteUrl}/pt/diagnostico`,
          en: `${siteUrl}/en/diagnostico`,
        },
      },
    },
    {
      url: `${siteUrl}/${locale}/recursos`,
      lastModified: siteLastModified,
      changeFrequency: "weekly" as const,
      priority: locale === "pt" ? 0.75 : 0.45,
      alternates: {
        languages: {
          "pt-PT": `${siteUrl}/pt/recursos`,
          en: `${siteUrl}/en/recursos`,
        },
      },
    },
  ]);

  const projectRoutes = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${siteUrl}/${locale}/work/${project.slug}`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))
  );

  const processRoutes = locales.flatMap((locale) =>
    processSlugs.map((slug) => ({
      url: `${siteUrl}/${locale}/process/${slug}`,
      lastModified: siteLastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }))
  );

  const resourceRoutes = locales.flatMap((locale) =>
    resources.map((resource) => ({
      url: `${siteUrl}/${locale}/recursos/${resource.slug}`,
      lastModified: resource.date ?? siteLastModified,
      changeFrequency: "monthly" as const,
      priority: locale === "pt" ? 0.65 : 0.4,
      alternates: {
        languages: {
          "pt-PT": `${siteUrl}/pt/recursos/${resource.slug}`,
          en: `${siteUrl}/en/recursos/${resource.slug}`,
        },
      },
    }))
  );

  const portalRoutes = locales.map((locale) => ({
    url: `${portalUrl}/${locale}/login`,
    lastModified: siteLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.35,
    alternates: {
      languages: {
        "pt-PT": `${portalUrl}/pt/login`,
        en: `${portalUrl}/en/login`,
      },
    },
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...processRoutes,
    ...resourceRoutes,
    ...portalRoutes,
  ];
}
