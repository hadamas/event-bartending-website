import { contacts } from "@/data/contacts";

/** Monta um link wa.me com mensagem opcional já preenchida. */
export function whatsappLink(text?: string, number = contacts.whatsapp.number) {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
