"use client";

import { motion } from "framer-motion";
import type { Goal } from "@/lib/plans/types";

interface Props {
  value: Goal | null;
  onChange: (g: Goal) => void;
  isWomen: boolean;
}

const MEN_OPTIONS: { value: Goal; emoji: string; label: string; subtitle: string; description: string }[] = [
  {
    value: "fat-loss",
    emoji: "🔥",
    label: "Fat Loss",
    subtitle: "Burn fat, keep muscle",
    description: "Caloric deficit + weight training. Preserve every gram of muscle while losing fat.",
  },
  {
    value: "muscle-gain",
    emoji: "💪",
    label: "Muscle Gain",
    subtitle: "Build size & strength",
    description: "Caloric surplus + progressive overload. Build muscle as efficiently as possible.",
  },
  {
    value: "maintain",
    emoji: "⚖️",
    label: "Recomposition",
    subtitle: "Same weight, better body",
    description: "Maintenance calories + training. Swap fat for muscle without changing scale weight.",
  },
];

const WOMEN_OPTIONS: { value: Goal; emoji: string; label: string; subtitle: string; description: string }[] = [
  {
    value: "fat-loss",
    emoji: "✨",
    label: "Fat Loss",
    subtitle: "Lean, toned, glowing",
    description: "Slight deficit + resistance training. Preserve muscle while your body reshapes itself.",
  },
  {
    value: "muscle-gain",
    emoji: "🌸",
    label: "Build & Tone",
    subtitle: "Shape and definition",
    description: "Slight surplus + compound lifts. Build the lean, sculpted body you actually want.",
  },
  {
    value: "maintain",
    emoji: "💎",
    label: "Glow Up",
    subtitle: "Transform without the scale moving",
    description: "Maintenance calories + progressive overload. Dramatically change your shape.",
  },
];

export function GoalStep({ value, onChange, isWomen }: Props) {
  const accent = isWomen ? "#FF69B4" : "#4DA3FF";
  const accentLight = isWomen ? "#FFB6C1" : "#66E6FF";
  const glow = isWomen ? "rgba(255,105,180,0.2)" : "rgba(77,163,255,0.2)";
  const options = isWomen ? WOMEN_OPTIONS : MEN_OPTIONS;

  return (
    <div className="pt-4 pb-2">
      <h2 className="text-xl font-bold text-center mb-1" style={{ color: "#F5F7FA" }}>
        What's your primary goal?
      </h2>
      <p className="text-sm text-center mb-6" style={{ color: "#9A9EC4" }}>
        Your training split, calorie target, and plan structure depend on this.
      </p>

      <div className="flex flex-col gap-3">
        {options.map((opt, i) => (
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
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{opt.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm" style={{ color: value === opt.value ? accent : "#D8DBFC" }}>
                    {opt.label}
                  </span>
                  {value === opt.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${accentLight})` }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#05050B" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </motion.div>
                  )}
                </div>
                <p className="text-[0.72rem] font-semibold mb-1" style={{ color: value === opt.value ? accentLight : "#6B6F9A" }}>
                  {opt.subtitle}
                </p>
                <p className="text-xs" style={{ color: "#9A9EC4" }}>{opt.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
