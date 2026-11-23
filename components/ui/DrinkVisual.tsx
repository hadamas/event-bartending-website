"use client";

import Image from "next/image";
import type { MotionValue } from "motion/react";
import type { Drink } from "@/data/drinks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { pick } from "@/lib/i18n/localize";
import { cn } from "@/lib/cn";
import { GlassIllustration } from "./GlassIllustration";

/**
 * Mostra a foto do drink quando existir; caso contrário, a ilustração do copo.
 */
export function DrinkVisual({
  drink,
  className,
  sizes = "(min-width: 1024px) 30vw, 70vw",
  priority,
  fill,
  pour,
  pourKey,
  pourDelay,
  draw,
  decorative,
}: {
  drink: Drink;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: number | MotionValue<number>;
  pour?: boolean;
  pourKey?: string | number;
  pourDelay?: number;
  draw?: boolean;
  decorative?: boolean;
}) {
  const { locale, t } = useI18n();
  const name = pick(drink.name, locale);

  if (drink.image) {
    return (
      <div className={cn("relative", className)}>
        <Image
          src={drink.image.src}
          alt={decorative ? "" : pick(drink.image.alt, locale)}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <GlassIllustration
      visual={drink.visual}
      fill={fill}
      pour={pour}
      pourKey={pourKey}
      pourDelay={pourDelay}
      draw={draw}
      className={className}
      title={decorative ? undefined : `${name} — ${t.common.illustrative}`}
    />
  );
}
