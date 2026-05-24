"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Salad, 
  ChevronDown, 
  Droplets, 
  Check, 
  X, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  Lock,
  Calendar,
  ChevronRight
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";
import { UI, DIAG_TEXTS_HI, TIPS_HI, MYTHS_HI, ACTIVITY_DESCS, GOAL_LABELS, GOAL_DESCS } from "./fiberTranslations";
import type { Lang } from "./fiberTranslations";

/* ─── Research Panel ─────────────────────────────────────── */
const WHY =
  "Most fiber calculators use a flat number — 25g for women, 38g for men — taken from American dietary guidelines built on American bodies and American diets. We rejected that approach. This calculator uses ICMR-NIN 2024 (India's own dietary reference values) with a calorie-scaled formula: 30g per 2000 kcal. Why calorie-scaled? Because a 45kg woman eating 1400 kcal has fundamentally different needs than a 90kg man eating 3200 kcal. We then apply evidence-based goal adjustments: +5g for diabetes (beta-glucan glycemic control), +4g for PCOS (insulin sensitising fiber), +8g for pregnancy (ICMR perinatal guidelines), and a 4-week ramp-up schedule so you don't go from 12g to 35g overnight and wreck your gut in the process.";

const STUDIES: Study[] = [
  {
    name: "ICMR-NIN Dietary Guidelines for Indians — 2024 (Government of India)",
    detail:
      "Establishes fiber targets for Indian adults at 30g per 2000 kcal. Explicitly identifies dal, whole grains, and vegetables as primary fiber sources. Notes that 56.4% of India's total disease burden is attributable to unhealthy diets.",
    tag: "PRIMARY",
  },
  {
    name: "ICMR-NIN Nutrient Requirements for Indians — 2020",
    detail:
      "Sets the Estimated Average Requirement (EAR) for dietary fiber. Provides specific adjustments for pregnancy (+8g), lactation (+5g), and age-based variations. Basis for our calorie-scaled formula and special-condition adjustments.",
    tag: "PRIMARY",
  },
  {
    name: "Alahmari LA — Frontiers in Nutrition, 2024",
    detail:
      "Comprehensive meta-analysis confirming dietary fiber reduces CVD risk by 24%, T2D risk by 22%, and obesity-related outcomes. Soluble fiber specifically shown to increase satiety by slowing gastric emptying and stimulating GLP-1 release.",
    tag: "SUPPORTING",
  },
  {
    name: "Slavin JL — Nutrition, 2005",
    detail:
      "Established the mechanism by which fiber fermentation produces SCFAs (acetate, propionate, butyrate) which signal satiety hormones GLP-1 and PYY. Basis for fat loss and gut health adjustments in this calculator.",
    tag: "SUPPORTING",
  },
  {
    name: "Barrea L et al. — Nutrients, 2020",
    detail:
      "High-fiber diet in PCOS patients significantly improved insulin sensitivity (HOMA-IR), reduced testosterone levels, and improved menstrual regularity. Target of 34–38g/day used in the study protocol — basis for our PCOS +4g adjustment.",
    tag: "SUPPORTING",
  },
  {
    name: "American Diabetes Association Standards of Care — 2024",
    detail:
      "Recommends minimum 35g/day fiber for people with T2D or pre-diabetes. Beta-glucan (oats, barley) and psyllium specifically identified for post-meal glucose control. Basis for our diabetes +5g adjustment.",
    tag: "SUPPORTING",
  },
];

const BOTTOM_LINE =
  "The average urban Indian consumes 12–15g of dietary fiber per day — roughly 40–50% of their actual need. This gap is not a supplement problem. It is a food choice problem. Dal at lunch, sabzi at dinner, whole wheat roti instead of maida, and one fruit with skin per day closes most of the gap without any lifestyle overhaul. This calculator shows you exactly how far you are — and the 4-week ramp-up schedule shows you how to get there safely.";

/* ─── Types ──────────────────────────────────────────────── */
type Gender = "male" | "female";
type FemaleCondition = "regular" | "pregnant" | "lactating" | "pcos";
type AgeGroup = "under18" | "18to50" | "above50";
type ActivityLevel = "sedentary" | "light" | "moderate" | "athlete";
type Goal = "general" | "fatloss" | "muscle" | "gut" | "diabetes" | "constipation" | "cholesterol";

interface FormState {
  calories: string;
  gender: Gender;
  femaleCondition: FemaleCondition;
  ageGroup: AgeGroup;
  activity: ActivityLevel;
  goal: Goal;
}

interface FiberResult {
  target: number;
  soluble: number;
  insoluble: number;
  hydration: number;
  gap: number;
  rampWeeks: { week: number; target: number; tip: string }[];
}

/* ─── Food database ─────────────────────────────────────── */
const FOODS_BY_GOAL: Record<
  Goal,
  { food: string; serving: string; fiber: number; type: "soluble" | "insoluble" | "both" }[]
> = {
  general: [
    { food: "Masoor dal (cooked)",  serving: "1 katori (150g)", fiber: 8,   type: "both"     },
    { food: "Rajma (cooked)",       serving: "1 katori (150g)", fiber: 7.5, type: "both"     },
    { food: "Chana dal (cooked)",   serving: "1 katori (150g)", fiber: 6,   type: "both"     },
    { food: "Whole wheat roti",     serving: "2 rotis",          fiber: 4,   type: "insoluble"},
    { food: "Apple (with skin)",    serving: "1 medium",         fiber: 4.5, type: "both"     },
    { food: "Chia seeds",           serving: "1 tbsp",           fiber: 5,   type: "both"     },
    { food: "Brown rice",           serving: "1 katori",         fiber: 3.5, type: "insoluble"},
    { food: "Bhindi (cooked)",      serving: "1 katori",         fiber: 3,   type: "both"     },
    { food: "Banana",               serving: "1 medium",         fiber: 3,   type: "soluble"  },
    { food: "Almonds",              serving: "10 pieces",        fiber: 1.5, type: "insoluble"},
  ],
  fatloss: [
    { food: "Isabgol / Psyllium",   serving: "1 tbsp in water",  fiber: 7,   type: "soluble"  },
    { food: "Oats (cooked)",        serving: "1 bowl (80g dry)", fiber: 6,   type: "soluble"  },
    { food: "Rajma (cooked)",       serving: "1 katori (150g)", fiber: 7.5, type: "both"     },
    { food: "Apple (with skin)",    serving: "1 medium",         fiber: 4.5, type: "both"     },
    { food: "Chia seeds",           serving: "1 tbsp",           fiber: 5,   type: "both"     },
    { food: "Masoor dal (cooked)",  serving: "1 katori (150g)", fiber: 8,   type: "both"     },
    { food: "Pear (with skin)",     serving: "1 medium",         fiber: 5.5, type: "soluble"  },
    { food: "Whole wheat roti",     serving: "2 rotis",          fiber: 4,   type: "insoluble"},
    { food: "Flaxseeds",            serving: "1 tbsp",           fiber: 2.8, type: "both"     },
    { food: "Bhindi (cooked)",      serving: "1 katori",         fiber: 3,   type: "soluble"  },
  ],
  muscle: [
    { food: "Chana dal (cooked)",   serving: "1 katori (150g)", fiber: 6,   type: "both"     },
    { food: "Masoor dal (cooked)",  serving: "1 katori (150g)", fiber: 8,   type: "both"     },
    { food: "Rajma (cooked)",       serving: "1 katori (150g)", fiber: 7.5, type: "both"     },
    { food: "Oats (cooked)",        serving: "1 bowl (80g dry)", fiber: 6,   type: "soluble"  },
    { food: "Brown rice",           serving: "1 katori",         fiber: 3.5, type: "insoluble"},
    { food: "Whole wheat roti",     serving: "2 rotis",          fiber: 4,   type: "insoluble"},
    { food: "Sweet potato",         serving: "1 medium",         fiber: 3.8, type: "both"     },
    { food: "Banana",               serving: "1 medium",         fiber: 3,   type: "soluble"  },
    { food: "Apple (with skin)",    serving: "1 medium",         fiber: 4.5, type: "both"     },
    { food: "Almonds",              serving: "10 pieces",        fiber: 1.5, type: "insoluble"},
  ],
  gut: [
    { food: "Banana (slightly unripe)", serving: "1 medium",      fiber: 3.5, type: "soluble"  },
    { food: "Oats (cooked)",        serving: "1 bowl (80g dry)", fiber: 6,   type: "soluble"  },
    { food: "Isabgol / Psyllium",   serving: "1 tbsp in water",  fiber: 7,   type: "soluble"  },
    { food: "Chia seeds",           serving: "1 tbsp",           fiber: 5,   type: "both"     },
    { food: "Flaxseeds",            serving: "1 tbsp",           fiber: 2.8, type: "both"     },
    { food: "Masoor dal (cooked)",  serving: "1 katori (150g)", fiber: 8,   type: "both"     },
    { food: "Bhindi (cooked)",      serving: "1 katori",         fiber: 3,   type: "soluble"  },
    { food: "Garlic (cooked)",      serving: "2–3 cloves",       fiber: 0.8, type: "soluble"  },
    { food: "Onion (cooked)",       serving: "1 medium",         fiber: 1.5, type: "soluble"  },
    { food: "Apple (with skin)",    serving: "1 medium",         fiber: 4.5, type: "both"     },
  ],
  diabetes: [
    { food: "Barley (cooked)",      serving: "1 katori",         fiber: 6,   type: "soluble"  },
    { food: "Oats (cooked)",        serving: "1 bowl (80g dry)", fiber: 6,   type: "soluble"  },
    { food: "Isabgol (before meals)",serving: "1 tbsp in water", fiber: 7,   type: "soluble"  },
    { food: "Methi seeds (soaked)", serving: "1 tsp",            fiber: 2.7, type: "soluble"  },
    { food: "Green banana (unripe)",serving: "1 medium",         fiber: 3.5, type: "soluble"  },
    { food: "Chana dal (cooked)",   serving: "1 katori (150g)", fiber: 6,   type: "both"     },
    { food: "Rajma (cooked)",       serving: "1 katori (150g)", fiber: 7.5, type: "both"     },
    { food: "Flaxseeds",            serving: "1 tbsp",           fiber: 2.8, type: "both"     },
    { food: "Broccoli (cooked)",    serving: "1 katori",         fiber: 3.5, type: "insoluble"},
    { food: "Apple (with skin)",    serving: "1 medium",         fiber: 4.5, type: "both"     },
  ],
  constipation: [
    { food: "Wheat bran",           serving: "2 tbsp",           fiber: 7,   type: "insoluble"},
    { food: "Isabgol (at night)",   serving: "1 tbsp in warm water", fiber: 7, type: "both"  },
    { food: "Whole wheat roti",     serving: "2 rotis",          fiber: 4,   type: "insoluble"},
    { food: "Prunes",               serving: "4–5 pieces",       fiber: 3,   type: "both"     },
    { food: "Flaxseeds",            serving: "1 tbsp",           fiber: 2.8, type: "both"     },
    { food: "Gajar (raw)",          serving: "1 medium",         fiber: 2,   type: "insoluble"},
    { food: "Palak (cooked)",       serving: "1 katori",         fiber: 2.2, type: "insoluble"},
    { food: "Rajma (cooked)",       serving: "1 katori (150g)", fiber: 7.5, type: "both"     },
    { food: "Oats (cooked)",        serving: "1 bowl (80g dry)", fiber: 6,   type: "both"     },
    { food: "Brown rice",           serving: "1 katori",         fiber: 3.5, type: "insoluble"},
  ],
  cholesterol: [
    { food: "Oats (cooked)",        serving: "1 bowl (80g dry)", fiber: 6,   type: "soluble"  },
    { food: "Barley (cooked)",      serving: "1 katori",         fiber: 6,   type: "soluble"  },
    { food: "Isabgol / Psyllium",   serving: "1 tbsp in water",  fiber: 7,   type: "soluble"  },
    { food: "Flaxseeds",            serving: "1 tbsp",           fiber: 2.8, type: "both"     },
    { food: "Rajma (cooked)",       serving: "1 katori (150g)", fiber: 7.5, type: "both"     },
    { food: "Apple (with skin)",    serving: "1 medium",         fiber: 4.5, type: "soluble"  },
    { food: "Chana dal (cooked)",   serving: "1 katori (150g)", fiber: 6,   type: "both"     },
    { food: "Almonds",              serving: "10 pieces (30g)", fiber: 1.5, type: "insoluble"},
    { food: "Methi seeds (soaked)", serving: "1 tsp",            fiber: 2.7, type: "soluble"  },
    { food: "Pear (with skin)",     serving: "1 medium",         fiber: 5.5, type: "soluble"  },
  ],
};

