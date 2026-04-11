"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Shield } from "lucide-react";

export default function BodyFatPage() {
  const [form, setForm] = useState({ gender: "male", neck: "", waist: "", hip: "", height: "" });
  const [result, setResult] = useState<null | { bf: number; category: string; color: string }>(null);

  const categories = (bf: number, gender: string) => {
    if (gender === "male") {
      if (bf < 6) return { label: "Essential Fat", color: "#C3FCFE" };
      if (bf < 14) return { label: "Athletic", color: "#60ADC7" };
      if (bf < 18) return { label: "Fit", color: "#C69FF5" };
      if (bf < 25) return { label: "Average", color: "#FFD166" };
      return { label: "Obese", color: "#FF6B6B" };
    } else {
      if (bf < 14) return { label: "Essential Fat", color: "#C3FCFE" };
      if (bf < 21) return { label: "Athletic", color: "#60ADC7" };
      if (bf < 25) return { label: "Fit", color: "#C69FF5" };
      if (bf < 32) return { label: "Average", color: "#FFD166" };
      return { label: "Obese", color: "#FF6B6B" };
    }
  };

  const calculate = () => {
    const n = parseFloat(form.neck), w = parseFloat(form.waist), h = parseFloat(form.height), hp = parseFloat(form.hip);
    if (!n || !w || !h) return;
    let bf: number;
    if (form.gender === "male") {
      bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      if (!hp) return;
      bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
    }
    bf = Math.max(3, Math.round(bf * 10) / 10);
    const cat = categories(bf, form.gender);
    setResult({ bf, category: cat.label, color: cat.color });
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#6B6F9A", textDecoration: "none", marginBottom: "2rem", fontSize: "0.875rem" }}>
          <ArrowLeft size={15} /> Back to Tools Hub
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(198,159,245,0.1)", border: "1px solid rgba(198,159,245,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scale size={24} color="#C69FF5" />
          </div>
          <h1 style={{ color: "#D8DBFC", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>Body Fat % Estimator</h1>
        </div>
        <p style={{ color: "#9A9EC4", lineHeight: 1.7, marginBottom: "2rem" }}>Uses the US Navy circumference method — one of the most accessible non-invasive methods available.</p>
        <div style={{ background: "#343553", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(198,159,245,0.12)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Biological sex</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {["male", "female"].map(g => (
                <button key={g} onClick={() => setForm(p => ({ ...p, gender: g }))} style={{ padding: "0.625rem", borderRadius: "10px", border: `1px solid ${form.gender === g ? "rgba(198,159,245,0.5)" : "rgba(195,252,254,0.1)"}`, background: form.gender === g ? "rgba(198,159,245,0.1)" : "transparent", color: form.gender === g ? "#C69FF5" : "#9A9EC4", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          {[
            { key: "height", label: "Height (cm)" },
            { key: "neck", label: "Neck circumference (cm)" },
            { key: "waist", label: "Waist circumference (cm)", tip: "Measure at navel" },
            ...(form.gender === "female" ? [{ key: "hip", label: "Hip circumference (cm)", tip: "Widest point" }] : []),
          ].map((field) => (
            <div key={field.key}>
              <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>
                {field.label} {field.tip && <span style={{ color: "#6B6F9A", fontWeight: 400, fontSize: "0.8rem" }}>({field.tip})</span>}
              </label>
              <input className="input-field" type="number" placeholder="cm" value={(form as Record<string, string>)[field.key]} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))} />
            </div>
          ))}
          <button className="btn-primary" style={{ justifyContent: "center", padding: "0.875rem", background: "linear-gradient(135deg, rgba(198,159,245,0.2), rgba(155,93,186,0.15))", borderColor: "rgba(198,159,245,0.4)", color: "#C69FF5" }} onClick={calculate}>
            <Scale size={18} /> Estimate My Body Fat
          </button>
        </div>
        {result && (
          <div style={{ marginTop: "1.5rem", background: "#343553", borderRadius: "24px", padding: "2rem", border: `1px solid rgba(${result.color === "#C3FCFE" ? "195,252,254" : result.color === "#C69FF5" ? "198,159,245" : result.color === "#60ADC7" ? "96,173,199" : "255,100,100"},0.2)`, textAlign: "center" }}>
            <div style={{ fontSize: "4rem", fontWeight: 800, color: result.color }}>{result.bf}%</div>
            <div style={{ display: "inline-flex", padding: "0.3rem 1rem", borderRadius: "999px", background: `rgba(${result.color === "#C3FCFE" ? "195,252,254" : result.color === "#C69FF5" ? "198,159,245" : result.color === "#60ADC7" ? "96,173,199" : "255,100,100"},0.1)`, color: result.color, fontWeight: 700, marginBottom: "1rem" }}>
              {result.category}
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", background: "rgba(195,252,254,0.04)", borderRadius: "10px", padding: "0.875rem", border: "1px solid rgba(195,252,254,0.08)", textAlign: "left" }}>
              <Shield size={14} color="#60ADC7" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ color: "#6B6F9A", fontSize: "0.78rem", lineHeight: 1.6, margin: 0 }}>This is an estimate. For precise measurements, consider DEXA or hydrostatic weighing from a qualified professional.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
