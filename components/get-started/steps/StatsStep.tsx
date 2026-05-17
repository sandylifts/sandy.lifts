"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { FormData } from "../GetStartedModal";

interface Props {
  form: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onSubmit: () => void;
  isWomen: boolean;
}

export function StatsStep({ form, onChange, onSubmit, isWomen }: Props) {
  const accent = isWomen ? "#FF69B4" : "#4DA3FF";
  const accentLight = isWomen ? "#FFB6C1" : "#66E6FF";
  const glow = isWomen ? "rgba(255,105,180,0.2)" : "rgba(77,163,255,0.2)";

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.age || form.age < 14 || form.age > 80) e.age = "Enter a valid age (14–80)";
    if (!form.weight || form.weight < 30 || form.weight > 300) e.weight = "Enter a valid weight (30–300 kg)";
    if (!form.height || form.height < 120 || form.height > 250) e.height = "Enter a valid height (120–250 cm)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  const fields: {
    key: keyof Pick<FormData, "age" | "weight" | "height">;
    label: string;
    unit: string;
    placeholder: string;
    min: number;
    max: number;
    why: string;
  }[] = [
    {
      key: "age",
      label: "Age",
      unit: "years",
      placeholder: "e.g. 25",
      min: 14,
      max: 80,
      why: "Affects BMR calculation",
    },
    {
      key: "weight",
      label: "Current Weight",
      unit: "kg",
      placeholder: "e.g. 70",
      min: 30,
      max: 300,
      why: "Used to calculate maintenance calories",
    },
    {
      key: "height",
      label: "Height",
      unit: "cm",
      placeholder: "e.g. 175",
      min: 120,
      max: 250,
      why: "Required for accurate calorie target",
    },
  ];

  return (
    <div className="pt-4 pb-2">
      <h2 className="text-xl font-bold text-center mb-1" style={{ color: "#F5F7FA" }}>
        Your stats
      </h2>
      <p className="text-sm text-center mb-2" style={{ color: "#9A9EC4" }}>
        All fields are required. Without these, we can't calculate your maintenance calories.
      </p>

      {/* Mandatory notice */}
      <div
        className="flex items-start gap-2.5 rounded-xl p-3 mb-5"
        style={{
          background: `${accent}08`,
          border: `1px solid ${accent}20`,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-[0.7rem] leading-relaxed" style={{ color: accentLight }}>
          Sandy.Lifts team doesn't create generic plans. These numbers build your personal calorie target, protein goal, and 180-day roadmap.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {fields.map((field, i) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold" style={{ color: "#D8DBFC" }}>
                {field.label}
              </label>
              <span className="text-[0.65rem]" style={{ color: "#6B6F9A" }}>{field.why}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                value={form[field.key] ?? ""}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : null;
                  onChange({ [field.key]: v });
                  if (errors[field.key]) setErrors((prev: Record<string, string>) => ({ ...prev, [field.key]: "" }));
                }}
                className="w-full rounded-xl px-4 py-3 pr-14 text-sm font-medium outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${errors[field.key] ? "#FF4444" : form[field.key] ? accent : "rgba(255,255,255,0.1)"}`,
                  color: "#F5F7FA",
                  boxShadow: form[field.key] && !errors[field.key] ? `0 0 12px ${glow}` : "none",
                }}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold"
                style={{ color: form[field.key] ? accent : "#6B6F9A" }}
              >
                {field.unit}
              </span>
            </div>
            {errors[field.key] && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[0.68rem] mt-1.5"
                style={{ color: "#FF6666" }}
              >
                {errors[field.key]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Submit */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-bold text-sm mt-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
          color: "#05050B",
          boxShadow: `0 0 30px ${glow}`,
        }}
      >
        {/* Shimmer */}
        <motion.div
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
        />
        <span className="relative z-10">Build My Personalized Plan →</span>
      </motion.button>

      <p className="text-center text-[0.65rem] mt-3" style={{ color: "#6B6F9A" }}>
        Free. No account required. Your data stays on your device.
      </p>
    </div>
  );
}
