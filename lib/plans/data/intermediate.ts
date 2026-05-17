import type { IntermediatePlan, Gender } from "../types";

const TOOLKIT_CTAS = [
  {
    title: "Calorie Deficit Calculator",
    description: "Dial in your deficit for the cutting phase.",
    href: "/tools/calorie-deficit",
    icon: "calculator",
  },
  {
    title: "Body Fat Estimator",
    description: "Track your body composition changes over time.",
    href: "/tools/body-fat",
    icon: "zap",
  },
  {
    title: "NEAT Estimator",
    description: "Non-exercise activity burns more calories than you think.",
    href: "/tools/neat-estimator",
    icon: "leaf",
  },
];

const MEN: IntermediatePlan = {
  type: "intermediate",
  gender: "men",
  tagline: "You know the basics. Now optimize everything.",
  tips: [
    {
      category: "Programming",
      tips: [
        "Switch from linear progression (add weight every session) to weekly progression — you can no longer add weight every session as a beginner could.",
        "Use periodization: alternate 4-week hypertrophy blocks (8–12 reps) with 4-week strength blocks (3–6 reps).",
        "Deload every 4–6 weeks — reduce ALL volume by 40% for one full week. This is mandatory, not optional.",
        "Track Rate of Perceived Exertion (RPE). Train at RPE 7–8 (2–3 reps left in tank). Not every set to failure.",
        "Introduce undulating periodization: vary rep ranges within the same week (strength Mon, hypertrophy Wed, metabolic Fri).",
      ],
    },
    {
      category: "Volume & Frequency",
      tips: [
        "You need 15–20 sets per muscle per week now. Beginners needed 10. Track your weekly sets.",
        "Train each muscle group twice per week minimum — once per week (bro split) is leaving gains on the table.",
        "PPL 6×/week or Upper/Lower 4×/week are both optimal at this level.",
        "Minimum effective volume (MEV) vs Maximum recoverable volume (MRV) — more isn't always better.",
        "If a muscle hasn't grown in 8 weeks with consistent training, add 2–3 sets per week to that muscle only.",
      ],
    },
    {
      category: "Compound Lifts — Intermediate Goals",
      tips: [
        "Squat: 1.5× bodyweight for 5 reps is a solid intermediate benchmark.",
        "Deadlift: 2× bodyweight for 1 rep is the intermediate milestone.",
        "Bench Press: 1× bodyweight for 5 reps is intermediate standard.",
        "Overhead Press: 0.75× bodyweight for 5 reps.",
        "Record your 1RM (one rep max) every 8–12 weeks and compare.",
      ],
    },
    {
      category: "Nutrition",
      tips: [
        "Track your macros daily — not just protein. Carbs fuel training performance directly.",
        "Protein 1.8–2.2g/kg. At this level, the upper end of the range matters more.",
        "Consider diet phases: 8–12 week cuts followed by 8–12 week maintenance or slight surplus.",
        "Creatine monohydrate 5g/day if not already using. The most evidence-backed supplement.",
        "Pre-workout nutrition: 30–60g carbs + 20g protein 60–90 min before training.",
      ],
    },
    {
      category: "Recovery",
      tips: [
        "Sleep 7–9 hours. At intermediate level, recovery becomes the limiting factor — not training.",
        "Manage stress — cortisol directly competes with testosterone and growth hormone.",
        "Active recovery: swimming, cycling at Zone 1–2 on rest days accelerates recovery.",
        "Joint health: face pulls, band pull-aparts, and hip mobility work are mandatory accessories.",
        "When in doubt, do less — overtraining is a real risk at intermediate level.",
      ],
    },
    {
      category: "Mind-Muscle Connection",
      tips: [
        "Slow the eccentric (lowering) phase to 3–4 seconds. This builds more muscle than just throwing weight.",
        "Squeeze the target muscle at the peak contraction for 1 second on every rep.",
        "Drop the ego — reduce weight 20% and feel the muscle working. Better stimulus = better growth.",
        "Visualization: mentally contract the muscle before the set begins.",
      ],
    },
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

const WOMEN: IntermediatePlan = {
  type: "intermediate",
  gender: "women",
  tagline: "Foundation is built. Now shape and sculpt.",
  tips: [
    {
      category: "Glute Development — Next Level",
      tips: [
        "Glutes need 16–20 sets/week to grow at intermediate level. Most women under-train them.",
        "Hip thrust: At intermediate level, aim for 1–1.25× bodyweight on the bar.",
        "Romanian Deadlift: 1× bodyweight is a strong intermediate benchmark for women.",
        "Cable kickbacks and abductor work are now important accessories — add 3–4 sets at end of leg days.",
        "Introduce B-stance hip thrust (single-leg emphasis) for glute asymmetry correction.",
      ],
    },
    {
      category: "Training Splits",
      tips: [
        "Consider a Glute-focused split: Glute heavy / Upper / Glute moderate + lower accessories / Upper — 4×/week.",
        "PPL 6×/week is now appropriate and highly effective.",
        "Deload every 4–6 weeks — reduce volume by 40% but maintain intensity.",
        "Alternate strength blocks (4–6 reps) and hypertrophy blocks (8–15 reps) every 4 weeks.",
      ],
    },
    {
      category: "Upper Body Development",
      tips: [
        "Lateral raises 4–5 sets/week build shoulder width — creates the hourglass illusion.",
        "Back training is underrated for women — a developed back creates posture, shape, and confidence.",
        "Pull-ups: Work toward unassisted pull-ups. Band-assisted → machine-assisted → full pull-up.",
        "Incline press targets upper chest — adds shape to the upper body.",
      ],
    },
    {
      category: "Nutrition & Hormones",
      tips: [
        "Cycle nutrition with menstrual phases: higher carbs in follicular (Day 1–14), slightly higher fats in luteal (Day 15–28).",
        "Protein stays at 2g/kg regardless of cycle phase.",
        "Women are more prone to under-eating. Track calories honestly — even on rest days.",
        "Iron-rich foods are important — training depletes iron stores, especially with menstruation.",
        "Don't fear carbs — complex carbs are mandatory for training performance and recovery.",
      ],
    },
    {
      category: "Progressive Overload — Advanced Techniques",
      tips: [
        "When you can't add weight: add reps (8→12), then add sets (3→4), then add weight.",
        "Use drop sets on last set of isolation exercises to push past a plateau.",
        "Introduce tempo training — 3-second eccentric on hip thrusts and squats.",
        "Rest-pause sets: do 8 reps, rest 15 seconds, do 3–4 more. Huge stimulus.",
      ],
    },
    {
      category: "Tracking Progress",
      tips: [
        "Weekly average weight (not daily) is the only meaningful scale metric.",
        "Monthly photos: same time, same lighting, same poses, front/side/back.",
        "Tape measurements: waist, hips, glutes (widest point), thighs — monthly.",
        "Performance tracking: hip thrust, squat, and deadlift numbers are your true report card.",
      ],
    },
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

export const intermediatePlans: Record<Gender, IntermediatePlan> = {
  men: MEN,
  women: WOMEN,
};
