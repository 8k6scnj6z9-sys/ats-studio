import type { Locale } from "@/lib/i18n";

type TrustContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  processTitle: string;
  process: { title: string; text: string }[];
  proofTitle: string;
  proof: string[];
  testimonialsTitle: string;
  testimonials: { quote: string; name: string; role: string }[];
  faqTitle: string;
  faq: { question: string; answer: string }[];
};

type AboutPageContent = {
  title: string;
  description: string;
  intro: string;
  storyTitle: string;
  story: string;
  missionTitle: string;
  mission: string;
  valuesTitle: string;
  values: string[];
  timelineTitle: string;
  timeline: { year: string; text: string }[];
  servicesTitle: string;
  services: string[];
  techTitle: string;
};

export const company = {
  name: "ATS Studio",
  legalName: "ATS Studio - Alexandre Terras Simões",
  founder: "Alexandre Terras Simões",
  email: "geral@atstudio.pt",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+351 963 983 519",
  location: "Guarda, Portugal",
  addressLocality: "Guarda",
  addressCountry: "PT",
  siteUrl: "https://atstudio.pt",
  social: {
    instagram: "https://www.instagram.com/atstudioagency/",
    linkedin: "https://www.linkedin.com/in/alexandre-sim%C3%B5es-a4aaba407/",
    facebook: "https://www.facebook.com/profile.php?id=61589157155371",
  },
};

export const footerContent = {
  pt: {
    description:
      "Estúdio digital independente na Guarda, focado em websites profissionais, identidades digitais, interfaces e sistemas web preparados para uma presença online clara e fiável.",
    contact: "Contacto",
    location: "Localização",
    social: "Redes sociais",
    legal: "Legal",
    privacy: "Política de Privacidade",
    terms: "Termos e Condições",
    cookies: "Política de Cookies",
    faq: "Perguntas Frequentes",
    resources: "Centro de Recursos",
    rights: "Todos os direitos reservados.",
  },
  en: {
    description:
      "Independent digital studio in Guarda, focused on professional websites, digital identities, interfaces and web systems built for a clear and reliable online presence.",
    contact: "Contact",
    location: "Location",
    social: "Social",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    cookies: "Cookie Policy",
    faq: "FAQ",
    resources: "Resource Center",
    rights: "All rights reserved.",
  },
} satisfies Record<Locale, Record<string, string>>;

