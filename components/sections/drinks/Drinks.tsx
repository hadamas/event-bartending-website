"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { Plus } from "lucide-react";
import { drinks, type Drink } from "@/data/drinks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill, pick } from "@/lib/i18n/localize";
import { scrollToSection, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { DrinkVisual } from "@/components/ui/DrinkVisual";
import { PourButton } from "@/components/ui/PourButton";
import { useDrinkDialog } from "./DrinkDialog";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Drinks: no desktop, a rolagem vertical move os cards na horizontal;
 * no celular/tablet, os cards deslizam com o dedo (scroll-snap).
 */
export function Drinks() {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = isDesktop && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const mobileProgress = useMotionValue(0);

  useIsoLayoutEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);
  const barScale = pinned ? scrollYProgress : mobileProgress;

  const heading = (
    <div className="flex flex-col gap-6">
      <h2 id="drinks-title" className="font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.12] text-foam">
        {t.drinks.headingStart}{" "}
        <span className="relative inline-block -rotate-3 bg-brass px-3 text-ink">{t.drinks.headingTag}</span>{" "}
        {t.drinks.headingEnd}
      </h2>
      <p className="max-w-[34ch] text-foam/70">{t.drinks.intro}</p>
      <p className="max-w-[36ch] text-sm italic text-foam/50">{t.drinks.note}</p>
    </div>
  );

  return (
    <section
      id="drinks"
      ref={sectionRef}
      aria-labelledby="drinks-title"
      className="relative bg-ink"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div
        className={cn(
          pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden" : "py-24",
        )}
      >
        {!pinned && <div className="container-x mb-12">{heading}</div>}

        <motion.ul
          ref={trackRef}
          style={pinned ? { x } : undefined}
          onScroll={
            pinned
              ? undefined
              : (e) => {
                  const el = e.currentTarget;
                  const max = el.scrollWidth - el.clientWidth;
                  mobileProgress.set(max > 0 ? el.scrollLeft / max : 0);
                }
          }
          aria-label={t.nav.drinks}
          className={cn(
            "flex items-stretch",
            pinned
              ? "w-max gap-6 pl-[max(3.5rem,calc((100vw-92rem)/2+3.5rem))] pr-[8vw]"
              : "no-scrollbar snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:scroll-px-10 sm:px-10",
          )}
        >
          {pinned && <li className="flex w-[min(30vw,26rem)] shrink-0 items-center pr-10">{heading}</li>}
          {drinks.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
          <EndCard />
        </motion.ul>

        <div className="container-x mt-8 flex items-center gap-5 lg:mt-10">
          <span aria-hidden className="relative h-px flex-1 overflow-hidden bg-foam/12">
            <motion.span className="absolute inset-0 origin-left bg-brass" style={{ scaleX: barScale }} />
          </span>
          {!pinned && <span className="text-sm text-foam/50">{t.drinks.swipeHint}</span>}
        </div>
      </div>
    </section>
  );
}

function DrinkCard({ drink }: { drink: Drink }) {
  const { t, locale } = useI18n();
  const { openDrink } = useDrinkDialog();
  const name = pick(drink.name, locale);

  return (
    <li className="w-[76vw] max-w-[22rem] shrink-0 snap-start sm:w-[20rem] lg:w-[min(24vw,22rem)]">
      <article
        onClick={() => openDrink(drink.id)}
        className="group relative flex h-[min(66svh,34rem)] min-h-[28rem] cursor-pointer flex-col overflow-hidden rounded-b-[6px] rounded-t-[999px] bg-smoke-2"
      >
        <span
          aria-hidden
          className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `radial-gradient(65% 45% at 50% 42%, ${drink.accent}30 0%, transparent 72%)`,
          }}
        />
        <span aria-hidden className="absolute inset-[10px] rounded-b-[2px] rounded-t-[999px] border border-champagne/10" />

        <div className="relative flex min-h-0 flex-1 items-end justify-center px-8 pt-14">
          <DrinkVisual
            drink={drink}
            decorative
            className="h-[92%] w-auto text-champagne/85 transition-transform duration-700 ease-pour group-hover:-translate-y-2"
            sizes="(min-width: 1024px) 22rem, 76vw"
          />
        </div>

        <div className="relative flex flex-col gap-2 px-7 pb-7 pt-5">
          <p className="flex items-center gap-2 text-sm text-brass">
            {t.drinks.categories[drink.category]}
            {drink.placeholder && (
              <span className="rounded-full border border-foam/15 px-2 py-px text-[0.7rem] text-foam/50">
                {t.common.placeholderBadge}
              </span>
            )}
          </p>
          <h3 className="font-display text-[1.6rem] leading-tight text-foam">{name}</h3>
          <p className="line-clamp-2 text-[0.95rem] text-foam/65">{pick(drink.description, locale)}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrink(drink.id);
            }}
            aria-label={fill(t.drinks.detailsOf, { name })}
            className="mt-3 inline-flex items-center gap-3 self-start text-[0.95rem] text-foam"
          >
            <span className="grid size-9 place-items-center rounded-full border border-foam/25 transition-colors duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
              <Plus size={16} strokeWidth={1.6} aria-hidden />
            </span>
            {t.drinks.details}
          </button>
        </div>
      </article>
    </li>
  );
}

function EndCard() {
  const { t } = useI18n();
  return (
    <li className="w-[76vw] max-w-[22rem] shrink-0 snap-start sm:w-[20rem] lg:w-[min(24vw,22rem)]">
      <div className="relative flex h-[min(66svh,34rem)] min-h-[28rem] flex-col justify-end gap-5 overflow-hidden rounded-b-[6px] rounded-t-[999px] border border-brass/35 p-8">
        <h3 className="font-display text-[1.9rem] leading-tight text-champagne">{t.drinks.endCardTitle}</h3>
        <p className="text-foam/70">{t.drinks.endCardText}</p>
        <PourButton
          href="#quote"
          className="self-start"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("quote");
          }}
        >
          {t.drinks.endCardCta}
        </PourButton>
      </div>
    </li>
  );
}
