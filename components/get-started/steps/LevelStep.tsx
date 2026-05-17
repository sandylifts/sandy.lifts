"use client";

import { motion } from "framer-motion";
import type { Level } from "@/lib/plans/types";

interface Props {
  value: Level | null;
  onChange: (l: Level) => void;
  isWomen: boolean;
}

const OPTIONS: { value: Level; label: string; duration: string; description: string; traits: string[] }[] = [
  {
    value: "beginner",
    label: "Beginner",
    duration: "0 – 12 months",
    description: "Little to no consistent training history. Still learning movements.",
    traits: [
      "No regular workout routine",
      "Unsure about form on compound lifts",
      "Haven't tracked calories or protein",
    ],
  },
  {
    value: "intermediate",
    label: "Intermediate",
    duration: "1 – 3 years",
    description: "Training consistently with a program. Knows the basics, seeing results.",
    traits: [
      "Training 3–5 days/week consistently",
      "Comfortable with squat, deadlift, bench",
      "Tracking some nutrition",
    ],
  },
  {
    value: "advanced",
    label: "Advanced",
    duration: "3+ years",
    description: "Structured programming for years. Understands periodization.",
    traits: [
      "Training 4–6 days/week with structured plan",
      "Tracks macros and progressive overload",
      "Has hit natural strength plateaus",
    ],
  },
];

export function LevelStep({ value, onChange, isWomen }: Props) {
  const accent = isWomen ? "#FF69B4" : "#4DA3FF";
  const accentLight = isWomen ? "#FFB6C1" : "#66E6FF";
  const glow = isWomen ? "rgba(255,105,180,0.2)" : "rgba(77,163,255,0.2)";

  return (
    <div className="pt-4 pb-2">
      <h2 className="text-xl font-bold text-center mb-1" style={{ color: "#F5F7FA" }}>
        What's your experience level?
      </h2>
      <p className="text-sm text-center mb-6" style={{ color: "#9A9EC4" }}>
        Be honest — the wrong level means the wrong plan.
      </p>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="text-left rounded-xl p-4 transition-all duration-200"
            style={{
              background: value === opt.value
                ? `linear-gradient(135deg, ${accent}15, ${accentLight}08)`
                : "rgba(255,255,255,0.02)",
              border: `1.5px solid ${value === opt.value ? accent : "rgba(255,255,255,0.08)"}`,
              boxShadow: value === opt.value ? `0 0 20px ${glow}` : "none",
            }}
            aria-pressed={value === opt.value}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm" style={{ color: value === opt.value ? accent : "#D8DBFC" }}>
                    {opt.label}
                  </span>
                  <span
                    className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: value === opt.value ? `${accent}20` : "rgba(255,255,255,0.04)",
                      color: value === opt.value ? accentLight : "#6B6F9A",
                      border: `1px solid ${value === opt.value ? `${accent}30` : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    {opt.duration}
                  </span>
                </div>
                <p className="text-xs mb-2.5" style={{ color: "#9A9EC4" }}>{opt.description}</p>
                <div className="flex flex-col gap-1">
                  {opt.traits.map((t, j) => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: value === opt.value ? accent : "#4A4A75" }}
                      />
                      <span className="text-[0.7rem]" style={{ color: value === opt.value ? "#D8DBFC" : "#6B6F9A" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {value === opt.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accentLight})` }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#05050B" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
