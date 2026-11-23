# Mário Barman — Website

Site institucional do **Mário Barman** (open bar e coquetelaria para eventos), inspirado em sites de storytelling com rolagem: preloader com um drink sendo servido, hero com slider de drinks, frases em arco, copo que enche com a rolagem, carrossel horizontal de drinks, texto girando em círculo, revelação de palavras e galeria que abre em grade.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide Icons

---

## Como rodar

```bash
npm install
npm run dev          # http://localhost:3000  → redireciona para /pt-BR ou /en
npm run build        # build de produção (Vercel / Node)
npm run start
npm run build:static # site 100% estático em /out (Hostinger, Netlify, GitHub Pages…)
```

Copie `.env.example` para `.env.local` e ajuste a URL do site.

---

## Onde editar cada coisa

| O quê | Arquivo |
| --- | --- |
| **Todos os textos** (PT-BR / EN) | `locales/pt-BR.ts` e `locales/en.ts` |
| Nome, ano de fundação, regiões, **logo** | `data/site.ts` |
| WhatsApp, Instagram, e-mail, telefone, outras redes | `data/contacts.ts` |
| **Drinks** (nome, foto, descrição, ingredientes, categoria) | `data/drinks.ts` |
| **Depoimentos** | `data/testimonials.ts` |
| Serviços (também viram opções do formulário) | `data/services.ts` |
| Fotos da galeria de eventos | `data/gallery.ts` |
| Hero: foto/vídeo de fundo, slider, decorações | `data/hero.ts` |
| Foto do Mário (seção Sobre) | `PORTRAIT_SRC` em `components/sections/About.tsx` |
| Cores, fontes, curvas de animação | `app/globals.css` (bloco `@theme`) |

### Logo oficial
Salve o arquivo em `public/logos/` (SVG ou PNG com fundo transparente) e preencha `site.logo.src` em `data/site.ts`. O header, o menu e o rodapé passam a usar o arquivo automaticamente. A imagem de referência enviada está em `public/logos/referencia-logo-banner.png`.

### Fotos
- **Drinks:** PNG com fundo transparente em `public/images/drinks/` → preencha `image` no drink. Sem foto, o site desenha o copo (ilustração vetorial) a partir de `visual`.
- **Eventos / equipe / depoimentos:** `public/images/events/`, `team/`, `testimonials/` → preencha `src`/`photo` nos arquivos de `data/`.
- Enquanto não houver foto, aparece uma moldura provisória com a legenda e "Foto em breve".

### Placeholders
Drinks e depoimentos estão marcados com `placeholder: true` (mostram o selo "Exemplo"). Ao inserir conteúdo real, remova essa linha. Nenhum depoimento é real.

---

## Formulário de orçamento

Padrão: ao enviar, o site valida os campos e **abre o WhatsApp do Mário com a mensagem pronta** (nome, contato, tipo de evento, data, local, convidados, serviços e mensagem). Drinks escolhidos em "Incluir no orçamento" entram na mensagem.

Para enviar para um backend/serviço (Formspree, Make, API própria), em `.env.local`:

```
NEXT_PUBLIC_QUOTE_PROVIDER=api
NEXT_PUBLIC_QUOTE_ENDPOINT=https://seu-endpoint
```

Os dados são enviados em JSON via `POST` (veja `lib/quote/quote.ts`). Campos e regras de validação: `lib/quote/config.ts` e `validateQuote`.

---

## Idiomas

- Rotas: `/pt-BR` e `/en` (geradas estaticamente). `/` redireciona conforme a escolha anterior do visitante ou o idioma do navegador.
- O seletor PT / EN troca o idioma mantendo a posição na página.
- Para um novo idioma: adicione em `lib/i18n/config.ts`, crie `locales/<código>.ts` com a mesma estrutura e registre em `lib/i18n/dictionaries.ts`. Os dados de `data/` usam o formato `{ "pt-BR": "...", en: "..." }`.

---

## Estrutura

```
app/
  [locale]/layout.tsx   fontes, metadados (SEO), provedores
  [locale]/page.tsx     composição da página + JSON-LD
  (root)/page.tsx       redireciona "/" para o idioma
  robots.ts, sitemap.ts, icon.svg, fonts/
components/
  layout/    Header, MenuOverlay, LanguageSwitcher, Preloader, Footer, FloatingWhatsApp
  sections/  Hero, Marquee, Manifesto, About, Testimonials, FirstSip,
             drinks/ (Drinks, DrinkDialog), Signature, Experience,
             quote/ (Quote, QuoteForm), Contact
  ui/        GlassIllustration, DrinkVisual, MediaPlaceholder, Logo,
             PourButton, RevealText, BrandIcons
lib/         i18n/, quote/, hooks, motion, whatsapp
locales/     pt-BR.ts, en.ts
data/        site, contacts, drinks, testimonials, services, gallery, hero
public/      images/, logos/
```

## Acessibilidade e desempenho

- Com "reduzir movimento" ativado no sistema, o preloader é pulado e as cenas presas à rolagem viram layouts estáticos.
- Navegação por teclado com foco visível, link "Pular para o conteúdo", menu com foco preso e `Esc`, diálogo nativo (`<dialog>`) para os drinks.
- Animações usam apenas `transform`/`opacity` ligados a motion values (sem re-render a cada frame).
- Fontes locais (Cinzel + Jost, licença OFL em `app/fonts/`), sem requisições externas.
- Uso de álcool: o rodapé traz o aviso "Aprecie com moderação / proibido para menores de 18 anos".
