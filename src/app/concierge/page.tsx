import type { Metadata } from "next";
import { Aura } from "@/components/Aura";
import { Concierge } from "@/components/Concierge";

export const metadata: Metadata = {
  title: "AI Concierge",
  description: "Aya, OLFAYA's AI fragrance concierge, finds your scent in English, Hindi or Arabic.",
};

export default function ConciergePage() {
  return (
    <section className="relative mx-auto max-w-3xl px-4 pb-10 pt-28 sm:px-8">
      <Aura className="absolute left-1/2 top-10 -z-10 h-[500px] w-[500px] -translate-x-1/2 opacity-40" />
      <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">AI Concierge</p>
      <h1 className="mt-4 text-center font-display text-5xl leading-none sm:text-7xl">Ask Aya anything.</h1>
      <p className="mx-auto mt-4 max-w-md text-center text-sm text-mist">
        Your private perfumer. Describe a moment, a memory or a person, and Aya will find the scent.
      </p>
      <div className="mt-10">
        <Concierge />
      </div>
    </section>
  );
}
