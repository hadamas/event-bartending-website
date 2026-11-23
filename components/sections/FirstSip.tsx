"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { getDrink, type Drink } from "@/data/drinks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { DrinkVisual } from "@/components/ui/DrinkVisual";

/** Drinks que aparecem nesta cena (ids de data/drinks.ts). */
const SCENE = ["caipirinha", "aperol-spritz", "frutas-vermelhas-zero"];

/**
 * "Depois do primeiro gole": o copo enche conforme a página rola
 * e a cor do título acompanha o drink da vez.
 */
export function FirstSip() {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const list = SCENE.map(getDrink).filter((d): d is Drink => Boolean(d));
  const n = list.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const stops = list.map((_, i) => (i + 0.5) / n);
  const color = useTransform(scrollYProgress, stops, list.map((d) => d.accent));
  const ghostY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  const mainScale = useTransform(scrollYProgress, [0, 0.18], [0.82, 1]);
  const subOpacity = useTransform(scrollYProgress, [0.12, 0.3], [0, 1]);

  const title = `${t.firstSip.top} ${t.firstSip.main}, ${t.firstSip.sub}`;

  if (reduced || n === 0) {
    return (
      <section aria-labelledby="first-sip-title" className="bg-ink py-28 text-center">
        <h2 id="first-sip-title" className="sr-only">{title}</h2>
        <div aria-hidden className="container-x flex flex-col items-center">
          <span className="text-outline font-display text-[clamp(3rem,13vw,12rem)] leading-none text-brass/40">
            {t.firstSip.top}
          </span>
          {list[0] && <DrinkVisual drink={list[0]} decorative className="my-6 h-[40svh] w-auto text-champagne" />}
          <span className="font-display text-[clamp(2.4rem,8vw,7rem)] leading-none" style={{ color: list[0]?.accent }}>
            {t.firstSip.main}
          </span>
          <span className="mt-5 text-lg text-foam/70">{t.firstSip.sub}</span>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="first-sip-title" className="relative h-[260vh] bg-ink">
      <h2 id="first-sip-title" className="sr-only">{title}</h2>
      <div aria-hidden className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        <motion.span
          style={{ y: ghostY }}
          className="text-outline pointer-events-none absolute top-[12svh] select-none whitespace-nowrap font-display text-[clamp(3.4rem,15vw,15rem)] leading-none text-brass/35"
        >
          {t.firstSip.top}
        </motion.span>

        <div className="relative mt-[6svh] h-[44svh] w-full max-w-[28rem]">
          {list.map((drink, i) => (
            <SceneGlass key={drink.id} drink={drink} index={i} count={n} progress={scrollYProgress} />
          ))}
        </div>

        <motion.span
          style={{ color, scale: mainScale }}
          className="relative mt-4 text-center font-display text-[clamp(2.4rem,8.4vw,8rem)] font-semibold leading-[0.95]"
        >
          {t.firstSip.main}
        </motion.span>
        <motion.span style={{ opacity: subOpacity }} className="mt-5 px-6 text-center text-lg text-foam/70">
          {t.firstSip.sub}
        </motion.span>
      </div>
    </section>
  );
}

function SceneGlass({
  drink,
  index,
  count,
  progress,
}: {
  drink: Drink;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / count;
  const start = index * seg;
  const end = start + seg;
  const first = index === 0;
  const last = index === count - 1;

  const inR: number[] = [];
  const xOut: string[] = [];
  const oOut: number[] = [];
  if (first) {
    inR.push(0);
    xOut.push("0%");
    oOut.push(1);
  } else {
    inR.push(start - 0.06, start + 0.02);
    xOut.push("70%", "0%");
    oOut.push(0, 1);
  }
  if (last) {
    inR.push(1);
    xOut.push("0%");
    oOut.push(1);
  } else {
    inR.push(end - 0.06, end + 0.02);
    xOut.push("0%", "-70%");
    oOut.push(1, 0);
  }

  const x = useTransform(progress, inR, xOut);
  const opacity = useTransform(progress, inR, oOut);
  const target = drink.visual.fill ?? 0.7;
  const level = useTransform(progress, [start + (first ? 0 : 0.02), start + seg * 0.7], [0.04, target]);

  return (
    <motion.div style={{ x, opacity }} className="absolute inset-0 flex items-end justify-center">
      <span
        className="absolute bottom-0 left-1/2 h-[8%] w-[55%] -translate-x-1/2 rounded-[50%] blur-xl"
        style={{ background: `${drink.accent}40` }}
      />
      <DrinkVisual drink={drink} fill={level} decorative className="h-full w-auto text-champagne" />
    </motion.div>
  );
}
