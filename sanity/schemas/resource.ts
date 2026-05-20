import { defineField, defineType } from "sanity";

const articleSections = (title: string) =>
  defineField({
    name: title,
    title: title === "sectionsPt" ? "Secções do artigo" : "Article sections",
    type: "array",
    fieldset: title === "sectionsPt" ? "pt" : "en",
    of: [
      {
        type: "object",
        fields: [
          defineField({
            name: "heading",
            title: title === "sectionsPt" ? "Título da secção" : "Section heading",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "body",
            title: title === "sectionsPt" ? "Parágrafos" : "Paragraphs",
            type: "array",
            of: [{ type: "text", rows: 3 }],
            validation: (rule) => rule.required().min(1),
          }),
          defineField({
            name: "checklist",
            title: "Checklist",
            type: "array",
            of: [{ type: "string" }],
          }),
        ],
        preview: {
          select: { title: "heading", body: "body" },
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

export const resource = defineType({
  name: "resource",
  title: "Centro de Recursos",
  type: "document",
  fieldsets: [
    { name: "settings", title: "Definições", options: { collapsible: true, collapsed: false } },
    { name: "pt", title: "Português", options: { collapsible: true, collapsed: false } },
    { name: "en", title: "English", options: { collapsible: true, collapsed: true } },
    { name: "cta", title: "CTA", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título interno",
      type: "string",
      description: "Usado apenas no Studio para identificar o recurso.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Usado em /recursos/[slug].",
      options: { source: "title", maxLength: 90 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordem",
      type: "number",
      fieldset: "settings",
      initialValue: 10,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "date",
      title: "Data de publicação",
      type: "date",
      fieldset: "settings",
    }),
    defineField({
      name: "relatedResources",
      title: "Recursos relacionados",
      type: "array",
      fieldset: "settings",
      of: [{ type: "reference", to: [{ type: "resource" }] }],
      validation: (rule) => rule.max(3),
    }),

    defineField({ name: "titlePt", title: "Título", type: "string", fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "descriptionPt", title: "Descrição curta", type: "text", rows: 3, fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "categoryPt", title: "Categoria", type: "string", fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "readTimePt", title: "Tempo de leitura", type: "string", fieldset: "pt", initialValue: "6 min", validation: (rule) => rule.required() }),
    defineField({ name: "seoTitlePt", title: "SEO title", type: "string", fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "seoDescriptionPt", title: "SEO description", type: "text", rows: 2, fieldset: "pt", validation: (rule) => rule.required() }),
    defineField({ name: "introPt", title: "Introdução", type: "text", rows: 4, fieldset: "pt", validation: (rule) => rule.required() }),
    articleSections("sectionsPt"),
    defineField({ name: "conclusionPt", title: "Conclusão", type: "text", rows: 4, fieldset: "pt", validation: (rule) => rule.required() }),

    defineField({ name: "titleEn", title: "Title", type: "string", fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "descriptionEn", title: "Short description", type: "text", rows: 3, fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "categoryEn", title: "Category", type: "string", fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "readTimeEn", title: "Read time", type: "string", fieldset: "en", initialValue: "6 min", validation: (rule) => rule.required() }),
    defineField({ name: "seoTitleEn", title: "SEO title", type: "string", fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "seoDescriptionEn", title: "SEO description", type: "text", rows: 2, fieldset: "en", validation: (rule) => rule.required() }),
    defineField({ name: "introEn", title: "Introduction", type: "text", rows: 4, fieldset: "en", validation: (rule) => rule.required() }),
    articleSections("sectionsEn"),
    defineField({ name: "conclusionEn", title: "Conclusion", type: "text", rows: 4, fieldset: "en", validation: (rule) => rule.required() }),

    defineField({ name: "ctaTitlePt", title: "Título CTA", type: "string", fieldset: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaTextPt", title: "Texto CTA", type: "text", rows: 2, fieldset: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaLabelPt", title: "Botão CTA", type: "string", fieldset: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaHrefPt", title: "Link CTA", type: "string", fieldset: "cta", initialValue: "/#contact", validation: (rule) => rule.required() }),
    defineField({ name: "ctaTitleEn", title: "CTA title", type: "string", fieldset: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaTextEn", title: "CTA text", type: "text", rows: 2, fieldset: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaLabelEn", title: "CTA button", type: "string", fieldset: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaHrefEn", title: "CTA link", type: "string", fieldset: "cta", initialValue: "/#contact", validation: (rule) => rule.required() }),
  ],
  orderings: [
    { title: "Por ordem", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Mais recentes", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: {
      title: "titlePt",
      subtitle: "categoryPt",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Recurso · ${subtitle}` : "Recurso editorial",
      };
    },
  },
});
