"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Gender, Level, Goal } from "@/lib/plans/types";

// Step components
import { WelcomeStep } from "./steps/WelcomeStep";
import { GenderStep } from "./steps/GenderStep";
import { LevelStep } from "./steps/LevelStep";
import { GoalStep } from "./steps/GoalStep";
import { StatsStep } from "./steps/StatsStep";

export interface FormData {
  gender: Gender | null;
  level: Level | null;
  goal: Goal | null;
  age: number | null;
  weight: number | null;
  height: number | null;
}

const TOTAL_STEPS = 5;

const STEP_LABELS = ["Welcome", "Gender", "Experience", "Goal", "Your Stats"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GetStartedModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>({
    gender: null,
    level: null,
    goal: null,
    age: null,
    weight: null,
    height: null,
  });

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(0);
        setForm({ gender: null, level: null, goal: null, age: null, weight: null, height: null });
      }, 300);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const update = (patch: Partial<FormData>) => {
    setForm((f) => ({ ...f, ...patch }));
  };

  const submit = () => {
    if (!form.gender || !form.level || !form.goal || !form.age || !form.weight || !form.height) return;
    onClose();
    router.push(
      `/get-started/plan?gender=${form.gender}&level=${form.level}&goal=${form.goal}&age=${form.age}&weight=${form.weight}&height=${form.height}`
    );
  };

  // Theme based on gender selection
  const isWomen = form.gender === "women";

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const steps = [
    <WelcomeStep key="welcome" onNext={next} isWomen={isWomen} />,
    <GenderStep key="gender" value={form.gender} onChange={(g) => { update({ gender: g }); next(); }} />,
    <LevelStep key="level" value={form.level} onChange={(l) => { update({ level: l }); next(); }} isWomen={isWomen} />,
    <GoalStep key="goal" value={form.goal} onChange={(g) => { update({ goal: g }); next(); }} isWomen={isWomen} />,
    <StatsStep key="stats" form={form} onChange={update} onSubmit={submit} isWomen={isWomen} />,
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(5,5,11,0.85)", backdropFilter: "blur(16px)" }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Get Started — Build your plan"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 md:p-6"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col rounded-2xl"
              style={{
                pointerEvents: "auto",
                background: isWomen
                  ? "linear-gradient(145deg, #130810 0%, #1a0a14 50%, #0d0509 100%)"
                  : "linear-gradient(145deg, #07090D 0%, #0d1018 50%, #05050B 100%)",
                border: isWomen
                  ? "1px solid rgba(255,105,180,0.2)"
                  : "1px solid rgba(195,252,254,0.12)",
                boxShadow: isWomen
                  ? "0 0 60px rgba(255,105,180,0.15), 0 24px 80px rgba(0,0,0,0.6)"
                  : "0 0 60px rgba(77,163,255,0.12), 0 24px 80px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0"
                style={{
                  borderBottom: isWomen
                    ? "1px solid rgba(255,105,180,0.1)"
                    : "1px solid rgba(195,252,254,0.08)",
                }}
              >
                {/* Back button */}
                <button
                  type="button"
                  onClick={step > 0 ? back : onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                  style={{
                    background: isWomen ? "rgba(255,105,180,0.08)" : "rgba(77,163,255,0.08)",
                    border: isWomen ? "1px solid rgba(255,105,180,0.2)" : "1px solid rgba(77,163,255,0.2)",
                    color: isWomen ? "#FF69B4" : "#4DA3FF",
                  }}
                  aria-label={step > 0 ? "Previous step" : "Close"}
                >
                  {step > 0 ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  )}
                </button>

                {/* Step label */}
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: isWomen ? "#FF69B4" : "#4DA3FF" }}>
                  {STEP_LABELS[step]}
                </span>

                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#6B6F9A",
                  }}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-6 py-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-500"
                      style={{
                        background: i <= step
                          ? isWomen
                            ? "linear-gradient(90deg, #FF69B4, #FFB6C1)"
                            : "linear-gradient(90deg, #4DA3FF, #66E6FF)"
                          : "rgba(255,255,255,0.06)",
                        boxShadow: i <= step
                          ? isWomen
                            ? "0 0 8px rgba(255,105,180,0.4)"
                            : "0 0 8px rgba(77,163,255,0.4)"
                          : "none",
                      }}
                    />
                  ))}
                </div>
                <p className="text-right text-[0.65rem] mt-1" style={{ color: isWomen ? "rgba(255,182,193,0.5)" : "rgba(195,252,254,0.4)" }}>
                  Step {step + 1} of {TOTAL_STEPS}
                </p>
              </div>

              {/* Step content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarWidth: "none" }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                  >
                    {steps[step]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
