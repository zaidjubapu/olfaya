"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, subtotal, format, currency } = useStore();
  const freeAt = currency === "INR" ? 5000 : currency === "AED" ? 250 : 260;
  const remaining = Math.max(0, freeAt - subtotal);

  return (
    <div className={`fixed inset-0 z-50 ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      <div
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${cartOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l hairline bg-ink-2 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <p className="font-display text-2xl">Your Bag</p>
          <button onClick={() => setCartOpen(false)} className="text-sm text-mist hover:text-ivory">Close</button>
        </div>

        <div className="px-6 pt-4">
          <p className="text-xs text-mist">
            {remaining > 0 ? <>Add {format(remaining)} more for complimentary shipping.</> : <>You have unlocked complimentary shipping.</>}
          </p>
          <div className="mt-2 h-px w-full bg-ivory/10">
            <div className="h-px bg-gold transition-all" style={{ width: `${Math.min(100, (subtotal / freeAt) * 100)}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="font-display text-3xl">Nothing here yet</p>
                <p className="mt-2 text-sm text-mist">Let Aya, our AI concierge, find your scent.</p>
                <Link href="/concierge" onClick={() => setCartOpen(false)} className="btn-ghost mt-6 inline-block rounded-full px-5 py-2.5 text-sm">
                  Talk to Aya
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((i) => (
                <li key={i.id + i.variant} className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {i.image ? <img src={i.image} alt="" className="h-24 w-20 rounded-lg object-cover" /> : <div className="h-24 w-20 rounded-lg bg-ink-3" />}
                  <div className="flex-1">
                    <p className="font-display text-xl leading-tight">{i.name}</p>
                    <p className="text-xs text-mist">{i.variant}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border hairline px-3 py-1 text-sm">
                        <button onClick={() => setQty(i.id, i.variant, i.qty - 1)} aria-label="Decrease">−</button>
                        <span className="w-4 text-center">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.variant, i.qty + 1)} aria-label="Increase">+</button>
                      </div>
                      <p className="text-sm">{format(i.prices[currency] * i.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t hairline px-6 py-5">
            <div className="flex justify-between text-sm">
              <span className="text-mist">Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-gold mt-4 block rounded-full py-3.5 text-center text-sm font-medium tracking-wide"
            >
              Checkout
            </Link>
            <p className="mt-3 text-center text-[11px] text-mist/70">UPI, cards and cash on delivery</p>
          </div>
        )}
      </aside>
    </div>
  );
}
