"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Revela um título palavra por palavra, cada uma subindo de dentro de uma máscara.
 * Dispara uma única vez, quando o texto entra na tela.
 */
const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
};

const container: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const word: Variants = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: easeOutExpo } },
};

export function RevealText({
  lines,
  as = "h2",
  className,
  lineClassName,
  stagger = 0.06,
  amount = 0.5,
  delay = 0,
  id,
  animateOnMount = false,
  play = true,
}: {
  lines: string | string[];
  as?: keyof typeof tags;
  className?: string;
  lineClassName?: (index: number) => string | undefined;
  stagger?: number;
  amount?: number;
  delay?: number;
  id?: string;
  /** Anima ao montar (ex.: hero) em vez de esperar entrar na tela. */
  animateOnMount?: boolean;
  /** Com animateOnMount: só anima quando `play` for true. */
  play?: boolean;
}) {
  const list = Array.isArray(lines) ? lines : [lines];
  const Tag = tags[as];
  const trigger = animateOnMount
    ? { animate: play ? ("visible" as const) : ("hidden" as const) }
    : { whileInView: "visible" as const, viewport: { once: true, amount } };

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      {...trigger}
      custom={{ stagger, delay }}
      variants={container}
    >
      {list.map((line, li) => (
        <span key={li} className={cn("block", lineClassName?.(li))}>
          {line.split(" ").map((w, wi) => (
            <Fragment key={wi}>
              {wi > 0 && " "}
              <span className="-mt-[0.2em] inline-block overflow-hidden pb-[0.08em] pt-[0.2em] align-top">
                <motion.span className="inline-block" variants={word}>
                  {w}
                </motion.span>
              </span>
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
