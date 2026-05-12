import type { Metadata } from "next";
import { CaloriesByHeightCalculator } from "./components/CaloriesByHeightCalculator";

export const metadata: Metadata = {
  title: "Calories by Height Calculator | Ideal Weight & Calorie Needs | Sandy.Lifts",
  description: "Calculate how many calories you need based on your height. See your healthy weight range, BMI-based ideal weight, and exact calorie target — all from one number. Based on Mifflin-St Jeor 1990 and Indian BMI guidelines. Free tool.",
  keywords: ["calories by height calculator India","how many calories do I need for my height","ideal weight for height India","height weight calories calculator","calorie needs based on height India","healthy weight range for height India","ideal body weight calorie calculator","calories needed per day India height","height based calorie calculator","how many calories to eat for my height","calorie calculator height weight India","sandy lifts height calorie calculator"],
  openGraph: { title: "Calories by Height Calculator | Ideal Weight & Calorie Needs | Sandy.Lifts", description: "Height → healthy weight range → exact calories. Uses Indian BMI cutoffs (Misra 2009) + Mifflin-St Jeor.", url: "https://sandy-lifts.vercel.app/tools/calories-by-height" },
  alternates: { canonical: "https://sandy-lifts.vercel.app/tools/calories-by-height" },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Calories by Height Calculator", applicationCategory: "HealthApplication",
  description: "Height-based calorie needs and healthy weight range calculator using Indian BMI cutoffs",
  url: "https://sandy-lifts.vercel.app/tools/calories-by-height",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Sandy.Lifts" },
};

const FAQS = [
  { q: "How many calories do I need for my height?", a: "For a 160cm Indian woman: healthy weight range is 47–59kg, requiring roughly 1,450–1,750 kcal/day at moderate activity. For a 175cm man: healthy weight range is 57–70kg, requiring roughly 1,900–2,200 kcal/day. This calculator shows you the exact range for your height." },
  { q: "What is the ideal weight for my height in India?", a: "Indian-specific guidelines (Misra et al. 2009) use a healthy BMI range of 18.5–22.9 for South Asians. For a 165cm person, this means a healthy weight of 50–62kg. Standard Western cutoffs (BMI 25) are too lenient for South Asians who face higher metabolic risk at lower body weights." },
  { q: "Does height affect how many calories you need?", a: "Yes, significantly. In the Mifflin-St Jeor equation, every 1cm of additional height adds approximately 6.25 kcal to your BMR. For a moderately active person, this becomes ~9–10 kcal/day at rest. Two people who weigh the same but differ by 10cm in height need about 60–100 kcal/day different calorie intake." },
  { q: "How do I calculate calories based on height and age?", a: "Use the Mifflin-St Jeor formula: For men: BMR = (10 × weight) + (6.25 × height in cm) − (5 × age) + 5. For women: BMR = (10 × weight) + (6.25 × height in cm) − (5 × age) − 161. Then multiply by your activity factor (1.2–1.9) for total daily calories. This calculator does this for every weight in your healthy range." },
];

export default function CaloriesByHeightPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
        <h1 className="sr-only">Calories by Height Calculator — Ideal Weight Range and Calorie Needs</h1>
        <CaloriesByHeightCalculator />
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
