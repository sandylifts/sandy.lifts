import type { BeginnerPlan, Goal, ToolkitCTA } from "../types";

const TOOLKIT_CTAS: ToolkitCTA[] = [
  {
    title: "Calorie & Macro Calculator",
    description: "Calculate your exact maintenance calories and protein target based on your stats.",
    href: "/tools/macro-calculator",
    icon: "calculator",
  },
  {
    title: "Protein Target Tool",
    description: "Find your daily protein goal — the most important number in your plan.",
    href: "/tools/protein-target",
    icon: "zap",
  },
  {
    title: "Fiber Calculator",
    description: "Fiber regulates hormones, gut health, and appetite. Essential for women.",
    href: "/tools/fiber-calculator",
    icon: "leaf",
  },
];

const FAT_LOSS: BeginnerPlan = {
  type: "beginner",
  gender: "women",
  goal: "fat-loss",
  tagline: "Lean, strong, and glowing — on your terms.",
  myths: [
    {
      myth: "Lifting weights will make me look bulky like a man.",
      truth: "Women have 10–20× less testosterone than men. Accidental 'bulking' is physiologically impossible without steroids and years of extreme effort. Lifting gives you the lean, toned look you actually want.",
    },
    {
      myth: "I should stick to cardio for fat loss.",
      truth: "Resistance training builds muscle, and muscle burns more calories at rest. Women who lift lose fat faster and keep it off longer than those who only do cardio.",
    },
    {
      myth: "Light weights, high reps for toning.",
      truth: "'Toning' is just muscle + low body fat. To get there, you need progressive overload with challenging weights — not 2 kg pink dumbbells forever.",
    },
    {
      myth: "I shouldn't train during my period.",
      truth: "Light to moderate training is safe and often helps with cramps. Listen to your body. Low energy days = lower intensity. Not a reason to skip the week.",
    },
    {
      myth: "The scale is going up — I must be gaining fat.",
      truth: "Women retain water before their period (2–4 kg). Muscle is denser than fat. Judge progress by measurements, photos, and how clothes fit — not daily scale fluctuations.",
    },
  ],
  splitExplainers: [
    {
      name: "Full Body (3×/week)",
      frequency: "3 days/week",
      bestFor: "Beginners — highest muscle frequency for fastest results",
      schedule: "Mon / Wed / Fri",
      recommended: true,
    },
    {
      name: "Upper / Lower Split",
      frequency: "4 days/week",
      bestFor: "Week 9+ — more volume when needed",
      schedule: "Mon Upper / Tue Lower / Thu Upper / Fri Lower",
      recommended: false,
    },
    {
      name: "Glute / Upper / Full Body",
      frequency: "3–4 days/week",
      bestFor: "Women who want to prioritize glute development",
      schedule: "Mon Glute / Wed Upper / Fri Full Body",
      recommended: false,
    },
    {
      name: "Push / Pull / Legs",
      frequency: "6 days/week",
      bestFor: "Month 3+ when you need more volume",
      schedule: "Push / Pull / Legs / repeat",
      recommended: false,
    },
  ],
  phases: [
    {
      title: "Phase 1 — Foundation",
      duration: "Week 1 – 4",
      goal: "Learn hip-hinge and squat patterns. Activate glutes. Build the habit.",
      weeks: [
        {
          week: "Week 1–2",
          focus: "Form first. Glute activation before every session.",
          schedule: [
            {
              day: "Monday",
              label: "Full Body A",
              exercises: [
                { name: "Glute Bridge", sets: "3", reps: "15", note: "Activation warm-up. Squeeze glutes hard at the top." },
                { name: "Goblet Squat", sets: "3", reps: "12", note: "Feet slightly wider than hip-width, toes slightly out" },
                { name: "Push-up (knee or full)", sets: "3", reps: "10", note: "Core tight, straight line from knee to shoulder" },
                { name: "Dumbbell Row", sets: "3", reps: "12 each", note: "Flat back, elbow drives back, squeeze shoulder blade" },
                { name: "Plank", sets: "3", reps: "30 sec" },
              ],
              note: "Rest 60–90 seconds. Walk 20 min after.",
            },
            {
              day: "Tuesday",
              label: "Rest / Walk",
              note: "20–30 min walk. Gentle movement, not a workout.",
            },
            {
              day: "Wednesday",
              label: "Full Body B",
              exercises: [
                { name: "Hip Thrust (bodyweight)", sets: "3", reps: "15", note: "The queen of glute exercises. Drive hips fully up, squeeze hard." },
                { name: "Romanian Deadlift (RDL)", sets: "3", reps: "12", note: "Feel hamstring stretch — not lower back. This is key." },
                { name: "Dumbbell Shoulder Press", sets: "3", reps: "10" },
                { name: "Lat Pulldown", sets: "3", reps: "12", note: "Full stretch at top, pull to upper chest" },
                { name: "Side Plank", sets: "3", reps: "20 sec each side" },
              ],
            },
            {
              day: "Friday",
              label: "Full Body A (repeat)",
              exercises: [
                { name: "Glute Bridge", sets: "3", reps: "15" },
                { name: "Goblet Squat", sets: "3", reps: "12" },
                { name: "Push-up", sets: "3", reps: "10" },
                { name: "Dumbbell Row", sets: "3", reps: "12 each" },
                { name: "Plank", sets: "3", reps: "35 sec", note: "Add 5 seconds from Monday" },
              ],
            },
          ],
          nutrition: "Eat at maintenance this week. Don't cut calories yet — your body needs to adapt to training. Hit protein target daily.",
          keyRule: "Glute activation before every session. Most women have underactive glutes from sitting. 5 mins of activation = 3× better results from hip thrusts and squats.",
        },
        {
          week: "Week 3–4",
          focus: "Add load. If form is clean, increase weight.",
          schedule: [
            {
              day: "Mon / Wed / Fri",
              label: "Same exercises — add weight",
              note: "Add 2.5 kg if all reps were clean last week. No ego — form is the priority.",
            },
          ],
          nutrition: "Start a 200–300 kcal daily deficit. Do NOT cut more than this — low energy = poor training = muscle loss.",
          keyRule: "The hip thrust and RDL are your most important exercises. Master these before adding heavy weight.",
        },
      ],
    },
    {
      title: "Phase 2 — Strength Building",
      duration: "Week 5 – 12",
      goal: "Introduce barbell. Build real strength. Glutes and back are priority.",
      weeks: [
        {
          week: "Week 5–8",
          focus: "Upper/Lower 4×/week. Barbell hip thrust and squat introduced.",
          schedule: [
            {
              day: "Monday",
              label: "Lower A — Glute & Quad Focus",
              exercises: [
                { name: "Barbell Hip Thrust", sets: "4", reps: "10", note: "Bar across hips, upper back on bench, drive hips to full extension. This is your KEY lift." },
                { name: "Barbell Squat (or Goblet)", sets: "4", reps: "8", note: "Depth is important. Break parallel if mobility allows." },
                { name: "Romanian Deadlift", sets: "3", reps: "10" },
                { name: "Leg Press (feet high)", sets: "3", reps: "12", note: "High foot placement targets glutes more" },
                { name: "Abductor Machine", sets: "3", reps: "15", note: "Glute med — important for hip stability" },
                { name: "Standing Calf Raise", sets: "3", reps: "15" },
              ],
            },
            {
              day: "Tuesday",
              label: "Upper A — Pull Focus",
              exercises: [
                { name: "Lat Pulldown", sets: "4", reps: "10", note: "Build that V-shape back" },
                { name: "Dumbbell Row", sets: "4", reps: "10 each" },
                { name: "Face Pull (Cable)", sets: "3", reps: "15", note: "Shoulder health and posture correction" },
                { name: "DB Shoulder Press", sets: "3", reps: "10" },
                { name: "Dumbbell Curl", sets: "3", reps: "12" },
              ],
            },
            {
              day: "Thursday",
              label: "Lower B — Hamstring & Glute Focus",
              exercises: [
                { name: "Conventional Deadlift", sets: "4", reps: "6", note: "Learn this lift properly. The most important lift in fitness." },
                { name: "Bulgarian Split Squat", sets: "3", reps: "10 each", note: "Glute-dominant. Front foot further forward." },
                { name: "Leg Curl", sets: "3", reps: "12" },
                { name: "Cable Kickback", sets: "3", reps: "15 each", note: "Keep hips square, squeeze glute at top" },
                { name: "Walking Lunge", sets: "3", reps: "12 each" },
              ],
            },
            {
              day: "Friday",
              label: "Upper B — Push Focus",
              exercises: [
                { name: "DB Bench Press", sets: "4", reps: "10" },
                { name: "Incline DB Press", sets: "3", reps: "10" },
                { name: "Lateral Raise", sets: "4", reps: "15", note: "Builds shoulder width — creates the hourglass effect" },
                { name: "Tricep Pushdown", sets: "3", reps: "12" },
                { name: "Cable Row", sets: "3", reps: "12" },
              ],
            },
          ],
          nutrition: "300 kcal deficit. Protein 1.8–2g/kg. Don't fear carbs — complex carbs fuel hip thrusts. Cut processed sugar, not carbs.",
          keyRule: "Barbell Hip Thrust progress is your most important metric. Write down your hip thrust weight every session.",
        },
        {
          week: "Week 9–12",
          focus: "Heavier weights. Track everything. Progress photos.",
          schedule: [
            {
              day: "Continue Upper/Lower 4×/week",
              label: "Same exercises, heavier weights",
              note: "Add 2.5 kg to hip thrust and deadlift weekly. If you stall, check sleep and food first.",
            },
          ],
          nutrition: "Weigh yourself on Monday mornings. Expect 0.3–0.5 kg/week loss. Hormonal fluctuations will skew daily readings.",
          keyRule: "Judge fat loss by your monthly average weight and tape measurements — not by any single day's reading.",
        },
      ],
    },
    {
      title: "Phase 3 — Push/Pull/Legs",
      duration: "Month 3 – 4",
      goal: "More volume. Glute and upper body development accelerate.",
      weeks: [
        {
          week: "Month 3–4",
          focus: "PPL 3–6 days/week. Volume increases.",
          schedule: [
            {
              day: "Push Day",
              label: "Chest / Shoulders / Triceps",
              exercises: [
                { name: "DB Bench Press", sets: "4", reps: "10" },
                { name: "Incline DB Press", sets: "3", reps: "12" },
                { name: "DB Shoulder Press", sets: "3", reps: "10" },
                { name: "Lateral Raise", sets: "4", reps: "15" },
                { name: "Tricep Pushdown", sets: "3", reps: "12" },
                { name: "Overhead Tricep Extension", sets: "3", reps: "12" },
              ],
            },
            {
              day: "Pull Day",
              label: "Back / Biceps",
              exercises: [
                { name: "Deadlift", sets: "3", reps: "6" },
                { name: "Lat Pulldown", sets: "4", reps: "10" },
                { name: "Cable Row", sets: "3", reps: "12" },
                { name: "Face Pull", sets: "3", reps: "15" },
                { name: "DB Curl", sets: "3", reps: "12" },
                { name: "Hammer Curl", sets: "3", reps: "12" },
              ],
            },
            {
              day: "Leg Day",
              label: "Glute / Quad / Hamstring",
              exercises: [
                { name: "Barbell Hip Thrust", sets: "4", reps: "10", note: "Your most important exercise. Heavy and controlled." },
                { name: "Barbell Squat", sets: "4", reps: "8" },
                { name: "Romanian Deadlift", sets: "3", reps: "10" },
                { name: "Bulgarian Split Squat", sets: "3", reps: "10 each" },
                { name: "Cable Kickback", sets: "3", reps: "15 each" },
                { name: "Abductor Machine", sets: "3", reps: "15" },
                { name: "Calf Raise", sets: "4", reps: "15" },
              ],
            },
          ],
          nutrition: "Continue deficit. Add a maintenance day every 10 days for hormone and leptin regulation — especially important for women.",
          keyRule: "Leg day volume for women should be higher than men — glutes are a larger muscle group and respond to more volume.",
        },
      ],
    },
    {
      title: "Phase 4 — Optimization",
      duration: "Month 5 – 6",
      goal: "Fine-tune. Cycle nutrition with menstrual cycle. Track properly.",
      weeks: [
        {
          week: "Month 5–6",
          focus: "Menstrual cycle nutrition. Deload. Progress check.",
          schedule: [
            {
              day: "Follicular phase (Day 1–14)",
              label: "Higher intensity training",
              note: "Estrogen is high — this is your strongest phase. Train heavy and push hard.",
            },
            {
              day: "Luteal phase (Day 15–28)",
              label: "Lower intensity, more recovery",
              note: "Progesterone rises. Energy may drop. Reduce volume by 20%. Sleep and protein become even more critical.",
            },
          ],
          nutrition: "Consider cycle syncing: higher carbs in follicular phase, higher fats in luteal phase. This is optional but helps.",
          keyRule: "Your period is not an excuse but it IS information. Track energy and performance across your cycle for 3 months.",
        },
      ],
    },
  ],
  keyPrinciples: [
    "The hip thrust is your most important exercise — prioritize it every leg session",
    "Lifting makes you lean and shaped, NOT bulky — trust the science",
    "Progressive overload is non-negotiable — add weight every week",
    "Protein 1.8–2g/kg every day (especially on rest days — muscle repairs then)",
    "Track weekly average weight — not daily (hormones cause huge fluctuations)",
    "Glute activation before every lower body session",
    "Sleep 7–9 hours — fat loss hormones (leptin, ghrelin) are regulated during sleep",
    "Judgment metric: how do clothes fit? Not what does the scale say?",
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

const MUSCLE_GAIN: BeginnerPlan = {
  type: "beginner",
  gender: "women",
  goal: "muscle-gain",
  tagline: "Build your dream physique from the ground up.",
  myths: [
    {
      myth: "Eating more will just make me fat.",
      truth: "A 200–250 kcal surplus with high protein and consistent training builds muscle, not fat. Women's bodies are efficient at muscle building when the conditions are right.",
    },
    {
      myth: "I'll look masculine if I build muscle.",
      truth: "Female fitness icons — the lean, athletic, toned look — is ALL muscle. Muscle gives you curves, fills out clothing, and creates the physique most women want.",
    },
    {
      myth: "I should avoid squats and deadlifts.",
      truth: "Squat and deadlift are the most effective exercises for building glutes and legs — exactly what most women want. Avoiding them is the single biggest mistake.",
    },
    {
      myth: "Protein makes you gain fat.",
      truth: "Protein is the hardest macronutrient for the body to store as fat. It has the highest thermic effect — meaning your body burns calories just to digest it.",
    },
  ],
  splitExplainers: [
    {
      name: "Full Body (3×/week)",
      frequency: "3 days/week",
      bestFor: "Week 1–8. Highest muscle frequency for beginners.",
      schedule: "Mon / Wed / Fri",
      recommended: true,
    },
    {
      name: "Upper / Lower",
      frequency: "4 days/week",
      bestFor: "Week 9+ for more volume",
      schedule: "Mon / Tue / Thu / Fri",
      recommended: false,
    },
    {
      name: "Glute Focused Split",
      frequency: "4–5 days/week",
      bestFor: "Women prioritizing glute development",
      schedule: "Glutes 2–3×/week, upper 2×/week",
      recommended: false,
    },
  ],
  phases: [
    {
      title: "Phase 1 — Foundation",
      duration: "Week 1 – 4",
      goal: "Learn movements, activate glutes, eat in slight surplus.",
      weeks: [
        {
          week: "Week 1–4",
          focus: "Full body 3×/week. 200 kcal surplus.",
          schedule: [
            {
              day: "Mon / Wed / Fri",
              label: "Full Body Training",
              exercises: [
                { name: "Barbell Hip Thrust", sets: "3", reps: "12", note: "Most important. Heavy and controlled." },
                { name: "Goblet Squat", sets: "3", reps: "12" },
                { name: "Romanian Deadlift", sets: "3", reps: "12" },
                { name: "DB Bench Press", sets: "3", reps: "10" },
                { name: "Lat Pulldown", sets: "3", reps: "12" },
                { name: "DB Shoulder Press", sets: "3", reps: "10" },
              ],
            },
          ],
          nutrition: "200 kcal surplus. Protein 1.8–2g/kg. Expect 0.5–0.8 kg/month weight gain — mostly muscle with a small amount of fat.",
          keyRule: "You are in the noob gains window. You can build muscle AND lose fat simultaneously. Capitalise on it.",
        },
      ],
    },
    {
      title: "Phase 2 – Progressive Overload",
      duration: "Week 5 – 12",
      goal: "Add barbell. Track hip thrust and squat weekly.",
      weeks: [
        {
          week: "Week 5–12",
          focus: "Upper/Lower 4×/week. Heavy compounds.",
          schedule: [
            {
              day: "Mon/Thu — Lower",
              label: "Glute & Leg Focus",
              exercises: [
                { name: "Barbell Hip Thrust", sets: "4", reps: "8–10" },
                { name: "Barbell Squat", sets: "4", reps: "8" },
                { name: "Romanian Deadlift", sets: "3", reps: "10" },
                { name: "Leg Press (feet high)", sets: "3", reps: "12" },
                { name: "Cable Kickback", sets: "3", reps: "15 each" },
                { name: "Abductor Machine", sets: "3", reps: "15" },
              ],
            },
            {
              day: "Tue/Fri — Upper",
              label: "Back, Chest, Shoulders",
              exercises: [
                { name: "Lat Pulldown", sets: "4", reps: "10" },
                { name: "DB Row", sets: "4", reps: "10 each" },
                { name: "DB Bench Press", sets: "4", reps: "10" },
                { name: "Lateral Raise", sets: "4", reps: "15" },
                { name: "Face Pull", sets: "3", reps: "15" },
                { name: "DB Curl", sets: "3", reps: "12" },
                { name: "Tricep Pushdown", sets: "3", reps: "12" },
              ],
            },
          ],
          nutrition: "250 kcal surplus. If gaining too quickly, drop to 150 kcal surplus. Quality food — rice, oats, chicken, eggs, fruit, vegetables.",
          keyRule: "Hip thrust progress = glute growth. Write down EVERY session's weight. Never guess.",
        },
      ],
    },
    {
      title: "Phase 3 – Higher Volume",
      duration: "Month 3 – 6",
      goal: "More sets per muscle. PPL or Glute-focused split.",
      weeks: [
        {
          week: "Month 3–6",
          focus: "20 sets/week on glutes. 12–15 sets on upper.",
          schedule: [
            {
              day: "Leg Day (2–3×/week)",
              label: "Heavy glute and quad focus",
              exercises: [
                { name: "Barbell Hip Thrust", sets: "5", reps: "10" },
                { name: "Barbell Squat", sets: "4", reps: "8" },
                { name: "RDL", sets: "4", reps: "10" },
                { name: "Bulgarian Split Squat", sets: "3", reps: "10 each" },
                { name: "Cable Kickback", sets: "3", reps: "15 each" },
                { name: "Abductor", sets: "3", reps: "15" },
                { name: "Calf Raise", sets: "4", reps: "15" },
              ],
            },
          ],
          nutrition: "250 kcal surplus. Add a maintenance week every 8 weeks to prevent unnecessary fat gain.",
          keyRule: "Legs 3×/week is NOT overtrained — glutes are a massive muscle group and recover faster than most.",
        },
      ],
    },
  ],
  keyPrinciples: [
    "Hip thrust, squat, and deadlift are the three pillars of women's training",
    "Protein 2g/kg — builds muscle and keeps appetite controlled",
    "Slight surplus only — 200–250 kcal. More adds fat, not muscle",
    "Glute activation before every lower body session",
    "Legs 2–3×/week minimum for significant glute development",
    "Progressive overload every single week",
    "Sleep 7–9 hours — crucial for muscle repair and hormonal balance",
    "Patience: significant glute development takes 6–12 months of consistent training",
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

const MAINTAIN: BeginnerPlan = {
  type: "beginner",
  gender: "women",
  goal: "maintain",
  tagline: "Glow up — same weight, entirely new body.",
  myths: [
    {
      myth: "If the scale isn't moving, nothing is happening.",
      truth: "Recomposition is the most dramatic visual transformation while the scale barely moves. You're replacing fat with muscle. Same weight, completely different shape.",
    },
    {
      myth: "I should do cardio every day.",
      truth: "Too much cardio can interfere with muscle building. 2–3 sessions of 30 min Zone 2 cardio/week is ideal alongside 3–4 days of resistance training.",
    },
  ],
  splitExplainers: [
    {
      name: "Full Body (3×/week)",
      frequency: "3 days/week",
      bestFor: "Best for recomposition — frequent muscle stimulus",
      schedule: "Mon / Wed / Fri",
      recommended: true,
    },
  ],
  phases: [
    {
      title: "Phase 1–2 — Recomposition",
      duration: "Month 1 – 6",
      goal: "Build muscle while burning fat simultaneously at maintenance calories.",
      weeks: [
        {
          week: "Month 1–6",
          focus: "Progressive overload at maintenance. High protein. Patience.",
          schedule: [
            {
              day: "Mon / Wed / Fri",
              label: "Full Body Training",
              exercises: [
                { name: "Barbell Hip Thrust", sets: "4", reps: "10" },
                { name: "Barbell Squat", sets: "3", reps: "10" },
                { name: "Deadlift", sets: "3", reps: "8" },
                { name: "Lat Pulldown", sets: "3", reps: "10" },
                { name: "DB Bench Press", sets: "3", reps: "10" },
                { name: "Lateral Raise", sets: "3", reps: "15" },
              ],
            },
          ],
          nutrition: "Exact maintenance. 2g protein per kg. Carbs around workouts, fats throughout the day.",
          keyRule: "Take monthly photos. Recomp changes are invisible week to week but dramatic over 3–6 months.",
        },
      ],
    },
  ],
  keyPrinciples: [
    "Maintenance calories — precise tracking required",
    "2g protein per kg is the most important variable",
    "Monthly photos and measurements — not the scale",
    "Progressive overload still applies",
    "Zone 2 cardio 2–3×/week is sufficient",
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

export const beginnerWomenPlans: Record<Goal, BeginnerPlan> = {
  "fat-loss": FAT_LOSS,
  "muscle-gain": MUSCLE_GAIN,
  maintain: MAINTAIN,
};
