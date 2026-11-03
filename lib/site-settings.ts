import { getEntry } from "@/lib/cms/db";
import { company } from "@/lib/site-content";

export type SocialLink = {
  label: string;
  url: string;
};

export type SiteSettings = {
  socialLinks: SocialLink[];
};

export const fallbackSocialLinks: SocialLink[] = [
  { label: "Instagram", url: company.social.instagram },
  { label: "LinkedIn", url: company.social.linkedin },
  { label: "Facebook", url: company.social.facebook },
];

type StoredSiteSettings = {
  socialLinks?: Partial<SocialLink>[];
};

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function normalizeSocialLinks(
  links: StoredSiteSettings["socialLinks"],
): SocialLink[] {
  if (!Array.isArray(links)) return [];

  return links
    .map((link) => ({
      label: link.label?.trim() ?? "",
      url: link.url?.trim() ?? "",
    }))
    .filter((link) => link.label && isValidHttpUrl(link.url));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = (await getEntry<StoredSiteSettings>("siteSettings", "siteSettings"))?.data;
  const socialLinks = normalizeSocialLinks(data?.socialLinks);
  if (socialLinks.length) return { socialLinks };

  return { socialLinks: fallbackSocialLinks };
}
