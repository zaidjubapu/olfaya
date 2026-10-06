import Anthropic from "@anthropic-ai/sdk";
import { aiProvider, anthropic, DNA_SCHEMA, DNA_SYSTEM, MODEL, type ScentDNA } from "@/lib/ai";
import { getFragrance } from "@/lib/catalog";
import { offlineDNA } from "@/lib/dna";
import { FAST_THINKING, gemini, GEMINI_MODEL } from "@/lib/gemini";
import type { QuizAnswers } from "@/lib/recommender";

async function geminiDNA(prompt: string): Promise<string | undefined> {
  const res = await gemini().models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: DNA_SYSTEM,
      responseMimeType: "application/json",
      responseJsonSchema: DNA_SCHEMA,
      maxOutputTokens: 4096,
      thinkingConfig: FAST_THINKING,
    },
  });
  return res.text;
}

async function claudeDNA(prompt: string): Promise<string | undefined> {
  const res = await anthropic().beta.messages.create({
    model: MODEL,
    max_tokens: 4096,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: { type: "json_schema", schema: DNA_SCHEMA } },
    system: [{ type: "text", text: DNA_SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: prompt }],
  });
  if (res.stop_reason === "refusal") return undefined;
  const text = res.content.find((b) => b.type === "text");
  return text?.type === "text" ? text.text : undefined;
}

export async function POST(req: Request) {
  let answers: QuizAnswers;
  try {
    answers = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (answers.memory) answers.memory = String(answers.memory).slice(0, 600);

  const provider = aiProvider();
  if (!provider) return Response.json(offlineDNA(answers));

  try {
    const prompt = `Quiz answers:\n${JSON.stringify(answers, null, 2)}`;
    const raw = provider === "gemini" ? await geminiDNA(prompt) : await claudeDNA(prompt);
    if (!raw) return Response.json(offlineDNA(answers));
    const dna = JSON.parse(raw) as ScentDNA;
    if (!dna.title || !Array.isArray(dna.accords) || !dna.formula) return Response.json(offlineDNA(answers));
    dna.matches = (dna.matches ?? []).filter((m) => getFragrance(m.slug)).slice(0, 2);
    if (!dna.matches.length) dna.matches = offlineDNA(answers).matches;
    return Response.json({ ...dna, source: provider });
  } catch (err) {
    console.error(`scent-dna ${provider} error`, err instanceof Anthropic.APIError ? `API ${err.status}` : err);
    return Response.json(offlineDNA(answers));
  }
}
