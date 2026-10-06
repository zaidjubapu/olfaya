"use client";

import { useEffect, useRef } from "react";

// Iridescent "scent aura" that follows the pointer. Pure CSS + rAF, no canvas.
export function Aura({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 60;
      ty = (e.clientY / window.innerHeight - 0.5) * 60;
    };
    const loop = () => {
      x += (tx - x) * 0.05;
      y += (ty - y) * 0.05;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none ${className}`}>
      <div className="h-full w-full animate-drift rounded-full bg-[conic-gradient(from_90deg,rgba(240,217,168,.55),rgba(196,161,255,.45),rgba(94,200,192,.4),rgba(240,217,168,.55))] blur-[90px]" />
    </div>
  );
}
