// Deterministic scent matcher. Used for instant results in the Scent DNA quiz,
// as grounding data for Claude, and as the offline fallback when no API key is set.
import { FRAGRANCES, type Fragrance } from "./catalog";

export type Profile = Fragrance["profile"];

export type QuizAnswers = {
  mood?: string; // e.g. "calm", "bold"
  occasion?: string; // e.g. "office", "wedding"
  climate?: string; // "hot", "mild", "cool"
  loves?: string[]; // e.g. ["rose", "oud", "spice"]
  avoid?: string[];
  intensity?: "soft" | "balanced" | "statement";
  memory?: string; // free text: a scent memory
};

const KEYWORDS: Record<string, Partial<Profile>> = {
  rose: { florality: 3, warmth: 1 },
  jasmine: { florality: 3 },
  mogra: { florality: 3 },
  floral: { florality: 3 },
  flower: { florality: 2 },
  oud: { depth: 3, warmth: 2 },
  smoke: { depth: 2 },
  incense: { depth: 2, warmth: 1 },
  bakhoor: { depth: 2, warmth: 2 },
  leather: { depth: 2 },
  spice: { warmth: 2 },
  saffron: { warmth: 2 },
  chai: { warmth: 2, sweetness: 2 },
  vanilla: { sweetness: 3, warmth: 1 },
  sweet: { sweetness: 3 },
  dessert: { sweetness: 3 },
  fresh: { freshness: 3 },
  citrus: { freshness: 3 },
  rain: { freshness: 3 },
  green: { freshness: 2 },
  sea: { freshness: 3 },
  clean: { freshness: 2 },
  wood: { depth: 2 },
  sandalwood: { warmth: 2, depth: 1 },
  amber: { warmth: 2, sweetness: 1 },
  musk: { depth: 1 },
};

export function profileFromAnswers(a: QuizAnswers): Profile {
  const p: Profile = { warmth: 5, freshness: 5, sweetness: 5, depth: 5, florality: 5 };
  const bump = (d: Partial<Profile>, sign = 1) => {
    for (const k of Object.keys(d) as (keyof Profile)[]) p[k] += sign * (d[k] ?? 0);
  };
  const moodMap: Record<string, Partial<Profile>> = {
    calm: { freshness: 2, depth: -1 },
    bold: { depth: 3, warmth: 2 },
    romantic: { florality: 3, sweetness: 1 },
    mysterious: { depth: 3 },
    joyful: { freshness: 2, florality: 1 },
    cozy: { warmth: 3, sweetness: 2 },
  };
  const climateMap: Record<string, Partial<Profile>> = {
    hot: { freshness: 2, sweetness: -1 },
    mild: {},
    cool: { warmth: 2, depth: 1 },
  };
  const intensityMap: Record<string, Partial<Profile>> = {
    soft: { depth: -2, freshness: 1 },
    balanced: {},
    statement: { depth: 2, warmth: 1 },
  };
  if (a.mood) bump(moodMap[a.mood] ?? {});
  if (a.climate) bump(climateMap[a.climate] ?? {});
  if (a.intensity) bump(intensityMap[a.intensity] ?? {});
  const text = [...(a.loves ?? []), a.memory ?? ""].join(" ").toLowerCase();
  for (const [word, d] of Object.entries(KEYWORDS)) if (text.includes(word)) bump(d);
  for (const word of a.avoid ?? []) {
    const d = KEYWORDS[word.toLowerCase()];
    if (d) bump(d, -1);
  }
  for (const k of Object.keys(p) as (keyof Profile)[]) p[k] = Math.max(0, Math.min(10, p[k]));
  return p;
}

export function rank(profile: Profile, a: QuizAnswers = {}) {
  return FRAGRANCES.map((f) => {
    let dist = 0;
    for (const k of Object.keys(profile) as (keyof Profile)[]) dist += (profile[k] - f.profile[k]) ** 2;
    let score = 100 - Math.sqrt(dist) * 6;
    if (a.occasion && f.occasions.includes(a.occasion)) score += 8;
    if (a.mood && f.moods.includes(a.mood)) score += 8;
    if (a.climate === "hot" && f.season.includes("summer")) score += 4;
    if (a.climate === "cool" && f.season.includes("winter")) score += 4;
    return { fragrance: f, score: Math.round(Math.max(40, Math.min(99, score))) };
  }).sort((x, y) => y.score - x.score);
}

// Offline concierge: keyword-match a free-text message to the catalog.
export function offlineConcierge(message: string) {
  const answers: QuizAnswers = { memory: message };
  const lower = message.toLowerCase();
  for (const m of ["calm", "bold", "romantic", "mysterious", "joyful", "cozy"]) if (lower.includes(m)) answers.mood = m;
  for (const o of ["office", "wedding", "date", "evening", "travel", "majlis", "eid", "diwali"])
    if (lower.includes(o)) answers.occasion = o === "eid" || o === "diwali" ? "celebration" : o;
  if (/(dubai|riyadh|doha|summer|hot|humid|mumbai|chennai)/.test(lower)) answers.climate = "hot";
  const top = rank(profileFromAnswers(answers), answers).slice(0, 2);
  const [a, b] = top;
  return (
    `Based on what you shared, I'd start with **${a.fragrance.name}**: ${a.fragrance.tagline} ` +
    `It opens with ${a.fragrance.notes.top.slice(0, 2).join(" and ").toLowerCase()} and settles into ${a.fragrance.notes.base[0].toLowerCase()}. [[${a.fragrance.slug}]]\n\n` +
    `If you want something ${b.fragrance.profile.freshness > a.fragrance.profile.freshness ? "fresher" : "deeper"}, try **${b.fragrance.name}**. [[${b.fragrance.slug}]]\n\n` +
    `Tell me more about where you'll wear it and I'll refine this.`
  );
}
