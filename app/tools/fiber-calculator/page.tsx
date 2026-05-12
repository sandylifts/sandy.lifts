import type { Metadata } from "next";
import { FiberCalculator } from "./components/FiberCalculator";

export const metadata: Metadata = {
  title: "Daily Fiber Calculator for Indians | ICMR 2024 Guidelines | Sandy.Lifts",
  description:
    "Calculate your daily fiber requirement based on ICMR-NIN 2024 dietary guidelines. Indian food sources included — dal, sabzi, whole grains, fruits. Fiber for fat loss, gut health, and satiety.",
  keywords: [
    "fiber intake calculator India", "daily fiber requirement India", "ICMR fiber recommendation",
    "dietary fiber for weight loss India", "fiber foods India list", "fiber calculator Indian diet",
    "how much fiber per day India", "fiber for fat loss India", "gut health fiber India",
    "sandy lifts fiber calculator",
  ],
  openGraph: {
    title: "Daily Fiber Calculator for Indians | ICMR 2024 Guidelines | Sandy.Lifts",
    description: "Calculate your daily fiber requirement based on ICMR-NIN 2024 dietary guidelines with Indian food sources.",
    url: "https://sandy-lifts.vercel.app/tools/fiber-calculator",
  },
  alternates: { canonical: "https://sandy-lifts.vercel.app/tools/fiber-calculator" },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Daily Fiber Calculator for Indians",
  description: "Calculate your daily fiber target using ICMR-NIN 2024 guidelines with Indian food sources.",
  url: "https://sandy-lifts.vercel.app/tools/fiber-calculator",
  applicationCategory: "HealthApplication", operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

export default function FiberCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <FiberCalculator />
      </div>
    </>
  );
}