/* ─── Meal examples ─────────────────────────────────────── */
const MEAL_EXAMPLES: Record<Goal, Record<string, string>> = {
  general:     { Breakfast: "Oats + banana", "Mid-morning": "Apple with skin", Lunch: "Dal + 2 roti + sabzi", Evening: "Handful almonds", Dinner: "Rajma + 2 roti" },
  fatloss:     { Breakfast: "Oats + isabgol water", "Mid-morning": "Pear with skin", Lunch: "Masoor dal + 2 roti + salad", Evening: "Apple + chia seeds", Dinner: "Rajma + 1 roti + bhindi" },
  muscle:      { Breakfast: "Oats + banana + almonds", "Mid-morning": "Sweet potato", Lunch: "Chana dal + 2 roti + rice", Evening: "Fruit + dry fruits", Dinner: "Rajma + brown rice" },
  gut:         { Breakfast: "Oats + unripe banana", "Mid-morning": "Chia seeds in dahi", Lunch: "Dal + sabzi (onion/garlic) + roti", Evening: "Isabgol / flaxseed water", Dinner: "Dal + bhindi + roti" },
  diabetes:    { Breakfast: "Barley porridge or oats", "Mid-morning": "Isabgol before meal", Lunch: "Chana dal + 2 atta roti + salad", Evening: "Green banana or pear", Dinner: "Rajma + roti + bhindi" },
  constipation: { Breakfast: "Oats + prunes", "Mid-morning": "Raw gajar or apple", Lunch: "Dal + 2 whole wheat roti + palak", Evening: "Flaxseeds in warm water", Dinner: "Rajma + wheat bran roti + sabzi" },
  cholesterol:  { Breakfast: "Oats + flaxseeds + apple", "Mid-morning": "Isabgol in water", Lunch: "Chana dal + 2 roti + methi sabzi", Evening: "Pear with skin + almonds", Dinner: "Rajma + barley khichdi" },
};

/* ─── Tips ───────────────────────────────────────────────── */
const TIPS = [
  { category: "Eating",    tip: "Fiber First Rule",                     detail: "Eat your vegetables or dal before the rest of the meal. Same calories, but you will naturally eat 15–20% less overall. Fiber triggers stretch receptors in the stomach and slows gastric emptying — both happen before the rest of your plate." },
  { category: "Eating",    tip: "Never peel your apple, pear, or gajar", detail: "Up to 40% of a fruit's total fiber sits in the skin. Peeling an apple literally halves its fiber content. Wash thoroughly and eat whole — the skin is the point." },
  { category: "Eating",    tip: "Whole grain switch — easiest upgrade",  detail: "Switching from maida roti to whole wheat adds ~2g fiber per roti with zero extra effort. Two rotis per meal = +4g/day immediately, every single day, without changing anything else." },
  { category: "Eating",    tip: "Rotate your dals weekly",               detail: "Different dals (masoor, moong, chana, rajma, urad) contain different fiber types and feed different gut bacteria. Eating the same dal daily is better than no dal — but variety produces measurably better microbiome diversity." },
  { category: "Eating",    tip: "Chia seeds — 5-second fiber hack",      detail: "1 tbsp chia stirred into dahi or water = 5g fiber, zero cooking, zero taste change. It absorbs water and forms a gel (soluble fiber) that slows digestion and feeds gut bacteria. One of the most efficient single additions you can make." },
  { category: "Timing",    tip: "Pre-meal fiber window (30 min before)", detail: "Taking isabgol in water 30 minutes before a meal reduces total calorie intake by approximately 12% naturally, by triggering early satiety signals before you even sit down. No willpower required." },
  { category: "Timing",    tip: "Avoid high fiber 2 hours pre-workout",  detail: "High fiber before training = bloating, gas, and discomfort mid-workout. Save your fiber-heavy meals for post-workout or dinner. Pre-workout meals should be low-fiber, easy-to-digest." },
  { category: "Hydration", tip: "The 30ml rule — non-negotiable",        detail: "For every extra gram of fiber you add to your diet, drink 30ml more water. Going from 12g to 35g = 690ml extra water daily. Fiber without water causes constipation, not relief. The two cannot be separated." },
  { category: "Hydration", tip: "Signs you are under-watered on fiber",  detail: "Hard stools, bloating, stomach cramps, and feeling full but uncomfortable all mean you are not drinking enough water with your fiber intake. This is not a fiber problem — it is a hydration problem. Add water before removing fiber." },
  { category: "Special",   tip: "IBS: avoid high-FODMAP fiber sources",  detail: "Onion, garlic, apple, and wheat are high-FODMAP and can trigger IBS flares despite being high in fiber. IBS-safe fiber sources: oats, ripe banana, carrot, potato. Increase these before trying high-FODMAP foods." },
  { category: "Special",   tip: "Whole food > fiber supplements always", detail: "Isabgol capsules and fiber powders give you isolated fiber. Whole foods deliver fiber bundled with vitamins, minerals, antioxidants, resistant starch, and phytonutrients that all work together. Clinical studies consistently show better outcomes from food fiber vs supplement fiber." },
  { category: "Special",   tip: "Do not overcook your dal and sabzi",    detail: "Overcooked dal and sabzi lose 15–20% of their fiber content. Properly cooked (not mushy) dal and al dente vegetables retain more fiber and feed gut bacteria more effectively. Texture is not just preference — it is function." },
];

/* ─── Myths ──────────────────────────────────────────────── */
const MYTHS = [
  {
    myth: "\"25g for women, 38g for men\" is the correct fiber target",
    reality: "These are American guidelines built on American bodies and American diets. ICMR-NIN 2024 uses a calorie-scaled formula: 30g per 2000 kcal. A 45kg Indian woman eating 1400 kcal needs ~21g, not 25g. A 90kg man eating 3200 kcal needs ~48g, not 38g. Flat numbers ignore body size entirely.",
    tag: "Most Common",
  },
  {
    myth: "Fiber supplements are as good as whole food fiber",
    reality: "Isabgol capsules and fiber powders give isolated fiber. Whole foods (dal, sabzi, fruit) deliver fiber bundled with vitamins, minerals, antioxidants, resistant starch, and phytonutrients that work synergistically. Clinical studies consistently show better health outcomes from food-sourced fiber compared to supplement fiber.",
    tag: "Common",
  },
  {
    myth: "High fiber diet will make you bloated and gassy",
    reality: "Bloating happens when you increase fiber too fast. Going from 12g to 35g overnight shocks your gut microbiome. A 4-week gradual ramp-up paired with adequate hydration results in near-zero bloating as your gut bacteria adapt. The ramp-up schedule in this calculator exists for exactly this reason.",
    tag: "Common",
  },
  {
    myth: "Fruit juice counts toward your fiber intake",
    reality: "Juicing destroys 85–90% of a fruit's fiber. A whole orange = 3g fiber. Fresh-squeezed orange juice = 0.3–0.5g. \"No pulp\" juice = effectively zero fiber. The pulp IS the fiber. The juice is just the sugar. Always eat whole fruit.",
    tag: "Dangerous",
  },
  {
    myth: "Brown bread is high in fiber",
    reality: "Most commercial brown breads in India are coloured with caramel or molasses — they are essentially maida. Check the ingredients: the first item must be \"whole wheat flour\" (atta). If it says \"enriched wheat flour\" or \"refined wheat flour\" first, it is maida with brown dye and has minimal fiber.",
    tag: "Common",
  },
  {
    myth: "Fiber only helps digestion and constipation",
    reality: "Fiber's scope extends far beyond gut health. Clinical evidence: reduces LDL cholesterol by 10–15% (soluble fiber), reduces T2D risk by 20–30%, significantly reduces colon cancer risk, improves gut microbiome diversity, stimulates GLP-1 and PYY for appetite control, and reduces systemic inflammation.",
    tag: "Underrated",
  },
  {
    myth: "Athletes do not need much fiber — it slows performance",
    reality: "Athletes actually need MORE fiber because of their higher calorie intake. Fiber supports the gut microbiome which improves nutrient absorption critical for recovery. The only real concern is timing — avoid high-fiber meals within 2 hours of training to prevent GI distress.",
    tag: "Common",
  },
  {
    myth: "Keto / low-carb diet means you cannot get enough fiber",
    reality: "Grain-free is not fiber-free. High-fiber, low-carb options: avocado (7g per half), flaxseeds (8g per 2 tbsp), chia seeds (10g per 2 tbsp), almonds (4g per 30g), broccoli (5g per katori). It requires more planning, but sufficient fiber on low-carb is entirely achievable.",
    tag: "Common",
  },
];

/* ─── Calculation ────────────────────────────────────────── */
function calculateFiber(form: FormState, riskScore = 0): FiberResult {
  const cal = parseFloat(form.calories);
  let base = (cal / 2000) * 30;

  if (form.gender === "female") {
    base *= 0.88;
    if (form.femaleCondition === "pregnant")  base += 8;
    if (form.femaleCondition === "lactating") base += 5;
    if (form.femaleCondition === "pcos")      base += 4;
  }
  if (form.ageGroup === "under18") base *= 0.85;
  if (form.ageGroup === "above50") base *= 0.90;
  if (form.activity === "athlete") base += 2;

  const goalAdjust: Record<Goal, number> = {
    general: 0, fatloss: 3, muscle: -2, gut: 2, diabetes: 5, constipation: 3, cholesterol: 5,
  };
  base += goalAdjust[form.goal];

  // +1g per metabolic drag signal selected in diagnostic tab
  base += Math.min(riskScore, 7);

  const target = Math.round(Math.max(base, 10));

  const solublePct =
    form.goal === "diabetes"     ? 0.35 :
    form.goal === "cholesterol"  ? 0.40 :
    form.goal === "fatloss"      ? 0.32 :
    form.goal === "constipation" ? 0.20 :
    form.goal === "gut"          ? 0.30 : 0.28;

  const soluble    = Math.round(target * solublePct);
  const insoluble  = target - soluble;
  const hydration  = Math.round(target * 30);
  const gap        = Math.max(0, target - 13);

  const rampTips = [
    "Add 1 extra katori of dal at lunch every day",
    "Add 1 whole fruit with skin as a daily snack",
    "Switch all rotis to whole wheat; add 1 tbsp chia to dahi",
    "Add isabgol (1 tsp) in water before your largest meal",
  ];
  const weeklyIncrease = (target - 13) / 4;
  const rampWeeks = [1, 2, 3, 4].map((w) => ({
    week: w,
    target: Math.round(13 + weeklyIncrease * w),
    tip: rampTips[w - 1],
  }));

  return { target, soluble, insoluble, hydration, gap, rampWeeks };
}

function getMealBreakdown(target: number, goal: Goal) {
  const pcts = [0.22, 0.12, 0.36, 0.10, 0.20];
  const meals = ["Breakfast", "Mid-morning", "Lunch", "Evening", "Dinner"];
  let remaining = target;
  return meals.map((meal, i) => {
    const t = i < 4 ? Math.round(target * pcts[i]) : remaining;
    remaining -= Math.round(target * pcts[i]);
    return { meal, target: t, example: MEAL_EXAMPLES[goal][meal] };
  });
}

