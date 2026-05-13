"use client";

import { saveBodyProfile } from "@/hooks/useBodyProfile";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DualScaleTable } from "./components/DualScaleTable";
import { NEATQuiz } from "./components/NEATQuiz";
import { IButtonPanel } from "./components/IButtonPanel";

/* ─── i-button data ─────────────────────────────────────── */
const BMI_PANEL = {
  why: "Standard WHO BMI cutoffs were developed on Caucasian populations. South Asians develop type 2 diabetes and cardiovascular disease at significantly lower BMI values. We show both scales so you understand your actual risk — not just a global average.",
  studies: [
    { name: "WHO Expert Consultation, 2004", detail: "Asian population BMI advisory — Lancet", tag: "PRIMARY" as const },
    { name: "Misra A et al., 2009", detail: "Consensus guidelines for Asian Indians — Nutrition", tag: "COMPARED" as const },
    { name: "Ntuk UE et al., 2014", detail: "South Asian BMI cutoffs — Diabetologia PMC3198431", tag: "COMPARED" as const },
    { name: "Sattar N et al., 2021", detail: "Ethnicity-specific BMI & T2D risk — The Lancet Diabetes", tag: "COMPARED" as const },
  ],
  bottomLine:
    "If you are Indian and your WHO BMI says 'Normal' but your Indian BMI says 'Overweight' — listen to the Indian scale. Your metabolic risk is already elevated. Waist measurement matters just as much as BMI for assessing visceral fat.",
};

const NEAT_PANEL = {
  why: "Most fitness tools only count gym workouts. But research shows NEAT — everything else you do — can vary by up to 2,000 kcal/day between people with the same body weight. A sedentary desk worker and an active person eating the same food can have dramatically different results.",
  studies: [
    { name: "Levine JA et al., 2005", detail: "Science — Posture & NEAT interindividual variation", tag: "PRIMARY" as const },
    { name: "Levine JA, 2004", detail: "Am J Physiol Endocrinol Metab — NEAT definition", tag: "COMPARED" as const },
    { name: "Lanningham-Foster L et al., 2003", detail: "Obes Res — Domestic activity calorie cost", tag: "COMPARED" as const },
    { name: "Endotext NCBI, 2022", detail: "NEAT in Human Energy Homeostasis — occupational ranges", tag: "COMPARED" as const },
  ],
  bottomLine:
    "Obese individuals sit on average 2 hours longer per day than lean people. Simply standing more, walking to get groceries, and cooking your own food could burn 300–500 extra kcal daily — no gym required. NEAT is the most overlooked variable in body composition.",
  quote:
    '"Obese individuals sat 2 hours more per day than lean. Closing that gap = 350 kcal/day = ~16 kg/year." — Levine JA et al., Science 2005',
};

/* ─── Helper ────────────────────────────────────────────── */
function calcBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

