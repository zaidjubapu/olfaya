import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t hairline">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl tracking-[0.3em]">OLFAYA</p>
          <p className="font-arabic mt-2 text-lg text-gold">أولفايا</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
            Perfume for the AI era. Heritage materials from Kannauj to Dhofar, composed with intelligence and finished by hand.
          </p>
          <form className="mt-8 flex max-w-sm gap-2" action="/api/subscribe" method="post">
            <input
              type="email"
              name="email"
              required
              placeholder="Email for early access"
              className="w-full rounded-full border hairline bg-transparent px-4 py-3 text-sm outline-none placeholder:text-mist/60 focus:border-gold"
            />
            <button className="btn-gold shrink-0 rounded-full px-5 text-sm font-medium">Join</button>
          </form>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gold">Explore</p>
          <ul className="space-y-3 text-mist">
            <li><Link href="/collection" className="hover:text-ivory">The Collection</Link></li>
            <li><Link href="/scent-dna" className="hover:text-ivory">Scent DNA & Bespoke</Link></li>
            <li><Link href="/concierge" className="hover:text-ivory">AI Concierge</Link></li>
            <li><Link href="/fragrance/discovery-set" className="hover:text-ivory">Discovery Set</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gold">Care</p>
          <ul className="space-y-3 text-mist">
            <li>Free shipping over ₹5,000 · AED 250</li>
            <li>Cash on delivery in India & GCC</li>
            <li>14-day returns on sealed bottles</li>
            <li>WhatsApp concierge, 10am to 10pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-6 text-xs text-mist/70 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} OLFAYA. Bengaluru · Dubai.</p>
          <p>Composed with AI. Blended by hand.</p>
        </div>
      </div>
    </footer>
  );
}
