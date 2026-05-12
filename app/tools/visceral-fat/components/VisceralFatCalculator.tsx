"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ruler } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ─── Research ────────────────────────────────────────────── */
const WHY =
  "BMI tells you about overall weight — not where that fat is stored. Visceral fat (the fat around your organs) is far more dangerous than subcutaneous fat. Waist-to-height ratio (WHtR) is the only simple measurement that captures this risk without expensive equipment.";

const STUDIES: Study[] = [
  {
    name: "Ashwell M & Gibson S — Nutrition Research Reviews 2010",
    detail: "78 studies: WHtR outperforms BMI for predicting CVD and diabetes. 0.5 is the universal boundary value across 14 countries and all ethnicities.",
    tag: "PRIMARY",
  },
  {
    name: "NICE Guidelines — October 2022",
    detail: "WHtR ≥ 0.5 defines central adiposity. Applies to all sexes and ethnicities. Recommended over waist circumference alone.",
    tag: "PRIMARY",
  },
  {
    name: "The Lancet Regional Health — Southeast Asia 2023",
    detail: "NFHS-5 data: 6,59,156 Indian women + 85,976 men. Men >90cm, Women >80cm = abdominal obesity by Indian consensus.",
    tag: "SUPPORTING",
  },
  {
    name: "PMC 2025 · Prospective cohort study",
    detail: "WHtR ≥ 0.58 associated with 35.5% higher cardiovascular mortality, 69.8% higher diabetes mortality.",
    tag: "SUPPORTING",
  },
];

const BOTTOM_LINE =
  "You can have a 'normal' BMI and still have dangerous visceral fat. If your waist is more than half your height — your organs are at risk. This is India's silent epidemic. A tape measure is all you need to check.";

/* ─── Risk levels ─────────────────────────────────────────── */
interface RiskLevel {
  label:  string;
  emoji:  string;
  color:  string;
  border: string;
  bg:     string;
  desc:   string;
}

function getRisk(whtr: number): RiskLevel {
  if (whtr < 0.40) return { label: "Underweight Risk", emoji: "🔵", color: "#60ADC7", border: "rgba(96,173,199,0.35)", bg: "rgba(96,173,199,0.06)", desc: "WHtR below 0.40 — low body mass relative to height" };
  if (whtr < 0.50) return { label: "Healthy Range",    emoji: "✅", color: "#4ade80", border: "rgba(74,222,128,0.35)", bg: "rgba(74,222,128,0.06)", desc: "Optimal range — visceral fat risk is low" };
  if (whtr < 0.55) return { label: "Increased Risk",   emoji: "⚠️", color: "#fbbf24", border: "rgba(251,191,36,0.35)", bg: "rgba(251,191,36,0.06)", desc: "Waist ≥ 50% of your height — early warning for T2D and CVD" };
  if (whtr < 0.60) return { label: "High Risk",        emoji: "🔶", color: "#fb923c", border: "rgba(251,146,60,0.35)", bg: "rgba(251,146,60,0.06)", desc: "Associated with significantly elevated cardiovascular disease risk" };
  return           { label: "Very High Risk",  emoji: "🔴", color: "#ef4444", border: "rgba(239,68,68,0.35)",  bg: "rgba(239,68,68,0.06)",  desc: "WHtR ≥ 0.60 predicts 35.5% higher cardiovascular mortality risk" };
}

