"use client";

import { useState, useEffect } from "react";
import { Calculator, Lock, Shield } from "lucide-react";
import type { HandoffPrefilled } from "../lib/parseHandoffParams";
import { saveBodyProfile } from "@/hooks/useBodyProfile";

/* ─── Types ─────────────────────────────────────────────── */
type Goal     = "lose" | "maintain" | "gain";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very";

interface FormState {
  weight:   string;
  height:   string;
  age:      string;
  gender:   string;
  activity: Activity | "";
  goal:     Goal;
}

interface CalcResult {
  calories: number;
  protein:  number;
  carbs:    number;
  fat:      number;
}

/* ─── Constants ─────────────────────────────────────────── */
const ACTIVITY_OPTS: { id: Activity; label: string; desc: string }[] = [
  { id: "sedentary", label: "Sedentary",          desc: "Desk job, no exercise" },
  { id: "light",     label: "Lightly Active",      desc: "1–3 workouts/week" },
  { id: "moderate",  label: "Moderately Active",   desc: "3–5 workouts/week" },
  { id: "active",    label: "Very Active",         desc: "6–7 workouts/week" },
  { id: "very",      label: "Athlete",             desc: "Twice/day or physical job" },
];

const ACTIVITY_FACTORS: Record<Activity, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9,
};

const GOAL_OPTS: { id: Goal; label: string }[] = [
  { id: "lose",     label: "Fat Loss"    },
  { id: "maintain", label: "Maintain"    },
  { id: "gain",     label: "Muscle Gain" },
];

const GOAL_ADJUST: Record<Goal, number> = {
  lose: -400, maintain: 0, gain: 300,
};

/* ─── Mifflin-St Jeor ────────────────────────────────────── */
function calcMaintenance(
  weight: number, height: number, age: number,
  gender: string, activity: Activity, goal: Goal,
): CalcResult {
  const bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const calories = Math.round(bmr * ACTIVITY_FACTORS[activity] + GOAL_ADJUST[goal]);
  const protein  = Math.round(goal === "gain" ? weight * 2.2 : weight * 1.8);
  const fat      = Math.round((calories * 0.27) / 9);
  const carbs    = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat };
}

/* ─── Locked field ────────────────────────────────────────── */
function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-[12px] font-semibold" style={{ color: "#8B92A5" }}>{label}</label>
        <Lock size={10} color="#4ade80" />
      </div>
      <div
        className="w-full rounded-lg px-3 py-2.5 text-[14px] flex items-center justify-between"
        style={{
          background: "#111318", border: "1px solid rgba(74,210,128,0.2)",
          color: "#F2F4F8", cursor: "default", minHeight: "44px",
        }}
      >
        <span>{value}</span>
        <span style={{ color: "#4ade80", fontSize: "12px" }}>✓</span>
      </div>
    </div>
  );
}

/* ─── Props ───────────────────────────────────────────────── */
interface MacroFormProps {
  isHandoff: boolean;
  prefilled: Partial<HandoffPrefilled>;
  neatScore: number;
}

