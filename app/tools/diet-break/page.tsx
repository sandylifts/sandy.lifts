import type { Metadata } from "next";
import { DietBreakCalculator } from "./components/DietBreakCalculator";

export const metadata: Metadata = {
  title: "Diet Break Calculator | When to Take a Break from Dieting | Sandy.Lifts",
  description:
    "Science-backed tool to know when to take a diet break. Based on the MATADOR study (Byrne 2017) — intermittent restriction loses 47% more fat than continuous dieting. Beat adaptive thermogenesis.",
  keywords: [
    "diet break calculator", "when to take a break from dieting", "intermittent energy restriction calculator",
    "MATADOR study diet break", "adaptive thermogenesis diet", "diet break weight loss India",
    "calorie break schedule", "diet plateau calculator", "metabolism reset diet break",
    "refeed week calculator India", "sandy lifts diet break",
  ],
  openGraph: {
    title: "Diet Break Calculator | When to Take a Break from Dieting | Sandy.Lifts",
    description: "Science-backed diet break timing. MATADOR study — intermittent restriction loses 47% more fat.",
    url: "https://sandy-lifts.vercel.app/tools/diet-break",
  },
  alternates: { canonical: "https://sandy-lifts.vercel.app/tools/diet-break" },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Diet Break Calculator",
  description: "Science-backed tool to know when to take a diet break based on the MATADOR study.",
  url: "https://sandy-lifts.vercel.app/tools/diet-break",
  applicationCategory: "HealthApplication", operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

export default function DietBreakPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <DietBreakCalculator />
      </div>
    </>
  );
}
