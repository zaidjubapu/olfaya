"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Concierge } from "./Concierge";

export function ConciergeBubble() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  if (path === "/concierge") return null;

  return (
    <>
      <div
        className={`fixed bottom-24 right-4 z-40 h-[min(620px,75vh)] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right transition-all duration-500 sm:right-6 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
      >
        {open && <Concierge compact />}
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close concierge" : "Ask Aya, the AI concierge"}
        className="group fixed bottom-6 right-4 z-40 flex items-center gap-3 rounded-full border border-gold/30 bg-ink-2/90 py-2 pl-2 pr-5 shadow-[0_10px_50px_-10px_rgba(139,92,246,0.5)] backdrop-blur sm:right-6"
      >
        <span className="relative grid h-10 w-10 place-items-center">
          <span className="absolute inset-0 animate-drift rounded-full bg-[conic-gradient(from_0deg,#f0d9a8,#c4a1ff,#5ec8c0,#f0d9a8)] blur-[3px]" />
          <span className="relative font-display text-xl text-ink">{open ? "×" : "A"}</span>
        </span>
        <span className="text-sm">{open ? "Close" : "Ask Aya"}</span>
      </button>
    </>
  );
}
