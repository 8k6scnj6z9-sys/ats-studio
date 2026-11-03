import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { entryTypes, prune, validate, type EntryType } from "./schema.ts";

const seed = JSON.parse(readFileSync(new URL("./seed.json", import.meta.url), "utf8")) as Record<
  string,
  { key: string; data: unknown }[]
>;

test("every seed entry passes validation after pruning", () => {
  for (const [type, items] of Object.entries(seed)) {
    for (const item of items) {
      const data = prune(item.data, entryTypes[type as EntryType].optional);
      assert.deepEqual(validate(type as EntryType, data), [], `${type}:${item.key}`);
    }
  }
});

test("rejects unsafe links, image paths, bad slugs and unknown fields", () => {
  const project = structuredClone(seed.project[0].data) as Record<string, unknown>;
  const bad = { ...project, slug: "Mau Slug", projectUrl: "javascript:alert(1)", localImage: "https://x/y.png", extra: 1 };
  const errors = validate("project", bad).join("\n");
  assert.match(errors, /slug/);
  assert.match(errors, /projectUrl/);
  assert.match(errors, /localImage/);
  assert.match(errors, /extra/);
});

test("requires titles and valid related slugs", () => {
  const resource = structuredClone(seed.resource[0].data) as { content: { pt: { title: string } }; relatedSlugs: string[] };
  resource.content.pt.title = " ";
  resource.relatedSlugs = ["Não é slug"];
  const errors = validate("resource", resource).join("\n");
  assert.match(errors, /content\.pt\.title: obrigatório/);
  assert.match(errors, /relatedSlugs\[1\]/);
});

test("prune drops empty optional fields and blank list lines but keeps required ones", () => {
  const out = prune(
    { slug: "x", projectUrl: "", caseStudy: { pt: { goals: [""], before: "" } }, palette: ["#fff", " "] },
    entryTypes.project.optional,
  ) as Record<string, unknown>;
  assert.deepEqual(out, { slug: "x", palette: ["#fff"] });
});
