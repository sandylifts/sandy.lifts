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
    description: "Find your daily protein goal to build muscle and preserve it on a cut.",
    href: "/tools/protein-target",
    icon: "zap",
  },
  {
    title: "Fiber Calculator",
    description: "Gut health directly impacts fat loss. Hit your fiber target daily.",
    href: "/tools/fiber-calculator",
    icon: "leaf",
  },
];

const FAT_LOSS: BeginnerPlan = {
  type: "beginner",
  gender: "men",
  goal: "fat-loss",
  tagline: "Burn fat, build muscle, keep it forever.",
  myths: [
    {
      myth: "Cardio is the best way to lose fat.",
      truth: "Weight training burns fat for 24–48 hrs after the session via EPOC (afterburn). Cardio burns calories only during the workout. Build muscle first — it's your metabolic engine.",
    },
    {
      myth: "I need to sweat a lot to know the workout worked.",
      truth: "Sweat is your body cooling down, not a fat-loss meter. A heavy squat set with no sweat beats 30 mins of casual cardio.",
    },
    {
      myth: "More sets = more results.",
      truth: "10–20 sets per muscle per week is the sweet spot. Doing 40 sets of biceps in one session destroys recovery — not gains.",
    },
    {
      myth: "I should feel sore after every workout.",
      truth: "DOMS (delayed onset muscle soreness) is inflammation, not muscle growth. Once adapted, you'll rarely be sore — and that's completely fine.",
    },
    {
      myth: "I need to eat every 2 hours to keep my metabolism high.",
      truth: "Meal timing barely matters. Total daily protein and calories are what drive results. Eat when it suits your schedule.",
    },
  ],
  splitExplainers: [
    {
      name: "Full Body (3×/week)",
      frequency: "3 days/week",
      bestFor: "Beginners — Week 1 to 8",
      schedule: "Mon / Wed / Fri",
      recommended: true,
    },
    {
      name: "Upper / Lower Split",
      frequency: "4 days/week",
      bestFor: "Transitioning out of beginner phase — Week 9+",
      schedule: "Mon Upper / Tue Lower / Thu Upper / Fri Lower",
      recommended: false,
    },
    {
      name: "Push / Pull / Legs (PPL)",
      frequency: "6 days/week OR 3 days/week",
      bestFor: "Month 3 onwards when volume needs to increase",
      schedule: "Push → Pull → Legs → Rest → repeat",
      recommended: false,
    },
    {
      name: "Bro Split (1 body part/day)",
      frequency: "5 days/week",
      bestFor: "NOT recommended for beginners — muscle frequency too low (once/week per muscle)",
      schedule: "Chest / Back / Shoulders / Arms / Legs",
      recommended: false,
    },
  ],
  phases: [
    {
      title: "Phase 1 — Foundation",
      duration: "Week 1 – 4",
      goal: "Learn movement patterns. Form > weight. Every single rep.",
      weeks: [
        {
          week: "Week 1–2",
          focus: "Technique — go light, move perfectly",
          schedule: [
            {
              day: "Monday",
              label: "Full Body A",
              exercises: [
                { name: "Goblet Squat", sets: "3", reps: "12", note: "Heels on floor, chest up, knees track over toes" },
                { name: "Push-up (or DB Bench Press)", sets: "3", reps: "10", note: "Full range — chest touches floor" },
                { name: "Dumbbell Row", sets: "3", reps: "12 each side", note: "Pull elbow back, squeeze shoulder blade at top" },
                { name: "Plank", sets: "3", reps: "30 sec", note: "Straight line — don't let hips sag" },
              ],
              note: "Rest 90 seconds between sets. Walk 20 min after training.",
            },
            {
              day: "Tuesday",
              label: "Rest / Walk",
              note: "20–30 min brisk walk. No gym. Active recovery only.",
            },
            {
              day: "Wednesday",
              label: "Full Body B",
              exercises: [
                { name: "Romanian Deadlift (RDL)", sets: "3", reps: "12", note: "Hip hinge — feel stretch in hamstrings, not lower back" },
                { name: "Dumbbell Shoulder Press", sets: "3", reps: "10", note: "Full lockout at top, elbows slightly forward" },
                { name: "Lat Pulldown (or Assisted Pull-up)", sets: "3", reps: "12", note: "Pull to upper chest, don't yank with momentum" },
                { name: "Glute Bridge", sets: "3", reps: "15", note: "Squeeze glutes at top, hold 1 second" },
              ],
              note: "Rest 90 seconds. Walk 20 min after.",
            },
            {
              day: "Thursday",
              label: "Rest / Walk",
              note: "20–30 min brisk walk.",
            },
            {
              day: "Friday",
              label: "Full Body A (repeat)",
              exercises: [
                { name: "Goblet Squat", sets: "3", reps: "12" },
                { name: "Push-up (or DB Bench Press)", sets: "3", reps: "10" },
                { name: "Dumbbell Row", sets: "3", reps: "12 each side" },
                { name: "Plank", sets: "3", reps: "30 sec" },
              ],
              note: "Try to add 1–2 reps or 1 extra second on plank vs Monday.",
            },
            {
              day: "Saturday & Sunday",
              label: "Rest",
              note: "Sleep 7–9 hours. Muscle grows during recovery, not during the workout.",
            },
          ],
          nutrition: "Eat at maintenance calories this week. Don't cut yet — let your body adapt. Hit your protein target daily.",
          keyRule: "If you cannot do the movement correctly, go lighter. Ego lifting with bad form = injury at month 3.",
        },
        {
          week: "Week 3–4",
          focus: "Add load — if form is clean, add 2.5 kg",
          schedule: [
            {
              day: "Monday / Wednesday / Friday",
              label: "Full Body (alternate A and B)",
              note: "Same exercises. If you completed all reps cleanly last week, add 2.5 kg on upper, 5 kg on lower body lifts.",
            },
          ],
          nutrition: "Start a 200–300 kcal deficit below your maintenance. Do NOT slash calories — you need energy to train.",
          keyRule: "Progressive overload is the ONLY thing that forces your body to change. Add weight or reps every single week.",
        },
      ],
    },
    {
      title: "Phase 2 — Strength Building",
      duration: "Week 5 – 12",
      goal: "Switch to Upper/Lower split. Build real strength on compound lifts.",
      weeks: [
        {
          week: "Week 5–8",
          focus: "Upper/Lower 4×/week. Introduce barbell lifts.",
          schedule: [
            {
              day: "Monday",
              label: "Upper A — Push focus",
              exercises: [
                { name: "Barbell Bench Press", sets: "4", reps: "8", note: "Arch back slightly, feet flat, bar to lower chest" },
                { name: "Incline Dumbbell Press", sets: "3", reps: "10", note: "30–45° incline, full stretch at bottom" },
                { name: "Overhead Press (OHP)", sets: "3", reps: "10", note: "Bar from shoulders to lockout overhead, core tight" },
                { name: "Tricep Pushdown (Cable)", sets: "3", reps: "12", note: "Elbows pinned to sides, full extension" },
              ],
              note: "Rest 2–3 min on compounds, 60–90 sec on accessories.",
            },
            {
              day: "Tuesday",
              label: "Lower A — Quad focus",
              exercises: [
                { name: "Barbell Squat", sets: "4", reps: "8", note: "Break parallel if mobility allows, chest tall" },
                { name: "Romanian Deadlift", sets: "3", reps: "10", note: "Feel stretch in hamstrings, not lower back" },
                { name: "Leg Press", sets: "3", reps: "12", note: "Feet shoulder-width, don't lock out knees at top" },
                { name: "Calf Raise", sets: "4", reps: "15", note: "Full range — all the way up, all the way down" },
              ],
              note: "Rest 2–3 min on compounds.",
            },
            {
              day: "Wednesday",
              label: "Rest / Cardio",
              note: "30 min Zone 2 cardio — conversational pace walk/cycle. NOT sprints.",
            },
            {
              day: "Thursday",
              label: "Upper B — Pull focus",
              exercises: [
                { name: "Barbell Row", sets: "4", reps: "8", note: "Bar to lower chest/upper abs, back stays flat" },
                { name: "Pull-up or Lat Pulldown", sets: "3", reps: "8–10", note: "Full hang at bottom, squeeze back at top" },
                { name: "Face Pull (Cable)", sets: "3", reps: "15", note: "Shoulder health. Pull to forehead, elbows high" },
                { name: "Barbell or Dumbbell Curl", sets: "3", reps: "12", note: "No swinging, full extension at bottom" },
              ],
            },
            {
              day: "Friday",
              label: "Lower B — Posterior chain focus",
              exercises: [
                { name: "Conventional Deadlift", sets: "4", reps: "6", note: "MOST IMPORTANT LIFT. Bar over mid-foot, chest up, push floor away" },
                { name: "Bulgarian Split Squat", sets: "3", reps: "10 each", note: "Harder than it looks. Front foot forward, knee tracks toes" },
                { name: "Leg Curl (machine)", sets: "3", reps: "12", note: "Full range, squeeze hamstrings at top" },
                { name: "Ab Wheel or Hanging Leg Raise", sets: "3", reps: "10", note: "Core strength, not aesthetics at this stage" },
              ],
            },
            {
              day: "Saturday",
              label: "Optional: 30 min walk / cardio",
              note: "Active recovery only.",
            },
            {
              day: "Sunday",
              label: "Rest",
              note: "Full recovery day.",
            },
          ],
          nutrition: "300–400 kcal deficit. Protein at 2g/kg bodyweight. Don't skip carbs — you need them to train hard.",
          keyRule: "Add 2.5 kg upper / 5 kg lower every week. If you miss reps 2 weeks in a row, deload 10% and rebuild.",
        },
        {
          week: "Week 9–12",
          focus: "Same split, bigger weights. Start tracking every set.",
          schedule: [
            {
              day: "Continue Upper/Lower 4×/week",
              label: "Same exercises as Week 5–8",
              note: "Write down every weight, every set, every rep. Without tracking, you're guessing.",
            },
          ],
          nutrition: "Check weight every Monday morning, same conditions. If not losing 0.3–0.5 kg/week, subtract 100 kcal.",
          keyRule: "The scale will fluctuate daily. Judge progress monthly — photos + measurements, not daily weight.",
        },
      ],
    },
    {
      title: "Phase 3 — Push/Pull/Legs",
      duration: "Month 3 – 4",
      goal: "Increase training volume. Start PPL. Compound lifts as the foundation.",
      weeks: [
        {
          week: "Month 3–4",
          focus: "PPL 3×/week (or 6×/week for faster progress)",
          schedule: [
            {
              day: "Push Day",
              label: "Chest / Shoulders / Triceps",
              exercises: [
                { name: "Barbell Bench Press", sets: "4", reps: "6–8" },
                { name: "Incline DB Press", sets: "3", reps: "10" },
                { name: "Overhead Press", sets: "3", reps: "8" },
                { name: "Cable Lateral Raise", sets: "3", reps: "15" },
                { name: "Tricep Pushdown", sets: "3", reps: "12" },
                { name: "Overhead Tricep Extension", sets: "3", reps: "12" },
              ],
            },
            {
              day: "Pull Day",
              label: "Back / Biceps",
              exercises: [
                { name: "Deadlift", sets: "4", reps: "5", note: "Keep it as the first heavy lift of pull day" },
                { name: "Barbell Row", sets: "4", reps: "8" },
                { name: "Pull-up / Lat Pulldown", sets: "3", reps: "8–10" },
                { name: "Cable Row (Seated)", sets: "3", reps: "12" },
                { name: "Barbell Curl", sets: "3", reps: "10" },
                { name: "Hammer Curl", sets: "3", reps: "12" },
              ],
            },
            {
              day: "Leg Day",
              label: "Quads / Hamstrings / Glutes / Calves",
              exercises: [
                { name: "Barbell Squat", sets: "4", reps: "6–8", note: "King of lower body. Don't skip legs." },
                { name: "Romanian Deadlift", sets: "3", reps: "10" },
                { name: "Leg Press", sets: "3", reps: "12" },
                { name: "Walking Lunges", sets: "3", reps: "12 each" },
                { name: "Leg Curl", sets: "3", reps: "12" },
                { name: "Standing Calf Raise", sets: "4", reps: "15" },
              ],
            },
          ],
          nutrition: "Continue deficit. Add a refeed day (maintenance calories) every 10–14 days to restore leptin and energy.",
          keyRule: "Compound lifts come first in every session when you have the most energy. Isolation last.",
        },
      ],
    },
    {
      title: "Phase 4 — Optimization",
      duration: "Month 5 – 6",
      goal: "Fine-tune, add isolation, track body composition properly.",
      weeks: [
        {
          week: "Month 5–6",
          focus: "Add isolation, deload week, progress check",
          schedule: [
            {
              day: "Every 4–6 weeks",
              label: "Deload Week",
              note: "Drop all weights 40% for one full week. Sleep extra. Let joints recover. You'll come back stronger.",
            },
            {
              day: "Monthly",
              label: "Progress Check",
              note: "Take photos (same lighting, same time). Measure waist, chest, arms, thighs. Compare Week 1 to now.",
            },
          ],
          nutrition: "If you've lost 8–12 kg in 6 months, consider a maintenance break (diet break) for 2 weeks before cutting more.",
          keyRule: "Can you lift 30–40% more than Week 1? If yes — you've built real muscle while losing fat. That's the goal.",
        },
      ],
    },
  ],
  keyPrinciples: [
    "Progressive overload every week — add weight, reps, or sets",
    "Compounds first: Squat, Deadlift, Bench, Row, OHP are your 5 pillars",
    "Protein 2g per kg bodyweight — non-negotiable",
    "Sleep 7–9 hours — growth hormone is released during deep sleep",
    "Muscle needs 48 hrs to recover — don't train the same muscle 2 days in a row",
    "Track everything: weight on bar, reps, body weight (weekly average)",
    "Cardio is optional, not mandatory — walking daily is enough for beginners",
    "Consistency > perfection. 80% effort for 6 months beats 100% for 3 weeks",
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

const MUSCLE_GAIN: BeginnerPlan = {
  type: "beginner",
  gender: "men",
  goal: "muscle-gain",
  tagline: "Build size, build strength, build character.",
  myths: [
    {
      myth: "I need supplements to build muscle.",
      truth: "Food builds muscle. Supplements are 5% of results. Creatine monohydrate is the only supplement with strong evidence — and it's cheap.",
    },
    {
      myth: "I should train to failure every set.",
      truth: "Training close to failure (1–2 reps left in the tank) is effective. ACTUAL failure every set destroys recovery and leads to overtraining.",
    },
    {
      myth: "Light weight, high reps for definition. Heavy weight for mass.",
      truth: "Muscle growth happens across all rep ranges IF load is challenging. What matters is progressive overload over time.",
    },
    {
      myth: "I need to eat 4–5 meals a day.",
      truth: "Meal frequency is irrelevant. Hit your daily calorie and protein targets in however many meals work for you.",
    },
    {
      myth: "I'll look like a bodybuilder in 3 months.",
      truth: "Beginners gain 1–1.5 kg of muscle per month maximum. Bodybuilders work for 10+ years. Realistic expectations = longer motivation.",
    },
  ],
  splitExplainers: [
    {
      name: "Full Body (3×/week)",
      frequency: "3 days/week",
      bestFor: "Beginners — Week 1 to 8. Highest muscle frequency.",
      schedule: "Mon / Wed / Fri",
      recommended: true,
    },
    {
      name: "Upper / Lower Split",
      frequency: "4 days/week",
      bestFor: "Week 9+ when volume increases and recovery is needed",
      schedule: "Mon Upper / Tue Lower / Thu Upper / Fri Lower",
      recommended: false,
    },
    {
      name: "Push / Pull / Legs (PPL)",
      frequency: "6 days/week",
      bestFor: "Month 3+ — more volume per muscle group",
      schedule: "Push / Pull / Legs / Push / Pull / Legs / Rest",
      recommended: false,
    },
    {
      name: "Bro Split",
      frequency: "5 days/week",
      bestFor: "NOT recommended — muscles trained only once/week is suboptimal for beginners",
      schedule: "One muscle group per day",
      recommended: false,
    },
  ],
  phases: [
    {
      title: "Phase 1 — Foundation",
      duration: "Week 1 – 4",
      goal: "Learn movements. Eat in surplus. Build the habit.",
      weeks: [
        {
          week: "Week 1–4",
          focus: "Full Body 3×/week. Eat 250 kcal above maintenance.",
          schedule: [
            {
              day: "Monday / Wednesday / Friday",
              label: "Full Body Training",
              exercises: [
                { name: "Goblet Squat", sets: "3", reps: "12" },
                { name: "Dumbbell Bench Press", sets: "3", reps: "10" },
                { name: "Dumbbell Row", sets: "3", reps: "12 each" },
                { name: "Romanian Deadlift", sets: "3", reps: "12" },
                { name: "Dumbbell Shoulder Press", sets: "3", reps: "10" },
                { name: "Lat Pulldown", sets: "3", reps: "12" },
              ],
              note: "Rest 90 seconds between sets. Form over weight — always.",
            },
          ],
          nutrition: "Eat 250 kcal above maintenance. More than this adds unnecessary fat. Protein: 2g/kg daily.",
          keyRule: "You are in the 'noob gains' phase — you can build muscle AND lose fat simultaneously. Take advantage of it.",
        },
      ],
    },
    {
      title: "Phase 2 — Progressive Overload",
      duration: "Week 5 – 12",
      goal: "Introduce barbell. Track every set. Add load weekly.",
      weeks: [
        {
          week: "Week 5–12",
          focus: "Upper/Lower 4×/week. Barbell compounds.",
          schedule: [
            {
              day: "Monday — Upper Strength",
              label: "Barbell Focus",
              exercises: [
                { name: "Barbell Bench Press", sets: "5", reps: "5", note: "Strength focus. Rest 3 min between sets." },
                { name: "Barbell Row", sets: "5", reps: "5" },
                { name: "Overhead Press", sets: "4", reps: "6" },
                { name: "Pull-up", sets: "3", reps: "max reps", note: "Add weight when you hit 3×12" },
                { name: "Barbell Curl", sets: "3", reps: "10" },
              ],
            },
            {
              day: "Tuesday — Lower Strength",
              label: "Squat & Deadlift Focus",
              exercises: [
                { name: "Barbell Squat", sets: "5", reps: "5", note: "Every week add 2.5 kg. This is non-negotiable." },
                { name: "Conventional Deadlift", sets: "4", reps: "5" },
                { name: "Leg Press", sets: "3", reps: "10" },
                { name: "Leg Curl", sets: "3", reps: "12" },
                { name: "Standing Calf Raise", sets: "4", reps: "15" },
              ],
            },
            {
              day: "Thursday — Upper Hypertrophy",
              label: "Higher Reps",
              exercises: [
                { name: "Incline DB Press", sets: "4", reps: "10" },
                { name: "Lat Pulldown", sets: "4", reps: "10" },
                { name: "Cable Lateral Raise", sets: "4", reps: "15" },
                { name: "Face Pull", sets: "3", reps: "15" },
                { name: "Tricep Pushdown", sets: "3", reps: "12" },
                { name: "Hammer Curl", sets: "3", reps: "12" },
              ],
            },
            {
              day: "Friday — Lower Hypertrophy",
              label: "Higher Reps",
              exercises: [
                { name: "Romanian Deadlift", sets: "4", reps: "10" },
                { name: "Bulgarian Split Squat", sets: "3", reps: "10 each" },
                { name: "Leg Extension", sets: "3", reps: "15" },
                { name: "Leg Curl", sets: "3", reps: "15" },
                { name: "Hip Thrust", sets: "4", reps: "12" },
              ],
            },
          ],
          nutrition: "250–300 kcal surplus. If gaining more than 1.5 kg/month, reduce by 100 kcal.",
          keyRule: "SBD — Squat, Bench, Deadlift. These 3 numbers are your report card. Track them every week.",
        },
      ],
    },
    {
      title: "Phase 3 – PPL for Volume",
      duration: "Month 3 – 6",
      goal: "More volume per muscle. PPL 6×/week. Strategic surplus.",
      weeks: [
        {
          week: "Month 3–6",
          focus: "PPL 6 days. Compounds first, isolation last.",
          schedule: [
            {
              day: "Push (×2/week)",
              label: "Chest / Shoulders / Triceps",
              exercises: [
                { name: "Barbell Bench Press", sets: "4", reps: "6–8" },
                { name: "Incline DB Press", sets: "3", reps: "10–12" },
                { name: "OHP", sets: "3", reps: "8–10" },
                { name: "DB Lateral Raise", sets: "4", reps: "15" },
                { name: "Tricep Pushdown", sets: "3", reps: "12" },
                { name: "Skull Crusher", sets: "3", reps: "10" },
              ],
            },
            {
              day: "Pull (×2/week)",
              label: "Back / Biceps",
              exercises: [
                { name: "Deadlift (Heavy day only)", sets: "4", reps: "4–6" },
                { name: "Pull-up (weighted)", sets: "4", reps: "8" },
                { name: "Barbell Row", sets: "4", reps: "8" },
                { name: "Seated Cable Row", sets: "3", reps: "12" },
                { name: "Barbell Curl", sets: "3", reps: "10" },
                { name: "Incline DB Curl", sets: "3", reps: "12" },
              ],
            },
            {
              day: "Legs (×2/week)",
              label: "Full Lower Body",
              exercises: [
                { name: "Barbell Squat", sets: "4", reps: "6–8" },
                { name: "RDL", sets: "3", reps: "10" },
                { name: "Leg Press", sets: "3", reps: "12" },
                { name: "Walking Lunge", sets: "3", reps: "12 each" },
                { name: "Leg Curl", sets: "3", reps: "12" },
                { name: "Calf Raise", sets: "4", reps: "15–20" },
              ],
            },
          ],
          nutrition: "Continue 250 kcal surplus. Every 8 weeks, take 2 weeks at maintenance to prevent excess fat gain.",
          keyRule: "Deload every 6 weeks. Drop volume 40% for one week. You'll feel weak — you'll come back stronger.",
        },
      ],
    },
  ],
  keyPrinciples: [
    "Caloric surplus is mandatory — muscle cannot grow from nothing",
    "2g protein per kg daily — every single day, not just training days",
    "Progressive overload: add weight every week on every compound lift",
    "Squat + Deadlift + Bench + Row + OHP — master these 5 before anything else",
    "Sleep is when you grow — 7–9 hours is part of the program",
    "Creatine monohydrate 5g/day is the only supplement worth taking early on",
    "Track your lifts — a workout journal (or phone note) is mandatory",
    "Be patient: real muscle takes months. What you build stays forever.",
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

const MAINTAIN: BeginnerPlan = {
  type: "beginner",
  gender: "men",
  goal: "maintain",
  tagline: "Same weight. Better body. Recomposition done right.",
  myths: [
    {
      myth: "Body recomposition is impossible.",
      truth: "Beginners and those returning after a break can build muscle AND lose fat simultaneously at maintenance calories. It's slower but it's real.",
    },
    {
      myth: "I should eat the same every day.",
      truth: "Nutrient timing matters here more than other goals. Eat more carbs around workouts, more protein throughout the day.",
    },
    {
      myth: "Maintenance means I'm not making progress.",
      truth: "Recomp is the most impressive transformation visually — you change shape completely while the scale barely moves.",
    },
  ],
  splitExplainers: [
    {
      name: "Full Body (3×/week)",
      frequency: "3 days/week",
      bestFor: "Optimal for recomp — high frequency with enough recovery",
      schedule: "Mon / Wed / Fri",
      recommended: true,
    },
    {
      name: "Upper / Lower",
      frequency: "4 days/week",
      bestFor: "More volume, same frequency per muscle",
      schedule: "Mon / Tue / Thu / Fri",
      recommended: false,
    },
  ],
  phases: [
    {
      title: "Phase 1 — Foundation",
      duration: "Week 1 – 6",
      goal: "Build movement skills. Eat at exact maintenance. Train consistently.",
      weeks: [
        {
          week: "Week 1–6",
          focus: "Full Body 3×/week. Maintenance calories. Perfect form.",
          schedule: [
            {
              day: "Monday / Wednesday / Friday",
              label: "Full Body Training",
              exercises: [
                { name: "Barbell Squat", sets: "3", reps: "10" },
                { name: "Bench Press", sets: "3", reps: "10" },
                { name: "Barbell Row", sets: "3", reps: "10" },
                { name: "Romanian Deadlift", sets: "3", reps: "10" },
                { name: "Overhead Press", sets: "3", reps: "10" },
                { name: "Lat Pulldown", sets: "3", reps: "12" },
              ],
            },
          ],
          nutrition: "Eat at exact maintenance. High protein (2g/kg) pulls the recomp in your favour. Don't eat junk even if calories 'fit'.",
          keyRule: "On this goal, body composition changes but scale weight stays similar. Judge by mirror and measurements, not scale.",
        },
      ],
    },
    {
      title: "Phase 2 – Progressive Recomp",
      duration: "Month 2 – 6",
      goal: "Increase training volume. Track measurements every 4 weeks.",
      weeks: [
        {
          week: "Month 2–6",
          focus: "Upper/Lower 4×/week. Strength on compounds.",
          schedule: [
            {
              day: "4 days/week Upper/Lower",
              label: "See muscle-gain phase 2 for full template",
              note: "Same exercises, same progressive overload. Difference is calories — maintenance, not surplus.",
            },
          ],
          nutrition: "Maintenance calories. Pre-workout meal: carb-heavy. Post-workout: protein-heavy. This matters more for recomp than other goals.",
          keyRule: "Take photos every 4 weeks. Recomp progress is invisible on the scale but dramatic in photos.",
        },
      ],
    },
  ],
  keyPrinciples: [
    "Exact maintenance calories — any surplus adds fat, any deficit slows muscle growth",
    "2g protein per kg is even more critical here than other goals",
    "Progressive overload still applies — get stronger every week",
    "Carb timing: eat most carbs around workouts",
    "Judge progress with photos + measurements, never the scale alone",
    "Be patient — recomp is the slowest but most sustainable transformation",
  ],
  toolkitCTA: TOOLKIT_CTAS,
};

export const beginnerMenPlans: Record<Goal, BeginnerPlan> = {
  "fat-loss": FAT_LOSS,
  "muscle-gain": MUSCLE_GAIN,
  maintain: MAINTAIN,
};