/* ─── Main component ─────────────────────────────────────── */
export function VisceralFatCalculator() {
  const profile = useBodyProfile();
  const router  = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState({ waist: "", height: "", gender: "male" as "male" | "female" });
  const [result, setResult] = useState<{ whtr: number; risk: RiskLevel; targetWaist: number; indianFlag: boolean } | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm((p) => ({
      ...p,
      height: profile.height_cm ? String(Math.round(profile.height_cm)) : p.height,
      gender: profile.gender ?? p.gender,
    }));
  }, [profile]);

  function calculate() {
    const w = parseFloat(form.waist);
    const h = parseFloat(form.height);
    if (!w || !h || w <= 0 || h <= 0) return;

    const whtr        = parseFloat((w / h).toFixed(3));
    const risk        = getRisk(whtr);
    const targetWaist = Math.round(h * 0.499);
    const indianFlag  = form.gender === "male" ? w > 90 : w > 80;

    setResult({ whtr, risk, targetWaist, indianFlag });
  }

  const canCalc = !!form.waist && !!form.height;
  const r = result;

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
      {/* Back */}
      <Link href="/tools" className="inline-flex items-center gap-1.5 mb-8 transition-colors hover:text-[#F2F4F8]" style={{ color: "#4B5265", fontSize: "13px", textDecoration: "none" }}>
        <ArrowLeft size={14} /> Back to Toolkit
      </Link>

      {/* Header card */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <Ruler size={20} color="#fb923c" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(251,146,60,0.08)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>NICE 2022 · LANCET INDIA 2023</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Visceral Fat Risk Estimator</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>
          BMI misses where fat is stored. Waist-to-height ratio is the gold standard — and includes Indian-specific cutoffs.
        </p>
        <AnimatePresence initial={false}>
          {researchOpen && (
            <motion.div key="research" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
              <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form card */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Measurements</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Waist */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-[12px] font-semibold" style={{ color: "#8B92A5" }}>Waist Circumference (cm)</label>
            </div>
            <input
              type="number" min={40} max={200} placeholder="e.g. 88"
              value={form.waist}
              onChange={(e) => setForm((p) => ({ ...p, waist: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
            <p className="text-[11px] mt-1" style={{ color: "#4B5265" }}>Measure at navel level, relaxed breath</p>
          </div>
          {/* Height */}
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Height (cm)</label>
            <input
              type="number" min={100} max={250} placeholder="e.g. 168"
              value={form.height}
              onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="mb-5">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Gender <span style={{ color: "#4B5265", fontWeight: 400 }}>(for Indian cutoffs)</span></label>
          <div className="flex gap-2">
            {(["male", "female"] as const).map((g) => (
              <button key={g} onClick={() => setForm((p) => ({ ...p, gender: g }))}
                className="flex-1 rounded-lg text-[13px] font-semibold transition-all duration-150"
                style={{ minHeight: 44, border: form.gender === g ? "1px solid rgba(251,146,60,0.5)" : "1px solid rgba(255,255,255,0.08)", background: form.gender === g ? "rgba(251,146,60,0.08)" : "transparent", color: form.gender === g ? "#fb923c" : "#4B5265" }}
              >
                {g === "male" ? "Male" : "Female"}
              </button>
            ))}
          </div>
        </div>

        <button onClick={calculate} disabled={!canCalc}
          className="w-full rounded-lg text-[14px] font-semibold transition-opacity duration-200"
          style={{ background: "#fb923c", color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed", borderRadius: 8 }}
        >
          Calculate My Visceral Fat Risk →
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {r && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Risk card */}
            <div className="rounded-xl p-5 mb-4" style={{ background: r.risk.bg, border: `1px solid ${r.risk.border}` }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: r.risk.color }}>{r.risk.emoji} {r.risk.label}</p>
              <p className="text-[28px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>WHtR: {r.whtr}</p>
              <p className="text-[13px]" style={{ color: "#8B92A5" }}>{r.risk.desc}</p>
            </div>

            {/* Plain message */}
            <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[15px] font-semibold text-center mb-3" style={{ color: "#F2F4F8" }}>
                Keep your waist less than half your height
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[22px] font-semibold" style={{ color: "#F2F4F8" }}>{form.waist} cm</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>Your Waist</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(74,222,128,0.15)" }}>
                  <p className="text-[22px] font-semibold" style={{ color: "#4ade80" }}>≤ {r.targetWaist} cm</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>Target (50% of height)</p>
                </div>
              </div>

              {/* Indian-specific callout */}
              {r.indianFlag && (
                <div className="rounded-lg p-3 mb-3" style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.25)" }}>
                  <p className="text-[13px] font-semibold" style={{ color: "#fb923c" }}>
                    🇮🇳 Exceeds Indian abdominal obesity cutoff (IDF)
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: "#8B92A5" }}>
                    {form.gender === "male" ? "Men > 90 cm" : "Women > 80 cm"} waist = elevated metabolic risk by Indian guidelines.
                    South Asians develop T2D at lower BMIs than global averages.
                  </p>
                </div>
              )}

              <p className="text-[11px] leading-relaxed" style={{ color: "#4B5265" }}>
                Estimates based on peer-reviewed research. Individual results vary. Not medical advice — consult a qualified professional before making changes.
              </p>
            </div>

            {/* Handoff CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>Next Step</span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Risk assessed. Now set your safe calorie deficit →</p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Connect your weight to a deficit that burns fat without costing you muscle.</p>
              <button
                onClick={() => router.push(`/tools/calorie-deficit?w=${Math.round(parseFloat(form.waist))}&from=visceral-fat`)}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                Calculate Calorie Deficit →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
