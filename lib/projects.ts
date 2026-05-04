export type ProjectSlug =
  | "norte-coffee"
  | "pulse-analytics"
  | "lume"
  | "atelier-marques";

export type Project = {
  slug: ProjectSlug;
  name: string;
  index: string;
  year: string;
  categories: { pt: string[]; en: string[] };
  tagline: { pt: string; en: string };
  description: { pt: string; en: string };
  role: { pt: string[]; en: string[] };
  status: { pt: string; en: string };
  palette: string[];
};

export const projects: Project[] = [
  {
    slug: "norte-coffee",
    name: "Norte Coffee",
    index: "01",
    year: "2026",
    categories: {
      pt: ["E-commerce", "Branding"],
      en: ["E-commerce", "Branding"],
    },
    tagline: {
      pt: "Café de especialidade, do norte para o teu copo.",
      en: "Specialty coffee, from the north to your cup.",
    },
    description: {
      pt: "Estudo conceptual para uma torrefação artesanal portuguesa: identidade, direção fotográfica editorial, sistema de produto e checkout sem fricção.",
      en: "Conceptual study for a Portuguese artisan roastery: identity, editorial photography direction, product system and frictionless checkout.",
    },
    role: {
      pt: ["Branding", "Web Design", "Shopify Dev", "Direção de arte"],
      en: ["Branding", "Web Design", "Shopify Dev", "Art direction"],
    },
    status: { pt: "Exploração conceptual", en: "Concept exploration" },
    palette: ["#1A1410", "#C9461C", "#E8DFC9", "#FAFAF7"],
  },
  {
    slug: "pulse-analytics",
    name: "Pulse Analytics",
    index: "02",
    year: "2026",
    categories: { pt: ["SaaS", "Web App"], en: ["SaaS", "Web App"] },
    tagline: {
      pt: "Dashboard que respira com os teus dados.",
      en: "A dashboard that breathes with your data.",
    },
    description: {
      pt: "Estudo conceptual para uma plataforma B2B de analytics em tempo real, com sistema de design, componentes acessíveis e fluxos otimizados para reduzir carga cognitiva.",
      en: "Conceptual study for a real-time analytics B2B platform, with design system, accessible components and flows tuned to reduce cognitive load.",
    },
    role: {
      pt: ["UI/UX", "Design System", "Frontend Dev"],
      en: ["UI/UX", "Design System", "Frontend Dev"],
    },
    status: { pt: "Exploração conceptual", en: "Concept exploration" },
    palette: ["#0E1116", "#FF5A1F", "#22D3A4", "#FAFAF7"],
  },
  {
    slug: "lume",
    name: "Lume",
    index: "03",
    year: "2025",
    categories: {
      pt: ["Mobile", "UI Design"],
      en: ["Mobile", "UI Design"],
    },
    tagline: {
      pt: "Meditação que se adapta a ti, não o contrário.",
      en: "Meditation that adapts to you, not the other way around.",
    },
    description: {
      pt: "Estudo conceptual para uma app iOS de mindfulness com sessões generativas, identidade calma, micro-interações táteis e onboarding gamificado.",
      en: "Conceptual study for an iOS mindfulness app with generative sessions, calm identity, tactile micro-interactions and gamified onboarding.",
    },
    role: {
      pt: ["Product Design", "Branding", "Motion"],
      en: ["Product Design", "Branding", "Motion"],
    },
    status: { pt: "Exploração conceptual", en: "Concept exploration" },
    palette: ["#15141C", "#F4D8A8", "#A77BFF", "#FAFAF7"],
  },
  {
    slug: "atelier-marques",
    name: "Atelier Marquês",
    index: "04",
    year: "2025",
    categories: {
      pt: ["Branding", "Web Design"],
      en: ["Branding", "Web Design"],
    },
    tagline: {
      pt: "Arquitetura silenciosa, identidade que fala.",
      en: "Silent architecture, identity that speaks.",
    },
    description: {
      pt: "Estudo conceptual para um atelier de arquitetura em Lisboa: logótipo, papelaria, guidelines e site institucional com ritmo editorial.",
      en: "Conceptual study for a Lisbon architecture studio: logo, stationery, guidelines and an editorial website rhythm.",
    },
    role: {
      pt: ["Branding", "Identidade", "Web Design"],
      en: ["Branding", "Identity", "Web Design"],
    },
    status: { pt: "Exploração conceptual", en: "Concept exploration" },
    palette: ["#0F0F0E", "#D8D3C7", "#7A7164", "#FAFAF7"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
