# Codec informatika — website

Bilingual (Croatian primary, English) company website for **Codec informatika d.o.o.**, built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and Framer Motion.

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /hr (or /en by browser language)
npm run build && npm start
```

Copy `.env.example` to `.env.local` (locally) or add the same variables in Vercel → Project → Settings → Environment Variables. See [Contact form](#contact-form) below.

## Editing content — no component changes needed

All content lives in `/content`. Pages and components only render it.

| What | File |
| --- | --- |
| Services (cards, menus, service pages, contact form options, sitemap, JSON-LD) | `content/services.ts` |
| Reference clients and project case studies; client/country counts are computed from here | `content/projects.ts` |
| Team members (About page) and client testimonials (Home, References) — sections stay hidden while the lists are empty | `content/people.ts` |
| Company name, phones, emails, address, legal data (OIB, MBS, IBAN) | `content/site.ts` |
| Main and footer navigation (same structure as the original site: Početna · O nama · Usluge · Podrška · Reference · Kontakt) | `content/navigation.ts` |
| Localized URLs (`/hr/usluge` ↔ `/en/services`) | `content/routes.ts` |
| Redirects from the old codec-info.hr pages | `content/redirects.ts` |
| All page copy, headings, form labels, SEO titles | `content/dictionaries/hr.ts`, `content/dictionaries/en.ts` |

### Add a service

Append an object to the `services` array in `content/services.ts`. Each text field is `{ hr, en }`. Required: `id`, `slug`, `icon`, `accent`, `title`, `tagline`, `summary`, `intro`, `features`. `visual` picks the animated illustration (`voice`, `automation`, `web`, `callAccounting`, `support`). Optional blocks — `outcomes`, `editions`, `specs` (technical table), `useCases`, `faq`, `download` (per-language file + cover image), `seo` — render only when present. Set `featured: true` for a wide home-page tile (alternate wide and narrow for the best layout), or `hidden: true` to unpublish without deleting.

The new service appears automatically in the home grid, the Services menu and page, its own page at `/hr/usluge/<slug>` and `/en/services/<slug>`, the footer, the contact form, the sitemap and structured data.

Icons are referenced by name from `components/ui/Icon.tsx`; add a path there for a new one. Accents are `ember`, `amber` or `steel`.

### Add a project or client

Add to `projects` or a `clientGroups[].clients` list in `content/projects.ts`. A project can optionally link to a service through `serviceId` to appear on that service's page.

### Add team members or testimonials

Fill the `team` and `testimonials` arrays in `content/people.ts` (commented examples are inside). Team photos go in `/public/team/`. Only use real people and quotes the client has approved.

### Change a URL

Edit the segment in `content/routes.ts`. Rewrites and canonical redirects are generated in `next.config.ts`.

### Add a language

Add the code to `lib/i18n/config.ts`, create `content/dictionaries/<code>.ts` (TypeScript will flag missing keys), add the code to `next.config.ts` and `content/routes.ts`, and add the language to every `{ hr, en }` field.

## Structure

```
app/[locale]/            pages (home, services, services/[slug], about, support, references, contact, privacy, 404)
app/api/contact/         contact form endpoint (validation, honeypot, time trap, Turnstile, rate limit, Resend)
lib/contact/             shared form schema + spam guard
app/sitemap.ts, robots.ts
components/layout/       Header, Footer, LanguageSwitcher, Logo, SmoothScroll
components/sections/     Hero + SignalCanvas, ServicesGrid, VoiceAgentDemo, ProcessSteps, CtaBand, …
components/visuals/      one animated illustration per service + registry (index.tsx); paused while off-screen
components/brand/        logo-paths.ts — generated from brand/geometry.py
components/ui/           Button, Icon, Reveal, DecodeText, SpotlightCard, Faq, CountUp, SectionHeader, SwipeRail
components/about|contact|references|people/  page-specific components (map, client index, team, testimonials)
brand/                   logo kit generator, CAM brochure generator (brand/brochure), web-font subsetter (brand/fonts)
public/brochures/        generated CAM brochures (HR + EN PDFs and cover images)
public/fonts/            subset web fonts (Latin + Croatian, weights 400–600)
scripts/copy-map-worker.mjs  copies the MapLibre worker into public/vendor on install
content/                 all editable content (see above)
lib/i18n/                locale config, dictionaries, localized paths, language switching
lib/seo.ts, lib/schema.ts  metadata, hreflang, JSON-LD
app/globals.css          design tokens (colours, type scale, radii, easing) and surface utilities
```

## Design system

Built from the logo: graphite surfaces, steel text and Signal Orange pixels. Tokens live once in `app/globals.css` under `@theme`:

- **Colour:** `night`…`night-4` (graphite, from brand ink #16171B), `fg` / `muted` / `subtle`, brand `ember` #FF5A1F, `amber` #FFB547, `steel` #D3D6DC, `charcoal` #3A3D46. Components set `data-accent="ember|amber|steel"`.
- **Type:** Unbounded (display — wide and geometric like the wordmark) and Inter (text), self-hosted from `public/fonts`, subset to Latin + Croatian and weights 400–600 (~60 KB total). Regenerate with `python brand/fonts/subset.py`.
- **Motif:** the logo's square pixel — `pixel-grid` backgrounds, pixel bullets, quantised hero signal, pixel active-state in the navbar.
- **Motion:** Framer Motion (`LazyMotion`) + Lenis. Hero headline decodes into place; the hero signal is sampled into orange pixels; each service has its own looping illustration; the services page stacks pinned panels. Everything respects `prefers-reduced-motion`, and looping visuals pause off-screen.

## Logo and brand files

The logo is defined once in `brand/geometry.py`. To regenerate the logo kit (SVG, PDF, EPS, PNG, favicons, social covers, brand guidelines PDF) and the site's `components/brand/logo-paths.ts`:

```bash
pip install skia-pathops fonttools cairosvg pillow playwright && playwright install chromium
python brand/build.py && python brand/extras.py   # output: brand/out/codec-logo-kit
```

## CAM brochure

`brand/brochure/build.py` builds the brand-styled Call Accounting Manager brochure in Croatian and English (A4 PDF + cover image) into `public/brochures/`. Copy lives in `brand/brochure/content.py` and follows the original product brochure. After editing:

```bash
pip install playwright fonttools brotli && playwright install chromium
python brand/brochure/build.py
```

## Contact form

Delivery uses [Resend](https://resend.com): create an account, verify the `codec-info.hr` domain (add the DNS records it shows), create an API key and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` in Vercel. Without the key the form still works, but enquiries only appear in the Vercel logs.

