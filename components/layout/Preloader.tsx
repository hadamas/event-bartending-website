"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { INTRO_DONE_EVENT, useClientValue } from "@/lib/hooks";
import { getDrink } from "@/data/drinks";
import { easeInOut } from "@/lib/motion";
import { GlassIllustration } from "@/components/ui/GlassIllustration";

const TARGET = 0.66;

/**
 * Introdução: um Old Fashioned sendo servido enquanto o site carrega.
 * Ao terminar, abre um círculo a partir do copo e revela o hero.
 * Aparece uma vez por sessão e é ignorada com "reduzir movimento".
 */
export function Preloader() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const alreadySeen = useClientValue(
    () => document.documentElement.classList.contains("intro-seen"),
    false,
  );
  const [percent, setPercent] = useState(0);
  const level = useMotionValue(0);
  const radius = useMotionValue(0);
  const waveBackY = useTransform(level, [0, TARGET], ["100%", "8%"]);
  const waveFrontY = useTransform(level, [0, TARGET], ["100%", "34%"]);
  const mask = useTransform(
    radius,
    (r) => `radial-gradient(circle at 50% 46%, transparent ${r}px, #000 ${r + 1}px)`,
  );
  const drink = getDrink("old-fashioned");

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("intro-seen")) return;

    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    let cancelled = false;

    const finish = () => {
      root.classList.add("intro-seen");
      root.style.overflow = previousOverflow;
      try {
        sessionStorage.setItem("mb-intro", "1");
      } catch {}
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      setDone(true);
    };

    const unsubscribe = level.on("change", (v) =>
      setPercent(Math.min(100, Math.round((v / TARGET) * 100))),
    );
    const pour = animate(level, TARGET, { duration: 2, ease: [0.45, 0, 0.2, 1], delay: 0.35 });
    pour.then(() => {
      if (cancelled) return;
      const max = Math.hypot(window.innerWidth, window.innerHeight);
      // dispara o hero junto com a abertura
      window.setTimeout(() => !cancelled && window.dispatchEvent(new Event(INTRO_DONE_EVENT)), 250);
      animate(radius, max, { duration: 1.1, ease: easeInOut, delay: 0.15 }).then(() => {
        if (!cancelled) finish();
      });
    });

    return () => {
      cancelled = true;
      pour.stop();
      unsubscribe();
      root.style.overflow = previousOverflow;
    };
  }, [level, radius]);

  if (done || alreadySeen || !drink) return null;

  return (
    <motion.div
      aria-hidden
      className="preloader fixed inset-0 z-[100] flex flex-col overflow-hidden bg-ink text-champagne"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* Ondas que sobem conforme o copo enche */}
      <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ y: waveBackY }}>
        <svg
          className="absolute left-0 top-0 h-24 w-[200%] -translate-y-[calc(100%-1px)] animate-[marquee_7s_linear_infinite] text-smoke-2"
          viewBox="0 0 2400 100"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0 60 C200 20 400 20 600 60 S1000 100 1200 60 S1600 20 1800 60 S2200 100 2400 60 V100 H0Z"
          />
        </svg>
        <div className="h-full bg-smoke-2" />
      </motion.div>
      <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ y: waveFrontY }}>
        <svg
          className="absolute left-0 top-0 h-20 w-[200%] -translate-y-[calc(100%-1px)] animate-[marquee_11s_linear_infinite_reverse] text-smoke"
          viewBox="0 0 2400 100"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0 50 C250 90 450 10 700 50 S1150 90 1200 50 S1650 10 1900 50 S2300 90 2400 50 V100 H0Z"
          />
        </svg>
        <div className="h-full bg-smoke" />
      </motion.div>

      <div className="relative flex flex-1 items-center justify-center">
        <GlassIllustration
          visual={drink.visual}
          fill={level}
          draw
          strokeWidth={1.4}
          className="h-[min(38vh,320px)] w-auto -translate-y-[4%]"
        />
      </div>

      <div className="container-x relative flex items-end justify-between pb-8 text-sm">
        <span className="italic text-foam/70">{t.preloader.label}…</span>
        <span className="font-display text-2xl tabular-nums text-champagne">{percent}%</span>
      </div>
    </motion.div>
  );
}
