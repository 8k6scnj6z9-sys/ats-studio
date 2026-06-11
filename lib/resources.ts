import { sanityClient } from "@/lib/sanity";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/cache";
import type { Locale } from "@/lib/i18n";

export type ResourceSection = {
  heading: string;
  body: string[];
  checklist?: string[];
};

export type ResourceContent = {
  title: string;
  description: string;
  category: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: ResourceSection[];
  conclusion: string;
  cta: {
    title: string;
    text: string;
    label: string;
    href: string;
  };
};

export type Resource = {
  slug: string;
  order: number;
  date?: string;
  relatedSlugs: string[];
  content: Record<Locale, ResourceContent>;
};

const RESOURCE_FIELDS = `
  "slug": slug.current,
  order,
  date,
  relatedResources[]->{ "slug": slug.current },
  "content": {
    "pt": {
      "title": titlePt,
      "description": descriptionPt,
      "category": categoryPt,
      "readTime": readTimePt,
      "seoTitle": seoTitlePt,
      "seoDescription": seoDescriptionPt,
      "intro": introPt,
      "sections": sectionsPt[]{ heading, body, checklist },
      "conclusion": conclusionPt,
      "cta": {
        "title": ctaTitlePt,
        "text": ctaTextPt,
        "label": ctaLabelPt,
        "href": ctaHrefPt
      }
    },
    "en": {
      "title": titleEn,
      "description": descriptionEn,
      "category": categoryEn,
      "readTime": readTimeEn,
      "seoTitle": seoTitleEn,
      "seoDescription": seoDescriptionEn,
      "intro": introEn,
      "sections": sectionsEn[]{ heading, body, checklist },
      "conclusion": conclusionEn,
      "cta": {
        "title": ctaTitleEn,
        "text": ctaTextEn,
        "label": ctaLabelEn,
        "href": ctaHrefEn
      }
    }
  }
`;

type SanityResource = Omit<Resource, "relatedSlugs"> & {
  relatedResources?: { slug?: string }[];
};

