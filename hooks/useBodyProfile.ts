"use client";

import { useState, useEffect } from "react";

const PROFILE_KEY = "sandylifts_profile";

export interface BodyProfile {
  weight_kg?:        number;
  height_cm?:        number;
  age?:              number;
  gender?:           "male" | "female";
  waist_cm?:         number;
  maintenance_kcal?: number;
  tdee_kcal?:        number;
  body_fat_pct?:     number;   // written by Body Fat tool
  protein_target_g?: number;   // written by Protein Target tool
}

/**
 * Reads the Sandy.Lifts body profile from localStorage.
 * Returns null on SSR or if no data stored yet.
 * Use this in Client Components to silently pre-fill form fields.
 */
export function useBodyProfile(): BodyProfile | null {
  const [profile, setProfile] = useState<BodyProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfile(JSON.parse(raw) as BodyProfile);
    } catch {
      // localStorage unavailable or malformed JSON — fail silently
    }
  }, []);

  return profile;
}

/**
 * Merges partial updates into the stored profile.
 * Call this after a successful calculation to keep the profile fresh.
 * Safe to call on SSR (no-ops).
 */
export function saveBodyProfile(updates: Partial<BodyProfile>): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    const current: BodyProfile = raw ? (JSON.parse(raw) as BodyProfile) : {};
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...updates }));
  } catch {
    // silently fail
  }
}
