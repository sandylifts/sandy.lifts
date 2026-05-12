"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyProfile, saveBodyProfile } from "@/hooks/useBodyProfile";
import { IButtonTrigger, IButtonPanel } from "@/app/tools/_shared/IButtonPanel";
import type { Study } from "@/app/tools/_shared/IButtonPanel";

/* ─── Research content ───────────────────────────────────── */
const WHY =
  "Most calorie deficit tools just give you a number. We show you the risk zone that number puts you in — because going too fast costs you muscle, slows your metabolism, and sets you up for rebound. The science is clear on this.";

const STUDIES: Study[] = [
  {
    name: "Anyiam O et al. — Nutrients 2024 · 49 studies, 4,785 participants",
    detail: '"Muscle constitutes ~27% of total weight lost during severe caloric restriction"',
    tag: "PRIMARY",
  },
  {
    name: "Frontiers in Nutrition 2025 · Network meta-analysis, 62 RCTs, 4,429 participants",
    detail: '"Avoid energy deficits >500 kcal/day to preserve lean body mass during weight loss"',
    tag: "PRIMARY",
  },
  {
    name: "Murphy & Koehler — Scand J Med Sci Sports 2022",
    detail: '"Energy deficit impairs lean mass gains — 300–500 kcal is the optimal range"',
    tag: "SUPPORTING",
  },
  {
    name: "Hall KD et al. — NIH 2012",
    detail: '"Mathematical model: 7,700 kcal deficit = 1 kg fat loss"',
    tag: "SUPPORTING",
  },
];

const BOTTOM_LINE =
  "A 500 kcal/day deficit loses fat at ~0.5 kg/week and preserves muscle. Going to 1,000 kcal/day loses weight faster but 27% of that weight is muscle — and your metabolism slows to fight back. Slower is almost always smarter.";

/* ─── Zone definitions ───────────────────────────────────── */
type Zone = "safe" | "caution" | "danger" | "below";

const ZONES: Record<Zone, { label: string; color: string; border: string; bg: string; desc: string; detail: string }> = {
  below: {
    label: "Minimal Deficit",
    color: "#8B92A5",
    border: "rgba(139,146,165,0.3)",
    bg: "rgba(139,146,165,0.06)",
    desc: "Under 200 kcal/day — too small for consistent fat loss",
    detail: "Increase your deficit or extend your timeline for meaningful results.",
  },
  safe: {
    label: "🟢 Safe Zone",
    color: "#4ade80",
    border: "rgba(74,222,128,0.35)",
    bg: "rgba(74,222,128,0.06)",
    desc: "~0.2–0.5 kg fat loss per week",
    detail: "Muscle preserved · Metabolism stable · Sustainable long-term",
  },
  caution: {
    label: "🟡 Caution Zone",
    color: "#fbbf24",
    border: "rgba(251,191,36,0.35)",
    bg: "rgba(251,191,36,0.06)",
    desc: "~0.5–0.75 kg fat loss per week",
    detail: "Higher risk of muscle loss · Add resistance training · Protein ≥ 1.6 g/kg body weight",
  },
  danger: {
    label: "🔴 Danger Zone",
    color: "#ef4444",
    border: "rgba(239,68,68,0.35)",
    bg: "rgba(239,68,68,0.06)",
    desc: "Muscle loss is likely · Metabolism will adapt",
    detail: 'Research: ~27% of total weight lost will be muscle at this rate.',
  },
};

function getZone(deficit: number): Zone {
  if (deficit < 200) return "below";
  if (deficit <= 500) return "safe";
  if (deficit <= 750) return "caution";
  return "danger";
}

/* ─── Zone bar ───────────────────────────────────────────── */
const MAX_BAR = 1200; // kcal — visual cap

