import Anthropic from "@anthropic-ai/sdk";
import { anthropic, CONCIERGE_SYSTEM, hasAI, MODEL } from "@/lib/ai";
import { offlineConcierge } from "@/lib/recommender";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 20;
const MAX_CHARS = 2000;

function textStream(text: string) {
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Olfaya-Source": "offline" } });
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
  // The API requires the conversation to start with a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Send at least one user message" }, { status: 400 });
  }

  const last = messages[messages.length - 1].content;
  if (!hasAI()) return textStream(offlineConcierge(last));

  const stream = anthropic().beta.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: [{ type: "text", text: CONCIERGE_SYSTEM, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("I can only help with fragrance and your OLFAYA order. What are you looking for today?"));
        }
      } catch (err) {
        const msg = err instanceof Anthropic.APIError ? `API ${err.status}` : String(err);
        console.error("concierge error", msg);
        // Degrade gracefully: answer with the offline matcher instead of failing.
        controller.enqueue(encoder.encode(offlineConcierge(last)));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Olfaya-Source": "ai" },
  });
}
