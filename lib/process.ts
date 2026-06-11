import { sanityClient } from "./sanity";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache";

export type ProcessStep = {
  id: string;
  slug: string;
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  longDescription: { pt: string; en: string };
  details: { pt: string[]; en: string[] };
  outputs: { pt: string[]; en: string[] };
};

const STEP_FIELDS = `
  id,
  "slug": slug.current,
  "title": { "pt": titlePt, "en": titleEn },
  "description": { "pt": descriptionPt, "en": descriptionEn },
  "longDescription": { "pt": longDescriptionPt, "en": longDescriptionEn },
  "details": { "pt": detailsPt, "en": detailsEn },
  "outputs": { "pt": outputsPt, "en": outputsEn }
`;

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return sanityClient.fetch<ProcessStep[]>(
    `*[_type == "processStep"] | order(id asc) { ${STEP_FIELDS} }`,
    {},
    { next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: ["processStep"] } },
  );
}

export async function getProcessStep(
  slug: string,
): Promise<ProcessStep | undefined> {
  const data = await sanityClient.fetch<ProcessStep | null>(
    `*[_type == "processStep" && slug.current == $slug][0] { ${STEP_FIELDS} }`,
    { slug },
    {
      next: {
        revalidate: CONTENT_REVALIDATE_SECONDS,
        tags: ["processStep", `processStep:${slug}`],
      },
    },
  );
  return data ?? undefined;
}

export async function getProcessStepSlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(
    `*[_type == "processStep" && defined(slug.current)] | order(id asc).slug.current`,
    {},
    { next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: ["processStep"] } },
  );
}
