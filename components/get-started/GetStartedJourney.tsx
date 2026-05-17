"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Gender, Level, Goal } from "@/lib/plans/types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Form {
  gender: Gender | null;
  level: Level | null;
  goal: Goal | null;
  age: string;
  weight: string;
  height: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = ["welcome", "gender", "level", "goal", "stats"] as const;
type Step = (typeof STEPS)[number];

// ─── Slide variants ───────────────────────────────────────────────────────────
const slide = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};
const T = { duration: 0.45, ease: "easeInOut" as const };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const men = (g: Gender | null) => g !== "women";

// ─── Liquid Glass style helpers ───────────────────────────────────────────────
const glassCard = (accent: string, intensity: number = 1): React.CSSProperties => ({
  background: `linear-gradient(145deg,
    rgba(255,255,255,${0.09 * intensity}) 0%,
    rgba(255,255,255,${0.03 * intensity}) 45%,
    rgba(255,255,255,${0.06 * intensity}) 100%)`,
  backdropFilter: `blur(${22 * intensity}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${22 * intensity}px) saturate(180%)`,
  border: `1px solid rgba(255,255,255,${0.14 * intensity})`,
  boxShadow: [
    `inset 0 1.5px 0 rgba(255,255,255,${0.45 * intensity})`,
    `inset 0 -1px 0 rgba(0,0,0,0.18)`,
    `inset 1px 0 0 rgba(255,255,255,${0.07 * intensity})`,
    `inset -1px 0 0 rgba(255,255,255,${0.04 * intensity})`,
    `0 0 40px ${accent}30`,
    `0 20px 50px rgba(0,0,0,0.55)`,
    `0 4px 12px rgba(0,0,0,0.35)`,
  ].join(", "),
});

const glassCardSelected = (accent: string, accentB: string): React.CSSProperties => ({
  background: `linear-gradient(145deg,
    ${accent}18 0%,
    rgba(255,255,255,0.05) 40%,
    ${accentB}0A 100%)`,
  backdropFilter: "blur(24px) saturate(200%)",
  WebkitBackdropFilter: "blur(24px) saturate(200%)",
  border: `1px solid ${accent}45`,
  boxShadow: [
    `inset 0 1.5px 0 rgba(255,255,255,0.5)`,
    `inset 0 -1px 0 rgba(0,0,0,0.18)`,
    `inset 1px 0 0 rgba(255,255,255,0.1)`,
    `0 0 50px ${accent}35`,
    `0 0 90px ${accent}15`,
    `0 20px 50px rgba(0,0,0,0.55)`,
  ].join(", "),
});

const glassButton = (): React.CSSProperties => ({
  background: "linear-gradient(135deg, #4DA3FF 0%, #A78BFA 50%, #66E6FF 100%)",
  boxShadow: [
    "inset 0 1.5px 0 rgba(255,255,255,0.55)",
    "inset 0 -2px 5px rgba(0,0,0,0.2)",
    "inset 1px 0 0 rgba(255,255,255,0.15)",
    "0 0 35px rgba(77,163,255,0.55)",
    "0 0 70px rgba(167,139,250,0.25)",
    "0 8px 24px rgba(0,0,0,0.35)",
  ].join(", "),
  backdropFilter: "blur(12px)",
});

