"use client";

import { useId, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { getDrink } from "@/data/drinks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { pick } from "@/lib/i18n/localize";
import { DrinkVisual } from "@/components/ui/DrinkVisual";

/** Drink exibido no centro do círculo (id de data/drinks.ts). */
const SIGNATURE_DRINK = "old-fashioned";

/** Frase girando em volta de um drink — gira junto com a rolagem. */
export function Signature() {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLElement>(null);
  const drink = getDrink(SIGNATURE_DRINK);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-40, 140]);
  const scale = useTransform(scrollYProgress, [0.05, 0.42], [0.72, 1]);
  const glassY = useTransform(scrollYProgress, [0.05, 0.5], ["14%", "0%"]);

  if (!drink) return null;
  const ring = `${t.signature.ring.toUpperCase()} ✦ `;

  return (
    <section ref={ref} aria-labelledby="signature-title" className="relative overflow-hidden bg-champagne py-24 text-ink lg:py-32">
      <h2 id="signature-title" className="sr-only">
        {t.signature.ring}
      </h2>
      <div className="relative mx-auto aspect-square w-[min(94vw,46rem)]">
        <motion.div aria-hidden style={reduced ? { rotate: 0 } : { rotate }} className="absolute inset-0">
          <svg viewBox="0 0 1000 1000" className="h-full w-full overflow-visible">
            <defs>
              <path id={`ring-${uid}`} d="M 500 500 m -455 0 a 455 455 0 1 1 910 0 a 455 455 0 1 1 -910 0" />
            </defs>
            <text className="fill-ink font-display text-[60px] font-semibold">
              <textPath href={`#ring-${uid}`} textLength={2 * Math.PI * 455 - 6} lengthAdjust="spacing">
                {ring}
              </textPath>
            </text>
          </svg>
        </motion.div>

        <motion.div
          style={reduced ? { scale: 1 } : { scale }}
          className="absolute inset-[11%] overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_40%,#efe4cf_0%,#dccaa6_62%,#cdb98f_100%)]"
        >
          <motion.div style={reduced ? { y: 0 } : { y: glassY }} className="absolute inset-x-[27%] bottom-[12%] top-[24%] flex justify-center">
            <DrinkVisual drink={drink} decorative className="h-full w-auto text-ink/80" />
          </motion.div>
          <p className="absolute left-[9%] top-1/2 hidden max-w-[8.5rem] sm:block -translate-y-1/2 font-display text-[clamp(0.8rem,1.8vw,1.15rem)] font-semibold leading-tight">
            {pick(drink.name, locale)}
          </p>
          <p className="absolute right-[9%] top-1/2 hidden max-w-[8.5rem] sm:block -translate-y-1/2 text-right font-display text-[clamp(0.8rem,1.8vw,1.15rem)] font-semibold leading-tight">
            {t.signature.rightLabel}
          </p>
        </motion.div>
      </div>
      <p className="container-x mt-12 text-center text-lg text-ink/70">{t.signature.caption}</p>
    </section>
  );
}