export const fallbackResources: Resource[] = [
  {
    slug: "checklist-antes-de-pedir-um-website",
    order: 1,
    date: "2026-05-15",
    relatedSlugs: [
      "preparar-conteudos-novo-site",
      "quanto-tempo-demora-criar-um-website-profissional",
      "branding-vs-website",
    ],
    content: {
      pt: {
        title: "Checklist antes de pedir um website",
        description:
          "Os pontos que deves ter claros antes de pedir orçamento para um novo website.",
        category: "Websites",
        readTime: "7 min",
        seoTitle: "Checklist antes de pedir um website | ATS Studio",
        seoDescription:
          "Descobre o que preparar antes de pedir orçamento para um website: objetivos, páginas, conteúdos, referências e funcionalidades.",
        intro:
          "Pedir orçamento para um website sem preparação costuma gerar respostas vagas, estimativas demasiado abertas e decisões adiadas. Uma boa primeira conversa não precisa de estar fechada ao detalhe, mas deve ter direção.",
        sections: [
          {
            heading: "Qual é o objetivo principal do website?",
            body: [
              "Um website pode servir para apresentar serviços, gerar pedidos de contacto, vender produtos, marcar consultas, mostrar portfólio ou reforçar credibilidade. O problema começa quando se tenta fazer tudo com a mesma prioridade.",
              "Antes de pedir orçamento, define a ação mais importante que o visitante deve conseguir fazer. Essa decisão orienta estrutura, design, conteúdos e funcionalidades.",
            ],
          },
          {
            heading: "Quem vai visitar o website?",
            body: [
              "Um site para clientes locais não deve ser pensado da mesma forma que um site para investidores, pacientes, turistas ou empresas. Cada público chega com dúvidas diferentes e precisa de provas diferentes.",
              "Quanto melhor souberes quem visita o site, mais fácil é decidir que páginas, textos e CTAs fazem sentido.",
            ],
          },
          {
            heading: "Que páginas são realmente necessárias?",
            body: [
              "Nem todos os negócios precisam de muitas páginas. Um website pequeno pode funcionar muito bem se explicar a oferta, mostrar confiança e facilitar contacto.",
              "Começa por uma lista simples: homepage, serviços, sobre, contacto, perguntas frequentes, páginas legais e eventuais páginas específicas por serviço ou setor.",
            ],
          },
          {
            heading: "Que conteúdos já existem?",
            body: [
              "Textos, fotografias, logotipo, cores, testemunhos, documentos legais e exemplos de trabalhos têm impacto direto no prazo e no orçamento.",
              "Se ainda não tens conteúdo, isso não impede o projeto, mas deve ser assumido desde o início para incluir estratégia, copywriting ou direção visual no planeamento.",
            ],
          },
          {
            heading: "Que referências visuais ajudam a orientar o projeto?",
            body: [
              "Referências não servem para copiar. Servem para perceber estilo, nível de detalhe, tipo de interação e sensação que a marca deve transmitir.",
              "Traz exemplos do que gostas e também do que queres evitar. Esta segunda parte costuma poupar muito tempo.",
            ],
          },
          {
            heading: "Que funcionalidades são essenciais?",
            body: [
              "Formulários, marcações, loja online, área de cliente, blog, integração com CRM, reservas ou pagamentos mudam bastante o escopo.",
              "Separa o que é essencial para lançar do que pode ser uma fase futura. Isso ajuda a criar uma proposta mais realista.",
            ],
          },
          {
            heading: "Que decisões aceleram o orçamento?",
            body: [
              "Um orçamento fica mais claro quando já existe objetivo, lista de páginas, funcionalidades, prazo aproximado e responsável pelo feedback.",
              "Não precisas de ter tudo perfeito, mas precisas de reunir informação suficiente para o projeto deixar de ser uma ideia abstrata.",
            ],
            checklist: [
              "Objetivo principal definido.",
              "Público-alvo identificado.",
              "Lista de páginas pretendidas.",
              "Logotipo e identidade visual disponíveis.",
              "Textos ou tópicos principais preparados.",
              "Fotografias ou imagens reunidas.",
              "Exemplos de websites de referência.",
              "Funcionalidades necessárias listadas.",
              "Prazo ideal definido.",
              "Responsável interno pelo feedback definido.",
            ],
          },
        ],
        conclusion:
          "Quanto mais claras estiverem estas decisões, mais fácil é receber uma proposta útil, comparar opções e avançar sem perder semanas em indefinição.",
        cta: {
          title: "Queres transformar esta checklist num plano de projeto?",
          text: "A ATS Studio pode ajudar-te a organizar objetivos, páginas, conteúdos e prioridades antes de avançar para design e desenvolvimento.",
          label: "Falar com a ATS Studio",
          href: "/#contact",
        },
      },
      en: {
        title: "Checklist before requesting a website",
        description:
          "The points you should clarify before asking for a quote for a new website.",
        category: "Websites",
        readTime: "7 min",
        seoTitle: "Checklist before requesting a website | ATS Studio",
        seoDescription:
          "Discover what to prepare before requesting a website quote: goals, pages, content, references and functionality.",
        intro:
          "Requesting a website quote without preparation usually leads to vague answers, open estimates and delayed decisions. A first conversation does not need every detail, but it needs direction.",
        sections: [
          {
            heading: "What is the main goal of the website?",
            body: [
              "A website can present services, generate contact requests, sell products, book appointments, show a portfolio or reinforce credibility. Problems start when everything has the same priority.",
              "Before asking for a quote, define the most important action a visitor should take. That decision guides structure, design, content and functionality.",
            ],
          },
          {
            heading: "Who will visit the website?",
            body: [
              "A site for local customers should not be planned like a site for investors, patients, tourists or companies. Each audience arrives with different questions and needs different proof.",
              "The clearer the audience, the easier it is to decide which pages, copy and calls to action make sense.",
            ],
          },
          {
            heading: "Which pages are actually needed?",
            body: [
              "Not every business needs many pages. A small website can work very well if it explains the offer, builds trust and makes contact easy.",
              "Start with a simple list: homepage, services, about, contact, FAQ, legal pages and specific pages for services or sectors if needed.",
            ],
          },
          {
            heading: "What content already exists?",
            body: [
              "Copy, photos, logo, colors, testimonials, legal documents and work examples directly affect timeline and budget.",
              "If you do not have content yet, that does not block the project, but it should be planned from the start.",
            ],
          },
          {
            heading: "Which visual references help guide the project?",
            body: [
              "References are not there to be copied. They help clarify style, level of detail, interaction and the feeling the brand should communicate.",
              "Bring examples of what you like and what you want to avoid. The second part often saves a lot of time.",
            ],
          },
          {
            heading: "Which features are essential?",
            body: [
              "Forms, bookings, e-commerce, client areas, blogs, CRM integrations, reservations or payments can change the scope significantly.",
              "Separate what is essential for launch from what can become a future phase.",
            ],
          },
          {
            heading: "Which decisions speed up the quote?",
            body: [
              "A quote becomes clearer when the goal, page list, functionality, approximate timeline and feedback owner are already known.",
              "You do not need everything perfect, but you need enough information for the project to stop being abstract.",
            ],
            checklist: [
              "Main goal defined.",
              "Target audience identified.",
              "Initial page list prepared.",
              "Logo and visual identity available.",
              "Main copy or topics prepared.",
              "Photos or images gathered.",
              "Reference websites selected.",
              "Required features listed.",
              "Ideal timeline defined.",
              "Internal feedback owner defined.",
            ],
          },
        ],
        conclusion:
          "The clearer these decisions are, the easier it is to receive a useful proposal, compare options and move forward without losing weeks to uncertainty.",
        cta: {
          title: "Want to turn this checklist into a project plan?",
          text: "ATS Studio can help organize goals, pages, content and priorities before moving into design and development.",
          label: "Talk to ATS Studio",
          href: "/#contact",
        },
      },
    },
  },
  {
    slug: "preparar-conteudos-novo-site",
    order: 2,
    date: "2026-05-15",
    relatedSlugs: [
      "checklist-antes-de-pedir-um-website",
      "branding-vs-website",
      "quanto-tempo-demora-criar-um-website-profissional",
    ],
    content: {
      pt: {
        title: "Como preparar conteúdos para um novo site",
        description:
          "Um guia simples para organizar textos, imagens, contactos e informação antes de iniciar o desenvolvimento.",
        category: "Conteúdo",
        readTime: "6 min",
        seoTitle: "Como preparar conteúdos para um novo site | ATS Studio",
        seoDescription:
          "Guia para organizar textos, imagens, contactos, provas de confiança e informação essencial antes de criar um novo website.",
        intro:
          "Muitos websites atrasam não por causa do design ou do código, mas porque faltam textos, fotografias, contactos ou decisões básicas. Preparar conteúdo cedo torna o projeto mais fluido e melhora o resultado final.",
        sections: [
          {
            heading: "Começar pela mensagem principal",
            body: [
              "Antes de escrever páginas inteiras, resume o que o negócio faz, para quem trabalha e porque alguém deveria confiar nele.",
              "Esta mensagem não precisa de ser publicitária. Deve ser clara o suficiente para uma pessoa perceber, em poucos segundos, se está no sítio certo.",
            ],
          },
          {
            heading: "Organizar páginas antes de escrever textos",
            body: [
              "Escrever sem estrutura costuma gerar textos longos e repetidos. Primeiro define as páginas e o papel de cada uma.",
              "Depois escreve apenas o que cada página precisa de responder: o que é, para quem é, como funciona, que prova existe e qual é o próximo passo.",
            ],
          },
          {
            heading: "Preparar textos curtos, claros e úteis",
            body: [
              "Um bom texto de website não tenta explicar tudo de uma vez. Deve ajudar o visitante a decidir e a avançar.",
              "Usa frases diretas, evita jargão e troca afirmações genéricas por informação concreta: serviços, processo, localização, horários, diferenciais e exemplos.",
            ],
          },
          {
            heading: "Reunir imagens com qualidade",
            body: [
              "Fotografias reais do espaço, equipa, produtos ou ambiente transmitem mais confiança do que imagens genéricas.",
              "Se ainda não existem fotografias, convém decidir cedo se o website vai precisar de sessão fotográfica, direção visual ou imagens provisórias.",
            ],
          },
          {
            heading: "Confirmar contactos, horários e links",
            body: [
              "Telefone errado, email antigo, morada incompleta ou horário desatualizado criam fricção e prejudicam confiança.",
              "Confirma também links para redes sociais, Google Business Profile, plataformas de reserva, menus, catálogos e documentos legais.",
            ],
          },
          {
            heading: "Preparar provas de confiança",
            body: [
              "Testemunhos, marcas parceiras, certificações, anos de experiência, equipa, casos reais e fotografias ajudam a transformar uma promessa em algo credível.",
              "Não é preciso exagerar. O objetivo é mostrar sinais reais que ajudem o visitante a sentir segurança.",
            ],
          },
          {
            heading: "Rever tudo antes do design final",
            body: [
              "O design depende do conteúdo. Se os textos mudam radicalmente no fim, a página pode perder equilíbrio, ritmo e clareza.",
              "Uma revisão de conteúdo antes do design final evita retrabalho e ajuda a construir uma experiência mais coerente.",
            ],
            checklist: [
              "Texto sobre a empresa.",
              "Lista de serviços.",
              "Contactos atualizados.",
              "Morada, horários e redes sociais.",
              "Fotografias reais do espaço, equipa ou produtos.",
              "Testemunhos, marcas, parceiros ou certificações.",
              "Perguntas frequentes.",
              "Política de privacidade ou informação legal, se aplicável.",
            ],
          },
        ],
        conclusion:
          "Conteúdo preparado não significa conteúdo perfeito. Significa ter matéria-prima suficiente para construir uma presença digital clara e sem bloqueios desnecessários.",
        cta: {
          title: "Precisas de ajuda a estruturar conteúdos para o teu website?",
          text: "A ATS Studio pode ajudar a transformar informação dispersa numa estrutura clara, útil e preparada para design.",
          label: "Falar com a ATS Studio",
          href: "/#contact",
        },
      },
      en: {
        title: "How to prepare content for a new website",
        description:
          "A simple guide to organize copy, images, contacts and information before development starts.",
        category: "Content",
        readTime: "6 min",
        seoTitle: "How to prepare content for a new website | ATS Studio",
        seoDescription:
          "Guide to organizing copy, images, contacts, trust signals and essential information before creating a new website.",
        intro:
          "Many websites are delayed not because of design or code, but because copy, photos, contacts or basic decisions are missing. Preparing content early makes the project smoother and improves the final result.",
        sections: [
          {
            heading: "Start with the main message",
            body: [
              "Before writing full pages, summarize what the business does, who it serves and why someone should trust it.",
              "This message does not need to sound like advertising. It should be clear enough for someone to understand, in seconds, whether they are in the right place.",
            ],
          },
          {
            heading: "Organize pages before writing copy",
            body: [
              "Writing without structure often creates long and repetitive copy. First define the pages and the role of each one.",
              "Then write only what each page needs to answer: what it is, who it is for, how it works, what proof exists and what the next step is.",
            ],
          },
          {
            heading: "Write short, clear and useful copy",
            body: [
              "Good website copy does not try to explain everything at once. It helps visitors decide and move forward.",
              "Use direct sentences, avoid jargon and replace generic claims with concrete information.",
            ],
          },
          {
            heading: "Gather quality images",
            body: [
              "Real photos of the space, team, products or atmosphere build more trust than generic imagery.",
              "If those photos do not exist yet, decide early whether the website needs photography, visual direction or temporary images.",
            ],
          },
          {
            heading: "Confirm contacts, opening hours and links",
            body: [
              "Wrong phone numbers, old emails, incomplete addresses or outdated schedules create friction and reduce trust.",
              "Also confirm links to social profiles, Google Business Profile, booking platforms, menus, catalogs and legal documents.",
            ],
          },
          {
            heading: "Prepare trust signals",
            body: [
              "Testimonials, partner brands, certifications, years of experience, team information, real cases and photos help turn a promise into something credible.",
              "The goal is not exaggeration. The goal is to show real signals that help the visitor feel confident.",
            ],
          },
          {
            heading: "Review everything before final design",
            body: [
              "Design depends on content. If copy changes radically at the end, the page can lose balance, rhythm and clarity.",
              "A content review before final design avoids rework and supports a more coherent experience.",
            ],
            checklist: [
              "Company description.",
              "Service list.",
              "Updated contacts.",
              "Address, opening hours and social links.",
              "Real photos of the space, team or products.",
              "Testimonials, brands, partners or certifications.",
              "Frequently asked questions.",
              "Privacy policy or legal information, when applicable.",
            ],
          },
        ],
        conclusion:
          "Prepared content does not mean perfect content. It means having enough raw material to build a clear digital presence without unnecessary blockers.",
        cta: {
          title: "Need help structuring content for your website?",
          text: "ATS Studio can help turn scattered information into a clear, useful structure prepared for design.",
          label: "Talk to ATS Studio",
          href: "/#contact",
        },
      },
    },
  },
  {
    slug: "website-profissional-para-clinicas",
    order: 3,
    date: "2026-05-15",
    relatedSlugs: [
      "preparar-conteudos-novo-site",
      "checklist-antes-de-pedir-um-website",
      "quanto-tempo-demora-criar-um-website-profissional",
    ],
    content: {
      pt: {
        title: "Website profissional para clínicas: o que não pode faltar",
        description:
          "Os elementos essenciais para uma clínica transmitir confiança, clareza e facilidade de contacto online.",
        category: "Setores",
        readTime: "7 min",
        seoTitle: "Website profissional para clínicas | ATS Studio",
        seoDescription:
          "Guia prático para clínicas que querem criar um website claro, credível e fácil de usar.",
        intro:
          "Uma clínica não precisa de um website complicado. Precisa de uma presença clara, credível e fácil de usar, que ajude uma pessoa a perceber serviços, equipa, localização e forma de contacto sem esforço.",
        sections: [
          {
            heading: "Confiança vem antes do design",
            body: [
              "Na área da saúde, estética ou bem-estar, o visitante procura segurança antes de procurar estilo. O design deve apoiar essa sensação, não distrair.",
              "Fotografias reais, linguagem clara, equipa identificada e informação legal visível ajudam a criar uma primeira impressão mais sólida.",
            ],
          },
          {
            heading: "Serviços devem ser claros e fáceis de encontrar",
            body: [
              "Uma lista confusa de tratamentos, especialidades ou consultas obriga o visitante a interpretar demasiado.",
              "Organiza serviços por categoria, explica em linguagem simples e evita transformar cada página num texto técnico.",
            ],
          },
          {
            heading: "Equipa, especialidades e credenciais",
            body: [
              "Mostrar quem atende, qual a especialidade e que experiência existe reduz dúvidas e aproxima a relação antes do contacto.",
              "Não é preciso escrever currículos longos. Uma apresentação breve, humana e objetiva costuma funcionar melhor.",
            ],
          },
          {
            heading: "Marcação de consulta ou contacto visível",
            body: [
              "Se o objetivo é marcação, o botão deve estar visível em pontos estratégicos: hero, páginas de serviço e contacto.",
              "Telefone, email, formulário ou plataforma externa devem ser claros. O visitante não deve ter de procurar como avançar.",
            ],
          },
          {
            heading: "Localização, horários e acessibilidade",
            body: [
              "Morada, mapa, horários e indicação de estacionamento ou acessibilidade podem ser decisivos, especialmente para clínicas locais.",
              "Esta informação deve estar no contacto e, quando fizer sentido, também no footer ou em blocos de apoio.",
            ],
          },
          {
            heading: "Perguntas frequentes",
            body: [
              "Perguntas sobre marcação, preparação, formas de pagamento, cancelamentos ou primeira consulta reduzem chamadas repetidas.",
              "Uma FAQ simples também mostra organização e ajuda o visitante a avançar com mais confiança.",
            ],
          },
          {
            heading: "Privacidade, dados e informação sensível",
            body: [
              "Formulários de clínicas devem ser pensados com cuidado. Nem sempre faz sentido pedir informação clínica detalhada no website.",
              "Política de privacidade, consentimento e linguagem prudente são parte da experiência de confiança.",
            ],
            checklist: [
              "Serviços bem organizados.",
              "Perfil da equipa.",
              "Contacto visível.",
              "Botão de marcação.",
              "Morada e mapa.",
              "Horários.",
              "Fotografias reais.",
              "Informação legal e privacidade.",
              "Perguntas frequentes.",
              "Design limpo e credível.",
            ],
          },
        ],
        conclusion:
          "Um bom website para clínica deve ajudar a pessoa a sentir que está perante uma equipa séria, acessível e bem organizada.",
        cta: {
          title: "Queres criar um website claro e profissional para a tua clínica?",
          text: "A ATS Studio pode ajudar a estruturar serviços, confiança, contacto e experiência digital com atenção ao detalhe.",
          label: "Falar com a ATS Studio",
          href: "/#contact",
        },
      },
      en: {
        title: "Professional website for clinics: what cannot be missing",
        description:
          "The essential elements for a clinic to communicate trust, clarity and easy contact online.",
        category: "Sectors",
        readTime: "7 min",
        seoTitle: "Professional website for clinics | ATS Studio",
        seoDescription:
          "Practical guide for clinics that want to create a clear, credible and easy-to-use website.",
        intro:
          "A clinic does not need a complicated website. It needs a clear, credible and easy-to-use presence that helps people understand services, team, location and contact options without effort.",
        sections: [
          {
            heading: "Trust comes before design",
            body: [
              "In health, aesthetics or wellbeing, visitors look for safety before style. Design should support that feeling, not distract from it.",
              "Real photos, clear language, identified team members and visible legal information help create a stronger first impression.",
            ],
          },
          {
            heading: "Services should be clear and easy to find",
            body: [
              "A confusing list of treatments, specialties or appointments forces visitors to interpret too much.",
              "Organize services by category, explain them in simple language and avoid turning every page into technical copy.",
            ],
          },
          {
            heading: "Team, specialties and credentials",
            body: [
              "Showing who provides the service, what their specialty is and what experience exists reduces doubts before contact.",
              "Short, human and objective profiles usually work better than long CVs.",
            ],
          },
          {
            heading: "Appointment booking or visible contact",
            body: [
              "If the goal is booking, the button should appear in strategic places: hero, service pages and contact area.",
              "Phone, email, form or external platform should be clear. Visitors should not have to search for the next step.",
            ],
          },
          {
            heading: "Location, opening hours and accessibility",
            body: [
              "Address, map, opening hours and information about parking or accessibility can be decisive, especially for local clinics.",
              "This information should be present in contact and, when useful, also in the footer or support blocks.",
            ],
          },
          {
            heading: "Frequently asked questions",
            body: [
              "Questions about booking, preparation, payment methods, cancellations or first appointments reduce repeated calls.",
              "A simple FAQ also shows organization and helps visitors move forward with more confidence.",
            ],
          },
          {
            heading: "Privacy, data and sensitive information",
            body: [
              "Clinic forms should be planned carefully. It does not always make sense to request detailed clinical information on the website.",
              "Privacy policy, consent and careful language are part of the trust experience.",
            ],
            checklist: [
              "Well-organized services.",
              "Team profiles.",
              "Visible contact.",
              "Booking button.",
              "Address and map.",
              "Opening hours.",
              "Real photos.",
              "Legal and privacy information.",
              "Frequently asked questions.",
              "Clean and credible design.",
            ],
          },
        ],
        conclusion:
          "A good clinic website should help people feel they are dealing with a serious, accessible and well-organized team.",
        cta: {
          title: "Want a clear and professional website for your clinic?",
          text: "ATS Studio can help structure services, trust, contact and digital experience with attention to detail.",
          label: "Talk to ATS Studio",
          href: "/#contact",
        },
      },
    },
  },
  {
    slug: "website-para-restaurantes",
    order: 4,
    date: "2026-05-15",
    relatedSlugs: [
      "preparar-conteudos-novo-site",
      "checklist-antes-de-pedir-um-website",
      "quanto-tempo-demora-criar-um-website-profissional",
    ],
    content: {
      pt: {
        title: "Website para restaurantes: menu, reservas, Google, horários e confiança",
        description:
          "Um guia prático para restaurantes que querem aparecer melhor online e facilitar a decisão dos clientes.",
        category: "Setores",
        readTime: "6 min",
        seoTitle: "Website para restaurantes | ATS Studio",
        seoDescription:
          "Guia prático para restaurantes que querem melhorar menu, reservas, horários, Google, contacto e confiança online.",
        intro:
          "Quando alguém procura um restaurante, normalmente quer decidir rápido. O website deve responder a perguntas simples sem obrigar a abrir várias plataformas.",
        sections: [
          {
            heading: "O cliente quer decidir rápido",
            body: [
              "Menu, horário, localização, ambiente, preço aproximado e forma de reserva são informação essencial.",
              "Se essa informação estiver escondida, desatualizada ou difícil de ler em mobile, o cliente pode desistir antes de conhecer o restaurante.",
            ],
          },
          {
            heading: "Menu acessível e atualizado",
            body: [
              "O menu deve ser fácil de abrir no telemóvel. PDFs pesados, imagens desfocadas ou menus antigos criam fricção.",
              "Se os preços mudam com frequência, convém escolher uma solução fácil de atualizar.",
            ],
          },
          {
            heading: "Horários, localização e contactos sem fricção",
            body: [
              "Horário atualizado, morada, mapa, telefone e links úteis devem estar visíveis sem esforço.",
              "Em restauração, a pessoa pode estar na rua, com pressa e a decidir no telemóvel. A página deve respeitar esse contexto.",
            ],
          },
          {
            heading: "Reservas, encomendas ou pedidos especiais",
            body: [
              "Se há reservas, take-away, delivery, eventos ou pedidos para grupos, o caminho deve ser direto.",
              "Um botão claro pode valer mais do que uma secção longa. O importante é reduzir dúvidas no momento da decisão.",
            ],
          },
          {
            heading: "Fotografias reais fazem diferença",
            body: [
              "Fotografias reais do espaço, pratos, equipa e ambiente ajudam o cliente a imaginar a experiência.",
              "Imagens demasiado genéricas podem parecer bonitas, mas raramente transmitem a confiança de um lugar real.",
            ],
          },
          {
            heading: "Ligação com Google Business Profile e redes sociais",
            body: [
              "O website não substitui Google ou Instagram. Deve trabalhar com eles.",
              "Links consistentes, horários alinhados e informação igual entre plataformas reduzem confusão e reforçam profissionalismo.",
            ],
          },
          {
            heading: "Erros comuns em websites de restaurantes",
            body: [
              "Menus difíceis de ler, telefone escondido, horários errados, página lenta em mobile e fotografias desatualizadas são problemas frequentes.",
              "A solução nem sempre é criar algo complexo. Muitas vezes é organizar melhor o essencial.",
            ],
            checklist: [
              "Menu atualizado.",
              "Preços ou indicação clara quando aplicável.",
              "Horário atualizado.",
              "Morada e mapa.",
              "Contacto por telefone.",
              "Botão de reserva.",
              "Fotografias do espaço e pratos.",
              "Links para redes sociais.",
              "Informação sobre take-away ou delivery, se existir.",
              "Página rápida em mobile.",
            ],
          },
        ],
        conclusion:
          "Um website de restaurante deve facilitar a decisão. Quanto menos obstáculos houver entre interesse e reserva, melhor.",
        cta: {
          title: "Queres um website simples, bonito e funcional para o teu restaurante?",
          text: "A ATS Studio pode ajudar a organizar menu, contacto, reservas e presença visual sem transformar o site numa ferramenta pesada.",
          label: "Falar com a ATS Studio",
          href: "/#contact",
        },
      },
      en: {
        title: "Restaurant website: menu, bookings, Google, hours and trust",
        description:
          "A practical guide for restaurants that want to appear better online and make customer decisions easier.",
        category: "Sectors",
        readTime: "6 min",
        seoTitle: "Restaurant website | ATS Studio",
        seoDescription:
          "Practical guide for restaurants that want to improve menu, bookings, opening hours, Google, contact and online trust.",
        intro:
          "When someone searches for a restaurant, they usually want to decide quickly. The website should answer simple questions without forcing them through multiple platforms.",
        sections: [
          {
            heading: "Customers want to decide quickly",
            body: [
              "Menu, opening hours, location, atmosphere, approximate price and booking method are essential information.",
              "If that information is hidden, outdated or hard to read on mobile, the customer may leave before discovering the restaurant.",
            ],
          },
          {
            heading: "Accessible and updated menu",
            body: [
              "The menu should be easy to open on a phone. Heavy PDFs, blurry images or old menus create friction.",
              "If prices change often, choose a solution that is easy to update.",
            ],
          },
          {
            heading: "Opening hours, location and contacts without friction",
            body: [
              "Updated hours, address, map, phone and useful links should be visible without effort.",
              "In restaurants, people may be outside, in a hurry and deciding on mobile. The page should respect that context.",
            ],
          },
          {
            heading: "Bookings, orders or special requests",
            body: [
              "If there are reservations, take-away, delivery, events or group requests, the path should be direct.",
              "A clear button can be more useful than a long section.",
            ],
          },
          {
            heading: "Real photos make a difference",
            body: [
              "Real photos of the space, dishes, team and atmosphere help customers imagine the experience.",
              "Generic images may look polished, but they rarely build the trust of a real place.",
            ],
          },
          {
            heading: "Connection with Google Business Profile and social media",
            body: [
              "The website does not replace Google or Instagram. It should work with them.",
              "Consistent links, aligned opening hours and matching information across platforms reduce confusion.",
            ],
          },
          {
            heading: "Common restaurant website mistakes",
            body: [
              "Hard-to-read menus, hidden phone numbers, wrong opening hours, slow mobile pages and outdated photos are common issues.",
              "The solution is not always complexity. Often it is organizing the essentials better.",
            ],
            checklist: [
              "Updated menu.",
              "Prices or clear indication when applicable.",
              "Updated opening hours.",
              "Address and map.",
              "Phone contact.",
              "Booking button.",
              "Photos of the space and dishes.",
              "Social media links.",
              "Take-away or delivery information, if available.",
              "Fast mobile page.",
            ],
          },
        ],
        conclusion:
          "A restaurant website should make decisions easier. The fewer obstacles between interest and booking, the better.",
        cta: {
          title: "Want a simple, beautiful and functional website for your restaurant?",
          text: "ATS Studio can help organize menu, contact, bookings and visual presence without turning the website into a heavy tool.",
          label: "Talk to ATS Studio",
          href: "/#contact",
        },
      },
    },
  },
  {
    slug: "branding-vs-website",
    order: 5,
    date: "2026-05-15",
    relatedSlugs: [
      "checklist-antes-de-pedir-um-website",
      "preparar-conteudos-novo-site",
      "quanto-tempo-demora-criar-um-website-profissional",
    ],
    content: {
      pt: {
        title: "Branding vs website: o que fazer primeiro?",
        description:
          "Entende quando faz sentido começar pela identidade visual e quando o website pode avançar primeiro.",
        category: "Branding",
        readTime: "6 min",
        seoTitle: "Branding vs website: o que fazer primeiro? | ATS Studio",
        seoDescription:
          "Entende quando começar pela identidade visual, quando avançar para website e como alinhar marca, comunicação e digital.",
        intro:
          "Branding e website estão ligados, mas não são a mesma coisa. A decisão sobre o que fazer primeiro depende do estado da marca, da urgência comercial e do nível de clareza que já existe.",
        sections: [
          {
            heading: "Branding e website não são a mesma coisa",
            body: [
              "Branding define direção: identidade visual, tom, perceção, posicionamento e consistência. O website transforma essa direção numa experiência digital.",
              "Um pode informar o outro, mas confundir os dois costuma gerar decisões visuais sem estratégia ou websites bonitos sem clareza.",
            ],
          },
          {
            heading: "Quando deves começar pelo branding",
            body: [
              "Se a marca ainda não tem logotipo, cores, tom de comunicação ou posicionamento minimamente claro, começar pelo website pode gerar retrabalho.",
              "Também faz sentido começar pelo branding quando a imagem atual já não transmite o nível de confiança, preço ou profissionalismo do negócio.",
            ],
          },
          {
            heading: "Quando o website pode avançar primeiro",
            body: [
              "Se a identidade visual já é suficiente e o problema principal é estrutura, conteúdo, performance ou conversão, o website pode avançar sem um rebranding completo.",
              "Nesses casos, pode bastar uma direção visual digital: organizar hierarquia, componentes, cores e estilo dentro da marca existente.",
            ],
          },
          {
            heading: "O risco de criar um website sem direção visual",
            body: [
              "Sem direção visual, cada página pode parecer uma decisão isolada. O resultado tende a ser inconsistente e difícil de manter.",
              "Isto afeta especialmente marcas novas, serviços premium e negócios que precisam de transmitir confiança rapidamente.",
            ],
          },
          {
            heading: "O risco de desenhar uma marca sem pensar no digital",
            body: [
              "Uma identidade pode funcionar num cartão ou numa montra, mas falhar em mobile, formulários, redes sociais e interfaces.",
              "Hoje, a marca precisa de viver bem em ecrãs pequenos, botões, thumbnails, mapas, emails e landing pages.",
            ],
          },
          {
            heading: "Como juntar os dois processos",
            body: [
              "A solução mais eficiente muitas vezes não é escolher um contra o outro. É definir uma base de marca suficiente para orientar o website e depois expandir o sistema.",
              "Assim, identidade visual, conteúdo e experiência digital crescem na mesma direção.",
            ],
            checklist: [
              "A marca tem logotipo atual?",
              "Existem cores e tipografia definidas?",
              "O tom de comunicação está claro?",
              "O público-alvo está definido?",
              "O website precisa apenas de estrutura ou também de direção visual?",
              "A marca atual transmite confiança?",
              "A identidade funciona bem em digital?",
            ],
          },
        ],
        conclusion:
          "Se a marca está confusa, o website vai herdar essa confusão. Se a marca já tem direção, o website pode ser o passo que transforma essa direção em presença real.",
        cta: {
          title: "Não tens a certeza se precisas de branding, website ou ambos?",
          text: "A ATS Studio pode ajudar a perceber o ponto de partida certo e evitar investimento no problema errado.",
          label: "Pedir orientação",
          href: "/#contact",
        },
      },
      en: {
        title: "Branding vs website: what should come first?",
        description:
          "Understand when it makes sense to start with visual identity and when the website can move first.",
        category: "Branding",
        readTime: "6 min",
        seoTitle: "Branding vs website: what should come first? | ATS Studio",
        seoDescription:
          "Understand when to start with identity, when to move into website work and how to align brand, communication and digital.",
        intro:
          "Branding and website are connected, but they are not the same thing. What should come first depends on the brand's maturity, commercial urgency and existing clarity.",
        sections: [
          {
            heading: "Branding and website are not the same thing",
            body: [
              "Branding defines direction: visual identity, tone, perception, positioning and consistency. The website turns that direction into a digital experience.",
              "Confusing the two often creates visual decisions without strategy or beautiful websites without clarity.",
            ],
          },
          {
            heading: "When to start with branding",
            body: [
              "If the brand does not yet have a logo, colors, communication tone or clear positioning, starting with the website can create rework.",
              "Branding should also come first when the current image no longer communicates the trust, price or professionalism of the business.",
            ],
          },
          {
            heading: "When the website can move first",
            body: [
              "If the identity is good enough and the main issue is structure, content, performance or conversion, the website can move without a full rebrand.",
              "In those cases, a digital visual direction may be enough: hierarchy, components, colors and style within the existing brand.",
            ],
          },
          {
            heading: "The risk of creating a website without visual direction",
            body: [
              "Without visual direction, each page can feel like an isolated decision. The result tends to be inconsistent and hard to maintain.",
              "This affects new brands, premium services and businesses that need to build trust quickly.",
            ],
          },
          {
            heading: "The risk of designing a brand without thinking digital",
            body: [
              "An identity can work on a card or storefront but fail on mobile, forms, social media and interfaces.",
              "Today, brands need to work well on small screens, buttons, thumbnails, maps, emails and landing pages.",
            ],
          },
          {
            heading: "How to connect both processes",
            body: [
              "The most efficient solution is often not choosing one against the other. It is defining enough brand direction to guide the website, then expanding the system.",
              "That way, identity, content and digital experience grow in the same direction.",
            ],
            checklist: [
              "Does the brand have a current logo?",
              "Are colors and typography defined?",
              "Is the communication tone clear?",
              "Is the target audience defined?",
              "Does the website need only structure or also visual direction?",
              "Does the current brand communicate trust?",
              "Does the identity work well digitally?",
            ],
          },
        ],
        conclusion:
          "If the brand is unclear, the website will inherit that confusion. If the brand already has direction, the website can turn it into a real digital presence.",
        cta: {
          title: "Not sure whether you need branding, a website or both?",
          text: "ATS Studio can help identify the right starting point and avoid investing in the wrong problem.",
          label: "Ask for guidance",
          href: "/#contact",
        },
      },
    },
  },
  {
    slug: "quanto-tempo-demora-criar-um-website-profissional",
    order: 6,
    date: "2026-05-15",
    relatedSlugs: [
      "checklist-antes-de-pedir-um-website",
      "preparar-conteudos-novo-site",
      "branding-vs-website",
    ],
    content: {
      pt: {
        title: "Quanto tempo demora criar um website profissional?",
        description:
          "Os fatores que influenciam o prazo de criação de um website, desde o briefing até ao lançamento.",
        category: "Processo",
        readTime: "6 min",
        seoTitle: "Quanto tempo demora criar um website profissional? | ATS Studio",
        seoDescription:
          "Conhece os fatores que influenciam o prazo de criação de um website profissional, do briefing ao lançamento.",
        intro:
          "Não existe um prazo universal para criar um website profissional. O tempo depende de clareza, conteúdos, funcionalidades, feedback e nível de detalhe pretendido.",
        sections: [
          {
            heading: "Não existe um prazo único para todos os websites",
            body: [
              "Uma landing page simples pode avançar mais depressa. Um website institucional exige mais planeamento. Uma loja online depende de catálogo, pagamentos, envios e integrações.",
              "Um website com funcionalidades à medida precisa de mais validação técnica antes de prometer prazos.",
            ],
          },
          {
            heading: "O que acontece na fase de descoberta",
            body: [
              "A fase de descoberta clarifica objetivos, público, páginas, funcionalidades e critérios de sucesso.",
              "Quando esta fase é ignorada, o projeto pode parecer mais rápido no início, mas tende a acumular dúvidas durante design e desenvolvimento.",
            ],
          },
          {
            heading: "Design, conteúdos e feedback",
            body: [
              "Design depende de conteúdo e conteúdo depende de decisões do negócio. Se textos, imagens ou aprovações chegam tarde, o prazo estica.",
              "Feedback centralizado e decisões claras são uma das formas mais simples de acelerar o projeto sem perder qualidade.",
            ],
          },
          {
            heading: "Desenvolvimento e testes",
            body: [
              "Depois do design aprovado, o website precisa de ser desenvolvido, testado em mobile, validado em formulários, otimizado para SEO técnico e preparado para publicação.",
              "Esta fase também inclui ajustes finais, performance, acessibilidade e detalhes que tornam a experiência mais sólida.",
            ],
          },
          {
            heading: "O que costuma atrasar um projeto",
            body: [
              "Falta de conteúdo, múltiplos decisores, alterações grandes após aprovação, funcionalidades mal definidas e acessos em falta são causas comuns de atraso.",
              "A maior parte destes problemas pode ser reduzida com preparação antes do arranque.",
            ],
          },
          {
            heading: "Como preparar o projeto para avançar mais rápido",
            body: [
              "Define objetivo, páginas, funcionalidades, responsável pelo feedback e material disponível.",
              "Se ainda há dúvidas, uma conversa de diagnóstico ajuda a transformar incerteza em próximos passos concretos.",
            ],
          },
          {
            heading: "Exemplo de cronograma simples",
            body: [
              "Um fluxo comum passa por descoberta, estrutura, design, desenvolvimento, testes e lançamento. A duração de cada etapa depende do escopo.",
              "O importante é ter um plano realista. Pressa sem clareza raramente produz um website melhor.",
            ],
            checklist: [
              "Brief definido.",
              "Conteúdos preparados.",
              "Feedback centralizado.",
              "Decisor identificado.",
              "Funcionalidades bem descritas.",
              "Acessos reunidos.",
              "Objetivo de lançamento realista.",
            ],
          },
        ],
        conclusion:
          "O prazo ideal não é o mais curto possível. É o prazo que permite chegar ao lançamento com clareza, qualidade e menos retrabalho.",
        cta: {
          title: "Queres perceber o prazo ideal para o teu website?",
          text: "A ATS Studio pode ajudar a avaliar escopo, prioridades e fases para criares um plano realista.",
          label: "Falar com a ATS Studio",
          href: "/#contact",
        },
      },
      en: {
        title: "How long does it take to create a professional website?",
        description:
          "The factors that influence website timelines, from briefing to launch.",
        category: "Process",
        readTime: "6 min",
        seoTitle: "How long does it take to create a professional website? | ATS Studio",
        seoDescription:
          "Understand the factors that influence the timeline of a professional website, from briefing to launch.",
        intro:
          "There is no universal timeline for creating a professional website. Time depends on clarity, content, functionality, feedback and the level of detail required.",
        sections: [
          {
            heading: "There is no single timeline for every website",
            body: [
              "A simple landing page can move faster. An institutional website usually requires more planning. An online store depends on catalog, payments, shipping and integrations.",
              "A website with custom functionality needs more technical validation before timelines can be trusted.",
            ],
          },
          {
            heading: "What happens during discovery",
            body: [
              "Discovery clarifies goals, audience, pages, functionality and success criteria.",
              "When this stage is skipped, the project may seem faster at first but usually accumulates doubts during design and development.",
            ],
          },
          {
            heading: "Design, content and feedback",
            body: [
              "Design depends on content, and content depends on business decisions. If copy, images or approvals arrive late, the timeline stretches.",
              "Centralized feedback and clear decisions are among the simplest ways to move faster without losing quality.",
            ],
          },
          {
            heading: "Development and testing",
            body: [
              "After design approval, the website needs to be built, tested on mobile, validated in forms, optimized for technical SEO and prepared for publishing.",
              "This stage also includes final adjustments, performance, accessibility and details that make the experience stronger.",
            ],
          },
          {
            heading: "What usually delays a project",
            body: [
              "Missing content, multiple decision-makers, major changes after approval, unclear features and missing access credentials are common causes of delay.",
              "Most of these issues can be reduced with preparation before kickoff.",
            ],
          },
          {
            heading: "How to prepare the project to move faster",
            body: [
              "Define the goal, pages, features, feedback owner and available material.",
              "If there are still doubts, a diagnostic conversation helps turn uncertainty into concrete next steps.",
            ],
          },
          {
            heading: "Simple timeline example",
            body: [
              "A common flow includes discovery, structure, design, development, testing and launch. The length of each stage depends on scope.",
              "The important thing is having a realistic plan. Speed without clarity rarely produces a better website.",
            ],
            checklist: [
              "Brief defined.",
              "Content prepared.",
              "Feedback centralized.",
              "Decision-maker identified.",
              "Features clearly described.",
              "Access credentials gathered.",
              "Realistic launch goal.",
            ],
          },
        ],
        conclusion:
          "The ideal timeline is not the shortest possible one. It is the timeline that gets the project launched with clarity, quality and less rework.",
        cta: {
          title: "Want to understand the right timeline for your website?",
          text: "ATS Studio can help evaluate scope, priorities and phases so you can build a realistic plan.",
          label: "Talk to ATS Studio",
          href: "/#contact",
        },
      },
    },
  },
];

