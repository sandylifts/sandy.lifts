import type { AdvancedPlan, Gender } from "../types";

const TOOLKIT_CTAS = [
  {
    title: "Body Fat Estimator",
    description: "Track your body composition as you cut or bulk.",
    href: "/tools/body-fat",
    icon: "calculator",
  },
  {
    title: "Diet Break Calculator",
    description: "Strategic maintenance periods preserve metabolic rate during long cuts.",
    href: "/tools/diet-break",
    icon: "zap",
  },
  {
    title: "Rebound Risk Calculator",
    description: "Assess your rebound risk before ending a cut phase.",
    href: "/tools/rebound-risk",
    icon: "leaf",
  },
];

const ISOLATION_LIBRARY_MEN = [
  {
    muscle: "Chest",
    exercises: [
      { name: "Cable Fly (Low to High)", cue: "Arc movement, squeeze at sternum. Don't bend elbows." },
      { name: "Pec Deck (Butterfly)", cue: "Elbows at shoulder height. Controlled stretch, squeeze hard at peak." },
      { name: "Incline DB Fly", cue: "Arms slightly bent, feel the stretch at the bottom." },
      { name: "Cable Crossover (High to Low)", cue: "Targets lower chest. Keep torso fixed." },
      { name: "Svend Press", cue: "Squeeze two plates together, press and pull back. Incredible chest contraction." },
    ],
  },
  {
    muscle: "Back",
    exercises: [
      { name: "Straight-Arm Cable Pulldown", cue: "Arms straight, lat activated, pull bar to thighs. Lat isolation." },
      { name: "Single-Arm DB Row (Chest-Supported)", cue: "Chest on incline bench. No momentum. Full stretch at bottom." },
      { name: "Cable Pullover", cue: "Lat stretch at top, pull to hips. Full range." },
      { name: "Seated Cable Row (Wide Grip)", cue: "Wide neutral grip, pull to sternum for upper back focus." },
      { name: "Chest-Supported Machine Row", cue: "Chest on pad eliminates momentum. Pure back isolation." },
    ],
  },
  {
    muscle: "Shoulders",
    exercises: [
      { name: "Cable Lateral Raise", cue: "Cable from opposite side. Constant tension throughout range." },
      { name: "Rear Delt Fly (Bent Over)", cue: "Bent 90°, arms arc backward. Feel rear delt — not traps." },
      { name: "Face Pull (Rope)", cue: "Rope to forehead, elbows above hands. External rotation, shoulder health." },
      { name: "DB Front Raise", cue: "Controlled, no momentum. Targets anterior delt." },
      { name: "Upright Row (Cable)", cue: "Elbows above wrists, pull to chin. Upper traps + medial delt." },
    ],
  },
  {
    muscle: "Biceps",
    exercises: [
      { name: "Preacher Curl (EZ Bar or DB)", cue: "Arm on pad, full extension, peak contraction at top. No swinging." },
      { name: "Concentration Curl", cue: "Elbow on inner thigh. Fully isolates bicep. Squeeze hard at top." },
      { name: "Incline DB Curl", cue: "Seated on 45° incline, arms hang back. Extreme bicep stretch." },
      { name: "Spider Curl", cue: "Face down on incline bench. Arms hang freely. Pure isolation." },
      { name: "Cable Curl (Single Arm)", cue: "Constant cable tension. Arms 90° to body for peak stretch." },
    ],
  },
  {
    muscle: "Triceps",
    exercises: [
      { name: "Overhead Cable Extension", cue: "Cable from low pulley, arms overhead. Long head stretch is maximum here." },
      { name: "Skull Crusher (EZ Bar)", cue: "Lower to forehead, extend to lockout. Slow eccentric." },
      { name: "Single-Arm Cable Pushdown", cue: "One arm at a time. Full extension at bottom, squeeze." },
      { name: "Kickback (DB or Cable)", cue: "Upper arm parallel to floor, extend fully. Squeeze at lockout." },
      { name: "Close-Grip Bench Press", cue: "Hands shoulder-width on bar. Tricep focused press. No flare." },
    ],
  },
  {
    muscle: "Quadriceps",
    exercises: [
      { name: "Leg Extension", cue: "Full extension, peak contraction 1 sec, slow eccentric. Quad isolation." },
      { name: "Hack Squat Machine", cue: "Feet low on platform for quad focus. Deep range of motion." },
      { name: "Sissy Squat", cue: "Advanced. Leaning back on toes, knee travels forward past toes." },
      { name: "Front Squat", cue: "Barbell in front-rack position. Forces quad-dominant movement pattern." },
    ],
  },
  {
    muscle: "Hamstrings",
    exercises: [
      { name: "Seated Leg Curl", cue: "Sitting upright. Knee at 90°, pull heel toward seat, slow return." },
      { name: "Nordic Curl (Leg Curl)", cue: "Most effective hamstring exercise. Lower body slowly, pull up. Advanced." },
      { name: "Single-Leg Lying Curl", cue: "One leg at a time corrects imbalances. Full range." },
      { name: "Good Morning (Barbell)", cue: "Hip hinge with bar on back. Hamstring stretch focus." },
    ],
  },
  {
    muscle: "Glutes",
    exercises: [
      { name: "Cable Kickback", cue: "Hip slightly forward of cable. Knee at 90°. Drive heel back and up. Squeeze." },
      { name: "Abductor Machine", cue: "Glute med and minimus. Slow, controlled, full range." },
      { name: "Single-Leg Hip Thrust", cue: "B-stance or full single-leg. Corrects imbalances, intense isolation." },
      { name: "Frog Pump", cue: "Feet together, soles touching. High volume (25–30 reps). Glute pump." },
      { name: "Cable Pull-Through", cue: "Rope between legs, hip hinge forward and extend. Great RDL substitute." },
    ],
  },
  {
    muscle: "Calves",
    exercises: [
      { name: "Standing Calf Raise", cue: "Full range — all the way up (2 sec hold), all the way down (full stretch)." },
      { name: "Seated Calf Raise", cue: "Targets soleus (deeper calf muscle). Heavier weight, full range." },
      { name: "Donkey Calf Raise", cue: "Bent over position. Deep stretch. The GOAT of calf exercises." },
      { name: "Single-Leg Calf Raise", cue: "Corrects imbalances. Bodyweight to start, then add resistance." },
    ],
  },
];