/* ─── Component ───────────────────────────────────────────── */
export function MacroForm({ isHandoff, prefilled, neatScore }: MacroFormProps) {
  const [form, setForm] = useState<FormState>({
    weight: "", height: "", age: "", gender: "male", activity: "", goal: "maintain",
  });
  const [result, setResult] = useState<CalcResult | null>(null);

  // Pre-fill locked fields from server-passed props
  useEffect(() => {
    if (isHandoff && prefilled.weight) {
      setForm((prev) => ({
        ...prev,
        weight:   prefilled.weight   ?? prev.weight,
        height:   prefilled.height   ?? prev.height,
        age:      prefilled.age      ?? prev.age,
        gender:   prefilled.gender   ?? prev.gender,
        activity: "",          // user must consciously select
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHandoff]);

  function calculate() {
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height);
    const a = parseInt(form.age);
    if (!w || !h || !a || !form.activity) return;
    const res = calcMaintenance(w, h, a, form.gender, form.activity as Activity, form.goal);
    setResult(res);
    // Save to shared profile so new tools can pre-fill maintenance_kcal
    saveBodyProfile({
      weight_kg:        w,
      height_cm:        h,
      age:              a,
      gender:           form.gender as "male" | "female",
      maintenance_kcal: form.goal === "maintain" ? res.calories : undefined,
      tdee_kcal:        res.calories,
    });
  }

  const canCalculate = !!form.weight && !!form.height && !!form.age && !!form.activity;

  const neatPct = result && neatScore > 0 && result.calories > 0
    ? Math.round((neatScore / result.calories) * 100)
    : null;

  return (
    <>
      {/* ── FORM CARD ── */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{
          background: "#0d0f14",
          border: isHandoff ? "1px solid rgba(167,139,250,0.15)" : "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Row 1: Weight + Height */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {isHandoff ? (
            <>
              <LockedField label="Weight (kg)" value={`${form.weight} kg`} />
              <LockedField label="Height (cm)" value={`${form.height} cm`} />
            </>
          ) : (
            <>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Weight (kg)</label>
                <input
                  type="number" min={30} max={250} placeholder="e.g. 72"
                  value={form.weight}
                  onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                  className="input-field" style={{ minHeight: 44 }}
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Height (cm)</label>
                <input
                  type="number" min={100} max={250} placeholder="e.g. 168"
                  value={form.height}
                  onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
                  className="input-field" style={{ minHeight: 44 }}
                />
              </div>
            </>
          )}
        </div>

        {/* Row 2: Age + Gender */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {isHandoff ? (
            <>
              <LockedField label="Age" value={form.age} />
              <LockedField label="Gender" value={form.gender === "male" ? "Male" : "Female"} />
            </>
          ) : (
            <>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Age</label>
                <input
                  type="number" min={10} max={100} placeholder="e.g. 28"
                  value={form.age}
                  onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                  className="input-field" style={{ minHeight: 44 }}
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Gender</label>
                <div className="flex gap-2">
                  {(["male", "female"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm((p) => ({ ...p, gender: g }))}
                      className="flex-1 rounded-lg text-[13px] font-semibold border transition-all duration-150"
                      style={{
                        minHeight: 44, padding: "0 12px",
                        border: form.gender === g ? "1px solid rgba(195,252,254,0.45)" : "1px solid rgba(255,255,255,0.08)",
                        background: form.gender === g ? "rgba(195,252,254,0.08)" : "transparent",
                        color: form.gender === g ? "#C3FCFE" : "#4B5265",
                      }}
                    >
                      {g === "male" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="my-4" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* Activity level */}
        <div className={`mb-4 ${isHandoff ? "neat-handoff-pulse" : ""}`}>
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>
            Activity Level
            {isHandoff && (
              <span className="ml-2 text-[10px] font-semibold tracking-[0.05em]" style={{ color: "#a78bfa" }}>
                ← Select this
              </span>
            )}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {ACTIVITY_OPTS.map((opt) => {
              const isSel = form.activity === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setForm((p) => ({ ...p, activity: opt.id }))}
                  className="w-full text-left rounded-lg px-3 py-2.5 transition-all duration-150"
                  style={{
                    border: isSel ? "1px solid rgba(167,139,250,0.55)" : "1px solid rgba(255,255,255,0.07)",
                    background: isSel ? "rgba(167,139,250,0.08)" : "transparent",
                    minHeight: 44,
                  }}
                >
                  <span className="text-[13px] font-semibold" style={{ color: isSel ? "#a78bfa" : "#F2F4F8" }}>
                    {opt.label}
                  </span>
                  <span className="ml-2 text-[11px]" style={{ color: "#4B5265" }}>{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Goal */}
        <div className="mb-5">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>Goal</label>
          <div className="grid grid-cols-3 gap-2">
            {GOAL_OPTS.map((g) => {
              const isSel = form.goal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setForm((p) => ({ ...p, goal: g.id }))}
                  className="rounded-lg text-[13px] font-semibold transition-all duration-150"
                  style={{
                    padding: "10px 8px", minHeight: 44,
                    border: isSel ? "1px solid rgba(195,252,254,0.45)" : "1px solid rgba(255,255,255,0.07)",
                    background: isSel ? "rgba(195,252,254,0.07)" : "transparent",
                    color: isSel ? "#C3FCFE" : "#4B5265",
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculate */}
        <button
          onClick={calculate}
          disabled={!canCalculate}
          className="w-full rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 transition-opacity duration-200"
          style={{
            background: "#C3FCFE", color: "#07090D", padding: "14px",
            opacity: canCalculate ? 1 : 0.35,
            cursor: canCalculate ? "pointer" : "not-allowed",
            border: "none", borderRadius: 8, minHeight: 52,
          }}
        >
          <Calculator size={16} />
          {isHandoff ? "Calculate My Maintenance Calories" : "Calculate"}
        </button>
      </div>

      {/* ── RESULT ── */}
      {result && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "#0d0f14",
            border: "1px solid rgba(195,252,254,0.12)",
            animation: "fadeInUp 0.45s ease both",
          }}
        >
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#6B6F9A" }}>
            Your Daily Targets
          </p>

          {/* Calorie number */}
          <div
            className="rounded-xl p-5 text-center mb-4"
            style={{ background: "#111318", border: "1px solid rgba(195,252,254,0.08)" }}
          >
            <p className="text-[52px] font-bold leading-none mb-1" style={{ color: "#F2F4F8", letterSpacing: "-0.02em" }}>
              {result.calories}
            </p>
            <p className="text-[13px]" style={{ color: "#8B92A5" }}>kcal / day</p>

            {/* NEAT contribution */}
            {neatPct !== null && (
              <p className="mt-3 text-[13px]" style={{ color: "#a78bfa" }}>
                Your NEAT contributes ~{neatScore} kcal/day of this total — that&apos;s{" "}
                <span className="font-semibold">{neatPct}%</span> of your full burn.
              </p>
            )}
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Protein", value: result.protein, unit: "g", color: "#C3FCFE", note: "Builds & repairs" },
              { label: "Carbs",   value: result.carbs,   unit: "g", color: "#60ADC7", note: "Primary energy" },
              { label: "Fat",     value: result.fat,     unit: "g", color: "#C69FF5", note: "Hormones & vitamins" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl p-3 text-center"
                style={{ background: "#111318", border: `1px solid ${m.color}22` }}
              >
                <p className="text-[26px] font-bold leading-none mb-0.5" style={{ color: m.color }}>
                  {m.value}<span className="text-[14px] font-normal opacity-60 ml-0.5">{m.unit}</span>
                </p>
                <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#F2F4F8" }}>{m.label}</p>
                <p className="text-[10px]" style={{ color: "#4B5265" }}>{m.note}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 rounded-lg p-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Shield size={13} color="#4B5265" style={{ flexShrink: 0, marginTop: 2 }} />
            <p className="text-[11px] leading-relaxed" style={{ color: "#4B5265" }}>
              Estimates based on the Mifflin-St Jeor equation (1990). Individual needs vary.
              Consult a registered dietitian if you have medical conditions.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes activityPulse {
          0%   { box-shadow: 0 0 0 0 rgba(167,139,250,0.3); }
          50%  { box-shadow: 0 0 0 6px rgba(167,139,250,0); }
          100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); }
        }
        .neat-handoff-pulse .grid-cols-1 > button:first-child {
          animation: activityPulse 1s ease 0.2s 2;
        }
      `}</style>
    </>
  );
}
