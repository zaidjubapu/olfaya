"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Currency } from "./catalog";

export type CartItem = { id: string; name: string; variant: string; image?: string; prices: Record<Currency, number>; qty: number };

type Store = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amount: number) => string;
  cart: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: string, variant: string, qty: number) => void;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
  subtotal: number;
  count: number;
};

const StoreContext = createContext<Store | null>(null);

const LOCALE: Record<Currency, string> = { INR: "en-IN", AED: "en-AE", SAR: "en-SA" };

function guessCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Riyadh") return "SAR";
    if (/Asia\/(Dubai|Muscat|Qatar|Bahrain|Kuwait)/.test(tz)) return "AED";
  } catch {}
  return "INR";
}

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Hydrate from the browser after mount so server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrencyState(read<Currency | null>("olfaya.currency", null) ?? guessCurrency());
    setCart(read<CartItem[]>("olfaya.cart", []));
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    write("olfaya.currency", c);
  }, []);

  const updateCart = useCallback((fn: (c: CartItem[]) => CartItem[]) => {
    setCart((prev) => {
      const next = fn(prev);
      write("olfaya.cart", next);
      return next;
    });
  }, []);

  const add = useCallback(
    (item: Omit<CartItem, "qty">) => {
      updateCart((c) => {
        const hit = c.find((x) => x.id === item.id && x.variant === item.variant);
        if (hit) return c.map((x) => (x === hit ? { ...x, qty: x.qty + 1 } : x));
        return [...c, { ...item, qty: 1 }];
      });
      setCartOpen(true);
    },
    [updateCart],
  );

  const setQty = useCallback(
    (id: string, variant: string, qty: number) =>
      updateCart((c) =>
        qty <= 0 ? c.filter((x) => !(x.id === id && x.variant === variant)) : c.map((x) => (x.id === id && x.variant === variant ? { ...x, qty } : x)),
      ),
    [updateCart],
  );

  const value = useMemo<Store>(() => {
    const fmt = new Intl.NumberFormat(LOCALE[currency], { style: "currency", currency, maximumFractionDigits: 0 });
    return {
      currency,
      setCurrency,
      format: (n) => fmt.format(n),
      cart,
      add,
      setQty,
      cartOpen,
      setCartOpen,
      subtotal: cart.reduce((s, i) => s + i.prices[currency] * i.qty, 0),
      count: cart.reduce((s, i) => s + i.qty, 0),
    };
  }, [currency, setCurrency, cart, add, setQty, cartOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
