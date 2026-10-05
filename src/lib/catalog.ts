// The OLFAYA catalog. Single source of truth for the storefront, the AI
// concierge's system prompt, and the offline recommender.

export type Currency = "INR" | "AED" | "SAR";

export type Family = "amber" | "floral" | "woody" | "fresh" | "oud" | "gourmand";

export type Fragrance = {
  slug: string;
  name: string;
  arabicName: string;
  tagline: string;
  story: string;
  family: Family;
  concentration: "Extrait de Parfum" | "Eau de Parfum";
  notes: { top: string[]; heart: string[]; base: string[] };
  // 0-10 intensity on the axes the recommender uses.
  profile: { warmth: number; freshness: number; sweetness: number; depth: number; florality: number };
  moods: string[];
  occasions: string[];
  season: string[];
  longevityHours: number;
  sillage: "intimate" | "moderate" | "strong";
  origin: string;
  image: string;
  accent: string; // CSS color used for this scent's aura
  prices: Record<"50ml" | "100ml", Record<Currency, number>>;
};

const IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3KGId1jDoOH29BoOzLxz2b99gjp";

export const IMAGES = {
  hero: `${IMG}/hf_20261005_232633_aa782761-9c7b-45e5-9231-dd239b7f684e.png`,
  master: `${IMG}/hf_20261005_232633_a28aeb96-1fe6-449c-b929-7fe5f943d801.png`,
  atelier: `${IMG}/hf_20261005_232759_a7b96d11-a055-41d8-9bee-f81422ceb0e0.png`,
  discovery: `${IMG}/hf_20261005_232758_5a2c9cad-a6e0-45ce-945f-2d83ab4c99a2.png`,
};

const price = (inr50: number, aed50: number, inr100: number, aed100: number) => ({
  "50ml": { INR: inr50, AED: aed50, SAR: aed50 + 10 },
  "100ml": { INR: inr100, AED: aed100, SAR: aed100 + 20 },
});

