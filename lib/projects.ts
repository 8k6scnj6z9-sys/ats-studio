import { sanityClient } from "./sanity";
import type { SanityImage } from "./sanity";

export type Project = {
  slug: string;
  name: string;
  index: string;
  year: string;
  categories: { pt: string[]; en: string[] };
  tagline: { pt: string; en: string };
  description: { pt: string; en: string };
  role: { pt: string[]; en: string[] };
  status: { pt: string; en: string };
  palette: string[];
  image: SanityImage | null;
  imageAlt: { pt: string; en: string };
  localImage?: string;
  galleryImages?: Array<{
    src: string;
    alt: { pt: string; en: string };
    caption: { pt: string; en: string };
  }>;
  projectUrl?: string;
  projectKind?: "concept" | "product";
  caseStudy?: {
    pt: ProjectCaseStudy;
    en: ProjectCaseStudy;
  };
};

type ProjectCaseStudy = {
  goals: string[];
  before: string;
  after: string;
  results: string[];
};

export type ProjectSlug = string;

const PROJECT_FIELDS = `
  "slug": slug.current,
  name,
  index,
  year,
  palette,
  image,
  "imageAlt": { "pt": imageAltPt, "en": imageAltEn },
  "categories": { "pt": categoriesPt, "en": categoriesEn },
  "tagline": { "pt": taglinePt, "en": taglineEn },
  "description": { "pt": descriptionPt, "en": descriptionEn },
  "role": { "pt": rolePt, "en": roleEn },
  "status": { "pt": statusPt, "en": statusEn }
`;

const ATS_AUTARQUIA_PROJECT: Project = {
  slug: "atsautarquia",
  name: "ATSAutarquia",
  index: "01",
  year: "2026",
  categories: {
    pt: ["Produto digital", "SaaS multi-tenant", "Setor público"],
    en: ["Digital product", "Multi-tenant SaaS", "Public sector"],
  },
  tagline: {
    pt: "Website, atendimento digital e gestão autárquica reunidos numa plataforma simples.",
    en: "Website, digital citizen services and local authority management brought together in one simple platform.",
  },
  description: {
    pt: "A ATS Studio concebeu e desenvolveu uma plataforma white-label para juntas e uniões de freguesia. O ATSAutarquia liga o website institucional, a área do cidadão, o backoffice da autarquia e a gestão central da plataforma numa única base técnica, segura e preparada para crescer.",
    en: "ATS Studio designed and developed a white-label platform for Portuguese parish and local councils. ATSAutarquia connects the institutional website, citizen area, council back office and central platform management through one secure technical foundation built to scale.",
  },
  role: {
    pt: ["Estratégia de produto", "UX/UI", "Desenvolvimento full-stack", "Segurança e infraestrutura"],
    en: ["Product strategy", "UX/UI", "Full-stack development", "Security and infrastructure"],
  },
  status: { pt: "Produto ativo", en: "Live product" },
  palette: ["#123B2D", "#C59A52", "#F7F4EC", "#17201D"],
  image: null,
  localImage: "/work/atsautarquia-website-anonimo.webp",
  imageAlt: {
    pt: "Exemplo anonimizado da página inicial de um portal ATSAutarquia",
    en: "Anonymised example of an ATSAutarquia portal homepage",
  },
  galleryImages: [
    {
      src: "/work/atsautarquia-contactos-anonimo.webp",
      alt: {
        pt: "Página de contactos de uma freguesia no ATSAutarquia",
        en: "Parish council contact page in ATSAutarquia",
      },
      caption: { pt: "Contactos e atendimento", en: "Contacts and citizen services" },
    },
    {
      src: "/work/atsautarquia-documentos-anonimo.webp",
      alt: {
        pt: "Arquivo de documentos públicos no ATSAutarquia",
        en: "Public document archive in ATSAutarquia",
      },
      caption: { pt: "Documentos e transparência", en: "Documents and transparency" },
    },
    {
      src: "/work/atsautarquia-area-cidadao-anonimo.webp",
      alt: {
        pt: "Ecrã de acesso à Área do Cidadão do ATSAutarquia",
        en: "ATSAutarquia citizen area sign-in screen",
      },
      caption: { pt: "Área do Cidadão", en: "Citizen area" },
    },
  ],
  projectUrl: "https://autarquias.atstudio.pt",
  projectKind: "product",
  caseStudy: {
    pt: {
      goals: [
        "Reunir website, atendimento digital e gestão de conteúdos",
        "Permitir uma identidade própria para cada freguesia",
        "Simplificar pedidos, ocorrências, marcações e comunicação com cidadãos",
        "Garantir isolamento e segurança entre organizações",
      ],
      before: "Websites, conteúdos e processos de atendimento frequentemente dispersos por ferramentas diferentes, com manutenção difícil e experiências pouco consistentes.",
      after: "Uma plataforma única e white-label, com portal público, área do cidadão, backoffice e operação ATS Studio ligados pelo mesmo sistema.",
      results: [
        "Uma base de código para múltiplas autarquias",
        "Portais personalizados sem perder consistência e acessibilidade",
        "Fluxos digitais completos, do pedido público ao tratamento interno",
        "Arquitetura preparada para novos módulos, domínios e organizações",
      ],
    },
    en: {
      goals: [
        "Bring websites, digital services and content management together",
        "Give every council its own visual identity",
        "Simplify requests, issue reporting, appointments and citizen communication",
        "Ensure secure isolation between organisations",
      ],
      before: "Websites, content and service processes were often spread across different tools, making maintenance difficult and citizen experiences inconsistent.",
      after: "One white-label platform connecting the public portal, citizen area, council back office and ATS Studio operations through the same system.",
      results: [
        "One codebase serving multiple local authorities",
        "Custom portals without compromising consistency or accessibility",
        "Complete digital workflows from public request to internal resolution",
        "An architecture ready for new modules, domains and organisations",
      ],
    },
  },
};

function mergeWithFeaturedProjects(projects: Project[]) {
  const withoutAtsAutarquia = projects.filter(
    (project) => project.slug !== ATS_AUTARQUIA_PROJECT.slug,
  );

  return [ATS_AUTARQUIA_PROJECT, ...withoutAtsAutarquia].map(
    (project, index) => ({
      ...project,
      index: String(index + 1).padStart(2, "0"),
    }),
  );
}

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await sanityClient.fetch<Project[]>(
      `*[_type == "project"] | order(index asc) { ${PROJECT_FIELDS} }`,
      {},
      { next: { tags: ["project"] } },
    );
    return mergeWithFeaturedProjects(projects);
  } catch {
    return [ATS_AUTARQUIA_PROJECT];
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug);
}
