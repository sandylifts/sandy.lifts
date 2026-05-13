"use client";

import { useRouter } from "next/navigation";

/* ─── Types ─────────────────────────────────────────────── */
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface NEATHandoffData {
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: "male" | "female";
  neat_score: number;
}

/* ─── Hook ───────────────────────────────────────────────── */
export function useNEATHandoff(data: NEATHandoffData) {
  const router = useRouter();

  function handleHandoff(activityLevel: ActivityLevel) {
    // Validate data before navigation — never pass garbage
    const w = Math.round(data.weight_kg);
    const h = Math.round(data.height_cm);
    const a = data.age;

    if (w < 30 || w > 250) return;
    if (h < 100 || h > 250) return;
    if (a < 10 || a > 100) return;
    if (data.gender !== "male" && data.gender !== "female") return;

    // Map very_active → very (macro-calculator internal key)
    const actParam = activityLevel === "very_active" ? "very" : activityLevel;

    const params = new URLSearchParams({
      w: String(w),
      h: String(h),
      a: String(a),
      g: data.gender,
      act: actParam,
      neat: String(Math.round(data.neat_score)),
      from: "neat",
    });

    router.push(`/tools/macro-calculator?${params.toString()}`);
  }

  return { handleHandoff };
}
