export type Gender = "men" | "women";
export type Level = "beginner" | "intermediate" | "advanced";
export type Goal = "fat-loss" | "muscle-gain" | "maintain";

export interface UserStats {
  gender: Gender;
  level: Level;
  goal: Goal;
  age: number;
  weight: number; // kg
  height: number; // cm
}

export interface WeekPlan {
  week: string;
  focus: string;
  schedule: DaySchedule[];
  nutrition: string;
  keyRule: string;
}

export interface DaySchedule {
  day: string;
  label: string;
  exercises?: ExerciseEntry[];
  note?: string;
}

export interface ExerciseEntry {
  name: string;
  sets: string;
  reps: string;
  note?: string;
}

export interface Phase {
  title: string;
  duration: string;
  goal: string;
  weeks: WeekPlan[];
}

export interface MythBuster {
  myth: string;
  truth: string;
}

export interface SplitExplainer {
  name: string;
  frequency: string;
  bestFor: string;
  schedule: string;
  recommended: boolean;
}

export interface BeginnerPlan {
  type: "beginner";
  gender: Gender;
  goal: Goal;
  tagline: string;
  myths: MythBuster[];
  splitExplainers: SplitExplainer[];
  phases: Phase[];
  keyPrinciples: string[];
  toolkitCTA: ToolkitCTA[];
}

export interface TipSection {
  category: string;
  tips: string[];
}

export interface IsolationExercise {
  muscle: string;
  exercises: { name: string; cue: string }[];
}

export interface IntermediatePlan {
  type: "intermediate";
  gender: Gender;
  tagline: string;
  tips: TipSection[];
  toolkitCTA: ToolkitCTA[];
}

export interface AdvancedPlan {
  type: "advanced";
  gender: Gender;
  tagline: string;
  tips: TipSection[];
  isolationLibrary: IsolationExercise[];
  toolkitCTA: ToolkitCTA[];
}

export interface ToolkitCTA {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export type FitnessPlan = BeginnerPlan | IntermediatePlan | AdvancedPlan;
