import type { ScentDNA } from "./ai";
import { profileFromAnswers, rank, type QuizAnswers } from "./recommender";

const TITLES: Record<string, string> = {
  warmth: "The Golden Hour",
  freshness: "The Monsoon Mind",
  sweetness: "The Velvet Ember",
  depth: "The Night Architect",
  florality: "The Moon Garden",
};

const ARABIC: Record<string, string> = {
  warmth: "ساعة ذهبية",
  freshness: "عقل المطر",
  sweetness: "جمرة مخملية",
  depth: "مهندس الليل",
  florality: "حديقة القمر",
};

// Offline Scent DNA used when the AI backend is not configured or fails.
export function offlineDNA(a: QuizAnswers): ScentDNA {
  const p = profileFromAnswers(a);
  const ranked = rank(p, a);
  const dominant = (Object.entries(p) as [keyof typeof p, number][]).sort((x, y) => y[1] - x[1])[0][0];
  const [first, second] = ranked;
  const f1 = first.fragrance;
  const f2 = second.fragrance;
  return {
    title: TITLES[dominant],
    portrait: `Your signature leans ${dominant === "florality" ? "floral" : dominant}: ${f1.tagline.toLowerCase()} You wear scent as a quiet statement, close enough to be remembered, never loud enough to be ignored.`,
    accords: [
      { name: "Warm spice", strength: p.warmth * 10 },
      { name: "Fresh green", strength: p.freshness * 10 },
      { name: "Soft sweet", strength: p.sweetness * 10 },
      { name: "Deep woods", strength: p.depth * 10 },
      { name: "White florals", strength: p.florality * 10 },
    ].sort((x, y) => y.strength - x.strength),
    formula: {
      top: [f1.notes.top[0], f2.notes.top[0]],
      heart: [f1.notes.heart[0], f2.notes.heart[0]],
      base: [f1.notes.base[0], f2.notes.base[1] ?? f2.notes.base[0]],
    },
    bespokeName: TITLES[dominant].replace("The ", ""),
    bespokeArabic: ARABIC[dominant],
    matches: [
      { slug: f1.slug, reason: `${first.score}% match. ${f1.story.split(".")[0]}.` },
      { slug: f2.slug, reason: `${second.score}% match. ${f2.tagline}` },
    ],
    source: "offline",
  };
}
