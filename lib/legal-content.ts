import type { Locale } from "@/lib/i18n";
import { company } from "@/lib/site-content";

type LegalSection = {
  title: string;
  body: string[];
};

export type LegalPageKind = "privacy" | "terms" | "cookies";

export type LegalContent = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const legalContent: Record<
  Locale,
  { privacy: LegalContent; terms: LegalContent; cookies: LegalContent }
> = {
  pt: {
    privacy: {
      eyebrow: "Privacidade",
      title: "Política de Privacidade",
      updated: "Atualizado a 9 de maio de 2026",
      intro:
        "Esta política explica como a ATS Studio trata dados pessoais recolhidos através deste website, formulários de contacto, email e ferramentas digitais associadas.",
      sections: [
        {
          title: "Responsavel pelo tratamento",
          body: [
            `${company.legalName}, com atividade na Guarda, Portugal, e o responsavel pelo tratamento dos dados recolhidos neste website. Para qualquer questao relacionada com privacidade, contacta ${company.email}.`,
          ],
        },
        {
          title: "Dados que podemos recolher",
          body: [
            "Podemos recolher nome, email, telefone quando fornecido, empresa, mensagem, tipo de projeto e qualquer informacao enviada voluntariamente atraves do formulario ou email.",
            "Tambem podemos tratar dados tecnicos limitados, como endereco IP abreviado ou completo quando necessario para seguranca, user agent, paginas visitadas, origem de trafego, data e hora do pedido.",
          ],
        },
        {
          title: "Contactos e pedidos comerciais",
          body: [
            "Os dados enviados em formularios ou emails sao usados para responder ao pedido, avaliar necessidades, preparar propostas, gerir comunicacoes pre-contratuais e manter registos administrativos associados ao contacto.",
            "A ATS Studio nao vende dados pessoais e nao adiciona contactos a campanhas de marketing sem base legal adequada ou consentimento quando exigido.",
          ],
        },
        {
          title: "Cookies, analytics, medicao interna e Meta Pixel",
          body: [
            "Cookies essenciais podem ser usados para seguranca, navegacao e gravacao das preferencias de consentimento.",
            "Google Analytics, medicao interna ATS Studio e Meta Pixel, quando configurados, apenas sao carregados depois de o utilizador aceitar cookies de analytics/medicao no banner de consentimento.",
            "Estas ferramentas podem ajudar a medir visitas, origem de trafego, desempenho de campanhas e interacoes gerais com o website.",
          ],
        },
        {
          title: "Servicos terceiros",
          body: [
            "O website pode usar Vercel para alojamento, Sanity para conteudo, Resend ou fornecedor equivalente para email transacional, Google Analytics, ATS Studio Portal Analytics para medicao interna e Meta Pixel para publicidade e medicao, sempre de acordo com as configuracoes ativas.",
            "Estes fornecedores tratam dados na medida necessaria para prestar os seus servicos, podendo ter politicas de privacidade proprias e infraestrutura localizada fora de Portugal.",
          ],
        },
        {
          title: "Base legal",
          body: [
            "O tratamento pode basear-se em execucao de diligencias pre-contratuais, interesse legitimo em responder a pedidos e proteger o website, cumprimento de obrigacoes legais e consentimento para cookies nao essenciais.",
          ],
        },
        {
          title: "Conservacao",
          body: [
            "Mensagens e dados de contacto podem ser conservados pelo periodo necessario para responder, acompanhar oportunidades comerciais, cumprir obrigacoes legais e manter registos administrativos razoaveis.",
            "Dados de analytics sao conservados conforme a configuracao das respetivas plataformas e podem ser agregados ou anonimizados quando aplicavel.",
          ],
        },
        {
          title: "Direitos GDPR",
          body: [
            `Nos termos do RGPD, podes pedir acesso, retificacao, apagamento, limitacao, oposicao, portabilidade e retirada de consentimento atraves de ${company.email}.`,
            "Tambem tens o direito de apresentar reclamacao junto da CNPD - Comissao Nacional de Protecao de Dados.",
          ],
        },
        {
          title: "Seguranca",
          body: [
            "A ATS Studio aplica medidas tecnicas e organizativas razoaveis para proteger dados pessoais contra acesso indevido, perda, alteracao ou divulgacao nao autorizada.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Termos",
      title: "Termos e Condições",
      updated: "Atualizado a 9 de maio de 2026",
      intro:
        "Estes termos regulam a utilizacao do website da ATS Studio e enquadram, de forma geral, a prestacao de servicos digitais quando nao exista contrato especifico em contrario.",
      sections: [
        {
          title: "Utilizacao do website",
          body: [
            "O website pode ser usado para conhecer a ATS Studio, os servicos, estudos de portfolio, processo de trabalho e formas de contacto.",
            "Nao e permitido usar o website de forma abusiva, automatizada, ilegal, enganosa ou que comprometa a sua seguranca, disponibilidade ou integridade.",
          ],
        },
        {
          title: "Servicos",
          body: [
            "A ATS Studio presta servicos de web design, desenvolvimento web, UI/UX, branding, integracao de CMS, automacoes profissionais, consultoria digital e suporte associado.",
            "O ambito, prazos, preco, fases, revisoes e entregaveis de cada projeto sao definidos em proposta, acordo escrito ou contrato proprio.",
          ],
        },
        {
          title: "Pagamentos e faturacao",
          body: [
            "Condições de pagamento, sinais, fases de faturacao e eventuais custos recorrentes sao acordados antes do inicio do projeto.",
            "Servicos de terceiros, licencas, alojamento, dominios, subscricoes, bancos de imagens ou ferramentas externas podem ser cobrados separadamente quando aplicavel.",
          ],
        },
        {
          title: "Entrega de projetos",
          body: [
            "Prazos dependem da rececao atempada de conteudos, acessos, feedback e aprovacoes do cliente.",
            "A entrega pode incluir ficheiros de design, codigo, configuracao de CMS, documentacao, deploy assistido ou transferencia de conhecimento, conforme definido na proposta.",
          ],
        },
        {
          title: "Responsabilidades do cliente",
          body: [
            "O cliente e responsavel por fornecer informacao verdadeira, conteudos legais, direitos de uso sobre imagens/textos/marcas e acessos necessarios para executar o projeto.",
            "Aprovacoes, alteracoes fora de ambito e atrasos de feedback podem afetar calendario, custos e prioridades.",
          ],
        },
        {
          title: "Propriedade intelectual",
          body: [
            "Salvo acordo diferente, a propriedade dos entregaveis finais pagos e transferida para o cliente apos liquidacao dos valores acordados.",
            "Ferramentas internas, metodologias, componentes reutilizaveis, bibliotecas open-source e know-how tecnico da ATS Studio nao sao transferidos em exclusivo.",
            "A ATS Studio pode apresentar trabalhos no portfolio, exceto quando exista acordo de confidencialidade ou restricao escrita.",
          ],
        },
        {
          title: "Reembolsos e cancelamentos",
          body: [
            "Sinais, fases ja iniciadas, trabalho executado, consultoria, planeamento e custos de terceiros normalmente nao sao reembolsaveis.",
            "Cancelamentos, pausas ou alteracoes substanciais devem ser comunicados por escrito e podem implicar acerto proporcional ao trabalho realizado.",
          ],
        },
        {
          title: "Limitacao de responsabilidade",
          body: [
            "A ATS Studio atua com diligencia profissional, mas nao promete resultados comerciais especificos, posicoes em motores de busca, aprovacao por plataformas publicitarias ou ausencia permanente de interrupcoes em servicos de terceiros.",
            "A responsabilidade total, quando legalmente aplicavel, fica limitada ao valor pago pelo servico que deu origem ao pedido.",
          ],
        },
        {
          title: "Lei aplicavel e jurisdicao",
          body: [
            "Estes termos sao regidos pela lei portuguesa. Em caso de litigio, sao competentes os tribunais portugueses, sem prejuizo de normas imperativas aplicaveis.",
          ],
        },
      ],
    },
    cookies: {
      eyebrow: "Cookies",
      title: "Política de Cookies",
      updated: "Atualizado a 9 de maio de 2026",
      intro:
        "Esta política explica como a ATS Studio usa cookies e tecnologias semelhantes, incluindo o modo como o consentimento é guardado e como analytics/pixel são bloqueados até existir consentimento.",
      sections: [
        {
          title: "O que sao cookies",
          body: [
            "Cookies sao pequenos ficheiros guardados no dispositivo do utilizador para permitir funcionalidades, recordar preferencias ou medir a utilizacao de um website.",
          ],
        },
        {
          title: "Cookies essenciais",
          body: [
            "Cookies essenciais sao necessarios para seguranca, navegacao, funcionamento basico do website e gravacao da escolha de consentimento.",
            "Estes cookies nao dependem de consentimento porque sao necessarios para prestar o servico pedido pelo utilizador.",
          ],
        },
        {
          title: "Analytics, medicao interna e Meta Pixel",
          body: [
            "Google Analytics, medicao interna ATS Studio e Meta Pixel, quando configurados, so sao carregados depois de o utilizador aceitar a categoria de analytics/medicao.",
            "Se o utilizador rejeitar ou nao responder ao banner, estes scripts nao sao inseridos na pagina.",
          ],
        },
        {
          title: "Gestao de preferencias",
          body: [
            "O consentimento e guardado no navegador em localStorage com a chave ats_cookie_consent_v1.",
            "Podes alterar a escolha limpando os dados do navegador ou voltando a abrir o site num navegador/dispositivo diferente.",
          ],
        },
        {
          title: "Contacto",
          body: [
            `Para questoes sobre cookies ou privacidade, contacta ${company.email}.`,
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      updated: "Updated on May 9, 2026",
      intro:
        "This policy explains how ATS Studio processes personal data collected through this website, contact forms, email and associated digital tools.",
      sections: [
        {
          title: "Data controller",
          body: [
            `${company.legalName}, based in Guarda, Portugal, is the controller for data collected through this website. For privacy questions, contact ${company.email}.`,
          ],
        },
        {
          title: "Data we may collect",
          body: [
            "We may collect name, email, phone when provided, company, message, project type and any information voluntarily sent through the form or email.",
            "We may also process limited technical data such as IP address when needed for security, user agent, visited pages, traffic source, request date and time.",
          ],
        },
        {
          title: "Contact and business requests",
          body: [
            "Data sent through forms or email is used to reply to requests, assess needs, prepare proposals, manage pre-contract communication and maintain administrative records connected to the contact.",
            "ATS Studio does not sell personal data and does not add contacts to marketing campaigns without an appropriate legal basis or consent where required.",
          ],
        },
        {
          title: "Cookies, analytics, internal measurement and Meta Pixel",
          body: [
            "Essential cookies may be used for security, navigation and storing consent preferences.",
            "Google Analytics, ATS Studio internal measurement and Meta Pixel, when configured, are loaded only after the user accepts analytics/measurement cookies in the consent banner.",
            "These tools may help measure visits, traffic source, campaign performance and general website interactions.",
          ],
        },
        {
          title: "Third-party services",
          body: [
            "The website may use Vercel for hosting, Sanity for content, Resend or an equivalent provider for transactional email, Google Analytics, ATS Studio Portal Analytics for internal measurement and Meta Pixel for advertising measurement, according to active configuration.",
            "These providers process data only as needed to provide their services and may have their own privacy policies and infrastructure outside Portugal.",
          ],
        },
        {
          title: "Legal basis",
          body: [
            "Processing may rely on pre-contractual steps, legitimate interest in responding to requests and protecting the website, compliance with legal obligations and consent for non-essential cookies.",
          ],
        },
        {
          title: "Retention",
          body: [
            "Messages and contact data may be kept for as long as needed to respond, follow up on business opportunities, comply with legal obligations and maintain reasonable administrative records.",
            "Analytics data is retained according to the configuration of the relevant platforms and may be aggregated or anonymized where applicable.",
          ],
        },
        {
          title: "GDPR rights",
          body: [
            `Under GDPR, you may request access, rectification, deletion, restriction, objection, portability and consent withdrawal through ${company.email}.`,
            "You also have the right to lodge a complaint with the Portuguese data protection authority, CNPD.",
          ],
        },
        {
          title: "Security",
          body: [
            "ATS Studio applies reasonable technical and organizational measures to protect personal data against unauthorized access, loss, alteration or disclosure.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms & Conditions",
      updated: "Updated on May 9, 2026",
      intro:
        "These terms govern the use of the ATS Studio website and generally frame digital services when no specific contract states otherwise.",
      sections: [
        {
          title: "Website use",
          body: [
            "The website may be used to learn about ATS Studio, services, portfolio studies, working process and contact options.",
            "You must not use the website in an abusive, automated, unlawful, misleading or security-compromising way.",
          ],
        },
        {
          title: "Services",
          body: [
            "ATS Studio provides web design, web development, UI/UX, branding, CMS integration, professional automations, digital consulting and related support.",
            "Scope, timelines, price, phases, revisions and deliverables for each project are defined in a dedicated proposal, written agreement or contract.",
          ],
        },
        {
          title: "Payments and billing",
          body: [
            "Payment terms, deposits, billing phases and recurring costs are agreed before the project starts.",
            "Third-party services, licenses, hosting, domains, subscriptions, stock assets or external tools may be charged separately when applicable.",
          ],
        },
        {
          title: "Project delivery",
          body: [
            "Timelines depend on timely delivery of content, access, feedback and client approvals.",
            "Delivery may include design files, code, CMS configuration, documentation, assisted deployment or knowledge transfer, as defined in the proposal.",
          ],
        },
        {
          title: "Client responsibilities",
          body: [
            "The client is responsible for providing accurate information, lawful content, usage rights over images/texts/brands and required access to execute the project.",
            "Approvals, out-of-scope changes and delayed feedback may affect schedule, costs and priorities.",
          ],
        },
        {
          title: "Intellectual property",
          body: [
            "Unless agreed otherwise, ownership of paid final deliverables is transferred to the client after the agreed amounts are settled.",
            "Internal tools, methods, reusable components, open-source libraries and ATS Studio technical know-how are not transferred exclusively.",
            "ATS Studio may present work in its portfolio unless a confidentiality agreement or written restriction applies.",
          ],
        },
        {
          title: "Refunds and cancellations",
          body: [
            "Deposits, started phases, completed work, consulting, planning and third-party costs are normally non-refundable.",
            "Cancellations, pauses or substantial changes must be communicated in writing and may require proportional settlement for work already performed.",
          ],
        },
        {
          title: "Limitation of liability",
          body: [
            "ATS Studio acts with professional diligence but does not promise specific commercial results, search engine positions, advertising platform approvals or permanent absence of interruptions in third-party services.",
            "Total liability, where legally applicable, is limited to the amount paid for the service giving rise to the claim.",
          ],
        },
        {
          title: "Applicable law and jurisdiction",
          body: [
            "These terms are governed by Portuguese law. Portuguese courts have jurisdiction in case of dispute, without prejudice to mandatory applicable rules.",
          ],
        },
      ],
    },
    cookies: {
      eyebrow: "Cookies",
      title: "Cookie Policy",
      updated: "Updated on May 9, 2026",
      intro:
        "This policy explains how ATS Studio uses cookies and similar technologies, including how consent is stored and how analytics/pixels are blocked until consent exists.",
      sections: [
        {
          title: "What cookies are",
          body: [
            "Cookies are small files stored on the user's device to enable functionality, remember preferences or measure website usage.",
          ],
        },
        {
          title: "Essential cookies",
          body: [
            "Essential cookies are required for security, navigation, basic website operation and storing the consent choice.",
            "These cookies do not require consent because they are necessary to provide the service requested by the user.",
          ],
        },
        {
          title: "Analytics, internal measurement and Meta Pixel",
          body: [
            "Google Analytics, ATS Studio internal measurement and Meta Pixel, when configured, load only after the user accepts the analytics/measurement category.",
            "If the user rejects or does not respond to the banner, these scripts are not inserted into the page.",
          ],
        },
        {
          title: "Managing preferences",
          body: [
            "Consent is stored in the browser localStorage with the key ats_cookie_consent_v1.",
            "You can change your choice by clearing browser data or opening the site in a different browser/device.",
          ],
        },
        {
          title: "Contact",
          body: [
            `For questions about cookies or privacy, contact ${company.email}.`,
          ],
        },
      ],
    },
  },
};
