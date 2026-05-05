import { defineField, defineType } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Passo do processo",
  type: "document",
  fieldsets: [
    { name: "pt", title: "Português", options: { collapsible: true, collapsed: false } },
    { name: "en", title: "English", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "id",
      title: "ID (numeração)",
      type: "string",
      description: "Ex.: '01', '02'. Define a ordem.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Igual em PT e EN. Ex.: 'discovery', 'design', 'development', 'launch'.",
      options: { source: "id", maxLength: 40 },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "titlePt",
      title: "Título",
      type: "string",
      fieldset: "pt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionPt",
      title: "Descrição curta (homepage)",
      type: "text",
      rows: 3,
      fieldset: "pt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "longDescriptionPt",
      title: "Descrição longa (página de detalhe)",
      type: "text",
      rows: 5,
      fieldset: "pt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detailsPt",
      title: "Detalhes (bullets)",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "pt",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "outputsPt",
      title: "Entregáveis (chips)",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "pt",
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: "titleEn",
      title: "Title",
      type: "string",
      fieldset: "en",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionEn",
      title: "Short description (homepage)",
      type: "text",
      rows: 3,
      fieldset: "en",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "longDescriptionEn",
      title: "Long description (detail page)",
      type: "text",
      rows: 5,
      fieldset: "en",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detailsEn",
      title: "Details (bullets)",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "en",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "outputsEn",
      title: "Deliverables (chips)",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "en",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    { title: "Por ID", name: "idAsc", by: [{ field: "id", direction: "asc" }] },
  ],
  preview: {
    select: { title: "titlePt", subtitle: "id" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `#${subtitle}` : undefined };
    },
  },
});
