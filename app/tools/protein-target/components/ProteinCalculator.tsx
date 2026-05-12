"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Beef, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile, saveBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ── Research ──────────────────────────────────────────── */
const WHY = "The ICMR recommendation of 0.8–1g/kg is a minimum to prevent deficiency — not a target for people who exercise. The global evidence from 49 studies and 1,863 participants shows that 1.6g/kg is the threshold for maximising muscle growth. For fat loss, we go slightly higher (2.0g/kg) because muscle preservation during a deficit requires more protein.";

const STUDIES: Study[] = [
  { name: "Morton RW et al. — British Journal of Sports Medicine 2018", detail: "49 studies, 1,863 participants. Breakpoint at 1.62g/kg for muscle gain. Upper 95% CI: 2.2g/kg. For fat loss phases, aim for the upper end.", tag: "PRIMARY" },
  { name: "ScienceDirect Meta-Analysis — Clinical Nutrition ESPEN 2024", detail: "47 studies, 3,218 participants. Higher protein (1.2–1.6g/kg) vs normal (0.8g/kg) significantly prevents muscle loss during weight loss. SMD 0.75 (p<0.001).", tag: "PRIMARY" },
  { name: "ISSN Position Stand — Journal of the International Society of Sports Nutrition", detail: "1.4–2.0 g/kg/day sufficient for most exercising individuals. 2.3–3.1 g/kg during hypocaloric periods to maximise lean mass retention.", tag: "SUPPORTING" },
  { name: "ICMR-NIN Dietary Guidelines — 2024", detail: "Whole food protein sources recommended. Dal, paneer, eggs, chicken, fish explicitly listed as high-quality Indian protein sources.", tag: "SUPPORTING" },
];

const BOTTOM_LINE = "The average Indian gets 0.6–0.8g protein per kg per day — enough to survive, not enough to build or maintain muscle. If you're eating in a deficit, working out, or over 40, you need more protein than ICMR's baseline. Start with 1.6g/kg and adjust based on how your body responds.";

/* ── Indian Food Data ───────────────────────────────────── */
type FoodItem = { name: string; serving: string; protein: number; type: "veg" | "non-veg" | "vegan" | "dairy" };

const FOOD_DB: FoodItem[] = [
  { name: "Paneer", serving: "100g", protein: 18, type: "dairy" },
  { name: "Moong dal (cooked)", serving: "1 katori", protein: 14, type: "vegan" },
  { name: "Rajma (cooked)", serving: "1 katori", protein: 13, type: "vegan" },
  { name: "Chana dal (cooked)", serving: "1 katori", protein: 12, type: "vegan" },
  { name: "Soya chunks (dry)", serving: "30g", protein: 15, type: "vegan" },
  { name: "Greek yogurt / Hung curd", serving: "100g", protein: 10, type: "dairy" },
  { name: "Whole milk", serving: "1 glass (250ml)", protein: 8, type: "dairy" },
  { name: "Peanuts", serving: "30g", protein: 8, type: "vegan" },
  { name: "Tofu (firm)", serving: "100g", protein: 10, type: "vegan" },
  { name: "Roasted chana", serving: "30g", protein: 6, type: "vegan" },
  { name: "Chicken breast", serving: "100g (cooked)", protein: 31, type: "non-veg" },
  { name: "Eggs (boiled)", serving: "2 eggs", protein: 13, type: "non-veg" },
  { name: "Fish (rohu/tuna)", serving: "100g", protein: 25, type: "non-veg" },
  { name: "Egg whites", serving: "3 whites", protein: 11, type: "non-veg" },
  { name: "Tempeh", serving: "100g", protein: 19, type: "vegan" },
  { name: "Edamame", serving: "100g", protein: 11, type: "vegan" },
  { name: "Chia seeds", serving: "2 tbsp", protein: 5, type: "vegan" },
];

/* ── Main Component ─────────────────────────────────────── */
type Goal = "fat-loss" | "muscle-gain" | "maintenance";
type Activity = "sedentary" | "light" | "moderate" | "active";
type DietType = "veg" | "non-veg" | "vegan";

interface Result {
  target: number;
  rangeMin: number;
  rangeMax: number;
  basis: "lean-mass" | "total-weight";
}

