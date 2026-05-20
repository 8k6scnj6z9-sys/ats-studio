import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityConfig } from "./lib/sanity";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "ats-studio",
  title: "ATS Studio",
  basePath: "/studio",
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Conteúdo ATS Studio")
          .items([
            S.listItem()
              .title("Definições do Site")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Definições do Site"),
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Projetos"),
            S.documentTypeListItem("processStep").title("Processo"),
            S.documentTypeListItem("resource").title("Centro de Recursos"),
            S.documentTypeListItem("legalPage").title("Páginas Legais"),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