Spam protection, in layers: a hidden honeypot field, a time trap (forms sent in under 3 s are dropped), a per-IP rate limit (5 per 10 min) and, optionally:

- **Cloudflare Turnstile** — set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Usually invisible to people.
- **Upstash Redis** — set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` so the rate limit is shared across all serverless instances (free tier is enough).

## Analytics

Vercel Web Analytics (cookieless) is included. Turn it on in Vercel → Project → Analytics. Successful enquiries are recorded as the custom event `contact_submit`.

## SEO and accessibility

Per-page titles and descriptions, canonical URLs, `hreflang` alternates (incl. `x-default`), Open Graph images per language, sitemap with alternates, Organization/LocalBusiness, Service and FAQPage structured data, and 301 redirects from the old `.html` URLs. Skip link, landmarks, visible focus, keyboard-operable menus, labelled form fields with inline errors, and reduced-motion support.

## Before launch

- Review the project case-study texts in `content/projects.ts` and the privacy policy copy with the client; some client names have since changed (e.g. Agrokor → Fortenova, VipNet → A1) and are shown as they were at implementation.
- Confirm `CONTACT_FROM_EMAIL` is a verified sender domain in Resend.
- Set the environment variables above in Vercel and send a test enquiry.
- Fill `content/people.ts` when team photos and approved client quotes are available.
