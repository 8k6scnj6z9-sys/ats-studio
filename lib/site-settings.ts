import { sanityClient } from "@/lib/sanity";
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

type SanitySiteSettings = {
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
  links: SanitySiteSettings["socialLinks"],
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
  try {
    const data = await sanityClient.fetch<SanitySiteSettings | null>(
      `*[_type == "siteSettings" && _id == "siteSettings"][0] {
        socialLinks[]{ label, url }
      }`,
      {},
      { next: { tags: ["siteSettings"] } },
    );
    const socialLinks = normalizeSocialLinks(data?.socialLinks);
    if (socialLinks.length) return { socialLinks };
  } catch {
    // Keep global site details available if Sanity is unavailable.
  }

  return { socialLinks: fallbackSocialLinks };
}
