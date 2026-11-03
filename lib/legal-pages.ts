import { legalContent, type LegalContent, type LegalPageKind } from "@/lib/legal-content";
import { getEntry } from "@/lib/cms/db";
import type { Locale } from "@/lib/i18n";

export type { LegalContent, LegalPageKind };

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
  const content = (await getEntry<Record<Locale, LegalContent>>("legalPage", kind))?.data[locale];
  if (isCompleteLegalContent(content)) return content;

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
