# OLFAYA

**Perfume for the AI era.** A luxury fragrance house for India and the GCC: heritage attar, oud and saffron, composed with AI and finished by hand.

The name comes from *olfactory* + *aya* (Arabic آية, "a sign, a wonder"). It reads the same way in English, Hindi and Arabic. Arabic: أولفايا.

## What's in the site

| Page | What it does |
|---|---|
| `/` | Cinematic hero, the Era Collection, Scent DNA teaser, atelier story, embedded AI concierge, discovery set |
| `/collection` | All six fragrances with family filters |
| `/fragrance/[slug]` | Product page: notes pyramid, AI olfactive profile, longevity and sillage, 50ml/100ml |
| `/scent-dna` | 6-step quiz → Claude writes a one-of-one **bespoke formula** + two catalog matches |
| `/concierge` | **Aya**, the AI fragrance concierge (English, Hindi/Hinglish, Arabic), streaming |
| `/checkout` | Server-priced orders in INR / AED / SAR, Razorpay or cash on delivery |

Aya also floats on every page as a chat bubble.

## AI backend

- `POST /api/concierge` streams Claude (`claude-opus-5-5`, low effort for snappy chat) with the full catalog in a cached system prompt. The model tags products as `[[slug]]`, which the UI turns into shoppable cards.
- `POST /api/scent-dna` uses structured outputs (JSON schema) to return a scent portrait, accord strengths, a top/heart/base formula, a bespoke name in English and Arabic, and matches.
- Both use server-side refusal fallbacks and **degrade gracefully**: with no `ANTHROPIC_API_KEY`, or if the API errors, a deterministic recommender (`src/lib/recommender.ts`) answers instead, so the store never breaks.
- `POST /api/order` recomputes every price on the server from the catalog, applies free-shipping thresholds, optionally creates a Razorpay order, and forwards the order to `ORDER_WEBHOOK_URL`.

## Run it

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev
```

## Deploy (always on, nothing on your computer)

1. Go to https://vercel.com/new and import this GitHub repo (framework: Next.js, no settings to change).
2. Add `ANTHROPIC_API_KEY` (from https://console.anthropic.com) under Environment Variables.
3. Deploy. Point `olfaya.com` at it under Settings → Domains once the domain is registered.

## Brand system

- **Palette:** ink `#0a0910`, ivory `#f4efe6`, champagne gold `#d9b77e`, iridescent violet `#8b5cf6` → teal `#5ec8c0`.
- **Type:** Cormorant Garamond (display), Manrope (UI), Noto Kufi Arabic.
- **Bottle:** faceted obsidian glass, brushed champagne-gold cap with an iridescent light ring.
- **Imagery:** generated in Higgsfield (see `docs/launch-plan.md` for the prompts). Images currently load from the Higgsfield CDN; copy them into `public/images` before launch.

## Catalog

| Fragrance | Family | 50ml | 100ml |
|---|---|---|---|
| Noor Signal | Amber · saffron, Taif rose, white oud | ₹7,900 / AED 349 | ₹12,900 / AED 549 |
| Monsoon Code | Fresh · mitti attar, cardamom, vetiver | ₹6,400 / AED 289 | ₹9,900 / AED 449 |
| Desert Algorithm | Woody · hojari frankincense, date, cedar | ₹7,900 / AED 349 | ₹12,900 / AED 549 |
| Mogra Protocol | Floral · jasmine sambac, tuberose, musk | ₹6,400 / AED 289 | ₹9,900 / AED 449 |
| Neural Oud | Oud · Assam oud, black pepper, vanilla | ₹9,900 / AED 449 | ₹15,900 / AED 699 |
| Sandal Quantum | Gourmand · masala chai, cacao, sandalwood | ₹6,900 / AED 309 | ₹10,900 / AED 479 |
| Era Discovery Set | 6 × 2ml | ₹1,490 / AED 69 | |
| Bespoke AI Blend | 50ml extrait from your Scent DNA | ₹12,900 / AED 549 | |

Edit everything in `src/lib/catalog.ts`.
