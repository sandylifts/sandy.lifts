"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Coffee } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ─── Research ────────────────────────────────────────────── */
const WHY = "When you diet continuously, your body fights back — it slows your metabolism, increases hunger hormones, and reduces spontaneous movement (NEAT). This is called adaptive thermogenesis. A planned diet break at maintenance calories reverses these adaptations. It is not cheating. It is science.";

const STUDIES: Study[] = [
  { name: "Byrne NM et al. — International Journal of Obesity 2017 (MATADOR Study)", detail: "51 obese men. 2 weeks deficit, 2 weeks maintenance. Result: 47% greater fat loss vs continuous restriction. Adaptive thermogenesis only in continuous group.", tag: "PRIMARY" },
  { name: "Henselmans M et al. — J Hum Kinet 2023", detail: "Intermittent energy restriction attenuates fat-free mass loss in resistance-trained individuals. Refeed group preserved significantly more lean mass.", tag: "SUPPORTING" },
  { name: "BREAK Study Protocol — PMC 2023", detail: "IER using energy balance refeeds is a viable strategy to reduce adaptive thermogenesis and improve weight loss efficiency.", tag: "SUPPORTING" },
  { name: "Camps SGP et al. — Am J Clin Nutr 2013", detail: "Adaptive thermogenesis: metabolism slows beyond what body composition change predicts. A diet break reverses this within 7–14 days.", tag: "SUPPORTING" },
];

const BOTTOM_LINE = "Dieting for more than 8 weeks without a break causes your body to adapt — burning fewer calories, feeling hungrier, and making fat loss harder. Taking 1–2 weeks at maintenance every 6–8 weeks is not lazy. It is literally the scientifically proven way to lose more fat.";

/* ─── Feeling options ─────────────────────────────────────── */
type Feeling = "good" | "plateau" | "fatigued" | "lost";
const FEELING_OPTS: { id: Feeling; label: string }[] = [
  { id: "good",     label: "Still losing weight, feeling good" },
  { id: "plateau",  label: "Weight has plateaued for 2+ weeks" },
  { id: "fatigued", label: "Very fatigued, constantly hungry" },
  { id: "lost",     label: "Lost motivation, struggling to stick to plan" },
];

/* ─── Recommendation logic ────────────────────────────────── */
interface Recommendation {
  verdict:    "keep-going" | "optional" | "take-break" | "mandatory";
  title:      string;
  subtitle:   string;
  breakCals?: number;
  breakWeeks: number;
  color:      string;
  border:     string;
  bg:         string;
}

function getRecommendation(weeks: number, feeling: Feeling, maintenance: number): Recommendation {
  const breakCals = maintenance || 2000;
  if (weeks < 4) return { verdict: "keep-going", title: "Too Early — Keep Going", subtitle: "You haven't dieted long enough to need a break. Check back after week 4.", breakWeeks: 0, color: "#4ade80", border: "rgba(74,222,128,0.3)", bg: "rgba(74,222,128,0.06)" };
  if (weeks >= 12) return { verdict: "mandatory", title: "Mandatory Break — Take it Now", subtitle: "Adaptive thermogenesis is active. Your metabolism is fighting you. A 2-week break is non-negotiable.", breakCals, breakWeeks: 2, color: "#ef4444", border: "rgba(239,68,68,0.3)", bg: "rgba(239,68,68,0.06)" };
  if (weeks >= 8)  return { verdict: "take-break", title: "Schedule a Break Immediately", subtitle: "You're past the safe window. A 1–2 week break now will improve total fat loss.", breakCals, breakWeeks: 2, color: "#fb923c", border: "rgba(251,146,60,0.3)", bg: "rgba(251,146,60,0.06)" };
  if (feeling === "plateau" || feeling === "fatigued" || feeling === "lost") return { verdict: "take-break", title: "Take a Break — Now", subtitle: "Your body is showing signs of adaptive thermogenesis. A 1-week break resets this.", breakCals, breakWeeks: 1, color: "#fbbf24", border: "rgba(251,191,36,0.3)", bg: "rgba(251,191,36,0.06)" };
  return { verdict: "optional", title: "Optional Break at Week 8", subtitle: "You're doing well. A break at week 8 is recommended but not urgent yet.", breakCals, breakWeeks: 1, color: "#4ade80", border: "rgba(74,222,128,0.3)", bg: "rgba(74,222,128,0.06)" };
}

