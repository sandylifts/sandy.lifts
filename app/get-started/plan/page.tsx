import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPlan, calcCalories } from "@/lib/plans";
import type { Gender, Level, Goal } from "@/lib/plans/types";
import { PlanDisplay } from "./PlanDisplay";

interface Props {
  searchParams: Promise<{
    gender?: string;
    level?: string;
    goal?: string;
    age?: string;
    weight?: string;
    height?: string;
  }>;
}

const VALID_GENDERS: Gender[] = ["men", "women"];
const VALID_LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
const VALID_GOALS: Goal[] = ["fat-loss", "muscle-gain", "maintain"];

const DISPLAY_NAMES: Record<string, string> = {
  "men-beginner-fat-loss": "Men · Beginner · Fat Loss",
  "men-beginner-muscle-gain": "Men · Beginner · Muscle Gain",
  "men-beginner-maintain": "Men · Beginner · Recomposition",
  "men-intermediate-fat-loss": "Men · Intermediate",
  "men-intermediate-muscle-gain": "Men · Intermediate",
  "men-intermediate-maintain": "Men · Intermediate",
  "men-advanced-fat-loss": "Men · Advanced",
  "men-advanced-muscle-gain": "Men · Advanced",
  "men-advanced-maintain": "Men · Advanced",
  "women-beginner-fat-loss": "Women · Beginner · Fat Loss",
  "women-beginner-muscle-gain": "Women · Beginner · Muscle Gain",
  "women-beginner-maintain": "Women · Beginner · Glow Up",
  "women-intermediate-fat-loss": "Women · Intermediate",
  "women-intermediate-muscle-gain": "Women · Intermediate",
  "women-intermediate-maintain": "Women · Intermediate",
  "women-advanced-fat-loss": "Women · Advanced",
  "women-advanced-muscle-gain": "Women · Advanced",
  "women-advanced-maintain": "Women · Advanced",
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const gender = params.gender as Gender;
  const level = params.level as Level;
  const goal = params.goal as Goal;
  const key = `${gender}-${level}-${goal}`;
  const name = DISPLAY_NAMES[key] ?? "Your Personalized Plan";
  return {
    title: `${name} — Personalized Fitness Plan`,
    description: `Your custom Sandy.Lifts fitness plan — science-backed, personalized for your stats and goals.`,
    robots: { index: false },
  };
}

export default async function PlanPage({ searchParams }: Props) {
  const params = await searchParams;

  const gender = params.gender as Gender;
  const level = params.level as Level;
  const goal = params.goal as Goal;
  const age = Number(params.age);
  const weight = Number(params.weight);
  const height = Number(params.height);

  // Validate all required params
  if (
    !VALID_GENDERS.includes(gender) ||
    !VALID_LEVELS.includes(level) ||
    !VALID_GOALS.includes(goal) ||
    !age || age < 14 || age > 80 ||
    !weight || weight < 30 || weight > 300 ||
    !height || height < 120 || height > 250
  ) {
    redirect("/");
  }

  const plan = getPlan(gender, level, goal);
  const calories = calcCalories({ gender, level, goal, age, weight, height });
  const key = `${gender}-${level}-${goal}`;
  const displayName = DISPLAY_NAMES[key] ?? "Your Plan";
  const isWomen = gender === "women";

  return (
    <div
      className="min-h-screen"
      style={{
        background: isWomen
          ? "linear-gradient(180deg, #0d0509 0%, #130810 30%, #07090D 100%)"
          : "linear-gradient(180deg, #07090D 0%, #05050B 100%)",
      }}
    >
      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none"
        style={{
          background: isWomen
            ? "radial-gradient(circle, rgba(255,105,180,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(77,163,255,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <PlanDisplay
            plan={plan}
            calories={calories}
            isWomen={isWomen}
            displayName={displayName}
          />
        </div>
      </div>
    </div>
  );
}
