"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Salad } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ─── Research ────────────────────────────────────────────── */
const WHY =
  "Most fiber calculators give a flat '25g for women, 38g for men' — from American guidelines built on American diets. We use ICMR-NIN 2024, India's own dietary guidelines, scaled to your calorie intake. Because dal and sabzi aren't in American fiber tables.";

const STUDIES: Study[] = [
  { name: "ICMR-NIN Dietary Guidelines — 2024 (Government of India)", detail: "56.4% of India's total disease burden is due to unhealthy diets. Whole grains, pulses, vegetables explicitly recommended as fiber sources.", tag: "PRIMARY" },
  { name: "ICMR-NIN Nutrient Requirements for Indians — 2020", detail: "Fiber intake of 30g per 2000 kcal is the established Indian RDA.", tag: "PRIMARY" },
  { name: "Alahmari LA — Frontiers in Nutrition 2024", detail: "Dietary fiber reduces risk of CVD, T2D, obesity, and colon cancer. Soluble fiber increases satiety, slowing gastric emptying.", tag: "SUPPORTING" },
  { name: "Slavin JL — Nutrition 2005", detail: "Fiber fermentation produces SCFA (short-chain fatty acids) — key signal for satiety hormones GLP-1 and PYY.", tag: "SUPPORTING" },
];

const BOTTOM_LINE =
  "The average urban Indian gets 12–15g of fiber per day — about half of what they need. The gap is easy to close with dal at lunch and sabzi at dinner. You don't need supplements — you need to eat more of what Indian cooking already does well.";

/* ─── Indian food sources ─────────────────────────────────── */
const FOODS = [
  { food: "Masoor dal (cooked)", serving: "1 katori (150g)", fiber: 8   },
  { food: "Rajma (cooked)",      serving: "1 katori (150g)", fiber: 7.5 },
  { food: "Chana dal (cooked)",  serving: "1 katori (150g)", fiber: 6   },
  { food: "Whole wheat roti",    serving: "2 rotis",          fiber: 4   },
  { food: "Apple (with skin)",   serving: "1 medium",         fiber: 4.5 },
  { food: "Brown rice",          serving: "1 katori",         fiber: 3.5 },
  { food: "Chia seeds",          serving: "1 tbsp",           fiber: 5   },
  { food: "Bhindi (cooked)",     serving: "1 katori",         fiber: 3   },
  { food: "Banana",              serving: "1 medium",         fiber: 3   },
  { food: "Almonds",             serving: "10 pieces",        fiber: 1.5 },
];

type AgeGroup = "under18" | "18to50" | "above50";
type Goal     = "fatloss" | "gut" | "general";

