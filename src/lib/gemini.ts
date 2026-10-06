import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Gemini Flash is the default AI provider. `gemini-flash-latest` tracks Google's newest Flash
// release; pin a specific model with GEMINI_MODEL if you need stable behaviour.
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

export function geminiKey() {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

let client: GoogleGenAI | null = null;
export function gemini() {
  client ??= new GoogleGenAI({ apiKey: geminiKey() });
  return client;
}

export const FAST_THINKING = { thinkingLevel: ThinkingLevel.LOW };

type Turn = { role: "user" | "assistant"; content: string };

export function toGeminiContents(messages: Turn[]) {
  return messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
}
