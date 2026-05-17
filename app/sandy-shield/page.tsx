"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Answer = string | null;

const QUESTIONS = [
  {
    id: "protect",
    question: "What do you want to protect?",
    options: [
      { value: "health",   label: "Health",         icon: "🏥", desc: "Medical bills & hospitalisation" },
      { value: "vehicle",  label: "Vehicle",         icon: "🚗", desc: "Car, bike or commercial vehicle" },
      { value: "life",     label: "Life",            icon: "🛡️", desc: "Income protection & term cover" },
      { value: "all",      label: "All of the above", icon: "⭐", desc: "Full protection package" },
    ],
  },
  {
    id: "family",
    question: "How many people need coverage?",
    options: [
      { value: "solo",    label: "Just me",         icon: "👤", desc: "Individual plan" },
      { value: "couple",  label: "Me + spouse",     icon: "👫", desc: "2 person floater" },
      { value: "family3", label: "Family of 3–4",   icon: "👨‍👩‍👧", desc: "Standard family floater" },
      { value: "family5", label: "Family of 5+",    icon: "👨‍👩‍👧‍👦", desc: "Large family cover" },
    ],
  },
  {
    id: "age",
    question: "Age of the eldest member?",
    options: [
      { value: "18-30", label: "18 – 30 yrs", icon: "🌱", desc: "Young & healthy" },
      { value: "31-45", label: "31 – 45 yrs", icon: "💪", desc: "Prime earning years" },
      { value: "46-60", label: "46 – 60 yrs", icon: "🧘", desc: "Senior coverage matters" },
      { value: "60+",   label: "60+ yrs",     icon: "👴", desc: "Senior citizen plans" },
    ],
  },
  {
    id: "budget",
    question: "Yearly budget for insurance?",
    options: [
      { value: "low",    label: "Under ₹5,000",   icon: "💰", desc: "Basic essential cover" },
      { value: "mid",    label: "₹5,000 – ₹15,000", icon: "💳", desc: "Good value coverage" },
      { value: "high",   label: "₹15,000 – ₹30,000", icon: "💎", desc: "Comprehensive protection" },
      { value: "open",   label: "No limit",       icon: "🚀", desc: "Best available plan" },
    ],
  },
  {
    id: "health",
    question: "Any existing medical conditions?",
    options: [
      { value: "none",     label: "No, all healthy",     icon: "✅", desc: "Standard plans available" },
      { value: "minor",    label: "Minor — BP/diabetes",  icon: "⚠️", desc: "Manageable conditions" },
      { value: "serious",  label: "Yes, serious history", icon: "🔴", desc: "Need specialist guidance" },
      { value: "unsure",   label: "Not sure",             icon: "🤔", desc: "Let Sandy advise" },
    ],
  },
];

function getRecommendation(answers: Record<string, Answer>) {
  const { protect, family, budget, health } = answers;

  if (protect === "vehicle") {
    return {
      title: "Motor Insurance",
      subtitle: "Comprehensive vehicle protection",
      desc: "Based on your answers, a comprehensive motor insurance plan is your priority. Sandy will compare third-party vs. comprehensive options from 10+ companies to get you the best rate.",
      accent: "#F59E0B",
      accentRgb: "245,158,11",
      badge: "Motor",
      waMsg: "Hi Sandy! I completed the insurance quiz. I need Motor Insurance.",
    };
  }

  if (protect === "life") {
    return {
      title: "Term Life Insurance",
      subtitle: "Pure income protection",
      desc: "A term life plan is the smartest protection move. Sandy will help you find the right sum assured and tenure — often for as low as ₹800/month.",
      accent: "#A78BFA",
      accentRgb: "167,139,250",
      badge: "Life",
      waMsg: "Hi Sandy! I completed the insurance quiz. I need a Term Life plan.",
    };
  }

  if (health === "serious") {
    return {
      title: "Niva Bupa — Specialised Plan",
      subtitle: "Coverage despite medical history",
      desc: "With an existing medical condition, choosing the right plan is critical. Sandy has direct access to Niva Bupa's specialised plans and will ensure you're not under-covered or overcharged.",
      accent: "#4DA3FF",
      accentRgb: "77,163,255",
      badge: "Health",
      waMsg: "Hi Sandy! I completed the insurance quiz. I have a medical condition and need the right health plan.",
    };
  }

  if (family === "family5" || budget === "high" || budget === "open" || protect === "all") {
    return {
      title: "Comprehensive Family Cover",
      subtitle: "Niva Bupa Family Floater + Top-Up",
      desc: "Your profile needs a full family floater with a top-up plan for high-value coverage. Sandy will design a layered plan that maximises coverage while keeping premiums efficient.",
      accent: "#4DA3FF",
      accentRgb: "77,163,255",
      badge: "Health + Top-Up",
      waMsg: "Hi Sandy! I completed the insurance quiz. I need a comprehensive family health plan.",
    };
  }

  return {
    title: "Niva Bupa Health Insurance",
    subtitle: "Best fit for your profile",
    desc: "A standard Niva Bupa individual or family floater plan looks like the right fit. Sandy will walk you through the exact plan, premium breakdown, and cashless hospital network near you.",
    accent: "#4DA3FF",
    accentRgb: "77,163,255",
    badge: "Health",
    waMsg: "Hi Sandy! I completed the insurance quiz. I need a Niva Bupa health insurance plan.",
  };
}