// ─── Main Component ───────────────────────────────────────────────────────────
export function GetStartedJourney() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>({ gender: null, level: null, goal: null, age: "", weight: "", height: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [loading, setLoading] = useState(false);

  const step = STEPS[stepIdx];
  const isWomen = form.gender === "women";
  const accent = isWomen ? "#FF69B4" : "#4DA3FF";
  const accentB = isWomen ? "#FFB6C1" : "#66E6FF";
  const glow = isWomen ? "rgba(255,105,180,0.2)" : "rgba(77,163,255,0.18)";
  const bg = isWomen
    ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,105,180,0.07) 0%, transparent 70%)"
    : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(77,163,255,0.07) 0%, transparent 70%)";

  const go = (nextIdx: number, direction: number) => {
    setDir(direction);
    setStepIdx(nextIdx);
  };
  const next = () => go(stepIdx + 1, 1);
  const back = () => go(stepIdx - 1, -1);
  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  const submitStats = () => {
    const e: Partial<Record<keyof Form, string>> = {};
    const age = Number(form.age);
    const w = Number(form.weight);
    const h = Number(form.height);
    if (!form.age || age < 14 || age > 80) e.age = "Enter valid age (14–80)";
    if (!form.weight || w < 30 || w > 300) e.weight = "Enter valid weight (30–300 kg)";
    if (!form.height || h < 120 || h > 250) e.height = "Enter valid height (120–250 cm)";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    setTimeout(() => {
      router.push(
        `/get-started/plan?gender=${form.gender}&level=${form.level}&goal=${form.goal}&age=${form.age}&weight=${form.weight}&height=${form.height}`
      );
    }, 2200);
  };

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen accent={accent} accentB={accentB} glow={glow} isWomen={isWomen} />;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#05050B" }}
    >
      {/* Ambient bg glow — shifts with gender */}
      <motion.div
        className="pointer-events-none fixed inset-0"
        animate={{ background: bg }}
        transition={{ duration: 0.8 }}
        aria-hidden="true"
      />

      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute rounded-full"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 400, height: 400, top: "-10%", right: "-10%", background: isWomen ? "radial-gradient(circle, rgba(255,105,180,0.06) 0%, transparent 70%)" : "radial-gradient(circle, rgba(77,163,255,0.06) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute rounded-full"
          style={{ width: 300, height: 300, bottom: "10%", left: "-5%", background: isWomen ? "radial-gradient(circle, rgba(255,182,193,0.05) 0%, transparent 70%)" : "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      {/* Progress bar — top */}
      {step !== "welcome" && (
        <div className="fixed top-0 left-0 right-0 z-20 h-1">
          <motion.div
            className="h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ background: `linear-gradient(90deg, ${accent}, ${accentB})`, boxShadow: `0 0 12px ${glow}` }}
          />
        </div>
      )}

      {/* Back button */}
      {stepIdx > 0 && (
        <button
          type="button"
          onClick={back}
          className="fixed top-20 left-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9A9EC4" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          Back
        </button>
      )}

      {/* Steps */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={T}
            >
              {step === "welcome" && <WelcomeStep accent={accent} accentB={accentB} glow={glow} isWomen={isWomen} onNext={next} />}
              {step === "gender" && <GenderStep value={form.gender} onChange={(g) => { set({ gender: g }); setTimeout(next, 300); }} />}
              {step === "level" && <LevelStep value={form.level} onChange={(l) => { set({ level: l }); setTimeout(next, 300); }} accent={accent} accentB={accentB} glow={glow} />}
              {step === "goal" && <GoalStep value={form.goal} onChange={(g) => { set({ goal: g }); setTimeout(next, 300); }} isWomen={isWomen} accent={accent} accentB={accentB} glow={glow} />}
              {step === "stats" && <StatsStep form={form} errors={errors} onChange={set} onSubmit={submitStats} accent={accent} accentB={accentB} glow={glow} isWomen={isWomen} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — WELCOME HERO (Split Layout + Floating Cards)
// ─────────────────────────────────────────────────────────────────────────────
function WelcomeStep({ onNext }: { accent?: string; accentB?: string; glow?: string; isWomen?: boolean; onNext: () => void }) {
  return (
    <div className="w-full min-h-[calc(100vh-96px)] flex items-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-8">

        {/* ── LEFT: Copy + CTA ── */}
        <div className="flex flex-col gap-7 order-2 lg:order-1">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9A9EC4" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" style={{ boxShadow: "0 0 6px #34d399", animation: "pulse 2s infinite" }} />
            Sandy.Lifts · Free Forever
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.55 }}>
            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-black leading-[1.08] tracking-tight">
              <span style={{ color: "#F5F7FA" }}>Thank you for</span>
              <br />
              <span style={{
                background: "linear-gradient(135deg, #4DA3FF 0%, #A78BFA 45%, #66E6FF 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(77,163,255,0.4))",
              }}>
                trusting us.
              </span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base leading-relaxed max-w-md"
            style={{ color: "#9A9EC4" }}
          >
            Most people spend <span style={{ color: "#D8DBFC", fontWeight: 600 }}>years in the gym</span> without a real plan — spinning wheels, following random advice, getting nowhere.
            <br /><br />
            You just made the decision that separates the 1% from everyone else.
          </motion.p>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="flex items-center gap-4 flex-wrap"
          >
            {[
              { n: "180", sub: "Day Roadmap", color: "#4DA3FF" },
              { n: "3", sub: "Levels Covered", color: "#A78BFA" },
              { n: "100%", sub: "Personalized", color: "#66E6FF" },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black" style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}>{s.n}</span>
                <span className="text-xs" style={{ color: "#6B6F9A" }}>{s.sub}</span>
                {i < 2 && <span className="ml-2" style={{ color: "rgba(255,255,255,0.08)", fontSize: "1.2rem" }}>|</span>}
              </div>
            ))}
          </motion.div>

          {/* What you get checklist */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {[
              { icon: "🗺️", text: "Week-by-week 180-day roadmap" },
              { icon: "🔥", text: "Myth busters backed by science" },
              { icon: "🎯", text: "Personal calorie & protein targets" },
              { icon: "🛠️", text: "Toolkit matched to your goal" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-sm shrink-0">{item.icon}</span>
                <span className="text-xs font-medium" style={{ color: "#D8DBFC" }}>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.45 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              type="button"
              onClick={onNext}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative self-start px-8 py-4 rounded-2xl font-black text-base overflow-hidden"
              style={{ ...glassButton(), color: "#05050B" }}
            >
              <motion.div
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
              />
              <span className="relative z-10 flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Let's Build Your Plan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </motion.button>
            <p className="text-xs" style={{ color: "#6B6F9A" }}>4 questions · Under 60 seconds · No account needed</p>
          </motion.div>
        </div>

        {/* ── RIGHT: Floating Plan Preview Cards ── */}
        <div className="relative order-1 lg:order-2 h-[340px] sm:h-[420px] lg:h-[580px] w-full">

          {/* Central glow orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: 320, height: 320, background: "radial-gradient(circle, rgba(77,163,255,0.1) 0%, rgba(167,139,250,0.06) 40%, transparent 70%)", filter: "blur(40px)", borderRadius: "50%" }}
          />

          {/* ── CARD 1: Men's Beginner Plan ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -5 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
            style={{
              position: "absolute",
              top: "4%",
              left: "0%",
              width: "62%",
              rotate: -5,
              zIndex: 10,
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div style={{ ...glassCard("#4DA3FF", 1), borderRadius: 20, padding: "16px 18px" }}>
                {/* Card header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(77,163,255,0.15)", border: "1px solid rgba(77,163,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 14 }}>💪</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#4DA3FF", letterSpacing: "0.06em", textTransform: "uppercase" }}>Men · Beginner</p>
                      <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#F5F7FA" }}>Fat Loss Plan</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.55rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(74,222,128,0.12)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>WEEK 1</span>
                </div>
                {/* Exercises */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                  {[
                    { name: "Goblet Squat", sets: "3×12" },
                    { name: "Bench Press", sets: "3×10" },
                    { name: "Barbell Row", sets: "3×12" },
                    { name: "Deadlift", sets: "3×8" },
                  ].map((ex, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#4DA3FF", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.68rem", color: "#D8DBFC" }}>{ex.name}</span>
                      </div>
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#66E6FF" }}>{ex.sets}</span>
                    </div>
                  ))}
                </div>
                {/* Footer */}
                <div style={{ borderTop: "1px solid rgba(77,163,255,0.12)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "0.58rem", color: "#6B6F9A" }}>Daily Target</p>
                    <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#4DA3FF" }}>2,340 kcal</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.58rem", color: "#6B6F9A" }}>Protein</p>
                    <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#66E6FF" }}>140g / day</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── CARD 2: Women's Plan ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 90 }}
            style={{
              position: "absolute",
              top: "28%",
              right: "0%",
              width: "58%",
              zIndex: 11,
            }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              <div style={{ ...glassCard("#FF69B4", 1), borderRadius: 20, padding: "16px 18px" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,105,180,0.15)", border: "1px solid rgba(255,105,180,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 14 }}>✨</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#FF69B4", letterSpacing: "0.06em", textTransform: "uppercase" }}>Women · Beginner</p>
                      <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#F5F7FA" }}>Fat Loss Plan</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.55rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(255,105,180,0.12)", color: "#FF69B4", border: "1px solid rgba(255,105,180,0.2)" }}>WEEK 1</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                  {[
                    { name: "Hip Thrust", sets: "3×15" },
                    { name: "Goblet Squat", sets: "3×12" },
                    { name: "Lat Pulldown", sets: "3×12" },
                    { name: "Romanian DL", sets: "3×12" },
                  ].map((ex, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF69B4", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.68rem", color: "#D8DBFC" }}>{ex.name}</span>
                      </div>
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#FFB6C1" }}>{ex.sets}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid rgba(255,105,180,0.12)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "0.58rem", color: "#6B6F9A" }}>Daily Target</p>
                    <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#FF69B4" }}>1,890 kcal</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.58rem", color: "#6B6F9A" }}>Protein</p>
                    <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#FFB6C1" }}>112g / day</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── CARD 3: 180-Day Journey ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ delay: 0.7, duration: 0.6, type: "spring", stiffness: 80 }}
            style={{
              position: "absolute",
              bottom: "3%",
              left: "8%",
              width: "68%",
              zIndex: 12,
            }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <div style={{ ...glassCard("#A78BFA", 0.9), borderRadius: 20, padding: "14px 18px" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 14 }}>🗺️</span>
                  <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#F5F7FA" }}>Your 180-Day Journey</p>
                </div>
                {[
                  { phase: "Month 1–2", label: "Foundation", w: "30%", color: "#4DA3FF" },
                  { phase: "Month 3–4", label: "Strength", w: "55%", color: "#A78BFA" },
                  { phase: "Month 5–6", label: "Optimized", w: "85%", color: "#66E6FF" },
                ].map((p, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.6rem", color: "#9A9EC4" }}>{p.phase}</span>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: p.color }}>{p.label}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: p.w }}
                        transition={{ delay: 0.9 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${p.color}, ${p.color}80)`, boxShadow: `0 0 8px ${p.color}50` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Floating badge: Science-backed ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            style={{ position: "absolute", top: "18%", right: "2%", zIndex: 13 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [3, 5, 3] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div style={{ ...glassCard("#4ADE80", 0.85), borderRadius: 14, padding: "8px 12px" }}>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4ADE80", letterSpacing: "0.06em" }}>✦ SCIENCE-BACKED</p>
                <p style={{ fontSize: "0.55rem", color: "#9A9EC4", marginTop: 2 }}>Reddit + Research verified</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Floating badge: Free ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
            style={{ position: "absolute", top: "6%", right: "5%", zIndex: 9 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <div style={{ ...glassCard("#4DA3FF", 0.75), borderRadius: 14, padding: "8px 12px" }}>
                <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#4DA3FF" }}>100% Free</p>
                <p style={{ fontSize: "0.55rem", color: "#6B6F9A", marginTop: 1 }}>No hidden charges</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — GENDER
// ─────────────────────────────────────────────────────────────────────────────
function GenderStep({ value, onChange }: { value: Gender | null; onChange: (g: Gender) => void }) {
  return (
    <div className="text-center">
      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#6B6F9A" }}>Step 1 of 4</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-3xl md:text-4xl font-black mb-2" style={{ color: "#F5F7FA" }}>
        Who is this plan for?
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm mb-10" style={{ color: "#9A9EC4" }}>
        Everything — exercises, calories, content — will be personalized for you.
      </motion.p>

      <div className="grid grid-cols-2 gap-4">
        {(["men", "women"] as Gender[]).map((g, i) => {
          const isMen = g === "men";
          const ca = isMen ? "#4DA3FF" : "#FF69B4";
          const cb = isMen ? "#66E6FF" : "#FFB6C1";
          const selected = value === g;
          return (
            <motion.button
              key={g}
              type="button"
              onClick={() => onChange(g)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 py-12 px-6"
              style={{
                background: selected ? `linear-gradient(145deg, ${ca}18, ${cb}08)` : "rgba(255,255,255,0.02)",
                border: `2px solid ${selected ? ca : "rgba(255,255,255,0.08)"}`,
                boxShadow: selected ? `0 0 40px ${ca}30, inset 0 1px 0 ${ca}20` : "none",
                cursor: "pointer",
              }}
            >
              {/* glow orb */}
              {selected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${ca}15, transparent 65%)` }}
                />
              )}

              {/* check */}
              {selected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ca}, ${cb})` }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#05050B" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </motion.div>
              )}

              <span className="text-5xl">{isMen ? "💪" : "✨"}</span>
              <div>
                <p className="text-xl font-black mb-1" style={{ color: selected ? ca : "#F5F7FA" }}>{isMen ? "Men" : "Women"}</p>
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: selected ? cb : "#6B6F9A" }}>{isMen ? "Built Different" : "Glow Up"}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — LEVEL (the exciting one — shows all 3 with aspiration)
// ─────────────────────────────────────────────────────────────────────────────
const LEVELS: { value: Level; emoji: string; title: string; duration: string; tag: string; preview: string[]; teaser?: string }[] = [
  {
    value: "beginner",
    emoji: "🌱",
    title: "Beginner",
    duration: "0 – 12 months",
    tag: "Full roadmap included",
    preview: ["Week-by-week 180-day plan", "Top myths busted with science", "Compound lifts guide", "Maintenance calories calculated"],
  },
  {
    value: "intermediate",
    emoji: "🔥",
    title: "Intermediate",
    duration: "1 – 3 years",
    tag: "Advanced techniques",
    preview: ["Periodization strategies", "RPE-based training", "Volume & frequency optimization", "Plateau breaking methods"],
    teaser: "Beginners unlock this after 6–12 months of consistent training.",
  },
  {
    value: "advanced",
    emoji: "⚡",
    title: "Advanced",
    duration: "3+ years",
    tag: "Elite programming",
    preview: ["Full isolation exercise library", "BFR & myo-rep techniques", "Annual periodization plan", "1RM benchmarks & targets"],
    teaser: "This is where the top 1% operate. Requires 3+ years of structured training.",
  },
];

function LevelStep({ value, onChange, accent, accentB, glow }: {
  value: Level | null; onChange: (l: Level) => void; accent: string; accentB: string; glow: string;
}) {
  const [hovered, setHovered] = useState<Level | null>(null);

  return (
    <div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold tracking-widest uppercase mb-3 text-center" style={{ color: "#6B6F9A" }}>Step 2 of 4</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "#F5F7FA" }}>
        Your experience level?
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm mb-8 text-center" style={{ color: "#9A9EC4" }}>
        Be honest — wrong level means wrong plan. See what each level gets you.
      </motion.p>

      <div className="flex flex-col gap-3">
        {LEVELS.map((lvl, i) => {
          const selected = value === lvl.value;
          const isHovered = hovered === lvl.value;
          const active = selected || isHovered;

          return (
            <motion.button
              key={lvl.value}
              type="button"
              onClick={() => onChange(lvl.value)}
              onHoverStart={() => setHovered(lvl.value)}
              onHoverEnd={() => setHovered(null)}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative rounded-2xl overflow-hidden text-left"
              style={
                selected
                  ? { ...glassCardSelected(accent, accentB), cursor: "pointer" }
                  : active
                  ? { ...glassCard(accent, 0.7), cursor: "pointer" }
                  : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }
              }
            >
              <div className="p-4 flex gap-4">
                {/* Emoji + title */}
                <div className="shrink-0 text-3xl mt-0.5">{lvl.emoji}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-base font-black" style={{ color: selected ? accent : "#F5F7FA" }}>{lvl.title}</span>
                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full" style={{ background: selected ? `${accent}20` : "rgba(255,255,255,0.06)", color: selected ? accentB : "#6B6F9A", border: `1px solid ${selected ? `${accent}35` : "rgba(255,255,255,0.08)"}` }}>
                      {lvl.duration}
                    </span>
                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                      {lvl.tag}
                    </span>
                  </div>

                  {/* Preview items — always visible */}
                  <AnimatePresence>
                    {(active || selected) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 mb-2">
                          {lvl.preview.map((item, pi) => (
                            <div key={pi} className="flex items-start gap-1.5">
                              <span className="text-[0.6rem] mt-0.5" style={{ color: accent }}>✦</span>
                              <span className="text-[0.68rem] leading-tight" style={{ color: "#D8DBFC" }}>{item}</span>
                            </div>
                          ))}
                        </div>
                        {lvl.teaser && (
                          <p className="text-[0.65rem] mt-1 italic" style={{ color: "#6B6F9A" }}>{lvl.teaser}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapsed hint */}
                  {!active && !selected && (
                    <p className="text-xs" style={{ color: "#6B6F9A" }}>Hover to see what's included →</p>
                  )}
                </div>

                {selected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ background: `linear-gradient(135deg, ${accent}, ${accentB})` }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#05050B" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Aspiration note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-5 rounded-xl p-3.5 flex items-start gap-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="text-base shrink-0">🎯</span>
        <p className="text-xs leading-relaxed" style={{ color: "#9A9EC4" }}>
          <span style={{ color: "#F5F7FA", fontWeight: 700 }}>Start where you are, not where you want to be.</span>{" "}
          Most beginners who follow the full roadmap are ready for intermediate content within 8–12 months.
        </p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — GOAL
// ─────────────────────────────────────────────────────────────────────────────
const GOALS_MEN = [
  { value: "fat-loss" as Goal, emoji: "🔥", title: "Burn Fat", sub: "Lose fat, keep every gram of muscle", copy: "Weight training + strategic deficit. The right way to cut — not starve and do cardio." },
  { value: "muscle-gain" as Goal, emoji: "💪", title: "Build Muscle", sub: "Get bigger, get stronger", copy: "Progressive overload + slight surplus. Compound lifts as the foundation. Real size, real strength." },
  { value: "maintain" as Goal, emoji: "⚖️", title: "Recompose", sub: "Same weight, completely different body", copy: "Maintenance calories + training. Swap fat for muscle. The transformation you can't see on a scale." },
];
const GOALS_WOMEN = [
  { value: "fat-loss" as Goal, emoji: "✨", title: "Fat Loss", sub: "Lean, toned, and glowing", copy: "Resistance training + slight deficit. Build the shaped, sculpted look — not just skinny." },
  { value: "muscle-gain" as Goal, emoji: "🌸", title: "Build & Tone", sub: "Shape, definition, curves", copy: "Progressive overload + slight surplus. Hip thrusts, squats, rows. The physique most women actually want." },
  { value: "maintain" as Goal, emoji: "💎", title: "Glow Up", sub: "Transform without the scale moving", copy: "Maintenance calories + training. Dramatic body composition change. Same weight, entirely new you." },
];

function GoalStep({ value, onChange, isWomen, accent, accentB, glow }: {
  value: Goal | null; onChange: (g: Goal) => void; isWomen: boolean; accent: string; accentB: string; glow: string;
}) {
  const goals = isWomen ? GOALS_WOMEN : GOALS_MEN;
  return (
    <div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold tracking-widest uppercase mb-3 text-center" style={{ color: "#6B6F9A" }}>Step 3 of 4</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "#F5F7FA" }}>
        What's your goal?
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm mb-8 text-center" style={{ color: "#9A9EC4" }}>
        Your training split, calories, and entire plan change based on this.
      </motion.p>

      <div className="flex flex-col gap-3">
        {goals.map((g, i) => {
          const selected = value === g.value;
          return (
            <motion.button
              key={g.value}
              type="button"
              onClick={() => onChange(g.value)}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.09, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative rounded-2xl p-5 text-left overflow-hidden"
              style={
                selected
                  ? { ...glassCardSelected(accent, accentB), cursor: "pointer" }
                  : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }
              }
            >
              {selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 50%, ${accent}10, transparent 60%)` }} />}
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{g.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-base font-black" style={{ color: selected ? accent : "#F5F7FA" }}>{g.title}</span>
                    {selected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}, ${accentB})` }}><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#05050B" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></motion.div>}
                  </div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: selected ? accentB : "#6B6F9A" }}>{g.sub}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#9A9EC4" }}>{g.copy}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — STATS
// ─────────────────────────────────────────────────────────────────────────────
function StatsStep({ form, errors, onChange, onSubmit, accent, accentB, glow, isWomen }: {
  form: Form;
  errors: Partial<Record<keyof Form, string>>;
  onChange: (p: Partial<Form>) => void;
  onSubmit: () => void;
  accent: string; accentB: string; glow: string; isWomen: boolean;
}) {
  const fields: { key: keyof Pick<Form, "age" | "weight" | "height">; label: string; unit: string; placeholder: string; why: string }[] = [
    { key: "age", label: "Age", unit: "years", placeholder: "e.g. 25", why: "Affects your BMR" },
    { key: "weight", label: "Current Weight", unit: "kg", placeholder: "e.g. 70", why: "Calorie target" },
    { key: "height", label: "Height", unit: "cm", placeholder: "e.g. 175", why: "Calorie target" },
  ];

  return (
    <div className="max-w-md mx-auto">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold tracking-widest uppercase mb-3 text-center" style={{ color: "#6B6F9A" }}>Step 4 of 4</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: "#F5F7FA" }}>
        Almost there.
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm mb-3 text-center" style={{ color: "#9A9EC4" }}>
        These three numbers calculate your personal calorie target and protein goal.
      </motion.p>

      {/* Sandy.Lifts notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="flex items-start gap-3 rounded-2xl p-4 mb-6"
        style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-xs leading-relaxed" style={{ color: accentB }}>
          <span className="font-bold">Sandy.Lifts doesn't create generic plans.</span>{" "}
          Without your stats, we can't calculate maintenance calories — and without that, the plan is just guesswork.
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {fields.map((field, i) => (
          <motion.div key={field.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 + i * 0.07 }}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold" style={{ color: "#D8DBFC" }}>{field.label}</label>
              <span className="text-[0.65rem]" style={{ color: "#6B6F9A" }}>{field.why}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => onChange({ [field.key]: e.target.value })}
                className="w-full rounded-xl px-4 py-3.5 pr-16 text-sm font-medium outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${errors[field.key] ? "#FF4444" : form[field.key] ? accent : "rgba(255,255,255,0.1)"}`,
                  color: "#F5F7FA",
                  boxShadow: form[field.key] && !errors[field.key] ? `0 0 16px ${glow}` : "none",
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: form[field.key] ? accent : "#6B6F9A" }}>
                {field.unit}
              </span>
            </div>
            {errors[field.key] && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[0.68rem] mt-1.5" style={{ color: "#FF6666" }}>
                {errors[field.key]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={onSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full mt-7 py-4 rounded-2xl font-black text-base relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${accentB} 100%)`,
          color: "#05050B",
          boxShadow: [
            "inset 0 1.5px 0 rgba(255,255,255,0.55)",
            "inset 0 -2px 5px rgba(0,0,0,0.2)",
            `0 0 35px ${glow}`,
            `0 0 70px ${glow.replace("0.2", "0.1")}`,
            "0 8px 24px rgba(0,0,0,0.35)",
          ].join(", "),
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.div animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />
        <span className="relative z-10 flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Build My Personalized Plan
        </span>
      </motion.button>

      <p className="text-center text-[0.65rem] mt-3" style={{ color: "#6B6F9A" }}>
        Free · No account · Your data never leaves your device
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen({ accent, accentB, glow, isWomen }: { accent: string; accentB: string; glow: string; isWomen: boolean }) {
  const steps = [
    "Analyzing your stats...",
    "Calculating maintenance calories...",
    "Building your 180-day roadmap...",
    "Your plan is ready.",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#05050B" }}>
      <div className="pointer-events-none fixed inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)`, filter: "blur(60px)" }}
        />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center gap-6 px-6">
        {/* Spinner */}
        <div className="relative w-20 h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{ border: `3px solid transparent`, borderTopColor: accent, borderRightColor: accentB }}
          />
          <div className="absolute inset-2 rounded-full flex items-center justify-center" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={accent}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
        </div>

        <div>
          <motion.h2
            key="building"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black mb-2"
            style={{ color: "#F5F7FA" }}
          >
            Building your plan
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm" style={{ color: "#9A9EC4" }}>
            Personalizing every detail for you...
          </motion.p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.45, duration: 0.35 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.45 + 0.15, type: "spring" }}
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: i === steps.length - 1 ? `linear-gradient(135deg, ${accent}, ${accentB})` : `${accent}25`, border: `1px solid ${accent}40` }}
              >
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </motion.div>
              <span className="text-xs" style={{ color: i === steps.length - 1 ? accentB : "#9A9EC4" }}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
