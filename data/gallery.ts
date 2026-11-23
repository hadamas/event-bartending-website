import type { Localized } from "@/lib/i18n/localize";
import type { GlassType } from "./drinks";

/**
 * GALERIA DE EVENTOS — fotos de eventos e da equipe.
 * Salve as fotos em /public/images/events e preencha `src`.
 * Sem `src`, o site mostra uma moldura provisória com a legenda.
 * A galeria usa exatamente 9 itens (grade 3×3); o 5º é o destaque central.
 */
export interface GalleryItem {
  id: string;
  src?: string;
  alt: Localized;
  /** Tom da moldura provisória. */
  tone: string;
  glass: GlassType;
}

export const gallery: GalleryItem[] = [
  { id: "g1", alt: { "pt-BR": "Bar montado para casamento", en: "Bar set up for a wedding" }, tone: "#3a2312", glass: "flute" },
  { id: "g2", alt: { "pt-BR": "Preparo de coquetéis", en: "Cocktails being prepared" }, tone: "#2b1d16", glass: "martini" },
  { id: "g3", alt: { "pt-BR": "Brinde dos convidados", en: "Guests toasting" }, tone: "#331717", glass: "coupe" },
  { id: "g4", alt: { "pt-BR": "Equipe de bartenders", en: "Bartending team" }, tone: "#1f2219", glass: "highball" },
  { id: "g5", alt: { "pt-BR": "Mário servindo um drink", en: "Mário serving a drink" }, tone: "#3b2410", glass: "rocks" },
  { id: "g6", alt: { "pt-BR": "Detalhes da decoração do bar", en: "Bar decoration details" }, tone: "#2a2016", glass: "balloon" },
  { id: "g7", alt: { "pt-BR": "Festa de 15 anos", en: "Sweet fifteen party" }, tone: "#35172a", glass: "coupe" },
  { id: "g8", alt: { "pt-BR": "Eventos", en: "Events" }, tone: "#1c1f24", glass: "rocks" },
  { id: "g9", alt: { "pt-BR": "Drinks servidos à beira-mar", en: "Drinks served by the sea" }, tone: "#13262a", glass: "balloon" },
];
