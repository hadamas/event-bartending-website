/**
 * Envio do formulário de orçamento.
 *
 * - "whatsapp" (padrão): monta uma mensagem pronta e abre o WhatsApp do Mário.
 * - "api": envia os dados em JSON (POST) para NEXT_PUBLIC_QUOTE_ENDPOINT —
 *   pode ser um backend próprio, Formspree, Make/Zapier, etc.
 *
 * Configure em .env.local:
 *   NEXT_PUBLIC_QUOTE_PROVIDER=api
 *   NEXT_PUBLIC_QUOTE_ENDPOINT=https://...
 */
export type QuoteProvider = "whatsapp" | "api";

export const quoteConfig = {
  provider: (process.env.NEXT_PUBLIC_QUOTE_PROVIDER === "api" ? "api" : "whatsapp") as QuoteProvider,
  endpoint: process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "",
};

export const eventTypes = ["wedding", "fifteen", "events", "birthday", "other"] as const;
export type EventType = (typeof eventTypes)[number];

export interface QuoteData {
  name: string;
  email: string;
  phone: string;
  eventType: EventType | "";
  date: string; // AAAA-MM-DD
  location: string;
  guests: string;
  services: string[];
  message: string;
}

export const emptyQuote: QuoteData = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  location: "",
  guests: "",
  services: [],
  message: "",
};
