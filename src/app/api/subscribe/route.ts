export async function POST(req: Request) {
  const type = req.headers.get("content-type") ?? "";
  let email: unknown;
  try {
    email = type.includes("application/json") ? (await req.json())?.email : (await req.formData()).get("email");
  } catch {
    return Response.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (process.env.SUBSCRIBE_WEBHOOK_URL) {
    await fetch(process.env.SUBSCRIBE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, at: new Date().toISOString() }),
    }).catch((e) => console.error("subscribe webhook failed", e));
  } else {
    console.log("subscribe", email);
  }
  // Plain form posts come back to the home page with a thank-you flag.
  if (!type.includes("application/json")) return Response.redirect(new URL("/?subscribed=1", req.url), 303);
  return Response.json({ ok: true });
}
