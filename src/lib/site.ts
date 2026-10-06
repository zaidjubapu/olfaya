// Public origin for absolute URLs (sitemap, share previews). Set NEXT_PUBLIC_SITE_URL in Vercel
// once the olfaya domain is bought; until then the public Vercel hostname is used.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://olfaya-azure.vercel.app").replace(/\/$/, "");
