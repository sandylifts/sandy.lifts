import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#07090D",
  colorScheme: "dark",
};

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
  alternates: {
    canonical: "https://sandy-lifts.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://sandy-lifts.vercel.app",
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
    <html lang="en" className={outfit.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-ink text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#C3FCFE] focus:text-[#05050B] focus:font-bold"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
