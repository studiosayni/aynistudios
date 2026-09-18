import "./globals.css";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PublicEnhancements from "./components/PublicEnhancements";
import FloatingBook from "./components/FloatingBook";
import { LightboxProvider } from "./components/VideoLightbox";
import { Toaster } from "react-hot-toast";
import { SITE_URL } from "./lib/publicContent";

// Four weights cover the public editorial design; no animation-only weight.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  title: {
    default: "Ayni Studios — Documentary & Impact Video Production",
    template: "%s — Ayni Studios",
  },
  description:
    "Documentary films, brand and impact content, and editing from Ayni Studios. Based in Valencia, California, serving Los Angeles and working globally.",
  openGraph: {
    type: "website",
    siteName: "Ayni Studios",
    title: "Ayni Studios — Media Forged For Our Future",
    description:
      "Documentary and impact content for the planet, humanity, and the future.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayni Studios",
    description:
      "Documentary and impact content for the planet, humanity, and the future.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={barlow.variable}>
      <body className="bg-[#080F11] text-[#DCE4EB] antialiased min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PublicEnhancements />
        <Navbar />
        <FloatingBook />

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#0C1619",
              color: "#DCE4EB",
              border: "1px solid #1b282d",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
            success: {
              iconTheme: { primary: "#FEB040", secondary: "#080F11" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />

        {/* Client provider wrapping server children — the pages stay server
            components; only the player overlay ships as client JS. */}
        <LightboxProvider>
          <main
            id="main-content"
            tabIndex={-1}
            className="font-sans relative z-10 flex-grow"
          >
            {children}
          </main>
        </LightboxProvider>

        <Footer />
      </body>
    </html>
  );
}
