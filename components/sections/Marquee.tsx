"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

/** Faixa contínua com tipos de evento e regiões atendidas. */
export function Marquee() {
  const { t } = useI18n();
  const items = t.marquee;

  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap sm:gap-14">
          <span>{item}</span>
          <span aria-hidden className="size-1.5 rotate-45 border border-brass" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative overflow-hidden border-y border-brass/20 bg-ink py-5 font-display text-[clamp(1.05rem,1.8vw,1.45rem)] text-foam/80">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
