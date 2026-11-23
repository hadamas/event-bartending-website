"use client";

import { useEffect, useId, useMemo } from "react";
import {
  animate,
  isMotionValue,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { DrinkVisual, GlassType } from "@/data/drinks";
import { easePour } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Ilustração vetorial de copos — usada como placeholder elegante enquanto
 * não houver fotos reais dos drinks. Todos os copos compartilham o mesmo
 * sistema de coordenadas (viewBox 0 0 200 300).
 */

type Ellipse = { cx: number; cy: number; rx: number; ry: number };

type GlassDef = {
  /** recorte do viewBox para o copo ocupar a altura disponível */
  box: string;
  outline: string[];
  rim: Ellipse;
  foot?: Ellipse;
  interior: string;
  /** y do fundo do líquido */
  bottom: number;
  /** y do líquido cheio */
  top: number;
  /** ponto de apoio da guarnição (borda direita) */
  anchor: [number, number];
  shine: string;
  ice: Array<[number, number, number, number]>;
};

const GLASSES: Record<GlassType, GlassDef> = {
  rocks: {
    box: "10 96 180 186",
    outline: [
      "M44 150 L51 266 Q52 276 62 276 L138 276 Q148 276 149 266 L156 150",
      "M54 252 Q100 262 146 252",
    ],
    rim: { cx: 100, cy: 150, rx: 56, ry: 8 },
    interior: "M46 151 L52 252 Q100 261 148 252 L154 151 Z",
    bottom: 258,
    top: 160,
    anchor: [154, 150],
    shine: "M57 168 L61 238",
    ice: [
      [62, 166, 32, -12],
      [100, 170, 34, 9],
      [80, 202, 30, 22],
    ],
  },
  martini: {
    box: "10 48 180 228",
    outline: ["M38 92 L96 180 Q100 186 104 180 L162 92", "M100 184 L100 262"],
    rim: { cx: 100, cy: 92, rx: 62, ry: 7 },
    foot: { cx: 100, cy: 266, rx: 38, ry: 6 },
    interior: "M41 93 L100 181 L159 93 Z",
    bottom: 181,
    top: 99,
    anchor: [160, 92],
    shine: "M54 104 L86 152",
    ice: [],
  },
  coupe: {
    box: "10 64 180 212",
    outline: [
      "M34 110 C36 150 70 172 100 172 C130 172 164 150 166 110",
      "M100 172 L100 262",
    ],
    rim: { cx: 100, cy: 110, rx: 66, ry: 7 },
    foot: { cx: 100, cy: 266, rx: 40, ry: 6 },
    interior: "M37 111 C39 148 71 169 100 169 C129 169 161 148 163 111 Z",
    bottom: 170,
    top: 116,
    anchor: [162, 110],
    shine: "M48 124 C54 142 66 154 80 160",
    ice: [],
  },
  highball: {
    box: "10 34 180 246",
    outline: [
      "M60 70 L64 268 Q65 276 74 276 L126 276 Q135 276 136 268 L140 70",
      "M66 256 Q100 263 134 256",
    ],
    rim: { cx: 100, cy: 70, rx: 40, ry: 6 },
    interior: "M62 71 L66 256 Q100 262 134 256 L138 71 Z",
    bottom: 260,
    top: 82,
    anchor: [138, 70],
    shine: "M70 92 L73 236",
    ice: [
      [76, 90, 26, -8],
      [100, 112, 27, 12],
      [78, 140, 25, 18],
      [102, 168, 26, -10],
    ],
  },
  balloon: {
    box: "10 0 180 280",
    outline: [
      "M56 62 C30 100 24 150 44 180 C58 200 80 208 100 208 C120 208 142 200 156 180 C176 150 170 100 144 62",
      "M100 208 L100 264",
    ],
    rim: { cx: 100, cy: 62, rx: 44, ry: 6 },
    foot: { cx: 100, cy: 268, rx: 42, ry: 6 },
    interior:
      "M58 63 C33 100 27 150 46 178 C60 197 81 205 100 205 C119 205 140 197 154 178 C173 150 167 100 142 63 Z",
    bottom: 206,
    top: 72,
    anchor: [144, 62],
    shine: "M46 120 C42 146 48 166 60 180",
    ice: [
      [58, 88, 30, -14],
      [96, 82, 32, 10],
      [74, 118, 30, 24],
      [112, 116, 28, -6],
    ],
  },
  flute: {
    box: "10 28 180 248",
    outline: [
      "M78 40 C76 110 84 170 97 195 Q100 200 103 195 C116 170 124 110 122 40",
      "M100 199 L100 264",
    ],
    rim: { cx: 100, cy: 40, rx: 22, ry: 4 },
    foot: { cx: 100, cy: 268, rx: 32, ry: 5 },
    interior: "M80 41 C78 110 86 168 100 194 C114 168 122 110 120 41 Z",
    bottom: 195,
    top: 52,
    anchor: [122, 40],
    shine: "M85 60 C84 110 88 146 94 168",
    ice: [],
  },
};

const BUBBLES: Array<[number, number, number]> = [
  [72, 0.18, 1.6],
  [118, 0.3, 1.2],
  [96, 0.45, 1.9],
  [84, 0.62, 1.3],
  [110, 0.72, 1.7],
  [100, 0.86, 1.1],
  [126, 0.55, 1.4],
  [64, 0.4, 1.2],
];

export interface GlassIllustrationProps {
  visual: DrinkVisual;
  /** Nível do líquido (0–1). Aceita um MotionValue para animações ligadas ao scroll. */
  fill?: number | MotionValue<number>;
  /** Anima o "servir" (líquido subindo) ao montar ou quando `pourKey` muda. */
  pour?: boolean;
  pourKey?: string | number;
  pourDelay?: number;
  /** Desenha o contorno do copo ao montar. */
  draw?: boolean;
  /** Mostra guarnição e gelo. */
  details?: boolean;
  strokeWidth?: number;
  className?: string;
  /** Texto alternativo. Sem ele, a ilustração é tratada como decorativa. */
  title?: string;
}

export function GlassIllustration({
  visual,
  fill,
  pour = false,
  pourKey,
  pourDelay = 0,
  draw = false,
  details = true,
  strokeWidth = 1.5,
  className,
  title,
}: GlassIllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const glass = GLASSES[visual.glass];
  const target = typeof fill === "number" ? fill : (visual.fill ?? 0.7);

  const localLevel = useMotionValue(pour ? 0 : target);
  const level = isMotionValue(fill) ? (fill as MotionValue<number>) : localLevel;

  useEffect(() => {
    if (isMotionValue(fill)) return;
    if (!pour) {
      localLevel.set(target);
      return;
    }
    localLevel.set(0);
    const controls = animate(localLevel, target, {
      duration: 1.5,
      delay: pourDelay,
      ease: easePour,
    });
    return () => controls.stop();
  }, [fill, pour, pourKey, pourDelay, target, localLevel]);

  const span = glass.bottom - glass.top;
  const liquidY = useTransform(level, (f) => (1 - Math.min(Math.max(f, 0), 1)) * span);

  const crushed = useMemo(() => {
    if (visual.ice !== "crushed") return [];
    const pieces: Array<[number, number, number, number]> = [];
    for (let i = 0; i < 26; i++) {
      const x = 56 + ((i * 37) % 88);
      const y = glass.top + 4 + ((i * 23) % 70);
      pieces.push([x, y, 9 + (i % 4) * 2, (i * 47) % 90]);
    }
    return pieces;
  }, [visual.ice, glass.top]);

  const pathTransition = { duration: 1.6, ease: easePour };
  const drawProps = draw
    ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: pathTransition }
    : {};

  const [ax, ay] = glass.anchor;
  const rind = visual.garnish === "lime-wheel" ? "#6f9a2e" : "#d9731f";
  const pulp = visual.garnish === "lime-wheel" ? "#d6e88f" : "#f6bf6a";

  return (
    <svg
      viewBox={glass.box}
      preserveAspectRatio="xMidYMax meet"
      className={cn("max-w-full", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      overflow="visible"
      fill="none"
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d={glass.interior} />
        </clipPath>
        <linearGradient id={`liq-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={visual.liquidLight} />
          <stop offset="1" stopColor={visual.liquid} />
        </linearGradient>
      </defs>

      {/* Líquido */}
      <g clipPath={`url(#clip-${uid})`}>
        <motion.g style={{ y: liquidY }}>
          <rect x="0" y={glass.top - 2} width="200" height={span + 40} fill={`url(#liq-${uid})`} />
          <ellipse cx="100" cy={glass.top} rx="92" ry="5" fill="#fff" opacity="0.22" />
          {visual.foam && (
            <>
              <rect x="0" y={glass.top - 2} width="200" height="11" fill={visual.foam} />
              <ellipse cx="100" cy={glass.top} rx="92" ry="4" fill="#fff" opacity="0.25" />
            </>
          )}
          {details && visual.bubbles &&
            BUBBLES.map(([x, t, r], i) => (
              <circle key={i} cx={x} cy={glass.top + 8 + t * (span - 16)} r={r} fill="#fff" opacity="0.45" />
            ))}
          {details && visual.ice === "cubes" &&
            glass.ice.map(([x, y, s, rot], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={s}
                height={s}
                rx="5"
                transform={`rotate(${rot} ${x + s / 2} ${y + s / 2})`}
                fill="#fff"
                fillOpacity="0.13"
                stroke="#fff"
                strokeOpacity="0.5"
                strokeWidth="0.9"
              />
            ))}
          {details && visual.ice === "sphere" && (
            <>
              <circle cx="100" cy={glass.top + 34} r="32" fill="#fff" fillOpacity="0.12" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.9" />
              <path d={`M84 ${glass.top + 18} q8 -8 20 -6`} stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
          {details &&
            crushed.map(([x, y, s, rot], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={s}
                height={s * 0.8}
                rx="2"
                transform={`rotate(${rot} ${x + s / 2} ${y + s / 2})`}
                fill="#fff"
                fillOpacity="0.16"
                stroke="#fff"
                strokeOpacity="0.4"
                strokeWidth="0.6"
              />
            ))}
          {details && visual.garnish === "coffee-beans" &&
            [88, 100, 112].map((x, i) => (
              <g key={x} transform={`rotate(${(i - 1) * 18} ${x} ${glass.top - 1})`}>
                <ellipse cx={x} cy={glass.top - 1} rx="5" ry="3.4" fill="#2a170c" />
                <path d={`M${x - 3.6} ${glass.top - 1} H${x + 3.6}`} stroke="#6b4a33" strokeWidth="0.8" />
              </g>
            ))}
        </motion.g>
      </g>

      {/* Guarnições que ficam dentro do copo */}
      {details && visual.garnish === "herb" && (
        <g>
          <path d={`M112 ${glass.bottom - 26} C118 ${glass.top + 10} ${ax + 2} ${ay - 10} ${ax + 10} ${ay - 60}`} stroke="#58744a" strokeWidth="1.6" strokeLinecap="round" />
          {Array.from({ length: 11 }).map((_, i) => {
            const t = 0.35 + i * 0.06;
            const x = 112 + (ax + 10 - 112) * t;
            const y = glass.bottom - 26 + (ay - 60 - (glass.bottom - 26)) * t;
            const side = i % 2 === 0 ? 1 : -1;
            return (
              <path key={i} d={`M${x} ${y} l${7 * side} ${-6}`} stroke="#7fa36a" strokeWidth="2" strokeLinecap="round" />
            );
          })}
        </g>
      )}
      {details && visual.garnish === "berries" && (
        <g>
          <path d={`M${ax - 30} ${ay - 34} L104 ${glass.bottom - 10}`} stroke="#c2a063" strokeWidth="1.4" strokeLinecap="round" />
          {[
            [ax - 30, ay - 34],
            [ax - 40, ay - 26],
            [ax - 24, ay - 22],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill="#8e1838" />
              <circle cx={x - 2.2} cy={y - 2.4} r="1.8" fill="#fff" opacity="0.5" />
            </g>
          ))}
        </g>
      )}

      {/* Copo */}
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        {glass.outline.map((d) => (
          <motion.path key={d} d={d} vectorEffect="non-scaling-stroke" {...drawProps} />
        ))}
        <motion.ellipse {...glass.rim} vectorEffect="non-scaling-stroke" {...drawProps} />
        {glass.foot && <motion.ellipse {...glass.foot} vectorEffect="non-scaling-stroke" {...drawProps} />}
      </g>
      <path d={glass.shine} stroke="#fff" strokeOpacity="0.35" strokeWidth={strokeWidth * 1.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />

      {/* Guarnições na borda */}
      {details && visual.garnish === "orange-peel" && (
        <g strokeLinecap="round" fill="none">
          <path d={`M${ax - 26} ${ay + 8} C${ax - 18} ${ay - 26} ${ax + 8} ${ay - 38} ${ax + 16} ${ay - 14} C${ax + 22} ${ay + 4} ${ax + 18} ${ay + 22} ${ax + 34} ${ay + 34}`} stroke="#d9731f" strokeWidth="7" />
          <path d={`M${ax - 24} ${ay + 4} C${ax - 16} ${ay - 24} ${ax + 6} ${ay - 34} ${ax + 13} ${ay - 14}`} stroke="#f6b26b" strokeWidth="2" opacity="0.85" />
        </g>
      )}
      {details && (visual.garnish === "orange-wheel" || visual.garnish === "lime-wheel") && (
        <g transform={`translate(${ax - 10} ${ay - 12}) rotate(-14)`}>
          <circle r="19" fill={rind} />
          <circle r="16" fill={pulp} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line key={i} x1="0" y1="0" x2={Math.cos(a) * 14} y2={Math.sin(a) * 14} stroke="#fff" strokeOpacity="0.7" strokeWidth="1" />
            );
          })}
          <circle r="2.2" fill="#fff" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

export const glassTypes = Object.keys(GLASSES) as GlassType[];