export const trustContent = {
  pt: {
    eyebrow: "Confiança e método",
    title: "Uma presença digital profissional, transparente e preparada para relações de longo prazo.",
    subtitle:
      "Cada projeto combina estratégia, design, desenvolvimento e critérios de conformidade para que a marca comunique com clareza desde o primeiro contacto.",
    processTitle: "Fluxo de trabalho",
    process: [
      {
        title: "Diagnóstico",
        text: "Clarificamos objetivos, público, conteúdo, riscos e requisitos técnicos antes de propor uma solução.",
      },
      {
        title: "Direção visual",
        text: "Definimos estrutura, narrativa, UI e identidade para criar uma experiência consistente e acessível.",
      },
      {
        title: "Desenvolvimento",
        text: "Implementamos com código moderno, performance, SEO técnico e boas práticas de manutenção.",
      },
      {
        title: "Validação",
        text: "Testamos responsividade, formulários, metadados, acessibilidade e integrações antes da publicação.",
      },
    ],
    proofTitle: "Sinais de segurança",
    proof: [
      "Comunicação direta com o fundador",
      "Propostas e entregáveis documentados",
      "Políticas legais públicas e claras",
      "Consentimento de cookies antes de analytics",
      "Arquitetura preparada para manutenção",
      "Foco em acessibilidade e desempenho",
    ],
    testimonialsTitle: "Comentários profissionais",
    testimonials: [
      {
        quote:
          "A ATS Studio trouxe clareza ao posicionamento e transformou a presença digital num sistema mais profissional e fácil de gerir.",
        name: "Cliente de serviços locais",
        role: "Website institucional",
      },
      {
        quote:
          "O processo foi organizado, com boa comunicação, critérios visuais fortes e atenção aos detalhes técnicos.",
        name: "Projeto de marca",
        role: "Branding e web design",
      },
      {
        quote:
          "A abordagem foi prática e transparente, desde a estrutura de conteúdo até ao desenvolvimento final.",
        name: "Equipa independente",
        role: "Web app e consultoria",
      },
    ],
    faqTitle: "Perguntas frequentes",
    faq: [
      {
        question: "A ATS Studio trabalha apenas com clientes em Portugal?",
        answer:
          "Não. A base do estúdio é na Guarda, Portugal, mas os projetos podem ser acompanhados remotamente em português ou inglês.",
      },
      {
        question: "Os websites ficam preparados para SEO?",
        answer:
          "Sim. A estrutura inclui metadados, hierarquia de headings, desempenho, indexação e boas práticas técnicas adequadas ao projeto.",
      },
      {
        question: "Como são tratados dados de formulários e cookies?",
        answer:
          "Os dados de contacto são usados apenas para responder ao pedido. Analytics e pixel só carregam após consentimento do utilizador.",
      },
      {
        question: "A ATS Studio também integra CMS e back-end?",
        answer:
          "Sim. Podemos trabalhar com Sanity, Supabase, Shopify, APIs, bases de dados e sistemas personalizados quando o projeto o exige.",
      },
    ],
  },
  en: {
    eyebrow: "Trust and method",
    title: "A professional, transparent digital presence built for long-term business relationships.",
    subtitle:
      "Every project combines strategy, design, development and compliance criteria so the brand communicates clearly from the first contact.",
    processTitle: "Workflow",
    process: [
      {
        title: "Diagnosis",
        text: "We clarify goals, audience, content, risks and technical requirements before proposing a solution.",
      },
      {
        title: "Visual direction",
        text: "We define structure, narrative, UI and identity to create a consistent and accessible experience.",
      },
      {
        title: "Development",
        text: "We implement with modern code, performance, technical SEO and maintainability practices.",
      },
      {
        title: "Validation",
        text: "We test responsiveness, forms, metadata, accessibility and integrations before publication.",
      },
    ],
    proofTitle: "Reliability signals",
    proof: [
      "Direct communication with the founder",
      "Documented proposals and deliverables",
      "Clear public legal policies",
      "Cookie consent before analytics",
      "Architecture prepared for maintenance",
      "Focus on accessibility and performance",
    ],
    testimonialsTitle: "Professional feedback",
    testimonials: [
      {
        quote:
          "ATS Studio brought clarity to the positioning and turned the digital presence into a more professional, manageable system.",
        name: "Local services client",
        role: "Institutional website",
      },
      {
        quote:
          "The process was organized, with clear communication, strong visual criteria and attention to technical detail.",
        name: "Brand project",
        role: "Branding and web design",
      },
      {
        quote:
          "The approach was practical and transparent, from content structure to final development.",
        name: "Independent team",
        role: "Web app and consulting",
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Does ATS Studio only work with clients in Portugal?",
        answer:
          "No. The studio is based in Guarda, Portugal, but projects can be managed remotely in Portuguese or English.",
      },
      {
        question: "Are websites prepared for SEO?",
        answer:
          "Yes. The structure includes metadata, heading hierarchy, performance, indexing and technical best practices adapted to the project.",
      },
      {
        question: "How are contact form data and cookies handled?",
        answer:
          "Contact data is used only to respond to the request. Analytics and pixels load only after user consent.",
      },
      {
        question: "Does ATS Studio integrate CMS and back-end systems?",
        answer:
          "Yes. We can work with Sanity, Supabase, Shopify, APIs, databases and custom systems when a project requires it.",
      },
    ],
  },
} satisfies Record<Locale, TrustContent>;

