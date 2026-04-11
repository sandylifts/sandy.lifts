import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sandy.Lifts — Your Premium Fitness Hub",
    template: "%s | Sandy.Lifts",
  },
  description:
    "AI-powered fitness tools, workout plans, diet coaching, and a thriving community. Your one-stop premium fitness hub.",
  keywords: [
    "fitness",
    "workout",
    "diet",
    "AI coach",
    "macro calculator",
    "body transformation",
    "Sandy.Lifts",
  ],
  authors: [{ name: "Sandy.Lifts" }],
  creator: "Sandy.Lifts",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://sandy.lifts",
    siteName: "Sandy.Lifts",
    title: "Sandy.Lifts — Your Premium Fitness Hub",
    description:
      "AI-powered fitness tools, workout plans, diet coaching, and a thriving community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandy.Lifts — Your Premium Fitness Hub",
    description:
      "AI-powered fitness tools, workout plans, diet coaching, and a thriving community.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-ink text-text-primary antialiased" style={{ backgroundColor: "#05050B", color: "#D8DBFC", fontFamily: "Outfit, Inter, system-ui, sans-serif" }}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