/* ─── Main component ─────────────────────────────────────── */
export function FiberCalculator() {
  const profile = useBodyProfile();
  const router  = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState({ calories: "", ageGroup: "18to50" as AgeGroup, goal: "general" as Goal });
  const [result, setResult] = useState<{ target: number; gap: number } | null>(null);

  useEffect(() => {
    if (!profile) return;
    const cal = profile.maintenance_kcal ?? profile.tdee_kcal;
    if (cal) setForm((p) => ({ ...p, calories: String(Math.round(cal)) }));
  }, [profile]);

  function calculate() {
    const cal = parseFloat(form.calories);
    if (!cal || cal < 500 || cal > 8000) return;

    let base = (cal / 2000) * 30;
    if (form.ageGroup === "under18") base *= 0.85;
    if (form.ageGroup === "above50") base *= 0.90;
    if (form.goal === "fatloss") base += 3;
    if (form.goal === "gut")     base += 2;

    const target = Math.round(base);
    const gap    = Math.max(0, target - 13); // 13 = avg Indian urban diet midpoint
    setResult({ target, gap });
  }

  const canCalc = !!form.calories;
  const r = result;

  const AGE_OPTS: { id: AgeGroup; label: string }[] = [
    { id: "under18", label: "Under 18" },
    { id: "18to50",  label: "18 – 50"  },
    { id: "above50", label: "50+"       },
  ];
  const GOAL_OPTS: { id: Goal; label: string; desc: string }[] = [
    { id: "fatloss", label: "Fat Loss",        desc: "+3g for satiety" },
    { id: "gut",     label: "Gut Health",       desc: "+2g for microbiome" },
    { id: "general", label: "General Wellness", desc: "Base target"   },
  ];

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
      <Link href="/tools" className="inline-flex items-center gap-1.5 mb-8 transition-colors hover:text-[#F2F4F8]" style={{ color: "#4B5265", fontSize: "13px", textDecoration: "none" }}>
        <ArrowLeft size={14} /> Back to Toolkit
      </Link>

      {/* Header */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
              <Salad size={20} color="#4ade80" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(74,222,128,0.08)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>ICMR-NIN 2024 · IFCT 2017</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Fiber Needs Calculator</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>
          India-specific fiber targets based on ICMR-NIN 2024. Dal, sabzi, and rotis — not American portion sizes.
        </p>
        <AnimatePresence initial={false}>
          {researchOpen && (
            <motion.div key="research" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
              <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Details</p>

        <div className="mb-3">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Daily Calorie Intake (kcal)</label>
          <input type="number" min={500} max={8000} placeholder="e.g. 2000"
            value={form.calories}
            onChange={(e) => setForm((p) => ({ ...p, calories: e.target.value }))}
            className="w-full rounded-lg px-3 text-[14px]"
            style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
          />
          {!form.calories && (
            <p className="text-[11px] mt-1.5" style={{ color: "#4B5265" }}>
              Don&apos;t know yours?{" "}
              <Link href="/tools/macro-calculator" style={{ color: "#a78bfa", textDecoration: "none" }}>Calculate maintenance calories first →</Link>
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Age Group</label>
          <div className="flex gap-2">
            {AGE_OPTS.map((o) => (
              <button key={o.id} onClick={() => setForm((p) => ({ ...p, ageGroup: o.id }))}
                className="flex-1 rounded-lg text-[13px] font-semibold transition-all duration-150"
                style={{ minHeight: 44, border: form.ageGroup === o.id ? "1px solid rgba(74,222,128,0.45)" : "1px solid rgba(255,255,255,0.08)", background: form.ageGroup === o.id ? "rgba(74,222,128,0.08)" : "transparent", color: form.ageGroup === o.id ? "#4ade80" : "#4B5265" }}
              >{o.label}</button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Primary Goal</label>
          <div className="flex flex-col gap-2">
            {GOAL_OPTS.map((o) => (
              <button key={o.id} onClick={() => setForm((p) => ({ ...p, goal: o.id }))}
                className="w-full text-left rounded-lg px-3 py-2.5 transition-all duration-150 flex items-center justify-between"
                style={{ border: form.goal === o.id ? "1px solid rgba(74,222,128,0.45)" : "1px solid rgba(255,255,255,0.07)", background: form.goal === o.id ? "rgba(74,222,128,0.06)" : "transparent", minHeight: 48 }}
              >
                <span className="text-[13px] font-semibold" style={{ color: form.goal === o.id ? "#4ade80" : "#F2F4F8" }}>{o.label}</span>
                <span className="text-[11px]" style={{ color: "#4B5265" }}>{o.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={calculate} disabled={!canCalc}
          className="w-full rounded-lg text-[14px] font-semibold transition-opacity duration-200"
          style={{ background: "#4ade80", color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed", borderRadius: 8 }}
        >
          Calculate My Fiber Target →
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {r && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Targets */}
            <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(74,222,128,0.2)" }}>
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Fiber Targets</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Your Target",    value: `${r.target}g`,    color: "#4ade80"  },
                  { label: "Typical Indian", value: "~12–15g",          color: "#fbbf24"  },
                  { label: "Gap to Fill",    value: `+${r.gap}g/day`,   color: "#a78bfa"  },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[22px] font-semibold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Indian food table */}
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "#4B5265" }}>Indian Foods — Fiber Content (IFCT 2017)</p>
              <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <table className="w-full text-[12px]" style={{ minWidth: 320 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "#8B92A5" }}>Food</th>
                      <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "#8B92A5" }}>Serving</th>
                      <th className="text-right px-3 py-2.5 font-semibold" style={{ color: "#4ade80" }}>Fiber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FOODS.map((f, i) => (
                      <tr key={i} style={{ borderBottom: i < FOODS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td className="px-3 py-2" style={{ color: "#F2F4F8" }}>{f.food}</td>
                        <td className="px-3 py-2" style={{ color: "#4B5265" }}>{f.serving}</td>
                        <td className="px-3 py-2 text-right font-semibold" style={{ color: "#4ade80" }}>{f.fiber}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] mt-4 leading-relaxed" style={{ color: "#4B5265" }}>
                Estimates based on peer-reviewed research. Individual results vary. Not medical advice — consult a qualified professional before making changes.
              </p>
            </div>

            {/* Handoff CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>Next Step</span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Fiber target set. Now plan your diet break schedule →</p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Find out when to take a strategic break from dieting to beat adaptive thermogenesis.</p>
              <button onClick={() => router.push("/tools/diet-break?from=fiber-calculator")}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                Plan My Diet Break →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
