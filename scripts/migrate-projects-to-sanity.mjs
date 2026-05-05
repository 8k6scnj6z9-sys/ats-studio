#!/usr/bin/env node
/* eslint-disable no-console */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const projects = [
  {
    slug: "norte-coffee",
    name: "Norte Coffee",
    index: "01",
    year: "2026",
    palette: ["#1A1410", "#C9461C", "#E8DFC9", "#FAFAF7"],
    categoriesPt: ["E-commerce", "Branding"],
    categoriesEn: ["E-commerce", "Branding"],
    taglinePt: "Café de especialidade, do norte para o teu copo.",
    taglineEn: "Specialty coffee, from the north to your cup.",
    descriptionPt:
      "Estudo conceptual para uma torrefação artesanal portuguesa: identidade, direção fotográfica editorial, sistema de produto e checkout sem fricção.",
    descriptionEn:
      "Conceptual study for a Portuguese artisan roastery: identity, editorial photography direction, product system and frictionless checkout.",
    rolePt: ["Branding", "Web Design", "Shopify Dev", "Direção de arte"],
    roleEn: ["Branding", "Web Design", "Shopify Dev", "Art direction"],
    statusPt: "Exploração conceptual",
    statusEn: "Concept exploration",
  },
  {
    slug: "pulse-analytics",
    name: "Pulse Analytics",
    index: "02",
    year: "2026",
    palette: ["#0E1116", "#FF5A1F", "#22D3A4", "#FAFAF7"],
    categoriesPt: ["SaaS", "Web App"],
    categoriesEn: ["SaaS", "Web App"],
    taglinePt: "Dashboard que respira com os teus dados.",
    taglineEn: "A dashboard that breathes with your data.",
    descriptionPt:
      "Estudo conceptual para uma plataforma B2B de analytics em tempo real, com sistema de design, componentes acessíveis e fluxos otimizados para reduzir carga cognitiva.",
    descriptionEn:
      "Conceptual study for a real-time analytics B2B platform, with design system, accessible components and flows tuned to reduce cognitive load.",
    rolePt: ["UI/UX", "Design System", "Frontend Dev"],
    roleEn: ["UI/UX", "Design System", "Frontend Dev"],
    statusPt: "Exploração conceptual",
    statusEn: "Concept exploration",
  },
  {
    slug: "lume",
    name: "Lume",
    index: "03",
    year: "2025",
    palette: ["#15141C", "#F4D8A8", "#A77BFF", "#FAFAF7"],
    categoriesPt: ["Mobile", "UI Design"],
    categoriesEn: ["Mobile", "UI Design"],
    taglinePt: "Meditação que se adapta a ti, não o contrário.",
    taglineEn: "Meditation that adapts to you, not the other way around.",
    descriptionPt:
      "Estudo conceptual para uma app iOS de mindfulness com sessões generativas, identidade calma, micro-interações táteis e onboarding gamificado.",
    descriptionEn:
      "Conceptual study for an iOS mindfulness app with generative sessions, calm identity, tactile micro-interactions and gamified onboarding.",
    rolePt: ["Product Design", "Branding", "Motion"],
    roleEn: ["Product Design", "Branding", "Motion"],
    statusPt: "Exploração conceptual",
    statusEn: "Concept exploration",
  },
  {
    slug: "atelier-marques",
    name: "Atelier Marquês",
    index: "04",
    year: "2025",
    palette: ["#0F0F0E", "#D8D3C7", "#7A7164", "#FAFAF7"],
    categoriesPt: ["Branding", "Web Design"],
    categoriesEn: ["Branding", "Web Design"],
    taglinePt: "Arquitetura silenciosa, identidade que fala.",
    taglineEn: "Silent architecture, identity that speaks.",
    descriptionPt:
      "Estudo conceptual para um atelier de arquitetura em Lisboa: logótipo, papelaria, guidelines e site institucional com ritmo editorial.",
    descriptionEn:
      "Conceptual study for a Lisbon architecture studio: logo, stationery, guidelines and an editorial website rhythm.",
    rolePt: ["Branding", "Identidade", "Web Design"],
    roleEn: ["Branding", "Identity", "Web Design"],
    statusPt: "Exploração conceptual",
    statusEn: "Concept exploration",
  },
];

async function main() {
  console.log(`→ Migrating ${projects.length} projects to Sanity (${projectId}/${dataset})`);
  const tx = client.transaction();
  for (const p of projects) {
    const id = `project-${p.slug}`;
    tx.createOrReplace({
      _id: id,
      _type: "project",
      slug: { _type: "slug", current: p.slug },
      name: p.name,
      index: p.index,
      year: p.year,
      palette: p.palette,
      categoriesPt: p.categoriesPt,
      categoriesEn: p.categoriesEn,
      taglinePt: p.taglinePt,
      taglineEn: p.taglineEn,
      descriptionPt: p.descriptionPt,
      descriptionEn: p.descriptionEn,
      rolePt: p.rolePt,
      roleEn: p.roleEn,
      statusPt: p.statusPt,
      statusEn: p.statusEn,
    });
    console.log(`  + ${id}`);
  }
  const result = await tx.commit();
  console.log(`\n✓ Done. ${result.results.length} documents written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
