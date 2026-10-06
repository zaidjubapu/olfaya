"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { FRAGRANCES, type Family } from "@/lib/catalog";

const FAMILIES: ("all" | Family)[] = ["all", "amber", "fresh", "woody", "floral", "oud", "gourmand"];

export function CollectionGrid() {
  const [family, setFamily] = useState<"all" | Family>("all");
  const list = family === "all" ? FRAGRANCES : FRAGRANCES.filter((f) => f.family === family);

  return (
    <>
      <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FAMILIES.map((f) => (
          <button
            key={f}
            onClick={() => setFamily(f)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm capitalize transition ${family === f ? "bg-gold text-ink" : "btn-ghost text-mist"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f, i) => (
          <ProductCard key={f.slug} f={f} index={i} />
        ))}
      </div>
    </>
  );
}
