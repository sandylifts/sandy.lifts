"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Shield } from "lucide-react";

export default function MacroCalculatorPage() {
  const [form, setForm] = useState({ age: "", gender: "male", weight: "", height: "", activity: "moderate", goal: "maintain" });
  const [result, setResult] = useState<null | { calories: number; protein: number; carbs: number; fat: number }>(null);

  const calculate = () => {
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height);
    const a = parseInt(form.age);
    if (!w || !h || !a) return;

    // Mifflin-St Jeor
    const bmr = form.gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const activityFactors: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };
    const tdee = bmr * activityFactors[form.activity];

    const goalAdjust: Record<string, number> = { lose: -400, maintain: 0, gain: 300 };
    const calories = Math.round(tdee + goalAdjust[form.goal]);

    const protein = Math.round(form.goal === "gain" ? w * 2.2 : w * 1.8);
    const fat = Math.round((calories * 0.27) / 9);
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    setResult({ calories, protein, carbs, fat });
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#6B6F9A", textDecoration: "none", marginBottom: "2rem", fontSize: "0.875rem" }}>
          <ArrowLeft size={15} /> Back to Tools Hub
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(96,173,199,0.1)", border: "1px solid rgba(96,173,199,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calculator size={24} color="#60ADC7" />
          </div>
          <div>
            <span className="badge" style={{ background: "rgba(96,173,199,0.1)", color: "#60ADC7", border: "1px solid rgba(96,173,199,0.2)", display: "inline-flex", marginBottom: "0.25rem" }}>Essential</span>
            <h1 style={{ color: "#D8DBFC", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>Macro Calculator</h1>
          </div>
        </div>
        <p style={{ color: "#9A9EC4", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Get your personalised daily targets for protein, carbohydrates, and fat based on the Mifflin-St Jeor equation — the industry gold standard.
        </p>

        <div style={{ background: "#343553", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(96,173,199,0.12)", display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Age</label>
              <input className="input-field" type="number" min="16" max="80" placeholder="e.g. 28" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
            </div>
            <div>
              <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Biological sex</label>
              <select className="select-field" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Weight (kg)</label>
              <input className="input-field" type="number" min="30" max="250" placeholder="e.g. 75" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} />
            </div>
            <div>
              <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Height (cm)</label>
              <input className="input-field" type="number" min="100" max="230" placeholder="e.g. 175" value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Activity level</label>
            <select className="select-field" value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))}>
              <option value="sedentary">Sedentary (desk job, no exercise)</option>
              <option value="light">Light (1–3 workouts/week)</option>
              <option value="moderate">Moderate (3–5 workouts/week)</option>
              <option value="active">Active (6–7 workouts/week)</option>
              <option value="very">Very Active (twice/day or physical job)</option>
            </select>
          </div>

          <div>
            <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Goal</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {[["lose", "Fat Loss", "#C3FCFE"], ["maintain", "Maintain", "#60ADC7"], ["gain", "Muscle Gain", "#C69FF5"]].map(([val, label, clr]) => (
                <button key={val} onClick={() => setForm(p => ({ ...p, goal: val }))} style={{ padding: "0.625rem", borderRadius: "10px", border: `1px solid ${form.goal === val ? `${clr}66` : "rgba(195,252,254,0.1)"}`, background: form.goal === val ? `rgba(${clr === "#C3FCFE" ? "195,252,254" : clr === "#C69FF5" ? "198,159,245" : "96,173,199"},0.1)` : "transparent", color: form.goal === val ? clr : "#9A9EC4", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" style={{ justifyContent: "center", padding: "0.875rem", background: "linear-gradient(135deg, rgba(96,173,199,0.2), rgba(195,252,254,0.15))", borderColor: "rgba(96,173,199,0.4)", color: "#60ADC7" }} onClick={calculate}>
            <Calculator size={18} /> Calculate My Macros
          </button>
        </div>

        {result && (
          <div style={{ background: "#343553", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(195,252,254,0.15)", animation: "fadeInUp 0.5s ease" }}>
            <h2 style={{ color: "#D8DBFC", fontWeight: 700, marginBottom: "1.5rem" }}>Your Daily Targets</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ gridColumn: "span 2", background: "rgba(5,5,11,0.4)", borderRadius: "14px", padding: "1.25rem", textAlign: "center", border: "1px solid rgba(195,252,254,0.1)" }}>
                <div style={{ fontSize: "3rem", fontWeight: 800, background: "linear-gradient(135deg, #C3FCFE, #60ADC7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{result.calories}</div>
                <div style={{ color: "#9A9EC4", fontSize: "0.9rem" }}>Daily Calories (kcal)</div>
              </div>
              {[
                { label: "Protein", value: result.protein, unit: "g", color: "#C3FCFE", note: "Builds & repairs muscle" },
                { label: "Carbohydrates", value: result.carbs, unit: "g", color: "#60ADC7", note: "Primary energy source" },
                { label: "Fats", value: result.fat, unit: "g", color: "#C69FF5", note: "Hormones & vitamins" },
              ].map(m => (
                <div key={m.label} style={{ background: "rgba(5,5,11,0.4)", borderRadius: "14px", padding: "1.25rem", textAlign: "center", border: `1px solid rgba(${m.color === "#C3FCFE" ? "195,252,254" : m.color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.15)` }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: m.color }}>{m.value}<span style={{ fontSize: "1rem", opacity: 0.7 }}>{m.unit}</span></div>
                  <div style={{ color: "#D8DBFC", fontSize: "0.9rem", fontWeight: 600 }}>{m.label}</div>
                  <div style={{ color: "#6B6F9A", fontSize: "0.75rem", marginTop: "0.25rem" }}>{m.note}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", background: "rgba(195,252,254,0.04)", borderRadius: "10px", padding: "0.875rem", border: "1px solid rgba(195,252,254,0.08)" }}>
              <Shield size={15} color="#60ADC7" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ color: "#6B6F9A", fontSize: "0.78rem", lineHeight: 1.6, margin: 0 }}>
                These figures are estimates based on population-level equations. Individual needs vary. If you have any health conditions, consult a registered dietitian.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
