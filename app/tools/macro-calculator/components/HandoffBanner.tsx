"use client";

import { motion } from "framer-motion";

interface HandoffBannerProps {
  neatScore: number;
}

export function HandoffBanner({ neatScore }: HandoffBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-xl px-4 py-3 mb-6"
      style={{
        background: "rgba(167,139,250,0.06)",
        border: "1px solid rgba(167,139,250,0.15)",
      }}
    >
      {/* Header */}
      <p
        className="text-[11px] font-semibold mb-1"
        style={{ color: "#a78bfa" }}
      >
        ↩ Continuing from your NEAT Estimator
      </p>

      {/* NEAT score */}
      {neatScore > 0 && (
        <p className="text-[13px] mb-0.5" style={{ color: "#F2F4F8" }}>
          Your NEAT score:{" "}
          <span className="font-semibold">~{neatScore} kcal/day</span>
        </p>
      )}

      {/* Instruction */}
      <p className="text-[12px]" style={{ color: "#8B92A5" }}>
        We&apos;ve pre-filled your details below. Just confirm your activity level →
      </p>
    </motion.div>
  );
}
