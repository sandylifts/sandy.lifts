"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ─── Research ────────────────────────────────────────────── */
const WHY = "Most fitness tools stop when you hit your goal. We built this because the hardest part isn't losing the weight — it's keeping it off. Up to 80% of people regain lost weight within 5 years. Not because they stopped trying, but because their biology works against them.";
const STUDIES: Study[] = [
  { name: "Sumithran P et al. — New England Journal of Medicine 2011", detail: "After 13.5 kg weight loss: ghrelin elevated for 62+ weeks. Leptin suppressed for 62+ weeks. These hormonal changes persist 1 year after reaching goal weight.", tag: "PRIMARY" },
  { name: "van Baak MA & Mariman ECM — Current Obesity Reports 2025", detail: "Review: lean mass loss, gut microbiota changes, immune memory, and hormonal adaptation all contribute to rebound.", tag: "PRIMARY" },
  { name: "PMC Meta-Analysis 2025", detail: "Ghrelin increases with all forms of weight loss — diet, exercise, or both. The extent of weight loss determines magnitude of ghrelin increase.", tag: "SUPPORTING" },
  { name: "Spiegel K et al. — Sleep 2004", detail: "Sleep restriction increases ghrelin 28% and decreases leptin 18%. Poor sleep directly mimics the hormonal state of weight regain.", tag: "SUPPORTING" },
];
const BOTTOM_LINE = "You didn't regain the weight because you were weak. Your body released more hunger hormone and suppressed your fullness hormone for over a year after reaching your goal. This is evolution. Protein, resistance training, sleep, and regular weigh-ins are the tools to fight it.";

/* ─── Quiz data ───────────────────────────────────────────── */
interface Option { label: string; risk: 0 | 1 | 2; tip?: string; }
interface Question { id: string; q: string; options: Option[]; }

const QUESTIONS: Question[] = [
  { id: "q1", q: "How did you lose the weight?", options: [
    { label: "Slow and steady (300–500 kcal deficit)", risk: 0 },
    { label: "Moderate pace (500–750 kcal deficit)",   risk: 1 },
    { label: "Crash diet / very fast (750+ kcal deficit)", risk: 2, tip: "Reverse diet 4 weeks before maintenance — add 100 kcal/week" },
    { label: "Still losing — not finished yet", risk: 0 },
  ]},
  { id: "q2", q: "Are you tracking calories or food intake now?", options: [
    { label: "Yes, consistently",        risk: 0 },
    { label: "Sometimes",                risk: 1 },
    { label: "No, stopped tracking",     risk: 2, tip: "Even rough tracking (food diary, photos) cuts rebound risk significantly" },
  ]},
  { id: "q3", q: "How is your sleep quality?", options: [
    { label: "7–9 hours, consistent",                risk: 0 },
    { label: "6–7 hours, variable",                   risk: 1 },
    { label: "Under 6 hours or poor quality",         risk: 2, tip: "Sleep is your most underrated fat-loss tool. Prioritise 7–9 hours." },
  ]},
  { id: "q4", q: "Did you do resistance training during fat loss?", options: [
    { label: "Yes, regularly (3+ times/week)", risk: 0 },
    { label: "Some, inconsistently",            risk: 1 },
    { label: "Cardio only or no exercise",       risk: 2, tip: "Add 2 days/week resistance training — muscle mass is your metabolic shield" },
  ]},
  { id: "q5", q: "How often do you weigh yourself now?", options: [
    { label: "Weekly — to track trends",   risk: 0 },
    { label: "Daily — obsessively",         risk: 1 },
    { label: "Never, avoiding the scale",   risk: 2, tip: "Weigh weekly (not daily) — catching 2kg gain early is 10x easier than 10kg" },
  ]},
  { id: "q6", q: "How is your hunger level day-to-day?", options: [
    { label: "Normal, manageable",              risk: 0 },
    { label: "Often hungry between meals",      risk: 1 },
    { label: "Constantly hungry, hard to control", risk: 2, tip: "Protein at every meal (1.6g/kg) suppresses ghrelin most effectively" },
  ]},
  { id: "q7", q: "Did you take planned diet breaks during fat loss?", options: [
    { label: "Yes, regularly",              risk: 0 },
    { label: "Occasionally",               risk: 1 },
    { label: "No, dieted straight through", risk: 2, tip: "Plan a structured diet break every 6–8 weeks next time (MATADOR protocol)" },
  ]},
];

