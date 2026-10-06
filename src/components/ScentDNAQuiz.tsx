"use client";

import Link from "next/link";
import { useState } from "react";
import type { ScentDNA } from "@/lib/ai";
import { BESPOKE, getFragrance } from "@/lib/catalog";
import { offlineDNA } from "@/lib/dna";
import type { QuizAnswers } from "@/lib/recommender";
import { AddToBag } from "./AddToBag";

type Step =
  | { key: "mood" | "occasion" | "climate" | "intensity"; q: string; options: { value: string; label: string; hint: string }[] }
  | { key: "loves"; q: string; multi: string[] }
  | { key: "memory"; q: string; placeholder: string };

const STEPS: Step[] = [
  {
    key: "mood",
    q: "How do you want to feel when you wear it?",
    options: [
      { value: "calm", label: "Calm", hint: "grounded, clear-headed" },
      { value: "bold", label: "Bold", hint: "noticed, in command" },
      { value: "romantic", label: "Romantic", hint: "soft, magnetic" },
      { value: "mysterious", label: "Mysterious", hint: "hard to read" },
      { value: "joyful", label: "Joyful", hint: "bright, open" },
      { value: "cozy", label: "Cozy", hint: "wrapped in warmth" },
    ],
  },
  {
    key: "occasion",
    q: "Where will it go most often?",
    options: [
      { value: "office", label: "Work", hint: "close, polished" },
      { value: "evening", label: "Evenings", hint: "dinners, majlis" },
      { value: "wedding", label: "Weddings & Eid", hint: "celebration" },
      { value: "date", label: "Dates", hint: "up close" },
      { value: "travel", label: "Travel", hint: "everywhere" },
      { value: "casual", label: "Every day", hint: "my signature" },
    ],
  },
  {
    key: "climate",
    q: "What's the weather where you live?",
    options: [
      { value: "hot", label: "Hot & humid", hint: "Dubai, Mumbai, Riyadh" },
      { value: "mild", label: "Mild", hint: "Bengaluru, Pune" },
      { value: "cool", label: "Cool", hint: "Delhi winters, AC life" },
    ],
  },
  {
    key: "loves",
    q: "Which of these do you love? Pick any.",
    multi: ["Rose", "Oud", "Jasmine", "Saffron", "Vanilla", "Citrus", "Rain", "Sandalwood", "Incense", "Leather", "Chai", "Musk"],
  },
  {
    key: "intensity",
    q: "How present should it be?",
    options: [
      { value: "soft", label: "A whisper", hint: "only you and those close" },
      { value: "balanced", label: "A conversation", hint: "noticed when near" },
      { value: "statement", label: "An entrance", hint: "remembered after you leave" },
    ],
  },
  { key: "memory", q: "Describe a scent memory you never want to lose.", placeholder: "My grandmother's attar box… the first rain on hot earth in June… bakhoor at Eid…" },
];

