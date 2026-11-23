# Mário Barman — Website

Bilingual (PT-BR / EN) website for **Mário Barman**, an open bar and cocktail service for weddings, sweet fifteen parties and events in Rio de Janeiro and São Paulo states.

The site tells its story through scroll: a preloader that pours a drink, a hero slider with a circular color reveal, phrases travelling along an arc, a glass that fills as you scroll, a horizontal drinks showcase, a rotating text ring, a word-by-word statement reveal and a gallery that zooms out into a grid.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide Icons

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /pt-BR or /en
npm run build        # production build (Vercel / Node)
npm run start
npm run build:static # fully static site in /out (Hostinger, Netlify, GitHub Pages…)
```

Copy `.env.example` to `.env.local` and set the site URL.

---

## Where to edit content

| What | File |
| --- | --- |
| **All copy** (PT-BR / EN) | `locales/pt-BR.ts` and `locales/en.ts` |
| Name, founding year, service regions, **logo** | `data/site.ts` |
| WhatsApp, Instagram, email, phone, other socials | `data/contacts.ts` |
| **Drinks** (name, photo, description, ingredients, category) | `data/drinks.ts` |
| **Testimonials** | `data/testimonials.ts` |
| Services (also used as quote form options) | `data/services.ts` |
| Event gallery photos | `data/gallery.ts` |
| Hero: background photo/video, slider, decorations | `data/hero.ts` |
| Founder portrait (About section) | `PORTRAIT_SRC` in `components/sections/About.tsx` |
| Colors, fonts, easing curves | `app/globals.css` (`@theme` block) |

### Official logo
Save the file in `public/logos/` (SVG or transparent PNG) and set `site.logo.src` in `data/site.ts`. The header, menu and footer switch to it automatically. Until then, a typographic placeholder based on the brand reference (`public/logos/referencia-logo-banner.png`) is used.

### Photos
- **Drinks:** transparent PNGs in `public/images/drinks/` → set `image` on the drink. Without a photo, the site draws the glass as a vector illustration from `visual`.
- **Events / team / testimonials:** `public/images/events/`, `team/`, `testimonials/` → set `src` / `photo` in the `data/` files.
- Until a photo is set, a placeholder frame with its caption and "Photo coming soon" is shown.

### Placeholder content
Demo drinks and testimonials are flagged with `placeholder: true` (they show a "Sample" badge). Remove the flag when adding real content. None of the testimonials are real.

---

## Quote form

By default the form validates every field and **opens WhatsApp with a ready-to-send message** (name, contact, event type, date, venue, guests, services and notes). Drinks added through "Add to my quote" are included in the message.

To send requests to a backend or form service (Formspree, Make, your own API), set in `.env.local`:

```
NEXT_PUBLIC_QUOTE_PROVIDER=api
NEXT_PUBLIC_QUOTE_ENDPOINT=https://your-endpoint
```

Data is sent as JSON via `POST` (see `lib/quote/quote.ts`). Fields and validation rules live in `lib/quote/config.ts` and `validateQuote`.

---

## Internationalization

- Routes: `/pt-BR` and `/en`, statically generated. `/` redirects based on the visitor's previous choice or browser language.
- The PT / EN switcher changes language while keeping the scroll position.
- To add a language: register it in `lib/i18n/config.ts`, create `locales/<code>.ts` with the same structure and add it to `lib/i18n/dictionaries.ts`. Files in `data/` use the `{ "pt-BR": "...", en: "..." }` format.

---

## Project structure

```
app/
  [locale]/layout.tsx   fonts, SEO metadata, providers
  [locale]/page.tsx     page composition + JSON-LD
  (root)/page.tsx       redirects "/" to a language
  icon.svg, fonts/
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
scripts/     generate-seo.mjs (robots.txt + sitemap.xml), build-static.mjs
public/      images/, logos/
```

## Accessibility and performance

- With "reduce motion" enabled, the preloader is skipped and scroll-pinned scenes become static layouts.
- Keyboard navigation with visible focus, a skip-to-content link, a focus-trapped menu that closes with `Esc`, and a native `<dialog>` for drink details.
- Animations only touch `transform` / `opacity` through motion values (no re-render per frame).
- Self-hosted fonts (Cinzel + Jost, OFL licenses in `app/fonts/`), no external requests.
- Responsible drinking notice in the footer ("Please drink responsibly / no alcohol sales under 18").

## Credits

- Tab icon: cocktail icon by barurezeki from [the Noun Project](https://thenounproject.com) (CC BY 3.0).
- Fonts: [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Jost](https://fonts.google.com/specimen/Jost), SIL Open Font License.
