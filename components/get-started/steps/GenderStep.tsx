"use client";

import { motion } from "framer-motion";
import type { Gender } from "@/lib/plans/types";

interface Props {
  value: Gender | null;
  onChange: (g: Gender) => void;
}

const OPTIONS: { value: Gender; label: string; emoji: string; tagline: string; accent: string; accentLight: string; glow: string }[] = [
  {
    value: "men",
    label: "Men",
    emoji: "💪",
    tagline: "Built Different",
    accent: "#4DA3FF",
    accentLight: "#66E6FF",
    glow: "rgba(77,163,255,0.25)",
  },
  {
    value: "women",
    label: "Women",
    emoji: "✨",
    tagline: "Glow Up",
    accent: "#FF69B4",
    accentLight: "#FFB6C1",
    glow: "rgba(255,105,180,0.3)",
  },
];

export function GenderStep({ value, onChange }: Props) {
  return (
    <div className="pt-4 pb-2">
      <h2 className="text-xl font-bold text-center mb-1" style={{ color: "#F5F7FA" }}>
        Who are you building for?
      </h2>
      <p className="text-sm text-center mb-7" style={{ color: "#9A9EC4" }}>
        Your plan, exercises, and content will be tailored specifically for you.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl py-8 px-4 relative overflow-hidden transition-all duration-300"
            style={{
              background: value === opt.value
                ? `linear-gradient(145deg, ${opt.accent}22, ${opt.accentLight}11)`
                : "rgba(255,255,255,0.03)",
              border: `2px solid ${value === opt.value ? opt.accent : "rgba(255,255,255,0.08)"}`,
              boxShadow: value === opt.value ? `0 0 30px ${opt.glow}` : "none",
            }}
            aria-pressed={value === opt.value}
          >
            {/* Glow behind icon when selected */}
            {value === opt.value && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: `radial-gradient(circle at 50% 40%, ${opt.accent}15, transparent 70%)` }}
              />
            )}

            <span className="text-4xl">{opt.emoji}</span>

            <span className="text-lg font-bold relative z-10" style={{ color: value === opt.value ? opt.accent : "#D8DBFC" }}>
              {opt.label}
            </span>

            <span
              className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full relative z-10"
              style={{
                background: value === opt.value ? `${opt.accent}20` : "rgba(255,255,255,0.04)",
                color: value === opt.value ? opt.accentLight : "#6B6F9A",
                border: `1px solid ${value === opt.value ? `${opt.accent}40` : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {opt.tagline}
            </span>

            {value === opt.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${opt.accent}, ${opt.accentLight})` }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#05050B" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <p className="text-center text-[0.72rem] mt-5" style={{ color: "#6B6F9A" }}>
        This changes your entire plan — exercises, calories, and content.
      </p>
    </div>
  );
}
