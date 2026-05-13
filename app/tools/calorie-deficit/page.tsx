import type { Metadata } from "next";
import { CalorieDeficitCalculator } from "./components/CalorieDeficitCalculator";

export const metadata: Metadata = {
  title: "Calorie Deficit Calculator | Safe Fat Loss Without Muscle Loss | Sandy.Lifts",
  description:
    "Calculate your ideal calorie deficit for fat loss. Based on 2024 meta-analysis of 4,785 participants. Avoid muscle loss, metabolism slowdown, and weight rebound. Free science-backed tool.",
  keywords: [
    "calorie deficit calculator",
    "safe calorie deficit for fat loss",
    "calorie deficit without muscle loss",
    "how many calories to lose weight India",
    "fat loss calculator India",
    "calorie deficit and muscle loss",
    "minimum calories to lose fat",
    "calorie deficit per day for weight loss",
    "calorie deficit zone calculator",
    "sandy lifts calorie calculator",
  ],
  openGraph: {
    title: "Calorie Deficit Calculator | Safe Fat Loss Without Muscle Loss | Sandy.Lifts",
    description:
      "Calculate your ideal calorie deficit for fat loss. Based on 2024 meta-analysis of 4,785 participants.",
    url: "https://sandy-lifts.vercel.app/tools/calorie-deficit",
  },
  alternates: {
    canonical: "https://sandy-lifts.vercel.app/tools/calorie-deficit",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calorie Deficit Calculator",
  description:
    "Calculate your ideal calorie deficit for fat loss without muscle loss. Based on peer-reviewed research.",
  url: "https://sandy-lifts.vercel.app/tools/calorie-deficit",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

export default function CalorieDeficitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <CalorieDeficitCalculator />
      </div>
    </>
  );
}
