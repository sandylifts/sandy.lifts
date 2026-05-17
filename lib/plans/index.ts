export * from "./types";
export * from "./calculations";
export { beginnerMenPlans } from "./data/beginner-men";
export { beginnerWomenPlans } from "./data/beginner-women";
export { intermediatePlans } from "./data/intermediate";
export { advancedPlans } from "./data/advanced";

import type { FitnessPlan, Gender, Level, Goal } from "./types";
import { beginnerMenPlans } from "./data/beginner-men";
import { beginnerWomenPlans } from "./data/beginner-women";
import { intermediatePlans } from "./data/intermediate";
import { advancedPlans } from "./data/advanced";

export function getPlan(gender: Gender, level: Level, goal: Goal): FitnessPlan {
  if (level === "beginner") {
    return gender === "men"
      ? beginnerMenPlans[goal]
      : beginnerWomenPlans[goal];
  }
  if (level === "intermediate") {
    return intermediatePlans[gender];
  }
  return advancedPlans[gender];
}
