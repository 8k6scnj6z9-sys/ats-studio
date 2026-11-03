import { getEntry, listEntries } from "./cms/db";

export type ProcessStep = {
  id: string;
  slug: string;
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  longDescription: { pt: string; en: string };
  details: { pt: string[]; en: string[] };
  outputs: { pt: string[]; en: string[] };
};

export async function getProcessSteps(): Promise<ProcessStep[]> {
  const rows = await listEntries<ProcessStep>("processStep");
  return rows.map((row) => row.data);
}

export async function getProcessStep(
  slug: string,
): Promise<ProcessStep | undefined> {
  return (await getEntry<ProcessStep>("processStep", slug))?.data;
}

export async function getProcessStepSlugs(): Promise<string[]> {
  return (await getProcessSteps()).map((step) => step.slug);
}
