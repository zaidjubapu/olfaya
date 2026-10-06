import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/AddToBag";
import { ProductCard } from "@/components/ProductCard";
import { DISCOVERY_SET, FRAGRANCES, getFragrance } from "@/lib/catalog";

export function generateStaticParams() {
  return [...FRAGRANCES.map((f) => ({ slug: f.slug })), { slug: DISCOVERY_SET.slug }];
}

export async function generateMetadata(props: PageProps<"/fragrance/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  if (slug === DISCOVERY_SET.slug) return { title: DISCOVERY_SET.name, description: DISCOVERY_SET.description };
  const f = getFragrance(slug);
  if (!f) return {};
  return { title: f.name, description: `${f.tagline} ${f.story}`, openGraph: { images: [f.image] } };
}

const SILLAGE = { intimate: 1, moderate: 2, strong: 3 };

export default async function FragrancePage(props: PageProps<"/fragrance/[slug]">) {
  const { slug } = await props.params;

  if (slug === DISCOVERY_SET.slug) {
    return (
      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-10 pt-28 sm:px-8 lg:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DISCOVERY_SET.image} alt={DISCOVERY_SET.name} className="aspect-[4/5] w-full rounded-[32px] object-cover" />
        <div className="lg:pt-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Discovery</p>
          <h1 className="mt-4 font-display text-6xl leading-none">{DISCOVERY_SET.name}</h1>
          <p className="mt-6 text-lg text-mist">{DISCOVERY_SET.description}</p>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {FRAGRANCES.map((f) => (
              <li key={f.slug} className="rounded-2xl border hairline px-4 py-3">
                <span className="font-display text-lg">{f.name}</span>
                <span className="block text-xs text-mist">{f.family}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <AddToBag id={DISCOVERY_SET.slug} name={DISCOVERY_SET.name} image={DISCOVERY_SET.image} options={[{ label: "6 × 2ml", prices: DISCOVERY_SET.prices }]} />
          </div>
        </div>
      </section>
    );
  }

  const f = getFragrance(slug);
  if (!f) notFound();
  const others = FRAGRANCES.filter((x) => x.slug !== f.slug).slice(0, 3);
  const bars: [string, number][] = [
    ["Warmth", f.profile.warmth],
    ["Freshness", f.profile.freshness],
    ["Sweetness", f.profile.sweetness],
    ["Depth", f.profile.depth],
    ["Florality", f.profile.florality],
  ];

  return (
    <>
      <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-24 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative lg:sticky lg:top-24 lg:self-start">
          <div className="absolute inset-10 -z-10 rounded-full opacity-50 blur-[100px]" style={{ background: f.accent }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.image} alt={`${f.name} by OLFAYA`} className="aspect-[4/5] w-full rounded-[32px] object-cover" />
        </div>

        <div className="lg:pt-12">
          <Link href="/collection" className="text-xs text-mist hover:text-ivory">
            ← Collection
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold">
            {f.concentration} · {f.origin}
          </p>
          <h1 className="mt-3 font-display text-6xl leading-none sm:text-7xl">{f.name}</h1>
          <p className="font-arabic mt-2 text-xl text-gold/80">{f.arabicName}</p>
          <p className="mt-6 font-display text-2xl italic text-ivory/90">{f.tagline}</p>
          <p className="mt-4 leading-relaxed text-mist">{f.story}</p>

          <div className="mt-10">
            <AddToBag
              id={f.slug}
              name={f.name}
              image={f.image}
              options={[
                { label: "50ml", prices: f.prices["50ml"] },
                { label: "100ml", prices: f.prices["100ml"] },
              ]}
            />
            <p className="mt-3 text-center text-xs text-mist">Free shipping over ₹5,000 / AED 250 · Cash on delivery · Gift wrapped</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border hairline bg-ivory/10 sm:grid-cols-3">
            {(["top", "heart", "base"] as const).map((k) => (
              <div key={k} className="bg-ink p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{k} notes</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {f.notes[k].map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border hairline p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-mist">AI olfactive profile</p>
            <div className="mt-5 space-y-3">
              {bars.map(([label, v]) => (
                <div key={label} className="grid grid-cols-[90px_1fr] items-center gap-4 text-sm">
                  <span className="text-mist">{label}</span>
                  <div className="h-1 rounded-full bg-ivory/5">
                    <div className="h-1 rounded-full bg-gradient-to-r from-gold to-[#c4a1ff]" style={{ width: `${v * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t hairline pt-5 text-center text-sm">
              <div>
                <p className="font-display text-3xl">{f.longevityHours}h</p>
                <p className="text-xs text-mist">Longevity</p>
              </div>
              <div>
                <p className="font-display text-3xl">{"●".repeat(SILLAGE[f.sillage])}<span className="text-ivory/20">{"●".repeat(3 - SILLAGE[f.sillage])}</span></p>
                <p className="text-xs capitalize text-mist">{f.sillage} sillage</p>
              </div>
              <div>
                <p className="font-display text-3xl capitalize">{f.season[0]}</p>
                <p className="text-xs text-mist">Best season</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[...f.moods, ...f.occasions].map((t) => (
              <span key={t} className="rounded-full border hairline px-3 py-1 text-xs capitalize text-mist">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <h2 className="font-display text-4xl">You may also love</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {others.map((o, i) => (
            <ProductCard key={o.slug} f={o} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
