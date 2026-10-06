"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";

type Result = { orderId: string; total: number; razorpay: { keyId: string; orderId: string; amount: number; currency: string } | null };

type RazorpayCheckout = { open: () => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayCheckout;
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const COUNTRIES = ["India", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"];

export default function CheckoutPage() {
  const { cart, currency, format, subtotal, setQty } = useStore();
  const [payment, setPayment] = useState<"online" | "cod">("online");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Result | null>(null);

  const freeAt = currency === "INR" ? 5000 : currency === "AED" ? 250 : 260;
  const shipping = subtotal >= freeAt ? 0 : currency === "INR" ? 149 : 20;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const customer = Object.fromEntries(["name", "email", "phone", "address", "city", "country"].map((k) => [k, String(fd.get(k) ?? "")]));
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency, payment, customer, items: cart.map((i) => ({ id: i.id, variant: i.variant, qty: i.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setDone(data);
      for (const i of cart) setQty(i.id, i.variant, 0);
      if (data.razorpay && (await loadRazorpay()) && window.Razorpay) {
        new window.Razorpay({
          key: data.razorpay.keyId,
          order_id: data.razorpay.orderId,
          amount: data.razorpay.amount,
          currency: data.razorpay.currency,
          name: "OLFAYA",
          description: `Order ${data.orderId}`,
          prefill: { name: customer.name, email: customer.email, contact: customer.phone },
          theme: { color: "#E8B86B" },
        }).open();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="mx-auto max-w-xl px-4 pb-10 pt-40 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Thank you · شكراً · धन्यवाद</p>
        <h1 className="mt-4 font-display text-6xl">Order received</h1>
        <p className="mt-4 text-mist">
          Order <span className="text-ivory">{done.orderId}</span> for {format(done.total)}.{" "}
          {done.razorpay ? "Complete payment in the window that opens." : "Our concierge will confirm on WhatsApp shortly."}
        </p>
        <Link href="/" className="btn-ghost mt-10 inline-block rounded-full px-6 py-3 text-sm">
          Back to OLFAYA
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-10 pt-28 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={submit} className="space-y-6">
        <h1 className="font-display text-5xl">Checkout</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Mobile (WhatsApp)", "tel"],
            ["city", "City", "text"],
          ].map(([n, l, t]) => (
            <input key={n} name={n} type={t} required placeholder={l} className="rounded-2xl border hairline bg-ink-2/60 px-4 py-3.5 text-sm outline-none focus:border-gold" />
          ))}
          <textarea name="address" required rows={3} placeholder="Delivery address" className="rounded-2xl border hairline bg-ink-2/60 px-4 py-3.5 text-sm outline-none focus:border-gold sm:col-span-2" />
          <select name="country" defaultValue={currency === "INR" ? "India" : currency === "SAR" ? "Saudi Arabia" : "United Arab Emirates"} className="rounded-2xl border hairline bg-ink-2/60 px-4 py-3.5 text-sm outline-none focus:border-gold sm:col-span-2">
            {COUNTRIES.map((c) => (
              <option key={c} className="bg-ink">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-mist">Payment</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["online", "Pay online", currency === "INR" ? "UPI, cards, netbanking" : "Debit and credit cards"],
              ["cod", "Cash on delivery", "Confirmed on WhatsApp"],
            ].map(([v, l, h]) => (
              <button
                type="button"
                key={v}
                onClick={() => setPayment(v as "online" | "cod")}
                className={`rounded-2xl border p-4 text-left transition ${payment === v ? "border-gold bg-gold/5" : "hairline"}`}
              >
                <span className="block text-sm">{l}</span>
                <span className="block text-xs text-mist">{h}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}
        <button disabled={busy || !cart.length} className="btn-gold w-full rounded-full py-4 text-sm font-medium disabled:opacity-50">
          {busy ? "Placing order…" : `Place order · ${format(subtotal + shipping)}`}
        </button>
      </form>

      <aside className="h-fit rounded-3xl border hairline bg-ink-2/60 p-6 lg:sticky lg:top-24">
        <p className="font-display text-2xl">Summary</p>
        {cart.length === 0 ? (
          <p className="mt-4 text-sm text-mist">
            Your bag is empty. <Link href="/collection" className="text-gold">Explore the collection</Link>
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {cart.map((i) => (
              <li key={i.id + i.variant} className="flex justify-between gap-4 text-sm">
                <span>
                  {i.name} <span className="text-mist">· {i.variant} × {i.qty}</span>
                </span>
                <span>{format(i.prices[currency] * i.qty)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 space-y-2 border-t hairline pt-4 text-sm">
          <div className="flex justify-between text-mist">
            <span>Shipping</span>
            <span>{shipping ? format(shipping) : "Complimentary"}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Total</span>
            <span>{format(subtotal + shipping)}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
