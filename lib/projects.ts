import { sanityClient } from "./sanity";
import type { SanityImage } from "./sanity";

export type Project = {
  slug: string;
  name: string;
  index: string;
  year: string;
  categories: { pt: string[]; en: string[] };
  tagline: { pt: string; en: string };
  description: { pt: string; en: string };
  role: { pt: string[]; en: string[] };
  status: { pt: string; en: string };
  palette: string[];
  image: SanityImage | null;
  imageAlt: { pt: string; en: string };
};

export type ProjectSlug = string;

const PROJECT_FIELDS = `
  "slug": slug.current,
  name,
  index,
  year,
  palette,
  image,
  "imageAlt": { "pt": imageAltPt, "en": imageAltEn },
  "categories": { "pt": categoriesPt, "en": categoriesEn },
  "tagline": { "pt": taglinePt, "en": taglineEn },
  "description": { "pt": descriptionPt, "en": descriptionEn },
  "role": { "pt": rolePt, "en": roleEn },
  "status": { "pt": statusPt, "en": statusEn }
`;

export async function getProjects(): Promise<Project[]> {
  return sanityClient.fetch<Project[]>(
    `*[_type == "project"] | order(index asc) { ${PROJECT_FIELDS} }`,
    {},
    { next: { revalidate: 60, tags: ["project"] } },
  );
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const data = await sanityClient.fetch<Project | null>(
    `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
    { slug },
    { next: { revalidate: 60, tags: ["project", `project:${slug}`] } },
  );
  return data ?? undefined;
}

export async function getProjectSlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(
    `*[_type == "project" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 60, tags: ["project"] } },
  );
}
