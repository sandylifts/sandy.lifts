"use client";

import { motion } from "framer-motion";

interface Props {
  onNext: () => void;
  isWomen: boolean;
}

const TRUST_ITEMS = [
  { icon: "🏆", text: "Science-backed plans, not bro science" },
  { icon: "📋", text: "Full roadmap — Week 1 to 180 days" },
  { icon: "⚡", text: "Personalized to your stats & goal" },
];

export function WelcomeStep({ onNext, isWomen }: Props) {
  const accent = isWomen ? "#FF69B4" : "#4DA3FF";
  const accentLight = isWomen ? "#FFB6C1" : "#66E6FF";
  const glowColor = isWomen ? "rgba(255,105,180,0.25)" : "rgba(77,163,255,0.25)";

  return (
    <div className="flex flex-col items-center text-center pt-4 pb-2">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: `linear-gradient(135deg, ${accent}22, ${accentLight}11)`,
          border: `1px solid ${accent}33`,
          boxShadow: `0 0 30px ${glowColor}`,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={accent} fillOpacity="0.2" />
        </svg>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-2xl font-bold mb-2"
        style={{ color: "#F5F7FA" }}
      >
        Your Transformation{" "}
        <span
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Starts Here
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-sm leading-relaxed mb-6"
        style={{ color: "#9A9EC4" }}
      >
        Answer 4 quick questions. We build a personalized plan based on your gender, experience, goal, and body stats. No guesswork. No generic plans.
      </motion.p>

      {/* Trust items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="w-full flex flex-col gap-3 mb-7"
      >
        {TRUST_ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left"
            style={{
              background: `${accent}08`,
              border: `1px solid ${accent}18`,
            }}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <span className="text-sm font-medium" style={{ color: "#D8DBFC" }}>{item.text}</span>
          </div>
        ))}
      </motion.div>

      {/* Notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[0.72rem] mb-5"
        style={{ color: "#6B6F9A" }}
      >
        Sandy.Lifts doesn't create generic plans. Your stats are required to build something real.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onNext}
        className="w-full py-3.5 rounded-xl font-bold text-sm relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
          color: "#05050B",
          boxShadow: `0 0 24px ${glowColor}`,
        }}
      >
        <span className="relative z-10">Build My Plan →</span>
      </motion.button>
    </div>
  );
}
