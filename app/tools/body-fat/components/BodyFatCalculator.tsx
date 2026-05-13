"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ruler } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile, saveBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ── Research ──────────────────────────────────────────── */
const WHY = "BMI tells you your weight relative to height — nothing more. Body fat % tells you what that weight is actually made of: muscle or fat. The Navy circumference method uses a tape measure to estimate fat accurately within ±3–4% of DEXA (the clinical gold standard). No gym equipment needed.";
const STUDIES: Study[] = [
  { name: "Hodgdon JA & Beckett MB — Naval Health Research Center 1984", detail: "Prediction of percent body fat for US Navy men and women from body circumferences and height. Validated against underwater weighing. Official DoD formula.", tag: "PRIMARY" },
  { name: "Potter MN et al. — Military Medicine 2022", detail: "Circumference-based predictions of body fat revisited. Average bias: −2.6% for men, +2.3% for women vs DEXA. SD: ±3–4%. Large military population validation.", tag: "SUPPORTING" },
  { name: "American Council on Exercise (ACE) — Body Fat % Categories", detail: "Evidence-based fitness categories: Essential, Athletic, Fitness, Acceptable, Obese. Used by fitness professionals worldwide.", tag: "SUPPORTING" },
  { name: "British Journal of Sports Medicine 2023", detail: "Body composition guidelines including body fat percentage ranges for athletic and general population categories.", tag: "SUPPORTING" },
];
const BOTTOM_LINE = "Your body fat percentage is a far more useful number than your BMI. Two people can weigh the same and look completely different — because one has 15% fat and the other has 28% fat. This tool tells you which category you're in and what it means.";

/* ── Categories ─────────────────────────────────────────── */
interface Cat { label: string; color: string; border: string; bg: string; desc: string; }
const MALE_CATS: (Cat & { min: number; max: number })[] = [
  { min: 0,  max: 5,  label: "Essential Fat", color: "#60a5fa", border: "rgba(96,165,250,0.35)",  bg: "rgba(96,165,250,0.06)",  desc: "Minimum for organ function. Do not target this." },
  { min: 6,  max: 13, label: "Athletic",       color: "#4ade80", border: "rgba(74,222,128,0.35)",  bg: "rgba(74,222,128,0.06)",  desc: "Elite performance zone. Competitive athletes." },
  { min: 14, max: 17, label: "Fitness",         color: "#a78bfa", border: "rgba(167,139,250,0.35)", bg: "rgba(167,139,250,0.06)", desc: "Lean and healthy. Most active men aim here." },
  { min: 18, max: 24, label: "Acceptable",      color: "#fbbf24", border: "rgba(251,191,36,0.35)",  bg: "rgba(251,191,36,0.06)",  desc: "Healthy general population range." },
  { min: 25, max: 99, label: "Obese",           color: "#ef4444", border: "rgba(239,68,68,0.35)",   bg: "rgba(239,68,68,0.06)",   desc: "Elevated health risk. Time to act." },
];
const FEMALE_CATS: (Cat & { min: number; max: number })[] = [
  { min: 0,  max: 13, label: "Essential Fat", color: "#60a5fa", border: "rgba(96,165,250,0.35)",  bg: "rgba(96,165,250,0.06)",  desc: "Minimum for hormonal and reproductive health." },
  { min: 14, max: 20, label: "Athletic",       color: "#4ade80", border: "rgba(74,222,128,0.35)",  bg: "rgba(74,222,128,0.06)",  desc: "Elite performance zone." },
  { min: 21, max: 24, label: "Fitness",         color: "#a78bfa", border: "rgba(167,139,250,0.35)", bg: "rgba(167,139,250,0.06)", desc: "Lean and healthy. Fit, active women." },
  { min: 25, max: 31, label: "Acceptable",      color: "#fbbf24", border: "rgba(251,191,36,0.35)",  bg: "rgba(251,191,36,0.06)",  desc: "Healthy general population range." },
  { min: 32, max: 99, label: "Obese",           color: "#ef4444", border: "rgba(239,68,68,0.35)",   bg: "rgba(239,68,68,0.06)",   desc: "Elevated health risk." },
];

function getCategory(bf: number, gender: "male" | "female") {
  const cats = gender === "male" ? MALE_CATS : FEMALE_CATS;
  return cats.find((c) => bf >= c.min && bf <= c.max) ?? cats[cats.length - 1];
}

