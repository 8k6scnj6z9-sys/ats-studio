import type { SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { processStep } from "./processStep";

export const schemaTypes: SchemaTypeDefinition[] = [project, processStep];
