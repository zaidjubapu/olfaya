import { BESPOKE, DISCOVERY_SET, FRAGRANCES, type Currency } from "@/lib/catalog";

type Line = { id: string; variant: string; qty: number };
type Body = {
  currency: Currency;
  items: Line[];
  customer: { name: string; email: string; phone: string; address: string; city: string; country: string };
  payment: "online" | "cod";
};

// Prices are always recomputed on the server from the catalog; client totals are ignored.
function unitPrice(line: Line, currency: Currency): number | null {
  if (line.id === DISCOVERY_SET.slug) return DISCOVERY_SET.prices[currency];
  if (line.id.startsWith("bespoke-")) return BESPOKE.prices[currency];
  const f = FRAGRANCES.find((x) => x.slug === line.id);
  if (!f) return null;
  const size = line.variant === "100ml" ? "100ml" : "50ml";
  return f.prices[size][currency];
}

const FREE_SHIPPING: Record<Currency, number> = { INR: 5000, AED: 250, SAR: 260 };
const SHIPPING: Record<Currency, number> = { INR: 149, AED: 20, SAR: 20 };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { currency, items, customer, payment } = body;
  if (!["INR", "AED", "SAR"].includes(currency)) return Response.json({ error: "Unsupported currency" }, { status: 400 });
  if (!Array.isArray(items) || !items.length || items.length > 30) return Response.json({ error: "Empty bag" }, { status: 400 });
  if (!customer?.name || !/^\S+@\S+\.\S+$/.test(customer.email ?? "") || !customer.phone || !customer.address) {
    return Response.json({ error: "Please complete your contact and delivery details" }, { status: 400 });
  }

  let subtotal = 0;
  for (const line of items) {
    const p = unitPrice(line, currency);
    const qty = Math.floor(Number(line.qty));
    if (p === null || !(qty >= 1 && qty <= 10)) return Response.json({ error: `Unknown item ${line.id}` }, { status: 400 });
    subtotal += p * qty;
  }
  const shipping = subtotal >= FREE_SHIPPING[currency] ? 0 : SHIPPING[currency];
  const total = subtotal + shipping;
  const orderId = `OLF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // Online payment: Razorpay handles INR (UPI, cards, netbanking) and also AED/SAR cards.
  // Swap in Tap or Stripe for GCC wallets later; the order shape stays the same.
  let razorpayOrder: { id: string; amount: number; currency: string } | null = null;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (payment === "online" && keyId && keySecret) {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` },
      body: JSON.stringify({ amount: total * 100, currency, receipt: orderId }),
    });
    if (!res.ok) return Response.json({ error: "Payment provider unavailable, please try cash on delivery" }, { status: 502 });
    razorpayOrder = await res.json();
  }

  const order = { orderId, currency, items, subtotal, shipping, total, payment, customer, createdAt: new Date().toISOString() };

  // Forward to an ops webhook (Slack, Google Sheets via Apps Script, Zapier) if configured.
  if (process.env.ORDER_WEBHOOK_URL) {
    await fetch(process.env.ORDER_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) }).catch(
      (e) => console.error("order webhook failed", e),
    );
  } else {
    console.log("order", JSON.stringify(order));
  }

  return Response.json({
    orderId,
    subtotal,
    shipping,
    total,
    razorpay: razorpayOrder ? { keyId, orderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency } : null,
  });
}
