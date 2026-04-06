# matzone — Next.js Shop Setup

## Schnellstart

```bash
# 1. In den Projektordner wechseln
cd matzone-nextjs

# 2. Dependencies installieren
npm install

# 3. Entwicklungsserver starten
npm run dev

# 4. Browser öffnen
open http://localhost:3000/de
```

## Deployment auf Vercel (empfohlen)

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel

# Umgebungsvariablen in Vercel setzen:
# WOOCOMMERCE_URL=https://fussmatte.at
# WOOCOMMERCE_CONSUMER_KEY=ck_...
# WOOCOMMERCE_CONSUMER_SECRET=cs_...
# NEXT_PUBLIC_SITE_URL=https://matzone.eu
```

## Projektstruktur

```
matzone-nextjs/
├── app/
│   ├── [locale]/           # Alle Seiten für jede Sprache
│   │   ├── layout.tsx      # Root Layout mit Nav + Footer
│   │   ├── page.tsx        # Homepage
│   │   ├── shop/
│   │   │   ├── page.tsx    # Produktliste
│   │   │   └── [slug]/
│   │   │       └── page.tsx # Produktdetail
│   │   └── blog/
│   │       └── page.tsx    # Blog
│   ├── api/search/         # WooCommerce Suche API
│   ├── sitemap.ts          # Auto-generierte Sitemap für alle Locales
│   └── robots.ts
├── components/             # Alle UI-Komponenten
├── lib/
│   ├── woocommerce.ts      # WooCommerce API Client
│   └── cart.ts             # Zustand Cart Store
├── messages/               # Übersetzungen (18 EU-Sprachen)
├── types/                  # TypeScript Typen
├── i18n.ts                 # Locale-Konfiguration
└── middleware.ts           # Automatische Spracherkennung
```

## Unterstützte Sprachen / Locales

| Code | Sprache       | URL-Prefix  |
|------|---------------|-------------|
| de   | Deutsch (DE)  | /de/        |
| at   | Deutsch (AT)  | /at/        |
| ch   | Deutsch (CH)  | /ch/        |
| en   | English (UK)  | /en/        |
| fr   | Français      | /fr/        |
| nl   | Nederlands    | /nl/        |
| be   | Belgisch      | /be/        |
| it   | Italiano      | /it/        |
| es   | Español       | /es/        |
| pt   | Português     | /pt/        |
| sv   | Svenska       | /sv/        |
| nb   | Norsk         | /nb/        |
| da   | Dansk         | /da/        |
| fi   | Suomi         | /fi/        |
| pl   | Polski        | /pl/        |
| cs   | Čeština       | /cs/        |
| hu   | Magyar        | /hu/        |
| ro   | Română        | /ro/        |

## SEO Features

- **hreflang Tags** — Automatisch für alle Locales generiert
- **Sitemap.xml** — Alle Produkte × alle Sprachen
- **robots.txt** — Automatisch generiert
- **JSON-LD** — Schema.org Produktdaten auf jeder Produktseite
- **Canonical URLs** — Pro Locale korrekt gesetzt
- **Metadata** — Titel & Description pro Locale übersetzt
- **Open Graph** — Für Social Sharing optimiert

## WooCommerce API

Die API-Zugangsdaten sind in `.env.local`:
```
WOOCOMMERCE_URL=https://fussmatte.at
WOOCOMMERCE_CONSUMER_KEY=ck_b80cfe6eb205ba35aeed5d1fcfa5db08de681cfb
WOOCOMMERCE_CONSUMER_SECRET=cs_2a490e9e092c91659dce7ba297fede8d1901fd0e
```

Daten werden serverseitig gefetcht und **1 Stunde gecacht** (ISR — Incremental Static Regeneration).

## Länderspezifische Domains (nächster Schritt)

Für maximales SEO empfehlen wir später länderspezifische Domains:
- `matzone.de` → Redirect zu `/de/`
- `matzone.at` → Redirect zu `/at/`
- `matzone.fr` → Redirect zu `/fr/`
- usw.

Dies kann in `next.config.mjs` via `redirects` oder über Vercel Domains konfiguriert werden.
