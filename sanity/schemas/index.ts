import type { SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { processStep } from "./processStep";
import { resource } from "./resource";
import { legalPage } from "./legalPage";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  project,
  processStep,
  resource,
  legalPage,
];
