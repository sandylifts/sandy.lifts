"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TipCard } from "./TipCard";
import { HandoffCTA } from "./HandoffCTA";

/* ─── Types ─────────────────────────────────────────────── */
interface NEATQuizProps {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: "male" | "female";
}

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: Option[];
}

interface Option {
  id: string;
  label: string;
  desc: string;
  kcal: number;
}

interface Answers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
}

/* ─── Quiz Data ─────────────────────────────────────────── */
const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What does your typical workday look like?",
    subtitle: "Occupation & daily job type",
    options: [
      { id: "a", label: "Desk job / WFH", desc: "Seated most of the day", kcal: 200 },
      { id: "b", label: "Mix of sitting & walking", desc: "Teacher, retail, healthcare etc.", kcal: 500 },
      { id: "c", label: "Mostly on my feet all day", desc: "Standing or light walking throughout", kcal: 900 },
      { id: "d", label: "Physical labour / field work", desc: "Construction, farming, delivery etc.", kcal: 1400 },
    ],
  },
  {
    id: 2,
    question: "How do you usually travel through your day?",
    subtitle: "Commute & getting around",
    options: [
      { id: "a", label: "Car, bike, or auto", desc: "Minimal walking door-to-door", kcal: 0 },
      { id: "b", label: "Public transport", desc: "Some walking to/from stops", kcal: 80 },
      { id: "c", label: "Walk or cycle most of the way", desc: "Active commute", kcal: 200 },
    ],
  },
  {
    id: 3,
    question: "How active are you at home outside of exercise?",
    subtitle: "Home activity level",
    options: [
      { id: "a", label: "Mostly relaxing", desc: "Screens, couch, low movement", kcal: 50 },
      { id: "b", label: "Some cooking & light chores", desc: "Moderate home activity", kcal: 120 },
      { id: "c", label: "Lots of cooking, cleaning & errands", desc: "Very active at home, chasing kids etc.", kcal: 220 },
    ],
  },
  {
    id: 4,
    question: "Roughly how many steps do you walk per day?",
    subtitle: "Daily step count",
    options: [
      { id: "a", label: "Under 3,000 steps", desc: "Very low movement day", kcal: 60 },
      { id: "b", label: "3,000 – 6,000 steps", desc: "Below average activity", kcal: 130 },
      { id: "c", label: "6,000 – 10,000 steps", desc: "Moderate daily movement", kcal: 230 },
      { id: "d", label: "Over 10,000 steps", desc: "High daily step count", kcal: 380 },
    ],
  },
  {
    id: 5,
    question: "When resting, how much do you naturally move around?",
    subtitle: "Fidgeting & spontaneous movement",
    options: [
      { id: "a", label: "Very still", desc: "Barely move when sitting", kcal: 0 },
      { id: "b", label: "Sometimes fidget", desc: "Tap feet, shift in seat occasionally", kcal: 50 },
      { id: "c", label: "Constantly moving", desc: "Restless, always doing something", kcal: 150 },
    ],
  },
];

/* ─── Tip generation ────────────────────────────────────── */
interface Tip {
  icon: string;
  tip: string;
  source?: string;
}