/* ── Range bar ─────────────────────────────────────────── */
function BFRangeBar({ bf, gender }: { bf: number; gender: "male" | "female" }) {
  const cap = gender === "male" ? 45 : 50;
  const cats = gender === "male" ? MALE_CATS : FEMALE_CATS;
  const markerPct = Math.min((bf / cap) * 100, 97);
  let prev = 0;
  return (
    <div>
      <div className="relative h-3 rounded-full overflow-hidden flex mb-2" style={{ background: "#111318" }}>
        {cats.map((c) => {
          const end = Math.min(c.max, cap);
          const w = Math.max(0, ((end - prev) / cap) * 100);
          const el = <div key={c.label} style={{ width: `${w}%`, background: c.color, opacity: 0.4 }} />;
          prev = end;
          return el;
        })}
        <div className="absolute top-0 bottom-0 w-0.5 rounded-full" style={{ left: `${markerPct}%`, background: "#F2F4F8", boxShadow: "0 0 4px rgba(242,244,248,0.8)" }} />
      </div>
      <div className="flex gap-1 flex-wrap">
        {cats.map((c) => (
          <span key={c.label} className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${c.color}18`, color: c.color }}>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────── */
interface Result { bf: number; cat: Cat; leanMass: number | null; fatMass: number | null; }

export function BodyFatCalculator() {
  const profile = useBodyProfile();
  const router = useRouter();
  const [researchOpen, setResearchOpen] = useState(false);
  const [measureOpen, setMeasureOpen] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [form, setForm] = useState({ height: "", neck: "", waist: "", hip: "", weight: "" });
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm((p) => ({
      ...p,
      height: profile.height_cm ? String(Math.round(profile.height_cm)) : p.height,
      waist:  profile.waist_cm  ? String(Math.round(profile.waist_cm))  : p.waist,
      weight: profile.weight_kg ? String(Math.round(profile.weight_kg)) : p.weight,
    }));
    if (profile.gender) setGender(profile.gender);
  }, [profile]);

  function toCm(v: string) { const n = parseFloat(v); return unit === "in" ? n * 2.54 : n; }

  function calculate() {
    setError("");
    const h = toCm(form.height), n = toCm(form.neck), w = toCm(form.waist);
    if (!h || !n || !w || h <= 0 || n <= 0 || w <= 0) { setError("Please fill all required measurements."); return; }
    let bf: number;
    if (gender === "male") {
      if (w <= n) { setError("Waist must be larger than neck."); return; }
      bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      const hp = toCm(form.hip);
      if (!hp || hp <= 0) { setError("Hip measurement is required for women."); return; }
      if ((w + hp) <= n) { setError("Please check your measurements."); return; }
      bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
    }
    bf = Math.round(bf * 10) / 10;
    if (bf < 0 || bf > 60) { setError("Please check your measurements — result is out of range."); return; }
    const cat = getCategory(bf, gender);
    const wKg = parseFloat(form.weight) || null;
    const leanMass = wKg ? Math.round(wKg * (1 - bf / 100) * 10) / 10 : null;
    const fatMass  = wKg ? Math.round(wKg * (bf / 100) * 10) / 10 : null;
    setResult({ bf, cat, leanMass, fatMass });
    saveBodyProfile({ body_fat_pct: bf, gender, height_cm: h, waist_cm: w, weight_kg: wKg ?? undefined });
  }

  const canCalc = !!form.height && !!form.neck && !!form.waist && (gender === "male" || !!form.hip);
  const showIndianNote = result && (result.cat.label === "Acceptable" || result.cat.label === "Obese");

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.25rem 2rem" }}>
      <Link href="/tools" className="inline-flex items-center gap-1.5 mb-8 hover:text-[#F2F4F8]" style={{ color: "#4B5265", fontSize: "13px", textDecoration: "none" }}>
        <ArrowLeft size={14} /> Back to Toolkit
      </Link>

      {/* Header */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
              <Ruler size={20} color="#a78bfa" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(167,139,250,0.08)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>HODGDON & BECKETT 1984</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Body Fat % Estimator</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>US Navy circumference method — accurate within ±3–4% of DEXA. Just a tape measure.</p>
        <AnimatePresence initial={false}>
          {researchOpen && (
            <motion.div key="r" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Measurements</p>

        {/* Gender + Unit */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Gender</label>
            <div className="flex gap-2">
              {(["male","female"] as const).map((g) => (
                <button key={g} onClick={() => setGender(g)} className="flex-1 rounded-lg text-[13px] font-semibold transition-all duration-150" style={{ minHeight: 44, border: gender === g ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.08)", background: gender === g ? "rgba(167,139,250,0.08)" : "transparent", color: gender === g ? "#a78bfa" : "#4B5265" }}>
                  {g === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Unit</label>
            <div className="flex gap-2">
              {(["cm","in"] as const).map((u) => (
                <button key={u} onClick={() => setUnit(u)} className="flex-1 rounded-lg text-[13px] font-semibold transition-all duration-150" style={{ minHeight: 44, border: unit === u ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.08)", background: unit === u ? "rgba(167,139,250,0.08)" : "transparent", color: unit === u ? "#a78bfa" : "#4B5265" }}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {[
            { key: "height", label: `Height (${unit})`, tip: "" },
            { key: "neck",   label: `Neck (${unit})`,   tip: "Below larynx, perpendicular to neck" },
            { key: "waist",  label: `Waist (${unit})`,  tip: gender === "male" ? "At navel level" : "Narrowest point" },
            ...(gender === "female" ? [{ key: "hip", label: `Hip (${unit})`, tip: "Widest point" }] : []),
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>{f.label}</label>
              <input type="number" min={0} placeholder={`e.g. ${f.key === "height" ? (unit === "cm" ? "170" : "67") : (unit === "cm" ? "85" : "33")}`}
                value={(form as Record<string,string>)[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full rounded-lg px-3 text-[14px]"
                style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
              />
              {f.tip && <p className="text-[11px] mt-1" style={{ color: "#4B5265" }}>{f.tip}</p>}
            </div>
          ))}
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Weight (kg) <span style={{ color: "#4B5265", fontWeight: 400 }}>optional — for lean/fat mass</span></label>
            <input type="number" min={0} placeholder="e.g. 75"
              value={form.weight}
              onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
        </div>

        {/* Measurement guide */}
        <button onClick={() => setMeasureOpen((o) => !o)} className="text-[12px] mb-4 flex items-center gap-1.5 transition-colors" style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {measureOpen ? "▲" : "▼"} How to measure correctly
        </button>
        {measureOpen && (
          <div className="rounded-lg p-4 mb-4 text-[12px] leading-relaxed" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)", color: "#8B92A5" }}>
            <p className="font-semibold mb-2" style={{ color: "#F2F4F8" }}>3 measurements. 1 tape measure.</p>
            <p className="mb-1"><span style={{ color: "#a78bfa" }}>Neck:</span> Below the Adam&apos;s apple. Hold tape perpendicular to neck axis. Don&apos;t flex.</p>
            <p className="mb-1"><span style={{ color: "#a78bfa" }}>Waist (men):</span> At navel level. Relaxed breath — don&apos;t suck in.</p>
            <p className="mb-1"><span style={{ color: "#a78bfa" }}>Waist (women):</span> At narrowest point between ribcage and hip bone.</p>
            <p><span style={{ color: "#a78bfa" }}>Hip (women):</span> Widest point of hips and buttocks. Feet together.</p>
          </div>
        )}

        {error && <p className="text-[12px] mb-3 font-semibold" style={{ color: "#ef4444" }}>{error}</p>}

        <button onClick={calculate} disabled={!canCalc}
          className="w-full rounded-lg text-[14px] font-semibold transition-opacity duration-200"
          style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed", borderRadius: 8 }}
        >
          Calculate My Body Fat % →
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Score card */}
            <div className="rounded-xl p-5 mb-4" style={{ background: result.cat.bg, border: `1px solid ${result.cat.border}` }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: result.cat.color }}>Your Body Fat</p>
              <p className="text-[52px] font-semibold leading-none mb-2" style={{ color: "#F2F4F8", letterSpacing: "-0.02em" }}>{result.bf}<span className="text-[24px]">%</span></p>
              <span className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-2" style={{ background: `${result.cat.color}20`, color: result.cat.color, border: `1px solid ${result.cat.border}` }}>{result.cat.label}</span>
              <p className="text-[13px]" style={{ color: "#8B92A5" }}>You are in the <strong style={{ color: "#F2F4F8" }}>{result.cat.label}</strong> category — {result.cat.desc}</p>
            </div>

            {/* Range bar + lean/fat mass */}
            <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "#4B5265" }}>Your Position — {gender === "male" ? "ACE" : "ACE"} Categories</p>
              <BFRangeBar bf={result.bf} gender={gender} />

              {(result.leanMass !== null || result.fatMass !== null) && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {result.leanMass !== null && (
                    <div className="rounded-lg p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(74,222,128,0.15)" }}>
                      <p className="text-[22px] font-semibold" style={{ color: "#4ade80" }}>{result.leanMass} kg</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>Lean Mass</p>
                    </div>
                  )}
                  {result.fatMass !== null && (
                    <div className="rounded-lg p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(239,68,68,0.15)" }}>
                      <p className="text-[22px] font-semibold" style={{ color: "#ef4444" }}>{result.fatMass} kg</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>Fat Mass</p>
                    </div>
                  )}
                </div>
              )}

              {showIndianNote && (
                <div className="rounded-lg p-3 mt-4" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <p className="text-[12px] font-semibold mb-1" style={{ color: "#fbbf24" }}>🇮🇳 South Asian Note</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "#8B92A5" }}>South Asians tend to store more visceral fat at equivalent BMI and body fat levels. Use this result alongside your <Link href="/tools/visceral-fat" style={{ color: "#a78bfa", textDecoration: "none" }}>WHtR from the Visceral Fat tool →</Link></p>
                </div>
              )}

              <p className="text-[11px] mt-4 leading-relaxed" style={{ color: "#4B5265" }}>Estimates based on peer-reviewed research. Individual results vary. Not medical advice — consult a qualified professional.</p>
            </div>

            {/* Handoff */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="rounded-xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}>
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>Next Step</span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Body fat measured. Now set your protein target to protect that muscle →</p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Using your body fat % gives a more accurate protein target than total weight.</p>
              <button onClick={() => router.push(`/tools/protein-target?w=${form.weight || ""}&bf=${result.bf}&g=${gender}&from=body-fat`)}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                Calculate My Protein Target →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
