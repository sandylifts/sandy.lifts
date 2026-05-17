"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FitnessPlan, BeginnerPlan, IntermediatePlan, AdvancedPlan } from "@/lib/plans/types";
import type { CalorieTargets } from "@/lib/plans/calculations";
import Link from "next/link";

interface Props {
  plan: FitnessPlan;
  calories: CalorieTargets;
  isWomen: boolean;
  displayName: string;
}

function MythCard({ myth, truth, accent, accentLight }: { myth: string; truth: string; accent: string; accentLight: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: open ? `${accent}10` : "rgba(255,255,255,0.02)",
        border: `1px solid ${open ? `${accent}30` : "rgba(255,255,255,0.08)"}`,
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="text-sm mt-0.5 shrink-0" style={{ color: open ? "#4ADE80" : "#FF6666" }}>
          {open ? "✅" : "❌"}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: open ? accentLight : "#D8DBFC" }}>
            {open ? "MYTH BUSTED" : myth}
          </p>
          <AnimatePresence>
            {open && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs leading-relaxed mt-2"
                style={{ color: "#9A9EC4" }}
              >
                {truth}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className="shrink-0 mt-0.5 transition-transform duration-200"
          style={{ color: "#6B6F9A", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </motion.div>
  );
}

function ExerciseTable({ exercises, accent }: { exercises: { name: string; sets: string; reps: string; note?: string }[]; accent: string }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <th className="text-left px-3 py-2.5 font-semibold" style={{ color: accent }}>Exercise</th>
            <th className="text-center px-3 py-2.5 font-semibold w-14" style={{ color: accent }}>Sets</th>
            <th className="text-center px-3 py-2.5 font-semibold w-16" style={{ color: accent }}>Reps</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr
              key={i}
              style={{
                borderBottom: i < exercises.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}
            >
              <td className="px-3 py-2.5">
                <p className="font-medium" style={{ color: "#D8DBFC" }}>{ex.name}</p>
                {ex.note && <p className="text-[0.63rem] mt-0.5" style={{ color: "#6B6F9A" }}>{ex.note}</p>}
              </td>
              <td className="text-center px-3 py-2.5 font-bold" style={{ color: "#F5F7FA" }}>{ex.sets}</td>
              <td className="text-center px-3 py-2.5" style={{ color: "#9A9EC4" }}>{ex.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BeginnerPlanDisplay({ plan, calories, isWomen, accent, accentLight }: {
  plan: BeginnerPlan;
  calories: CalorieTargets;
  isWomen: boolean;
  accent: string;
  accentLight: string;
}) {
  const [openPhase, setOpenPhase] = useState(0);
  const glow = isWomen ? "rgba(255,105,180,0.15)" : "rgba(77,163,255,0.15)";

  return (
    <div className="flex flex-col gap-8">

      {/* Calorie Summary */}
      <section>
        <SectionHeading accent={accent} icon="🎯" title="Your Calorie & Protein Targets" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Daily Calories", value: `${calories.target}`, unit: "kcal" },
            { label: "Maintenance", value: `${calories.maintenance}`, unit: "kcal" },
            { label: "Protein Target", value: `${calories.protein}g`, unit: "/day" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-3 text-center"
              style={{
                background: `linear-gradient(135deg, ${accent}12, ${accentLight}06)`,
                border: `1px solid ${accent}25`,
                boxShadow: `0 0 16px ${glow}`,
              }}
            >
              <p className="text-lg font-bold" style={{ color: accent }}>{stat.value}</p>
              <p className="text-[0.6rem] font-medium" style={{ color: accentLight }}>{stat.unit}</p>
              <p className="text-[0.62rem] mt-1" style={{ color: "#9A9EC4" }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-[0.7rem] mt-2 px-1" style={{ color: "#6B6F9A" }}>
          {calories.description}
        </p>
        <Link
          href="/tools/macro-calculator"
          className="inline-flex items-center gap-1.5 mt-2 text-[0.72rem] font-semibold hover:opacity-80 transition-opacity"
          style={{ color: accent }}
        >
          Get exact macros breakdown in our Macro Calculator →
        </Link>
      </section>

      {/* Myth Busters */}
      <section>
        <SectionHeading accent={accent} icon="💡" title="Myths You Need to Destroy First" />
        <p className="text-xs mb-4" style={{ color: "#9A9EC4" }}>Tap each to reveal the truth.</p>
        <div className="flex flex-col gap-2">
          {plan.myths.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <MythCard myth={m.myth} truth={m.truth} accent={accent} accentLight={accentLight} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Training Splits Explained */}
      <section>
        <SectionHeading accent={accent} icon="📊" title="Training Split Options — Which One For You?" />
        <div className="flex flex-col gap-3">
          {plan.splitExplainers.map((split, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl p-4"
              style={{
                background: split.recommended ? `${accent}10` : "rgba(255,255,255,0.02)",
                border: `1px solid ${split.recommended ? `${accent}30` : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold" style={{ color: split.recommended ? accent : "#D8DBFC" }}>
                      {split.name}
                    </span>
                    {split.recommended && (
                      <span
                        className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}
                      >
                        YOUR STARTING POINT
                      </span>
                    )}
                  </div>
                  <p className="text-[0.68rem] mt-0.5" style={{ color: accentLight }}>{split.frequency}</p>
                </div>
              </div>
              <p className="text-xs mb-1" style={{ color: "#9A9EC4" }}>{split.bestFor}</p>
              <p className="text-xs font-mono" style={{ color: "#6B6F9A" }}>{split.schedule}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 180-Day Roadmap */}
      <section>
        <SectionHeading accent={accent} icon="🗺️" title="Your 180-Day Roadmap" />
        <p className="text-xs mb-4" style={{ color: "#9A9EC4" }}>Tap a phase to expand the full plan.</p>
        <div className="flex flex-col gap-3">
          {plan.phases.map((phase, pi) => (
            <motion.div
              key={pi}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pi * 0.08 }}
              className="rounded-xl overflow-hidden"
              style={{
                border: `1px solid ${openPhase === pi ? `${accent}30` : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <button
                type="button"
                onClick={() => setOpenPhase(openPhase === pi ? -1 : pi)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left"
                style={{ background: openPhase === pi ? `${accent}10` : "rgba(255,255,255,0.02)" }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: openPhase === pi ? accent : "#D8DBFC" }}>
                    {phase.title}
                  </p>
                  <p className="text-[0.68rem] mt-0.5" style={{ color: "#9A9EC4" }}>{phase.duration} · {phase.goal}</p>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"
                  className="shrink-0 transition-transform duration-200"
                  style={{ transform: openPhase === pi ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              <AnimatePresence>
                {openPhase === pi && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-4 pb-4 pt-1 flex flex-col gap-5" style={{ borderTop: `1px solid ${accent}15` }}>
                      {phase.weeks.map((week, wi) => (
                        <div key={wi}>
                          <h4 className="text-xs font-bold mb-1" style={{ color: accentLight }}>
                            {week.week} — {week.focus}
                          </h4>
                          <div className="flex flex-col gap-3">
                            {week.schedule.map((day, di) => (
                              <div key={di} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" style={{ background: `${accent}20`, color: accent }}>{day.day}</span>
                                  <span className="text-xs font-semibold" style={{ color: "#D8DBFC" }}>{day.label}</span>
                                </div>
                                {day.exercises && day.exercises.length > 0 && (
                                  <ExerciseTable exercises={day.exercises} accent={accent} />
                                )}
                                {day.note && (
                                  <p className="text-[0.68rem] mt-2 flex items-start gap-1.5" style={{ color: "#9A9EC4" }}>
                                    <span style={{ color: accent }}>→</span> {day.note}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-2">
                            <div className="rounded-lg p-3" style={{ background: `${accent}08`, border: `1px solid ${accent}18` }}>
                              <p className="text-[0.65rem] font-bold mb-1" style={{ color: accentLight }}>🍽️ NUTRITION THIS WEEK</p>
                              <p className="text-xs" style={{ color: "#9A9EC4" }}>{week.nutrition}</p>
                            </div>
                            <div className="rounded-lg p-3" style={{ background: "rgba(255,165,0,0.06)", border: "1px solid rgba(255,165,0,0.15)" }}>
                              <p className="text-[0.65rem] font-bold mb-1" style={{ color: "#FFA500" }}>⚡ KEY RULE</p>
                              <p className="text-xs" style={{ color: "#9A9EC4" }}>{week.keyRule}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Principles */}
      <section>
        <SectionHeading accent={accent} icon="🔑" title="The Rules That Actually Matter" />
        <div className="flex flex-col gap-2">
          {plan.keyPrinciples.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#D8DBFC" }}>{p}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IntermediatePlanDisplay({ plan, accent, accentLight }: { plan: IntermediatePlan; accent: string; accentLight: string }) {
  return (
    <div className="flex flex-col gap-8">
      {plan.tips.map((section, si) => (
        <section key={si}>
          <SectionHeading accent={accent} icon="💡" title={section.category} />
          <div className="flex flex-col gap-2">
            {section.tips.map((tip, ti) => (
              <motion.div
                key={ti}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ti * 0.04 }}
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
                >
                  <span className="text-[0.55rem] font-bold" style={{ color: accent }}>{ti + 1}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#D8DBFC" }}>{tip}</p>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AdvancedPlanDisplay({ plan, accent, accentLight }: { plan: AdvancedPlan; accent: string; accentLight: string }) {
  const [openMuscle, setOpenMuscle] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {/* Tips */}
      {plan.tips.map((section, si) => (
        <section key={si}>
          <SectionHeading accent={accent} icon="⚡" title={section.category} />
          <div className="flex flex-col gap-2">
            {section.tips.map((tip, ti) => (
              <motion.div
                key={ti}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ti * 0.04 }}
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
                >
                  <span className="text-[0.55rem] font-bold" style={{ color: accent }}>{ti + 1}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#D8DBFC" }}>{tip}</p>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      {/* Isolation Library */}
      <section>
        <SectionHeading accent={accent} icon="🎯" title="Complete Isolation Exercise Library" />
        <p className="text-xs mb-4" style={{ color: "#9A9EC4" }}>Tap a muscle group to see all isolation exercises with coaching cues.</p>
        <div className="flex flex-col gap-2">
          {plan.isolationLibrary.map((group, gi) => (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05 }}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${openMuscle === group.muscle ? `${accent}30` : "rgba(255,255,255,0.08)"}` }}
            >
              <button
                type="button"
                onClick={() => setOpenMuscle(openMuscle === group.muscle ? null : group.muscle)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                style={{ background: openMuscle === group.muscle ? `${accent}10` : "rgba(255,255,255,0.02)" }}
              >
                <span className="text-sm font-bold" style={{ color: openMuscle === group.muscle ? accent : "#D8DBFC" }}>
                  {group.muscle}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[0.65rem]" style={{ color: "#6B6F9A" }}>{group.exercises.length} exercises</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"
                    className="transition-transform duration-200"
                    style={{ transform: openMuscle === group.muscle ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>
              <AnimatePresence>
                {openMuscle === group.muscle && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-4 pb-4 flex flex-col gap-2" style={{ borderTop: `1px solid ${accent}15` }}>
                      {group.exercises.map((ex, ei) => (
                        <div
                          key={ei}
                          className="rounded-lg p-3 mt-2"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <p className="text-xs font-bold mb-1" style={{ color: accentLight }}>{ex.name}</p>
                          <p className="text-[0.7rem] leading-relaxed" style={{ color: "#9A9EC4" }}>{ex.cue}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ accent, icon, title }: { accent: string; icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">{icon}</span>
      <h3 className="text-sm font-bold" style={{ color: "#F5F7FA" }}>{title}</h3>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${accent}30, transparent)` }} />
    </div>
  );
}

function ToolkitSection({ plan, accent, accentLight }: { plan: FitnessPlan; accent: string; accentLight: string }) {
  return (
    <section className="mt-2">
      <SectionHeading accent={accent} icon="🛠️" title="Sandy.Lifts Toolkit — Made for Your Plan" />
      <p className="text-xs mb-4" style={{ color: "#9A9EC4" }}>These tools are directly relevant to your goal. Use them alongside your plan.</p>
      <div className="flex flex-col gap-3">
        {plan.toolkitCTA.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              href={tool.href}
              className="flex items-center gap-4 rounded-xl p-4 group transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: `${accent}08`,
                border: `1px solid ${accent}20`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
                  {tool.icon === "calculator" && <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></>}
                  {tool.icon === "zap" && <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>}
                  {tool.icon === "leaf" && <path d="M17 8C8 10 5.9 16.17 3.82 19.34a8 8 0 0 0 10.55-10.55"/>}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: accentLight }}>{tool.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#9A9EC4" }}>{tool.description}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function PlanDisplay({ plan, calories, isWomen, displayName }: Props) {
  const accent = isWomen ? "#FF69B4" : "#4DA3FF";
  const accentLight = isWomen ? "#FFB6C1" : "#66E6FF";
  const glow = isWomen ? "rgba(255,105,180,0.12)" : "rgba(77,163,255,0.1)";

  return (
    <div>
      {/* Hero header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            color: accent,
            boxShadow: `0 0 20px ${glow}`,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill={accent}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          {displayName}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: "#F5F7FA" }}
        >
          Your{" "}
          <span style={{
            background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Personalized Plan
          </span>{" "}
          is Ready
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm"
          style={{ color: "#9A9EC4" }}
        >
          {"tagline" in plan ? plan.tagline : ""}
        </motion.p>
      </div>

      {/* Plan content */}
      {plan.type === "beginner" && (
        <BeginnerPlanDisplay
          plan={plan as BeginnerPlan}
          calories={calories}
          isWomen={isWomen}
          accent={accent}
          accentLight={accentLight}
        />
      )}
      {plan.type === "intermediate" && (
        <IntermediatePlanDisplay plan={plan as IntermediatePlan} accent={accent} accentLight={accentLight} />
      )}
      {plan.type === "advanced" && (
        <AdvancedPlanDisplay plan={plan as AdvancedPlan} accent={accent} accentLight={accentLight} />
      )}

      {/* Toolkit CTA */}
      <div className="mt-10">
        <ToolkitSection plan={plan} accent={accent} accentLight={accentLight} />
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 rounded-2xl p-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${accent}10, ${accentLight}06)`,
          border: `1px solid ${accent}20`,
          boxShadow: `0 0 40px ${glow}`,
        }}
      >
        <p className="text-lg font-bold mb-2" style={{ color: "#F5F7FA" }}>
          Questions about your plan?
        </p>
        <p className="text-sm mb-4" style={{ color: "#9A9EC4" }}>
          Ask our AI coach anything — exercise form, nutrition, schedule adjustments.
        </p>
        <Link
          href="/ai-coach"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
            color: "#05050B",
            boxShadow: `0 0 20px ${glow}`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8V4H8"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 8v8a4 4 0 01-8 0V8"/><line x1="12" y1="16" x2="12" y2="21"/></svg>
          Ask AI Coach →
        </Link>
      </motion.div>
    </div>
  );
}
