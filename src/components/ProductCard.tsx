"use client";

import Link from "next/link";
import type { Fragrance } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function ProductCard({ f, index = 0 }: { f: Fragrance; index?: number }) {
  const { format, currency } = useStore();
  return (
    <Link
      href={`/fragrance/${f.slug}`}
      className="card-sheen group block animate-rise"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ink-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={f.image}
          alt={`${f.name} by OLFAYA`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div
          className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-40 blur-3xl transition group-hover:opacity-70"
          style={{ background: f.accent }}
        />
        <span className="absolute left-4 top-4 rounded-full border border-ivory/20 bg-ink/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur">
          {f.family}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-arabic text-xs text-gold/80">{f.arabicName}</p>
          <h3 className="font-display text-3xl leading-none">{f.name}</h3>
          <p className="mt-2 text-xs text-mist">{f.tagline}</p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-ivory/70">{f.notes.heart.slice(0, 2).join(" · ")}</span>
            <span className="text-gold">from {format(f.prices["50ml"][currency])}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
