"use client";

import { useState } from "react";

// Posts as JSON so the visitor stays on the page; the plain form action still works without JavaScript.
export function SubscribeForm() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setState(res?.ok ? "done" : "error");
  }

  if (state === "done") return <p className="mt-8 text-sm text-gold">You are on the list. We will write before anyone else hears.</p>;

  return (
    <form onSubmit={submit} className="mt-8 flex max-w-sm flex-wrap gap-2" action="/api/subscribe" method="post">
      <input
        type="email"
        name="email"
        required
        placeholder="Email for early access"
        className="min-w-0 flex-1 rounded-full border hairline bg-transparent px-4 py-3 text-sm outline-none placeholder:text-mist/60 focus:border-gold"
      />
      <button disabled={state === "busy"} className="btn-gold shrink-0 rounded-full px-5 text-sm font-medium disabled:opacity-50">
        Join
      </button>
      {state === "error" && <p className="w-full text-xs text-red-300">That did not go through. Please check the email and try again.</p>}
    </form>
  );
}