function normalizeSanityResource(resource: SanityResource): Resource | null {
  if (!resource.slug || !resource.content?.pt?.title || !resource.content?.en?.title) {
    return null;
  }

  return {
    slug: resource.slug,
    order: resource.order ?? 99,
    date: resource.date,
    relatedSlugs:
      resource.relatedResources
        ?.map((item) => item.slug)
        .filter((slug): slug is string => Boolean(slug)) ?? [],
    content: resource.content,
  };
}

function mergeWithFallback(sanityResources: Resource[]) {
  const bySlug = new Map(fallbackResources.map((resource) => [resource.slug, resource]));

  for (const resource of sanityResources) {
    bySlug.set(resource.slug, resource);
  }

  return Array.from(bySlug.values()).sort((a, b) => a.order - b.order);
}

async function getSanityResources() {
  const data = await sanityClient.fetch<SanityResource[]>(
    `*[_type == "resource" && defined(slug.current)] | order(order asc) { ${RESOURCE_FIELDS} }`,
    {},
    { next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: ["resource"] } },
  );

  return data.map(normalizeSanityResource).filter((item): item is Resource => Boolean(item));
}

export async function getResources(): Promise<Resource[]> {
  try {
    const resources = await getSanityResources();
    return mergeWithFallback(resources);
  } catch {
    return fallbackResources;
  }
}

