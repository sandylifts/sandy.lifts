import Link from "next/link";
import { ArrowRight, Calculator, Activity, Target, Flame, Scale, Droplets, Clock, Star } from "lucide-react";

const toolGroups = [
  {
    label: "Smart Tools",
    color: "#C3FCFE",
    tools: ["Body Type Quiz", "Cheat Meal Calculator", "Metabolism Speed Test", "Sleep & Recovery Score"],
    href: "/tools#smart",
    icon: Activity,
  },
  {
    label: "Planning Tools",
    color: "#C69FF5",
    tools: ["12-Week Transformation Planner", "Meal Prep Estimator", "Workout Split Suggester", "Rest Day Calculator"],
    href: "/tools#planning",
    icon: Target,
  },
  {
    label: "Core Calculators",
    color: "#60ADC7",
    tools: ["Macro Calculator", "Water Intake", "Ideal Body Weight", "Body Fat % Estimator"],
    href: "/tools#calculators",
    icon: Calculator,
  },
  {
    label: "Fun & Viral",
    color: "#C69FF5",
    tools: ["Celebrity Body Quiz", "Fitness Age Calculator", "Excuse Buster", "Calorie Burn by Activity"],
    href: "/tools#fun",
    icon: Star,
  },
  {
    label: "Visual Tools",
    color: "#C3FCFE",
    tools: ["Live Progress Chart", "Before/After Simulator", "Muscle Group Visualiser", "Fat vs Muscle Explainer"],
    href: "/tools#visual",
    icon: Flame,
  },
];

export function ToolsPreview() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "linear-gradient(180deg, #05050B 0%, #0A0A14 100%)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-purple" style={{ marginBottom: "1rem" }}>Tools Hub</span>
          <h2 className="text-headline" style={{ marginBottom: "1rem" }}>
            <span style={{ color: "#D8DBFC" }}>20+ premium tools,</span>{" "}
            <span style={{ background: "linear-gradient(135deg, #C3FCFE, #C69FF5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>all free</span>
          </h2>
          <p style={{ color: "#9A9EC4", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            Every tool built for real people with real goals. No login required for most tools.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {toolGroups.map((group, i) => (
            <Link key={i} href={group.href} style={{ textDecoration: "none" }}>
              <div className="tool-card" style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `rgba(${group.color === "#C3FCFE" ? "195,252,254" : group.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.1)`, border: `1px solid rgba(${group.color === "#C3FCFE" ? "195,252,254" : group.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.2)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <group.icon size={18} color={group.color} />
                  </div>
                  <span style={{ color: group.color, fontWeight: 700, fontSize: "0.95rem" }}>{group.label}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {group.tools.map((tool, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#9A9EC4", fontSize: "0.85rem" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: group.color, opacity: 0.6, flexShrink: 0 }} />
                      {tool}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: group.color, fontSize: "0.82rem", fontWeight: 600, marginTop: "1rem" }}>
                  Open all <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/tools" className="btn-primary" style={{ fontSize: "1rem" }}>
            View All 20+ Tools <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
