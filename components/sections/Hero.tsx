"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { featuredDrinks, type Garnish } from "@/data/drinks";
import { heroConfig } from "@/data/hero";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill, pick } from "@/lib/i18n/localize";
import { scrollToSection, useIntroDone, usePrefersReducedMotion } from "@/lib/hooks";
import { easeInOut, easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { DrinkVisual } from "@/components/ui/DrinkVisual";
import { PourButton } from "@/components/ui/PourButton";
import { RevealText } from "@/components/ui/RevealText";
import { useDrinkDialog } from "./drinks/DrinkDialog";

export function Hero() {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const introDone = useIntroDone();
  const { openDrink } = useDrinkDialog();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });

  const slides = featuredDrinks;
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [layer, setLayer] = useState(0);
  const [paused, setPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const drink = slides[index];
  const progress = useMotionValue(0);

  const goTo = (next: number, manual = false) => {
    const i = (next + total) % total;
    progress.set(0);
    setIndex(i);
    setLayer((l) => l + 1);
    if (manual) {
      setAnnouncement(
        fill(t.hero.slideStatus, { current: i + 1, total, name: pick(slides[i].name, locale) }),
      );
    }
  };

  // Autoplay: pausa fora da tela, com o mouse/foco no slider ou com reduced motion.
  useEffect(() => {
    if (!heroConfig.showSlider || total < 2 || reduced || paused || !inView || !introDone) return;
    let cancelled = false;
    const remaining = (1 - progress.get()) * (heroConfig.autoplayMs / 1000);
    const controls = animate(progress, 1, { duration: remaining, ease: "linear" });
    controls.then(() => {
      if (cancelled) return;
      progress.set(0);
      setIndex((i) => (i + 1) % total);
      setLayer((l) => l + 1);
    });
    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [index, paused, inView, reduced, introDone, total, progress]);

  // Profundidade: mouse + rolagem
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const glassY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const glassScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);

  const bg = heroConfig.background;
  const name = pick(drink.name, locale);

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className={cn(
        "relative isolate overflow-hidden bg-ink [--gx:50%] [--gy:58%] lg:[--gx:61%] lg:[--gy:50%]",
        heroConfig.decorations.grain && "grain",
      )}
    >
      {/* Mídia de fundo opcional (foto ou vídeo) */}
      {bg.type === "image" && bg.src && (
        <Image src={bg.src} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      )}
      {bg.type === "video" && bg.src && !reduced && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={bg.poster || undefined}
          aria-hidden
        >
          <source src={bg.src} />
        </video>
      )}
      {bg.type !== "none" && bg.src && (
        <div className="absolute inset-0 -z-10 bg-ink" style={{ opacity: bg.overlay }} />
      )}

      {/* Brilho na cor do drink, abrindo em círculo a cada troca */}
      {heroConfig.decorations.glow && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <AnimatePresence initial={false}>
            <motion.div
              key={layer}
              className="absolute inset-0"
              style={{
                zIndex: layer,
                background: `radial-gradient(34% 44% at var(--gx) var(--gy), ${drink.accent}40 0%, ${drink.accent}10 48%, transparent 76%), radial-gradient(90% 55% at var(--gx) 108%, ${drink.visual.liquid}70 0%, transparent 70%), ${bg.type === "none" ? "#0b0907" : "transparent"}`,
              }}
              initial={{ clipPath: "circle(0% at var(--gx) var(--gy))" }}
              animate={{ clipPath: "circle(150% at var(--gx) var(--gy))" }}
              exit={{ opacity: 0.99, transition: { duration: 1.3 } }}
              transition={{ duration: reduced ? 0 : 1.3, ease: easeInOut }}
            />
          </AnimatePresence>
        </div>
      )}

      <div className="container-x relative grid min-h-[100svh] grid-cols-1 content-center gap-x-8 gap-y-7 pb-10 pt-[6.25rem] lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-y-0 lg:pb-12">
        {/* Texto principal */}
        <motion.div
          style={reduced ? { y: 0, opacity: 1 } : { y: textY, opacity: textOpacity }}
          className="relative z-10 lg:col-span-6 lg:row-start-1 lg:self-end"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={introDone ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="mb-5 flex items-center gap-3 text-[0.95rem] text-champagne/80"
          >
            <span aria-hidden className="h-px w-8 bg-brass" />
            {t.hero.eyebrow}
          </motion.p>

          <RevealText
            as="h1"
            id="hero-title"
            lines={t.hero.headline}
            animateOnMount
            play={introDone}
            delay={0.1}
            stagger={0.08}
            className="font-display text-[clamp(2.15rem,4vw,4.4rem)] font-normal leading-[1.08] tracking-[0.005em] text-foam"
            lineClassName={(i) => (i === 1 ? "lg:pl-[0.9em]" : undefined)}
          />
        </motion.div>

        <motion.div
          style={reduced ? { y: 0, opacity: 1 } : { y: textY, opacity: textOpacity }}
          className="relative z-10 lg:col-span-6 lg:row-start-2 lg:self-start"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, delay: 0.55, ease: easeOutExpo }}
          >
            <p className="max-w-[44ch] text-[1.06rem] leading-relaxed text-foam/70 lg:mt-8">
              {t.hero.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5 lg:mt-9">
              <PourButton
                href="#quote"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("quote");
                }}
              >
                {t.hero.primaryCta}
              </PourButton>
              <PourButton
                href="#drinks"
                size="lg"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("drinks");
                }}
              >
                {t.hero.secondaryCta}
              </PourButton>
            </div>
          </motion.div>
        </motion.div>

        {/* Palco do drink */}
        <div className="relative row-start-2 lg:col-span-4 lg:col-start-7 lg:row-span-2 lg:row-start-1 xl:col-span-3">
          <motion.div
            style={reduced ? { y: 0, scale: 1 } : { y: glassY, scale: glassScale }}
            className="relative mx-auto h-[38svh] w-full max-w-[22rem] sm:h-[44svh] lg:h-[min(64svh,40rem)] lg:max-w-none"
          >
            <span
              aria-hidden
              className="absolute bottom-[1%] left-1/2 h-[7%] w-[62%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-md"
            />
            <AnimatePresence initial={false}>
              <motion.div
                key={layer}
                className="absolute inset-0 flex items-end justify-center"
                initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -50, filter: "blur(8px)", transition: { duration: 0.6, ease: easeInOut } }}
                transition={{ duration: 1, delay: 0.2, ease: easeOutExpo }}
              >
                <DrinkVisual
                  drink={drink}
                  pour={!reduced}
                  pourKey={`${layer}-${introDone}`}
                  pourDelay={layer === 0 ? 0.35 : 0.55}
                  draw={!reduced && layer > 0}
                  priority={layer === 0}
                  className="h-full w-auto text-champagne"
                />
              </motion.div>
            </AnimatePresence>

            {heroConfig.decorations.particles && !reduced && (
              <Particles garnish={drink.visual.garnish} layer={layer} sx={sx} sy={sy} show={introDone} />
            )}
          </motion.div>

          {heroConfig.showSlider && total > 1 && (
            <div
              className="relative z-10 mx-auto mt-5 flex max-w-[22rem] items-center justify-between gap-4 lg:mt-7"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <SliderButton label={t.hero.previous} onClick={() => goTo(index - 1, true)}>
                <ArrowLeft size={18} strokeWidth={1.5} aria-hidden />
              </SliderButton>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
                <span className="text-xs tabular-nums tracking-[0.12em] text-foam/50">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={drink.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="truncate font-display text-lg text-foam"
                  >
                    {name}
                  </motion.span>
                </AnimatePresence>
                <span aria-hidden className="relative h-px w-full max-w-[9rem] overflow-hidden bg-foam/15">
                  <motion.span
                    className="absolute inset-0 origin-left bg-brass"
                    style={{ scaleX: progress }}
                  />
                </span>
              </div>
              <SliderButton label={t.hero.next} onClick={() => goTo(index + 1, true)}>
                <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
              </SliderButton>
              <span className="sr-only" aria-live="polite">
                {announcement}
              </span>
            </div>
          )}
        </div>

        {/* Ficha do drink em destaque (desktop) */}
        <aside
          aria-label={t.hero.featuredLabel}
          className="relative z-10 hidden self-center lg:col-span-2 lg:col-start-11 lg:row-span-2 lg:row-start-1 lg:block xl:col-span-3 xl:col-start-10 xl:pl-6"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, x: 16 }}
              animate={introDone ? { opacity: 1, x: 0 } : { opacity: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
              className="flex flex-col gap-5 border-l border-foam/12 pl-6"
            >
              <p className="text-sm text-brass">{t.hero.featuredLabel}</p>
              <p className="font-display text-[1.65rem] leading-tight text-foam">{name}</p>
              {drink.ingredients && (
                <div>
                  <p className="mb-2 text-sm text-foam/50">{t.hero.ingredientsLabel}</p>
                  <ul className="space-y-1 text-[0.95rem] text-foam/80">
                    {pick(drink.ingredients, locale).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                onClick={() => openDrink(drink.id)}
                className="group inline-flex items-center gap-2 self-start text-[0.95rem] text-foam"
              >
                <span className="border-b border-foam/30 pb-0.5 transition-colors group-hover:border-brass">
                  {t.hero.viewDrink}
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </section>
  );
}

function SliderButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-foam/25 text-foam transition-[border-color,background-color] duration-300 hover:border-brass hover:bg-foam/5"
    >
      {children}
    </button>
  );
}

/* ---------------- Elementos flutuantes ao redor do copo ---------------- */

type ParticleKind = "ice" | "orange" | "lime" | "berry" | "bean" | "leaf" | "bubble";

const SPOTS: Array<{ x: string; y: string; depth: number; size: number; rot: number }> = [
  { x: "-6%", y: "16%", depth: 1.3, size: 56, rot: -18 },
  { x: "88%", y: "22%", depth: 0.8, size: 40, rot: 24 },
  { x: "94%", y: "62%", depth: 1.6, size: 30, rot: 12 },
  { x: "-10%", y: "58%", depth: 0.6, size: 36, rot: -32 },
  { x: "62%", y: "2%", depth: 1.1, size: 22, rot: 0 },
];

function kindsFor(garnish: Garnish): ParticleKind[] {
  const main: Record<Garnish, ParticleKind> = {
    "orange-peel": "orange",
    "orange-wheel": "orange",
    "lime-wheel": "lime",
    berries: "berry",
    "coffee-beans": "bean",
    herb: "leaf",
    none: "bubble",
  };
  const m = main[garnish];
  return [m, "ice", m, "ice", "bubble"];
}

function Particles({
  garnish,
  layer,
  sx,
  sy,
  show,
}: {
  garnish: Garnish;
  layer: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  show: boolean;
}) {
  const kinds = kindsFor(garnish);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <AnimatePresence initial={false}>
        {SPOTS.map((spot, i) => (
          <Particle key={`${layer}-${i}`} spot={spot} kind={kinds[i]} index={i} sx={sx} sy={sy} show={show} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Particle({
  spot,
  kind,
  index,
  sx,
  sy,
  show,
}: {
  spot: (typeof SPOTS)[number];
  kind: ParticleKind;
  index: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  show: boolean;
}) {
  const x = useTransform(sx, (v) => v * spot.depth * -70);
  const y = useTransform(sy, (v) => v * spot.depth * -50);
  return (
    <motion.div className="absolute" style={{ left: spot.x, top: spot.y, x, y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.2, rotate: spot.rot - 60 }}
        animate={show ? { opacity: 1, scale: 1, rotate: spot.rot } : undefined}
        exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.4 } }}
        transition={{ duration: 1.1, delay: 0.7 + index * 0.08, ease: easeOutExpo }}
      >
        <ParticleShape kind={kind} size={spot.size} />
      </motion.div>
    </motion.div>
  );
}

function ParticleShape({ kind, size }: { kind: ParticleKind; size: number }) {
  const common = { width: size, height: size, viewBox: "0 0 40 40" };
  switch (kind) {
    case "ice":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="28" height="28" rx="6" fill="#fff" fillOpacity="0.08" stroke="#f5eee1" strokeOpacity="0.55" strokeWidth="1.2" />
          <path d="M12 13 l7 -2" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "orange":
    case "lime": {
      const rind = kind === "lime" ? "#6f9a2e" : "#d9731f";
      const pulp = kind === "lime" ? "#d6e88f" : "#f6bf6a";
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="18" fill={rind} />
          <circle cx="20" cy="20" r="15" fill={pulp} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1="20" y1="20" x2={20 + Math.cos(a) * 13} y2={20 + Math.sin(a) * 13} stroke="#fff" strokeOpacity="0.7" />;
          })}
        </svg>
      );
    }
    case "berry":
      return (
        <svg {...common}>
          <circle cx="20" cy="22" r="14" fill="#8e1838" />
          <circle cx="15" cy="16" r="3.5" fill="#fff" opacity="0.45" />
        </svg>
      );
    case "bean":
      return (
        <svg {...common}>
          <ellipse cx="20" cy="20" rx="13" ry="9" fill="#2a170c" stroke="#6b4a33" strokeWidth="1" />
          <path d="M9 20 C16 16 24 24 31 20" stroke="#6b4a33" strokeWidth="1.4" fill="none" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M6 32 C10 14 22 6 34 6 C34 20 24 32 6 32Z" fill="#58744a" />
          <path d="M8 30 L30 9" stroke="#a9c79a" strokeWidth="1" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="12" stroke="#f5eee1" strokeOpacity="0.45" strokeWidth="1.2" fill="none" />
        </svg>
      );
  }
}
