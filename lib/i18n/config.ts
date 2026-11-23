/**
 * Configuração central de idiomas.
 * Para adicionar um idioma: inclua o código em `locales`, crie o arquivo
 * correspondente em /locales e registre-o em `lib/i18n/dictionaries.ts`.
 */
export const locales = ["pt-BR", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-BR";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeMeta: Record<
  Locale,
  { label: string; short: string; openGraph: string }
> = {
  "pt-BR": { label: "Português", short: "PT", openGraph: "pt_BR" },
  en: { label: "English", short: "EN", openGraph: "en_US" },
};

/** Chave usada para lembrar o idioma escolhido pelo visitante. */
export const LOCALE_STORAGE_KEY = "mb-locale";
