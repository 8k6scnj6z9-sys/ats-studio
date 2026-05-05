#!/usr/bin/env node
/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const pt = JSON.parse(readFileSync("dictionaries/pt.json", "utf8"));
const en = JSON.parse(readFileSync("dictionaries/en.json", "utf8"));

async function main() {
  const ptSteps = pt.process.steps;
  const enSteps = en.process.steps;
  if (ptSteps.length !== enSteps.length) {
    throw new Error("PT and EN process step counts mismatch");
  }

  console.log(`→ Migrating ${ptSteps.length} process steps to Sanity (${projectId}/${dataset})`);
  const tx = client.transaction();
  for (let i = 0; i < ptSteps.length; i += 1) {
    const ptStep = ptSteps[i];
    const enStep = enSteps[i];
    const id = `processStep-${ptStep.slug}`;
    tx.createOrReplace({
      _id: id,
      _type: "processStep",
      id: ptStep.id,
      slug: { _type: "slug", current: ptStep.slug },
      titlePt: ptStep.title,
      descriptionPt: ptStep.description,
      longDescriptionPt: ptStep.longDescription,
      detailsPt: ptStep.details,
      outputsPt: ptStep.outputs,
      titleEn: enStep.title,
      descriptionEn: enStep.description,
      longDescriptionEn: enStep.longDescription,
      detailsEn: enStep.details,
      outputsEn: enStep.outputs,
    });
    console.log(`  + ${id}`);
  }
  const result = await tx.commit();
  console.log(`\n✓ Done. ${result.results.length} documents written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
