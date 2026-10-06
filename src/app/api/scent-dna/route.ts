import Anthropic from "@anthropic-ai/sdk";
import { anthropic, DNA_SCHEMA, DNA_SYSTEM, hasAI, MODEL, type ScentDNA } from "@/lib/ai";
import { offlineDNA } from "@/lib/dna";
import { getFragrance } from "@/lib/catalog";
import type { QuizAnswers } from "@/lib/recommender";

export async function POST(req: Request) {
  let answers: QuizAnswers;
  try {
    answers = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return Response.json({ error: "Send your quiz answers as an object" }, { status: 400 });
  }
  if (answers.memory) answers.memory = String(answers.memory).slice(0, 600);

  if (!hasAI()) return Response.json(offlineDNA(answers));

  try {
    const res = await anthropic().beta.messages.create({
      model: MODEL,
      max_tokens: 4096,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: DNA_SCHEMA } },
      system: [{ type: "text", text: DNA_SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Quiz answers:\n${JSON.stringify(answers, null, 2)}` }],
    });
    if (res.stop_reason === "refusal") return Response.json(offlineDNA(answers));
    const text = res.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return Response.json(offlineDNA(answers));
    const dna = JSON.parse(text.text) as ScentDNA;
    dna.matches = dna.matches.filter((m) => getFragrance(m.slug)).slice(0, 2);
    if (!dna.matches.length) dna.matches = offlineDNA(answers).matches;
    return Response.json({ ...dna, source: "ai" });
  } catch (err) {
    console.error("scent-dna error", err instanceof Anthropic.APIError ? `API ${err.status}` : err);
    return Response.json(offlineDNA(answers));
  }
}
