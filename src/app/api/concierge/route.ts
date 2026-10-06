import Anthropic from "@anthropic-ai/sdk";
import { aiProvider, anthropic, CONCIERGE_SYSTEM, MODEL } from "@/lib/ai";
import { FAST_THINKING, gemini, GEMINI_MODEL, toGeminiContents } from "@/lib/gemini";
import { offlineConcierge } from "@/lib/recommender";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 20;
const MAX_CHARS = 2000;
const OFF_TOPIC = "I can only help with fragrance and your OLFAYA order. What are you looking for today?";

function textStream(text: string) {
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Olfaya-Source": "offline" } });
}

async function* geminiReply(messages: ChatMessage[], signal: AbortSignal) {
  const stream = await gemini().models.generateContentStream({
    model: GEMINI_MODEL,
    contents: toGeminiContents(messages),
    config: { systemInstruction: CONCIERGE_SYSTEM, maxOutputTokens: 2048, thinkingConfig: FAST_THINKING, abortSignal: signal },
  });
  for await (const chunk of stream) if (chunk.text) yield chunk.text;
}

async function* claudeReply(messages: ChatMessage[], signal: AbortSignal) {
  const stream = anthropic().beta.messages.stream(
    {
      model: MODEL,
      max_tokens: 2048,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: CONCIERGE_SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    },
    { signal },
  );
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") yield event.delta.text;
  }
  if ((await stream.finalMessage()).stop_reason === "refusal") yield OFF_TOPIC;
}

export async function POST(req: Request) {
  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatMessage) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-MAX_TURNS)
      .map((m: ChatMessage) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  // Both APIs require the conversation to start with a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Send at least one user message" }, { status: 400 });
  }

  const last = messages[messages.length - 1].content;
  const provider = aiProvider();
  if (!provider) return textStream(offlineConcierge(last));

  const abort = new AbortController();
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        const reply = provider === "gemini" ? geminiReply(messages, abort.signal) : claudeReply(messages, abort.signal);
        for await (const text of reply) {
          controller.enqueue(encoder.encode(text));
          sent = true;
        }
      } catch (err) {
        console.error(`concierge ${provider} error`, err instanceof Anthropic.APIError ? `API ${err.status}` : String(err));
      }
      // Degrade gracefully: if the model produced nothing, answer with the offline matcher.
      if (!sent) controller.enqueue(encoder.encode(offlineConcierge(last)));
      controller.close();
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Olfaya-Source": provider },
  });
}
