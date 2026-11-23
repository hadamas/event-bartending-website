"use client";

import { useId, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { scrollToSection, usePrefersReducedMotion } from "@/lib/hooks";
import type { GlassType } from "@/data/drinks";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PourButton } from "@/components/ui/PourButton";

/**
 * Manifesto: frases que deslizam por um arco enquanto a página rola,
 * com fotos flutuando em velocidades diferentes (profundidade).
 */

const PHOTOS: Array<{
  className: string;
  from: number;
  to: number;
  tone: string;
  glass: GlassType;
  /** índice da legenda em locales → manifesto.photos */
  label: number;
  src?: string;
}> = [
  { className: "left-[5%] top-[9%] w-[30vw] aspect-[4/5] sm:w-[22vw] lg:w-[14vw]", from: 10, to: -55, tone: "#3a2312", glass: "rocks", label: 0 },
  { className: "right-[6%] top-[4%] hidden aspect-square sm:block sm:w-[18vw] lg:w-[12vw]", from: 30, to: -95, tone: "#2b1d16", glass: "martini", label: 1 },
  { className: "right-[3%] top-[58%] hidden aspect-[4/5] sm:block sm:w-[24vw] lg:w-[15vw]", from: 40, to: -70, tone: "#331717", glass: "coupe", label: 2 },
  { className: "left-[8%] top-[70%] hidden aspect-[5/4] sm:block sm:w-[22vw] lg:w-[14vw]", from: 55, to: -85, tone: "#1f2219", glass: "highball", label: 3 },
  { className: "left-[56%] top-[86%] hidden aspect-[4/5] lg:block lg:w-[11vw]", from: 60, to: -120, tone: "#2a2016", glass: "balloon", label: 4 },
  // somente no celular: sobe pela lateral sem cruzar o texto
  { className: "right-[6%] top-[56%] w-[24vw] aspect-[4/5] sm:hidden", from: 8, to: -4, tone: "#331717", glass: "coupe", label: 2 },
];

export function Manifesto() {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const phrases = t.manifesto.phrases;

  const cta = (
    <PourButton
      href="#about"
      variant="outline-dark"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection("about");
      }}
    >
      {t.manifesto.cta}
    </PourButton>
  );

  if (reduced) {
    return (
      <section aria-labelledby="manifesto-title" className="bg-champagne py-28 text-center text-ink">
        <div className="container-x flex flex-col items-center gap-10">
          <p className="text-[0.95rem] text-brass-deep">{t.manifesto.kicker}</p>
          <h2 id="manifesto-title" className="flex flex-col gap-8 font-display text-[clamp(1.8rem,4vw,3.4rem)] leading-tight">
            {phrases.map(([a, b]) => (
              <span key={a} className="block">
                {a} <span className="text-brass-deep">{b}</span>
              </span>
            ))}
          </h2>
          {cta}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="manifesto-title" className="relative h-[320vh] bg-champagne text-ink">
      <h2 id="manifesto-title" className="sr-only">
        {phrases.map((p) => p.join(" ")).join(". ")}.
      </h2>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <p className="absolute inset-x-0 top-[13svh] z-20 text-center text-[0.95rem] text-brass-deep">
          {t.manifesto.kicker}
        </p>

        {PHOTOS.map((photo, i) => (
          <FloatingPhoto
            key={i}
            progress={scrollYProgress}
            {...photo}
            alt={t.manifesto.photos[photo.label] ?? t.manifesto.photos[0]}
          />
        ))}

        {phrases.map((lines, i) => (
          <ArcPhrase key={i} lines={lines} index={i} count={phrases.length} progress={scrollYProgress} />
        ))}

        <div className="absolute inset-x-0 bottom-[8svh] z-20 flex justify-center">{cta}</div>
      </div>
    </section>
  );
}

function FloatingPhoto({
  progress,
  className,
  from,
  to,
  tone,
  glass,
  src,
  alt,
}: Omit<(typeof PHOTOS)[number], "label"> & { progress: MotionValue<number>; alt: string }) {
  const y = useTransform(progress, [0, 1], [`${from}vh`, `${to}vh`]);
  return (
    <motion.div style={{ y }} className={`absolute z-0 ${className}`}>
      <MediaPlaceholder
        src={src}
        alt={alt}
        tone={tone}
        glass={glass}
        compact
        className="h-full w-full rounded-[4px] shadow-[0_30px_60px_-30px_rgb(11_9_7/0.6)]"
        sizes="(min-width: 1024px) 15vw, 30vw"
      />
    </motion.div>
  );
}

function ArcPhrase({
  lines,
  index,
  count,
  progress,
}: {
  lines: string[];
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const uid = useId().replace(/:/g, "");
  const seg = 1 / count;
  const start = index * seg;
  const end = start + seg;
  const first = index === 0;
  const last = index === count - 1;

  const input: number[] = [];
  const output: number[] = [];
  if (first) {
    input.push(0);
    output.push(0);
  } else {
    input.push(start - 0.02, start + 0.16);
    output.push(78, 0);
  }
  if (last) {
    input.push(1);
    output.push(0);
  } else {
    input.push(end - 0.16, end + 0.02);
    output.push(0, -78);
  }
  const rotate = useTransform(progress, input, output);

  return (
    <motion.div
      aria-hidden
      style={{ rotate }}
      className="absolute left-[calc(50%-var(--w)/2)] top-[calc(47svh-var(--w)*0.045)] z-10 aspect-square w-[var(--w)] [--w:300vw] sm:[--w:210vw] lg:[--w:150vw]"
    >
      <svg viewBox="0 0 1000 1000" className="h-full w-full overflow-visible">
        <defs>
          <path id={`arc-a-${uid}`} d="M 30 500 A 470 470 0 0 1 970 500 A 470 470 0 0 1 30 500" />
          <path id={`arc-b-${uid}`} d="M 80 500 A 420 420 0 0 1 920 500 A 420 420 0 0 1 80 500" />
        </defs>
        <text className="fill-ink font-display text-[21px] font-semibold tracking-[0.02em] sm:text-[26px] lg:text-[30px]">
          <textPath href={`#arc-a-${uid}`} startOffset="25%" textAnchor="middle">
            {lines[0]}
          </textPath>
        </text>
        <text className="fill-brass-deep font-display text-[21px] font-semibold tracking-[0.02em] sm:text-[26px] lg:text-[30px]">
          <textPath href={`#arc-b-${uid}`} startOffset="25%" textAnchor="middle">
            {lines[1]}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}
