import type { Metadata } from "next";
import { VisceralFatCalculator } from "./components/VisceralFatCalculator";

export const metadata: Metadata = {
  title: "Visceral Fat Calculator | Waist-to-Height Ratio Risk | Sandy.Lifts",
  description:
    "Calculate your visceral fat risk using waist-to-height ratio (WHtR). NICE 2022 guidelines + Lancet India 2023 data. No equipment needed — just a tape measure. Indian-specific risk levels included.",
  keywords: [
    "visceral fat calculator India", "waist to height ratio calculator", "WHtR calculator",
    "abdominal obesity India", "central obesity calculator", "visceral fat risk India",
    "belly fat health risk calculator", "waist circumference obesity India",
    "NFHS visceral fat", "indian belly fat risk calculator", "sandy lifts visceral fat",
  ],
  openGraph: {
    title: "Visceral Fat Calculator | Waist-to-Height Ratio Risk | Sandy.Lifts",
    description: "Calculate your visceral fat risk using WHtR. NICE 2022 + Lancet India 2023 data. Indian-specific cutoffs included.",
    url: "https://sandy-lifts.vercel.app/tools/visceral-fat",
  },
  alternates: { canonical: "https://sandy-lifts.vercel.app/tools/visceral-fat" },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Visceral Fat Risk Calculator",
  description: "Calculate visceral fat risk using waist-to-height ratio with Indian-specific cutoffs.",
  url: "https://sandy-lifts.vercel.app/tools/visceral-fat",
  applicationCategory: "HealthApplication", operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

export default function VisceralFatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <VisceralFatCalculator />
      </div>
    </>
  );
}
