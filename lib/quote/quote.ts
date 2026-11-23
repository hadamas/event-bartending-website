import type { Dictionary } from "@/locales/pt-BR";
import type { Locale } from "@/lib/i18n/config";
import { pick } from "@/lib/i18n/localize";
import { services } from "@/data/services";
import { quoteConfig, type QuoteData } from "./config";

export type QuoteErrors = Partial<Record<keyof QuoteData, string>>;

/** Hoje no formato AAAA-MM-DD (fuso local). */
export function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function validateQuote(data: QuoteData, t: Dictionary): QuoteErrors {
  const e = t.quote.errors;
  const errors: QuoteErrors = {};
  if (!data.name.trim()) errors.name = e.required;
  if (!data.email.trim()) errors.email = e.required;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) errors.email = e.email;
  const digits = data.phone.replace(/\D/g, "");
  if (!digits) errors.phone = e.required;
  else if (digits.length < 10 || digits.length > 15) errors.phone = e.phone;
  if (!data.eventType) errors.eventType = e.eventType;
  if (!data.date) errors.date = e.required;
  else if (data.date < todayISO()) errors.date = e.date;
  if (!data.location.trim()) errors.location = e.required;
  const guests = Number(data.guests);
  if (!data.guests) errors.guests = e.required;
  else if (!Number.isInteger(guests) || guests < 1 || guests > 5000) errors.guests = e.guests;
  return errors;
}

function formatDate(iso: string, locale: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(y, m - 1, d),
  );
}

/** Mensagem formatada para o WhatsApp (negrito com *asteriscos*). */
export function buildWhatsAppMessage(data: QuoteData, t: Dictionary, locale: Locale) {
  const l = t.quote.whatsapp.labels;
  const serviceNames = data.services
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean)
    .map((s) => pick(s!.title, locale));

  const lines = [
    t.quote.whatsapp.greeting,
    "",
    `*${l.name}:* ${data.name.trim()}`,
    `*${l.email}:* ${data.email.trim()}`,
    `*${l.phone}:* ${data.phone.trim()}`,
    `*${l.eventType}:* ${data.eventType ? t.quote.form.eventType.options[data.eventType] : "-"}`,
    `*${l.date}:* ${formatDate(data.date, locale)}`,
    `*${l.location}:* ${data.location.trim()}`,
    `*${l.guests}:* ${data.guests}`,
  ];
  if (serviceNames.length) lines.push(`*${l.services}:* ${serviceNames.join(", ")}`);
  if (data.message.trim()) lines.push(`*${l.message}:* ${data.message.trim()}`);
  lines.push("", `_${t.quote.whatsapp.footer}_`);
  return lines.join("\n");
}

/** Envio para API externa (quando NEXT_PUBLIC_QUOTE_PROVIDER=api). */
export async function sendQuoteToApi(data: QuoteData, locale: Locale) {
  if (!quoteConfig.endpoint) {
    throw new Error("NEXT_PUBLIC_QUOTE_ENDPOINT não configurado.");
  }
  const res = await fetch(quoteConfig.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...data, locale, source: "website" }),
  });
  if (!res.ok) throw new Error(`Falha no envio (${res.status}).`);
}