export function ScentDNAQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({ loves: [] });
  const [result, setResult] = useState<ScentDNA | null>(null);
  const [loading, setLoading] = useState(false);

  const s = STEPS[step];
  const progress = ((step + (result ? 1 : 0)) / STEPS.length) * 100;

  async function finish(final: QuizAnswers) {
    setLoading(true);
    try {
      const res = await fetch("/api/scent-dna", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(final) });
      if (!res.ok) throw new Error(String(res.status));
      setResult(await res.json());
    } catch {
      setResult(offlineDNA(final));
    } finally {
      setLoading(false);
    }
  }

  function choose(key: keyof QuizAnswers, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish(next);
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <div className="relative mx-auto h-40 w-40">
            <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent,#d9b77e,#c4a1ff,#5ec8c0,transparent)] blur-md [animation-duration:2.4s]" />
            <div className="absolute inset-3 rounded-full bg-ink" />
          </div>
          <p className="mt-8 font-display text-3xl">Sequencing your Scent DNA</p>
          <p className="mt-2 text-sm text-mist">Our AI perfumer is composing a formula only you will wear.</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="animate-rise">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Your Scent DNA</p>
        <h2 className="mt-3 font-display text-5xl leading-none sm:text-7xl">{result.title}</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80">{result.portrait}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border hairline bg-ink-2/60 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Accord signature</p>
            <ul className="mt-6 space-y-4">
              {result.accords.map((a, i) => (
                <li key={a.name}>
                  <div className="flex justify-between text-sm">
                    <span>{a.name}</span>
                    <span className="text-mist">{a.strength}</span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-ivory/5">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-gold via-[#c4a1ff] to-teal transition-all duration-1000"
                      style={{ width: `${Math.min(100, a.strength)}%`, transitionDelay: `${i * 120}ms` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-ink-2 to-[#c4a1ff]/10 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Your bespoke formula</p>
            <p className="mt-4 font-display text-4xl">{result.bespokeName}</p>
            <p className="font-arabic text-lg text-gold/80">{result.bespokeArabic}</p>
            <dl className="mt-6 space-y-3 text-sm">
              {(["top", "heart", "base"] as const).map((k) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-14 shrink-0 uppercase tracking-widest text-mist">{k}</dt>
                  <dd>{result.formula[k].join(" · ")}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <AddToBag
                id={`bespoke-${result.bespokeName.toLowerCase().replace(/\s+/g, "-")}`}
                name={`${BESPOKE.name}: ${result.bespokeName}`}
                options={[{ label: "50ml Extrait, hand-blended", prices: BESPOKE.prices }]}
              />
              <p className="mt-3 text-center text-[11px] text-mist">Blended in our atelier and shipped within 7 days.</p>
            </div>
          </div>
        </div>

        <p className="mt-16 text-xs uppercase tracking-[0.25em] text-mist">Ready to wear today</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {result.matches.map((m) => {
            const f = getFragrance(m.slug);
            if (!f) return null;
            return (
              <Link key={m.slug} href={`/fragrance/${f.slug}`} className="flex gap-4 rounded-3xl border hairline p-3 transition hover:border-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.image} alt="" className="h-32 w-24 rounded-2xl object-cover" />
                <div className="py-2">
                  <p className="font-display text-2xl">{f.name}</p>
                  <p className="mt-1 text-sm text-mist">{m.reason}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <button
          onClick={() => {
            setResult(null);
            setStep(0);
            setAnswers({ loves: [] });
          }}
          className="mt-10 text-sm text-mist underline-offset-4 hover:text-ivory hover:underline"
        >
          Retake the quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="h-px w-full bg-ivory/10">
        <div className="h-px bg-gradient-to-r from-gold to-teal transition-all duration-700" style={{ width: `${Math.max(4, progress)}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-xs text-mist">
        <span>
          {step + 1} / {STEPS.length}
        </span>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="hover:text-ivory">
            Back
          </button>
        )}
      </div>

      <div key={step} className="animate-rise">
        <h2 className="mt-10 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">{s.q}</h2>

        {"options" in s && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.options.map((o) => (
              <button
                key={o.value}
                onClick={() => choose(s.key, o.value)}
                className={`card-sheen rounded-3xl border p-6 text-left transition hover:border-gold ${answers[s.key] === o.value ? "border-gold bg-gold/5" : "hairline bg-ink-2/50"}`}
              >
                <span className="block font-display text-3xl">{o.label}</span>
                <span className="mt-1 block text-sm text-mist">{o.hint}</span>
              </button>
            ))}
          </div>
        )}

        {"multi" in s && (
          <>
            <div className="mt-10 flex flex-wrap gap-3">
              {s.multi.map((m) => {
                const on = answers.loves?.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() =>
                      setAnswers({ ...answers, loves: on ? answers.loves!.filter((x) => x !== m) : [...(answers.loves ?? []), m] })
                    }
                    className={`rounded-full px-5 py-3 text-sm transition ${on ? "bg-gold text-ink" : "btn-ghost"}`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-gold mt-10 rounded-full px-8 py-3.5 text-sm font-medium">
              Continue
            </button>
          </>
        )}

        {"placeholder" in s && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              finish(answers);
            }}
          >
            <textarea
              dir="auto"
              rows={4}
              value={answers.memory ?? ""}
              onChange={(e) => setAnswers({ ...answers, memory: e.target.value })}
              placeholder={s.placeholder}
              className="mt-10 w-full max-w-3xl rounded-3xl border hairline bg-ink-2/60 p-6 text-lg outline-none placeholder:text-mist/50 focus:border-gold"
            />
            <div className="mt-6 flex gap-3">
              <button className="btn-gold rounded-full px-8 py-3.5 text-sm font-medium">Reveal my Scent DNA</button>
              <button type="button" onClick={() => finish(answers)} className="btn-ghost rounded-full px-6 py-3.5 text-sm">
                Skip
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