function generateTips(answers: Required<Answers>): Tip[] {
  const tips: Array<{ score: number; tip: Tip }> = [];

  // Q1 — Occupation
  const q1Opt = QUESTIONS[0].options.find((o) => o.id === answers.q1);
  if (q1Opt && q1Opt.kcal <= 200) {
    tips.push({
      score: 0,
      tip: {
        icon: "🪑",
        tip: "Set a timer for every 45 minutes — stand up and walk for 5 minutes. Over 8 hours, this adds ~200 kcal of NEAT with zero disruption to your workflow.",
      },
    });
  } else if (q1Opt && q1Opt.kcal <= 500) {
    tips.push({
      score: 1,
      tip: {
        icon: "🚶",
        tip: "Use a standing desk for at least 2 hours of your workday. Alternating sitting and standing burns an extra 50 kcal/hour at the same cognitive output.",
      },
    });
  }

  // Q2 — Commute
  const q2Opt = QUESTIONS[1].options.find((o) => o.id === answers.q2);
  if (q2Opt && q2Opt.kcal === 0) {
    tips.push({
      score: 0,
      tip: {
        icon: "🅿️",
        tip: "Park one street further away or take stairs instead of lifts at work. This can add 800–1,200 steps daily with zero schedule change.",
      },
    });
  }

  // Q3 — Home activity
  const q3Opt = QUESTIONS[2].options.find((o) => o.id === answers.q3);
  if (q3Opt && q3Opt.kcal <= 50) {
    tips.push({
      score: 0,
      tip: {
        icon: "🍳",
        tip: "Cook at least 3 meals per week instead of ordering in. Cooking and cleaning up burns ~120 kcal per session — and your nutrition improves as a bonus.",
      },
    });
  }

  // Q4 — Steps
  const q4Opt = QUESTIONS[3].options.find((o) => o.id === answers.q4);
  if (q4Opt && q4Opt.kcal <= 130) {
    tips.push({
      score: 0,
      tip: {
        icon: "🥗",
        tip: "Take a 10-minute walk after each main meal. Colberg et al. 2009 (Diabetes Care) showed this lowers post-meal blood glucose by ~22% AND adds ~1,500 steps effortlessly.",
        source: "Colberg SR et al., 2009 — Diabetes Care",
      },
    });
  }

  // Q5 — Fidgeting
  const q5Opt = QUESTIONS[4].options.find((o) => o.id === answers.q5);
  if (q5Opt && q5Opt.kcal === 0) {
    tips.push({
      score: 0,
      tip: {
        icon: "📞",
        tip: "Take all phone calls standing up or pacing. Levine et al. 2005 found that spontaneous movement and posture changes account for up to 350 kcal/day variation between individuals.",
        source: "Levine JA et al., 2005 — Science",
      },
    });
  }

  // Always ensure at least 3 tips
  const fallbacks: Tip[] = [
    {
      icon: "🧹",
      tip: "Add one household chore per day — vacuuming, mopping, or tidying for 20 minutes burns 80–120 kcal and keeps your living space in order.",
    },
    {
      icon: "🛗",
      tip: "Avoid lifts and escalators whenever possible. Taking stairs for 5 minutes burns roughly 45 kcal and strengthens your legs as a side effect.",
    },
    {
      icon: "💧",
      tip: "Use a smaller water bottle so you need to refill it more often — each trip adds 50–100 steps and breaks up sedentary time.",
    },
  ];

  const result = tips.slice(0, 3).map((t) => t.tip);
  while (result.length < 3) {
    result.push(fallbacks[result.length]);
  }
  return result;
}

/* ─── NEAT calculation ──────────────────────────────────── */
function calculateNEAT(answers: Required<Answers>, weightKg: number): number {
  const q1 = QUESTIONS[0].options.find((o) => o.id === answers.q1)?.kcal ?? 200;
  const q2 = QUESTIONS[1].options.find((o) => o.id === answers.q2)?.kcal ?? 0;
  const q3 = QUESTIONS[2].options.find((o) => o.id === answers.q3)?.kcal ?? 50;
  const q4Base = QUESTIONS[3].options.find((o) => o.id === answers.q4)?.kcal ?? 60;
  const q5 = QUESTIONS[4].options.find((o) => o.id === answers.q5)?.kcal ?? 0;

  // Q4 is weight-adjusted
  const q4 = Math.round(q4Base * (weightKg / 70));

  return q1 + q2 + q3 + q4 + q5;
}

type NEATCategory = {
  label: string;
  color: string;
  summary: string;
};

function getNEATCategory(kcal: number): NEATCategory {
  if (kcal < 400)
    return {
      label: "Very Sedentary",
      color: "#ef4444",
      summary: `You burn around ${kcal} calories a day just from daily life — well below average. This is one of the strongest predictors of long-term weight gain.`,
    };
  if (kcal < 700)
    return {
      label: "Low Active",
      color: "#fb923c",
      summary: `You burn around ${kcal} calories a day through daily life. Small, consistent lifestyle changes could double this without any gym time.`,
    };
  if (kcal < 1000)
    return {
      label: "Moderately Active",
      color: "#fbbf24",
      summary: `You burn around ${kcal} calories a day from daily life — a solid foundation. Closing the gap to the top tier is within easy reach.`,
    };
  if (kcal < 1400)
    return {
      label: "Active",
      color: "#4ade80",
      summary: `You burn around ${kcal} calories a day from daily life — well above average. Your lifestyle is already working in your favour.`,
    };
  return {
    label: "Highly Active",
    color: "#4ade80",
    summary: `You burn around ${kcal} calories a day from daily life alone. You are in the top tier — this is a significant natural advantage for body composition.`,
  };
}

