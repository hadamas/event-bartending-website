import type { Localized } from "@/lib/i18n/localize";

/**
 * DEPOIMENTOS — PLACEHOLDERS
 * --------------------------------------------------------------
 * Nenhum depoimento abaixo é real. Substitua pelos textos enviados pelos
 * clientes (com autorização). Foto: salve em /public/images/testimonials
 * e preencha `photo` (formato quadrado; o site recorta em círculo).
 */
export interface Testimonial {
  id: string;
  name: string;
  /** Tipo de evento ou contexto da contratação (opcional). */
  context?: Localized;
  quote: Localized;
  photo?: string;
  placeholder?: boolean;
}

const placeholderQuote: Localized = {
  "pt-BR":
    "Depoimento do cliente sobre a experiência, o atendimento, a qualidade dos drinks e o profissionalismo da equipe.",
  en: "Client testimonial about the experience, the service, the quality of the drinks and the team's professionalism.",
};

export const testimonials: Testimonial[] = [
  {
    id: "cliente-1",
    name: "Nome do cliente",
    context: { "pt-BR": "Casamento", en: "Wedding" },
    quote: placeholderQuote,
    placeholder: true,
  },
  {
    id: "cliente-2",
    name: "Nome do cliente",
    context: { "pt-BR": "Festa de 15 anos", en: "Sweet fifteen party" },
    quote: placeholderQuote,
    placeholder: true,
  },
  {
    id: "cliente-3",
    name: "Nome do cliente",
    context: { "pt-BR": "Evento corporativo", en: "Corporate event" },
    quote: placeholderQuote,
    placeholder: true,
  },
];