const ISOLATION_LIBRARY_WOMEN = [
  {
    muscle: "Glutes",
    exercises: [
      { name: "Cable Kickback", cue: "Hip slightly forward of cable. Knee at 90°. Drive heel back and up. Squeeze hard." },
      { name: "Abductor Machine", cue: "Targets glute medius — shapes the outer glute. Slow, full range, controlled." },
      { name: "Single-Leg Hip Thrust (B-stance)", cue: "One leg does the work. Corrects imbalances. Focus on weaker side." },
      { name: "Frog Pump", cue: "Soles of feet together. 25–30 reps. Glute pump without lower back stress." },
      { name: "Fire Hydrant (Cable)", cue: "Ankle attachment, lift leg to side. Glute medius isolation." },
      { name: "Cable Pull-Through", cue: "Rope between legs, hip hinge. Glute stretch and contraction." },
    ],
  },
  {
    muscle: "Hamstrings",
    exercises: [
      { name: "Seated Leg Curl", cue: "Full range, slow eccentric (3 sec down). Hamstring isolation." },
      { name: "Nordic Curl", cue: "Most effective hamstring exercise in existence. Slow lower, explosive return." },
      { name: "Single-Leg Lying Curl", cue: "Corrects left-right imbalances. Full range." },
      { name: "Good Morning", cue: "Bar on back, hip hinge. Deep hamstring stretch." },
    ],
  },
  {
    muscle: "Quadriceps",
    exercises: [
      { name: "Leg Extension", cue: "Seated, full extension, 1 sec hold, slow eccentric. Quad isolation." },
      { name: "Hack Squat Machine", cue: "Feet low and narrow for quad focus. Deep range." },
      { name: "Front Squat", cue: "Knees track over toes, quad dominant. Use as accessory to back squat." },
    ],
  },
  {
    muscle: "Shoulders",
    exercises: [
      { name: "Lateral Raise (DB or Cable)", cue: "Builds shoulder width — creates the hourglass effect. 4–5 sets/week minimum." },
      { name: "Face Pull", cue: "Rope to forehead, elbows high. External rotation. Posture and shoulder health." },
      { name: "Rear Delt Fly", cue: "Bent 90°, arms arc back. Rear delt — often undertrained in women." },
      { name: "Upright Row", cue: "Cable or bar. Elbows above wrists. Upper back and lateral delt." },
    ],
  },
  {
    muscle: "Back",
    exercises: [
      { name: "Straight-Arm Pulldown", cue: "Arms straight, pull bar to thighs. Pure lat isolation." },
      { name: "Chest-Supported DB Row", cue: "Chest on incline bench. No momentum. Pure back." },
      { name: "Single-Arm Cable Row", cue: "One arm at a time. Full stretch, full contraction." },
      { name: "Cable Pullover", cue: "Lat activation. Pull arc from overhead to hips." },
    ],
  },
  {
    muscle: "Biceps",
    exercises: [
      { name: "Preacher Curl", cue: "Arm fixed on pad. Full range. No swinging." },
      { name: "Concentration Curl", cue: "Seated, elbow on thigh. Maximum isolation. Squeeze hard." },
      { name: "Incline DB Curl", cue: "Seated at 45°, arms hang back. Extreme stretch position." },
    ],
  },
  {
    muscle: "Triceps",
    exercises: [
      { name: "Overhead Cable Extension", cue: "Arms overhead. Long head stretch. Most important tricep isolation for shape." },
      { name: "Kickback (DB or Cable)", cue: "Upper arm parallel to floor. Full extension. Squeeze." },
      { name: "Pushdown (Rope or Bar)", cue: "Elbows fixed to sides. Full extension at bottom." },
    ],
  },
  {
    muscle: "Calves",
    exercises: [
      { name: "Standing Calf Raise", cue: "Full range — all the way up, all the way down. 4 sets × 15–20 reps." },
      { name: "Seated Calf Raise", cue: "Targets soleus. Heavier weight. Full range." },
      { name: "Single-Leg Calf Raise", cue: "Corrects imbalances. Start bodyweight, add load gradually." },
    ],
  },
];

