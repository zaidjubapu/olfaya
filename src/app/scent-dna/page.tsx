import type { Metadata } from "next";
import { Aura } from "@/components/Aura";
import { ScentDNAQuiz } from "@/components/ScentDNAQuiz";

export const metadata: Metadata = {
  title: "Scent DNA",
  description: "Six questions and one memory. OLFAYA's AI perfumer maps your scent identity and composes a one-of-one bespoke perfume.",
};

export default function ScentDNAPage() {
  return (
    <section className="relative mx-auto min-h-[80vh] max-w-6xl px-4 pb-10 pt-28 sm:px-8">
      <Aura className="absolute -right-40 top-20 -z-10 h-[500px] w-[500px] opacity-30" />
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Scent DNA · Bespoke</p>
      <ScentDNAQuiz />
    </section>
  );
}
