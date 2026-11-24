import type { Localized } from "@/lib/i18n/localize";
import type { GlassType } from "./drinks";

/**
 * GALERIA DE EVENTOS — fotos de eventos e da equipe.
 * Fotos salvas em /public/images/events (o caminho em `src` começa em /images).
 * Sem `src`, o site mostra uma moldura provisória com a legenda.
 * A galeria usa exatamente 9 itens (grade 3×3); o 5º é o destaque central.
 */
export interface GalleryItem {
  id: string;
  src?: string;
  alt: Localized;
  /** Tom da moldura provisória (usado só quando não há `src`). */
  tone: string;
  glass: GlassType;
}

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    src: "/images/events/wedding-couple.jpg",
    alt: { "pt-BR": "Noivos durante a festa de casamento", en: "The couple at their wedding party" },
    tone: "#3a2312",
    glass: "flute",
  },
  {
    id: "g2",
    src: "/images/events/drinks-prepare.jpg",
    alt: { "pt-BR": "Bartenders preparando coquetéis", en: "Bartenders preparing cocktails" },
    tone: "#2b1d16",
    glass: "martini",
  },
  {
    id: "g3",
    src: "/images/events/toasting.jpg",
    alt: { "pt-BR": "Convidadas brindando com drinks", en: "Guests toasting with drinks" },
    tone: "#331717",
    glass: "coupe",
  },
  {
    id: "g4",
    src: "/images/events/team.jpg",
    alt: { "pt-BR": "Equipe de bartenders no balcão", en: "Bartending team at the counter" },
    tone: "#1f2219",
    glass: "highball",
  },
  {
    id: "g5",
    src: "/images/events/mario-principal-middle.jpg",
    alt: { "pt-BR": "Mário segurando um drink", en: "Mário holding a drink" },
    tone: "#3b2410",
    glass: "rocks",
  },
  {
    id: "g6",
    src: "/images/events/bar-details.jpg",
    alt: { "pt-BR": "Detalhes da decoração do bar", en: "Bar decoration details" },
    tone: "#2a2016",
    glass: "balloon",
  },
  {
    id: "g7",
    src: "/images/events/custom-drink.jpg",
    alt: { "pt-BR": "Drinks personalizados com imagem na espuma", en: "Custom drinks with a printed foam design" },
    tone: "#35172a",
    glass: "coupe",
  },
  {
    id: "g8",
    src: "/images/events/events.jpg",
    alt: { "pt-BR": "Bar rústico decorado com flores para evento", en: "Rustic bar decorated with flowers for an event" },
    tone: "#1c1f24",
    glass: "rocks",
  },
  {
    id: "g9",
    src: "/images/events/drinks-sea.jpg",
    alt: { "pt-BR": "Bar montado à beira-mar", en: "Bar set up by the sea" },
    tone: "#13262a",
    glass: "balloon",
  },
];
