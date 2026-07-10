import "./globals.css";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ParticleField from "./components/ParticleField";
import { Toaster } from "react-hot-toast";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://ayni-studios.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ayni Studios — Media Forged For Our Future",
    template: "%s — Ayni Studios",
  },
  description:
    "Ayni Studios is a media studio producing documentary and impact content for the planet, humanity, and the future.",
  openGraph: {
    type: "website",
    siteName: "Ayni Studios",
    title: "Ayni Studios — Media Forged For Our Future",
    description:
      "Documentary and impact content for the planet, humanity, and the future.",
    url: BASE_URL,
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
        <ParticleField />
        <Navbar />

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

        <main className="font-sans relative z-10 flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
