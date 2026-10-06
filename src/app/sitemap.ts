import type { MetadataRoute } from "next";
import { DISCOVERY_SET, FRAGRANCES } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/collection", "/scent-dna", "/concierge", ...[...FRAGRANCES.map((f) => f.slug), DISCOVERY_SET.slug].map((s) => `/fragrance/${s}`)];
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly", priority: p ? 0.7 : 1 }));
}
