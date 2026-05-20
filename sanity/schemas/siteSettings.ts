import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Definições do Site",
  type: "document",
  initialValue: {
    socialLinks: [
      {
        label: "Instagram",
        url: "https://www.instagram.com/atstudioagency/",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/alexandre-sim%C3%B5es-a4aaba407/",
      },
      {
        label: "Facebook",
        url: "https://www.facebook.com/profile.php?id=61589157155371",
      },
    ],
  },
  fields: [
    defineField({
      name: "socialLinks",
      title: "Redes sociais",
      description:
        "Adicionar, remover ou reordenar redes sociais usadas no site.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Nome",
              type: "string",
              description: "Ex.: Instagram, LinkedIn, TikTok, Behance.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({
                  scheme: ["http", "https"],
                  allowRelative: false,
                }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Definições do Site",
        subtitle: "Redes sociais globais",
      };
    },
  },
});
