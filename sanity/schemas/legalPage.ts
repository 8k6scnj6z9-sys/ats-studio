import { defineField, defineType } from "sanity";

const legalSections = (name: "sectionsPt" | "sectionsEn") =>
  defineField({
    name,
    title: name === "sectionsPt" ? "Secções" : "Sections",
    type: "array",
    fieldset: name === "sectionsPt" ? "pt" : "en",
    of: [
      {
        type: "object",
        fields: [
          defineField({
            name: "title",
            title: name === "sectionsPt" ? "Título" : "Title",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "body",
            title: name === "sectionsPt" ? "Parágrafos" : "Paragraphs",
            type: "array",
            of: [{ type: "text", rows: 3 }],
            validation: (rule) => rule.required().min(1),
          }),
        ],
        preview: {
          select: { title: "title", body: "body" },
          prepare({ title, body }) {
            return {
              title,
              subtitle: Array.isArray(body) ? `${body.length} parágrafos` : undefined,
            };
          },
        },
      },
    ],
    validation: (rule) => rule.required().min(1),
  });

export const legalPage = defineType({
  name: "legalPage",
  title: "Páginas Legais",
  type: "document",
  fieldsets: [
    { name: "settings", title: "Definições", options: { collapsible: true, collapsed: false } },
    { name: "pt", title: "Português", options: { collapsible: true, collapsed: false } },
    { name: "en", title: "English", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "kind",
      title: "Página",
      type: "string",
      fieldset: "settings",
      options: {
        layout: "radio",
        list: [
          { title: "Política de Privacidade", value: "privacy" },
          { title: "Termos e Condições", value: "terms" },
          { title: "Política de Cookies", value: "cookies" },
        ],
      },
      validation: (rule) =>
        rule.required().custom(async (kind, context) => {
          if (!kind || typeof kind !== "string") return true;

          const id = context.document?._id?.replace(/^drafts\./, "");
          const draftId = id ? `drafts.${id}` : undefined;
          const client = context.getClient({ apiVersion: "2025-01-01" });
          const existing = await client.fetch<string | null>(
            `*[_type == "legalPage" && kind == $kind && !(_id in [$id, $draftId])][0]._id`,
            { kind, id, draftId },
          );

          return existing
            ? "Já existe uma página legal deste tipo. Edita o documento existente."
            : true;
        }),
    }),
    defineField({ name: "eyebrowPt", title: "Eyebrow", type: "string", fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "titlePt", title: "Título", type: "string", fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "updatedPt", title: "Texto de atualização", type: "string", fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "introPt", title: "Introdução", type: "text", rows: 4, fieldset: "pt", validation: (rule) => rule.required() }),
    legalSections("sectionsPt"),
    defineField({ name: "eyebrowEn", title: "Eyebrow", type: "string", fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "titleEn", title: "Title", type: "string", fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "updatedEn", title: "Updated text", type: "string", fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "introEn", title: "Introduction", type: "text", rows: 4, fieldset: "en", validation: (rule) => rule.required() }),
    legalSections("sectionsEn"),
  ],
  orderings: [
    { title: "Por página", name: "kindAsc", by: [{ field: "kind", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "titlePt",
      subtitle: "kind",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Página legal · ${subtitle}` : "Página legal",
      };
    },
  },
});