export default function SandyShieldPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [selected, setSelected] = useState<Answer>(null);
  const [done, setDone] = useState(false);

  const question = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const handleSelect = (value: string) => setSelected(value);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (step === QUESTIONS.length - 1) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const recommendation = done ? getRecommendation(answers) : null;

  return (
    <main className="min-h-screen bg-[#000000] flex flex-col items-center justify-start pt-28 pb-20 px-4">
      <style>{`
        .ss-opt:hover { border-color: rgba(245,158,11,0.4) !important; background: rgba(245,158,11,0.06) !important; }
        .ss-opt-selected { border-color: rgba(245,158,11,0.6) !important; background: rgba(245,158,11,0.1) !important; }
      `}</style>

      {/* Back link */}
      <div className="w-full max-w-[560px] mb-6">
        <Link href="/" className="text-[12px] font-semibold flex items-center gap-1.5 transition-colors" style={{ color: "#52525B" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Sandy.Lifts
        </Link>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8 text-center"
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h1 className="text-[22px] font-black text-white mb-1">Sandy Shield Quiz</h1>
        <p className="text-[13px]" style={{ color: "#8B909E" }}>Answer 5 quick questions — get a personalised recommendation</p>
      </motion.div>

      <div className="w-full max-w-[560px]">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold" style={{ color: "#F59E0B" }}>Question {step + 1} of {QUESTIONS.length}</span>
                  <span className="text-[11px]" style={{ color: "#52525B" }}>{Math.round(progress)}% done</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-1.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #F59E0B, #FCD34D)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-[18px] font-black text-white mb-5">{question.question}</h2>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {question.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`ss-opt text-left p-4 rounded-2xl border transition-all duration-150 ${selected === opt.value ? "ss-opt-selected" : ""}`}
                    style={{
                      background: selected === opt.value ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.02)",
                      border: selected === opt.value ? "1px solid rgba(245,158,11,0.6)" : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <div className="text-[13px] font-bold text-white mb-0.5">{opt.label}</div>
                    <div className="text-[11px]" style={{ color: "#6B7280" }}>{opt.desc}</div>
                  </button>
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={!selected}
                className="w-full py-4 rounded-full font-bold text-[0.95rem] transition-all duration-200"
                style={{
                  background: selected ? "linear-gradient(90deg, #F59E0B, #FCD34D)" : "rgba(255,255,255,0.04)",
                  color: selected ? "#07090D" : "#3F3F46",
                  border: selected ? "none" : "1px solid rgba(255,255,255,0.07)",
                  cursor: selected ? "pointer" : "not-allowed",
                  boxShadow: selected ? "0 0 24px rgba(245,158,11,0.3)" : "none",
                }}
              >
                {step === QUESTIONS.length - 1 ? "See My Recommendation →" : "Next →"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              {recommendation && (
                <div className="rounded-2xl p-7 text-center"
                  style={{
                    background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(7,9,13,0.95) 100%)",
                    border: `1px solid rgba(${recommendation.accentRgb},0.25)`,
                    boxShadow: `0 0 50px rgba(${recommendation.accentRgb},0.1)`,
                  }}>
                  {/* Top accent */}
                  <div className="w-full h-[1px] mb-6 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, rgba(${recommendation.accentRgb},0.7), transparent)` }} />

                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `rgba(${recommendation.accentRgb},0.12)`, border: `1px solid rgba(${recommendation.accentRgb},0.3)` }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={recommendation.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M8 12l3 3 5-5" strokeWidth="2.2"/>
                    </svg>
                  </div>

                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
                    style={{ background: `rgba(${recommendation.accentRgb},0.12)`, color: recommendation.accent, border: `1px solid rgba(${recommendation.accentRgb},0.3)` }}>
                    {recommendation.badge}
                  </span>

                  <h2 className="text-[22px] font-black text-white mt-2 mb-1">{recommendation.title}</h2>
                  <p className="text-[13px] mb-4 font-semibold" style={{ color: recommendation.accent }}>{recommendation.subtitle}</p>
                  <p className="text-[13px] leading-relaxed mb-7" style={{ color: "#8B909E" }}>{recommendation.desc}</p>

                  <a
                    href={`https://wa.me/916283752916?text=${encodeURIComponent(recommendation.waMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-[0.9rem] transition-all hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(90deg, rgba(${recommendation.accentRgb},0.9), rgba(${recommendation.accentRgb},0.7))`,
                      color: "#07090D",
                      boxShadow: `0 0 24px rgba(${recommendation.accentRgb},0.35)`,
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Talk to Sandy — It&apos;s Free
                  </a>

                  <div className="mt-4">
                    <button
                      onClick={() => { setStep(0); setAnswers({}); setSelected(null); setDone(false); }}
                      className="text-[12px] transition-colors"
                      style={{ color: "#52525B" }}
                    >
                      Retake the quiz
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[11px] mt-10 max-w-[400px] leading-relaxed" style={{ color: "#3F3F46" }}>
        This quiz provides general guidance only. It is not financial or medical advice.
        Deepak Kumar is an IRDAI-licensed insurance advisor (Niva Bupa agent NBHLUD01244243).
      </p>
    </main>
  );
}
