"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Salad, ChevronDown, Droplets, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

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
    { food: "Almonds",              serving: "10 pieces",        fiber: 1.5, type: "insoluble"},
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
function calculateFiber(form: FormState): FiberResult {
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
      { food: "Masoor dal (cooked)",       serving: "1 katori (150g)", fiber: 8.0,  type: "both"      },
      { food: "Rajma / Kidney beans",      serving: "1 katori (150g)", fiber: 7.5,  type: "both"      },
      { food: "Kala chana (cooked)",       serving: "1 katori (150g)", fiber: 7.0,  type: "both"      },
      { food: "Chana dal (cooked)",        serving: "1 katori (150g)", fiber: 6.0,  type: "both"      },
      { food: "Lobiya / Cowpea (cooked)",  serving: "1 katori (150g)", fiber: 6.0,  type: "both"      },
      { food: "Moth dal (cooked)",         serving: "1 katori (150g)", fiber: 5.5,  type: "both"      },
      { food: "Moong dal (cooked)",        serving: "1 katori (150g)", fiber: 3.5,  type: "both"      },
      { food: "Urad dal (cooked)",         serving: "1 katori (150g)", fiber: 3.8,  type: "both"      },
    ],
  },
  {
    category: "Grains & Rotis",
    emoji: "🌾",
    note: "Millets are significantly higher in fiber than wheat",
    items: [
      { food: "Wheat bran (raw)",          serving: "2 tbsp (15g)",    fiber: 7.0,  type: "insoluble" },
      { food: "Oats (cooked)",             serving: "1 bowl (80g dry)",fiber: 6.0,  type: "soluble"   },
      { food: "Barley / Jau (cooked)",     serving: "1 katori",        fiber: 6.0,  type: "soluble"   },
      { food: "Bajra roti",                serving: "2 rotis",         fiber: 4.5,  type: "insoluble" },
      { food: "Jowar roti",                serving: "2 rotis",         fiber: 4.2,  type: "insoluble" },
      { food: "Whole wheat roti (atta)",   serving: "2 rotis",         fiber: 4.0,  type: "insoluble" },
      { food: "Ragi / Nachni (cooked)",    serving: "1 katori",        fiber: 3.6,  type: "insoluble" },
      { food: "Brown rice (cooked)",       serving: "1 katori",        fiber: 3.5,  type: "insoluble" },
      { food: "Poha (cooked)",             serving: "1 katori",        fiber: 1.8,  type: "insoluble" },
    ],
  },
  {
    category: "Vegetables",
    emoji: "🥗",
    note: "Raw vegetables retain more fiber than cooked",
    items: [
      { food: "Arbi / Taro (cooked)",      serving: "1 medium (100g)", fiber: 4.1,  type: "both"      },
      { food: "Bhindi / Okra (cooked)",    serving: "1 katori",        fiber: 3.0,  type: "soluble"   },
      { food: "Karela / Bitter gourd",     serving: "1 katori",        fiber: 2.5,  type: "insoluble" },
      { food: "Palak / Spinach (cooked)",  serving: "1 katori",        fiber: 2.2,  type: "insoluble" },
      { food: "Gajar / Carrot (raw)",      serving: "1 medium",        fiber: 2.0,  type: "insoluble" },
      { food: "Kaddu / Pumpkin (cooked)",  serving: "1 katori",        fiber: 1.8,  type: "both"      },
      { food: "Lauki / Bottle gourd",      serving: "1 katori",        fiber: 1.2,  type: "both"      },
      { food: "Tomato (raw)",              serving: "1 medium",        fiber: 1.2,  type: "both"      },
    ],
  },
  {
    category: "Fruits",
    emoji: "🍎",
    note: "Always eat with skin — peeling removes up to 40% of fiber",
    items: [
      { food: "Guava / Amrood (with skin)",serving: "1 medium",        fiber: 5.4,  type: "both"      },
      { food: "Pear / Nashpati (with skin)",serving: "1 medium",       fiber: 5.5,  type: "soluble"   },
      { food: "Apple (with skin)",         serving: "1 medium",        fiber: 4.5,  type: "both"      },
      { food: "Amla / Indian gooseberry",  serving: "2–3 pieces",      fiber: 3.4,  type: "both"      },
      { food: "Banana",                    serving: "1 medium",        fiber: 3.0,  type: "soluble"   },
      { food: "Papaya",                    serving: "1 cup (150g)",    fiber: 2.5,  type: "both"      },
      { food: "Orange (with pith)",        serving: "1 medium",        fiber: 2.4,  type: "soluble"   },
      { food: "Prunes / Dried plums",      serving: "4–5 pieces",      fiber: 3.0,  type: "both"      },
    ],
  },
  {
    category: "Seeds & Nuts",
    emoji: "🌰",
    note: "Tiny serving, big fiber — easiest daily additions",
    items: [
      { food: "Chia seeds",                serving: "1 tbsp (12g)",    fiber: 5.0,  type: "both"      },
      { food: "Flaxseeds / Alsi",          serving: "1 tbsp (10g)",    fiber: 2.8,  type: "both"      },
      { food: "Methi seeds (soaked)",      serving: "1 tsp",           fiber: 2.7,  type: "soluble"   },
      { food: "Saunf / Fennel seeds",      serving: "1 tsp (2g)",      fiber: 0.9,  type: "soluble"   },
      { food: "Almonds",                   serving: "10 pieces (30g)", fiber: 1.5,  type: "insoluble" },
      { food: "Walnuts / Akhrot",          serving: "4 halves (28g)",  fiber: 1.4,  type: "insoluble" },
    ],
  },
  {
    category: "Supplements & Functional",
    emoji: "💊",
    note: "Use only when food is not enough — whole food fiber is always superior",
    items: [
      { food: "Isabgol husk / Psyllium",   serving: "1 tbsp in water", fiber: 7.0,  type: "soluble"   },
      { food: "Ajwain / Carom seeds",      serving: "¼ tsp (digestive aid)", fiber: 0.3, type: "soluble" },
      { food: "Wheat grass powder",        serving: "1 tsp (5g)",      fiber: 1.0,  type: "insoluble" },
      { food: "Inulin powder",             serving: "1 tsp (5g)",      fiber: 2.5,  type: "soluble"   },
    ],
  },
];

