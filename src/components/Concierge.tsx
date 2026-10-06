"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { BESPOKE, DISCOVERY_SET, getFragrance } from "@/lib/catalog";
import { offlineConcierge } from "@/lib/recommender";
import { useStore } from "@/lib/store";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Something for Dubai summer evenings that lasts",
  "Shaadi season mein kya lagaun?",
  "أبحث عن عطر عود غير ثقيل للعمل",
  "A gift for my mother who loves mogra",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Salaam, namaste. I'm Aya, OLFAYA's AI concierge. Tell me where you'll wear your scent, a smell you love, or a memory, and I'll compose a match. I speak English, Hindi and Arabic.",
};

function ProductChip({ slug }: { slug: string }) {
  const { format, currency } = useStore();
  const f = getFragrance(slug);
  if (f) {
    return (
      <Link href={`/fragrance/${f.slug}`} className="my-2 flex items-center gap-3 rounded-2xl border hairline bg-ink/60 p-2 pr-4 transition hover:border-gold">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.image} alt="" className="h-14 w-12 rounded-xl object-cover" />
        <span className="flex-1">
          <span className="block font-display text-lg leading-tight">{f.name}</span>
          <span className="block text-[11px] text-mist">{f.notes.heart.slice(0, 2).join(" · ")}</span>
        </span>
        <span className="text-xs text-gold">{format(f.prices["50ml"][currency])}</span>
      </Link>
    );
  }
  const special = slug === DISCOVERY_SET.slug ? { ...DISCOVERY_SET, href: "/fragrance/discovery-set" } : slug === BESPOKE.slug ? { ...BESPOKE, href: "/scent-dna" } : null;
  if (!special) return null;
  return (
    <Link href={special.href} className="my-2 flex items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/5 px-4 py-3 transition hover:border-gold">
      <span className="font-display text-lg">{special.name}</span>
      <span className="text-xs text-gold">{format(special.prices[currency])}</span>
    </Link>
  );
}

// Renders **bold** and [[slug]] product markers.
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[a-z0-9-]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([a-z0-9-]+)\]\]$/);
        if (m) return <ProductChip key={i} slug={m[1]} />;
        return (
          <Fragment key={i}>
            {part.split(/(\*\*[^*]+\*\*)/g).map((s, j) =>
              s.startsWith("**") && s.endsWith("**") ? (
                <strong key={j} className="font-medium text-gold-2">
                  {s.slice(2, -2)}
                </strong>
              ) : (
                <Fragment key={j}>{s}</Fragment>
              ),
            )}
          </Fragment>
        );
      })}
    </>
  );
}

export function Concierge({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const setReply = (reply: string) =>
      setMessages((m) => {
        const next = m.slice();
        next[next.length - 1] = { role: "assistant", content: reply };
        return next;
      });

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The greeting is UI only; the API sees the real conversation.
        body: JSON.stringify({ messages: history.slice(1) }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setReply(acc);
      }
      if (!acc) setReply(offlineConcierge(content));
    } catch {
      // Static previews have no backend; answer locally so the experience still works.
      setReply(offlineConcierge(content));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-3xl border hairline bg-ink-2/80 ${compact ? "h-full" : "h-[70vh] min-h-[520px]"}`}>
      <div className="flex items-center gap-3 border-b hairline px-5 py-4">
        <span className="relative grid h-9 w-9 place-items-center">
          <span className="absolute inset-0 animate-drift rounded-full bg-[conic-gradient(from_0deg,#f0d9a8,#c4a1ff,#5ec8c0,#f0d9a8)] blur-[2px]" />
          <span className="relative font-display text-lg text-ink">A</span>
        </span>
        <div>
          <p className="text-sm font-medium">Aya · AI Concierge</p>
          <p className="text-[11px] text-mist">{busy ? "Composing…" : "Online · English · हिंदी · العربية"}</p>
        </div>
      </div>

      <div ref={scroller} className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              dir="auto"
              className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                m.role === "user" ? "rounded-br-sm bg-gold/90 text-ink" : "rounded-bl-sm bg-ink-3 text-ivory/90"
              }`}
            >
              {m.content ? (
                <RichText text={m.content} />
              ) : (
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {STARTERS.map((s) => (
              <button key={s} dir="auto" onClick={() => send(s)} className="btn-ghost rounded-full px-3.5 py-2 text-left text-xs text-mist">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t hairline p-3"
      >
        <input
          dir="auto"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a mood, a memory, a moment…"
          className="w-full rounded-full bg-ink-3 px-4 py-3 text-sm outline-none placeholder:text-mist/60 focus:ring-1 focus:ring-gold"
        />
        <button disabled={busy} className="btn-gold shrink-0 rounded-full px-5 text-sm font-medium disabled:opacity-50" aria-label="Send">
          Ask
        </button>
      </form>
    </div>
  );
}
