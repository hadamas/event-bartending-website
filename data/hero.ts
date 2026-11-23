/**
 * Configuração do Hero (topo da página).
 * Os textos (headline, subheadline, botões) ficam em /locales → `hero`.
 *
 * - background.type "none": fundo escuro com brilho na cor do drink em destaque.
 * - background.type "image": usa `src` como foto de fundo.
 * - background.type "video": usa `src` (mp4/webm) e `poster` como vídeo de fundo.
 */
export const heroConfig = {
  background: {
    type: "none" as "none" | "image" | "video",
    src: "", // ex.: "/images/hero/bar-casamento.jpg" ou "/videos/hero.mp4"
    poster: "",
    /** Escurecimento sobre a mídia (0 a 1) para manter o texto legível. */
    overlay: 0.6,
  },
  /** Mostra o slider de drinks em destaque (drinks com `featured: true`). */
  showSlider: true,
  /** Tempo de cada drink no slider (ms). */
  autoplayMs: 7000,
  decorations: {
    particles: true,
    glow: true,
    grain: true,
  },
};