/* ─── Component ─────────────────────────────────────────── */
export function NEATQuiz({ weightKg, heightCm, age, gender }: NEATQuizProps) {
  const [currentQ, setCurrentQ] = useState(0); // 0 = not started → show intro
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<{ kcal: number; category: NEATCategory; tips: Tip[] } | null>(null);
  const [direction, setDirection] = useState(1); // slide direction
  const resultRef = useRef<HTMLDivElement>(null);

  const isStarted = currentQ > 0;
  const currentQuestion = QUESTIONS[currentQ - 1];
  const totalQ = QUESTIONS.length;
  const progress = (Object.keys(answers).length / totalQ) * 100;

  function handleAnswer(qId: number, optId: string) {
    const key = `q${qId}` as keyof Answers;
    const newAnswers = { ...answers, [key]: optId };
    setAnswers(newAnswers);

    if (qId === totalQ) {
      // All answered — compute result
      const fullAnswers = newAnswers as Required<Answers>;
      const kcal = calculateNEAT(fullAnswers, weightKg);
      const category = getNEATCategory(kcal);
      const tips = generateTips(fullAnswers);
      setResult({ kcal, category, tips });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } else {
      setDirection(1);
      setCurrentQ(qId + 1);
    }
  }

  function handleBack() {
    if (currentQ > 1) {
      setDirection(-1);
      setCurrentQ((q) => q - 1);
    }
  }

  function handleRestart() {
    setCurrentQ(1);
    setAnswers({});
    setResult(null);
    setDirection(1);
  }

  const selectedAnswer = currentQuestion
    ? answers[`q${currentQuestion.id}` as keyof Answers]
    : undefined;

  return (
    <div id="neat-quiz" className="flex flex-col gap-6">
      {/* Progress Bar */}
      {isStarted && !result && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#6B6F9A]">
              Question {currentQ} of {totalQ}
            </p>
            <p className="text-[11px] text-[#6B6F9A]">
              {Math.round(progress)}% complete
            </p>
          </div>
          <div className="h-1 rounded-full bg-[rgba(255,255,255,0.07)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #60ADC7, #C3FCFE)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {/* Dot indicators */}
          <div className="flex gap-1.5 mt-1">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  background:
                    i < Object.keys(answers).length
                      ? "#C3FCFE"
                      : i === currentQ - 1
                      ? "rgba(195,252,254,0.5)"
                      : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Question Card */}
      {!result && (
        <AnimatePresence mode="wait" custom={direction}>
          {!isStarted ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(167,139,250,0.12)] border border-[rgba(167,139,250,0.25)] flex items-center justify-center text-2xl mx-auto mb-4">
                ⚡
              </div>
              <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#a78bfa] mb-2">
                5 Questions · 2 Minutes
              </p>
              <p className="text-[15px] font-semibold text-[#D8DBFC] mb-2">
                Ready to estimate your NEAT?
              </p>
              <p className="text-[13px] text-[#6B6F9A] leading-[1.7] mb-5 max-w-[380px] mx-auto">
                Your weight ({weightKg} kg) from Step 1 has been carried over — your step calorie
                estimate will be personalised to you.
              </p>
              <button
                onClick={() => { setDirection(1); setCurrentQ(1); }}
                className="w-full sm:w-auto px-8 py-3 rounded-xl border border-[rgba(167,139,250,0.4)] bg-[rgba(167,139,250,0.1)] text-[#C69FF5] font-semibold text-[14px] hover:bg-[rgba(167,139,250,0.18)] transition-all duration-200"
              >
                Start Quiz →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`q${currentQ}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6"
            >
              {/* Question header */}
              <div className="mb-5">
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A] mb-1">
                  {currentQuestion.subtitle}
                </p>
                <p className="text-[17px] font-semibold text-[#F5F7FA] leading-[1.4]">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2.5 mb-5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(currentQuestion.id, opt.id)}
                      className={`w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                        isSelected
                          ? "border-[rgba(167,139,250,0.5)] bg-[rgba(167,139,250,0.1)]"
                          : "border-[rgba(255,255,255,0.08)] bg-transparent hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.03)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                              isSelected
                                ? "border-[#a78bfa] bg-[#a78bfa] text-[#07090D]"
                                : "border-[rgba(255,255,255,0.2)] text-[#6B6F9A]"
                            }`}
                          >
                            {opt.id.toUpperCase()}
                          </span>
                          <div>
                            <p
                              className={`text-[14px] font-semibold leading-tight ${
                                isSelected ? "text-[#C69FF5]" : "text-[#D8DBFC]"
                              }`}
                            >
                              {opt.label}
                            </p>
                            <p className="text-[12px] text-[#6B6F9A] mt-0.5">{opt.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="shrink-0 text-[#a78bfa] text-[18px]"
                          >
                            ✓
                          </motion.span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Nav buttons */}
              {currentQ > 1 && (
                <button
                  onClick={handleBack}
                  className="text-[13px] text-[#6B6F9A] hover:text-[#9A9EC4] transition-colors duration-200 flex items-center gap-1"
                >
                  ← Back
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Results */}
      {result && (
        <motion.div
          ref={resultRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          {/* Section A — NEAT Score */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 text-center">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A] mb-3">
              Your NEAT Score
            </p>
            <div className="flex items-end justify-center gap-2 mb-3">
              <span
                className="text-[56px] font-bold leading-none tracking-tight"
                style={{ color: result.category.color }}
              >
                ~{result.kcal}
              </span>
              <span className="text-[18px] text-[#9A9EC4] mb-2">kcal/day</span>
            </div>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[12px] font-bold tracking-[1px] uppercase mb-4"
              style={{
                background: `${result.category.color}20`,
                color: result.category.color,
                border: `1px solid ${result.category.color}44`,
              }}
            >
              {result.category.label}
            </span>
            <p className="text-[14px] text-[#9A9EC4] leading-[1.7] max-w-[420px] mx-auto">
              {result.category.summary}
            </p>
          </div>

          {/* Section B — What This Means */}
          <div className="rounded-xl border border-[rgba(195,252,254,0.1)] bg-[rgba(195,252,254,0.03)] p-5">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#C3FCFE] mb-3">
              What This Means
            </p>
            <p className="text-[13px] text-[#9A9EC4] leading-[1.75]">
              The most active people burn up to <span className="text-[#D8DBFC] font-semibold">1,400 kcal/day</span> through NEAT alone — with zero gym
              sessions. Obese individuals sit on average <span className="text-[#D8DBFC] font-semibold">2 hours more per day</span> than lean people
              (Levine JA, 2005). Closing that gap often has more impact than adding another workout.
            </p>

            <div className="mt-4 pt-4 border-t border-[rgba(195,252,254,0.08)]">
              <p className="text-[11px] text-[#6B6F9A]">
                Gap to Highly Active:{" "}
                <span
                  className="font-bold"
                  style={{ color: result.kcal >= 1400 ? "#4ade80" : "#fbbf24" }}
                >
                  {result.kcal >= 1400 ? "None — you're there." : `+${Math.max(0, 1400 - result.kcal)} kcal/day`}
                </span>
              </p>
            </div>
          </div>

          {/* Section C — Personalised Tips */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6F9A]">
              3 Personalised Actions
            </p>
            {result.tips.map((tip, i) => (
              <TipCard key={i} icon={tip.icon} tip={tip.tip} source={tip.source} rank={i + 1} />
            ))}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3.5">
            <span className="text-[14px] shrink-0">🔬</span>
            <p className="text-[11px] text-[#6B6F9A] leading-[1.65]">
              This is a research-based estimate, not a medical measurement. Individual NEAT varies
              significantly. Use this as a directional baseline, not a precise calorie count.
            </p>
          </div>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="text-[13px] text-[#6B6F9A] hover:text-[#9A9EC4] transition-colors duration-200 text-center"
          >
            ↺ Retake Quiz
          </button>

          {/* ── Handoff CTA ── */}
          <HandoffCTA
            bmiData={{ weight_kg: weightKg, height_cm: heightCm, age, gender, neat_score: result.kcal }}
            neatScore={result.kcal}
          />
        </motion.div>
      )}
    </div>
  );
}
