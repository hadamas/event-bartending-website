import type { Localized } from "@/lib/i18n/localize";

/**
 * DRINKS — DADOS DE DEMONSTRAÇÃO
 * --------------------------------------------------------------
 * Esta lista é ilustrativa (placeholder) e NÃO é o cardápio oficial.
 * Para adicionar um drink, copie um bloco, troque o `id` e preencha os campos.
 * Quando houver foto real (PNG com fundo transparente fica ótimo), salve em
 * /public/images/drinks e preencha `image`. Sem foto, o site desenha o copo
 * a partir de `visual`.
 */

export type GlassType = "rocks" | "martini" | "coupe" | "highball" | "balloon" | "flute";
export type Garnish =
  | "orange-peel"
  | "orange-wheel"
  | "lime-wheel"
  | "berries"
  | "coffee-beans"
  | "herb"
  | "none";

export type DrinkCategory = "classic" | "signature" | "brazilian" | "zero" | "sparkling";

export interface DrinkVisual {
  glass: GlassType;
  /** Cor do líquido (fundo do copo). */
  liquid: string;
  /** Cor do líquido (superfície, mais clara). */
  liquidLight: string;
  garnish: Garnish;
  ice?: "cubes" | "crushed" | "sphere";
  foam?: string;
  bubbles?: boolean;
  /** Nível do líquido entre 0 e 1. */
  fill?: number;
}

export interface Drink {
  id: string;
  name: Localized;
  category: DrinkCategory;
  description: Localized;
  ingredients?: Localized<string[]>;
  /** Informações adicionais opcionais (ex.: "servido com gelo esférico"). */
  notes?: Localized;
  image?: { src: string; alt: Localized } | null;
  visual: DrinkVisual;
  /** Cor de destaque usada em textos e brilhos (legível sobre fundo escuro). */
  accent: string;
  /** Aparece no slider do topo da página. */
  featured?: boolean;
  /** Marca o item como demonstração. Remova quando o drink for real. */
  placeholder?: boolean;
}

