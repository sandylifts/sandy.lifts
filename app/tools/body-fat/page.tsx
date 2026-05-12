import type { Metadata } from "next";
import { BodyFatCalculator } from "./components/BodyFatCalculator";

export const metadata: Metadata = {
  title: "Body Fat Percentage Calculator | Navy Method | Sandy.Lifts",
  description: "Calculate your body fat percentage using the US Navy circumference method (Hodgdon & Beckett 1984), validated within ±3–4% of DEXA scanning. No gym equipment needed — just a tape measure. Indian fitness categories included.",
  keywords: ["body fat percentage calculator India","navy method body fat calculator","body fat calculator without equipment","how to measure body fat at home India","body fat percentage healthy range India","body fat calculator men women","body fat percentage fitness categories","body composition calculator India","tape measure body fat calculator","hodgdon beckett body fat formula","body fat percentage chart India","sandy lifts body fat calculator"],
  openGraph: { title: "Body Fat Percentage Calculator | Navy Method | Sandy.Lifts", description: "US Navy circumference method — accurate within ±3–4% of DEXA. Just a tape measure.", url: "https://sandy-lifts.vercel.app/tools/body-fat" },
  alternates: { canonical: "https://sandy-lifts.vercel.app/tools/body-fat" },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Body Fat Percentage Calculator", applicationCategory: "HealthApplication",
  description: "US Navy circumference method body fat calculator",
  url: "https://sandy-lifts.vercel.app/tools/body-fat",
  featureList: ["Navy Method formula","Gender-specific calculation","Indian fitness categories","Free tool"],
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

const FAQS = [
  { q: "What is a healthy body fat percentage for Indian men and women?", a: "For Indian men, healthy body fat is 14–24%. Athletic men are 6–13%. For Indian women, healthy is 21–31%, athletic is 14–20%. South Asians may carry more visceral fat at equivalent body fat levels — use this alongside your waist-to-height ratio." },
  { q: "How accurate is the Navy method body fat calculator?", a: "The US Navy circumference method (Hodgdon & Beckett 1984) has been validated within ±3–4% of DEXA scanning, the clinical gold standard. A 2022 study in Military Medicine confirmed this against DEXA in a large military population." },
  { q: "What is the difference between body fat % and BMI?", a: "BMI tells you your weight relative to height — it cannot distinguish muscle from fat. Body fat percentage tells you exactly how much of your weight is fat versus lean mass. Two people can have the same BMI but very different body compositions and health risks." },
  { q: "How do I measure body fat at home without equipment?", a: "Use a soft measuring tape. Measure neck just below the larynx, waist at navel level (men) or narrowest point (women), and hips at the widest point (women). Enter these measurements in the calculator above for your Navy Method estimate." },
];

export default function BodyFatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <h1 className="sr-only">Body Fat Percentage Calculator — Navy Method</h1>
        <BodyFatCalculator />
        <section style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.25rem 5rem" }}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem" }}>
            <h2 className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-6" style={{ color: "#4B5265" }}>Frequently Asked Questions</h2>
            {FAQS.map((item, i) => (
              <details key={i} style={{ marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
                <summary style={{ color: "#F2F4F8", fontSize: "14px", fontWeight: 500, cursor: "pointer", listStyle: "none" }}>{item.q}</summary>
                <p style={{ color: "#8B92A5", fontSize: "13px", lineHeight: "1.7", marginTop: "0.5rem" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
