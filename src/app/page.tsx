import Link from "next/link";
import { Aura } from "@/components/Aura";
import { Concierge } from "@/components/Concierge";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { FRAGRANCES, IMAGES } from "@/lib/catalog";

const PILLARS = [
  {
    n: "01",
    title: "Heritage materials",
    body: "Kannauj attar, Dhofar frankincense, Taif rose, Assam oud and Mysore sandalwood, sourced from the people who have made them for generations.",
  },
  {
    n: "02",
    title: "Composed with AI",
    body: "Our models study thousands of accords and how they behave in Gulf heat and Indian humidity, then propose formulas our perfumers refine.",
  },
  {
    n: "03",
    title: "Finished by hand",
    body: "Every bottle is macerated, filtered and filled by hand in small batches. Every bespoke blend is one of one.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMAGES.hero} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center] opacity-80" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <Aura className="absolute -left-40 top-1/4 -z-10 h-[520px] w-[520px] opacity-60" />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <p className="animate-rise text-xs uppercase tracking-[0.4em] text-gold">Perfume for the AI era</p>
          <h1 className="mt-6 max-w-3xl animate-rise font-display text-[clamp(3rem,9vw,7.5rem)] font-light leading-[0.92] [animation-delay:120ms]">
            Scent, composed by <em className="text-iridescent not-italic">intelligence</em>.
          </h1>
          <p className="mt-6 max-w-lg animate-rise text-base leading-relaxed text-ivory/75 [animation-delay:240ms] sm:text-lg">
            Heritage attar, oud and saffron from India and Arabia, composed with AI and finished by hand. Discover the fragrance that is
            only yours.
          </p>
          <div className="mt-10 flex animate-rise flex-col gap-3 [animation-delay:360ms] sm:flex-row">
            <Link href="/scent-dna" className="btn-gold rounded-full px-8 py-4 text-center text-sm font-medium tracking-wide">
              Discover your Scent DNA
            </Link>
            <Link href="/collection" className="btn-ghost rounded-full px-8 py-4 text-center text-sm tracking-wide">
              Explore the collection
            </Link>
          </div>
          <p className="font-arabic mt-12 animate-rise text-sm text-gold/70 [animation-delay:480ms]">عطرٌ يُؤلَّف بالذكاء · खुशबू, बुद्धिमत्ता से रची</p>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y hairline py-5">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-12 whitespace-nowrap font-display text-2xl text-ivory/40">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Kashmiri saffron", "Taif rose", "Mitti attar", "Hojari frankincense", "Mogra", "Assam oud", "Mysore sandalwood", "Ambergris"].map((n) => (
              <span key={n + k} className="flex items-center gap-12">
                {n} <span className="text-gold">✦</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* Collection */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">The Era Collection</p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Six signatures. One future.</h2>
          </div>
          <Link href="/collection" className="text-sm text-mist underline-offset-4 hover:text-ivory hover:underline">
            View all fragrances
          </Link>
        </Reveal>
        <div className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {FRAGRANCES.map((f, i) => (
            <div key={f.slug} className="w-[78vw] shrink-0 snap-center sm:w-auto">
              <ProductCard f={f} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Scent DNA teaser */}
      <section className="relative overflow-hidden border-y hairline bg-ink-2/50">
        <Aura className="absolute -right-40 top-0 h-[600px] w-[600px] opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-28 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Scent DNA</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] sm:text-7xl">A perfume that has never existed before.</h2>
            <p className="mt-6 max-w-md leading-relaxed text-mist">
              Six questions and one memory. Our AI perfumer maps your olfactive identity, writes a one-of-one formula with real materials,
              and our atelier blends it by hand.
            </p>
            <Link href="/scent-dna" className="btn-gold mt-10 inline-block rounded-full px-8 py-4 text-sm font-medium">
              Begin in 60 seconds
            </Link>
          </Reveal>
          <Reveal delay={150} className="grid grid-cols-5 items-end gap-3">
            {[
              ["Warm spice", 82],
              ["Resin", 64],
              ["White floral", 48],
              ["Rain", 71],
              ["Woods", 90],
            ].map(([n, v]) => (
              <div key={n as string} className="text-center">
                <div className="mx-auto flex h-64 w-full items-end overflow-hidden rounded-full bg-ivory/5">
                  <div className="w-full rounded-full bg-gradient-to-t from-gold via-[#c4a1ff] to-teal" style={{ height: `${v}%` }} />
                </div>
                <p className="mt-3 text-[10px] uppercase tracking-widest text-mist sm:text-xs">{n}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Atelier / pillars */}
      <section id="atelier" className="mx-auto max-w-7xl px-4 py-28 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.atelier} alt="The OLFAYA atelier" loading="lazy" className="aspect-[3/2] w-full rounded-[32px] object-cover" />
            <div className="glass absolute -bottom-6 left-6 right-6 rounded-2xl border hairline p-5 sm:left-auto sm:w-72">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">Atelier</p>
              <p className="mt-2 text-sm text-ivory/80">Bengaluru × Dubai. Small batches, macerated for 6 weeks.</p>
            </div>
          </Reveal>
          <div className="space-y-10 pt-6">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">The House</p>
              <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
                Olfaya: <span className="text-mist">a sign, written in scent.</span>
              </h2>
              <p className="mt-4 text-sm text-mist">
                From <em>olfactory</em> and the Arabic <span className="font-arabic">آية</span> (aya), a sign or a wonder.
              </p>
            </Reveal>
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 100} className="flex gap-6 border-t hairline pt-6">
                <span className="font-display text-2xl text-gold">{p.n}</span>
                <div>
                  <h3 className="font-display text-3xl">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">AI Concierge</p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Meet Aya.</h2>
          <p className="mt-6 max-w-md leading-relaxed text-mist">
            A private perfumer in your pocket. Ask in English, Hindi or Arabic about a wedding in Jaipur, a summer in Dubai, a gift for
            your father, or how to make oud last in 45°C.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ivory/80">
            <li>✦ Recommendations from your mood, climate and memories</li>
            <li>✦ Layering and gifting advice</li>
            <li>✦ Available 24/7 on the site and WhatsApp</li>
          </ul>
        </Reveal>
        <Reveal delay={150}>
          <Concierge />
        </Reveal>
      </section>

      {/* Discovery */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <Reveal className="relative overflow-hidden rounded-[36px] border hairline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.discovery} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
          <div className="relative max-w-xl p-8 sm:p-16">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Not sure yet?</p>
            <h2 className="mt-4 font-display text-5xl leading-none">The Era Discovery Set</h2>
            <p className="mt-4 text-mist">All six scents in 2ml vials. Wear each for a day; the price comes back as credit on your first bottle.</p>
            <Link href="/fragrance/discovery-set" className="btn-gold mt-8 inline-block rounded-full px-8 py-4 text-sm font-medium">
              Shop the Discovery Set
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
