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

// Seller identification required by DL 7/2004 (art. 10.º) and DL 24/2014 for online sales.
const seller = {
  name: "Alexandre Terras Simões",
  taxId: "234234903",
  address: "6300 Guarda, Portugal",
};

export const legalContent: Record<
  Locale,
  { privacy: LegalContent; terms: LegalContent; cookies: LegalContent }
> = {
  pt: {
    privacy: {
      eyebrow: "Privacidade",
      title: "Política de Privacidade",
      updated: "Atualizada a 3 de novembro de 2026",
      intro:
        "Esta política explica como a ATS Studio trata dados pessoais recolhidos através deste website, de formulários de contacto, de email, de pagamentos online e de ferramentas digitais associadas.",
      sections: [
        {
          title: "Responsável pelo tratamento",
          body: [
            `${seller.name}, empresário em nome individual, com o nome comercial ${company.name}, NIF ${seller.taxId}, com morada em ${seller.address}, é o responsável pelo tratamento dos dados recolhidos neste website e nos serviços da ATS Studio, incluindo a plataforma BoraProva (boraprova.pt).`,
            `Para qualquer questão sobre privacidade, contacta ${company.email} ou ${company.phone}.`,
          ],
        },
        {
          title: "Dados que podemos recolher",
          body: [
            "Contactos e pedidos: nome, email, telefone quando fornecido, empresa, mensagem, tipo de projeto e qualquer informação enviada voluntariamente através de formulários ou email.",
            "Clientes e pagamentos: dados de identificação e faturação (nome ou denominação, NIF e morada), valor, serviço contratado, estado e método de pagamento e identificador da transação.",
            "Dados técnicos limitados: endereço IP quando necessário para segurança, user agent, páginas visitadas, origem de tráfego, data e hora do pedido.",
          ],
        },
        {
          title: "Finalidades",
          body: [
            "Responder a pedidos, avaliar necessidades, preparar propostas, gerir comunicações pré-contratuais, prestar os serviços contratados, processar pagamentos, emitir faturas e manter os registos administrativos e fiscais obrigatórios.",
            "A ATS Studio não vende dados pessoais e não adiciona contactos a campanhas de marketing sem base legal adequada ou consentimento quando exigido.",
          ],
        },
        {
          title: "Pagamentos online",
          body: [
            "Os pagamentos online (cartão, MB WAY, Multibanco, Apple Pay e Google Pay) são processados pela easypay, instituição de pagamento autorizada pelo Banco de Portugal, que recolhe diretamente os dados de pagamento e os trata nos termos da sua própria política de privacidade.",
            "A ATS Studio não recebe nem guarda dados de cartões de pagamento; recebe apenas a confirmação do pagamento, o método usado e a referência da transação.",
          ],
        },
        {
          title: "Cookies, analytics, medição interna e Meta Pixel",
          body: [
            "Cookies essenciais podem ser usados para segurança, navegação e gravação das preferências de consentimento.",
            "Google Analytics, medição interna ATS Studio e Meta Pixel, quando configurados, só são carregados depois de o utilizador aceitar cookies de analytics/medição no banner de consentimento.",
            "Estas ferramentas ajudam a medir visitas, origem de tráfego, desempenho de campanhas e interações gerais com o website.",
          ],
        },
        {
          title: "Serviços terceiros",
          body: [
            "O website usa a Vercel para alojamento, o Sanity para conteúdo, a Resend ou fornecedor equivalente para email transacional, o Google Analytics, o ATS Studio Portal Analytics para medição interna e o Meta Pixel para publicidade e medição, de acordo com as configurações ativas. Os pagamentos online são processados pela easypay.",
            "Estes fornecedores tratam dados apenas na medida necessária para prestar os seus serviços. Alguns podem tratar dados fora do Espaço Económico Europeu, ao abrigo de decisões de adequação, como o Quadro de Privacidade de Dados UE-EUA, ou de cláusulas contratuais-tipo aprovadas pela Comissão Europeia.",
          ],
        },
        {
          title: "Base legal",
          body: [
            "O tratamento baseia-se na execução de diligências pré-contratuais e de contratos (artigo 6.º, n.º 1, alínea b) do RGPD), no cumprimento de obrigações legais, incluindo fiscais (alínea c)), no interesse legítimo em responder a pedidos e proteger o website (alínea f)) e no consentimento para cookies não essenciais (alínea a)).",
          ],
        },
        {
          title: "Conservação",
          body: [
            "Mensagens e dados de contacto são conservados pelo período necessário para responder e acompanhar oportunidades comerciais, e no máximo 2 anos após o último contacto quando não resultem num contrato.",
            "Faturas, registos de pagamento e documentos contabilísticos são conservados durante 10 anos, prazo legal de conservação de documentos fiscais.",
            "Os dados de analytics são conservados conforme a configuração das respetivas plataformas e podem ser agregados ou anonimizados.",
          ],
        },
        {
          title: "Direitos do titular dos dados",
          body: [
            `Nos termos do RGPD, podes pedir acesso, retificação, apagamento, limitação, oposição, portabilidade e retirar o consentimento através de ${company.email}, sem prejuízo dos dados que a lei obriga a conservar.`,
            "Também tens o direito de apresentar reclamação junto da CNPD — Comissão Nacional de Proteção de Dados (www.cnpd.pt).",
          ],
        },
        {
          title: "Segurança",
          body: [
            "A ATS Studio aplica medidas técnicas e organizativas adequadas para proteger os dados pessoais contra acesso indevido, perda, alteração ou divulgação não autorizada.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Termos",
      title: "Termos e Condições",
      updated: "Atualizados a 3 de novembro de 2026",
      intro:
        "Estes termos regulam a utilização do website da ATS Studio, a prestação de serviços digitais e os pagamentos online, quando não exista contrato específico em contrário.",
      sections: [
        {
          title: "Identificação do prestador",
          body: [
            `${company.name} é o nome comercial de ${seller.name}, empresário em nome individual, NIF ${seller.taxId}, com morada em ${seller.address}.`,
            `Contactos: ${company.email} · ${company.phone}. A ATS Studio opera também a plataforma BoraProva (boraprova.pt), que tem termos próprios para os serviços aí disponibilizados.`,
          ],
        },
        {
          title: "Utilização do website",
          body: [
            "O website pode ser usado para conhecer a ATS Studio, os serviços, estudos de portfólio, o processo de trabalho e as formas de contacto.",
            "Não é permitido usar o website de forma abusiva, automatizada, ilegal, enganosa ou que comprometa a sua segurança, disponibilidade ou integridade.",
          ],
        },
        {
          title: "Serviços",
          body: [
            "A ATS Studio presta serviços de web design, desenvolvimento web, UI/UX, branding, integração de CMS, automações profissionais, consultoria digital, plataformas e software à medida, alojamento e suporte associado.",
            "O âmbito, os prazos, o preço, as fases, as revisões e os entregáveis de cada projeto são definidos em proposta, acordo escrito ou contrato próprio, aceite pelo cliente antes do início dos trabalhos.",
          ],
        },
        {
          title: "Preços, pagamentos e faturação",
          body: [
            "Os preços são indicados em euros na proposta, no orçamento ou na página do serviço. IVA: regime de isenção, artigo 53.º do Código do IVA.",
            "As condições de pagamento, os sinais, as fases de faturação e os eventuais custos recorrentes são acordados antes do início do projeto. Serviços de terceiros, licenças, domínios, subscrições, bancos de imagens ou ferramentas externas podem ser cobrados separadamente quando aplicável.",
            "Os pagamentos podem ser feitos por transferência bancária ou online. Os pagamentos online — cartão de crédito ou débito, MB WAY, Multibanco, Apple Pay e Google Pay — são processados pela easypay, instituição de pagamento autorizada pelo Banco de Portugal, através de uma página de pagamento segura. A ATS Studio não recebe nem guarda dados de cartões.",
            "É emitida fatura por cada pagamento, com os dados de faturação indicados pelo cliente, que é responsável pela sua exatidão. A fatura é enviada por email.",
          ],
        },
        {
          title: "Entrega de projetos",
          body: [
            "Os prazos dependem da receção atempada de conteúdos, acessos, feedback e aprovações do cliente.",
            "A entrega pode incluir ficheiros de design, código, configuração de CMS, documentação, deploy assistido ou transferência de conhecimento, conforme definido na proposta.",
          ],
        },
        {
          title: "Responsabilidades do cliente",
          body: [
            "O cliente é responsável por fornecer informação verdadeira, conteúdos lícitos, direitos de utilização sobre imagens, textos e marcas e os acessos necessários para executar o projeto.",
            "Aprovações, alterações fora de âmbito e atrasos de feedback podem afetar o calendário, os custos e as prioridades.",
          ],
        },
        {
          title: "Propriedade intelectual",
          body: [
            "Salvo acordo diferente, a propriedade dos entregáveis finais pagos é transferida para o cliente após a liquidação dos valores acordados.",
            "Ferramentas internas, metodologias, componentes reutilizáveis, bibliotecas open-source e know-how técnico da ATS Studio não são transferidos em exclusivo.",
            "A ATS Studio pode apresentar trabalhos no portfólio, exceto quando exista acordo de confidencialidade ou restrição escrita.",
          ],
        },
        {
          title: "Direito de livre resolução (consumidores)",
          body: [
            "Se contratares como consumidor, à distância ou fora do estabelecimento, tens o direito de desistir do contrato no prazo de 14 dias a contar da sua celebração, sem indicar motivo, nos termos do Decreto-Lei n.º 24/2014. Para o exercer, envia uma declaração inequívoca para " + company.email + "; o reembolso é feito pelo mesmo meio de pagamento no prazo de 14 dias.",
            "Se pedires expressamente que a prestação do serviço comece antes do fim desse prazo, pagas o valor proporcional ao serviço já prestado até à desistência. O direito de livre resolução extingue-se quando o serviço estiver integralmente prestado com o teu pedido expresso e reconhecimento.",
            "Este direito não se aplica a contratos celebrados por empresas ou profissionais no âmbito da sua atividade.",
          ],
        },
        {
          title: "Reembolsos e cancelamentos",
          body: [
            "Sem prejuízo do direito de livre resolução dos consumidores, sinais, fases já iniciadas, trabalho executado, consultoria, planeamento e custos de terceiros não são, em regra, reembolsáveis.",
            "Cancelamentos, pausas ou alterações substanciais devem ser comunicados por escrito e podem implicar acerto proporcional ao trabalho realizado. Os reembolsos devidos são feitos pelo meio de pagamento original.",
          ],
        },
        {
          title: "Limitação de responsabilidade",
          body: [
            "A ATS Studio atua com diligência profissional, mas não promete resultados comerciais específicos, posições em motores de busca, aprovação por plataformas publicitárias ou ausência permanente de interrupções em serviços de terceiros.",
            "A responsabilidade total, quando legalmente admissível, fica limitada ao valor pago pelo serviço que deu origem ao pedido, sem prejuízo dos direitos imperativos dos consumidores.",
          ],
        },
        {
          title: "Reclamações e resolução de litígios",
          body: [
            "Podes apresentar reclamação no Livro de Reclamações Eletrónico (www.livroreclamacoes.pt) ou por email para " + company.email + ".",
            "Em caso de litígio de consumo, podes recorrer a uma entidade de resolução alternativa de litígios: CNIACC — Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (www.cniacc.pt). Mais informação no Portal do Consumidor (www.consumidor.gov.pt).",
          ],
        },
        {
          title: "Lei aplicável e jurisdição",
          body: [
            "Estes termos são regidos pela lei portuguesa. Em caso de litígio, são competentes os tribunais portugueses, sem prejuízo das normas imperativas aplicáveis aos consumidores.",
          ],
        },
      ],
    },
    cookies: {
      eyebrow: "Cookies",
      title: "Política de Cookies",
      updated: "Atualizada a 3 de novembro de 2026",
      intro:
        "Esta política explica como a ATS Studio usa cookies e tecnologias semelhantes, incluindo o modo como o consentimento é guardado e como analytics/pixel são bloqueados até existir consentimento.",
      sections: [
        {
          title: "O que são cookies",
          body: [
            "Cookies são pequenos ficheiros guardados no dispositivo do utilizador para permitir funcionalidades, recordar preferências ou medir a utilização de um website.",
          ],
        },
        {
          title: "Cookies essenciais",
          body: [
            "Cookies essenciais são necessários para segurança, navegação, funcionamento básico do website e gravação da escolha de consentimento.",
            "Estes cookies não dependem de consentimento porque são necessários para prestar o serviço pedido pelo utilizador.",
          ],
        },
        {
          title: "Analytics, medição interna e Meta Pixel",
          body: [
            "Google Analytics, medição interna ATS Studio e Meta Pixel, quando configurados, só são carregados depois de o utilizador aceitar a categoria de analytics/medição.",
            "Se o utilizador rejeitar ou não responder ao banner, estes scripts não são inseridos na página.",
          ],
        },
        {
          title: "Gestão de preferências",
          body: [
            "O consentimento é guardado no navegador em localStorage com a chave ats_cookie_consent_v1.",
            "Podes alterar a escolha limpando os dados do navegador ou voltando a abrir o site num navegador ou dispositivo diferente.",
          ],
        },
        {
          title: "Contacto",
          body: [
            `Para questões sobre cookies ou privacidade, contacta ${company.email}.`,
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      updated: "Updated on November 3, 2026",
      intro:
        "This policy explains how ATS Studio processes personal data collected through this website, contact forms, email, online payments and associated digital tools.",
      sections: [
        {
          title: "Data controller",
          body: [
            `${seller.name}, sole trader operating as ${company.name}, Portuguese tax number (NIF) ${seller.taxId}, ${seller.address}, is the controller for data collected through this website and ATS Studio services, including the BoraProva platform (boraprova.pt).`,
            `For privacy questions, contact ${company.email} or ${company.phone}.`,
          ],
        },
        {
          title: "Data we may collect",
          body: [
            "Contacts and requests: name, email, phone when provided, company, message, project type and any information voluntarily sent through forms or email.",
            "Clients and payments: identification and billing data (name or company name, tax number and address), amount, service purchased, payment status and method, and transaction reference.",
            "Limited technical data: IP address when needed for security, user agent, visited pages, traffic source, request date and time.",
          ],
        },
        {
          title: "Purposes",
          body: [
            "Replying to requests, assessing needs, preparing proposals, managing pre-contract communication, delivering contracted services, processing payments, issuing invoices and keeping mandatory administrative and tax records.",
            "ATS Studio does not sell personal data and does not add contacts to marketing campaigns without an appropriate legal basis or consent where required.",
          ],
        },
        {
          title: "Online payments",
          body: [
            "Online payments (card, MB WAY, Multibanco, Apple Pay and Google Pay) are processed by easypay, a payment institution authorised by Banco de Portugal, which collects payment data directly and processes it under its own privacy policy.",
            "ATS Studio does not receive or store payment card data; it only receives the payment confirmation, the method used and the transaction reference.",
          ],
        },
        {
          title: "Cookies, analytics, internal measurement and Meta Pixel",
          body: [
            "Essential cookies may be used for security, navigation and storing consent preferences.",
            "Google Analytics, ATS Studio internal measurement and Meta Pixel, when configured, are loaded only after the user accepts analytics/measurement cookies in the consent banner.",
            "These tools help measure visits, traffic source, campaign performance and general website interactions.",
          ],
        },
        {
          title: "Third-party services",
          body: [
            "The website uses Vercel for hosting, Sanity for content, Resend or an equivalent provider for transactional email, Google Analytics, ATS Studio Portal Analytics for internal measurement and Meta Pixel for advertising measurement, according to active configuration. Online payments are processed by easypay.",
            "These providers process data only as needed to provide their services. Some may process data outside the European Economic Area under adequacy decisions, such as the EU-US Data Privacy Framework, or standard contractual clauses approved by the European Commission.",
          ],
        },
        {
          title: "Legal basis",
          body: [
            "Processing relies on pre-contractual steps and contract performance (GDPR article 6(1)(b)), compliance with legal obligations including tax law (6(1)(c)), legitimate interest in responding to requests and protecting the website (6(1)(f)) and consent for non-essential cookies (6(1)(a)).",
          ],
        },
        {
          title: "Retention",
          body: [
            "Messages and contact data are kept for as long as needed to respond and follow up on business opportunities, and no longer than 2 years after the last contact when no contract results.",
            "Invoices, payment records and accounting documents are kept for 10 years, the legal retention period for tax documents.",
            "Analytics data is retained according to the configuration of the relevant platforms and may be aggregated or anonymised.",
          ],
        },
        {
          title: "Your rights",
          body: [
            `Under GDPR, you may request access, rectification, deletion, restriction, objection, portability and withdraw consent through ${company.email}, without prejudice to data that the law requires us to keep.`,
            "You also have the right to lodge a complaint with the Portuguese data protection authority, CNPD (www.cnpd.pt).",
          ],
        },
        {
          title: "Security",
          body: [
            "ATS Studio applies appropriate technical and organisational measures to protect personal data against unauthorised access, loss, alteration or disclosure.",
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms & Conditions",
      updated: "Updated on November 3, 2026",
      intro:
        "These terms govern the use of the ATS Studio website, the provision of digital services and online payments when no specific contract states otherwise.",
      sections: [
        {
          title: "Provider identification",
          body: [
            `${company.name} is the trading name of ${seller.name}, sole trader, Portuguese tax number (NIF) ${seller.taxId}, ${seller.address}.`,
            `Contact: ${company.email} · ${company.phone}. ATS Studio also operates the BoraProva platform (boraprova.pt), which has its own terms for the services offered there.`,
          ],
        },
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
            "ATS Studio provides web design, web development, UI/UX, branding, CMS integration, professional automations, digital consulting, custom platforms and software, hosting and related support.",
            "Scope, timelines, price, phases, revisions and deliverables for each project are defined in a proposal, written agreement or contract accepted by the client before work starts.",
          ],
        },
        {
          title: "Prices, payments and invoicing",
          body: [
            "Prices are stated in euros in the proposal, quote or service page. VAT: exempt under article 53 of the Portuguese VAT Code.",
            "Payment terms, deposits, billing phases and recurring costs are agreed before the project starts. Third-party services, licenses, domains, subscriptions, stock assets or external tools may be charged separately when applicable.",
            "Payments may be made by bank transfer or online. Online payments — credit or debit card, MB WAY, Multibanco, Apple Pay and Google Pay — are processed by easypay, a payment institution authorised by Banco de Portugal, through a secure payment page. ATS Studio does not receive or store card data.",
            "An invoice is issued for each payment with the billing details provided by the client, who is responsible for their accuracy. Invoices are sent by email.",
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
          title: "Right of withdrawal (consumers)",
          body: [
            `If you contract as a consumer at a distance or off-premises, you may withdraw within 14 days of the contract date without giving a reason, under Portuguese Decree-Law 24/2014. To do so, send a clear statement to ${company.email}; refunds are made with the same payment method within 14 days.`,
            "If you expressly request that the service starts before that period ends, you pay an amount proportional to the service provided until withdrawal. The right of withdrawal ends once the service has been fully provided at your express request and acknowledgement.",
            "This right does not apply to contracts entered into by businesses or professionals in the course of their activity.",
          ],
        },
        {
          title: "Refunds and cancellations",
          body: [
            "Without prejudice to consumers' right of withdrawal, deposits, started phases, completed work, consulting, planning and third-party costs are generally non-refundable.",
            "Cancellations, pauses or substantial changes must be communicated in writing and may require proportional settlement for work already performed. Refunds due are made with the original payment method.",
          ],
        },
        {
          title: "Limitation of liability",
          body: [
            "ATS Studio acts with professional diligence but does not promise specific commercial results, search engine positions, advertising platform approvals or permanent absence of interruptions in third-party services.",
            "Total liability, where legally permitted, is limited to the amount paid for the service giving rise to the claim, without prejudice to mandatory consumer rights.",
          ],
        },
        {
          title: "Complaints and dispute resolution",
          body: [
            `You may file a complaint in the Portuguese electronic complaints book (www.livroreclamacoes.pt) or by email to ${company.email}.`,
            "For consumer disputes you may use an alternative dispute resolution entity: CNIACC — National Centre for Consumer Conflict Information and Arbitration (www.cniacc.pt). More information at the Consumer Portal (www.consumidor.gov.pt).",
          ],
        },
        {
          title: "Applicable law and jurisdiction",
          body: [
            "These terms are governed by Portuguese law. Portuguese courts have jurisdiction in case of dispute, without prejudice to mandatory rules applicable to consumers.",
          ],
        },
      ],
    },
    cookies: {
      eyebrow: "Cookies",
      title: "Cookie Policy",
      updated: "Updated on November 3, 2026",
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
