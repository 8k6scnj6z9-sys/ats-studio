import type { Locale } from "@/lib/i18n";

type LegalSection = {
  title: string;
  body: string[];
};

type LegalContent = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const legalContent: Record<
  Locale,
  { privacy: LegalContent; terms: LegalContent }
> = {
  pt: {
    privacy: {
      eyebrow: "Privacidade",
      title: "Política de Privacidade",
      updated: "Atualizado a 4 de maio de 2026",
      intro:
        "Esta política explica como a ATS Studio trata dados pessoais recolhidos através deste website e dos contactos enviados para geral@atstudio.pt.",
      sections: [
        {
          title: "Responsável pelo tratamento",
          body: [
            "ATS Studio, projeto de Alexandre Terras Simões, com atividade na Guarda, Portugal. Para qualquer questão relacionada com privacidade, podes contactar geral@atstudio.pt.",
          ],
        },
        {
          title: "Dados que podemos recolher",
          body: [
            "Quando preenches o formulário de contacto, podemos recolher nome, email e a mensagem que envias. Também podemos receber informação técnica básica do pedido, necessária para segurança, entrega e funcionamento do website.",
          ],
        },
        {
          title: "Finalidade",
          body: [
            "Usamos os dados para responder a pedidos de contacto, preparar propostas, gerir a relação comercial e proteger o website contra abuso ou spam.",
            "Não vendemos dados pessoais e não usamos os contactos recebidos para campanhas sem consentimento.",
          ],
        },
        {
          title: "Serviços terceiros",
          body: [
            "O website é alojado na Vercel e o formulário pode usar serviços de email transacional, como a Resend, para entregar mensagens. Estes fornecedores tratam dados apenas na medida necessária para prestar o serviço.",
          ],
        },
        {
          title: "Conservação",
          body: [
            "Guardamos mensagens e dados de contacto durante o tempo necessário para responder, acompanhar oportunidades comerciais e cumprir obrigações legais ou administrativas aplicáveis.",
          ],
        },
        {
          title: "Direitos",
          body: [
            "Podes pedir acesso, correção, eliminação, limitação ou oposição ao tratamento dos teus dados através de geral@atstudio.pt.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Termos",
      title: "Termos de Utilização",
      updated: "Atualizado a 4 de maio de 2026",
      intro:
        "Estes termos regulam a utilização deste website e a forma como a informação aqui apresentada deve ser interpretada.",
      sections: [
        {
          title: "Utilização do website",
          body: [
            "Podes navegar no website para conhecer a ATS Studio, serviços, estudos conceptuais e formas de contacto. Não deves usar o website de forma abusiva, automatizada ou que comprometa a sua segurança.",
          ],
        },
        {
          title: "Conteúdo e propriedade intelectual",
          body: [
            "Textos, imagens, mockups, identidade visual e elementos de interface apresentados neste website pertencem à ATS Studio, salvo indicação em contrário.",
            "Os projetos apresentados como estudos conceptuais são exemplos criativos e não representam necessariamente trabalhos comerciais concluídos para clientes reais.",
          ],
        },
        {
          title: "Propostas e serviços",
          body: [
            "A informação no website não constitui proposta vinculativa. Prazos, preços, entregáveis e condições são definidos caso a caso em proposta ou contrato próprio.",
          ],
        },
        {
          title: "Limitação de responsabilidade",
          body: [
            "Fazemos o possível para manter a informação correta e atualizada, mas não garantimos ausência total de erros, interrupções ou indisponibilidades temporárias.",
          ],
        },
        {
          title: "Contactos",
          body: [
            "Para questões sobre estes termos, propostas ou utilização do website, contacta geral@atstudio.pt.",
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      updated: "Updated on May 4, 2026",
      intro:
        "This policy explains how ATS Studio processes personal data collected through this website and messages sent to geral@atstudio.pt.",
      sections: [
        {
          title: "Data controller",
          body: [
            "ATS Studio, a project by Alexandre Terras Simões based in Guarda, Portugal. For privacy questions, contact geral@atstudio.pt.",
          ],
        },
        {
          title: "Data we may collect",
          body: [
            "When you use the contact form, we may collect your name, email address and message. We may also receive basic technical request data required for security, delivery and website operation.",
          ],
        },
        {
          title: "Purpose",
          body: [
            "We use data to reply to contact requests, prepare proposals, manage commercial relationships and protect the website against abuse or spam.",
            "We do not sell personal data and we do not use received contacts for campaigns without consent.",
          ],
        },
        {
          title: "Third-party services",
          body: [
            "The website is hosted on Vercel and the form may use transactional email services, such as Resend, to deliver messages. These providers process data only as needed to provide the service.",
          ],
        },
        {
          title: "Retention",
          body: [
            "We keep messages and contact data for as long as needed to respond, follow up on business opportunities and comply with applicable legal or administrative obligations.",
          ],
        },
        {
          title: "Rights",
          body: [
            "You can request access, correction, deletion, restriction or objection to the processing of your data through geral@atstudio.pt.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of Use",
      updated: "Updated on May 4, 2026",
      intro:
        "These terms govern the use of this website and how the information presented here should be interpreted.",
      sections: [
        {
          title: "Website use",
          body: [
            "You may browse the website to learn about ATS Studio, services, concept studies and contact options. You must not use the website in an abusive, automated or security-compromising way.",
          ],
        },
        {
          title: "Content and intellectual property",
          body: [
            "Texts, images, mockups, visual identity and interface elements shown on this website belong to ATS Studio unless stated otherwise.",
            "Projects presented as concept studies are creative examples and do not necessarily represent completed commercial work for real clients.",
          ],
        },
        {
          title: "Proposals and services",
          body: [
            "Information on the website is not a binding proposal. Timelines, prices, deliverables and conditions are defined case by case in a dedicated proposal or contract.",
          ],
        },
        {
          title: "Limitation of liability",
          body: [
            "We do our best to keep information accurate and updated, but we do not guarantee total absence of errors, interruptions or temporary unavailability.",
          ],
        },
        {
          title: "Contact",
          body: [
            "For questions about these terms, proposals or website use, contact geral@atstudio.pt.",
          ],
        },
      ],
    },
  },
};