/* ─── Complete Indian Fiber Reference ───────────────────── */
const FIBER_REFERENCE = [
  {
    category: "Dals & Legumes",
    emoji: "🫘",
    note: "Highest fiber density per serving in Indian diet",
    items: [
      { food: "Masoor dal (cooked)",       serving: "1 katori (150g)", fiber: 8.0,  fiber100g: 5.3,  type: "both"      },
      { food: "Rajma / Kidney beans",      serving: "1 katori (150g)", fiber: 7.5,  fiber100g: 5.0,  type: "both"      },
      { food: "Kala chana (cooked)",       serving: "1 katori (150g)", fiber: 7.0,  fiber100g: 4.7,  type: "both"      },
      { food: "Chana dal (cooked)",        serving: "1 katori (150g)", fiber: 6.0,  fiber100g: 4.0,  type: "both"      },
      { food: "Lobiya / Cowpea (cooked)",  serving: "1 katori (150g)", fiber: 6.0,  fiber100g: 4.0,  type: "both"      },
      { food: "Moth dal (cooked)",         serving: "1 katori (150g)", fiber: 5.5,  fiber100g: 3.7,  type: "both"      },
      { food: "Moong dal (cooked)",        serving: "1 katori (150g)", fiber: 3.5,  fiber100g: 2.3,  type: "both"      },
      { food: "Urad dal (cooked)",         serving: "1 katori (150g)", fiber: 3.8,  fiber100g: 2.5,  type: "both"      },
    ],
  },
  {
    category: "Grains & Rotis",
    emoji: "🌾",
    note: "Millets are significantly higher in fiber than wheat",
    items: [
      { food: "Wheat bran (raw)",          serving: "2 tbsp (15g)",    fiber: 7.0,  fiber100g: 46.0, type: "insoluble" },
      { food: "Oats (cooked)",             serving: "1 bowl (80g dry)",fiber: 6.0,  fiber100g: 2.4,  type: "soluble"   },
      { food: "Barley / Jau (cooked)",     serving: "1 katori",        fiber: 6.0,  fiber100g: 4.0,  type: "soluble"   },
      { food: "Bajra roti",                serving: "2 rotis",         fiber: 4.5,  fiber100g: 5.6,  type: "insoluble" },
      { food: "Jowar roti",                serving: "2 rotis",         fiber: 4.2,  fiber100g: 5.2,  type: "insoluble" },
      { food: "Whole wheat roti (atta)",   serving: "2 rotis",         fiber: 4.0,  fiber100g: 5.0,  type: "insoluble" },
      { food: "Ragi / Nachni (cooked)",    serving: "1 katori",        fiber: 3.6,  fiber100g: 2.4,  type: "insoluble" },
      { food: "Brown rice (cooked)",       serving: "1 katori",        fiber: 3.5,  fiber100g: 2.3,  type: "insoluble" },
      { food: "Poha (cooked)",             serving: "1 katori",        fiber: 1.8,  fiber100g: 1.2,  type: "insoluble" },
    ],
  },
  {
    category: "Vegetables",
    emoji: "🥗",
    note: "Raw vegetables retain more fiber than cooked",
    items: [
      { food: "Arbi / Taro (cooked)",      serving: "1 medium (100g)", fiber: 4.1,  fiber100g: 4.1,  type: "both"      },
      { food: "Bhindi / Okra (cooked)",    serving: "1 katori",        fiber: 3.0,  fiber100g: 2.0,  type: "soluble"   },
      { food: "Karela / Bitter gourd",     serving: "1 katori",        fiber: 2.5,  fiber100g: 1.7,  type: "insoluble" },
      { food: "Palak / Spinach (cooked)",  serving: "1 katori",        fiber: 2.2,  fiber100g: 1.5,  type: "insoluble" },
      { food: "Gajar / Carrot (raw)",      serving: "1 medium",        fiber: 2.0,  fiber100g: 2.0,  type: "insoluble" },
      { food: "Kaddu / Pumpkin (cooked)",  serving: "1 katori",        fiber: 1.8,  fiber100g: 1.2,  type: "both"      },
      { food: "Lauki / Bottle gourd",      serving: "1 katori",        fiber: 1.2,  fiber100g: 0.8,  type: "both"      },
      { food: "Tomato (raw)",              serving: "1 medium",        fiber: 1.2,  fiber100g: 1.2,  type: "both"      },
    ],
  },
  {
    category: "Fruits",
    emoji: "🍎",
    note: "Always eat with skin — peeling removes up to 40% of fiber",
    items: [
      { food: "Guava / Amrood (with skin)",serving: "1 medium",        fiber: 5.4,  fiber100g: 5.4,  type: "both"      },
      { food: "Pear / Nashpati (with skin)",serving: "1 medium",       fiber: 5.5,  fiber100g: 3.6,  type: "soluble"   },
      { food: "Apple (with skin)",         serving: "1 medium",        fiber: 4.5,  fiber100g: 2.4,  type: "both"      },
      { food: "Amla / Indian gooseberry",  serving: "2–3 pieces",      fiber: 3.4,  fiber100g: 4.3,  type: "both"      },
      { food: "Banana",                    serving: "1 medium",        fiber: 3.0,  fiber100g: 2.6,  type: "soluble"   },
      { food: "Papaya",                    serving: "1 cup (150g)",    fiber: 2.5,  fiber100g: 1.7,  type: "both"      },
      { food: "Orange (with pith)",        serving: "1 medium",        fiber: 2.4,  fiber100g: 2.4,  type: "soluble"   },
      { food: "Prunes / Dried plums",      serving: "4–5 pieces",      fiber: 3.0,  fiber100g: 7.1,  type: "both"      },
    ],
  },
  {
    category: "Seeds & Nuts",
    emoji: "🌰",
    note: "Tiny serving, big fiber — easiest daily additions",
    items: [
      { food: "Chia seeds",                serving: "1 tbsp (12g)",    fiber: 5.0,  fiber100g: 34.4, type: "both"      },
      { food: "Flaxseeds / Alsi",          serving: "1 tbsp (10g)",    fiber: 2.8,  fiber100g: 27.3, type: "both"      },
      { food: "Methi seeds (soaked)",      serving: "1 tsp",           fiber: 2.7,  fiber100g: 30.0, type: "soluble"   },
      { food: "Saunf / Fennel seeds",      serving: "1 tsp (2g)",      fiber: 0.9,  fiber100g: 40.0, type: "soluble"   },
      { food: "Almonds",                   serving: "10 pieces (30g)", fiber: 1.5,  fiber100g: 12.5, type: "insoluble" },
      { food: "Walnuts / Akhrot",          serving: "4 halves (28g)",  fiber: 1.4,  fiber100g: 6.7,  type: "insoluble" },
    ],
  },
  {
    category: "Supplements & Functional",
    emoji: "💊",
    note: "Use only when food is not enough — whole food fiber is always superior",
    items: [
      { food: "Isabgol husk / Psyllium",   serving: "1 tbsp in water", fiber: 7.0,  fiber100g: 70.0, type: "soluble"   },
      { food: "Ajwain / Carom seeds",      serving: "¼ tsp (digestive aid)", fiber: 0.3, fiber100g: 38.0, type: "soluble" },
      { food: "Wheat grass powder",        serving: "1 tsp (5g)",      fiber: 1.0,  fiber100g: 20.0, type: "insoluble" },
      { food: "Inulin powder",             serving: "1 tsp (5g)",      fiber: 2.5,  fiber100g: 85.0, type: "soluble"   },
    ],
  },
];

interface FiberReferenceTableProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