export const aboutPageContent = {
  pt: {
    title: "Sobre a ATS Studio",
    description:
      "ATS Studio é um estúdio digital independente na Guarda, Portugal, criado por Alexandre Terras Simões para desenvolver websites, marcas e sistemas digitais profissionais.",
    intro:
      "A ATS Studio nasceu para unir pensamento visual, desenvolvimento moderno e uma relação próxima com clientes que valorizam clareza, rigor e continuidade.",
    storyTitle: "História do fundador",
    story:
      "Alexandre Terras Simões criou a ATS Studio na Guarda com uma ideia simples: ajudar negócios e equipas a apresentar-se online com o mesmo cuidado que colocam no seu trabalho. O estúdio combina design, UX, desenvolvimento e integração de ferramentas digitais num processo direto, documentado e transparente.",
    missionTitle: "Missão",
    mission:
      "Criar presenças digitais profissionais, acessíveis e preparadas para evoluir, sem promessas exageradas e sem dependência de soluções opacas.",
    valuesTitle: "Valores",
    values: ["Clareza", "Rigor", "Proximidade", "Responsabilidade", "Evolução"],
    timelineTitle: "Linha temporal",
    timeline: [
      { year: "2024", text: "Início da prática independente em design, web e produto digital." },
      { year: "2025", text: "Consolidação de processos, stack técnica e rede criativa parceira." },
      { year: "2026", text: "ATS Studio reforça foco em websites profissionais, CMS, automações e sistemas escaláveis." },
    ],
    servicesTitle: "Áreas de trabalho",
    services: ["Websites institucionais", "Web apps", "Branding", "UI/UX", "CMS", "Automações profissionais"],
    techTitle: "Tecnologias e ferramentas",
  },
  en: {
    title: "About ATS Studio",
    description:
      "ATS Studio is an independent digital studio in Guarda, Portugal, founded by Alexandre Terras Simoes to build professional websites, brands and digital systems.",
    intro:
      "ATS Studio was created to combine visual thinking, modern development and a close client relationship for teams that value clarity, rigor and continuity.",
    storyTitle: "Founder story",
    story:
      "Alexandre Terras Simoes created ATS Studio in Guarda with a simple idea: help businesses and teams present themselves online with the same care they put into their work. The studio combines design, UX, development and digital tool integration through a direct, documented and transparent process.",
    missionTitle: "Mission",
    mission:
      "Create professional, accessible digital presences prepared to evolve, without exaggerated promises or dependence on opaque solutions.",
    valuesTitle: "Values",
    values: ["Clarity", "Rigor", "Proximity", "Responsibility", "Evolution"],
    timelineTitle: "Timeline",
    timeline: [
      { year: "2024", text: "Start of independent practice in design, web and digital product." },
      { year: "2025", text: "Consolidation of processes, technical stack and creative partner network." },
      { year: "2026", text: "ATS Studio strengthens its focus on professional websites, CMS, automations and scalable systems." },
    ],
    servicesTitle: "Areas of work",
    services: ["Institutional websites", "Web apps", "Branding", "UI/UX", "CMS", "Professional automations"],
    techTitle: "Technologies and tools",
  },
} satisfies Record<Locale, AboutPageContent>;

export const cookieContent = {
  pt: {
    bannerTitle: "Privacidade e cookies",
    bannerText:
      "Usamos cookies essenciais para o site funcionar. Analytics, medição interna e Meta Pixel só são ativados com o teu consentimento.",
    accept: "Aceitar",
    reject: "Rejeitar",
    preferences: "Preferências",
    save: "Guardar preferências",
    modalTitle: "Preferências de cookies",
    essential: "Essenciais",
    essentialText: "Necessários para segurança, navegação e funcionamento do website.",
    analytics: "Analytics e medição",
    analyticsText: "Ajuda-nos a compreender visitas e desempenho. Inclui Google Analytics, medição interna ATS Studio e Meta Pixel quando configurados.",
    policy: "Política de Cookies",
  },
  en: {
    bannerTitle: "Privacy and cookies",
    bannerText:
      "We use essential cookies for the site to work. Analytics, internal measurement and Meta Pixel are enabled only with your consent.",
    accept: "Accept",
    reject: "Reject",
    preferences: "Preferences",
    save: "Save preferences",
    modalTitle: "Cookie preferences",
    essential: "Essential",
    essentialText: "Required for security, navigation and website operation.",
    analytics: "Analytics and measurement",
    analyticsText: "Helps us understand visits and performance. Includes Google Analytics, ATS Studio internal measurement and Meta Pixel when configured.",
    policy: "Cookie Policy",
  },
} satisfies Record<Locale, Record<string, string>>;
