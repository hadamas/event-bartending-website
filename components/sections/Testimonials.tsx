"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ArrowLeft, ArrowRight, UserRound } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill, pick } from "@/lib/i18n/localize";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { RevealText } from "@/components/ui/RevealText";

const AUTOPLAY_MS = 9000;

export function Testimonials() {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;
  const current = testimonials[index];

  useEffect(() => {
    if (reduced || paused || !inView || total < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, reduced, paused, inView, total]);

  if (!total) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  return (
    <section
      id="testimonials"
      ref={ref}
      aria-labelledby="testimonials-title"
      className="grain relative overflow-hidden bg-smoke py-28 text-foam lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[6vw] -top-[8vw] select-none font-display text-[34vw] leading-none text-foam/[0.03]"
      >
        &ldquo;
      </span>

      <div className="container-x relative grid gap-14 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-4">
          <RevealText
            id="testimonials-title"
            lines={t.testimonials.heading}
            className="text-balance font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.1]"
          />
          <p className="max-w-[34ch] text-sm italic text-foam/55">{t.testimonials.note}</p>

          <div className="mt-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.testimonials.previous}
              className="grid size-12 place-items-center rounded-full border border-foam/25 transition-colors hover:border-brass"
            >
              <ArrowLeft size={18} strokeWidth={1.5} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.testimonials.next}
              className="grid size-12 place-items-center rounded-full border border-foam/25 transition-colors hover:border-brass"
            >
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="relative min-h-[17rem] sm:min-h-[15rem]" aria-live={paused ? "polite" : "off"}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: easeOutExpo }}
              >
                <blockquote className="text-[clamp(1.35rem,2.4vw,2rem)] font-light leading-[1.45] text-foam/90">
                  <p>&ldquo;{pick(current.quote, locale)}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-9 flex items-center gap-4">
                  <Avatar name={current.name} photo={current.photo} size="lg" />
                  <span className="flex flex-col">
                    <span className="font-display text-lg text-foam">{current.name}</span>
                    {current.context && (
                      <span className="text-sm text-brass">{pick(current.context, locale)}</span>
                    )}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <ul className="mt-12 flex flex-wrap gap-3 border-t border-foam/10 pt-8">
            {testimonials.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={fill(t.testimonials.select, { index: i + 1, name: item.name })}
                  aria-pressed={i === index}
                  className={cn(
                    "rounded-full p-[3px] transition-[box-shadow,opacity] duration-500",
                    i === index ? "opacity-100 shadow-[0_0_0_1.5px_var(--color-brass)]" : "opacity-50 hover:opacity-90",
                  )}
                >
                  <Avatar name={item.name} photo={item.photo} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Avatar({ name, photo, size = "md" }: { name: string; photo?: string; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-14" : "size-12";
  if (photo) {
    return (
      <span className={cn("relative block overflow-hidden rounded-full", box)}>
        <Image src={photo} alt={name} fill sizes="56px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#4a3a28,#211b15_70%)] text-champagne/60",
        box,
      )}
    >
      <UserRound size={size === "lg" ? 24 : 20} strokeWidth={1.3} />
    </span>
  );
}
