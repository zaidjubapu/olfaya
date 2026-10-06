import type { Metadata } from "next";
import { CollectionGrid } from "./CollectionGrid";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Six OLFAYA signatures: amber, fresh, woody, floral, oud and gourmand. Extraits and eaux de parfum for India and the Gulf.",
};

export default function CollectionPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">The Era Collection</p>
      <h1 className="mt-4 font-display text-6xl leading-none sm:text-8xl">The Collection</h1>
      <p className="mt-6 max-w-xl text-mist">
        Six signatures composed with AI and finished by hand. Filter by family, or let Aya choose for you.
      </p>
      <CollectionGrid />
    </section>
  );
}
