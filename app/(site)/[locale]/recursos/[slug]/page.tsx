import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/sections/Footer";
import RelatedResources from "@/components/resources/RelatedResources";
import ResourceArticle from "@/components/resources/ResourceArticle";
import { company } from "@/lib/site-content";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";
import {
  getRelatedResources,
  getResource,
  getResources,
  getResourceSlugs,
} from "@/lib/resources";

export async function generateStaticParams() {
  const slugs = await getResourceSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/recursos/[slug]">
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) return {};
  const resource = await getResource(slug);
  if (!resource) return {};
  const typedLocale = locale as Locale;
  const content = resource.content[typedLocale];
  const canonical = `${company.siteUrl}/${typedLocale}/recursos/${resource.slug}`;

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: {
      canonical,
      languages: {
        "pt-PT": `${company.siteUrl}/pt/recursos/${resource.slug}`,
        en: `${company.siteUrl}/en/recursos/${resource.slug}`,
      },
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "ATS Studio",
      title: content.seoTitle,
      description: content.seoDescription,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle,
      description: content.seoDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function ResourcePage(
  props: PageProps<"/[locale]/recursos/[slug]">
) {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const [dict, resource, resources] = await Promise.all([
    getDictionary(typedLocale),
    getResource(slug),
    getResources(),
  ]);

  if (!resource) notFound();

  const content = resource.content[typedLocale];
  const related = getRelatedResources(resource, resources);
  const articleUrl = `${company.siteUrl}/${typedLocale}/recursos/${resource.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.seoDescription,
    datePublished: resource.date,
    dateModified: resource.date,
    author: {
      "@type": "Organization",
      name: company.name,
      url: company.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: {
        "@type": "ImageObject",
        url: `${company.siteUrl}/favicon2.png`,
      },
    },
    mainEntityOfPage: articleUrl,
  };

  return (
    <>
      <Navbar locale={typedLocale} dict={dict} solid />
      <main className="relative z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ResourceArticle locale={typedLocale} resource={resource} copy={dict.resourcesPage} />
        <div className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-32">
          <RelatedResources
            locale={typedLocale}
            resources={related}
            copy={dict.resourcesPage}
          />
        </div>
      </main>
      <Footer locale={typedLocale} dict={dict} />
    </>
  );
}
