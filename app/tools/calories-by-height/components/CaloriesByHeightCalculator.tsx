"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Baseline } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile, saveBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ── Research ──────────────────────────────────────────── */
const WHY = "Most calorie calculators require your current weight to work. But if you don't know what you SHOULD weigh, where do you even start? This tool works backwards from your height: it shows you the healthy weight range for your frame, and how many calories each scenario requires.";

const STUDIES: Study[] = [
  { name: "Misra A et al. — Nutrition 2009", detail: "Consensus guidelines for Asian Indians: healthy BMI 18.5–22.9. Used as basis for healthy weight range in this tool.", tag: "PRIMARY" },
  { name: "Mifflin MD et al. — American Journal of Clinical Nutrition 1990", detail: "498 subjects. Most accurate BMR equation for diverse populations. Outperforms Harris-Benedict by 5% across all weight groups.", tag: "PRIMARY" },
  { name: "Mifflin-St Jeor validation", detail: "BMR increases approximately 10 kcal per kg of body weight. Height adds approximately 6.25 kcal per cm.", tag: "SUPPORTING" },
];

const BOTTOM_LINE = "Knowing your healthy weight range before starting a diet gives you a realistic target — not just an arbitrary number from the scale. This tool shows you exactly what caloric intake corresponds to different points on your ideal healthy frame.";

/* ── Main Component ─────────────────────────────────────── */
type Goal = "fat-loss" | "maintenance" | "muscle-gain";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active";

interface Result {
  minW: number; midW: number; maxW: number;
  minK: number; midK: number; maxK: number;
  userW: number | null;
  userK: number | null;
  bmrPerKg: number;
}

