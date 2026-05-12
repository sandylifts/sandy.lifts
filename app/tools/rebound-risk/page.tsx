import type { Metadata } from "next";
import { ReboundRiskCalculator } from "./components/ReboundRiskCalculator";

export const metadata: Metadata = {
  title: "Weight Regain Risk Calculator | Will You Regain the Weight? | Sandy.Lifts",
  description:
    "Find out your risk of regaining lost weight. Based on Sumithran 2011 NEJM — hunger hormones stay elevated for 12+ months after weight loss. Science-backed quiz to prevent rebound.",
  keywords: [
    "weight regain risk calculator", "will I regain weight after dieting", "weight rebound prevention India",
    "why do I regain weight after diet", "ghrelin weight regain India", "weight loss maintenance calculator",
    "prevent weight regain India", "yo-yo dieting risk calculator", "weight loss relapse calculator",
    "rebound weight risk India", "sandy lifts rebound risk",
  ],
  openGraph: {
    title: "Weight Regain Risk Calculator | Will You Regain the Weight? | Sandy.Lifts",
    description: "Find out your risk of regaining lost weight. Based on Sumithran 2011 NEJM.",
    url: "https://sandy-lifts.vercel.app/tools/rebound-risk",
  },
  alternates: { canonical: "https://sandy-lifts.vercel.app/tools/rebound-risk" },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Weight Regain Risk Calculator",
  description: "Science-backed quiz to assess your risk of regaining lost weight.",
  url: "https://sandy-lifts.vercel.app/tools/rebound-risk",
  applicationCategory: "HealthApplication", operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

export default function ReboundRiskPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <ReboundRiskCalculator />
      </div>
    </>
  );
}
