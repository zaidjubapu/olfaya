"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import type { Currency } from "@/lib/catalog";

const NAV = [
  { href: "/collection", label: "Collection" },
  { href: "/scent-dna", label: "Scent DNA" },
  { href: "/concierge", label: "AI Concierge" },
  { href: "/#atelier", label: "Atelier" },
];

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "INR", label: "India · ₹" },
  { code: "AED", label: "UAE · AED" },
  { code: "SAR", label: "KSA · SAR" },
];

export function Header() {
  const { currency, setCurrency, count, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled || open ? "glass border-b hairline" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <button className="md:hidden -ml-1 p-2" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span className={`block h-px w-6 bg-ivory transition ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`mt-1.5 block h-px w-6 bg-ivory transition ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
        </button>

        <Link href="/" className="font-display text-2xl tracking-[0.35em] text-ivory" onClick={() => setOpen(false)}>
          OLFAYA
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] tracking-wide text-mist md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-gold">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <select
            aria-label="Region and currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="hidden rounded-full border hairline bg-transparent px-3 py-1.5 text-xs text-mist outline-none focus:border-gold sm:block"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-ink">
                {c.label}
              </option>
            ))}
          </select>
          <button onClick={() => setCartOpen(true)} className="relative p-2" aria-label="Open bag">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t hairline px-4 pb-6 pt-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b hairline py-4 font-display text-2xl">
              {n.label}
            </Link>
          ))}
          <div className="mt-5 flex gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`rounded-full px-3 py-1.5 text-xs ${currency === c.code ? "bg-gold text-ink" : "btn-ghost text-mist"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
