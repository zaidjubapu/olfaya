"use client";

import { useState } from "react";
import type { Currency } from "@/lib/catalog";
import { useStore } from "@/lib/store";

type Option = { label: string; prices: Record<Currency, number> };

export function AddToBag({ id, name, image, options }: { id: string; name: string; image?: string; options: Option[] }) {
  const { add, format, currency } = useStore();
  const [sel, setSel] = useState(0);
  const opt = options[sel];

  return (
    <div>
      {options.length > 1 && (
        <div className="flex gap-3">
          {options.map((o, i) => (
            <button
              key={o.label}
              onClick={() => setSel(i)}
              className={`flex-1 rounded-2xl border px-4 py-3 text-left transition ${i === sel ? "border-gold bg-gold/5" : "hairline hover:border-ivory/30"}`}
            >
              <span className="block text-sm">{o.label}</span>
              <span className="block text-xs text-mist">{format(o.prices[currency])}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => add({ id, name, image, variant: opt.label, prices: opt.prices })}
        className="btn-gold mt-4 w-full rounded-full py-4 text-sm font-medium tracking-wide"
      >
        Add to bag · {format(opt.prices[currency])}
      </button>
    </div>
  );
}
