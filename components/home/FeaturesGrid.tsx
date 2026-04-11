import Link from "next/link";
import { Brain, Calculator, Users, Shield, Dumbbell, TrendingUp, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Brain,
    color: "#C3FCFE",
    title: "AI Diet Coach",
    desc: "Tell it your goals, diet type, and allergies. Get a personalised meal plan with shopping list — no medical claims, just smart guidance.",
    href: "/ai-coach",
    badge: "AI Powered",
  },
  {
    icon: Dumbbell,
    color: "#C69FF5",
    title: "Workout Recommender",
    desc: "Input your level, equipment, and schedule. Get a weekly workout plan with sets, reps, warm-ups, and progressions — built for you.",
    href: "/ai-coach",
    badge: "Personalised",
  },
  {
    icon: Calculator,
    color: "#60ADC7",
    title: "20+ Fitness Tools",
    desc: "Macro calculator, body type quiz, fat% estimator, progress tracker, before/after simulator, and much more — all premium, all free.",
    href: "/tools",
    badge: "20+ Tools",
  },
  {
    icon: TrendingUp,
    color: "#C3FCFE",
    title: "Progress Tracking",
    desc: "Log your weight, visualise your journey with beautiful charts, and stay accountable with weekly targets.",
    href: "/tools/progress-chart",
    badge: "Visual",
  },
  {
    icon: Users,
    color: "#C69FF5",
    title: "Community Hub",
    desc: "Submit your transformation story, vote in weekly polls, join live Q&A sessions, and connect with like-minded people.",
    href: "/community",
    badge: "Community",
  },
  {
    icon: Shield,
    color: "#60ADC7",
    title: "Insurance Expert",
    desc: "Navigating health insurance is confusing. Our experts give you a free callback to help you find the right plan — no pressure.",
    href: "/insurance",
    badge: "Free Advice",
  },
];

export function FeaturesGrid() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "#05050B" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-cyan" style={{ marginBottom: "1rem" }}>Everything You Need</span>
          <h2 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>Your complete fitness ecosystem</h2>
          <p style={{ color: "#9A9EC4", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Not just another calorie counter. Sandy.Lifts is a full ecosystem — AI, tools, community, and expert guidance in one dark, beautiful platform.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
          {features.map((f, i) => (
            <Link key={i} href={f.href} style={{ textDecoration: "none" }}>
              <div
                className="tool-card"
                style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `rgba(${f.color === "#C3FCFE" ? "195,252,254" : f.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.12)`, border: `1px solid rgba(${f.color === "#C3FCFE" ? "195,252,254" : f.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <span className="badge" style={{ background: `rgba(${f.color === "#C3FCFE" ? "195,252,254" : f.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.1)`, color: f.color, border: `1px solid rgba(${f.color === "#C3FCFE" ? "195,252,254" : f.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.25)`, fontSize: "0.7rem" }}>
                    {f.badge}
                  </span>
                </div>
                <div>
                  <h3 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{f.title}</h3>
                  <p style={{ color: "#9A9EC4", fontSize: "0.875rem", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: f.color, fontSize: "0.85rem", fontWeight: 600, marginTop: "auto" }}>
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