function ZoneBar({ deficit }: { deficit: number }) {
  const pct = Math.min(deficit / MAX_BAR, 1) * 100;
  return (
    <div className="mb-5">
      <div className="flex justify-between text-[10px] mb-1.5" style={{ color: "#4B5265" }}>
        <span>0</span>
        <span>200</span>
        <span>500</span>
        <span>750</span>
        <span>1200+ kcal/day</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden flex" style={{ background: "#111318" }}>
        {/* Gray zone 0–200 */}
        <div style={{ width: `${(200 / MAX_BAR) * 100}%`, background: "rgba(139,146,165,0.25)" }} />
        {/* Green 200–500 */}
        <div style={{ width: `${(300 / MAX_BAR) * 100}%`, background: "rgba(74,222,128,0.35)" }} />
        {/* Yellow 500–750 */}
        <div style={{ width: `${(250 / MAX_BAR) * 100}%`, background: "rgba(251,191,36,0.35)" }} />
        {/* Red 750–1200 */}
        <div style={{ flex: 1, background: "rgba(239,68,68,0.35)" }} />
        {/* User marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 rounded-full"
          style={{ left: `${pct}%`, background: "#F2F4F8", boxShadow: "0 0 4px rgba(242,244,248,0.6)" }}
        />
      </div>
      <div className="flex justify-between text-[10px] mt-1" style={{ color: "#4B5265" }}>
        <span style={{ color: "#8B92A5" }}>Minimal</span>
        <span style={{ color: "#4ade80" }}>Safe</span>
        <span style={{ color: "#fbbf24" }}>Caution</span>
        <span style={{ color: "#ef4444" }}>Danger</span>
      </div>
    </div>
  );
}

/* ─── Types ──────────────────────────────────────────────── */
interface Result {
  dailyDeficit:    number;
  dailyIntake:     number;
  weeklyLoss:      number;
  proteinFloor:    number;
  zone:            Zone;
  saferWeeks?:     number;
}

/* ─── Main component ─────────────────────────────────────── */
export function CalorieDeficitCalculator() {
  const profile = useBodyProfile();
  const router  = useRouter();

  const [researchOpen, setResearchOpen] = useState(false);
  const [form, setForm] = useState({ weight: "", maintenance: "", goalWeight: "", weeks: 12 });
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      ...prev,
      weight:      profile.weight_kg       ? String(Math.round(profile.weight_kg))       : prev.weight,
      maintenance: profile.maintenance_kcal ? String(Math.round(profile.maintenance_kcal)) : prev.maintenance,
    }));
  }, [profile]);

  function calculate() {
    const w    = parseFloat(form.weight);
    const m    = parseFloat(form.maintenance);
    const goal = parseFloat(form.goalWeight);
    const wks  = form.weeks;
    if (!w || !m || !goal || goal >= w) return;

    const totalDeficit  = (w - goal) * 7700;
    const dailyDeficit  = Math.round(totalDeficit / (wks * 7));
    const dailyIntake   = Math.round(m - dailyDeficit);
    const weeklyLoss    = parseFloat(((dailyDeficit * 7) / 7700).toFixed(2));
    const proteinFloor  = Math.round(w * 1.6);
    const zone          = getZone(dailyDeficit);
    const saferWeeks    = zone === "danger" ? Math.ceil(totalDeficit / 500 / 7) : undefined;

    const res: Result = { dailyDeficit, dailyIntake, weeklyLoss, proteinFloor, zone, saferWeeks };
    setResult(res);
    saveBodyProfile({ weight_kg: w, maintenance_kcal: m });
  }

  const canCalc = !!form.weight && !!form.maintenance && !!form.goalWeight &&
    parseFloat(form.goalWeight) < parseFloat(form.weight);

  const z = result ? ZONES[result.zone] : null;

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
      {/* Back */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 mb-8 transition-colors hover:text-[#F2F4F8]"
        style={{ color: "#4B5265", fontSize: "13px", textDecoration: "none" }}
      >
        <ArrowLeft size={14} /> Back to Toolkit
      </Link>

      {/* Header card with IButtonPanel */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <Flame size={20} color="#a78bfa" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(167,139,250,0.08)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>
                  LIVE
                </span>
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}>
                  HALL ET AL. 2012 · ANYIAM 2024
                </span>
              </div>
              <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>Calorie Deficit Planner</h1>
            </div>
          </div>
          <IButtonTrigger open={researchOpen} onToggle={() => setResearchOpen((o) => !o)} />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#8B92A5" }}>
          Find the exact deficit that burns fat without costing you muscle. Built on a 2024 meta-analysis of 4,785 participants.
        </p>

        {/* Expandable research panel — full width */}
        <AnimatePresence initial={false}>
          {researchOpen && (
            <motion.div
              key="research"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <IButtonPanel why={WHY} studies={STUDIES} bottomLine={BOTTOM_LINE} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form card */}
      <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#4B5265" }}>Your Numbers</p>

        {/* Row 1: Weight + Goal weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Current Weight (kg)</label>
            <input
              type="number" min={30} max={250} placeholder="e.g. 80"
              value={form.weight}
              onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>Goal Weight (kg)</label>
            <input
              type="number" min={30} max={250} placeholder="e.g. 72"
              value={form.goalWeight}
              onChange={(e) => setForm((p) => ({ ...p, goalWeight: e.target.value }))}
              className="w-full rounded-lg px-3 text-[14px]"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
            />
          </div>
        </div>

        {/* Maintenance calories */}
        <div className="mb-3">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "#8B92A5" }}>
            Maintenance Calories (kcal/day)
          </label>
          <input
            type="number" min={800} max={6000} placeholder="e.g. 2100"
            value={form.maintenance}
            onChange={(e) => setForm((p) => ({ ...p, maintenance: e.target.value }))}
            className="w-full rounded-lg px-3 text-[14px]"
            style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", color: "#F2F4F8", minHeight: 48, outline: "none" }}
          />
          {!form.maintenance && (
            <p className="text-[11px] mt-1.5" style={{ color: "#4B5265" }}>
              Don&apos;t know yours?{" "}
              <Link href="/tools/macro-calculator" style={{ color: "#a78bfa", textDecoration: "none" }}>
                Calculate maintenance calories first →
              </Link>
            </p>
          )}
        </div>

        {/* Timeline slider */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#8B92A5" }}>Timeline</label>
            <span className="text-[13px] font-semibold" style={{ color: "#F2F4F8" }}>{form.weeks} weeks</span>
          </div>
          <input
            type="range" min={4} max={52} step={1}
            value={form.weeks}
            onChange={(e) => setForm((p) => ({ ...p, weeks: parseInt(e.target.value) }))}
            className="w-full"
            style={{ accentColor: "#a78bfa" }}
          />
          <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "#4B5265" }}>
            <span>4 weeks</span><span>52 weeks</span>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!canCalc}
          className="w-full rounded-lg text-[14px] font-semibold transition-opacity duration-200"
          style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", opacity: canCalc ? 1 : 0.35, cursor: canCalc ? "pointer" : "not-allowed", borderRadius: 8 }}
        >
          Calculate My Deficit Zone →
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && z && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Zone card */}
            <div
              className="rounded-xl p-5 mb-4"
              style={{ background: z.bg, border: `1px solid ${z.border}` }}
            >
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: z.color }}>{z.label}</p>
              <p className="text-[15px] font-semibold mb-0.5" style={{ color: "#F2F4F8" }}>{z.desc}</p>
              <p className="text-[13px]" style={{ color: "#8B92A5" }}>{z.detail}</p>

              {result.zone === "danger" && result.saferWeeks && (
                <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <p className="text-[13px] font-semibold" style={{ color: "#fbbf24" }}>
                    💡 Safer timeline: extend to <span style={{ color: "#F2F4F8" }}>{result.saferWeeks} weeks</span> for a 500 kcal/day deficit
                  </p>
                </div>
              )}
            </div>

            {/* Zone bar */}
            <div className="rounded-xl p-5 mb-4" style={{ background: "#0d0f14", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "#4B5265" }}>
                Your Deficit on the Zone Scale
              </p>
              <ZoneBar deficit={result.dailyDeficit} />

              {/* Key numbers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Daily Deficit",  value: `${result.dailyDeficit} kcal`, color: z.color },
                  { label: "Daily Intake",   value: `${result.dailyIntake} kcal`,  color: "#F2F4F8" },
                  { label: "Weekly Loss",    value: `~${result.weeklyLoss} kg`,    color: "#C3FCFE" },
                  { label: "Protein Floor",  value: `${result.proteinFloor}g/day`, color: "#a78bfa" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg p-3 text-center" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[18px] font-semibold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#4B5265" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-[11px] mt-4 leading-relaxed" style={{ color: "#4B5265" }}>
                Estimates based on peer-reviewed research. Individual results vary. Not medical advice — consult a qualified professional before making changes.
              </p>
            </div>

            {/* Handoff CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-xl p-5"
              style={{ background: "#0d0f14", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase rounded-md px-2 py-1 mb-3" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
                Next Step
              </span>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#F2F4F8" }}>
                Your deficit is set. Now check your visceral fat risk →
              </p>
              <p className="text-[13px] mb-4" style={{ color: "#8B92A5" }}>
                Visceral fat (around your organs) is independent of total weight. A tape measure is all you need.
              </p>
              <button
                onClick={() => router.push(`/tools/visceral-fat?w=${Math.round(parseFloat(form.weight))}&from=calorie-deficit`)}
                className="w-full rounded-lg text-[14px] font-semibold"
                style={{ background: "#a78bfa", color: "#07090D", minHeight: 52, border: "none", borderRadius: 8 }}
              >
                Check Visceral Fat Risk →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