export async function getResource(slug: string): Promise<Resource | undefined> {
  try {
    const data = await sanityClient.fetch<SanityResource | null>(
      `*[_type == "resource" && slug.current == $slug][0] { ${RESOURCE_FIELDS} }`,
      { slug },
      { next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: ["resource", `resource:${slug}`] } },
    );
    const resource = data ? normalizeSanityResource(data) : null;
    if (resource) return resource;
  } catch {
    // Fallback below keeps the editorial section available if Sanity is unavailable.
  }

  return fallbackResources.find((resource) => resource.slug === slug);
}

export async function getResourceSlugs(): Promise<string[]> {
  try {
    const sanitySlugs = await sanityClient.fetch<string[]>(
      `*[_type == "resource" && defined(slug.current)].slug.current`,
      {},
      { next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: ["resource"] } },
    );
    return Array.from(new Set([...fallbackResources.map((resource) => resource.slug), ...sanitySlugs]));
  } catch {
    return fallbackResources.map((resource) => resource.slug);
  }
}

export function getRelatedResources(
  current: Resource,
  resources: Resource[],
  limit = 3,
) {
  const preferred = current.relatedSlugs
    .map((slug) => resources.find((resource) => resource.slug === slug))
    .filter((resource): resource is Resource => Boolean(resource));
  const fallback = resources.filter(
    (resource) =>
      resource.slug !== current.slug &&
      !preferred.some((item) => item.slug === resource.slug),
  );

  return [...preferred, ...fallback].slice(0, limit);
}

export function localizedResourceHref(locale: Locale, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  if (href === "/diagnostico") return `/${locale}/diagnostico`;
  if (href === "/recursos") return `/${locale}/recursos`;
  if (href.startsWith("/recursos/")) return `/${locale}${href}`;
  if (href === "/#contact") return `/${locale}#contact`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return href.startsWith(`/${locale}`) ? href : `/${locale}${href}`;
}
