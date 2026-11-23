"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill, pick } from "@/lib/i18n/localize";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { RevealText } from "@/components/ui/RevealText";

/** Foto do Mário em: /public/images/team/mario.jpg */
const PORTRAIT_SRC: string | undefined = "/images/team/mario.jpg"

const PILLAR_STYLES = [
  "bg-ink text-champagne -rotate-2",
  "bg-brass text-ink rotate-[1.5deg]",
  "bg-champagne-3 text-ink -rotate-1",
  "bg-amber text-ink rotate-2",
];

export function About() {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const regions = site.regions.join(", ");

  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-champagne text-ink">
      {/* História e responsável */}
      <div className="container-x grid gap-14 pb-24 pt-28 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-36">
        <div className="lg:col-span-5">
          <div
            ref={portraitRef}
            className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-t-[999px] lg:mx-0"
          >
            <motion.div style={reduced ? { y: 0 } : { y: portraitY }} className="absolute inset-[-8%_0]">
              <MediaPlaceholder
                src={PORTRAIT_SRC}
                alt={t.about.portrait}
                tone="#3b2410"
                glass="rocks"
                className="h-full w-full"
                captionClassName="pb-[14%] pl-[10%]"
                sizes="(min-width: 1024px) 30vw, 90vw"
              />
            </motion.div>
            {!reduced && (
              <motion.span
                aria-hidden
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, ease: easeOutExpo }}
                className="absolute inset-0 origin-top bg-champagne"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <RevealText
            id="about-title"
            lines={t.about.heading}
            className="text-balance font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.08] text-ink"
          />
          <div className="mt-9 max-w-[58ch] space-y-5 text-[1.08rem] leading-[1.75] text-ink/80">
            {t.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-9 flex items-center gap-4">
            <span className="font-display text-3xl text-ink">{t.about.signature}</span>
            <span aria-hidden className="h-px w-10 bg-brass-deep/60" />
            <span className="text-[0.95rem] text-ink/65">{t.about.signatureRole}</span>
          </p>
        </div>
      </div>

      {/* Fatos */}
      <div className="container-x">
        <dl className="grid border-y border-ink/15 sm:grid-cols-3">
          {t.about.facts.map((fact, i) => (
            <div
              key={fact.term}
              className={cn(
                "py-8 sm:px-8 sm:py-10",
                i > 0 && "border-t border-ink/15 sm:border-l sm:border-t-0",
                i === 0 && "sm:pl-0",
              )}
            >
              <dt className="font-display text-xl text-ink">{fact.term}</dt>
              <dd className="mt-2 max-w-[32ch] text-ink/70">
                {fill(fact.detail, { regions, andRegions: t.common.andRegions })}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Diferenciais */}
      <div className="container-x py-28 text-center lg:py-36">
        <h3 className="text-[0.95rem] text-brass-deep">{t.pillars.heading}</h3>
        <ul className="mx-auto mt-10 flex max-w-5xl flex-col items-center gap-3 sm:gap-4">
          {t.pillars.items.map((item, i) => (
            <motion.li
              key={item}
              initial={reduced ? false : { opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: easeOutExpo }}
              className={cn(
                "inline-block px-5 py-2 font-display text-[clamp(1.5rem,4.6vw,4rem)] font-semibold leading-[1.15] sm:px-7",
                PILLAR_STYLES[i % PILLAR_STYLES.length],
              )}
            >
              {item}
            </motion.li>
          ))}
        </ul>
        <p className="mx-auto mt-14 max-w-[52ch] text-[1.1rem] leading-relaxed text-ink/75">
          {t.pillars.philosophy}
        </p>
      </div>

      {/* Serviços */}
      <div className="container-x grid gap-12 pb-28 lg:grid-cols-12 lg:pb-36">
        <div className="lg:col-span-4">
          <h3 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">{t.services.heading}</h3>
          <p className="mt-5 max-w-[36ch] text-ink/70">{t.services.intro}</p>
        </div>
        <ul className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
          {services.map((service) => (
            <li
              key={service.id}
              className="group grid gap-2 border-b border-ink/15 py-7 transition-colors duration-500 sm:grid-cols-[1fr_1.3fr] sm:gap-10"
            >
              <h4 className="flex items-center gap-3 font-display text-[1.35rem] leading-snug">
                <span
                  aria-hidden
                  className="h-px w-0 bg-brass-deep transition-[width] duration-500 ease-pour group-hover:w-6"
                />
                {pick(service.title, locale)}
              </h4>
              <p className="text-ink/70">{pick(service.description, locale)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
