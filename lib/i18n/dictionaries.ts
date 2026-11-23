import type { Locale } from "./config";
import type { Dictionary } from "@/locales/pt-BR";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  "pt-BR": () => import("@/locales/pt-BR").then((m) => m.ptBR),
  en: () => import("@/locales/en").then((m) => m.en),
};

/** Carrega o dicionário no servidor (apenas o idioma ativo vai para o navegador). */
export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
