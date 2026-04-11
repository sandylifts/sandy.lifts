import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Target, Star, Flame, Calculator, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools Hub — 20+ Free Fitness Tools",
  description: "Every fitness tool you'll ever need: macro calculator, body type quiz, workout planner, before/after simulator, progress chart, and much more. All free.",
};

const groups = [
  {
    id: "smart",
    label: "Smart Tools",
    icon: Activity,
    color: "#C3FCFE",
    desc: "Insightful questionnaire-based tools that help you understand your body better.",
    tools: [
      { name: "Body Type Quiz", slug: "body-type-quiz", desc: "Are you Ectomorph, Mesomorph, or Endomorph? 6 fun questions.", badge: "Fun" },
      { name: "Cheat Meal Calculator", slug: "cheat-meal", desc: "How many calories in that cheat meal, and how to burn them off.", badge: "Popular" },
      { name: "Metabolism Speed Test", slug: "metabolism-test", desc: "Questionnaire-based estimate of your metabolic speed.", badge: "Insightful" },
      { name: "Sleep & Recovery Score", slug: "sleep-score", desc: "Assess your recovery quality and get tips to improve it.", badge: "Wellness" },
    ],
  },
  {
    id: "planning",
    label: "Planning Tools",
    icon: Target,
    color: "#C69FF5",
    desc: "Build your roadmap to transformation — week by week, meal by meal.",
    tools: [
      { name: "12-Week Transformation Planner", slug: "transformation-planner", desc: "A weekly roadmap for your 3-month transformation.", badge: "Premium" },
      { name: "Meal Prep Estimator", slug: "meal-prep", desc: "How much food to prep for the week based on your goals and household size.", badge: "Practical" },
      { name: "Workout Split Suggester", slug: "workout-split", desc: "Which split works best for your schedule? 3-day, 5-day or custom.", badge: "Training" },
      { name: "Rest Day Calculator", slug: "rest-day", desc: "Are you overtraining? Spot the signals and optimise recovery.", badge: "Recovery" },
    ],
  },
  {
    id: "fun",
    label: "Fun & Viral",
    icon: Star,
    color: "#C69FF5",
    desc: "Entertaining, shareable tools with real fitness insight underneath.",
    tools: [
      { name: "Celebrity Body Type Quiz", slug: "celebrity-quiz", desc: "Which celebrity's physique matches your goals and body type?", badge: "Viral" },
      { name: "Fitness Age Calculator", slug: "fitness-age", desc: "Is your functional fitness age older or younger than your birth age?", badge: "Eye Opening" },
      { name: "Excuse Buster", slug: "excuse-buster", desc: "Give it your excuse. It will destroy it with motivation and a plan.", badge: "Funny" },
      { name: "Calorie Burn by Activity", slug: "calorie-burn", desc: "How many calories does 30 min of dancing / swimming / gaming burn?", badge: "Useful" },
    ],
  },
  {
    id: "visual",
    label: "Visual & Interactive",
    icon: Flame,
    color: "#C3FCFE",
    desc: "Highly visual tools with interactive experiences and wow-factor.",
    tools: [
      { name: "Live Progress Chart", slug: "progress-chart", desc: "Log your weight and see your journey plotted on a beautiful graph.", badge: "Log & Track" },
      { name: "Before/After Simulator", slug: "before-after", desc: "Visual slider showing transformation stages — premium interactive.", badge: "Interactive" },
      { name: "Muscle Group Visualiser", slug: "muscle-map", desc: "Click a body part on our map to see exercises targeting that muscle.", badge: "Visual" },
      { name: "Fat vs Muscle Explainer", slug: "fat-vs-muscle", desc: "Visual comparison of fat and muscle volume at the same weight.", badge: "Educational" },
    ],
  },
  {
    id: "calculators",
    label: "Core Calculators",
    icon: Calculator,
    color: "#60ADC7",
    desc: "The classic, essential fitness calculators — precise and easy to use.",
    tools: [
      { name: "Macro Calculator", slug: "macro-calculator", desc: "Calculate your ideal protein, carbs, and fat intake for your goal.", badge: "Essential" },
      { name: "Water Intake Calculator", slug: "water-intake", desc: "How much water should you drink daily based on your weight and activity?", badge: "Health" },
      { name: "Ideal Body Weight", slug: "ideal-weight", desc: "Evidence-based ideal weight ranges for your height and frame.", badge: "Reference" },
      { name: "Body Fat % Estimator", slug: "body-fat", desc: "Estimate your body fat percentage using simple measurements.", badge: "Measurement" },
    ],
  },
];

export default function ToolsHubPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="badge badge-cyan" style={{ marginBottom: "1rem" }}>Tools Hub</span>
          <h1 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>
            20+ free fitness tools,{" "}
            <span style={{ background: "linear-gradient(135deg, #C3FCFE, #C69FF5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>all in one place</span>
          </h1>
          <p style={{ color: "#9A9EC4", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            From calculators to quizzes, visual simulators to progress trackers — every tool is built to give you real, actionable insight about your body and goals.
          </p>
        </div>

        {/* Jump links */}
        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}>
          {groups.map(g => (
            <a key={g.id} href={`#${g.id}`} style={{ padding: "0.5rem 1rem", borderRadius: "999px", background: "rgba(34,34,53,0.8)", border: `1px solid rgba(${g.color === "#C3FCFE" ? "195,252,254" : g.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.2)`, color: g.color, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}>
              {g.label}
            </a>
          ))}
        </div>

        {/* Tool Groups */}
        {groups.map((group) => (
          <section key={group.id} id={group.id} style={{ marginBottom: "4rem", scrollMarginTop: "90px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.75rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `rgba(${group.color === "#C3FCFE" ? "195,252,254" : group.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.1)`, border: `1px solid rgba(${group.color === "#C3FCFE" ? "195,252,254" : group.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <group.icon size={22} color={group.color} />
              </div>
              <div>
                <h2 style={{ color: group.color, fontWeight: 700, fontSize: "1.2rem", margin: 0 }}>{group.label}</h2>
                <p style={{ color: "#6B6F9A", fontSize: "0.85rem", margin: 0 }}>{group.desc}</p>
              </div>
            </div>

            <div style={{ height: "1px", background: `linear-gradient(90deg, rgba(${group.color === "#C3FCFE" ? "195,252,254" : group.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.3), transparent)`, marginBottom: "1.25rem" }} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
              {group.tools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card" style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1rem", margin: 0, lineHeight: 1.4 }}>{tool.name}</h3>
                    <span className="badge" style={{ background: `rgba(${group.color === "#C3FCFE" ? "195,252,254" : group.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.08)`, color: group.color, border: `1px solid rgba(${group.color === "#C3FCFE" ? "195,252,254" : group.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.2)`, fontSize: "0.68rem", flexShrink: 0, marginLeft: "0.5rem" }}>
                      {tool.badge}
                    </span>
                  </div>
                  <p style={{ color: "#9A9EC4", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{tool.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: group.color, fontSize: "0.82rem", fontWeight: 600, marginTop: "auto" }}>
                    Open Tool <ArrowRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