export function CaloriesByHeightCalculator() {
  const profile = useBodyProfile();
  const router = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState({ height: "", age: "", weight: "" });
  const [gender, setGender] = useState<"male" | "female">("male");
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm((p) => ({
      ...p,
      height: profile.height_cm ? String(Math.round(profile.height_cm)) : p.height,
      age: profile.age ? String(profile.age) : p.age,
      weight: profile.weight_kg ? String(Math.round(profile.weight_kg)) : p.weight,
    }));
    if (profile.gender) setGender(profile.gender);
  }, [profile]);

  function getMultiplier(act: Activity) {
    if (act === "sedentary") return 1.2;
    if (act === "light") return 1.375;
    if (act === "moderate") return 1.55;
    if (act === "active") return 1.725;
    return 1.9;
  }

  function getGoalMod(g: Goal) {
    if (g === "fat-loss") return -400;
    if (g === "muscle-gain") return 300;
    return 0;
  }

  function calcCal(w: number, h: number, a: number, gen: "male"|"female", mult: number, mod: number) {
    const bmr = gen === "male" 
      ? (10 * w) + (6.25 * h) - (5 * a) + 5 
      : (10 * w) + (6.25 * h) - (5 * a) - 161;
    return Math.round((bmr * mult) + mod);
  }

  function calculate() {
    const h = parseFloat(form.height);
    const a = parseInt(form.age);
    if (!h || !a) return;

    const hm = h / 100;
    const minW = Math.round(18.5 * (hm * hm) * 10) / 10;
    const maxW = Math.round(22.9 * (hm * hm) * 10) / 10;
    const midW = Math.round(20.7 * (hm * hm) * 10) / 10;

    const mult = getMultiplier(activity);
    const mod = getGoalMod(goal);

    const minK = calcCal(minW, h, a, gender, mult, mod);
    const midK = calcCal(midW, h, a, gender, mult, mod);
    const maxK = calcCal(maxW, h, a, gender, mult, mod);

    const userW = form.weight ? parseFloat(form.weight) : null;
    const userK = userW ? calcCal(userW, h, a, gender, mult, mod) : null;

    // BMR approx diff per kg
    const bmrPerKg = Math.round(10 * mult);

    setResult({ minW, midW, maxW, minK, midK, maxK, userW, userK, bmrPerKg });
    
    // Write back
    saveBodyProfile({ height_cm: h, age: a, gender, weight_kg: userW ?? undefined });
  }

  const canCalc = !!form.height && !!form.age;

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
              <Baseline size={20} color="#a78bfa" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(167,139,250,0.08)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>MIFFLIN-ST JEOR · INDIAN BMI</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Calories by Height Calculator</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>Calculate how many calories you need based on your height, and see your Indian-specific healthy weight range.</p>
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

        {/* Height, Age, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Height (cm)</label>
            <input type="number" min={100} max={250} placeholder="e.g. 170"
              value={form.height} onChange={(e) => setForm(p => ({ ...p, height: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Age</label>
            <input type="number" min={10} max={100} placeholder="e.g. 28"
              value={form.age} onChange={(e) => setForm(p => ({ ...p, age: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Gender</label>
            <div className="flex gap-1">
              {(["male","female"] as const).map(g => (
                <button key={g} onClick={() => setGender(g)} className="flex-1 rounded-lg text-[13px] font-semibold" style={{ minHeight: 48, border: gender === g ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.08)", background: gender === g ? "rgba(167,139,250,0.08)" : "transparent", color: gender === g ? "#a78bfa" : "#4B5265" }}>
                  {g === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Weight optional */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Current Weight (kg) <span style={{ color: "#4B5265", fontWeight: 400 }}>(optional)</span></label>
          <input type="number" min={30} max={200} placeholder="e.g. 75"
            value={form.weight} onChange={(e) => setForm(p => ({ ...p, weight: e.target.value }))}
            className="w-full rounded-lg px-3 text-[14px]"
            style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
          />
        </div>

        {/* Goal */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Goal</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "fat-loss", label: "Fat Loss" },
              { id: "maintenance", label: "Maintain" },
              { id: "muscle-gain", label: "Muscle Gain" }
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
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "sedentary", label: "Sedentary" },
              { id: "light", label: "Lightly Active" },
              { id: "moderate", label: "Moderately Active" },
              { id: "active", label: "Active" },
              { id: "very-active", label: "Very Active" }
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
          Calculate Ideal Weight & Calories →
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {/* Range Card */}
            <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: "#a78bfa" }}>For Your Height: {form.height} cm</p>
              <p className="text-[14px] mb-4" style={{ color: "#F2F4F8" }}>Healthy weight range (Indian BMI): <strong style={{ color: "#4ade80" }}>{result.minW}–{result.maxW} kg</strong></p>

              <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)]" style={{ background: "#111318" }}>
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#8B92A5" }}>
                      <th className="px-4 py-3 font-semibold">Position</th>
                      <th className="px-4 py-3 font-semibold">Weight</th>
                      <th className="px-4 py-3 font-semibold text-right">Calories needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-4 py-3" style={{ color: "#8B92A5" }}>Lower end</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#F2F4F8" }}>{result.minW} kg</td>
                      <td className="px-4 py-3 font-semibold text-right" style={{ color: "#a78bfa" }}>{result.minK} kcal/day</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: "rgba(167,139,250,0.03)" }}>
                      <td className="px-4 py-3" style={{ color: "#8B92A5" }}>Mid-range</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#4ade80" }}>{result.midW} kg</td>
                      <td className="px-4 py-3 font-semibold text-right" style={{ color: "#C3FCFE" }}>{result.midK} kcal/day</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3" style={{ color: "#8B92A5" }}>Upper end</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#F2F4F8" }}>{result.maxW} kg</td>
                      <td className="px-4 py-3 font-semibold text-right" style={{ color: "#a78bfa" }}>{result.maxK} kcal/day</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* User Current Weight */}
              {result.userW && result.userK && (
                <div className="mt-5 p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px]" style={{ color: "#8B92A5" }}>Your current weight:</span>
                    <span className="text-[14px] font-semibold" style={{ color: "#F2F4F8" }}>{result.userW} kg</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px]" style={{ color: "#8B92A5" }}>Calories at your weight:</span>
                    <span className="text-[14px] font-semibold" style={{ color: "#fbbf24" }}>{result.userK} kcal/day</span>
                  </div>
                  
                  {result.userW < result.minW && (
                    <p className="text-[12px] pt-3 border-t border-[rgba(255,255,255,0.04)]" style={{ color: "#ef4444" }}>
                      You are {Math.round((result.minW - result.userW)*10)/10} kg below the healthy range for your height.
                    </p>
                  )}
                  {result.userW > result.maxW && (
                    <p className="text-[12px] pt-3 border-t border-[rgba(255,255,255,0.04)]" style={{ color: "#fbbf24" }}>
                      You are {Math.round((result.userW - result.maxW)*10)/10} kg above the healthy range for your height.
                    </p>
                  )}
                </div>
              )}

              <p className="text-[12px] mt-4 leading-relaxed pl-3 border-l-2" style={{ color: "#8B92A5", borderColor: "rgba(167,139,250,0.3)" }}>
                <strong style={{ color: "#F2F4F8" }}>Insight:</strong> Every additional kg of weight adds approximately <strong style={{ color: "#a78bfa" }}>{result.bmrPerKg} kcal</strong> to your daily needs. Height determines your frame — weight determines where in that frame you are.
              </p>
            </div>

            {/* Handoff */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="rounded-xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}>
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>Next Step</span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Weight range clear. Now calculate your exact maintenance calories →</p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Dial in your exact maintenance calories to start planning your specific nutrition protocol.</p>
              <button onClick={() => router.push(`/tools/maintenance-calories?h=${form.height}&a=${form.age}&g=${gender}&from=calories-by-height`)}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                Calculate Maintenance Calories →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
