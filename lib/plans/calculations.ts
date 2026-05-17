import type { UserStats } from "./types";

// Mifflin-St Jeor BMR
function calcBMR(weight: number, height: number, age: number, isMale: boolean): number {
  if (isMale) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

// Activity multiplier for beginners (lightly active)
const ACTIVITY_MULTIPLIER = {
  beginner: 1.375,
  intermediate: 1.55,
  advanced: 1.725,
} as const;

export interface CalorieTargets {
  maintenance: number;
  target: number;
  protein: number; // grams
  description: string;
}

export function calcCalories(stats: UserStats): CalorieTargets {
  const isMale = stats.gender === "men";
  const bmr = calcBMR(stats.weight, stats.height, stats.age, isMale);
  const maintenance = Math.round(bmr * ACTIVITY_MULTIPLIER[stats.level]);
  const protein = Math.round(stats.weight * 2.0); // 2g/kg bodyweight

  let target: number;
  let description: string;

  switch (stats.goal) {
    case "fat-loss":
      target = maintenance - 300;
      description = `${maintenance - 300} kcal/day — 300 kcal deficit. Slow and sustainable fat loss.`;
      break;
    case "muscle-gain":
      target = maintenance + 250;
      description = `${maintenance + 250} kcal/day — 250 kcal surplus. Lean muscle gain without excess fat.`;
      break;
    case "maintain":
      target = maintenance;
      description = `${maintenance} kcal/day — Maintenance. Body recomposition possible.`;
      break;
  }

  return { maintenance, target, protein, description };
}

export function getBMI(weight: number, height: number): { bmi: number; category: string } {
  const heightM = height / 100;
  const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
  let category = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 25 && bmi < 30) category = "Overweight";
  else if (bmi >= 30) category = "Obese";
  return { bmi, category };
}
