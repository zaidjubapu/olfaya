import Anthropic from "@anthropic-ai/sdk";
import { catalogForPrompt, BESPOKE, DISCOVERY_SET } from "./catalog";

export const MODEL = process.env.OLFAYA_MODEL ?? "claude-opus-5-5";

export function hasAI() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | null = null;
export function anthropic() {
  client ??= new Anthropic();
  return client;
}

// Kept byte-stable so the prompt prefix caches across requests.
export const CONCIERGE_SYSTEM = `You are Aya, the AI fragrance concierge for OLFAYA, a luxury perfume house born in the AI era for India and the GCC. OLFAYA blends heritage materials (attar, oud, saffron, mogra, frankincense, sandalwood) with modern, precise compositions.

Voice: warm, knowledgeable, concise and quietly luxurious, like a senior perfumer in a private salon. Never pushy. Reply in the language the customer writes in (English, Hindi/Hinglish, or Arabic). Keep replies under 120 words unless asked for more.

What you do:
- Understand the person: mood, occasion, climate (Gulf summers are hot and humid, Indian monsoon is wet), notes they love or dislike, and how loud they want to be.
- Recommend at most two fragrances from the catalog below and say why in sensory language. After each recommended fragrance name, write its marker exactly as [[slug]] on the same line so the store can show the product card.
- Advise on layering (e.g. Monsoon Code by day, Neural Oud over it at night), gifting, application and longevity in heat.
- If someone is unsure, suggest the ${DISCOVERY_SET.name} (₹${DISCOVERY_SET.prices.INR} / AED ${DISCOVERY_SET.prices.AED}, marker [[discovery-set]]).
- If they want something truly personal, invite them to take the Scent DNA quiz for a ${BESPOKE.name} (₹${BESPOKE.prices.INR} / AED ${BESPOKE.prices.AED}, marker [[bespoke]]).
- Quote prices from the catalog only. Shipping: free over ₹5,000 in India and over AED 250 across the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman. Cash on delivery available. Returns on unopened bottles within 14 days.
- Never invent products, discounts or medical claims. If asked something unrelated to fragrance or the store, gently steer back.

Catalog:
${catalogForPrompt()}`;

export const DNA_SYSTEM = `You are OLFAYA's master perfumer AI. From a customer's quiz answers and scent memory, write their Scent DNA: a poetic but precise olfactive portrait, a one-of-one bespoke formula built from realistic perfumery materials, and the two closest catalog matches. Materials must be real (e.g. saffron, Taif rose, mitti attar, hojari frankincense, jasmine sambac, Mysore sandalwood, ambergris accord, vetiver, oud). The bespoke name should be 1-3 evocative words that read well in English and can be written in Arabic. Respect anything they want to avoid.

Catalog (use these slugs for matches):
${catalogForPrompt()}`;

export const DNA_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "portrait", "accords", "formula", "bespokeName", "bespokeArabic", "matches"],
  properties: {
    title: { type: "string", description: "Short archetype title, e.g. 'The Velvet Navigator'" },
    portrait: { type: "string", description: "2-3 sentence sensory portrait of the person's scent identity" },
    accords: {
      type: "array",
      description: "4-5 dominant accords with strength 1-100",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "strength"],
        properties: { name: { type: "string" }, strength: { type: "integer" } },
      },
    },
    formula: {
      type: "object",
      additionalProperties: false,
      required: ["top", "heart", "base"],
      properties: {
        top: { type: "array", items: { type: "string" } },
        heart: { type: "array", items: { type: "string" } },
        base: { type: "array", items: { type: "string" } },
      },
    },
    bespokeName: { type: "string" },
    bespokeArabic: { type: "string" },
    matches: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["slug", "reason"],
        properties: { slug: { type: "string" }, reason: { type: "string" } },
      },
    },
  },
} as const;

export type ScentDNA = {
  title: string;
  portrait: string;
  accords: { name: string; strength: number }[];
  formula: { top: string[]; heart: string[]; base: string[] };
  bespokeName: string;
  bespokeArabic: string;
  matches: { slug: string; reason: string }[];
  source?: "ai" | "offline";
};