const MEN: AdvancedPlan = {
  type: "advanced",
  gender: "men",
  tagline: "You've built the foundation. Now master the details.",
  tips: [
    {
      category: "Periodization — Mandatory at Advanced Level",
      tips: [
        "Block periodization: 4–6 week hypertrophy → 4-week strength → 2-week peak → 1-week deload. Repeat.",
        "Daily undulating periodization (DUP): vary stimulus every session — heavy/moderate/light within same week.",
        "Auto-regulation: use RPE (Rate of Perceived Exertion) to adjust loads daily based on readiness.",
        "Annual plan: plan your bulk (Oct–Feb), cut (Mar–Jun), maintenance (Jul–Sep) around life schedule.",
        "Track your 1RM (one rep max) every 12 weeks. Progress is measured in months, not sessions.",
      ],
    },
    {
      category: "Advanced Techniques",
      tips: [
        "Rest-pause sets: complete 8 reps, rest 15 seconds, do 3–4 more. Intense metabolic stress.",
        "Myo-reps: 10 rep activation set → rest 3–5 breaths → 3–5 reps × multiple mini-sets. Research-backed.",
        "Mechanical drop sets: change exercise angle when fatigued to continue training the muscle.",
        "Blood Flow Restriction (BFR): 20–30% of 1RM with tourniquet. Builds muscle at very low load — great for joints.",
        "Eccentric overload: slow the lowering phase to 4–6 seconds. Highest mechanical tension for growth.",
        "Cluster sets: break a heavy set into small clusters with 10–15 sec rest within the set.",
      ],
    },
    {
      category: "Programming Volume",
      tips: [
        "Lagging muscle: identify and add dedicated work — 20–25 sets/week for that muscle for 8 weeks.",
        "Compounds are still the foundation: Squat, Deadlift, Bench, Row, OHP. Isolation is added, never replaced.",
        "Train each muscle group 2–3×/week. Once per week is insufficient at advanced level.",
        "Volume landmarks: MEV (Minimum Effective Volume) → MAV (Maximum Adaptive Volume) → MRV (Max Recoverable Volume).",
        "If recovery is suffering: you've exceeded MRV. Drop volume, not intensity.",
      ],
    },
    {
      category: "Nutrition — Advanced",
      tips: [
        "Protein 2–2.4g/kg. Evidence suggests upper range benefits advanced athletes more.",
        "Carb cycling: high carbs on heavy training days, lower on rest/cardio days.",
        "Diet breaks (2-week maintenance) every 10–12 weeks of cutting. Preserves metabolic rate.",
        "Re-feed days: 1 day at maintenance or surplus every 7–10 days during a cut. Restores leptin.",
        "Supplement stack for advanced: Creatine (5g/day), Vitamin D3 (2000–5000 IU), Omega-3 (2–3g EPA/DHA).",
        "Track food accurately with a scale — eyeballing leads to 20–30% error, which derails advanced programming.",
      ],
    },
    {
      category: "Injury Prevention & Longevity",
      tips: [
        "Prehab is mandatory: rotator cuff work, hip mobility, ankle mobility, thoracic extension daily.",
        "Face pulls and band pull-aparts: 3–5 sets every session before pressing movements.",
        "Deload every 4–6 weeks. At advanced level, this is non-negotiable.",
        "Listen to joint pain vs muscle soreness. Joints don't lie — if a joint hurts, stop and assess.",
        "Sleep is still the highest-ROI recovery tool. Nothing replaces it.",
      ],
    },
    {
      category: "Advanced Benchmarks",
      tips: [
        "Squat: 2× bodyweight × 1 rep = advanced.",
        "Deadlift: 2.5× bodyweight × 1 rep = advanced.",
        "Bench Press: 1.5× bodyweight × 1 rep = advanced.",
        "Overhead Press: 1× bodyweight × 1 rep = advanced.",
        "Weighted pull-up: bodyweight + 50% additional = advanced.",
      ],
    },
  ],
  isolationLibrary: ISOLATION_LIBRARY_MEN,
  toolkitCTA: TOOLKIT_CTAS,
};

