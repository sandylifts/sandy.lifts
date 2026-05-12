"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNEATHandoff, type ActivityLevel, type NEATHandoffData } from "../hooks/useNEATHandoff";

/* ─── Types ─────────────────────────────────────────────── */
interface HandoffCTAProps {
  bmiData: NEATHandoffData;
  neatScore: number;
}

/* ─── Activity options ───────────────────────────────────── */
const ACTIVITY_OPTIONS: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: "sedentary",   label: "Sedentary",        desc: "Desk job, no exercise" },
  { id: "light",       label: "Lightly Active",    desc: "1–3 workouts/week" },
  { id: "moderate",    label: "Moderately Active", desc: "3–5 workouts/week" },
  { id: "active",      label: "Very Active",       desc: "Daily exercise or physical job" },
];

/* ─── Pre-filled Chip ────────────────────────────────────── */
function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5"
      style={{
        background: "#111318",
        border: "1px solid rgba(74,210,128,0.18)",
      }}
    >
      <span className="text-[11px] text-[#4B5265]">{label}</span>
      <span className="text-[12px] font-semibold text-[#F2F4F8]">{value}</span>
      <span className="text-[11px]" style={{ color: "#4ade80" }}>✓</span>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────── */
export function HandoffCTA({ bmiData, neatScore }: HandoffCTAProps) {
  const [selected, setSelected] = useState<ActivityLevel | null>(null);
  const { handleHandoff } = useNEATHandoff(bmiData);

  const canProceed = selected !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl p-5"
      style={{
        background: "#0d0f14",
        border: "1px solid rgba(167,139,250,0.2)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[10px] font-semibold tracking-[0.1em] uppercase rounded-md px-2 py-1"
          style={{
            background: "rgba(167,139,250,0.1)",
            color: "#a78bfa",
          }}
        >
          Next Step
        </span>
        <span className="text-[11px]" style={{ color: "#4B5265" }}>
          ~2 min
        </span>
      </div>

      {/* Title */}
      <p className="text-[15px] font-semibold mb-0.5" style={{ color: "#F2F4F8" }}>
        Your NEAT is ~{neatScore} kcal/day
      </p>
      <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>
        Now find your complete daily calorie need
      </p>

      {/* Pre-filled chips */}
      <div className="flex flex-wrap gap-2 mb-1.5">
        <DataChip label="Weight" value={`${Math.round(bmiData.weight_kg)} kg`} />
        <DataChip label="Height" value={`${Math.round(bmiData.height_cm)} cm`} />
        <DataChip label="Age"    value={`${bmiData.age}`} />
        <DataChip
          label="Gender"
          value={bmiData.gender === "male" ? "Male" : "Female"}
        />
      </div>
      <p
        className="text-[11px] italic mb-5"
        style={{ color: "#4B5265" }}
      >
        Already filled from your BMI data ↑
      </p>

      {/* Activity level selector */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold mb-2.5" style={{ color: "#8B92A5" }}>
          One thing left → Your activity level:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="text-left rounded-lg px-3 py-2.5 transition-all duration-150"
                style={{
                  border: isSelected
                    ? "1px solid rgba(167,139,250,0.6)"
                    : "1px solid rgba(255,255,255,0.07)",
                  background: isSelected
                    ? "rgba(167,139,250,0.08)"
                    : "transparent",
                  minHeight: "44px",
                }}
              >
                <p
                  className="text-[12px] font-semibold leading-tight"
                  style={{ color: isSelected ? "#a78bfa" : "#F2F4F8" }}
                >
                  {opt.label}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "#4B5265" }}
                >
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA button */}
      <button
        disabled={!canProceed}
        onClick={() => selected && handleHandoff(selected)}
        className="w-full rounded-lg text-[14px] font-semibold transition-opacity duration-200"
        style={{
          background: "#a78bfa",
          color: "#07090D",
          padding: "14px",
          opacity: canProceed ? 1 : 0.4,
          cursor: canProceed ? "pointer" : "not-allowed",
          borderRadius: "8px",
          border: "none",
          minHeight: "52px",
        }}
      >
        {canProceed
          ? "Calculate My Maintenance Calories →"
          : "Select your activity level to continue"}
      </button>

      {/* Sub-text */}
      <p
        className="text-[11px] text-center mt-2.5"
        style={{ color: "#4B5265" }}
      >
        You&apos;re ~2 minutes from knowing your exact daily calorie target.
      </p>
    </motion.div>
  );
}