/* ─── Main component ─────────────────────────────────────── */
export function DietBreakCalculator() {
  const profile = useBodyProfile();
  const router  = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState({ weeks: "" as string, deficit: "", maintenance: "", feeling: "" as Feeling | "" });
  const [result, setResult] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm((p) => ({
      ...p,
      maintenance: profile.maintenance_kcal ? String(Math.round(profile.maintenance_kcal)) : p.maintenance,
    }));
  }, [profile]);

  function calculate() {
    const w = parseInt(form.weeks);
    if (!w || !form.feeling) return;
    const m = parseFloat(form.maintenance) || 0;
    setResult(getRecommendation(w, form.feeling as Feeling, m));
  }

  const canCalc = !!form.weeks && !!form.feeling;
  const r = result;

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
      <Link href="/tools" className="inline-flex items-center gap-1.5 mb-8 hover:text-[#F2F4F8]" style={{ color: "#4B5265", fontSize: "13px", textDecoration: "none" }}>
        <ArrowLeft size={14} /> Back to Toolkit
      </Link>

      {/* Header */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(195,252,254,0.08)", border: "1px solid rgba(195,252,254,0.2)" }}>
              <Coffee size={20} color="#C3FCFE" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(195,252,254,0.08)", color: "#C3FCFE", border: "1px solid rgba(195,252,254,0.2)" }}>LIVE</span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>MATADOR STUDY 2017</span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Diet Break Calculator</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>
          Know exactly when to take a strategic diet break. The MATADOR study proved intermittent restriction loses 47% more fat.
        </p>
        <AnimatePresence initial={false}>
          {researchOpen && (
            <motion.div key="research" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
              <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Situation</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Weeks Continuously Dieting</label>
            <input type="number" min={1} max={52} placeholder="e.g. 6"
              value={form.weeks}
              onChange={(e) => setForm((p) => ({ ...p, weeks: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Maintenance Calories (kcal/day)</label>
            <input type="number" min={800} max={6000} placeholder="e.g. 2200"
              value={form.maintenance}
              onChange={(e) => setForm((p) => ({ ...p, maintenance: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-[12px] font-semibold mb-2" style={{ color: "#8B92A5" }}>How Are You Feeling Right Now?</label>
          <div className="flex flex-col gap-2">
            {FEELING_OPTS.map((o) => (
              <button key={o.id} onClick={() => setForm((p) => ({ ...p, feeling: o.id }))}
                className="w-full text-left rounded-lg px-3 py-3 transition-all duration-150"
                style={{ border: form.feeling === o.id ? "1px solid rgba(195,252,254,0.4)" : "1px solid rgba(255,255,255,0.07)", background: form.feeling === o.id ? "rgba(195,252,254,0.06)" : "transparent", minHeight: 48 }}
              >
                <span className="text-[13px] font-semibold" style={{ color: form.feeling === o.id ? "#C3FCFE" : "#F2F4F8" }}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={calculate} disabled={!canCalc}
          className="w-full rounded-lg text-[14px] font-semibold transition-opacity duration-200"
          style={{ background: "#C3FCFE", color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed", borderRadius: 8 }}
        >
          Get My Diet Break Plan →
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {r && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="rounded-xl p-5 mb-4" style={{ background: r.bg, border: `1px solid ${r.border}` }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: r.color }}>{r.verdict === "keep-going" ? "✅" : r.verdict === "optional" ? "🟡" : r.verdict === "mandatory" ? "🔴" : "⚠️"} Recommendation</p>
              <p className="text-[18px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>{r.title}</p>
              <p className="text-[13px]" style={{ color: "#8B92A5" }}>{r.subtitle}</p>
            </div>

            {r.breakWeeks > 0 && r.breakCals && (
              <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Break Plan</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Break Duration", value: `${r.breakWeeks} week${r.breakWeeks > 1 ? "s" : ""}`, color: "#C3FCFE" },
                    { label: "Break Calories",  value: `${r.breakCals} kcal/day`, color: "#F2F4F8" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[20px] font-semibold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Motivational frame */}
                <div className="rounded-lg p-4" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <p className="text-[13px] font-semibold mb-1" style={{ color: "#a78bfa" }}>This is not failure. This is strategy.</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "#8B92A5" }}>
                    The MATADOR study found diet breaks led to <span style={{ color: "#F2F4F8", fontWeight: 600 }}>47% more fat loss</span> than continuous restriction over the same period.
                  </p>
                </div>

                <p className="text-[11px] mt-4 leading-relaxed" style={{ color: "#4B5265" }}>
                  Estimates based on peer-reviewed research. Individual results vary. Not medical advice — consult a qualified professional before making changes.
                </p>
              </div>
            )}

            {/* Handoff CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl p-5" style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>Next Step</span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>Diet break plan ready. Check your rebound risk after reaching goal →</p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>Up to 80% of people regain lost weight. Find out your personal risk and how to prevent it.</p>
              <button onClick={() => router.push("/tools/rebound-risk?from=diet-break")}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                Check My Rebound Risk →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