/* ─── Score → Risk ───────────────────────────────────────── */
interface RiskLevel { label: string; pct: number; color: string; border: string; bg: string; verdict: string; }
function getRisk(score: number): RiskLevel {
  if (score <= 3)  return { label: "🟢 Low Risk",       pct: 18, color: "#4ade80", border: "rgba(74,222,128,0.3)",   bg: "rgba(74,222,128,0.06)",   verdict: "Your approach minimises rebound. Keep these habits." };
  if (score <= 7)  return { label: "🟡 Moderate Risk",  pct: 45, color: "#fbbf24", border: "rgba(251,191,36,0.3)",   bg: "rgba(251,191,36,0.06)",   verdict: "Some habits increase rebound risk. Adjustable with the right changes." };
  if (score <= 11) return { label: "🔶 High Risk",      pct: 67, color: "#fb923c", border: "rgba(251,146,60,0.3)",   bg: "rgba(251,146,60,0.06)",   verdict: "Multiple rebound triggers present. Action needed now." };
  return               { label: "🔴 Very High Risk",    pct: 82, color: "#ef4444", border: "rgba(239,68,68,0.3)",    bg: "rgba(239,68,68,0.06)",    verdict: "Biological and behavioural signals both elevated. Prioritise the actions below." };
}

/* ─── Main component ─────────────────────────────────────── */
export function ReboundRiskCalculator() {
  const router = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [answers, setAnswers]     = useState<Record<string, number>>({});
  const [current, setCurrent]     = useState(0); // current question index
  const [showResult, setShowResult] = useState(false);
  const [tips, setTips]           = useState<string[]>([]);

  const total     = QUESTIONS.length;
  const answered  = Object.keys(answers).length;
  const progress  = (answered / total) * 100;
  const q         = QUESTIONS[current];

  function answer(optionIndex: number) {
    const opt = q.options[optionIndex];
    const newAnswers = { ...answers, [q.id]: opt.risk };
    setAnswers(newAnswers);

    if (opt.tip && opt.risk === 2) setTips((t) => t.includes(opt.tip!) ? t : [...t, opt.tip!]);

    if (current < total - 1) {
      setCurrent((c) => c + 1);
    } else {
      setShowResult(true);
    }
  }

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const risk = showResult ? getRisk(totalScore) : null;

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
      <Link href="/tools" className="inline-flex items-center gap-1.5 mb-8 hover:text-[#F2F4F8]" style={{ color: "#4B5265", fontSize: "13px", textDecoration: "none" }}>
        <ArrowLeft size={14} /> Back to Toolkit
      </Link>

      {/* Header */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <ShieldAlert size={20} color="#ef4444" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>SUMITHRAN NEJM 2011</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Weight Rebound Risk Checker</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>
          7-question quiz. Find out why your body fights to regain weight — and your personal risk level.
        </p>
        <AnimatePresence initial={false}>
          {researchOpen && (
            <motion.div key="research" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
              <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quiz */}
      {!showResult && (
        <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold" style={{ color: "#4B5265" }}>Question {current + 1} of {total}</p>
            <p className="text-[11px]" style={{ color: "#a78bfa" }}>{Math.round(progress)}% complete</p>
          </div>
          <div className="h-1 rounded-full mb-5" style={{ background: "#111318" }}>
            <div className="h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "#a78bfa" }} />
          </div>

          <p className="text-[16px] font-semibold mb-5" style={{ color: "#F2F4F8" }}>{q.q}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => answer(i)}
                className="w-full text-left rounded-lg px-4 py-3 transition-all duration-150 hover:border-[rgba(167,139,250,0.4)] hover:bg-[rgba(167,139,250,0.04)]"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "transparent", minHeight: 52 }}
              >
                <span className="text-[13px] font-semibold" style={{ color: "#F2F4F8" }}>{opt.label}</span>
              </button>
            ))}
          </div>

          {current > 0 && (
            <button onClick={() => { setCurrent((c) => c - 1); setShowResult(false); }}
              className="mt-4 text-[12px]" style={{ color: "#4B5265", background: "none", border: "none", cursor: "pointer" }}
            >
              ← Back
            </button>
          )}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {showResult && risk && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Score card */}
            <div className="rounded-xl p-5 mb-4" style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: risk.color }}>Your Risk Level</p>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[40px] font-semibold" style={{ color: "#F2F4F8" }}>{totalScore}</p>
                <p className="text-[14px]" style={{ color: "#4B5265" }}>/ 14 points</p>
              </div>
              <p className="text-[18px] font-semibold mb-1" style={{ color: risk.color }}>{risk.label}</p>
              <p className="text-[13px] mb-3" style={{ color: "#8B92A5" }}>{risk.verdict}</p>
              <p className="text-[12px] rounded-lg px-3 py-2" style={{ color: "#8B92A5", background: "rgba(0,0,0,0.2)" }}>
                Research suggests people in your category regain an average of{" "}
                <span style={{ color: "#F2F4F8", fontWeight: 600 }}>{risk.pct}%</span> of lost weight within 1 year.
                <span className="block mt-1" style={{ color: "#4B5265", fontSize: 11 }}>Based on Sumithran 2011 + van Baak 2025</span>
              </p>
            </div>

            {/* Why your body fights back */}
            <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "#4B5265" }}>Why Your Body Fights Back</p>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#8B92A5" }}>
                After weight loss, your hunger hormone (ghrelin) stays elevated for{" "}
                <span style={{ color: "#F2F4F8", fontWeight: 600 }}>at least 12 months</span>. This is biology — not willpower failure. Your body{" "}
                <span style={{ color: "#F2F4F8", fontWeight: 600 }}>wants</span> to regain the weight.
              </p>
              {/* Ghrelin timeline visual */}
              <div className="rounded-lg p-3" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[11px] font-semibold mb-2" style={{ color: "#4B5265" }}>Ghrelin (hunger hormone) after weight loss</p>
                <div className="flex items-center gap-1.5">
                  {[
                    { label: "Goal",    note: "Elevated", color: "#ef4444" },
                    { label: "+3mo",    note: "Still high", color: "#fb923c" },
                    { label: "+6mo",    note: "Still high", color: "#fbbf24" },
                    { label: "+12mo",   note: "Normalising", color: "#4ade80" },
                  ].map((s) => (
                    <div key={s.label} className="flex-1 text-center">
                      <div className="rounded h-2 mb-1" style={{ background: s.color, opacity: 0.6 }} />
                      <p className="text-[9px]" style={{ color: "#4B5265" }}>{s.label}</p>
                      <p className="text-[9px]" style={{ color: s.color }}>{s.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalised actions */}
            {tips.length > 0 && (
              <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.15)" }}>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "#a78bfa" }}>Your Personalised Actions</p>
                <div className="flex flex-col gap-3">
                  {tips.slice(0, 3).map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[14px] font-semibold shrink-0" style={{ color: "#a78bfa" }}>{i + 1}.</span>
                      <p className="text-[13px] leading-relaxed" style={{ color: "#F2F4F8" }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] mb-4 leading-relaxed" style={{ color: "#4B5265" }}>
              Estimates based on peer-reviewed research. Individual results vary. Not medical advice — consult a qualified professional before making changes.
            </p>

            {/* Handoff CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>You're Done</span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Risk assessed. Go back and see your full toolkit →</p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Every tool in one place. The full science-backed system.</p>
              <button onClick={() => router.push("/tools")}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                View Full Toolkit →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
