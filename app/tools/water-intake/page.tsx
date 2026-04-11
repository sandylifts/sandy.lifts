"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Droplets, Shield } from "lucide-react";

export default function WaterIntakePage() {
  const [form, setForm] = useState({ weight: "", activity: "moderate", climate: "temperate" });
  const [result, setResult] = useState<null | { litres: number; glasses: number }>(null);

  const calculate = () => {
    const w = parseFloat(form.weight);
    if (!w) return;
    const base = w * 35; // ml
    const activityBonus: Record<string, number> = { sedentary: 0, light: 200, moderate: 400, active: 600, very: 800 };
    const climateBonus: Record<string, number> = { cold: -100, temperate: 0, warm: 300, hot: 600 };
    const total = base + activityBonus[form.activity] + climateBonus[form.climate];
    setResult({ litres: Math.round(total / 100) / 10, glasses: Math.round(total / 250) });
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#6B6F9A", textDecoration: "none", marginBottom: "2rem", fontSize: "0.875rem" }}>
          <ArrowLeft size={15} /> Back to Tools Hub
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(96,173,199,0.1)", border: "1px solid rgba(96,173,199,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Droplets size={24} color="#60ADC7" />
          </div>
          <h1 style={{ color: "#D8DBFC", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>Water Intake Calculator</h1>
        </div>
        <p style={{ color: "#9A9EC4", lineHeight: 1.7, marginBottom: "2rem" }}>Find your personalised daily hydration target based on your weight, activity, and climate.</p>
        <div style={{ background: "#343553", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(96,173,199,0.12)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Body weight (kg)</label>
            <input className="input-field" type="number" placeholder="e.g. 70" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} />
          </div>
          <div>
            <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Activity level</label>
            <select className="select-field" value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light exercise</option>
              <option value="moderate">Moderate exercise</option>
              <option value="active">Active (daily workouts)</option>
              <option value="very">Very active (athlete)</option>
            </select>
          </div>
          <div>
            <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Climate</label>
            <select className="select-field" value={form.climate} onChange={e => setForm(p => ({ ...p, climate: e.target.value }))}>
              <option value="cold">Cold (under 15°C)</option>
              <option value="temperate">Temperate (15–25°C)</option>
              <option value="warm">Warm (25–35°C)</option>
              <option value="hot">Hot &amp; humid (35°C+)</option>
            </select>
          </div>
          <button className="btn-primary" style={{ justifyContent: "center", padding: "0.875rem", background: "linear-gradient(135deg, rgba(96,173,199,0.2), rgba(195,252,254,0.15))", borderColor: "rgba(96,173,199,0.4)", color: "#60ADC7" }} onClick={calculate}>
            <Droplets size={18} /> Calculate My Hydration
          </button>
        </div>
        {result && (
          <div style={{ marginTop: "1.5rem", background: "#343553", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(96,173,199,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", fontWeight: 800, background: "linear-gradient(135deg, #60ADC7, #C3FCFE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{result.litres}L</div>
            <div style={{ color: "#D8DBFC", fontWeight: 600, marginBottom: "0.5rem" }}>per day</div>
            <div style={{ color: "#9A9EC4", fontSize: "0.9rem" }}>That's approximately <strong style={{ color: "#C3FCFE" }}>{result.glasses} glasses</strong> of 250ml each.</div>
            <div style={{ marginTop: "1.25rem", padding: "0.875rem", background: "rgba(195,252,254,0.04)", borderRadius: "10px", border: "1px solid rgba(195,252,254,0.08)", display: "flex", gap: "0.5rem", textAlign: "left" }}>
              <Shield size={14} color="#60ADC7" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ color: "#6B6F9A", fontSize: "0.78rem", lineHeight: 1.6, margin: 0 }}>These estimates are based on general guidelines. Individual needs vary. Consult a healthcare professional for specific advice.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
