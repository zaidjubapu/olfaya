import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ConciergeBubble } from "@/components/ConciergeBubble";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://olfaya.com"),
  title: { default: "OLFAYA | Perfume for the AI Era", template: "%s | OLFAYA" },
  description:
    "OLFAYA is a luxury perfume house for India and the Gulf. Heritage attar, oud and saffron, composed with AI and finished by hand. Find your Scent DNA.",
  openGraph: {
    title: "OLFAYA | Perfume for the AI Era",
    description: "Heritage materials, composed with intelligence. Discover your Scent DNA.",
    images: ["https://d8j0ntlcm91z4.cloudfront.net/user_3KGId1jDoOH29BoOzLxz2b99gjp/hf_20261005_232633_aa782761-9c7b-45e5-9231-dd239b7f684e.png"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0a0910" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Manrope:wght@300;400;500;600&family=Noto+Kufi+Arabic:wght@300;400&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <ConciergeBubble />
        </StoreProvider>
      </body>
    </html>
  );
}
