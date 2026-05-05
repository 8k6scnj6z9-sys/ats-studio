import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Projeto",
  type: "document",
  fieldsets: [
    { name: "pt", title: "Português", options: { collapsible: true, collapsed: false } },
    { name: "en", title: "English", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nome do projeto",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Usado em /work/[slug]. Gera a partir do nome.",
      options: { source: "name", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "index",
      title: "Índice",
      type: "string",
      description: "Numeração visual, ex.: '01', '02'. Define a ordem.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Ano",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "palette",
      title: "Paleta de cores",
      type: "array",
      of: [{ type: "string" }],
      description: "Códigos hex (ex.: #FF5A1F). 3 a 5 cores.",
      validation: (rule) => rule.min(3).max(5),
    }),
    defineField({
      name: "image",
      title: "Imagem principal",
      type: "image",
      description:
        "Imagem do projeto (mockup, fotografia, capa). Se vazio, é usado o mockup React por defeito (apenas para os 4 projetos originais).",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAltPt",
      title: "Texto alternativo da imagem (PT)",
      type: "string",
      fieldset: "pt",
      description: "Descrição curta para acessibilidade.",
    }),
    defineField({
      name: "imageAltEn",
      title: "Image alt text (EN)",
      type: "string",
      fieldset: "en",
    }),

    defineField({
      name: "categoriesPt",
      title: "Categorias",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "pt",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "taglinePt",
      title: "Tagline",
      type: "string",
      fieldset: "pt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionPt",
      title: "Descrição",
      type: "text",
      rows: 4,
      fieldset: "pt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rolePt",
      title: "Função",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "pt",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "statusPt",
      title: "Estado",
      type: "string",
      fieldset: "pt",
      initialValue: "Exploração conceptual",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "categoriesEn",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "en",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "taglineEn",
      title: "Tagline",
      type: "string",
      fieldset: "en",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionEn",
      title: "Description",
      type: "text",
      rows: 4,
      fieldset: "en",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "roleEn",
      title: "Role",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "en",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "statusEn",
      title: "Status",
      type: "string",
      fieldset: "en",
      initialValue: "Concept exploration",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Por índice",
      name: "indexAsc",
      by: [{ field: "index", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "index",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `#${subtitle}` : undefined,
      };
    },
  },
});
