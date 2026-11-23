"use client";

import Image from "next/image";
import type { GlassType } from "@/data/drinks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import { GlassIllustration } from "./GlassIllustration";

/**
 * Foto do site (renderiza <span> para poder ficar dentro de parágrafos). Sem `src`, exibe uma moldura provisória com legenda —
 * basta preencher `src` (nos arquivos de /data) para mostrar a foto real.
 */
export function MediaPlaceholder({
  src,
  alt,
  tone = "#2a1d12",
  glass = "rocks",
  className,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority,
  caption = true,
  compact = false,
  captionClassName,
}: {
  src?: string;
  alt: string;
  tone?: string;
  glass?: GlassType;
  className?: string;
  sizes?: string;
  priority?: boolean;
  caption?: boolean;
  compact?: boolean;
  captionClassName?: string;
}) {
  const { t } = useI18n();

  if (src) {
    return (
      <span className={cn("relative block overflow-hidden", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={`${alt} (${t.common.placeholderPhoto})`}
      className={cn("grain relative block overflow-hidden text-champagne/45", className)}
      style={{
        background: `radial-gradient(120% 90% at 28% 18%, color-mix(in oklab, ${tone} 55%, #e9dcc2 12%) 0%, ${tone} 48%, #0b0907 100%)`,
      }}
    >
      <GlassIllustration
        visual={{ glass, liquid: "#000", liquidLight: "#000", garnish: "none" }}
        fill={0}
        details={false}
        strokeWidth={1.1}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%]",
          compact ? "h-[46%]" : "h-[38%]",
        )}
      />
      {caption && (
        <span
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4 text-left leading-snug",
            compact && "p-2.5",
            captionClassName,
          )}
        >
          <span className={cn("text-champagne/80", compact ? "text-[0.7rem]" : "text-sm")}>{alt}</span>
          {!compact && <span className="text-xs italic text-champagne/55">{t.common.placeholderPhoto}</span>}
        </span>
      )}
    </span>
  );
}