export const FRAGRANCES: Fragrance[] = [
  {
    slug: "noor-signal",
    name: "Noor Signal",
    arabicName: "إشارة النور",
    tagline: "The first light, decoded.",
    story:
      "Dawn over Taif's rose terraces, rendered in saffron and white oud. A radiant signature built to glow on skin from majlis to boardroom.",
    family: "amber",
    concentration: "Extrait de Parfum",
    notes: {
      top: ["Kashmiri saffron", "Pink pepper", "Bergamot"],
      heart: ["Taif rose", "Orris butter"],
      base: ["White oud", "Ambergris accord", "Cashmere musk"],
    },
    profile: { warmth: 8, freshness: 4, sweetness: 5, depth: 7, florality: 7 },
    moods: ["radiant", "confident", "romantic"],
    occasions: ["evening", "wedding", "celebration", "office"],
    season: ["autumn", "winter", "spring"],
    longevityHours: 12,
    sillage: "strong",
    origin: "Taif × Kashmir",
    image: `${IMG}/hf_20261005_232758_80cf4691-f82f-4d98-9073-85c28882b536.png`,
    accent: "#E8B86B",
    prices: price(7900, 349, 12900, 549),
  },
  {
    slug: "monsoon-code",
    name: "Monsoon Code",
    arabicName: "شيفرة المطر",
    tagline: "The first rain, written in vetiver.",
    story:
      "Mitti attar — the scent of parched earth meeting monsoon rain — distilled the old Kannauj way, then sharpened with green cardamom and cool iris.",
    family: "fresh",
    concentration: "Eau de Parfum",
    notes: {
      top: ["Green cardamom", "Petitgrain", "Rain accord"],
      heart: ["Mitti attar", "Iris", "Violet leaf"],
      base: ["Haitian vetiver", "Cedar", "Mineral musk"],
    },
    profile: { warmth: 3, freshness: 9, sweetness: 2, depth: 6, florality: 3 },
    moods: ["calm", "grounded", "nostalgic"],
    occasions: ["daytime", "office", "travel", "casual"],
    season: ["summer", "monsoon", "spring"],
    longevityHours: 8,
    sillage: "moderate",
    origin: "Kannauj",
    image: `${IMG}/hf_20261005_232759_130ca653-f33c-4b2c-a3bc-bfadd584e47b.png`,
    accent: "#6FB3A4",
    prices: price(6400, 289, 9900, 449),
  },
  {
    slug: "desert-algorithm",
    name: "Desert Algorithm",
    arabicName: "خوارزمية الصحراء",
    tagline: "Ancient resin, future geometry.",
    story:
      "Hojari frankincense from Dhofar burned over warm leather and sun-baked dates. Smoke that draws lines in the air like code.",
    family: "woody",
    concentration: "Extrait de Parfum",
    notes: {
      top: ["Hojari frankincense", "Elemi", "Black lime"],
      heart: ["Date accord", "Suede", "Cypriol"],
      base: ["Atlas cedar", "Labdanum", "Smoked birch"],
    },
    profile: { warmth: 7, freshness: 3, sweetness: 4, depth: 9, florality: 1 },
    moods: ["mysterious", "bold", "focused"],
    occasions: ["evening", "night out", "majlis", "office"],
    season: ["autumn", "winter"],
    longevityHours: 14,
    sillage: "strong",
    origin: "Dhofar",
    image: `${IMG}/hf_20261005_232759_07eb1022-00be-45dc-9023-a222101561c7.png`,
    accent: "#C9733B",
    prices: price(7900, 349, 12900, 549),
  },
  {
    slug: "mogra-protocol",
    name: "Mogra Protocol",
    arabicName: "بروتوكول الياسمين",
    tagline: "Night-blooming, precisely.",
    story:
      "Strings of mogra sold at temple gates, tuberose from Madurai, and a clean musk that makes white flowers feel modern, luminous and never heavy.",
    family: "floral",
    concentration: "Eau de Parfum",
    notes: {
      top: ["Bergamot", "Neroli", "Pear"],
      heart: ["Mogra (jasmine sambac)", "Tuberose", "Orange blossom"],
      base: ["White musk", "Sandalwood", "Benzoin"],
    },
    profile: { warmth: 5, freshness: 6, sweetness: 6, depth: 4, florality: 10 },
    moods: ["romantic", "joyful", "elegant"],
    occasions: ["wedding", "date", "daytime", "celebration"],
    season: ["spring", "summer"],
    longevityHours: 9,
    sillage: "moderate",
    origin: "Madurai",
    image: `${IMG}/hf_20261005_232758_3e2fa4e0-a992-4d41-afd0-851cecd348a8.png`,
    accent: "#E9E4F5",
    prices: price(6400, 289, 9900, 449),
  },
  {
    slug: "neural-oud",
    name: "Neural Oud",
    arabicName: "عود عصبي",
    tagline: "Oud, rewired.",
    story:
      "Wild Assam agarwood meets black pepper and Madagascan vanilla. Dark, plush and electric — the oud for people who think they don't like oud.",
    family: "oud",
    concentration: "Extrait de Parfum",
    notes: {
      top: ["Black pepper", "Saffron", "Plum"],
      heart: ["Assam oud", "Patchouli", "Rose absolute"],
      base: ["Bourbon vanilla", "Labdanum", "Ambroxan"],
    },
    profile: { warmth: 9, freshness: 2, sweetness: 6, depth: 10, florality: 3 },
    moods: ["bold", "mysterious", "seductive"],
    occasions: ["night out", "evening", "majlis", "celebration"],
    season: ["autumn", "winter"],
    longevityHours: 16,
    sillage: "strong",
    origin: "Assam",
    image: `${IMG}/hf_20261005_232759_3a74c4d1-c910-402b-a0d5-d92b4f01fde9.png`,
    accent: "#8B5CF6",
    prices: price(9900, 449, 15900, 699),
  },
  {
    slug: "sandal-quantum",
    name: "Sandal Quantum",
    arabicName: "صندل كمّي",
    tagline: "Warmth in superposition.",
    story:
      "Creamy Mysore sandalwood folded with masala-chai spice, tonka and a whisper of cacao. Comforting and addictive, like the last cup of the night.",
    family: "gourmand",
    concentration: "Eau de Parfum",
    notes: {
      top: ["Cinnamon", "Ginger", "Cardamom"],
      heart: ["Masala chai accord", "Cacao", "Milk accord"],
      base: ["Mysore sandalwood", "Tonka bean", "Amber"],
    },
    profile: { warmth: 8, freshness: 3, sweetness: 8, depth: 6, florality: 2 },
    moods: ["cozy", "calm", "playful"],
    occasions: ["casual", "date", "evening", "travel"],
    season: ["autumn", "winter", "monsoon"],
    longevityHours: 10,
    sillage: "moderate",
    origin: "Mysore",
    image: `${IMG}/hf_20261005_232759_46d45f7a-2ee1-409a-91cf-777d957683c8.png`,
    accent: "#D49A6A",
    prices: price(6900, 309, 10900, 479),
  },
];

export const DISCOVERY_SET = {
  slug: "discovery-set",
  name: "The Era Discovery Set",
  description: "All six OLFAYA scents in 2ml vials. The cost is credited back on your first full bottle.",
  image: IMAGES.discovery,
  prices: { INR: 1490, AED: 69, SAR: 75 } as Record<Currency, number>,
};

export const BESPOKE = {
  slug: "bespoke",
  name: "Bespoke AI Blend",
  description:
    "A one-of-one 50ml extrait composed from your Scent DNA, named for you and hand-blended in our atelier within 7 days.",
  prices: { INR: 12900, AED: 549, SAR: 569 } as Record<Currency, number>,
};

export function getFragrance(slug: string) {
  return FRAGRANCES.find((f) => f.slug === slug);
}

// Compact text version of the catalog for the concierge's system prompt.
export function catalogForPrompt() {
  return FRAGRANCES.map(
    (f) =>
      `- ${f.name} (slug: ${f.slug}) — ${f.family}, ${f.concentration}. Top: ${f.notes.top.join(", ")}. Heart: ${f.notes.heart.join(", ")}. Base: ${f.notes.base.join(", ")}. Moods: ${f.moods.join(", ")}. Best for: ${f.occasions.join(", ")}; ${f.season.join("/")}. ~${f.longevityHours}h, ${f.sillage} sillage. 50ml ₹${f.prices["50ml"].INR} / AED ${f.prices["50ml"].AED}; 100ml ₹${f.prices["100ml"].INR} / AED ${f.prices["100ml"].AED}.`,
  ).join("\n");
}
