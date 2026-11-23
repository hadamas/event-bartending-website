"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { gallery } from "@/data/gallery";
import { contacts } from "@/data/contacts";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { pick } from "@/lib/i18n/localize";
import { cn } from "@/lib/cn";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { PourButton } from "@/components/ui/PourButton";

/**
 * Experiência: frase que se revela palavra por palavra com a rolagem,
 * seguida de uma foto em tela cheia que se abre numa galeria de eventos.
 */
export function Experience() {
  return (
    <>
      <Statement />
      <Gallery />
    </>
  );
}

/* Fotos pequenas entre as frases (ids da galeria). */
const INLINE_IMAGES = [
  { index: 2, label: 0 },
  { index: 5, label: 1 },
];

function Statement() {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const parts = t.experience.statement;
  const words = parts.map((p) => p.split(" "));
  const totalWords = words.flat().length + INLINE_IMAGES.length;
  let cursor = 0;

  const content = parts.map((part, pi) => {
    const partWords = words[pi].map((w, wi) => {
      const i = cursor++;
      return (
        <Fragment key={`${pi}-${wi}`}>
          {wi > 0 && " "}
          <Word index={i} total={totalWords} progress={scrollYProgress} reduced={!!reduced}>
            {w}
          </Word>
        </Fragment>
      );
    });
    const inline = INLINE_IMAGES[pi];
    let pill = null;
    if (inline && pi < parts.length - 1) {
      const i = cursor++;
      const item = gallery[inline.index];
      pill = (
        <>
          {" "}
          <Pill index={i} total={totalWords} progress={scrollYProgress} reduced={!!reduced}>
            <MediaPlaceholder
              src={item?.src}
              alt={item ? pick(item.alt, locale) : t.experience.imageLabels[inline.label]}
              tone={item?.tone}
              glass={item?.glass}
              caption={false}
              compact
              className="h-full w-full"
              sizes="160px"
            />
          </Pill>
        </>
      );
    }
    return (
      <Fragment key={pi}>
        {pi > 0 && " "}
        {partWords}
        {pill}
      </Fragment>
    );
  });

  return (
    <section
      ref={ref}
      aria-label={parts.join(" ")}
      className={cn("relative bg-champagne text-ink", reduced ? "py-28" : "h-[200vh]")}
    >
      <div className={cn(!reduced && "sticky top-0 flex h-[100svh] items-center")}>
        <p className="container-x mx-auto max-w-[62rem] text-center font-display text-[clamp(1.9rem,5vw,4.6rem)] font-semibold leading-[1.18]">
          {content}
        </p>
      </div>
    </section>
  );
}

function Word({
  index,
  total,
  progress,
  reduced,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const start = 0.08 + (index / total) * 0.72;
  const opacity = useTransform(progress, [start, start + 0.06], [0.14, 1]);
  return <motion.span style={reduced ? { opacity: 1 } : { opacity }}>{children}</motion.span>;
}

function Pill({
  index,
  total,
  progress,
  reduced,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const start = 0.08 + (index / total) * 0.72;
  const scale = useTransform(progress, [start - 0.02, start + 0.08], [0, 1]);
  return (
    <motion.span
      style={reduced ? { scale: 1 } : { scale }}
      className="inline-block h-[0.82em] w-[1.9em] overflow-hidden rounded-full align-[-0.06em]"
    >
      {children}
    </motion.span>
  );
}

function Gallery() {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.7], [3.12, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.7], [0, 6]);
  const titleOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.72, 0.9], [30, 0]);
  const items = gallery.slice(0, 9);

  const grid = (
    <ul className="grid h-full w-full grid-cols-3 grid-rows-3 gap-2 p-2 sm:gap-3 sm:p-3">
      {items.map((item, i) => (
        <li key={item.id} className="relative min-h-0 overflow-hidden">
          <motion.div style={reduced ? { borderRadius: 6 } : { borderRadius: radius }} className="h-full w-full overflow-hidden">
            <MediaPlaceholder
              src={item.src}
              alt={pick(item.alt, locale)}
              tone={item.tone}
              glass={item.glass}
              compact={i !== 4}
              className="h-full w-full"
              sizes={i === 4 ? "100vw" : "33vw"}
            />
          </motion.div>
        </li>
      ))}
    </ul>
  );

  const title = (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 id="gallery-title" className="font-display text-[clamp(2rem,4.6vw,4rem)] leading-tight text-foam">
        {t.gallery.heading}
      </h2>
      <PourButton
        href={contacts.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        icon={<InstagramIcon size={18} />}
      >
        {t.gallery.cta}
      </PourButton>
    </div>
  );

  if (reduced) {
    return (
      <section aria-labelledby="gallery-title" className="bg-ink py-24">
        <div className="container-x mb-12">{title}</div>
        <div className="container-x aspect-square max-h-[90svh] sm:aspect-video">{grid}</div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="gallery-title" className="relative h-[240vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ scale }} className="h-full w-full origin-center will-change-transform">
          {grid}
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgb(11_9_7/0.85),rgb(11_9_7/0.4))]"
          style={{ opacity: titleOpacity }}
        />
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          {title}
        </motion.div>
      </div>
    </section>
  );
}
