import type { Metadata } from "next";
import { ProteinCalculator } from "./components/ProteinCalculator";

export const metadata: Metadata = {
  title: "Protein Calculator India | How Much Protein Do You Need? | Sandy.Lifts",
  description: "Calculate your daily protein target based on Morton 2018 meta-analysis and ISSN guidelines. Vegetarian and non-vegetarian Indian food sources included. Goal-based: fat loss, muscle gain, or maintenance. Free science-backed tool.",
  keywords: ["protein calculator India","how much protein do I need per day India","protein intake calculator kg body weight","daily protein requirement India","protein for muscle gain India","protein for fat loss India","vegetarian protein sources India calculator","ICMR protein recommendation India","how much protein per day India","protein target calculator Indian diet","protein grams per kg body weight India","sandy lifts protein calculator"],
  openGraph: { title: "Protein Calculator India | How Much Protein Do You Need? | Sandy.Lifts", description: "Evidence-based protein calculator with Indian vegetarian food sources. Morton 2018 + ISSN guidelines.", url: "https://sandy-lifts.vercel.app/tools/protein-target" },
  alternates: { canonical: "https://sandy-lifts.vercel.app/tools/protein-target" },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Protein Intake Calculator for Indians", applicationCategory: "HealthApplication",
  description: "Evidence-based daily protein calculator with Indian vegetarian food sources",
  url: "https://sandy-lifts.vercel.app/tools/protein-target",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

const FAQS = [
  { q: "How much protein do I need per day in India?", a: "For active Indians, the evidence-based target is 1.6–2.2g per kg of body weight per day (Morton et al. 2018). ICMR's 0.8–1g/kg is a minimum to prevent deficiency — not a target for people who exercise. A 70kg person should aim for 112–154g/day." },
  { q: "Is 1g per kg enough protein for muscle gain?", a: "No. The Morton 2018 meta-analysis of 1,863 participants found that muscle protein synthesis maximises at approximately 1.62g/kg/day. At 1g/kg, you are below the threshold needed to build muscle optimally. For fat loss, aim even higher — around 2g/kg — to preserve muscle." },
  { q: "What are the best vegetarian protein sources in India?", a: "The best vegetarian protein sources available in India are: paneer (18g/100g), soya chunks (15g/30g dry), moong dal cooked (14g/katori), rajma (13g/katori), Greek yogurt/hung curd (10g/100g), tofu (10g/100g), and whole milk (8g/glass). Dal at lunch + paneer or soya at dinner covers 50–60g easily." },
  { q: "Should I calculate protein based on body weight or lean mass?", a: "If you know your body fat percentage, calculating protein on lean mass is more accurate — especially for people with higher body fat. For example, if you weigh 85kg but have 25% body fat, your lean mass is 64kg. At 2g/kg lean mass, you need 128g — not 170g. This calculator handles both cases." },
];

export default function ProteinTargetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <h1 className="sr-only">Protein Calculator for Indians — Science-Backed Daily Target</h1>
        <ProteinCalculator />
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