export function ProteinCalculator() {
  const profile = useBodyProfile();
  const router = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState({ weight: "", bf: "" });
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [dietType, setDietType] = useState<DietType>("veg");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm((p) => ({
      ...p,
      weight: profile.weight_kg ? String(Math.round(profile.weight_kg)) : p.weight,
      bf: profile.body_fat_pct ? String(profile.body_fat_pct) : p.bf,
    }));
  }, [profile]);

  function calculate() {
    const w = parseFloat(form.weight);
    const bf = parseFloat(form.bf);
    if (!w) return;

    let baseMultiplier = 1.4;
    if (goal === "fat-loss") baseMultiplier = 2.0;
    if (goal === "muscle-gain") baseMultiplier = 1.8;

    let actMultiplier = 1.0;
    if (activity === "sedentary") actMultiplier = 0.9;
    if (activity === "moderate") actMultiplier = 1.1;
    if (activity === "active") actMultiplier = 1.2;

    const multiplier = baseMultiplier * actMultiplier;
    const minM = 1.6 * actMultiplier;
    const maxM = 2.2 * actMultiplier;

    let target = 0, rangeMin = 0, rangeMax = 0;
    let basis: "lean-mass" | "total-weight" = "total-weight";

    if (bf > 0 && bf < 60) {
      basis = "lean-mass";
      const leanMass = w * (1 - bf / 100);
      target = Math.round(leanMass * multiplier);
      rangeMin = Math.round(leanMass * minM);
      rangeMax = Math.round(leanMass * maxM);
    } else {
      basis = "total-weight";
      target = Math.round(w * multiplier);
      rangeMin = Math.round(w * minM);
      rangeMax = Math.round(w * maxM);
    }

    setResult({ target, rangeMin, rangeMax, basis });
    saveBodyProfile({ protein_target_g: target, weight_kg: w });
  }

  const getFoodTable = () => {
    return FOOD_DB.filter(item => {
      if (dietType === "vegan") return item.type === "vegan";
      if (dietType === "veg") return item.type === "vegan" || item.type === "dairy";
      return true; // non-veg gets everything
    });
  };

  const canCalc = !!form.weight;

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
              <Beef size={20} color="#a78bfa" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(167,139,250,0.08)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>MORTON 2018 · ISSN</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Protein Target Calculator</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>Evidence-based daily protein calculator with Indian vegetarian and non-vegetarian food sources.</p>
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
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Details</p>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Weight (kg)</label>
            <input type="number" min={0} placeholder="e.g. 75"
              value={form.weight}
              onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Body Fat % <span style={{ color: "#4B5265", fontWeight: 400 }}>(optional)</span></label>
            <input type="number" min={0} max={60} placeholder="e.g. 20"
              value={form.bf}
              onChange={(e) => setForm((p) => ({ ...p, bf: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
            {!form.bf && (
              <p className="text-[11px] mt-1.5" style={{ color: "#4B5265" }}>
                Know your body fat %? <Link href="/tools/body-fat" style={{ color: "#a78bfa", textDecoration: "none" }}>Body Fat Calculator →</Link>
              </p>
            )}
          </div>
        </div>

        {/* Goal */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Goal</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "fat-loss", label: "Fat Loss" },
              { id: "muscle-gain", label: "Muscle Gain" },
              { id: "maintenance", label: "Maintenance" }
            ].map(g => (
              <button key={g.id} onClick={() => setGoal(g.id as Goal)} className="rounded-lg text-[13px] font-semibold transition-all duration-150" style={{ minHeight: 44, border: goal === g.id ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.08)", background: goal === g.id ? "rgba(167,139,250,0.08)" : "transparent", color: goal === g.id ? "#a78bfa" : "#4B5265" }}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="mb-5">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Activity Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: "sedentary", label: "Sedentary" },
              { id: "light", label: "Lightly Active" },
              { id: "moderate", label: "Moderately Active" },
              { id: "active", label: "Very Active" }
            ].map(a => (
              <button key={a.id} onClick={() => setActivity(a.id as Activity)} className="rounded-lg text-[12px] font-semibold transition-all duration-150" style={{ minHeight: 44, border: activity === a.id ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.08)", background: activity === a.id ? "rgba(167,139,250,0.08)" : "transparent", color: activity === a.id ? "#a78bfa" : "#4B5265" }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={calculate} disabled={!canCalc}
          className="w-full rounded-lg text-[14px] font-semibold transition-opacity duration-200"
          style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed", borderRadius: 8 }}
        >
          Calculate Protein Target →
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {/* Target Card */}
            <div className="rounded-xl p-5 mb-4 text-center" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: "#a78bfa" }}>Daily Protein Target</p>
              <p className="text-[52px] font-semibold leading-none mb-1" style={{ color: "#F2F4F8", letterSpacing: "-0.02em" }}>{result.target}<span className="text-[24px]">g</span></p>
              <p className="text-[13px]" style={{ color: "#8B92A5" }}>Recommended range: <strong style={{ color: "#F2F4F8" }}>{result.rangeMin}–{result.rangeMax}g/day</strong></p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-lg p-3" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[18px] font-semibold" style={{ color: "#F2F4F8" }}>{Math.round(result.target / 3)}g</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>Target for 3 meals</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[18px] font-semibold" style={{ color: "#F2F4F8" }}>{Math.round(result.target / 4)}g</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>Target for 4 meals</p>
                </div>
              </div>
              
              <p className="text-[11px] mt-4" style={{ color: "#4B5265" }}>Calculated using {result.basis === "lean-mass" ? "lean body mass" : "total body weight"}.</p>
            </div>

            {/* ICMR Note */}
            <div className="rounded-lg p-4 mb-4" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)" }}>
              <p className="text-[12px] font-semibold mb-1" style={{ color: "#60a5fa" }}>ℹ️ ICMR Note</p>
              <p className="text-[12px] leading-relaxed" style={{ color: "#8B92A5" }}>ICMR RDA for sedentary adults is 0.8–1g/kg. That&apos;s a minimum to prevent deficiency — not a target. For active individuals, evidence supports 1.6–2.2g/kg for optimal muscle maintenance.</p>
            </div>

            {/* Food Sources */}
            <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: "#4B5265" }}>Indian Food Sources</p>
                <div className="flex bg-[#111318] rounded-md p-0.5 border border-[rgba(255,255,255,0.04)]">
                  {(["veg", "non-veg", "vegan"] as const).map(dt => (
                    <button key={dt} onClick={() => setDietType(dt)} className="text-[10px] font-semibold px-2 py-1 rounded transition-colors" style={{ background: dietType === dt ? "rgba(255,255,255,0.08)" : "transparent", color: dietType === dt ? "#F2F4F8" : "#4B5265" }}>
                      {dt === "non-veg" ? "Non-Veg" : dt === "veg" ? "Veg" : "Vegan"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr style={{ color: "#8B92A5", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <th className="pb-2 font-semibold">Food</th>
                      <th className="pb-2 font-semibold">Serving</th>
                      <th className="pb-2 font-semibold text-right">Protein</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFoodTable().map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td className="py-2.5" style={{ color: "#F2F4F8" }}>{item.name}</td>
                        <td className="py-2.5" style={{ color: "#8B92A5" }}>{item.serving}</td>
                        <td className="py-2.5 text-right font-semibold" style={{ color: "#a78bfa" }}>{item.protein}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] mt-3" style={{ color: "#4B5265" }}>Protein values from Indian Food Composition Tables (IFCT 2017) · ICMR-NIN</p>

              {/* Sample Day */}
              <div className="mt-5 p-3 rounded-lg border border-[rgba(74,222,128,0.2)]" style={{ background: "rgba(74,222,128,0.05)" }}>
                <p className="text-[12px] font-semibold mb-1" style={{ color: "#4ade80" }}>Sample day to hit {result.target}g</p>
                <p className="text-[12px]" style={{ color: "#8B92A5" }}>
                  {dietType === "veg" && "1 katori dal (14g) + 100g paneer (18g) + 1 glass milk (8g) + 30g peanuts (8g) = 48g. Add a 30g protein shake (25g) to hit ~73g easily."}
                  {dietType === "non-veg" && "1 katori dal (14g) + 100g chicken breast (31g) + 3 egg whites (11g) = 56g. Two meals like this covers >110g."}
                  {dietType === "vegan" && "1 katori dal (14g) + 30g soya chunks (15g) + 100g tofu (10g) + 30g peanuts (8g) = 47g. Add a vegan protein shake for extra boost."}
                </p>
              </div>
            </div>

            {/* Handoff */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="rounded-xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}>
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>Next Step</span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Protein target set. See how your calorie deficit stacks up →</p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Check if your calorie target supports your protein needs without muscle loss.</p>
              <button onClick={() => router.push(`/tools/calorie-deficit?w=${form.weight}&from=protein-target`)}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                Plan My Calorie Deficit →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