/* ─── Page ───────────────────────────────────────────────── */
export default function NEATEstimatorPage() {
  // Step 1 state
  const [form, setForm] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "male" as "male" | "female",
    waist: "",
  });
  const [bmi, setBmi] = useState<number | null>(null);
  const [selectedScale, setSelectedScale] = useState<"who" | "indian">("indian");
  const [step1Done, setStep1Done] = useState(false);

  // Refs for scroll
  const step2Ref = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height);
    const a = parseInt(form.age);
    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return;
    const result = calcBMI(w, h);
    setBmi(result);
    setStep1Done(true);
    // Save to shared profile for pre-fill across all tools
    saveBodyProfile({
      weight_kg:  w,
      height_cm:  h,
      age:        a,
      gender:     form.gender,
      waist_cm:   parseFloat(form.waist) || undefined,
    });
  }

  function handleContinue() {
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const weightNum = parseFloat(form.weight) || 0;
  const waistNum = parseFloat(form.waist) || 0;
  const showWaistWarning =
    waistNum > 0 &&
    ((form.gender === "male" && waistNum > 90) ||
      (form.gender === "female" && waistNum > 80));

  return (
    <div className="min-h-screen bg-[#07090D] text-white overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "rgba(167,139,250,0.06)", animation: "blobDrift 14s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[40%] right-[5%] w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: "rgba(195,252,254,0.04)", animation: "blobDrift 18s ease-in-out infinite reverse" }}
        />
      </div>

      <style>{`
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.5s ease both; }
      `}</style>

      <div className="relative z-10 max-w-[720px] mx-auto px-5 md:px-8 pt-28 pb-24">

        {/* ── Back link ── */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-[13px] text-[#6B6F9A] hover:text-[#9A9EC4] transition-colors duration-200 mb-8"
        >
          ← Back to Toolkit
        </Link>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-[rgba(167,139,250,0.12)] border border-[rgba(167,139,250,0.25)] flex items-center justify-center text-[22px]">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-full bg-[rgba(167,139,250,0.1)] text-[#a78bfa] border border-[rgba(167,139,250,0.3)]">
                  LIVE
                </span>
                <span className="text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-full bg-[rgba(195,252,254,0.08)] text-[#C3FCFE] border border-[rgba(195,252,254,0.2)]">
                  5 PEER-REVIEWED SOURCES
                </span>
              </div>
              <h1 className="text-[22px] font-bold text-[#F5F7FA] leading-tight">
                BMI + NEAT Estimator
              </h1>
            </div>
          </div>
          <p className="text-[14px] text-[#6B6F9A] leading-[1.75] max-w-[560px]">
            Two connected tools in one flow. Step 1 calculates your BMI using dual WHO and Asian
            Indian cutoffs. Step 2 estimates your Non-Exercise Activity Thermogenesis — the calories
            you burn outside the gym that most people completely ignore.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════
            STEP 1 — BMI CALCULATOR
        ══════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.02)] p-6 mb-6"
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[rgba(195,252,254,0.1)] border border-[rgba(195,252,254,0.25)] flex items-center justify-center text-[11px] font-bold text-[#C3FCFE]">
                1
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A]">Step 1</p>
                <p className="text-[16px] font-semibold text-[#F5F7FA]">BMI Calculator</p>
              </div>
            </div>
            <IButtonPanel {...BMI_PANEL} />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Weight */}
            <div>
              <label className="block text-[12px] font-semibold text-[#D8DBFC] mb-1.5 tracking-[0.5px]">
                Weight (kg)
              </label>
              <input
                id="neat-weight"
                type="number"
                min="30"
                max="300"
                placeholder="e.g. 72"
                value={form.weight}
                onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-[12px] font-semibold text-[#D8DBFC] mb-1.5 tracking-[0.5px]">
                Height (cm)
              </label>
              <input
                id="neat-height"
                type="number"
                min="100"
                max="250"
                placeholder="e.g. 168"
                value={form.height}
                onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-[12px] font-semibold text-[#D8DBFC] mb-1.5 tracking-[0.5px]">
                Age
              </label>
              <input
                id="neat-age"
                type="number"
                min="16"
                max="90"
                placeholder="e.g. 28"
                value={form.age}
                onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Gender toggle */}
            <div>
              <label className="block text-[12px] font-semibold text-[#D8DBFC] mb-1.5 tracking-[0.5px]">
                Gender
              </label>
              <div className="flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    id={`gender-${g}`}
                    onClick={() => setForm((p) => ({ ...p, gender: g }))}
                    className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold border transition-all duration-200 ${
                      form.gender === g
                        ? "border-[rgba(195,252,254,0.5)] bg-[rgba(195,252,254,0.1)] text-[#C3FCFE]"
                        : "border-[rgba(255,255,255,0.1)] text-[#6B6F9A] hover:border-[rgba(255,255,255,0.2)]"
                    }`}
                  >
                    {g === "male" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>

            {/* Waist */}
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-[#D8DBFC] mb-1.5 tracking-[0.5px]">
                Waist Circumference (cm){" "}
                <span className="text-[#6B6F9A] font-normal">— optional, recommended</span>
              </label>
              <input
                id="neat-waist"
                type="number"
                min="40"
                max="200"
                placeholder="e.g. 85"
                value={form.waist}
                onChange={(e) => setForm((p) => ({ ...p, waist: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          {/* Waist warning */}
          <AnimatePresence>
            {showWaistWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mb-4"
              >
                <div className="rounded-xl border border-[rgba(251,146,60,0.35)] bg-[rgba(251,146,60,0.07)] p-3.5 flex items-start gap-2.5">
                  <span className="text-[16px] shrink-0">⚠️</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#fb923c] mb-0.5">
                      High visceral fat risk (Indian consensus)
                    </p>
                    <p className="text-[12px] text-[#9A9EC4] leading-[1.65]">
                      {form.gender === "male"
                        ? "Waist > 90 cm in men indicates elevated abdominal obesity risk by Indian consensus guidelines."
                        : "Waist > 80 cm in women indicates elevated abdominal obesity risk by Indian consensus guidelines."}{" "}
                      Waist measurement is often more predictive of metabolic risk than BMI alone.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calculate button */}
          <button
            id="bmi-calculate"
            onClick={handleCalculate}
            disabled={!form.weight || !form.height || !form.age}
            className="w-full py-3.5 rounded-xl border border-[rgba(195,252,254,0.35)] bg-[rgba(195,252,254,0.08)] text-[#C3FCFE] font-semibold text-[14px] hover:bg-[rgba(195,252,254,0.15)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Calculate BMI →
          </button>

          {/* BMI Results */}
          <AnimatePresence>
            {bmi !== null && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.07)]"
              >
                {/* Big BMI number */}
                <div className="text-center mb-6">
                  <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A] mb-2">
                    Your BMI
                  </p>
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-[64px] font-bold leading-none text-[#F5F7FA]">{bmi}</span>
                    <span className="text-[16px] text-[#6B6F9A] mb-3">kg/m²</span>
                  </div>
                </div>

                {/* Dual Scale Table */}
                <DualScaleTable
                  bmi={bmi}
                  selectedScale={selectedScale}
                  onScaleChange={setSelectedScale}
                />

                {/* Continue CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-6"
                >
                  <button
                    id="continue-to-neat"
                    onClick={handleContinue}
                    className="w-full py-4 rounded-xl font-bold text-[15px] tracking-[1px] border transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(198,159,245,0.15) 100%)",
                      borderColor: "rgba(167,139,250,0.5)",
                      color: "#C69FF5",
                    }}
                  >
                    Continue to NEAT Estimator →
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ══════════════════════════════════════════════
            STEP 2 — NEAT QUIZ
        ══════════════════════════════════════════════ */}
        <motion.section
          ref={step2Ref}
          id="neat-estimator-step2"
          initial={{ opacity: 0 }}
          animate={{ opacity: step1Done ? 1 : 0.35 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl border bg-[rgba(255,255,255,0.02)] p-6 scroll-mt-28 ${
            step1Done
              ? "border-[rgba(167,139,250,0.2)]"
              : "border-[rgba(255,255,255,0.06)] pointer-events-none"
          }`}
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all duration-500 ${
                  step1Done
                    ? "bg-[rgba(167,139,250,0.15)] border-[rgba(167,139,250,0.4)] text-[#a78bfa]"
                    : "bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)] text-[#444]"
                }`}
              >
                2
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A]">Step 2</p>
                <p className="text-[16px] font-semibold text-[#F5F7FA]">NEAT Estimator</p>
              </div>
            </div>
            <IButtonPanel {...NEAT_PANEL} />
          </div>

          {!step1Done && (
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 text-center">
              <p className="text-[13px] text-[#444]">Complete Step 1 to unlock the NEAT quiz</p>
            </div>
          )}

          {step1Done && weightNum > 0 && (
            <NEATQuiz
              weightKg={weightNum}
              heightCm={parseFloat(form.height) || 0}
              age={parseInt(form.age) || 0}
              gender={form.gender}
            />
          )}
        </motion.section>

        {/* Bottom disclaimer */}
        <p className="text-center text-[11px] text-[#444] mt-8">
          All calculations are research-based estimates. Not medical advice. Consult a registered
          dietitian for personalised guidance.
        </p>
      </div>
    </div>
  );
}
