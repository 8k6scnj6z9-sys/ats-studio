import { getEntry, listEntries } from "@/lib/cms/db";
import type { Locale } from "@/lib/i18n";

export type ServicePageContent = {
  eyebrow: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  benefits: { title: string; text: string }[];
  deliverables: string[];
  proofTitle?: string;
  proofText?: string;
  faq: { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
};

export type ServicePage = {
  slug: string;
  order: number;
  serviceType: string;
  areaServed?: string[];
  proofProject?: string;
  content: Record<Locale, ServicePageContent>;
};

export async function getServicePages(): Promise<ServicePage[]> {
  const rows = await listEntries<ServicePage>("servicePage");
  return rows.map((row) => row.data).sort((a, b) => a.order - b.order);
}

export async function getServicePage(slug: string): Promise<ServicePage | undefined> {
  return (await getEntry<ServicePage>("servicePage", slug))?.data;
}
