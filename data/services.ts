import type { Localized } from "@/lib/i18n/localize";

/**
 * SERVIÇOS — textos provisórios, revise com o Mário.
 * `id` também é usado nas opções do formulário de orçamento.
 */
export interface Service {
  id: string;
  title: Localized;
  description: Localized;
}

export const services: Service[] = [
  {
    id: "open-bar",
    title: { "pt-BR": "Open bar completo", en: "Full open bar" },
    description: {
      "pt-BR": "Estrutura de bar e equipe dedicada servindo seus convidados do início ao fim da festa.",
      en: "Bar setup and a dedicated team serving your guests from the first toast to the last call.",
    },
  },
  {
    id: "cocktails",
    title: { "pt-BR": "Coquetelaria clássica e autoral", en: "Classic and signature cocktails" },
    description: {
      "pt-BR": "Carta de drinks pensada para o estilo do evento e para o gosto dos anfitriões.",
      en: "A drinks menu shaped around the style of the event and the hosts' taste.",
    },
  },
  {
    id: "zero",
    title: { "pt-BR": "Drinks sem álcool", en: "Alcohol-free drinks" },
    description: {
      "pt-BR": "Opções sem álcool preparadas com o mesmo cuidado — essenciais em festas de 15 anos.",
      en: "Alcohol-free options made with the same care — essential for sweet fifteen parties.",
    },
  },
  {
    id: "corporate",
    title: { "pt-BR": "Bar para empresas", en: "Corporate bar service" },
    description: {
      "pt-BR": "Atendimento para confraternizações, lançamentos e eventos corporativos.",
      en: "Service for company gatherings, launches and corporate events.",
    },
  },
];
