/**
 * Conteúdo central do site. Tudo o que é informação da empresa fica aqui
 * para facilitar revisões futuras.
 *
 * Fontes verificadas: perfil do Instagram (bio e destaques, capturas de tela fornecidas)
 * e linktr.ee/borghiodontologia (WhatsApp, mapa e Facebook).
 */

export const WHATSAPP_NUMBER = "5519999840302";
export const WHATSAPP_DISPLAY = "(19) 99984-0302";

export const waLink = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const DEFAULT_WA_MESSAGE =
  "Olá! Vim pelo site da Borghi Odontologia e gostaria de agendar uma consulta.";

export const links = {
  whatsapp: waLink(DEFAULT_WA_MESSAGE),
  maps: "https://goo.gl/maps/hfxnpTSrhqteeq936",
  instagram: "https://www.instagram.com/borghiodontologia/",
  facebook: "https://www.facebook.com/www.borghiodontologia.com.br",
  linktree: "https://linktr.ee/borghiodontologia",
};

export const secretaries = ["Regiane", "Fernanda"];

export const nav = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#familia", label: "Para a família" },
  { href: "#hiperboloide", label: "Hiperboloide" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

export type Specialty = {
  id: string;
  title: string;
  short: string;
  lead: string;
  body: string;
  tags: string[];
  image?: { src: string; alt: string };
  waMessage: string;
};

export const specialties: Specialty[] = [
  {
    id: "implantes",
    title: "Implantes",
    short: "Raiz de titânio",
    lead: "Uma raiz de titânio para devolver o dente que falta.",
    body:
      "O implante é um pino de titânio instalado no osso, que funciona como uma raiz artificial. Sobre ele é fixada a prótese: um dente, vários dentes ou uma arcada inteira. A indicação depende de avaliação clínica e de exames de imagem.",
    tags: ["Dentes unitários", "Múltiplos dentes", "Base para prótese fixa"],
    image: {
      src: "/images/implante-titanio.jpg",
      alt: "Imagem ilustrativa de um implante dentário de titânio sobre superfície azul-marinho",
    },
    waMessage: "Olá! Gostaria de agendar uma avaliação para implante dentário.",
  },
  {
    id: "protese",
    title: "Prótese",
    short: "Forma e mastigação",
    lead: "Coroas, pontes e próteses que recuperam forma, mastigação e estética.",
    body:
      "A prótese dentária reconstrói dentes muito desgastados ou substitui dentes perdidos. Ela pode ser fixa, como coroas e pontes (inclusive sobre implantes), ou removível, conforme o que cada caso permite.",
    tags: ["Coroas", "Pontes", "Próteses sobre implante", "Removíveis"],
    image: {
      src: "/images/protese-ceramica.jpg",
      alt: "Imagem ilustrativa de coroas dentárias em cerâmica sobre papel claro",
    },
    waMessage: "Olá! Gostaria de agendar uma avaliação para prótese dentária.",
  },
  {
    id: "ortopedia",
    title: "Ortopedia Funcional dos Maxilares",
    short: "Crescimento orientado",
    lead: "Orientar o crescimento dos ossos da face enquanto ele acontece.",
    body:
      "A Ortopedia Funcional dos Maxilares (OFM) usa aparelhos e estímulos às funções da boca (respirar, mastigar, engolir) para corrigir desequilíbrios entre maxila e mandíbula. É indicada principalmente na fase de crescimento, durante a infância.",
    tags: ["Crianças em crescimento", "Mordida", "Funções orais"],
    image: {
      src: "/images/ortopedia-modelo.jpg",
      alt: "Imagem ilustrativa de modelo de gesso de arcadas dentárias infantis",
    },
    waMessage: "Olá! Gostaria de saber mais sobre Ortopedia Funcional dos Maxilares.",
  },
];

export const faq = [
  {
    q: "Como faço para agendar uma consulta?",
    a: `Pelo WhatsApp ${WHATSAPP_DISPLAY}. As secretárias Regiane e Fernanda organizam a agenda e tiram as primeiras dúvidas.`,
  },
  {
    q: "Qual a diferença entre implante e prótese?",
    a: "O implante é a raiz artificial de titânio, instalada no osso. A prótese é a parte visível: a coroa, a ponte ou a arcada que devolve forma e mastigação. Muitas vezes os dois tratamentos trabalham juntos, mas também existem próteses que não dependem de implante.",
  },
  {
    q: "Qualquer pessoa pode colocar implante?",
    a: "A indicação é sempre individual. Ela depende da quantidade e da qualidade do osso, da saúde geral e dos exames de imagem. Por isso, o primeiro passo é uma consulta de avaliação.",
  },
  {
    q: "A partir de que idade a Ortopedia Funcional dos Maxilares é indicada?",
    a: "A OFM aproveita a fase de crescimento, por isso costuma ser indicada na infância. A idade certa para começar depende da avaliação da criança pelo especialista.",
  },
  {
    q: "O que é o hiperboloide?",
    a: "É um instrumento de mastigação em silicone, com formato de ampulheta (hiperbólico), usado como auxiliar na Ortopedia Funcional dos Maxilares. O uso e o tempo de exercício são orientados pelo profissional.",
  },
  {
    q: "Onde fica o consultório?",
    a: "A localização está no Google Maps, no link \"Como chegar\" da seção de contato. Se preferir, peça o endereço completo e as referências pelo WhatsApp.",
  },
];