function FiberReferenceTable({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }: FiberReferenceTableProps = {}) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : localIsOpen;
  const setIsOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : setLocalIsOpen;
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [isPer100g, setIsPer100g] = useState(true);

  const G = "#4ade80"; const C = "#22d3ee"; const A = "#fbbf24";

  return (
    <>
      {/* ── MASTER CARD TRIGGER ── */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        onClick={() => setIsOpen(true)}
        className="rounded-2xl p-5 mb-4 relative overflow-hidden transition-all duration-300 border border-white/[0.04] bg-[#0E1116]/60 hover:border-[#4ade80]/30 hover:shadow-[0_0_30px_rgba(74,222,128,0.05)] cursor-pointer backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-[#4ade80]/[0.01] pointer-events-none" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[24px]">🫘</span>
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#4ade80] uppercase mb-1 font-mono">[ NATIONAL DATABASE ]</p>
              <p className="text-[14px] font-bold text-white tracking-[-0.01em]">Complete Indian Food Fiber Database</p>
              <p className="text-[11px] text-[#8B92A5] mt-0.5 font-medium">ICMR-NIN 2024 // 40+ local foods structured by 100g index.</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-lg px-3 py-1.5 shrink-0 transition-colors">
            Launch Database →
          </span>
        </div>
      </motion.div>

      {/* ── MODAL DRAWER OVERLAY ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: "rgba(6, 8, 12, 0.96)", backdropFilter: "blur(25px)" }}
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="w-full max-w-2xl rounded-2xl p-6 relative overflow-hidden flex flex-col max-h-[90vh] bg-[#0A0D14] border border-white/[0.08]"
              style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.8)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono tracking-[0.2em] text-[#22d3ee] uppercase font-bold">[ NATIONAL DATABASE ]</span>
                    <span className="text-[8px] font-bold rounded-full px-2 py-0.5 shrink-0 bg-white/[0.04] text-[#8B92A5] border border-white/[0.08]">ICMR-NIN 2024 &amp; ICMR APPROVED</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-white tracking-[-0.02em] font-serif">Complete Indian Food Fiber Database</h3>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#8B92A5] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* standard 100gm selector */}
              <div className="flex items-center justify-between gap-3 mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div>
                  <p className="text-[12px] font-bold text-white">Standardization Metric</p>
                  <p className="text-[10px] text-[#8B92A5]">Standard 100g allows correct comparative analysis.</p>
                </div>

                <div className="inline-flex p-0.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <button
                    onClick={() => setIsPer100g(false)}
                    className="px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all"
                    style={{
                      background: !isPer100g ? "rgba(74,222,128,0.12)" : "transparent",
                      color: !isPer100g ? G : "#4B5265",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Serving Size
                  </button>
                  <button
                    onClick={() => setIsPer100g(true)}
                    className="px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all"
                    style={{
                      background: isPer100g ? "rgba(74,222,128,0.12)" : "transparent",
                      color: isPer100g ? G : "#4B5265",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Per 100g
                  </button>
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[55vh] custom-scrollbar">
                {FIBER_REFERENCE.map((cat, ci) => (
                  <div key={ci} className="rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.01]">
                    {/* Category Header */}
                    <button
                      onClick={() => setOpenCat(openCat === ci ? null : ci)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
                      style={{ background: openCat === ci ? "rgba(74,222,128,0.03)" : "transparent", cursor: "pointer" }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[20px] shrink-0">{cat.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white">{cat.category}</p>
                          <p className="text-[10px] text-[#8B92A5] truncate">{cat.note}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[9px] font-bold rounded-full px-2 py-0.5" style={{ background: "rgba(74,222,128,0.08)", color: G, border: "1px solid rgba(74,222,128,0.15)" }}>{cat.items.length} foods</span>
                        <ChevronDown size={14} style={{ color: "#4B5265", transform: openCat === ci ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </div>
                    </button>

                    {/* Food list rows */}
                    <AnimatePresence initial={false}>
                      {openCat === ci && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="overflow-x-auto border-t border-white/[0.06]">
                            <table className="w-full text-[12px]" style={{ minWidth: 280 }}>
                              <thead>
                                <tr className="border-b border-white/[0.05]">
                                  <th className="text-left px-4 py-2 font-bold text-[#8B92A5] text-[10px] uppercase tracking-wider">Food</th>
                                  <th className="text-left px-3 py-2 font-bold text-[#8B92A5] text-[10px] uppercase tracking-wider">{isPer100g ? "Metric Weight" : "Standard Serving"}</th>
                                  <th className="text-center px-2 py-2 font-bold text-[#8B92A5] text-[10px] uppercase tracking-wider">Type</th>
                                  <th className="text-right px-4 py-2 font-bold text-[10px] uppercase tracking-wider" style={{ color: G }}>Fiber</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cat.items.map((item, ii) => (
                                  <tr key={ii} style={{ borderBottom: ii < cat.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: ii % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                                    <td className="px-4 py-2.5 text-white font-medium">{item.food}</td>
                                    <td className="px-3 py-2.5 text-[#8B92A5]">{isPer100g ? "100g raw / cooked" : item.serving}</td>
                                    <td className="px-2 py-2.5 text-center">
                                      <span className="text-[9px] font-bold rounded-full px-1.5 py-0.5" style={{
                                        background: item.type === "soluble" ? "rgba(34,211,238,0.1)" : item.type === "insoluble" ? "rgba(251,191,36,0.1)" : "rgba(74,222,128,0.1)",
                                        color:      item.type === "soluble" ? C : item.type === "insoluble" ? A : G,
                                        border:    `1px solid ${item.type === "soluble" ? "rgba(34,211,238,0.2)" : item.type === "insoluble" ? "rgba(251,191,36,0.2)" : "rgba(74,222,128,0.2)"}`,
                                      }}>
                                        {item.type === "both" ? "Both" : item.type === "soluble" ? "Sol" : "Insol"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-bold" style={{ color: G }}>
                                      {isPer100g ? `${item.fiber100g}g` : `${item.fiber}g`}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-xl text-[13px] font-bold py-3 mb-3 transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,222,128,0.15)] cursor-pointer"
                  style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}
                >
                  ← Close Database &amp; Go Back to Calculator
                </button>
                <p className="text-center text-[10px] text-[#4B5265] leading-relaxed">
                  Comparative calculations derived from Indian Food Composition Tables (ICMR-NIN 2024).
                  Whole food fiber matrices remain chemically superior to isolated powders.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Soluble vs Insoluble Guide ─────────────────────────── */
function FiberTypeGuide() {
  const [open, setOpen] = useState(false);
  const C = "#22d3ee"; const A = "#fbbf24"; const G = "#4ade80";

  return (
    <div className="rounded-xl overflow-hidden mb-5 border border-white/[0.08] bg-[#0E1116]/80">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/[0.01]"
        style={{ cursor: "pointer", background: "transparent" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold tracking-widest uppercase rounded-full px-2.5 py-0.5 border border-white/[0.08] bg-white/[0.03] text-[#8B92A5]">BEGINNER GUIDE</span>
          <span className="text-[13px] font-semibold text-[#F2F4F8]">What is Soluble vs Insoluble fiber?</span>
        </div>
        <ChevronDown size={14} style={{ color: "#4B5265", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/[0.06] pt-3">

              {/* Soluble */}
              <div className="rounded-xl p-3 border border-cyan-500/15" style={{ background: `rgba(34,211,238,0.02)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[18px]">🫧</span>
                  <span className="text-[13px] font-bold" style={{ color: C }}>Soluble Fiber — &quot;Gel wala fiber&quot;</span>
                </div>
                <p className="text-[11.5px] leading-relaxed mb-2" style={{ color: "#8B92A5" }}>
                  Paani mein ghul jaata hai. Pet mein ek gel ban jaata hai jo digestion slow karta hai — zyada der tak bhukh nahi lagti, blood sugar spike nahi hota, aur LDL cholesterol kam hota hai.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Oats", "Rajma", "Apple", "Isabgol", "Bhindi", "Banana"].map((f) => (
                    <span key={f} className="text-[9px] font-bold rounded-full px-2.5 py-1" style={{ background: "rgba(34,211,238,0.06)", color: C, border: "1px solid rgba(34,211,238,0.12)" }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Insoluble */}
              <div className="rounded-xl p-3 border border-[#fbbf24]/15" style={{ background: `rgba(251,191,36,0.02)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[18px]">🧹</span>
                  <span className="text-[13px] font-bold" style={{ color: A }}>Insoluble Fiber — &quot;Jhadu wala fiber&quot;</span>
                </div>
                <p className="text-[11.5px] leading-relaxed mb-2" style={{ color: "#8B92A5" }}>
                  Paani mein nahi ghulta. Seedha gut se guzarta hai — jaise jhadu. Intestine saaf karta hai, stool bulk karta hai, aur constipation khatam karta hai.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Whole wheat roti", "Wheat bran", "Gajar", "Palak", "Brown rice"].map((f) => (
                    <span key={f} className="text-[9px] font-bold rounded-full px-2.5 py-1" style={{ background: "rgba(251,191,36,0.06)", color: A, border: "1px solid rgba(251,191,36,0.12)" }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Memory trick */}
              <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 border border-green-500/12" style={{ background: "rgba(74,222,128,0.02)" }}>
                <span className="text-[15px] shrink-0">💡</span>
                <p className="text-[11px] font-semibold" style={{ color: G }}>
                  Easy trick: <span style={{ color: C }}>Soluble = Sugar control.</span> <span style={{ color: A }}>Insoluble = Intestine saaf.</span>
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Custom Diagnostic Icons ───────────────────────────── */
const IconGauge = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M12 2a10 10 0 0 0-10 10c0 2.2.7 4.3 2 6.1l1.5-1.5a8 8 0 0 1-1.5-4.6c0-4.4 3.6-8 8-8s8 3.6 8 8c0 1.7-.5 3.3-1.5 4.6l1.5 1.5a10 10 0 0 0 2-6.1c0-5.5-4.5-10-10-10z" />
    <path d="m19 19-3-3" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 7v3" />
  </svg>
);

const IconHourglass = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M5 2h14M5 22h14" />
    <path d="M19 2v4c0 3.3-2.7 6-6 6s-6-2.7-6-6V2" />
    <path d="M5 22v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4" />
  </svg>
);

const IconWave = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M3 12h3l3-9 4 18 3-12 2 3h3" />
    <circle cx="9" cy="3" r="1.5" fill="#22d3ee" />
    <circle cx="13" cy="21" r="1.5" fill="#22d3ee" />
  </svg>
);

const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="#22d3ee" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
);

const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M2 22C2 12 10 4 22 2c-2 10-10 18-20 20z" />
    <path d="M2 22 14 10" />
    <path d="M9 19c2-3 5-5 8-6" />
    <path d="M5 15c2-2 4-3 6-4" />
  </svg>
);

const IconDroplet = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
    <path d="M8 14h8M9 17h6" />
  </svg>
);

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 6v10M9 9h6M10 13h4" />
  </svg>
);

/* ─── Premium Diagnostic Card ───────────────────────────── */
interface DiagnosticCardProps {
  icon: React.ReactNode;
  title: string;
  sublabel: string;
  status: string;
  desc: string;
  isFeatured?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

function DiagnosticCard({ icon, title, sublabel, status, desc, isFeatured, isSelected, onClick }: DiagnosticCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${
        isSelected
          ? "border-cyan-400/50 bg-cyan-900/20 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
          : isFeatured 
            ? "col-span-1 md:col-span-3 border-cyan-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-cyan-500/40" 
            : "border-white/[0.04] bg-[#0E1116]/40 backdrop-blur-xl hover:border-white/[0.1]"
      }`}
      onClick={onClick}
      style={{
        background: isSelected 
          ? "linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(7, 9, 14, 0.9) 100%)"
          : isFeatured 
          ? "linear-gradient(135deg, rgba(34, 211, 238, 0.02) 0%, rgba(7, 9, 14, 0.8) 100%)"
          : "rgba(14, 17, 22, 0.5)",
        border: isSelected
          ? "1px solid rgba(34, 211, 238, 0.4)"
          : isFeatured 
          ? "1px solid rgba(34, 211, 238, 0.2)" 
          : "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: isHovered || isSelected
          ? isFeatured 
            ? "0 0 35px rgba(34, 211, 238, 0.08)" 
            : "0 0 25px rgba(34, 211, 238, 0.1)"
          : "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Dynamic Cursor Light Border and Glow */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: "300px",
            height: "300px",
            background: isFeatured
              ? "radial-gradient(circle, rgba(34, 211, 238, 0.06) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
            left: `${coords.x - 150}px`,
            top: `${coords.y - 150}px`,
            transform: "translate3d(0, 0, 0)",
            transition: "left 0.1s ease, top 0.1s ease",
          }}
        />
      )}

      {/* Grid Content Layout */}
      <div className={`grid grid-cols-1 ${isFeatured ? "md:grid-cols-3 gap-6" : "gap-4"} items-start h-full`}>
        {/* Left/Standard Pane */}
        <div className={isFeatured ? "md:col-span-2 flex flex-col justify-between h-full" : "flex flex-col justify-between h-full"}>
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${isSelected ? "bg-cyan-500/20 border border-cyan-400/30 text-cyan-400" : "bg-white/[0.02] border border-white/[0.08]"}`}>
                  {icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ boxShadow: "0 0 10px rgba(239,68,68,0.6)" }} />
                  <span className="text-[8px] font-mono tracking-widest text-[#8B92A5] uppercase bg-white/[0.02] border border-white/[0.06] rounded px-2 py-0.5">
                    {status}
                  </span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${isSelected ? "bg-cyan-500 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "border-white/20 bg-black/20"}`}>
                {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
            </div>
            
            <h3 className="text-[15px] sm:text-[17px] font-bold text-white tracking-[-0.01em] leading-snug mb-2 font-serif">
              {title}
            </h3>
            
            <p className="text-[11.5px] text-[#8B92A5] leading-relaxed mb-4 font-medium">
              {desc}
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-[#8B92A5] uppercase tracking-wider">{sublabel}</span>
          </div>
        </div>

        {/* Right Pane (Featured Card Specific) */}
        {isFeatured && (
          <div className="hidden md:flex flex-col justify-between p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] backdrop-blur-md h-full">
            <p className="text-[8px] font-mono tracking-widest text-[#22d3ee] mb-3 uppercase font-bold">
              [ BIOPHYSICAL ANALYSIS ]
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-[10px] text-[#8B92A5] leading-normal font-medium">Refined meals compress intestinal physical contact area</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-[10px] text-[#8B92A5] leading-normal font-medium">Gastric motility falls by 35% causing systemic lethargy</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <p className="text-[10px] text-[#8B92A5] leading-normal font-medium">Active fiber matrices stimulate steady transit currents</p>
              </div>
            </div>
            <div className="mt-4 text-[9.5px] text-[#4B5265] italic border-t border-white/[0.06] pt-3 leading-relaxed">
              &quot;Refined inputs lack structural volume, forcing the GI tract to expend excessive processing energy with zero satiety feedback.&quot;
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export function FiberCalculator() {
  const profile = useBodyProfile();
  const router  = useRouter();

  const [activeTab, setActiveTab] = useState<"diagnostic" | "calculator">("diagnostic");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showAllDiagnostics, setShowAllDiagnostics] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    calories: "", gender: "male", femaleCondition: "regular",
    ageGroup: "18to50", activity: "moderate", goal: "general",
  });
  const [result,    setResult]    = useState<FiberResult | null>(null);
  const [activeTipCat, setActiveTipCat] = useState<"All" | "Eating" | "Timing" | "Hydration" | "Special">("All");
  const [instagramModalOpen, setInstagramModalOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const isAnyModalOpen = instagramModalOpen || dbModalOpen;
  const [lang, setLang] = useState<Lang>("en");
  const t = UI[lang];

  useEffect(() => {
    if (!profile) return;
    const cal = profile.maintenance_kcal ?? profile.tdee_kcal;
    if (cal)            setForm((p) => ({ ...p, calories: String(Math.round(cal)) }));
    if (profile.gender) setForm((p) => ({ ...p, gender: profile.gender as Gender }));
  }, [profile]);

  const canCalc = !!form.calories && parseFloat(form.calories) >= 500;

  /* colours */
  const G = "#4ade80"; const P = "#a78bfa";
  const C = "#22d3ee"; const A = "#fbbf24"; const R = "#f87171";

  const card   = { background: "rgba(14, 18, 24, 0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, backdropFilter: "blur(30px)" };
  const secLbl = { color: "#8B92A5", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 12, fontFamily: "monospace" };
  const lbl    = { color: "#8B92A5", fontSize: 11, fontWeight: 700, tracking: "0.05em", textTransform: "uppercase" as const, marginBottom: 8, display: "block" };

  const btnBase = (active: boolean, color = G) => ({
    minHeight: 44, borderRadius: 12,
    border: active ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.06)",
    background: active ? `${color}0c` : "rgba(255,255,255,0.01)",
    color: active ? color : "#8B92A5",
    fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const GENDER_OPTS   = [{ id: "male" as Gender, label: "Male" }, { id: "female" as Gender, label: "Female" }];
  const FEMALE_OPTS   = [{ id: "regular" as FemaleCondition, label: "Regular" }, { id: "pcos" as FemaleCondition, label: "PCOS" }, { id: "pregnant" as FemaleCondition, label: "Pregnant" }, { id: "lactating" as FemaleCondition, label: "Lactating" }];
  const AGE_OPTS      = [{ id: "under18" as AgeGroup, label: "Under 18" }, { id: "18to50" as AgeGroup, label: "18 – 50" }, { id: "above50" as AgeGroup, label: "50+" }];
  const ACTIVITY_OPTS = [
    { id: "sedentary" as ActivityLevel, label: "Sedentary",  desc: "Desk job, no exercise" },
    { id: "light"     as ActivityLevel, label: "Light",      desc: "Walk / yoga, 1–3x/wk"  },
    { id: "moderate"  as ActivityLevel, label: "Moderate",   desc: "Gym 3–5x/week"          },
    { id: "athlete"   as ActivityLevel, label: "Athlete",    desc: "Training 6x/week+"      },
  ];
  const GOAL_OPTS = [
    { id: "general"     as Goal, label: "General Wellness",        desc: "Base target"                     },
    { id: "fatloss"     as Goal, label: "Fat Loss",                desc: "+3g satiety"                     },
    { id: "muscle"      as Goal, label: "Muscle Gain",             desc: "−2g, less appetite suppression"  },
    { id: "gut"         as Goal, label: "Gut Health",              desc: "+2g prebiotic focus"             },
    { id: "diabetes"    as Goal, label: "Diabetes / Pre-diabetic", desc: "+5g glycemic control"            },
    { id: "cholesterol" as Goal, label: "High Cholesterol",        desc: "+5g soluble fiber, LDL protocol" },
    { id: "constipation"as Goal, label: "Constipation",            desc: "+3g insoluble focus"             },
  ];

  const DIAGNOSTIC_CARDS = [
    {
      icon: <IconGauge />,
      title: "You feel hungry again soon after meals",
      sublabel: "Common in low-fiber dietary patterns",
      status: "SIGNAL: GHRELIN_SPIKE",
      desc: "Soluble fiber delays gastric emptying. Its absence triggers sudden post-prandial blood sugar drops, resetting acute hunger signals.",
    },
    {
      icon: <IconHourglass />,
      title: "Digestion feels slow or inconsistent",
      sublabel: "Common in low-fiber dietary patterns",
      status: "MOTILITY: TRANSIT_DELAY",
      desc: "Insoluble bulk forms the physical sweep inside the intestines. Lack of structural weight decreases peristaltic wave speed.",
    },
    {
      icon: <IconWave />,
      title: "You often crave sugary or ultra-processed foods",
      sublabel: "Common in low-fiber dietary patterns",
      status: "BIOCHEMISTRY: GLUCOSE_VOLATILITY",
      desc: "Without a fiber mesh to control absorption, high-glycemic foods cause intense insulin surges followed by systemic hypoglycemic crashes.",
    },
    {
      icon: <IconTarget />,
      title: "You don't feel full even after eating enough",
      sublabel: "Common in low-fiber dietary patterns",
      status: "NEUROLOGY: PYY_&_GLP-1_LAG",
      desc: "Gastric stretch receptors and deep gut cells require physical bulk to synthesize and release long-acting satiety peptides.",
    },
    {
      icon: <IconLeaf />,
      title: "Vegetables or whole foods are missing from meals",
      sublabel: "Common in low-fiber dietary patterns",
      status: "TAXONOMY: SCFA_DEPRIVATION",
      desc: "Missing plant cell walls deprives the gut microbiome of prebiotic polysaccharides, reducing beneficial short-chain fatty acids.",
    },
    {
      icon: <IconDroplet />,
      title: "You don't drink enough water throughout the day",
      sublabel: "Common in low-fiber dietary patterns",
      status: "HYDRATION: SOLUTE_MISMATCH",
      desc: "Fiber is highly hydrophilic. Without a direct 1:30 volume of water to swell, the gut matrix remains dry and stagnant.",
    },
    {
      icon: <IconShield />,
      title: "Your meals feel heavy but not satisfying",
      sublabel: "Common in low-fiber dietary patterns",
      status: "CLINICAL WARNING: METABOLIC_DRAG",
      desc: "Dense, low-fiber fats and starches sit stagnant in the stomach, exhausting digestive energy without activating satiety pathways.",
      isFeatured: true,
    },
  ];

  const activeDiagCards = lang === "hi"
    ? DIAGNOSTIC_CARDS.map((c, i) => ({ ...c, ...DIAG_TEXTS_HI[i] }))
    : DIAGNOSTIC_CARDS;
  const activeTips  = lang === "hi" ? TIPS_HI  : TIPS;
  const activeMyths = lang === "hi" ? MYTHS_HI : MYTHS;

  return (
    <div 
      className={`relative w-full ${isAnyModalOpen ? "z-[99999]" : "z-10"}`}
      style={{ 
        maxWidth: activeTab === "diagnostic" ? 1040 : 1200, 
        margin: "0 auto", 
        padding: "1.5rem 1rem 6rem", 
        transition: "max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1)" 
      }}
    >
      <style>{`
        .font-serif {
          font-family: var(--font-outfit, 'Outfit', sans-serif) !important;
        }

        /* ── PRINT / PDF STYLES ── */
        .pdf-only {
          display: none;
        }
        @media print {
          body * { visibility: hidden; }
          .pdf-only, .pdf-only * { visibility: visible; }
          .pdf-only {
            display: block !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            z-index: 99999 !important;
            background: #ffffff !important;
          }
          @page { size: A4; margin: 0; }
        }

        /* Shared PDF card style */
        .pdf-card {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 16px 20px;
          margin-bottom: 14px;
          background: #fff;
        }
        .pdf-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #6b7280;
          margin-bottom: 6px;
        }
        .pdf-h2 {
          font-size: 14px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 4px;
        }
        .pdf-value {
          font-size: 28px;
          font-weight: 900;
          color: #111827;
        }
        .pdf-sub {
          font-size: 10px;
          color: #6b7280;
          line-height: 1.5;
        }
        .pdf-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .pdf-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        .pdf-tag {
          display: inline-block;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
          border: 1px solid currentColor;
        }
        .pdf-bar-track {
          width: 100%;
          height: 8px;
          border-radius: 99px;
          background: #f3f4f6;
          overflow: hidden;
          margin-top: 6px;
        }
        .pdf-bar-fill {
          height: 100%;
          border-radius: 99px;
        }
        .pdf-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
        }
        .pdf-feature-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .text-gradient-primary {
          background: linear-gradient(135deg, #22D3EE 0%, #67B7F7 30%, #A78BFA 70%, #C084FC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .premium-border-glow {
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.7);
        }

      `}</style>
      {/* Cinematic Ambient Parallax Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[-1] min-h-screen">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full blur-[140px] opacity-[0.07] transition-transform duration-1000"
          style={{
            background: `radial-gradient(circle, ${C} 0%, transparent 70%)`,
            transform: activeTab === "diagnostic" ? "translate3d(-30px, -30px, 0)" : "translate3d(0, 0, 0)"
          }}
        />
        <div 
          className="absolute bottom-[20%] right-[-10%] w-[650px] h-[650px] rounded-full blur-[160px] opacity-[0.06] transition-transform duration-1000"
          style={{
            background: `radial-gradient(circle, ${G} 0%, transparent 70%)`,
            transform: activeTab === "diagnostic" ? "translate3d(30px, 30px, 0)" : "translate3d(0, 0, 0)"
          }}
        />
      </div>

      {/* ── Floating Language Toggle ── */}
      {!instagramModalOpen && (
        <div className="fixed right-4 top-1/2 z-50 flex flex-col gap-1.5 -translate-y-1/2 pointer-events-auto">
          <button
            onClick={() => setLang("en")}
            className="w-10 h-10 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300"
            style={{
              background: lang === "en" ? "rgba(34,211,238,0.08)" : "rgba(14,18,24,0.6)",
              border: lang === "en" ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(255,255,255,0.06)",
              color: lang === "en" ? "#22d3ee" : "#8B92A5",
              backdropFilter: "blur(12px)",
              boxShadow: lang === "en" ? "0 0 15px rgba(34,211,238,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLang("hi")}
            className="w-10 h-10 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300"
            style={{
              background: lang === "hi" ? "rgba(74,222,128,0.08)" : "rgba(14,18,24,0.6)",
              border: lang === "hi" ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.06)",
              color: lang === "hi" ? "#4ade80" : "#8B92A5",
              backdropFilter: "blur(12px)",
              boxShadow: lang === "hi" ? "0 0 15px rgba(74,222,128,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            HI
          </button>
        </div>
      )}

      {/* Back to Toolkit Link */}
      <Link 
        href="/tools" 
        className="inline-flex items-center gap-2 mb-8 text-[#8B92A5] hover:text-[#F2F4F8] transition-all text-[12px] font-bold uppercase tracking-wider"
        style={{ textDecoration: "none" }}
      >
        <ArrowLeft size={13} /> Back to Toolkit
      </Link>

      <div className="text-center mb-12">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#22d3ee] uppercase block mb-3 font-bold">
          {t.headerTag}
        </span>
        <h1 className="text-[34px] sm:text-[46px] font-black text-white tracking-[-0.03em] leading-tight mb-4 font-serif">
          {t.headerTitle}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#8B92A5] max-w-xl mx-auto mb-8 leading-relaxed font-medium">
          {t.headerDesc}
        </p>

        {/* Cinematic Tab Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-[#0C0E14] border border-white/[0.06] backdrop-blur-md">
          <button
            onClick={() => setActiveTab("diagnostic")}
            className="px-5 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300"
            style={{
              background: activeTab === "diagnostic" ? "rgba(255, 255, 255, 0.03)" : "transparent",
              color: activeTab === "diagnostic" ? "#22d3ee" : "#8B92A5",
              border: activeTab === "diagnostic" ? "1px solid rgba(34, 211, 238, 0.12)" : "1px solid transparent",
              cursor: "pointer",
            }}
          >
            {t.tab1}
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className="px-5 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300"
            style={{
              background: activeTab === "calculator" ? "rgba(255, 255, 255, 0.03)" : "transparent",
              color: activeTab === "calculator" ? "#4ade80" : "#8B92A5",
              border: activeTab === "calculator" ? "1px solid rgba(74, 222, 128, 0.12)" : "1px solid transparent",
              cursor: "pointer",
            }}
          >
            {t.tab2}
          </button>
        </div>
      </div>

      {/* ── SCREEN 1: INTERACTIVE DIAGNOSTIC GATEWAY ── */}
      <AnimatePresence mode="wait">
        {activeTab === "diagnostic" && (
          <motion.div
            key="diag-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="text-center mb-8">
              <h2 className="text-[19px] font-bold text-white tracking-[-0.01em] mb-2 font-serif">
                {t.diagHeading}
              </h2>
              <p className="text-[12px] text-[#8B92A5] max-w-md mx-auto leading-relaxed font-medium">
                {t.diagSubhead}
              </p>
            </div>

            {/* Metabolic Risk Meter */}
            <div className="mb-10 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-bold text-white uppercase tracking-widest">Metabolic Risk</span>
                <span className="text-[12px] font-mono text-[#8B92A5]">{selectedSymptoms.length} / {DIAGNOSTIC_CARDS.length} Signals Detected</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(selectedSymptoms.length / DIAGNOSTIC_CARDS.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ boxShadow: selectedSymptoms.length > 0 ? "0 0 20px rgba(34,211,238,0.5)" : "none" }}
                />
              </div>
            </div>

            {/* Responsive Cinematic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {(showAllDiagnostics ? activeDiagCards : activeDiagCards.slice(0, 3)).map((card) => (
                <DiagnosticCard
                  key={card.status}
                  icon={card.icon}
                  title={card.title}
                  sublabel={card.sublabel}
                  status={card.status}
                  desc={card.desc}
                  isFeatured={card.isFeatured}
                  isSelected={selectedSymptoms.includes(card.title)}
                  onClick={() => {
                    setSelectedSymptoms(prev => 
                      prev.includes(card.title) 
                        ? prev.filter(t => t !== card.title)
                        : [...prev, card.title]
                    );
                  }}
                />
              ))}
            </div>

            {/* Progressive Disclosure Button */}
            {!showAllDiagnostics && (
              <div className="flex justify-center mb-12">
                <button
                  onClick={() => setShowAllDiagnostics(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-[12px] font-bold tracking-widest uppercase text-white/70 hover:text-white cursor-pointer"
                >
                  <ChevronDown size={16} className="text-cyan-400" />
                  Scan For More Metabolic Drag Signals
                </button>
              </div>
            )}

            {/* Bottom Diagnostic CTA */}
            <div 
              className="rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden premium-border-glow" 
              style={{ 
                background: "linear-gradient(135deg, rgba(74, 222, 128, 0.01) 0%, rgba(10, 13, 19, 0.9) 100%)", 
              }}
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none bg-radial-glow opacity-30 blur-xl" />
              <span className="inline-block text-[8px] font-mono tracking-[0.2em] text-[#4ade80] uppercase bg-[#4ade80]/10 border border-[#4ade80]/20 rounded px-2.5 py-1 mb-4 font-bold">
                {t.diagCtaBadge}
              </span>
              <h3 className="text-[20px] font-bold text-white tracking-[-0.02em] mb-2 font-serif">
                {t.diagCtaTitle}
              </h3>
              <p className="text-[12.5px] text-[#8B92A5] max-w-md mx-auto mb-6 leading-relaxed font-medium">
                {t.diagCtaDesc}
              </p>
              
              <button 
                onClick={() => {
                  setActiveTab("calculator");
                  window.scrollTo({ top: 220, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center rounded-xl text-[12.5px] font-bold px-6 py-3.5 transition-all duration-300 bg-[#4ade80] text-[#07090D] hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] cursor-pointer"
                style={{ border: "none" }}
              >
                {t.diagCtaBtn}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SCREEN 2: PRECISION CALCULATOR WITH 60/40 SPLIT ── */}
        {activeTab === "calculator" && (
          <motion.div
            key="calc-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (lg:col-span-5) — Input Form / Primary Visual Output */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Form Input Card */}
                {!result ? (
                  <div className="premium-border-glow" style={card}>
                    {/* Header info panel */}
                    <div className="p-5 border-b border-white/[0.06] bg-white/[0.01]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-green-500/5 border border-green-500/20">
                            <Salad size={18} color={G} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-[8px] font-mono font-bold tracking-[0.08em] uppercase rounded-full px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20">ACTIVE ALGORITHM</span>
                              <span className="text-[8px] font-bold tracking-[0.08em] uppercase rounded-full px-2 py-0.5 bg-white/[0.03] text-[#8B92A5] border border-white/[0.06]">ICMR-NIN 2024</span>
                            </div>
                            <h2 className="text-[16px] font-bold text-white tracking-[-0.01em] font-serif">Precision Target Calculator</h2>
                          </div>
                        </div>
                        <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
                      </div>
                      <p className="mt-3 text-[12px] leading-relaxed text-[#8B92A5] font-medium">
                        Computes targeted fiber indexes using body dynamics, calories, gender parameters, and targeted clinical symptoms.
                      </p>
                      <AnimatePresence initial={false}>
                        {researchOpen && (
                          <motion.div key="r" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                            <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-6 space-y-5">
                      <p style={secLbl}>{t.sectionYourDetails}</p>

                      {/* Calories Input */}
                      <div>
                        <label style={lbl}>{t.calLabel}</label>
                        <input
                          type="number" min={500} max={8000} placeholder="e.g. 2000"
                          value={form.calories}
                          onChange={(e) => setForm((p) => ({ ...p, calories: e.target.value }))}
                          className="w-full rounded-xl px-4 outline-none border border-white/[0.08] bg-[#0A0D12] text-[#F2F4F8] transition-all focus:border-green-500/30"
                          style={{ minHeight: 48, fontSize: 13 }}
                        />
                        {!form.calories && (
                          <p className="text-[10.5px] mt-2 text-[#8B92A5] font-medium">
                            {t.dontKnow}{" "}
                            <Link href="/tools/macro-calculator" className="text-purple-400 font-bold hover:underline" style={{ textDecoration: "none" }}>{t.dontKnowLink}</Link>
                          </p>
                        )}
                      </div>

                      {/* Gender Switcher */}
                      <div>
                        <label style={lbl}>{t.genderLabel}</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {GENDER_OPTS.map((o) => (
                            <button key={o.id} onClick={() => setForm((p) => ({ ...p, gender: o.id }))} style={{ ...btnBase(form.gender === o.id), cursor: "pointer" }}>{o.label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Female Condition Selection */}
                      <AnimatePresence>
                        {form.gender === "female" && (
                          <motion.div key="fc" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mb-4">
                            <label style={lbl}>{t.condLabel}</label>
                            <div className="grid grid-cols-2 gap-2.5">
                              {FEMALE_OPTS.map((o) => (
                                <button key={o.id} onClick={() => setForm((p) => ({ ...p, femaleCondition: o.id }))} style={{ ...btnBase(form.femaleCondition === o.id), cursor: "pointer" }}>{o.label}</button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Age Group Switcher */}
                      <div>
                        <label style={lbl}>{t.ageLabel}</label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {AGE_OPTS.map((o) => (
                            <button key={o.id} onClick={() => setForm((p) => ({ ...p, ageGroup: o.id }))} style={{ ...btnBase(form.ageGroup === o.id), cursor: "pointer" }}>{o.label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Activity Level Selector */}
                      <div>
                        <label style={lbl}>{t.actLabel}</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {ACTIVITY_OPTS.map((o) => (
                            <button key={o.id} onClick={() => setForm((p) => ({ ...p, activity: o.id }))}
                              className="rounded-xl px-3 py-2 text-left transition-all"
                              style={{ border: form.activity === o.id ? `1px solid ${G}35` : "1px solid rgba(255,255,255,0.06)", background: form.activity === o.id ? `${G}0c` : "rgba(255,255,255,0.01)", minHeight: 60, cursor: "pointer" }}
                            >
                              <p className="text-[12px] font-bold" style={{ color: form.activity === o.id ? G : "#F2F4F8" }}>{o.label}</p>
                              <p className="text-[10px] mt-0.5 leading-normal" style={{ color: "#8B92A5" }}>{lang === "hi" ? (ACTIVITY_DESCS[o.id]?.hi ?? o.desc) : o.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Goal Selector */}
                      <div>
                        <label style={lbl}>{t.goalLabel}</label>
                        <div className="flex flex-col gap-2">
                          {GOAL_OPTS.map((o) => (
                            <button key={o.id} onClick={() => setForm((p) => ({ ...p, goal: o.id }))}
                              className="w-full text-left rounded-xl px-4 py-2.5 flex items-center justify-between transition-all"
                              style={{ border: form.goal === o.id ? `1px solid ${G}35` : "1px solid rgba(255,255,255,0.06)", background: form.goal === o.id ? `${G}06` : "transparent", minHeight: 48, cursor: "pointer" }}
                            >
                              <span className="text-[12.5px] font-bold" style={{ color: form.goal === o.id ? G : "#F2F4F8" }}>{lang === "hi" ? (GOAL_LABELS[o.id]?.hi ?? o.label) : o.label}</span>
                              <span className="text-[10.5px] ml-2 shrink-0 font-medium" style={{ color: "#8B92A5" }}>{lang === "hi" ? (GOAL_DESCS[o.id]?.hi ?? o.desc) : o.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => { 
                          const cal = parseFloat(form.calories); 
                          if (cal >= 500 && cal <= 8000) {
                            setResult(calculateFiber(form, selectedSymptoms.length)); 
                          }
                        }}
                        disabled={!canCalc}
                        className="w-full rounded-xl text-[14px] font-black uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.25)] hover:scale-[1.01]"
                        style={{ background: G, color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed" }}
                      >
                        {t.calcBtn}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Results Side-Sticky Container */
                  <div className="lg:sticky lg:top-24 space-y-6">
                    
                    {/* Main Biometric Output Gauge */}
                    <div className="premium-border-glow p-6" style={{ ...card, border: "1px solid rgba(74,222,128,0.15)" }}>
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5 mb-5">
                        <p style={{ ...secLbl, marginBottom: 0 }}>Precision Intake Architecture</p>
                        <div className="flex items-center gap-2">
                          {selectedSymptoms.length > 0 && (
                            <span className="text-[8px] font-mono tracking-widest text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/20 rounded-md px-2 py-0.5 uppercase font-bold shrink-0 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                              +{selectedSymptoms.length}g Risk Adjustment
                            </span>
                          )}
                          <span className="text-[8px] font-mono tracking-widest text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-md px-2 py-0.5 uppercase font-bold shrink-0">
                            {form.goal}
                          </span>
                        </div>
                      </div>

                      {/* Giant Number Display */}
                      <div className="text-center py-6 relative overflow-hidden rounded-2xl bg-white/[0.01] border border-white/[0.04] mb-6">
                        <div className="absolute inset-0 m-auto w-[180px] h-[180px] rounded-full filter blur-[20px] pointer-events-none opacity-30 bg-radial-glow"
                          style={{ background: `radial-gradient(circle, ${G} 0%, transparent 70%)` }}
                        />
                        <div className="w-[140px] h-[140px] rounded-full mx-auto flex flex-col items-center justify-center relative border border-white/[0.06] bg-[#07090D]/90 shadow-[0_0_30px_rgba(74,222,128,0.06)]">
                          <span className="text-[9px] font-mono tracking-[0.15em] text-[#8B92A5] uppercase font-bold">DAILY TARGET</span>
                          <span className="text-[48px] font-black text-white leading-none tracking-[-0.04em] my-1.5 font-serif" style={{ textShadow: "0 0 20px rgba(74,222,128,0.15)" }}>
                            {result.target}<span className="text-[22px] font-bold font-sans">g</span>
                          </span>
                          <span className="text-[8px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">METABOLIC VALUE</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                          { label: t.solubleTarget,   value: `${result.soluble}g`,  color: C },
                          { label: t.insolubleTarget, value: `${result.insoluble}g`,color: A },
                          { label: t.systemGap,       value: `+${result.gap}g`,     color: P },
                        ].map((s) => (
                          <div key={s.label} className="rounded-xl p-3 text-center border border-white/[0.05] bg-[#0A0D12]">
                            <p className="text-[18px] font-black font-sans" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-[9px] mt-0.5 tracking-wide text-[#8B92A5] font-bold uppercase">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Soluble/Insoluble Proportion bar */}
                      <div className="mb-6 border-t border-white/[0.06] pt-4">
                        <div className="flex justify-between text-[11px] mb-1.5 font-bold font-mono">
                          <span style={{ color: C }}>Soluble {result.soluble}g ({Math.round((result.soluble / result.target) * 100)}%)</span>
                          <span style={{ color: A }}>Insoluble {result.insoluble}g ({Math.round((result.insoluble / result.target) * 100)}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden bg-white/[0.04]">
                          <div className="h-full rounded-full" style={{ width: `${(result.soluble / result.target) * 100}%`, background: `linear-gradient(90deg,${C},${G})` }} />
                        </div>
                      </div>

                      {/* Hydration Target Panel */}
                      <div className="flex items-start gap-3 rounded-xl p-3 border border-cyan-500/15" style={{ background: "rgba(34,211,238,0.02)" }}>
                        <Droplets size={18} color={C} className="shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="text-[12px] font-bold" style={{ color: C }}>Co-Factor: +{result.hydration}ml daily water intake</p>
                          <p className="text-[10.5px] mt-0.5 text-[#8B92A5] font-medium leading-relaxed">Non-negotiable. Hydrophilic fibers swell using water; low hydration triggers metabolic and digestive friction.</p>
                        </div>
                      </div>

                      {/* Recalculate Trigger */}
                      <button
                        onClick={() => setResult(null)}
                        className="w-full mt-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-200 border border-white/[0.06] text-[#8B92A5] hover:text-white hover:bg-white/[0.02]"
                        style={{ minHeight: 40, cursor: "pointer" }}
                      >
                        ← Reset &amp; Recalculate
                      </button>
                    </div>

                    {/* ── SOLUBLE vs INSOLUBLE EDUCATIONAL SECTION ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="premium-border-glow rounded-2xl overflow-hidden"
                      style={{ ...card, border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                        <p style={{ ...secLbl, marginBottom: 0 }}>Fiber Type Intelligence</p>
                        <span className="text-[8px] font-mono tracking-widest text-[#22d3ee] uppercase font-bold">[ SIMPLE SCIENCE ]</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
                        {/* Soluble */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: C, boxShadow: `0 0 8px ${C}` }} />
                            <span className="text-[13px] font-black text-white">Soluble Fiber</span>
                            <span className="ml-auto text-[15px] font-black font-mono" style={{ color: C }}>{result.soluble}g</span>
                          </div>
                          <p className="text-[11.5px] text-[#8B92A5] leading-relaxed font-medium mb-3">
                            Jab khaate ho, ye paani mein ghul jaata hai aur ek <span className="text-white font-bold">gel bana leta hai</span>. Ye gel sugar ko slowly blood mein jaane deta hai — insulin spike nahi hoti, aur pet zyada der tak bhara lagta hai.
                          </p>
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#8B92A5] font-bold mb-2">Indian Examples:</p>
                            {["Oats (jowar) — 1 katori = ~2g", "Chia seeds (sabja) — 1 tbsp = ~5g", "Apples with skin — 1 medium = ~2g", "Moong dal — 1 katori = ~1.5g", "Isabgol (psyllium) — 1 tsp = ~3.5g"].map(ex => (
                              <div key={ex} className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full shrink-0" style={{ background: C }} />
                                <span className="text-[10.5px] text-[#8B92A5] font-medium">{ex}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Insoluble */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: A, boxShadow: `0 0 8px ${A}` }} />
                            <span className="text-[13px] font-black text-white">Insoluble Fiber</span>
                            <span className="ml-auto text-[15px] font-black font-mono" style={{ color: A }}>{result.insoluble}g</span>
                          </div>
                          <p className="text-[11.5px] text-[#8B92A5] leading-relaxed font-medium mb-3">
                            Ye paani mein nahi ghulta. Seedha <span className="text-white font-bold">ek broom ki tarah kaam karta hai</span> — aapke gut ko saaf karta hai, constipation nahi hoti, aur waste bahut tezi se body se bahar jata hai.
                          </p>
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#8B92A5] font-bold mb-2">Indian Examples:</p>
                            {["Whole wheat roti — 1 roti = ~2g", "Broccoli — 1 katori = ~2.5g", "Kale/Palak — 1 cup = ~2g", "Almonds — 10 badam = ~1.5g", "Brown rice — 1 katori = ~1.8g"].map(ex => (
                              <div key={ex} className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full shrink-0" style={{ background: A }} />
                                <span className="text-[10.5px] text-[#8B92A5] font-medium">{ex}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* ── PDF DOWNLOAD BUTTON ── */}
                    <button
                      onClick={() => window.print()}
                      className="w-full rounded-xl text-[12px] font-bold tracking-[2px] uppercase flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:brightness-110 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                        color: "#C3FCFE",
                        minHeight: 52,
                        border: "1px solid rgba(195,252,254,0.25)",
                        boxShadow: "0 0 25px rgba(195,252,254,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download Clinical Report (PDF)
                    </button>

                    {/* Instagram Share Trigger */}
                    <button
                      onClick={() => setInstagramModalOpen(true)}
                      className="w-full rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(225,48,108,0.15)] hover:scale-[1.01]"
                      style={{
                        background: "rgba(225, 48, 108, 0.05)",
                        color: "#E1306C",
                        border: "1px solid rgba(225, 48, 108, 0.2)",
                        minHeight: 48,
                        cursor: "pointer"
                      }}
                    >
                      <Camera size={14} />
                      Generate Instagram Story Card
                    </button>

                  </div>
                )}
              </div>

              {/* Right Column (lg:col-span-7) — Dynamic Insights, Schedules, & Databases */}
              <div className="lg:col-span-7 space-y-6">
                
                {result && (
                  <>
                    {/* DYNAMIC CLINICAL DIRECTIVE PANELS */}
                    {(form.goal === "diabetes" || form.goal === "cholesterol" || form.femaleCondition === "pcos" || form.goal === "gut") && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="premium-border-glow p-5" style={{ ...card, border: "1px solid rgba(167,139,250,0.2)", background: "linear-gradient(135deg, rgba(167,139,250,0.01) 0%, rgba(14, 18, 24, 0.7) 100%)" }}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <Sparkles size={16} color={P} className="animate-spin" style={{ animationDuration: "3s" }} />
                          <p className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: P }}>[ Clinical Directive Activated ]</p>
                        </div>
                        
                        {form.femaleCondition === "pcos" && (
                          <div>
                            <h4 className="text-[15px] font-bold text-white mb-1.5 font-serif">PCOS Insulin-Sensitivity Target Sync (+4g Adjustment)</h4>
                            <p className="text-[12px] leading-relaxed text-[#8B92A5] font-medium">
                              Your profile flags hormonal sensitivity. Soluble, high-viscosity fibers (such as soaked methi seeds, psyllium, and cooked oats) are chemically directed to coat the intestinal wall. This slows glucose absorption and compresses post-meal insulin spikes, directly assisting in stabilizing your HOMA-IR ratio and regulating testosterone levels.
                            </p>
                          </div>
                        )}

                        {form.goal === "diabetes" && (
                          <div>
                            <h4 className="text-[15px] font-bold text-white mb-1.5 font-serif">Glycemic Control Viscosity Protocol (+5g Adjustment)</h4>
                            <p className="text-[12px] leading-relaxed text-[#8B92A5] font-medium">
                              To assist beta-cell response and minimize post-meal glucose spikes, we scaled soluble fiber to 35% of your target. Focus heavily on beta-glucan rich grains (Barley, Oats) and pre-meal isabgol protocols to form a natural biochemical mesh, extending digestive transit and flattening insulin curves.
                            </p>
                          </div>
                        )}

                        {form.goal === "cholesterol" && (
                          <div>
                            <h4 className="text-[15px] font-bold text-white mb-1.5 font-serif">Soluble LDL Trapping Sequence (+5g Adjustment)</h4>
                            <p className="text-[12px] leading-relaxed text-[#8B92A5] font-medium">
                              Soluble fiber acts as a bio-chemical trap in the gut, binding directly to bile acids (which are synthesized from LDL cholesterol) and carrying them out of the body. This forces the liver to extract cholesterol from your blood to build new bile, naturally lowering systemic LDL levels by 10-15%.
                            </p>
                          </div>
                        )}

                        {form.goal === "gut" && (
                          <div>
                            <h4 className="text-[15px] font-bold text-white mb-1.5 font-serif">Prebiotic SCFA Fermentation Buffer (+2g Adjustment)</h4>
                            <p className="text-[12px] leading-relaxed text-[#8B92A5] font-medium">
                              By increasing complex cellular fiber matrices, you provide direct fuel for gut bacteria (specifically Akkermansia muciniphila and Bifidobacterium). Their fermentation process produces critical Short-Chain Fatty Acids (acetate, propionate, butyrate) which rebuild gut mucosal linings and stimulate satiety peptides GLP-1 and PYY.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Meal-Wise Plan */}
                    <div className="premium-border-glow p-5" style={card}>
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                        <p style={secLbl}>Meal-Wise Fiber Plan</p>
                        <span className="text-[8px] font-mono tracking-widest text-[#8B92A5] uppercase font-bold">5-STAGE DISTRIBUTION</span>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {getMealBreakdown(result.target, form.goal).map((m) => (
                          <div key={m.meal} className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 border border-white/[0.04] bg-[#0A0D12]">
                            <div className="flex-1 min-w-0">
                              <p className="text-[12.5px] font-bold text-white">{m.meal}</p>
                              <p className="text-[11px] truncate mt-0.5 font-medium text-[#8B92A5]">{m.example}</p>
                            </div>
                            <span className="text-[15px] font-black shrink-0 font-mono" style={{ color: G }}>{m.target}g</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Curated Foods Bento */}
                    <div className="premium-border-glow p-5" style={card}>
                      <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] pb-3 mb-4">
                        <div>
                          <p style={{ ...secLbl, marginBottom: 2 }}>Targeted Food Matrix (ICMR-NIN 2024)</p>
                          <p className="text-[11px] text-[#8B92A5] font-medium">Scientific, locally sourced Indian items aligned with your profile.</p>
                        </div>
                        <span className="text-[8px] font-mono tracking-widest text-[#4ade80] bg-[#4ade80]/8 border border-[#4ade80]/20 rounded-md px-2 py-0.5 uppercase font-bold shrink-0">
                          {form.goal.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {FOODS_BY_GOAL[form.goal].map((f, i) => (
                          <div key={i} className="rounded-xl p-3 flex flex-col justify-between border border-white/[0.05] bg-white/[0.01]"
                            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[8px] font-bold tracking-wider rounded-full px-2 py-0.5" style={{
                                  background: f.type === "soluble" ? "rgba(34,211,238,0.06)" : f.type === "insoluble" ? "rgba(251,191,36,0.06)" : "rgba(74,222,128,0.06)",
                                  color:      f.type === "soluble" ? C : f.type === "insoluble" ? A : G,
                                  border:    `1px solid ${f.type === "soluble" ? "rgba(34,211,238,0.15)" : f.type === "insoluble" ? "rgba(251,191,36,0.15)" : "rgba(74,222,128,0.15)"}`,
                                }}>
                                  {f.type === "both" ? "Both" : f.type === "soluble" ? "Soluble" : "Insoluble"}
                                </span>
                                <span className="text-[12px] font-black font-mono" style={{ color: G }}>{f.fiber}g</span>
                              </div>
                              <p className="text-[12px] font-bold text-white leading-snug">{f.food}</p>
                            </div>
                            <p className="text-[9.5px] text-[#4B5265] mt-3 border-t border-white/[0.04] pt-1.5 font-medium leading-normal">{f.serving}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4-Week Adaptability Schedule */}
                    <div className="premium-border-glow p-5" style={card}>
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                        <p style={secLbl}>{t.rampTitle}</p>
                        <span className="text-[8px] font-mono tracking-widest text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-md px-2 py-0.5 uppercase font-bold shrink-0">ADAPTATION PACE</span>
                      </div>
                      <p className="text-[11.5px] mb-4 leading-relaxed text-[#8B92A5] font-medium">
                        {t.rampDesc}
                      </p>
                      <div className="flex flex-col gap-3">
                        {result.rampWeeks.map((w) => (
                          <div key={w.week} className="rounded-xl p-4 border border-white/[0.04] bg-[#0A0D12]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: G }}>Week {w.week} // Ramp Phase</span>
                              <span className="text-[13px] font-black font-mono text-white">{w.target}g/day</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full mb-2.5 bg-white/[0.04]">
                              <div className="h-full rounded-full transition-all" style={{ width: `${(w.target / result.target) * 100}%`, background: G }} />
                            </div>
                            <p className="text-[10.5px] text-[#8B92A5] leading-relaxed font-medium">{w.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* COACH SANDY'S AUTHORITY BOARD */}
                    <div className="premium-border-glow p-5 rounded-2xl relative overflow-hidden" style={{ ...card, border: "1px solid rgba(74,222,128,0.15)" }}>
                      <div className="absolute top-[-50px] right-[-50px] w-[180px] h-[180px] rounded-full pointer-events-none filter blur-[80px] opacity-10 bg-[#4ade80]" />
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                        <p style={secLbl}>Coach Sandy&apos;s Metabolic Insight</p>
                        <span className="text-[8px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">[ CERTIFIED AUTHORITY ]</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                        {/* Portrait Container */}
                        <div className="relative w-28 h-36 rounded-xl overflow-hidden border border-white/[0.1] shadow-lg shrink-0">
                          <Image
                            src="/sandycoachfibersectionphoto.PNG"
                            alt="Coach Sandy"
                            fill
                            sizes="112px"
                            style={{ objectFit: "cover", objectPosition: "center 15%" }}
                          />
                        </div>

                        {/* Speech Bubble / Quote */}
                        <div className="flex-1 space-y-3 text-center sm:text-left">
                          <span className="text-4xl text-[#4ade80] font-serif leading-none opacity-40 select-none block sm:inline">&ldquo;</span>
                          <p className="text-[12.5px] leading-relaxed text-white font-medium italic relative z-10 pl-1 sm:inline">
                            Indian diets are notoriously carbohydrate-rich, but empty in structural cellulose. When clients pay us for high-ticket coaching, fiber is the very first metabolic dial we adjust. By closing your {result.gap}g gap safely over 4 weeks, you will restore leptin sensitivity, suppress systemic energy crashes, and make fat loss practically effortless. No starvation, just biochemistry.
                          </p>
                          <div className="pt-2 border-t border-white/[0.04]">
                            <p className="text-[12px] font-bold text-white">Sandy, Founder &amp; Head Coach</p>
                            <p className="text-[10px] text-[#8B92A5] font-mono font-bold uppercase tracking-wider">Sandy.Lifts Metabolic Intelligence Clinic</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONVERSION-OPTIMIZED ELITE CTA */}
                    <div className="premium-border-glow p-6 rounded-2xl relative overflow-hidden" 
                      style={{ ...card, border: "1px solid rgba(167,139,250,0.25)", background: "linear-gradient(135deg, rgba(167,139,250,0.03) 0%, rgba(14, 18, 24, 0.9) 100%)" }}
                    >
                      <div className="absolute top-[-50px] right-[-50px] w-[180px] h-[180px] rounded-full pointer-events-none filter blur-[80px] opacity-10 bg-purple-500" />
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-block text-[9px] font-mono tracking-[0.15em] uppercase rounded bg-red-600 px-2.5 py-1 font-black text-white shadow-[0_0_15px_rgba(220,38,38,0.45)] border border-red-500">
                          LIMITED COMPLIMENTARY ACCESS
                        </span>
                        <span className="text-[8px] font-bold tracking-widest text-red-400 animate-pulse font-mono">[ 4 SLOTS LEFT ]</span>
                      </div>

                      <h3 className="text-[17px] font-bold text-white tracking-[-0.01em] mb-1.5 font-serif">
                        Translate Your {result.target}g Biometric Target Into a Custom 12-Week Meal Plan
                      </h3>
                      <p className="text-[12px] leading-relaxed text-[#8B92A5] mb-5 font-medium">
                        Your metabolic profile requires detailed ingredient styling to protect your intestinal lining. Book a direct Diagnostics Call to map this target directly to your local Indian routine. 
                        <span className="text-white font-bold ml-1">Free for a limited time (Normally ₹2,999).</span>
                      </p>

                      <button 
                        onClick={() => router.push(`/intake?from=fiber&target=${result.target}&goal=${form.goal}`)}
                        className="w-full rounded-xl text-[13px] font-bold tracking-[2px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:brightness-110 active:scale-95"
                        style={{ 
                          background: "linear-gradient(135deg, #C3FCFE 0%, #C69FF5 100%)", 
                          color: "#07090D", 
                          minHeight: 52, 
                          border: "none",
                          fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
                          boxShadow: "0 0 30px rgba(195,252,254,0.25)",
                        }}
                      >
                        <Calendar size={15} />
                        Book Free 1-on-1 Metabolic Assessment Call
                        <ChevronRight size={15} />
                      </button>
                    </div>

                    {/* Clinical Reference Standards (National Database moved here) */}
                    <div className="premium-border-glow p-5" style={card}>
                      <p style={secLbl}>Clinical Reference Standards</p>
                      <p className="text-[12px] leading-relaxed text-[#8B92A5] mb-4 font-medium">
                        Review all reference guidelines, biochemical equations, and national Indian food composition databases.
                      </p>
                      <FiberReferenceTable isOpen={dbModalOpen} setIsOpen={setDbModalOpen} />
                    </div>

                  </>
                )}

                {/* Always Show Guidelines trigger if Calculator is not generated yet */}
                {!result && (
                  <div className="premium-border-glow p-5" style={card}>
                    <p style={secLbl}>Clinical Reference Standards</p>
                    <p className="text-[12px] leading-relaxed text-[#8B92A5] mb-4 font-medium">
                      Sandy.Lifts operates strictly on scientific guidelines. Review our reference databases and diagnostic criteria below.
                    </p>
                    <FiberReferenceTable isOpen={dbModalOpen} setIsOpen={setDbModalOpen} />
                  </div>
                )}

                {/* Science tips panel */}
                <div className="premium-border-glow p-5" style={card}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5 mb-5">
                    <div>
                      <p style={{ ...secLbl, marginBottom: 2 }}>{t.tipsTitle}</p>
                      <p className="text-[11px] text-[#8B92A5] font-medium">{t.tipsDesc}</p>
                    </div>
                    
                    {/* Category Switcher Pillbox */}
                    <div className="flex flex-wrap gap-1">
                      {(["All", "Eating", "Timing", "Hydration", "Special"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveTipCat(cat)}
                          className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all"
                          style={{
                            background: activeTipCat === cat ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.02)",
                            color: activeTipCat === cat ? G : "#8B92A5",
                            border: activeTipCat === cat ? `1px solid rgba(74,222,128,0.2)` : "1px solid rgba(255,255,255,0.06)",
                            cursor: "pointer",
                          }}
                        >
                          {lang === "hi"
                            ? ({ All: "Sab", Eating: "Khana", Timing: "Timing", Hydration: "Paani", Special: "Special" } as const)[cat]
                            : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTips.filter(tip => activeTipCat === "All" || tip.category === activeTipCat).map((tip, i) => (
                      <div key={i} className="relative rounded-xl p-4 flex flex-col justify-between border border-white/[0.05] bg-white/[0.01]"
                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[8px] font-bold rounded-full px-2 py-0.5 uppercase tracking-wider" style={{ background: "rgba(74,222,128,0.06)", color: G, border: "1px solid rgba(74,222,128,0.12)" }}>
                              {tip.category}
                            </span>
                            <span className="text-[8px] font-mono font-bold text-[#4B5265]">PROTOCOL {String(i + 1).padStart(2, '0')}</span>
                          </div>
                          <h4 className="text-[13px] font-bold text-white mb-2 leading-snug">{tip.tip}</h4>
                          <p className="text-[11.5px] text-[#8B92A5] leading-relaxed font-medium">{tip.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Myths Panel */}
                <div className="premium-border-glow p-5" style={card}>
                  <div className="border-b border-white/[0.06] pb-3 mb-5">
                    <p style={{ ...secLbl, marginBottom: 2 }}>{t.mythsTitle}</p>
                    <p className="text-[11px] text-[#8B92A5] font-medium">{t.mythsDesc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeMyths.map((m, i) => (
                      <div key={i} className="relative rounded-xl p-4 flex flex-col justify-between border border-white/[0.05] bg-white/[0.01]"
                        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
                      >
                        <div className="space-y-3">
                          {/* Myth Area */}
                          <div className="rounded-lg p-2.5 border border-red-500/10" style={{ background: "rgba(248,113,113,0.01)" }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-[8px] font-bold rounded-full px-1.5 py-0.5 uppercase tracking-wider" style={{ background: "rgba(248,113,113,0.08)", color: R }}>
                                FALLACY
                              </span>
                              <span className="text-[8px] font-mono font-bold text-[#4B5265] ml-auto">{m.tag}</span>
                            </div>
                            <p className="text-[12px] font-bold text-[#F2F4F8] leading-snug">{m.myth}</p>
                          </div>

                          {/* Reality Area */}
                          <div className="rounded-lg p-2.5 border border-green-500/10" style={{ background: "rgba(74,222,128,0.01)" }}>
                            <span className="inline-block text-[8px] font-bold rounded-full px-1.5 py-0.5 uppercase tracking-wider mb-1.5" style={{ background: "rgba(74,222,128,0.08)", color: G }}>
                              SCIENCE
                            </span>
                            <p className="text-[11px] text-[#8B92A5] leading-relaxed font-medium">{m.reality}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>



              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[10px] mt-10 text-center leading-relaxed text-[#4B5265] max-w-2xl mx-auto font-medium">
        {t.disclaimer}
      </p>

      {/* ── INSTAGRAM SCREENSHOT MODAL ── */}
      <AnimatePresence>
        {instagramModalOpen && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 overflow-y-auto"
            style={{ background: "rgba(6, 8, 12, 0.97)", backdropFilter: "blur(25px)" }}
          >
            {/* Close trigger button on top */}
            <div className="w-full max-w-[340px] flex justify-between items-center mb-3">
              <span className="text-[9px] font-mono tracking-widest text-[#E1306C] font-bold uppercase">[ SHAREABLE CARD ]</span>
              <button
                onClick={() => setInstagramModalOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#8B92A5] hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* 9:16 aspect ratio poster container */}
            <div
              className="relative w-full max-w-[340px] aspect-[9/16] rounded-2xl p-7 flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/[0.08]"
              style={{
                background: "radial-gradient(circle at top left, #0D1017 0%, #06080C 100%)",
              }}
            >
              {/* background glass effects */}
              <div className="absolute top-[-50px] right-[-50px] w-[180px] h-[180px] rounded-full pointer-events-none filter blur-[80px]" style={{ background: "rgba(34, 211, 238, 0.1)" }} />
              <div className="absolute bottom-[-50px] left-[-50px] w-[180px] h-[180px] rounded-full pointer-events-none filter blur-[80px]" style={{ background: "rgba(74, 222, 128, 0.08)" }} />

              {/* Branding Header */}
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2.5">
                    {/* Coach Sandy Avatar */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src="/sandycoachfibersectionphoto.PNG"
                        alt="Coach Sandy"
                        fill
                        sizes="32px"
                        style={{ objectFit: "cover", objectPosition: "center 15%" }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-black tracking-[-0.03em] text-white">SANDY.LIFTS</span>
                      <span className="text-[7.5px] font-mono tracking-[0.25em] text-[#8B92A5] uppercase font-bold">Metabolic Intelligence</span>
                    </div>
                  </div>
                  <span className="text-[7.5px] font-mono tracking-widest text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded px-1.5 py-0.5 uppercase font-bold shrink-0">
                    CALORIE SCALED
                  </span>
                </div>

                {/* monospaced parameters stats */}
                <div className="mt-4 space-y-1.5 font-mono text-[9px] text-[#8B92A5]">
                  <div className="flex justify-between border-b border-white/[0.03] pb-1">
                    <span>[ GENDER ]</span>
                    <span className="text-white font-semibold">{form.gender.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.03] pb-1">
                    <span>[ TARGET TDEE ]</span>
                    <span className="text-white font-semibold">{form.calories} KCAL</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.03] pb-1">
                    <span>[ CONDITION ]</span>
                    <span className="text-white font-semibold">{form.femaleCondition ? form.femaleCondition.toUpperCase() : "REGULAR"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.03] pb-1">
                    <span>[ CORE GOAL ]</span>
                    <span className="text-[#4ade80] font-semibold">{form.goal.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Main Cinematic Target Display */}
              <div className="my-auto text-center relative py-6">
                {/* Glow ring backing */}
                <div className="absolute inset-0 m-auto w-[160px] h-[160px] rounded-full filter blur-[20px] pointer-events-none opacity-30 bg-radial-glow"
                  style={{ background: `radial-gradient(circle, ${G} 0%, transparent 70%)` }}
                />
                
                {/* Actual Ring element */}
                <div className="w-[145px] h-[145px] rounded-full mx-auto flex flex-col items-center justify-center relative border border-white/[0.06] bg-[#07090C]/90 shadow-[0_0_30px_rgba(74,222,128,0.06)]">
                  <span className="text-[8px] font-mono tracking-[0.15em] text-[#8B92A5] uppercase font-bold">DAILY TARGET</span>
                  <span className="text-[42px] font-black text-white leading-none tracking-[-0.04em] my-1 font-serif" style={{ textShadow: "0 0 20px rgba(74,222,128,0.15)" }}>
                    {result.target}<span className="text-[18px] font-bold font-sans">g</span>
                  </span>
                  <span className="text-[7.5px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">FIBER SYNERGY</span>
                </div>
              </div>

              {/* Proportion stats and details */}
              <div>
                <div className="space-y-3">
                  {/* Proportion scale bar */}
                  <div>
                    <div className="flex justify-between text-[8px] font-bold font-mono mb-1">
                      <span style={{ color: C }}>SOLUBLE: {result.soluble}g</span>
                      <span style={{ color: A }}>INSOLUBLE: {result.insoluble}g</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/[0.05]">
                      <div className="h-full rounded-full" style={{ width: `${(result.soluble / result.target) * 100}%`, background: `linear-gradient(90deg,${C},${G})` }} />
                    </div>
                  </div>

                  {/* Water index helper */}
                  <div className="flex items-center justify-between rounded-lg p-2 bg-white/[0.02] border border-white/[0.05] text-[9px] text-[#8B92A5] font-mono">
                    <span>[ HYDROPHILIC CO-FACTOR ]</span>
                    <span className="text-[#22d3ee] font-bold">+{result.hydration}ml Water</span>
                  </div>
                </div>

                {/* Footer and clinical directive decree */}
                <div className="mt-5 pt-3 border-t border-white/[0.06] text-center">
                  <p className="text-[7.5px] font-mono tracking-widest text-[#4B5265] uppercase font-bold">
                    SCIENTIFICALLY DECREED VIA ICMR-NIN 2024
                  </p>
                  <p className="text-[7px] font-mono text-[#4B5265] mt-0.5">
                    DIETARY ROADMAP // DESIGNED BY SANDY.LIFTS
                  </p>
                </div>
              </div>
            </div>

            {/* instructions and helper below the card */}
            <p className="text-[11.5px] mt-4 text-[#8B92A5] max-w-[340px] text-center leading-relaxed font-medium">
              📸 <span className="text-white font-bold">Screenshot this card</span> to easily share your personalized fiber architecture on Instagram Stories or save it to your workout gallery!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ────── HIDDEN PDF REPORT (only visible on print) ────── */}
      {result && (
        <div
          id="sandy-pdf-report"
          className="pdf-only"
          style={{
            fontFamily: "'Outfit', 'Inter', sans-serif",
            background: "#ffffff",
            padding: "0",
            margin: "0",
            color: "#111827",
          }}
        >
          {/* PDF Page */}
          <div style={{ width: "210mm", minHeight: "297mm", padding: "28px 32px", boxSizing: "border-box" }}>

            {/* ── HEADER ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #111827", paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", color: "#111827" }}>Sandy.Lifts</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b7280", marginTop: 2 }}>Clinical Fiber Analysis Report</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>📱 @oye_vilen01</div>
                <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>🌐 sandy.lifts</div>
                <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>Generated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
              </div>
            </div>

            {/* ── SECTION 1: PROFILE ── */}
            <div className="pdf-label">01 — User Profile</div>
            <div className="pdf-grid-3" style={{ marginBottom: 14 }}>
              {[
                { label: "Maintenance Calories", value: `${form.calories} kcal` },
                { label: "Gender", value: form.gender === "female" ? `Female${form.femaleCondition !== "regular" ? ` (${form.femaleCondition.toUpperCase()})` : ""}` : "Male" },
                { label: "Age Group", value: form.ageGroup === "under18" ? "Under 18" : form.ageGroup === "above50" ? "50+" : "18–50" },
                { label: "Activity Level", value: form.activity.charAt(0).toUpperCase() + form.activity.slice(1) },
                { label: "Goal", value: form.goal.charAt(0).toUpperCase() + form.goal.slice(1) },
                { label: "Risk Signals Selected", value: `${selectedSymptoms.length} / 7` },
              ].map(item => (
                <div key={item.label} className="pdf-card" style={{ marginBottom: 0 }}>
                  <div className="pdf-label" style={{ marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* ── SECTION 2: RISK SIGNALS ── */}
            {selectedSymptoms.length > 0 && (
              <>
                <div className="pdf-label" style={{ marginTop: 4 }}>02 — Metabolic Drag Signals Detected</div>
                <div className="pdf-card" style={{ background: "#fef2f2", borderColor: "#fca5a5" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedSymptoms.map(s => (
                      <span key={s} style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#fff", border: "1px solid #f87171", color: "#dc2626" }}>
                        ⚠ {s}
                      </span>
                    ))}
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: 10, color: "#6b7280" }}>
                    Each selected signal contributed +1g to your final fiber target as a Metabolic Correction Factor (capped at +7g).
                  </p>
                </div>
              </>
            )}

            {/* ── SECTION 3: PRESCRIPTION ── */}
            <div className="pdf-label" style={{ marginTop: 4 }}>03 — Clinical Fiber Prescription</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "stretch" }}>
              <div className="pdf-card" style={{ flex: "1", textAlign: "center", background: "#f0fdf4", borderColor: "#86efac", marginBottom: 0 }}>
                <div className="pdf-label">Daily Fiber Target</div>
                <div className="pdf-value" style={{ color: "#16a34a", fontSize: 40 }}>{result.target}g</div>
                <div className="pdf-sub">Based on ICMR-NIN 2024</div>
              </div>
              <div style={{ flex: "2", display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="pdf-card" style={{ marginBottom: 0, background: "#ecfeff", borderColor: "#67e8f9" }}>
                  <div className="pdf-label">Soluble Fiber (Gel-forming)</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#0891b2" }}>{result.soluble}g</div>
                    <div className="pdf-sub" style={{ textAlign: "right" }}>Oats, chia, dal, isabgol</div>
                  </div>
                  <div className="pdf-bar-track">
                    <div className="pdf-bar-fill" style={{ width: `${(result.soluble / result.target) * 100}%`, background: "#0891b2" }} />
                  </div>
                </div>
                <div className="pdf-card" style={{ marginBottom: 0, background: "#fffbeb", borderColor: "#fcd34d" }}>
                  <div className="pdf-label">Insoluble Fiber (Gut Sweeper)</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#d97706" }}>{result.insoluble}g</div>
                    <div className="pdf-sub" style={{ textAlign: "right" }}>Whole wheat, broccoli, almonds</div>
                  </div>
                  <div className="pdf-bar-track">
                    <div className="pdf-bar-fill" style={{ width: `${(result.insoluble / result.target) * 100}%`, background: "#d97706" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Hydration ── */}
            <div className="pdf-card" style={{ background: "#eff6ff", borderColor: "#93c5fd", marginBottom: 14 }}>
              <div className="pdf-label">Hydration Co-Factor (Non-negotiable)</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#2563eb" }}>+{result.hydration}ml additional water/day</div>
                <div className="pdf-sub">Hydrophilic fibers require water to function. Without it,<br />fiber causes bloating instead of benefit.</div>
              </div>
            </div>

            {/* ── SECTION 4: SANDY.LIFTS FEATURES ── */}
            <div className="pdf-label" style={{ marginTop: 4 }}>04 — What Sandy.Lifts Offers You</div>
            <div className="pdf-card" style={{ background: "#f9fafb" }}>
              <div className="pdf-grid-2" style={{ gap: 8 }}>
                {[
                  { icon: "🎯", title: "1-on-1 Personalised Coaching", desc: "Custom plans built around your body, goals, and Indian lifestyle." },
                  { icon: "🧬", title: "Scientific Nutrition Planning", desc: "Based on ICMR-NIN 2024, not generic bro-science." },
                  { icon: "📊", title: "Free Metabolic Tools", desc: "Fiber Calculator, BMR tools, and more — free forever." },
                  { icon: "💬", title: "Daily WhatsApp Check-ins", desc: "Real-time support from Coach Sandy, not bots." },
                  { icon: "🍛", title: "Indian Food-First Approach", desc: "Rotis, dal, sabzi — no imported supplements needed." },
                  { icon: "📸", title: "Instagram Content Support", desc: "Your transformation is documented and celebrated at @oye_vilen01." },
                  { icon: "🩺", title: "Medical Condition Protocols", desc: "Specialized plans for PCOS, diabetes, cholesterol, gut health." },
                  { icon: "⚡", title: "4-Week Adaptation Roadmap", desc: "Gradual fiber ramp-up so your gut adjusts without discomfort." },
                ].map(f => (
                  <div key={f.title} className="pdf-feature-item">
                    <div style={{ fontSize: 16, lineHeight: 1, marginTop: 2 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#111827" }}>{f.title}</div>
                      <div style={{ fontSize: 9.5, color: "#6b7280", marginTop: 2 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#111827" }}>Sandy.Lifts</div>
                <div style={{ fontSize: 9, color: "#9ca3af" }}>Scientifically Decreed via ICMR-NIN 2024</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#374151" }}>Book Your Free 1-on-1 Assessment</div>
                <div style={{ fontSize: 9, color: "#6b7280" }}>DM @oye_vilen01 on Instagram</div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