export const drinks: Drink[] = [
  {
    id: "old-fashioned",
    name: { "pt-BR": "Old Fashioned", en: "Old Fashioned" },
    category: "classic",
    description: {
      "pt-BR": "Texto de exemplo: um clássico encorpado, mexido lentamente e servido sobre gelo.",
      en: "Sample text: a rich classic, slowly stirred and served over ice.",
    },
    ingredients: {
      "pt-BR": ["Bourbon", "Açúcar", "Angostura", "Casca de laranja"],
      en: ["Bourbon", "Sugar", "Angostura bitters", "Orange peel"],
    },
    notes: {
      "pt-BR": "Informação adicional de exemplo.",
      en: "Sample additional information.",
    },
    visual: {
      glass: "rocks",
      liquid: "#7a3a0e",
      liquidLight: "#d98b3a",
      garnish: "orange-peel",
      ice: "cubes",
      fill: 0.62,
    },
    accent: "#e2a15a",
    featured: true,
    placeholder: true,
  },
  {
    id: "negroni",
    name: { "pt-BR": "Negroni", en: "Negroni" },
    category: "classic",
    description: {
      "pt-BR": "Texto de exemplo: amargo na medida, equilibrado e de cor intensa.",
      en: "Sample text: pleasantly bitter, balanced and deeply colored.",
    },
    ingredients: {
      "pt-BR": ["Gin", "Campari", "Vermute rosso", "Laranja"],
      en: ["Gin", "Campari", "Sweet vermouth", "Orange"],
    },
    visual: {
      glass: "rocks",
      liquid: "#6e0f14",
      liquidLight: "#d1402f",
      garnish: "orange-wheel",
      ice: "sphere",
      fill: 0.58,
    },
    accent: "#e0644f",
    featured: true,
    placeholder: true,
  },
  {
    id: "gin-tonica",
    name: { "pt-BR": "Gin Tônica", en: "Gin & Tonic" },
    category: "signature",
    description: {
      "pt-BR": "Texto de exemplo: refrescante, aromático e montado na taça com botânicos.",
      en: "Sample text: refreshing and aromatic, built in a balloon glass with botanicals.",
    },
    ingredients: {
      "pt-BR": ["Gin", "Água tônica", "Limão-siciliano", "Alecrim"],
      en: ["Gin", "Tonic water", "Lemon", "Rosemary"],
    },
    visual: {
      glass: "balloon",
      liquid: "#5f7f63",
      liquidLight: "#cfe3c9",
      garnish: "herb",
      ice: "cubes",
      bubbles: true,
      fill: 0.6,
    },
    accent: "#a9cda3",
    featured: true,
    placeholder: true,
  },
  {
    id: "espresso-martini",
    name: { "pt-BR": "Espresso Martini", en: "Espresso Martini" },
    category: "classic",
    description: {
      "pt-BR": "Texto de exemplo: café, vodka e uma espuma cremosa para fechar a noite.",
      en: "Sample text: coffee, vodka and a creamy foam to close the night.",
    },
    ingredients: {
      "pt-BR": ["Vodka", "Café espresso", "Licor de café", "Grãos de café"],
      en: ["Vodka", "Espresso", "Coffee liqueur", "Coffee beans"],
    },
    visual: {
      glass: "martini",
      liquid: "#1f120b",
      liquidLight: "#4a2d1b",
      garnish: "coffee-beans",
      foam: "#c9a27e",
      fill: 0.9,
    },
    accent: "#d2a77c",
    featured: true,
    placeholder: true,
  },
  {
    id: "caipirinha",
    name: { "pt-BR": "Caipirinha", en: "Caipirinha" },
    category: "brazilian",
    description: {
      "pt-BR": "Texto de exemplo: o clássico brasileiro, com limão fresco e gelo picado.",
      en: "Sample text: Brazil's classic, with fresh lime and crushed ice.",
    },
    ingredients: {
      "pt-BR": ["Cachaça", "Limão", "Açúcar", "Gelo picado"],
      en: ["Cachaça", "Lime", "Sugar", "Crushed ice"],
    },
    visual: {
      glass: "rocks",
      liquid: "#8a9a3c",
      liquidLight: "#e2ecae",
      garnish: "lime-wheel",
      ice: "crushed",
      fill: 0.78,
    },
    accent: "#c9db7a",
    placeholder: true,
  },
  {
    id: "aperol-spritz",
    name: { "pt-BR": "Aperol Spritz", en: "Aperol Spritz" },
    category: "sparkling",
    description: {
      "pt-BR": "Texto de exemplo: leve, borbulhante e perfeito para eventos ao ar livre.",
      en: "Sample text: light and sparkling, perfect for outdoor events.",
    },
    ingredients: {
      "pt-BR": ["Aperol", "Espumante", "Água com gás", "Laranja"],
      en: ["Aperol", "Prosecco", "Soda water", "Orange"],
    },
    visual: {
      glass: "balloon",
      liquid: "#b8410f",
      liquidLight: "#f39a4b",
      garnish: "orange-wheel",
      ice: "cubes",
      bubbles: true,
      fill: 0.62,
    },
    accent: "#f0965a",
    placeholder: true,
  },
  {
    id: "moscow-mule",
    name: { "pt-BR": "Moscow Mule", en: "Moscow Mule" },
    category: "classic",
    description: {
      "pt-BR": "Texto de exemplo: vodka, gengibre e limão, servido bem gelado.",
      en: "Sample text: vodka, ginger and lime, served ice-cold.",
    },
    ingredients: {
      "pt-BR": ["Vodka", "Xarope de gengibre", "Limão", "Água com gás"],
      en: ["Vodka", "Ginger syrup", "Lime", "Soda water"],
    },
    visual: {
      glass: "highball",
      liquid: "#a8742a",
      liquidLight: "#efd08f",
      garnish: "lime-wheel",
      ice: "cubes",
      bubbles: true,
      fill: 0.8,
    },
    accent: "#e9c27a",
    placeholder: true,
  },
  {
    id: "frutas-vermelhas-zero",
    name: { "pt-BR": "Frutas Vermelhas Zero", en: "Red Berry Zero" },
    category: "zero",
    description: {
      "pt-BR": "Texto de exemplo: opção sem álcool, colorida e cheia de sabor — ótima para 15 anos.",
      en: "Sample text: an alcohol-free option, vibrant and full of flavor — great for quinceañeras.",
    },
    ingredients: {
      "pt-BR": ["Frutas vermelhas", "Limão", "Xarope de hibisco", "Água com gás"],
      en: ["Red berries", "Lime", "Hibiscus syrup", "Soda water"],
    },
    visual: {
      glass: "coupe",
      liquid: "#7d1235",
      liquidLight: "#e0507a",
      garnish: "berries",
      fill: 0.85,
    },
    accent: "#ee7f9f",
    placeholder: true,
  },
  {
    id: "espumante",
    name: { "pt-BR": "Brinde de Espumante", en: "Sparkling Toast" },
    category: "sparkling",
    description: {
      "pt-BR": "Texto de exemplo: o brinde dos noivos, servido bem gelado na taça flute.",
      en: "Sample text: the couple's toast, served well chilled in a flute.",
    },
    ingredients: {
      "pt-BR": ["Espumante brut"],
      en: ["Brut sparkling wine"],
    },
    visual: {
      glass: "flute",
      liquid: "#b8913f",
      liquidLight: "#f2dc9b",
      garnish: "none",
      bubbles: true,
      fill: 0.82,
    },
    accent: "#ecd08c",
    placeholder: true,
  },
];

export const featuredDrinks = drinks.filter((d) => d.featured);

export function getDrink(id: string) {
  return drinks.find((d) => d.id === id);
}
