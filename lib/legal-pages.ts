import { legalContent, type LegalContent, type LegalPageKind } from "@/lib/legal-content";
import { sanityClient } from "@/lib/sanity";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache";
import type { Locale } from "@/lib/i18n";

export type { LegalContent, LegalPageKind };

type SanityLegalPage = {
  kind?: LegalPageKind;
  content?: Partial<Record<Locale, LegalContent>>;
};

const LEGAL_FIELDS = `
  kind,
  "content": {
    "pt": {
      "eyebrow": eyebrowPt,
      "title": titlePt,
      "updated": updatedPt,
      "intro": introPt,
      "sections": sectionsPt[]{ title, body }
    },
    "en": {
      "eyebrow": eyebrowEn,
      "title": titleEn,
      "updated": updatedEn,
      "intro": introEn,
      "sections": sectionsEn[]{ title, body }
    }
  }
`;

const legalTags = (kind: LegalPageKind) => ["legalPage", `legalPage:${kind}`];

function isCompleteLegalContent(content: LegalContent | undefined): content is LegalContent {
  return Boolean(
    content?.eyebrow &&
      content.title &&
      content.updated &&
      content.intro &&
      content.sections?.length,
  );
}

export async function getLegalPage(
  locale: Locale,
  kind: LegalPageKind,
): Promise<LegalContent> {
  try {
    const data = await sanityClient.fetch<SanityLegalPage | null>(
      `*[_type == "legalPage" && kind == $kind][0] { ${LEGAL_FIELDS} }`,
      { kind },
      { next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: legalTags(kind) } },
    );
    const content = data?.content?.[locale];
    if (isCompleteLegalContent(content)) return content;
  } catch {
    // Keep legal pages available if Sanity is unavailable.
  }

  return legalContent[locale][kind];
}

export async function getLegalPages(locale: Locale) {
  const [privacy, terms, cookies] = await Promise.all([
    getLegalPage(locale, "privacy"),
    getLegalPage(locale, "terms"),
    getLegalPage(locale, "cookies"),
  ]);

  return { privacy, terms, cookies };
}
