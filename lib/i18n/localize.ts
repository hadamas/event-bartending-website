import { defaultLocale, type Locale } from "./config";

/** Valor com uma versão por idioma — usado nos arquivos de /data. */
export type Localized<T = string> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[defaultLocale];
}

/** Substitui {chaves} em uma string: fill("Olá {nome}", { nome: "Ana" }). */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}