const WOMEN: AdvancedPlan = {
  type: "advanced",
  gender: "women",
  tagline: "Years of work. Now every detail is deliberate.",
  tips: [
    {
      category: "Advanced Glute Programming",
      tips: [
        "20–25 glute sets per week. Split across multiple sessions — never all in one day.",
        "Heavy hip thrust: 1.5× bodyweight target for advanced women.",
        "Glute-specific periodization: 4-week strength block (4–6 reps) → 4-week hypertrophy block (10–15 reps) → deload.",
        "Address weak points: if upper glutes are lagging — more cable kickbacks and abductor work. If lower glutes — more hip thrusts and squats.",
        "Progressive overload on hip thrust is your primary metric. PR it every 8–12 weeks.",
      ],
    },
    {
      category: "Periodization",
      tips: [
        "Block periodization: alternate strength and hypertrophy phases every 4–6 weeks.",
        "Auto-regulate with RPE — some days will be 7/10 energy, some 9/10. Adjust load accordingly.",
        "Annual planning: strategically time cuts around life schedule. Don't cut during high-stress periods.",
        "Deload every 4–6 weeks — especially important for women to manage hormonal recovery.",
      ],
    },
    {
      category: "Advanced Techniques",
      tips: [
        "Rest-pause sets on hip thrusts and leg curls: 10 reps, rest 15 sec, 4–5 more.",
        "Tempo training: 3-second eccentric on squats and RDLs. Highest muscle damage.",
        "Myo-reps on isolation work (lateral raises, kickbacks, curls).",
        "BFR (Blood Flow Restriction) on leg extensions and curls — builds muscle at low load, easy on joints.",
        "Mechanical drop sets: hip thrust → B-stance hip thrust → frog pump (as fatigue sets in).",
      ],
    },
    {
      category: "Nutrition & Hormones",
      tips: [
        "Protein 2–2.2g/kg. Evidence for advanced women supports higher end of range.",
        "Cycle nutrition with menstrual phases. Track energy, performance, and hunger across 3 cycles.",
        "Iron: advanced female athletes are at higher risk of iron deficiency. Red meat or supplementation if needed.",
        "Don't cut aggressively. Women's hormonal systems respond poorly to large deficits. 300–400 kcal max deficit.",
        "Diet breaks (2 weeks at maintenance) every 8–10 weeks of cutting.",
      ],
    },
    {
      category: "Injury Prevention",
      tips: [
        "Hip and ankle mobility daily — 10 minutes every morning.",
        "Glute activation (banded walks, clamshells) before every lower body session.",
        "Strengthen hip abductors to prevent knee valgus (knees caving in on squats).",
        "Face pulls and band pull-aparts before every pressing session.",
      ],
    },
    {
      category: "Advanced Benchmarks",
      tips: [
        "Hip Thrust: 1.5× bodyweight × 5 reps = advanced.",
        "Squat: 1.25× bodyweight × 5 reps = advanced.",
        "Deadlift: 1.5× bodyweight × 1 rep = advanced.",
        "Pull-up: 5 unassisted full pull-ups = advanced.",
        "Lateral raise: 12–15 kg × 15 reps with clean form = advanced.",
      ],
    },
  ],
  isolationLibrary: ISOLATION_LIBRARY_WOMEN,
  toolkitCTA: TOOLKIT_CTAS,
};

export const advancedPlans: Record<Gender, AdvancedPlan> = {
  men: MEN,
  women: WOMEN,
};
