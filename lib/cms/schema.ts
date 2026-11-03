// Content shapes edited in /admin. Arrays hold one element that describes the item shape.
type Shape = string | number | Shape[] | { [key: string]: Shape };

const loc = <T extends Shape>(value: T) => ({ pt: value, en: value });

export const entryTypes = {
  project: {
    label: "Projetos",
    singleton: false,
    shape: {
      slug: "",
      name: "",
      year: "",
      tagline: loc(""),
      description: loc(""),
      categories: loc([""]),
      role: loc([""]),
      status: loc(""),
      palette: [""],
      localImage: "",
      imageAlt: loc(""),
      galleryImages: [{ src: "", alt: loc(""), caption: loc("") }],
      projectUrl: "",
      projectKind: "",
      caseStudy: loc({ goals: [""], before: "", after: "", results: [""] }),
    },
    optional: ["localImage", "imageAlt", "galleryImages", "projectUrl", "projectKind", "caseStudy"],
  },
  processStep: {
    label: "Processo",
    singleton: false,
    shape: {
      id: "",
      slug: "",
      title: loc(""),
      description: loc(""),
      longDescription: loc(""),
      details: loc([""]),
      outputs: loc([""]),
    },
    optional: [],
  },
  resource: {
    label: "Centro de Recursos",
    singleton: false,
    shape: {
      slug: "",
      order: 0,
      date: "",
      relatedSlugs: [""],
      content: loc({
        title: "",
        description: "",
        category: "",
        readTime: "",
        seoTitle: "",
        seoDescription: "",
        intro: "",
        sections: [{ heading: "", body: [""], checklist: [""] }],
        conclusion: "",
        cta: { title: "", text: "", label: "", href: "" },
      }),
    },
    optional: ["date", "relatedSlugs", "checklist"],
  },
  legalPage: {
    label: "Páginas Legais",
    singleton: true,
    shape: loc({ eyebrow: "", title: "", updated: "", intro: "", sections: [{ title: "", body: [""] }] }),
    optional: [],
  },
  siteSettings: {
    label: "Definições do Site",
    singleton: true,
    shape: { socialLinks: [{ label: "", url: "" }] },
    optional: [],
  },
} satisfies Record<string, { label: string; singleton: boolean; shape: Shape; optional: string[] }>;

export type EntryType = keyof typeof entryTypes;

export const enums: Record<string, string[]> = { projectKind: ["", "concept", "product"] };

export const fieldLabels: Record<string, string> = {
  slug: "Slug (URL)", name: "Nome", year: "Ano", tagline: "Frase curta", description: "Descrição",
  categories: "Categorias", role: "Papel da ATS", status: "Estado", palette: "Paleta (cores hex)",
  localImage: "Imagem principal", imageAlt: "Texto alternativo da imagem", galleryImages: "Galeria",
  src: "Imagem", alt: "Texto alternativo", caption: "Legenda", projectUrl: "URL do projeto",
  projectKind: "Tipo de projeto", caseStudy: "Case study", goals: "Objetivos", before: "Antes",
  after: "Depois", results: "Resultados", id: "Número/ID", title: "Título",
  longDescription: "Descrição longa", details: "Detalhes", outputs: "Entregáveis", order: "Ordem",
  date: "Data (AAAA-MM-DD)", relatedSlugs: "Recursos relacionados (slugs)", content: "Conteúdo",
  category: "Categoria", readTime: "Tempo de leitura", seoTitle: "Título SEO",
  seoDescription: "Descrição SEO", intro: "Introdução", sections: "Secções", heading: "Título da secção",
  body: "Parágrafos", checklist: "Checklist", conclusion: "Conclusão", cta: "Chamada para ação",
  text: "Texto", label: "Etiqueta", href: "Ligação", eyebrow: "Sobretítulo", updated: "Data de atualização",
  socialLinks: "Redes sociais", url: "URL", pt: "Português", en: "English",
};

export const imageFields = new Set(["localImage", "src"]);
const linkFields = new Set(["url", "projectUrl", "href"]);
// Titles and slugs drive URLs, cards and menus, so they can never be blank.
const requiredText = new Set(["slug", "name", "title"]);
const slugFields = new Set(["slug", "relatedSlugs"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imagePattern = /^\/[\w\-./]+$/;
const linkPattern = /^(https?:\/\/|\/|mailto:|tel:)/;

export function blank(shape: Shape): unknown {
  if (Array.isArray(shape)) return [];
  if (typeof shape === "object") return Object.fromEntries(Object.entries(shape).map(([k, v]) => [k, blank(v)]));
  return shape;
}

function isEmpty(value: unknown): boolean {
  if (value === "" || value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.values(value as object).every(isEmpty);
  return false;
}

/** Drops empty optional fields and blank list items so the site sees the same shapes as before. */
export function prune(value: unknown, optional: readonly string[]): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => prune(item, optional)).filter((item) => !(typeof item === "string" && item.trim() === ""));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      const next = prune(item, optional);
      if (optional.includes(key) && isEmpty(next)) continue;
      out[key] = next;
    }
    return out;
  }
  return typeof value === "string" ? value.trim() : value;
}

/** Returns a list of problems; empty when `value` matches the shape of `type`. */
export function validate(type: EntryType, value: unknown) {
  const { shape } = entryTypes[type];
  const optional: readonly string[] = entryTypes[type].optional;
  const errors: string[] = [];

  const walk = (val: unknown, sh: Shape, path: string, key: string) => {
    if (Array.isArray(sh)) {
      if (!Array.isArray(val)) return errors.push(`${path}: deve ser uma lista`);
      if (val.length > 200) return errors.push(`${path}: demasiados itens`);
      val.forEach((item, i) => walk(item, sh[0], `${path}[${i + 1}]`, key));
      return;
    }
    if (typeof sh === "object") {
      if (!val || typeof val !== "object" || Array.isArray(val)) return errors.push(`${path}: formato inválido`);
      const obj = val as Record<string, unknown>;
      for (const extra of Object.keys(obj)) if (!(extra in sh)) errors.push(`${path}.${extra}: campo desconhecido`);
      for (const [k, s] of Object.entries(sh)) {
        if (!(k in obj)) {
          if (!optional.includes(k)) errors.push(`${path ? `${path}.` : ""}${k}: obrigatório`);
          continue;
        }
        walk(obj[k], s, path ? `${path}.${k}` : k, k);
      }
      return;
    }
    if (typeof sh === "number") {
      if (typeof val !== "number" || !Number.isFinite(val)) errors.push(`${path}: deve ser um número`);
      return;
    }
    if (typeof val !== "string") return errors.push(`${path}: deve ser texto`);
    if (val.length > 20000) errors.push(`${path}: texto demasiado longo`);
    if (requiredText.has(key) && !val.trim()) errors.push(`${path}: obrigatório`);
    if (slugFields.has(key) && val && !slugPattern.test(val)) errors.push(`${path}: use só minúsculas, números e hífenes`);
    if (imageFields.has(key) && val && !imagePattern.test(val)) errors.push(`${path}: caminho de imagem inválido`);
    if (linkFields.has(key) && val && !linkPattern.test(val)) errors.push(`${path}: ligação inválida`);
    if (enums[key] && !enums[key].includes(val)) errors.push(`${path}: valor inválido`);
  };

  walk(value, shape, "", "");
  return errors;
}
