"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────── */
interface StudyTag { label: string; type: "primary" | "compared" | "rejected"; }
interface Study { name: string; detail: string; tag: StudyTag; }
interface StudyPanel { why: string; studies: Study[]; bottomLine: string; }
interface Tool {
  id: string;
  icon: string;
  name: string;
  desc: string;
  slug?: string;
  live: boolean;
  viral?: boolean;
  studyPanel?: StudyPanel;
}

/* ─── Data ──────────────────────────────────────────────── */
const TOOLS: Tool[] = [
  {
    id: "calories",
    icon: "🔥",
    name: "Maintenance Calories",
    desc: "Find your daily calorie baseline",
    slug: "/tools/macro-calculator",
    live: true,
    studyPanel: {
      why: "We evaluated 4 formulas for maintenance calories. Mifflin-St Jeor was selected because it demonstrated the highest accuracy in the largest modern validation study — outperforming Harris-Benedict by 5% across diverse populations.",
      studies: [
        { name: "Mifflin MD et al.", detail: "1990 · 498 subjects · American Journal of Clinical Nutrition", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Frankenfield D et al.", detail: "2005 · 201 subjects · Journal of the American Dietetic Association", tag: { label: "COMPARED", type: "compared" } },
        { name: "Harris JA, Benedict FG", detail: "1919 · 239 subjects · Carnegie Institution", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "Mifflin-St Jeor predicted resting metabolic rate within 10% for 82% of subjects — more than any other tested equation.",
    },
  },
  {
    id: "neat",
    icon: "⚡",
    name: "BMI + NEAT Estimator",
    desc: "Dual WHO/Indian BMI · Non-exercise calorie burn",
    slug: "/tools/neat-estimator",
    live: true,
    studyPanel: {
      why: "Most tools ignore NEAT — the calories burned outside deliberate exercise. Research shows NEAT can vary by 2,000 kcal/day between individuals of the same weight. We also use Asian Indian BMI cutoffs, which WHO standards systematically underestimate risk for.",
      studies: [
        { name: "Levine JA et al., 2005", detail: "Science — NEAT interindividual variation up to 2,000 kcal/day", tag: { label: "PRIMARY", type: "primary" } },
        { name: "WHO Expert Consultation, 2004", detail: "Asian population BMI advisory — Lancet", tag: { label: "COMPARED", type: "compared" } },
        { name: "Misra A et al., 2009", detail: "Consensus guidelines for Asian Indians — Nutrition", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "Obese individuals sit 2 hours more per day than lean people. Closing that gap = 350 kcal/day = ~16 kg/year. NEAT is the most overlooked variable in body composition.",
    },
  },
  {
    id: "bodyfat",
    icon: "🧬",
    name: "Body Fat %",
    desc: "Navy Method — most accessible estimate",
    slug: "/tools/body-fat",
    live: true,
    studyPanel: {
      why: "The US Navy circumference method was chosen for its accessibility and clinically validated accuracy — no DEXA required. It outperforms BMI-based estimates in lean populations.",
      studies: [
        { name: "Hodgdon JA, Beckett MB", detail: "1984 · 526 subjects · Naval Health Research Center", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Deurenberg P et al.", detail: "1991 · 1229 subjects · British Journal of Nutrition", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "Navy Method predicted body fat within 3.5% of hydrostatic weighing in 91% of subjects tested.",
    },
  },
  {
    id: "protein",
    icon: "💪",
    name: "Protein Target",
    desc: "Evidence-based daily protein goal",
    slug: "/tools/protein-target",
    live: true,
    studyPanel: {
      why: "Morton et al. 2018 is the largest systematic review on protein and muscle growth to date — covering 1,800+ subjects. It settled the decades-long debate on optimal intake.",
      studies: [
        { name: "Morton RW et al.", detail: "2018 · 1863 subjects · British Journal of Sports Medicine", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Phillips SM, Van Loon LJ", detail: "2011 · Meta-analysis · Journal of Sports Sciences", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "0.72g/lb (1.62g/kg) maximised muscle protein synthesis with no added benefit observed beyond this threshold.",
    },
  },
  {
    id: "tdee",
    icon: "📊",
    name: "TDEE Calculator",
    desc: "Total daily energy with activity",
    live: false,
    studyPanel: {
      why: "TDEE multipliers are drawn from multiple activity-validated studies. Rather than fixed multipliers, we weight-average across cohort data to reduce systematic overestimation.",
      studies: [
        { name: "Ainsworth BE et al.", detail: "2011 · Compendium of Physical Activities Update · Medicine & Science in Sports", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Black AE et al.", detail: "1996 · 574 subjects · European Journal of Clinical Nutrition", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "Activity-adjusted multipliers reduce overestimation error by ~12% versus standard fixed-coefficient models.",
    },
  },
  {
    id: "calorie-deficit",
    icon: "🔻",
    name: "Calorie Deficit Planner",
    desc: "3-zone system · Hall 2012 · Anyiam 2024",
    slug: "/tools/calorie-deficit",
    live: true,
    studyPanel: {
      why: "Most deficit tools give you a number. We show you the risk zone — because going too fast costs you muscle and slows your metabolism. 4,785-participant meta-analysis is the basis.",
      studies: [
        { name: "Anyiam O et al. — Nutrients 2024", detail: "49 studies, 4,785 participants · Muscle constitutes ~27% of weight lost during severe restriction", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Frontiers in Nutrition 2025 · 62 RCTs, 4,429 participants", detail: "Avoid deficits >500 kcal/day to preserve lean body mass", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Hall KD et al. — NIH 2012", detail: "Mathematical model: 7,700 kcal deficit = 1 kg fat loss", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "A 500 kcal/day deficit loses ~0.5 kg/week and preserves muscle. At 1,000 kcal/day, 27% of what you lose is muscle.",
    },
  },
  {
    id: "visceral-fat",
    icon: "📏",
    name: "Visceral Fat Risk Estimator",
    desc: "WHtR · NICE 2022 · Indian cutoffs",
    slug: "/tools/visceral-fat",
    live: true,
    studyPanel: {
      why: "BMI doesn't tell you where fat is stored. Visceral fat (around your organs) is the real risk. WHtR is the gold standard — validated in 78 studies across 14 countries.",
      studies: [
        { name: "Ashwell M & Gibson S — Nutr Research Reviews 2010", detail: "78 studies: WHtR outperforms BMI for CVD and diabetes prediction", tag: { label: "PRIMARY", type: "primary" } },
        { name: "NICE Guidelines — October 2022", detail: "WHtR ≥ 0.5 defines central adiposity across all sexes and ethnicities", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Lancet Regional Health — SE Asia 2023", detail: "NFHS-5: 6.59L Indian women + 85,976 men — first national dataset", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "Keep your waist less than half your height. Simple, free, and clinically validated.",
    },
  },
  {
    id: "fiber-calculator",
    icon: "🥗",
    name: "Fiber Needs Calculator",
    desc: "ICMR-NIN 2024 · Indian food sources",
    slug: "/tools/fiber-calculator",
    live: true,
    viral: true,
    studyPanel: {
      why: "American fiber guidelines don't apply to Indian diets. We use ICMR-NIN 2024 — India's own dietary guidelines — scaled to your calorie intake, with Indian food composition data (IFCT 2017).",
      studies: [
        { name: "ICMR-NIN Dietary Guidelines — 2024", detail: "56.4% of India's disease burden linked to unhealthy diets", tag: { label: "PRIMARY", type: "primary" } },
        { name: "ICMR-NIN Nutrient Requirements — 2020", detail: "30g per 2000 kcal — established Indian RDA", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Alahmari LA — Frontiers in Nutrition 2024", detail: "Dietary fiber reduces CVD, T2D, obesity and colon cancer risk", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "Average urban Indian gets 12–15g/day — half of target. Dal at lunch and sabzi at dinner closes most of the gap.",
    },
  },
  {
    id: "diet-break",
    icon: "☕",
    name: "Diet Break Calculator",
    desc: "MATADOR protocol · 47% more fat loss",
    slug: "/tools/diet-break",
    live: true,
    studyPanel: {
      why: "Continuous dieting causes adaptive thermogenesis — your body slows metabolism and increases hunger hormones to fight back. Planned breaks at maintenance calories reverse this. It's not cheating, it's the MATADOR protocol.",
      studies: [
        { name: "Byrne NM et al. — Int J Obesity 2017 (MATADOR)", detail: "51 men · 47% greater fat loss with 2-week diet breaks vs continuous restriction", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Henselmans M et al. — J Hum Kinet 2023", detail: "IER attenuates fat-free mass loss in resistance-trained individuals", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "Dieting 8+ weeks without a break costs you lean mass and slows your metabolism. Take 1–2 weeks at maintenance every 6–8 weeks.",
    },
  },
  {
    id: "rebound-risk",
    icon: "🛡️",
    name: "Rebound Risk Checker",
    desc: "7-question quiz · Sumithran NEJM 2011",
    slug: "/tools/rebound-risk",
    live: true,
    studyPanel: {
      why: "Up to 80% of people regain lost weight. Not because they stopped trying — because hunger hormones (ghrelin) stay elevated for 12+ months after weight loss. We built this to help you understand and fight that biology.",
      studies: [
        { name: "Sumithran P et al. — NEJM 2011", detail: "Ghrelin elevated for 62+ weeks after 13.5 kg weight loss — 1 year hormonal suppression", tag: { label: "PRIMARY", type: "primary" } },
        { name: "van Baak MA & Mariman ECM — Curr Obesity Rep 2025", detail: "Latest review: lean mass loss, gut microbiota, hormonal adaptation all cause rebound", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Spiegel K et al. — Sleep 2004", detail: "Sleep restriction raises ghrelin 28% — mimics weight regain hormonal state", tag: { label: "COMPARED", type: "compared" } },
      ],
      bottomLine: "You didn't regain weight because you were weak. Your body released more hunger hormone for a year after reaching your goal. Protein, resistance training, sleep and weekly weigh-ins are the tools to fight it.",
    },
  },
  {
    id: "calories-by-height",
    icon: "📏",
    name: "Calories by Height",
    desc: "Height-based calorie range · Ideal weight · Mifflin-St Jeor",
    slug: "/tools/calories-by-height",
    live: true,
    studyPanel: {
      why: "Most calorie calculators require your current weight to work. But if you don't know what you SHOULD weigh, where do you even start? This tool works backwards from your height.",
      studies: [
        { name: "Misra A et al. — Nutrition 2009", detail: "Consensus guidelines for Asian Indians: healthy BMI 18.5–22.9", tag: { label: "PRIMARY", type: "primary" } },
        { name: "Mifflin MD et al. — 1990", detail: "Most accurate BMR equation for diverse populations", tag: { label: "PRIMARY", type: "primary" } },
      ],
      bottomLine: "Knowing your healthy weight range before starting a diet gives you a realistic target — not just an arbitrary number from the scale.",
    },
  },
];

const HERO_CARDS = [
  { icon: "🔥", name: "Maintenance Calories", desc: "Mifflin-St Jeor · 1990", style: { top: "8%", left: "2%", rotate: "-2deg", animDuration: "4s" } },
  { icon: "🧬", name: "Body Fat %", desc: "Navy Method · HODGDON 1984", style: { top: "5%", right: "0%", rotate: "3deg", animDuration: "5.5s" } },
  { icon: "💪", name: "Protein Intake", desc: "Morton et al. · 2018", style: { bottom: "18%", left: "0%", rotate: "-3deg", animDuration: "3.8s" } },
  { icon: "⚡", name: "TDEE Calculator", desc: "Activity-adjusted · Multi-study", style: { bottom: "10%", right: "4%", rotate: "1.5deg", animDuration: "6s" } },
];

const TAG_STYLES: Record<string, string> = {
  primary: "bg-[rgba(195,252,254,0.12)] text-[#C3FCFE] border border-[rgba(195,252,254,0.3)]",
  compared: "bg-[rgba(255,255,255,0.06)] text-[#9A9EC4] border border-[rgba(255,255,255,0.12)]",
  rejected: "bg-[rgba(255,100,100,0.1)] text-[#ff6b6b] border border-[rgba(255,100,100,0.25)]",
};

/* ─── Study Panel Component ─────────────────────────────── */
function StudyPanelContent({ panel }: { panel: StudyPanel }) {
  return (
    <div className="mt-4 pt-4 border-t border-[rgba(195,252,254,0.08)]">
      {/* WHY WE USE THIS */}
      <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#C3FCFE] mb-2">Why We Use This Method</p>
      <p className="text-[13px] text-[#9A9EC4] leading-[1.7] mb-4">{panel.why}</p>

      {/* THE RESEARCH */}
      <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#C3FCFE] mb-3">The Research</p>
      <div className="flex flex-col gap-3 mb-4">
        {panel.studies.map((study, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-[#D8DBFC]">{study.name}</p>
              <p className="text-[11px] text-[#6B6F9A] mt-0.5">{study.detail}</p>
            </div>
            <span className={`shrink-0 text-[9px] font-bold tracking-[1px] uppercase px-2 py-1 rounded-full ${TAG_STYLES[study.tag.type]}`}>
              {study.tag.label}
            </span>
          </div>
        ))}
      </div>

      {/* BOTTOM LINE */}
      <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#C3FCFE] mb-2">Bottom Line</p>
      <p className="text-[13px] italic text-[#9A9EC4] leading-[1.7]">{panel.bottomLine}</p>
    </div>
  );
}

/* ─── Tool Card Component ───────────────────────────────── */
function ToolCard({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className={`relative flex flex-col rounded-xl border transition-all duration-300 overflow-hidden
        ${open
          ? "bg-[#0D1117] border-[rgba(195,252,254,0.25)] shadow-[0_0_30px_rgba(195,252,254,0.08)]"
          : "bg-[#0D0D12] border-[rgba(255,255,255,0.07)] hover:border-[rgba(195,252,254,0.2)] hover:-translate-y-1"
        }`}
    >
      {/* Card top glow on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(195,252,254,0.04) 0%, transparent 60%)" }} />

      {/* 🔴 VIRAL Badge */}
      {tool.viral && (
        <div
          className="absolute top-[-1px] right-4 z-20 select-none"
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ff0040 0%, #cc0030 100%)",
              color: "#fff",
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "5px 12px 4px",
              borderRadius: "0 0 10px 10px",
              boxShadow: "0 4px 0 #7a0020, 0 6px 24px rgba(255,0,64,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",
              animation: "viral-pulse 2s infinite ease-in-out",
              border: "1px solid rgba(255,80,100,0.4)",
              borderTop: "none",
            }}
          >
            🔥 VIRAL
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-11 h-11 rounded-full bg-[#141420] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-2xl">
            {tool.icon}
          </div>
          {tool.studyPanel && (
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={`${open ? "Close" : "Open"} study panel for ${tool.name}`}
              className={`w-8 h-8 rounded-full border text-[13px] italic font-serif flex items-center justify-center transition-all duration-200
                ${open
                  ? "border-[rgba(195,252,254,0.5)] text-[#C3FCFE] bg-[rgba(195,252,254,0.08)]"
                  : "border-[rgba(255,255,255,0.12)] text-[#6B6F9A] hover:border-[rgba(195,252,254,0.4)] hover:text-[#C3FCFE]"
                }`}
            >
              i
            </button>
          )}
        </div>

        {/* Name + Desc */}
        <p className="text-[18px] font-semibold text-[#F5F7FA] leading-tight mb-1">{tool.name}</p>
        <p className="text-[13px] text-[#6B6F9A] mb-5 flex-1">{tool.desc}</p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-auto">
          {tool.live ? (
            <span className="text-[10px] font-bold tracking-[1px] uppercase px-3 py-1 rounded-full bg-[rgba(195,252,254,0.08)] text-[#C3FCFE] border border-[rgba(195,252,254,0.25)]">
              LIVE
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-[1px] uppercase px-3 py-1 rounded-full bg-[rgba(255,255,255,0.04)] text-[#4A4A75] border border-[rgba(255,255,255,0.06)]">
              COMING SOON
            </span>
          )}
          {tool.live && tool.slug && (
            <Link
              href={tool.slug}
              className="text-[13px] text-[#C3FCFE] border border-[rgba(195,252,254,0.2)] px-4 py-1.5 rounded-lg hover:bg-[rgba(195,252,254,0.08)] transition-all duration-200"
            >
              CALCULATE →
            </Link>
          )}
        </div>

        {/* Study Panel */}
        <AnimatePresence initial={false}>
          {open && tool.studyPanel && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <StudyPanelContent panel={tool.studyPanel} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#07090D] text-white overflow-x-hidden">
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes viral-pulse {
          0%, 100% {
            box-shadow: 0 4px 0 #7a0020, 0 6px 24px rgba(255,0,64,0.55), inset 0 1px 0 rgba(255,255,255,0.3);
            transform: translateY(0px);
          }
          50% {
            box-shadow: 0 4px 0 #7a0020, 0 12px 40px rgba(255,0,64,0.9), inset 0 1px 0 rgba(255,255,255,0.5);
            transform: translateY(-1px);
          }
        }
        @keyframes magPulse {
          0%, 100% { transform: rotate(-35deg) scale(1); opacity: 0.7; }
          50% { transform: rotate(-35deg) scale(1.03); opacity: 1; }
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.08); }
        }
        .float-1 { animation: floatCard 4s ease-in-out infinite; }
        .float-2 { animation: floatCard 5.5s ease-in-out infinite; }
        .float-3 { animation: floatCard 3.8s ease-in-out infinite; }
        .float-4 { animation: floatCard 6s ease-in-out infinite; }
        .mag-pulse { animation: magPulse 3s ease-in-out infinite; }
        .blob-drift { animation: blobDrift 12s ease-in-out infinite; }
      `}</style>

      {/* ── AMBIENT BLOBS ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="blob-drift absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[rgba(198,159,245,0.07)] blur-[120px]" />
        <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-[rgba(195,252,254,0.05)] blur-[140px]" />
      </div>

      {/* ════════════════════════════════════════════
          HERO SECTION — Two-Column
      ════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex items-center pt-24 pb-20 px-5 md:px-10 max-w-[1280px] mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* ── LEFT: Text Content ── */}
          <div className="flex-1 flex flex-col items-start max-w-[560px]">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7"
            >
              <span className="inline-block border border-[rgba(195,252,254,0.4)] text-[#C3FCFE] text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full bg-[rgba(195,252,254,0.04)]">
                PEER-REVIEWED TOOLS
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-[clamp(48px,7vw,80px)] font-bold leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-outfit, 'Outfit', sans-serif)" }}
            >
              <span className="text-[#F0EDE6]">Most Fitness Tools</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #C3FCFE 0%, #C69FF5 100%)" }}
              >
                LIE TO YOU.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="text-[16px] md:text-[17px] text-[#9A9EC4] leading-[1.75] max-w-[480px] mb-8"
            >
              We only built tools where the science was already settled. Every calculator here is backed by peer-reviewed research — not bro-science, not gym myths. Just what actually works.
            </motion.p>

            {/* 3 Trust Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="flex flex-col gap-3 mb-10"
            >
              {[
                "498+ subjects validated our calorie formula",
                "We show you which study we used — and why",
                "If better research exists, we update the tool",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-[6px] w-2 h-2 rounded-full shrink-0" style={{ background: "linear-gradient(135deg, #C3FCFE, #C69FF5)" }} />
                  <p className="text-[14px] text-[#9A9EC4] leading-[1.6]">{point}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="flex flex-col items-start gap-3"
            >
              <a
                href="#tools-grid"
                className="inline-block px-8 py-4 rounded-lg text-[#07090D] font-bold text-[16px] tracking-[2px] uppercase transition-all duration-200 hover:-translate-y-1 hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #C3FCFE 0%, #C69FF5 100%)",
                  fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
                  boxShadow: "0 0 30px rgba(195,252,254,0.25)",
                }}
              >
                EXPLORE TOOLS →
              </a>
              <p className="text-[12px] text-[#4A4A75]">5 tools available · More coming soon</p>
            </motion.div>
          </div>

          {/* ── RIGHT: Floating Visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex-1 w-full max-w-[540px] h-[460px] md:h-[480px] shrink-0"
          >
            {/* BG glow blob */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{ background: "radial-gradient(circle at 60% 40%, rgba(195,252,254,0.06) 0%, transparent 65%)" }}
            />

            {/* Floating Tool Cards */}
            {HERO_CARDS.map((card, i) => (
              <div
                key={i}
                className={`float-${i + 1} absolute z-10`}
                style={{
                  ...card.style,
                  rotate: undefined,
                  transform: `rotate(${card.style.rotate})`,
                  top: card.style.top,
                  left: card.style.left,
                  right: card.style.right,
                  bottom: card.style.bottom,
                }}
              >
                <div
                  className="relative px-4 py-3.5 rounded-2xl min-w-[180px] max-w-[210px]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{card.icon}</span>
                    <p className="text-[14px] font-bold text-white truncate">{card.name}</p>
                  </div>
                  <p className="text-[11px] text-[#6B6F9A] ml-8">{card.desc}</p>
                  <div
                    className="absolute bottom-3 right-3 w-2 h-2 rounded-full"
                    style={{ background: "linear-gradient(135deg, #C3FCFE, #C69FF5)", boxShadow: "0 0 6px rgba(195,252,254,0.6)" }}
                  />
                </div>
              </div>
            ))}

            {/* Magnifier */}
            <div
              className="mag-pulse absolute bottom-[-20px] right-[-20px] z-20"
              style={{ width: 160, height: 160 }}
            >
              {/* Circle */}
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  border: "3px solid rgba(195,252,254,0.55)",
                  background: "rgba(195,252,254,0.04)",
                  backdropFilter: "blur(4px)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-35deg)",
                  transformOrigin: "center",
                  boxShadow: "0 0 20px rgba(195,252,254,0.2)",
                }}
              />
              {/* Handle */}
              <div
                style={{
                  width: 4,
                  height: 55,
                  background: "linear-gradient(180deg, rgba(195,252,254,0.7) 0%, transparent 100%)",
                  borderRadius: 2,
                  position: "absolute",
                  bottom: 0,
                  right: 28,
                  transform: "rotate(40deg)",
                  transformOrigin: "top center",
                }}
              />
            </div>

            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              <div
                className="text-[11px] font-bold tracking-[3px] uppercase opacity-20"
                style={{ color: "#C3FCFE" }}
              >
                RESEARCH BACKED
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TOOLS GRID SECTION
      ════════════════════════════════════════════ */}
      <section id="tools-grid" className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10 pt-20 pb-24 scroll-mt-20">

        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <p
            className="text-[11px] font-bold tracking-[3px] uppercase mb-3"
            style={{ color: "#C3FCFE" }}
          >
            THE TOOLKIT
          </p>
          <h2
            className="text-[clamp(28px,5vw,42px)] font-bold text-[#F5F7FA] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-outfit, 'Outfit', sans-serif)" }}
          >
            Built on Research.{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #C3FCFE 0%, #C69FF5 100%)" }}
            >
              Designed for Results.
            </span>
          </h2>
        </motion.div>

        {/* Divider */}
        <div
          className="w-full h-px mb-12"
          style={{ background: "linear-gradient(90deg, rgba(195,252,254,0.3) 0%, transparent 70%)" }}
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-[13px] text-[#4A4A75] mt-12"
        >
          New tools are added as we validate the underlying research.{" "}
          <span className="text-[#9A9EC4]">No guesswork. Ever.</span>
        </motion.p>
      </section>
    </main>
  );
}
