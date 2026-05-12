"use client";

import { useSearchParams } from "next/navigation";

/* ─── Types ─────────────────────────────────────────────── */
export interface HandoffPrefilled {
  weight: string;
  height: string;
  age: string;
  gender: "male" | "female";
  activity: string;
}

export interface HandoffState {
  isHandoff: boolean;
  prefilled: Partial<HandoffPrefilled>;
  neatScore: number;
}

/* ─── Validators ─────────────────────────────────────────── */
function validWeight(v: number) { return v >= 30 && v <= 250; }
function validHeight(v: number) { return v >= 100 && v <= 250; }
function validAge(v: number)    { return v >= 10 && v <= 100; }
function validGender(v: string): v is "male" | "female" {
  return v === "male" || v === "female";
}
const VALID_ACTIVITY = new Set(["sedentary", "light", "moderate", "active", "very"]);

/* ─── Hook ───────────────────────────────────────────────── */
export function useHandoffParams(): HandoffState {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  // Not a handoff — return clean state
  if (from !== "neat") {
    return { isHandoff: false, prefilled: {}, neatScore: 0 };
  }

  // Parse params
  const w    = parseFloat(searchParams.get("w") ?? "");
  const h    = parseFloat(searchParams.get("h") ?? "");
  const a    = parseInt(searchParams.get("a")  ?? "");
  const g    = searchParams.get("g") ?? "";
  const act  = searchParams.get("act") ?? "moderate";
  const neat = parseInt(searchParams.get("neat") ?? "0");

  // Validate every field — if anything is invalid, ignore handoff entirely
  if (!validWeight(w) || !validHeight(h) || !validAge(a) || !validGender(g)) {
    return { isHandoff: false, prefilled: {}, neatScore: 0 };
  }

  // Sanitise activity
  const safeAct = VALID_ACTIVITY.has(act) ? act : "moderate";

  return {
    isHandoff: true,
    prefilled: {
      weight:   String(Math.round(w)),
      height:   String(Math.round(h)),
      age:      String(a),
      gender:   g,
      activity: safeAct,
    },
    neatScore: isNaN(neat) || neat < 0 ? 0 : neat,
  };
}
