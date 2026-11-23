"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_STORAGE_KEY, localeMeta, locales } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill } from "@/lib/i18n/localize";
import { cn } from "@/lib/cn";

/**
 * Alterna entre /pt-BR e /en mantendo a posição de rolagem,
 * e memoriza a escolha para as próximas visitas.
 */
export function LanguageSwitcher({
  className,
  tone = "light",
  onSwitch,
}: {
  className?: string;
  tone?: "light" | "dark";
  onSwitch?: () => void;
}) {
  const { locale, t } = useI18n();
  const router = useRouter();

  return (
    <div role="group" aria-label={t.nav.language} className={cn("flex items-center text-sm", className)}>
      {locales.map((l, i) => {
        const current = l === locale;
        return (
          <Fragment key={l}>
            {i > 0 && (
              <span aria-hidden className={cn("mx-2", tone === "light" ? "text-foam/30" : "text-ink/30")}>
                /
              </span>
            )}
            <a
              href={`/${l}`}
              hrefLang={l}
              lang={l}
              aria-current={current ? "true" : undefined}
              aria-label={current ? localeMeta[l].label : fill(t.nav.switchTo, { language: localeMeta[l].label })}
              onClick={(e) => {
                e.preventDefault();
                if (current) return;
                try {
                  localStorage.setItem(LOCALE_STORAGE_KEY, l);
                } catch {}
                onSwitch?.();
                router.push(`/${l}`, { scroll: false });
              }}
              className={cn(
                "py-1 tracking-[0.06em] transition-colors",
                tone === "light"
                  ? current
                    ? "text-foam"
                    : "text-foam/50 hover:text-foam"
                  : current
                    ? "text-ink"
                    : "text-ink/50 hover:text-ink",
              )}
            >
              {localeMeta[l].short}
            </a>
          </Fragment>
        );
      })}
    </div>
  );
}
