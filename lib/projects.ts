import { listEntries } from "./cms/db";

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
  imageAlt?: { pt: string; en: string };
  localImage?: string;
  galleryImages?: Array<{
    src: string;
    alt: { pt: string; en: string };
    caption: { pt: string; en: string };
  }>;
  projectUrl?: string;
  projectKind?: "concept" | "product";
  caseStudy?: {
    pt: ProjectCaseStudy;
    en: ProjectCaseStudy;
  };
};

type ProjectCaseStudy = {
  goals: string[];
  before: string;
  after: string;
  results: string[];
};

export type ProjectSlug = string;

export async function getProjects(): Promise<Project[]> {
  const rows = await listEntries<Project>("project");
  // The index shown on the site follows the order set in /admin.
  return rows.map((row, i) => ({ ...row.data, index: String(i + 1).padStart(2, "0") }));
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug);
}