function FiberReferenceTable() {
  const [openCat, setOpenCat] = useState<number | null>(null);
  const G = "#4ade80"; const C = "#22d3ee"; const A = "#fbbf24";
  const card = { background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 };
  const secLbl = { color: "#4B5265", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 16 };

  return (
    <div className="rounded-2xl p-5 mb-4" style={card}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p style={secLbl}>Complete Indian Fiber Reference</p>
        <span className="text-[9px] font-semibold rounded-full px-2 py-0.5 shrink-0 -mt-1" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>IFCT 2017</span>
      </div>
      <p className="text-[12px] mb-4" style={{ color: "#4B5265" }}>Tap any category to see fiber content per serving.</p>

      <div className="flex flex-col gap-2">
        {FIBER_REFERENCE.map((cat, ci) => (
          <div key={ci} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Category header */}
            <button
              onClick={() => setOpenCat(openCat === ci ? null : ci)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              style={{ background: openCat === ci ? "rgba(74,222,128,0.04)" : "transparent", cursor: "pointer" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[18px] shrink-0">{cat.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "#F2F4F8" }}>{cat.category}</p>
                  <p className="text-[10px] truncate" style={{ color: "#4B5265" }}>{cat.note}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] font-semibold rounded-full px-2 py-0.5" style={{ background: "rgba(74,222,128,0.08)", color: G, border: "1px solid rgba(74,222,128,0.15)" }}>{cat.items.length} foods</span>
                <ChevronDown size={14} style={{ color: "#4B5265", transform: openCat === ci ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
            </button>

            {/* Food rows */}
            <AnimatePresence initial={false}>
              {openCat === ci && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                  <div className="overflow-x-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <table className="w-full text-[12px]" style={{ minWidth: 280 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <th className="text-left px-4 py-2 font-semibold" style={{ color: "#8B92A5" }}>Food</th>
                          <th className="text-left px-3 py-2 font-semibold hidden sm:table-cell" style={{ color: "#8B92A5" }}>Serving</th>
                          <th className="text-center px-2 py-2 font-semibold" style={{ color: "#8B92A5" }}>Type</th>
                          <th className="text-right px-4 py-2 font-semibold" style={{ color: G }}>Fiber</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.items.map((item, ii) => (
                          <tr key={ii} style={{ borderBottom: ii < cat.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: ii % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                            <td className="px-4 py-2.5" style={{ color: "#F2F4F8" }}>{item.food}</td>
                            <td className="px-3 py-2.5 hidden sm:table-cell" style={{ color: "#4B5265" }}>{item.serving}</td>
                            <td className="px-2 py-2.5 text-center">
                              <span className="text-[9px] font-semibold rounded-full px-1.5 py-0.5" style={{
                                background: item.type === "soluble" ? "rgba(34,211,238,0.1)" : item.type === "insoluble" ? "rgba(251,191,36,0.1)" : "rgba(74,222,128,0.1)",
                                color:      item.type === "soluble" ? C : item.type === "insoluble" ? A : G,
                                border:    `1px solid ${item.type === "soluble" ? "rgba(34,211,238,0.2)" : item.type === "insoluble" ? "rgba(251,191,36,0.2)" : "rgba(74,222,128,0.2)"}`,
                              }}>
                                {item.type === "both" ? "Both" : item.type === "soluble" ? "Sol" : "Insol"}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right font-bold" style={{ color: G }}>{item.fiber}g</td>
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
    </div>
  );
}

/* ─── Soluble vs Insoluble Guide ─────────────────────────── */
function FiberTypeGuide() {
  const [open, setOpen] = useState(false);
  const C = "#22d3ee"; const A = "#fbbf24"; const G = "#4ade80";

  return (
    <div className="rounded-xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111318" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ cursor: "pointer", background: "transparent" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5" style={{ background: "rgba(255,255,255,0.05)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.1)" }}>BEGINNER GUIDE</span>
          <span className="text-[13px] font-semibold" style={{ color: "#F2F4F8" }}>What is Soluble vs Insoluble fiber?</span>
        </div>
        <ChevronDown size={14} style={{ color: "#4B5265", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-3">

              {/* Soluble */}
              <div className="rounded-xl p-3" style={{ background: `rgba(34,211,238,0.05)`, border: `1px solid rgba(34,211,238,0.15)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[18px]">🫧</span>
                  <span className="text-[13px] font-bold" style={{ color: C }}>Soluble Fiber — "Gel wala fiber"</span>
                </div>
                <p className="text-[12px] leading-relaxed mb-2" style={{ color: "#8B92A5" }}>
                  Paani mein ghul jaata hai. Pet mein ek gel ban jaata hai jo digestion slow karta hai — zyada der tak bhukh nahi lagti, blood sugar spike nahi hota, aur LDL cholesterol kam hota hai.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Oats", "Rajma", "Apple", "Isabgol", "Bhindi", "Banana"].map((f) => (
                    <span key={f} className="text-[10px] font-semibold rounded-full px-2.5 py-1" style={{ background: "rgba(34,211,238,0.1)", color: C, border: "1px solid rgba(34,211,238,0.2)" }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Insoluble */}
              <div className="rounded-xl p-3" style={{ background: `rgba(251,191,36,0.05)`, border: `1px solid rgba(251,191,36,0.15)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[18px]">🧹</span>
                  <span className="text-[13px] font-bold" style={{ color: A }}>Insoluble Fiber — "Jhadu wala fiber"</span>
                </div>
                <p className="text-[12px] leading-relaxed mb-2" style={{ color: "#8B92A5" }}>
                  Paani mein nahi ghulta. Seedha gut se guzarta hai — jaise jhadu. Intestine saaf karta hai, stool bulk karta hai, aur constipation khatam karta hai.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Whole wheat roti", "Wheat bran", "Gajar", "Palak", "Brown rice"].map((f) => (
                    <span key={f} className="text-[10px] font-semibold rounded-full px-2.5 py-1" style={{ background: "rgba(251,191,36,0.1)", color: A, border: "1px solid rgba(251,191,36,0.2)" }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Memory trick */}
              <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)" }}>
                <span className="text-[15px] shrink-0">💡</span>
                <p className="text-[11px] font-semibold" style={{ color: G }}>
                  Easy trick to remember: <span style={{ color: C }}>Soluble = Sugar control.</span> <span style={{ color: A }}>Insoluble = Intestine saaf.</span>
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────── */
export function FiberCalculator() {
  const profile = useBodyProfile();
  const router  = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    calories: "", gender: "male", femaleCondition: "regular",
    ageGroup: "18to50", activity: "moderate", goal: "general",
  });
  const [result,    setResult]    = useState<FiberResult | null>(null);
  const [openTip,   setOpenTip]   = useState<number | null>(null);
  const [openMyth,  setOpenMyth]  = useState<number | null>(null);

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

  const card   = { background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 };
  const secLbl = { color: "#4B5265", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 16 };
  const lbl    = { color: "#8B92A5", fontSize: 12, fontWeight: 600, marginBottom: 8, display: "block" };

  const btnBase = (active: boolean, color = G) => ({
    minHeight: 44, borderRadius: 12,
    border: active ? `1px solid ${color}70` : "1px solid rgba(255,255,255,0.08)",
    background: active ? `${color}12` : "transparent",
    color: active ? color : "#4B5265",
    fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
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

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1rem 6rem" }}>

      {/* Back */}
      <Link href="/tools" className="inline-flex items-center gap-1.5 mb-8 hover:text-[#F2F4F8] transition-colors" style={{ color: "#4B5265", fontSize: 13, textDecoration: "none" }}>
        <ArrowLeft size={14} /> Back to Toolkit
      </Link>

      {/* ── HEADER ── */}
      <div className="rounded-2xl p-5 mb-4" style={card}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
              <Salad size={20} color={G} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(74,222,128,0.08)", color: G, border: "1px solid rgba(74,222,128,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>ICMR-NIN 2024 · IFCT 2017</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Fiber Needs Calculator</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>
          India-specific fiber targets using ICMR-NIN 2024. Calorie-scaled, goal-adjusted, with soluble/insoluble split and a 4-week ramp-up plan.
        </p>
        <AnimatePresence initial={false}>
          {researchOpen && (
            <motion.div key="r" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FORM ── */}
      <div className="rounded-2xl p-5 mb-4" style={card}>
        <p style={secLbl}>Your Details</p>

        {/* Calories */}
        <div className="mb-4">
          <label style={lbl}>Daily Calorie Intake (kcal)</label>
          <input
            type="number" min={500} max={8000} placeholder="e.g. 2000"
            value={form.calories}
            onChange={(e) => setForm((p) => ({ ...p, calories: e.target.value }))}
            className="w-full rounded-xl px-3"
            style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, fontSize: 14, outline: "none" }}
          />
          {!form.calories && (
            <p className="text-[11px] mt-1.5" style={{ color: "#4B5265" }}>
              Don&apos;t know yours?{" "}
              <Link href="/tools/macro-calculator" style={{ color: P, textDecoration: "none" }}>Calculate maintenance calories first →</Link>
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label style={lbl}>Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_OPTS.map((o) => (
              <button key={o.id} onClick={() => setForm((p) => ({ ...p, gender: o.id }))} style={btnBase(form.gender === o.id)}>{o.label}</button>
            ))}
          </div>
        </div>

        {/* Female conditions */}
        <AnimatePresence>
          {form.gender === "female" && (
            <motion.div key="fc" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mb-4">
              <label style={lbl}>Condition</label>
              <div className="grid grid-cols-2 gap-2">
                {FEMALE_OPTS.map((o) => (
                  <button key={o.id} onClick={() => setForm((p) => ({ ...p, femaleCondition: o.id }))} style={btnBase(form.femaleCondition === o.id)}>{o.label}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Age */}
        <div className="mb-4">
          <label style={lbl}>Age Group</label>
          <div className="grid grid-cols-3 gap-2">
            {AGE_OPTS.map((o) => (
              <button key={o.id} onClick={() => setForm((p) => ({ ...p, ageGroup: o.id }))} style={btnBase(form.ageGroup === o.id)}>{o.label}</button>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="mb-4">
          <label style={lbl}>Activity Level</label>
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITY_OPTS.map((o) => (
              <button key={o.id} onClick={() => setForm((p) => ({ ...p, activity: o.id }))}
                className="rounded-xl px-3 py-2.5 text-left transition-all"
                style={{ border: form.activity === o.id ? `1px solid ${G}70` : "1px solid rgba(255,255,255,0.07)", background: form.activity === o.id ? `${G}10` : "transparent", minHeight: 60, cursor: "pointer" }}
              >
                <p className="text-[13px] font-semibold" style={{ color: form.activity === o.id ? G : "#F2F4F8" }}>{o.label}</p>
                <p className="text-[11px]" style={{ color: "#4B5265" }}>{o.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="mb-5">
          <label style={lbl}>Primary Goal</label>
          <div className="flex flex-col gap-2">
            {GOAL_OPTS.map((o) => (
              <button key={o.id} onClick={() => setForm((p) => ({ ...p, goal: o.id }))}
                className="w-full text-left rounded-xl px-3 py-3 flex items-center justify-between transition-all"
                style={{ border: form.goal === o.id ? `1px solid ${G}70` : "1px solid rgba(255,255,255,0.07)", background: form.goal === o.id ? `${G}0a` : "transparent", minHeight: 52, cursor: "pointer" }}
              >
                <span className="text-[13px] font-semibold" style={{ color: form.goal === o.id ? G : "#F2F4F8" }}>{o.label}</span>
                <span className="text-[11px] ml-2 shrink-0" style={{ color: "#4B5265" }}>{o.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => { const cal = parseFloat(form.calories); if (cal >= 500 && cal <= 8000) setResult(calculateFiber(form)); }}
          disabled={!canCalc}
          className="w-full rounded-xl text-[15px] font-semibold transition-opacity"
          style={{ background: G, color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed" }}
        >
          Calculate My Fiber Target →
        </button>
      </div>

      {/* ── RESULTS ── */}
      <AnimatePresence>
        {result && (
          <motion.div key="res" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Numbers */}
            <div className="rounded-2xl p-5 mb-4" style={{ ...card, border: "1px solid rgba(74,222,128,0.2)" }}>
              <p style={secLbl}>Your Fiber Targets</p>

              <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
                {[
                  { label: "Daily Target", value: `${result.target}g`, color: G },
                  { label: "Soluble",      value: `${result.soluble}g`, color: C },
                  { label: "Insoluble",    value: `${result.insoluble}g`, color: A },
                  { label: "Gap to Fill",  value: `+${result.gap}g`, color: P },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Soluble/Insoluble bar */}
              <div className="mb-5">
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span style={{ color: C }}>Soluble {result.soluble}g ({Math.round((result.soluble / result.target) * 100)}%)</span>
                  <span style={{ color: A }}>Insoluble {result.insoluble}g ({Math.round((result.insoluble / result.target) * 100)}%)</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(result.soluble / result.target) * 100}%`, background: `linear-gradient(90deg,${C},${G})` }} />
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  <p className="text-[10px]" style={{ color: "#4B5265" }}><span style={{ color: C }}>Soluble →</span> oats, isabgol, rajma, apple. Controls blood sugar &amp; satiety.</p>
                  <p className="text-[10px]" style={{ color: "#4B5265" }}><span style={{ color: A }}>Insoluble →</span> whole wheat, bhindi, gajar. Gut motility &amp; constipation prevention.</p>
                </div>
              </div>

              {/* Soluble vs Insoluble Guide */}
              <FiberTypeGuide />

              {/* Hydration */}
              <div className="flex items-start gap-3 rounded-xl p-3" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
                <Droplets size={18} color={C} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold" style={{ color: C }}>Hydration Target: +{result.hydration}ml extra water/day</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#4B5265" }}>Required alongside your fiber target. Fiber without adequate water causes constipation, not relief.</p>
                </div>
              </div>
            </div>

            {/* Meal Breakdown */}
            <div className="rounded-2xl p-5 mb-4" style={card}>
              <p style={secLbl}>Meal-Wise Fiber Plan</p>
              <div className="flex flex-col gap-2">
                {getMealBreakdown(result.target, form.goal).map((m) => (
                  <div key={m.meal} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold" style={{ color: "#F2F4F8" }}>{m.meal}</p>
                      <p className="text-[11px] truncate" style={{ color: "#4B5265" }}>{m.example}</p>
                    </div>
                    <span className="text-[16px] font-bold shrink-0" style={{ color: G }}>{m.target}g</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal-specific foods */}
            <div className="rounded-2xl p-5 mb-4" style={card}>
              <p style={secLbl}>Best Foods For Your Goal (IFCT 2017)</p>
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <table className="w-full text-[12px]" style={{ minWidth: 300 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "#8B92A5" }}>Food</th>
                      <th className="text-left px-3 py-2.5 font-semibold hidden sm:table-cell" style={{ color: "#8B92A5" }}>Serving</th>
                      <th className="text-center px-2 py-2.5 font-semibold" style={{ color: "#8B92A5" }}>Type</th>
                      <th className="text-right px-3 py-2.5 font-semibold" style={{ color: G }}>Fiber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FOODS_BY_GOAL[form.goal].map((f, i) => (
                      <tr key={i} style={{ borderBottom: i < 9 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td className="px-3 py-2.5" style={{ color: "#F2F4F8" }}>{f.food}</td>
                        <td className="px-3 py-2.5 hidden sm:table-cell" style={{ color: "#4B5265" }}>{f.serving}</td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="text-[9px] font-semibold rounded-full px-1.5 py-0.5" style={{
                            background: f.type === "soluble" ? "rgba(34,211,238,0.1)" : f.type === "insoluble" ? "rgba(251,191,36,0.1)" : "rgba(74,222,128,0.1)",
                            color:      f.type === "soluble" ? C : f.type === "insoluble" ? A : G,
                            border:    `1px solid ${f.type === "soluble" ? "rgba(34,211,238,0.2)" : f.type === "insoluble" ? "rgba(251,191,36,0.2)" : "rgba(74,222,128,0.2)"}`,
                          }}>
                            {f.type === "both" ? "Both" : f.type === "soluble" ? "Sol" : "Insol"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold" style={{ color: G }}>{f.fiber}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4-Week Ramp-Up */}
            <div className="rounded-2xl p-5 mb-4" style={card}>
              <p style={secLbl}>4-Week Ramp-Up Schedule</p>
              <p className="text-[12px] mb-4 leading-relaxed" style={{ color: "#8B92A5" }}>
                Do not jump to {result.target}g overnight — your gut microbiome needs time to adapt. Follow this schedule to avoid bloating and gas.
              </p>
              <div className="flex flex-col gap-3">
                {result.rampWeeks.map((w) => (
                  <div key={w.week} className="rounded-xl p-4" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold" style={{ color: G }}>Week {w.week}</span>
                      <span className="text-[15px] font-bold" style={{ color: "#F2F4F8" }}>{w.target}g/day</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full mb-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${(w.target / result.target) * 100}%`, background: G }} />
                    </div>
                    <p className="text-[11px]" style={{ color: "#4B5265" }}>{w.tip}</p>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TIPS ── */}
      <div className="rounded-2xl p-5 mb-4" style={card}>
        <p style={secLbl}>12 Science-Backed Tips</p>
        <div className="flex flex-col gap-2">
          {TIPS.map((t, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <button
                onClick={() => setOpenTip(openTip === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                style={{ background: openTip === i ? "rgba(74,222,128,0.04)" : "transparent", cursor: "pointer" }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[9px] font-bold rounded-full px-2 py-0.5 shrink-0" style={{ background: "rgba(74,222,128,0.08)", color: G, border: "1px solid rgba(74,222,128,0.2)" }}>{t.category}</span>
                  <span className="text-[13px] font-semibold truncate" style={{ color: "#F2F4F8" }}>{t.tip}</span>
                </div>
                <ChevronDown size={14} className="shrink-0 ml-2 transition-transform duration-200" style={{ color: "#4B5265", transform: openTip === i ? "rotate(180deg)" : "none" }} />
              </button>
              <AnimatePresence initial={false}>
                {openTip === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <p className="px-4 pb-4 text-[12px] leading-relaxed" style={{ color: "#8B92A5" }}>{t.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── MYTHS ── */}
      <div className="rounded-2xl p-5 mb-4" style={card}>
        <p style={secLbl}>8 Fiber Myths — Busted</p>
        <div className="flex flex-col gap-2">
          {MYTHS.map((m, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <button
                onClick={() => setOpenMyth(openMyth === i ? null : i)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left"
                style={{ background: openMyth === i ? "rgba(248,113,113,0.04)" : "transparent", cursor: "pointer" }}
              >
                <X size={14} className="shrink-0 mt-0.5" style={{ color: R }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-semibold" style={{ color: "#F2F4F8", lineHeight: 1.4 }}>{m.myth}</span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <span className="text-[9px] font-bold rounded-full px-2 py-0.5 hidden sm:block" style={{ background: "rgba(248,113,113,0.08)", color: R, border: "1px solid rgba(248,113,113,0.2)" }}>{m.tag}</span>
                      <ChevronDown size={14} style={{ color: "#4B5265", transform: openMyth === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </div>
                  </div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openMyth === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 flex items-start gap-2">
                      <Check size={14} className="shrink-0 mt-0.5" style={{ color: G }} />
                      <p className="text-[12px] leading-relaxed" style={{ color: "#8B92A5" }}>{m.reality}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── FIBER REFERENCE TABLE ── */}
      <FiberReferenceTable />

      {/* ── CTA ── */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-2xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}
        >
          <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: P }}>Next Step</span>
          <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Fiber target set. Now plan your diet break schedule →</p>
          <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Find out when to take a strategic break from dieting to beat adaptive thermogenesis.</p>
          <button onClick={() => router.push("/tools/diet-break?from=fiber-calculator")}
            className="w-full rounded-xl text-[14px] font-semibold"
            style={{ background: P, color: "#07090D", minHeight: 52, border: "none", cursor: "pointer" }}
          >
            Plan My Diet Break →
          </button>
        </motion.div>
      )}

      <p className="text-[11px] mt-6 text-center leading-relaxed" style={{ color: "#4B5265" }}>
        Estimates based on ICMR-NIN 2024 and peer-reviewed research. Individual results vary. Not medical advice — consult a qualified professional before making changes.
      </p>
    </div>
  );
}
