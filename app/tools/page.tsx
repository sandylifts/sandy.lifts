"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Activity, Target, Star, Flame, Calculator, ArrowRight, Search, Zap, X, BrainCircuit, HeartPulse } from "lucide-react";

/* ─── Data ────────────────────────────────────────────── */
const groups = [
  {
    id: "calculators",
    label: "Core Diagnostics",
    icon: Calculator,
    color: "#00D4FF",
    desc: "Science-backed calculators to determine your exact metabolic baseline.",
    tools: [
      { name: "Ultimate Macro & TDEE Engine", slug: "macro-engine", desc: "Find your exact energy expenditure and optimal macro split based on the validated Mifflin-St Jeor equation.", badge: "Essential" },
      { name: "Navy Body Fat Estimator", slug: "body-fat-estimator", desc: "Calculate your current body fat percentage and lean mass using the US Navy tape measure method.", badge: "Precision" },
    ],
  },
  {
    id: "smart",
    label: "Intelligence & Quizzes",
    icon: BrainCircuit,
    color: "#A855F7",
    desc: "Insightful tools designed to map your unique physiological profile.",
    tools: [
      { name: "Body Type Matrix", slug: "body-type-matrix", desc: "Discover your somatotype (Ecto, Meso, Endomorph) and unlock your ideal training and diet style.", badge: "Insight" },
      { name: "Metabolic Health Analyzer", slug: "metabolism-analyzer", desc: "A smart diagnostic questionnaire to assess your metabolic speed and spot potential adaptation issues.", badge: "Diagnostic" },
    ],
  },
  {
    id: "planning",
    label: "Strategy & Protocols",
    icon: Target,
    color: "#F43F5E",
    desc: "Actionable frameworks to execute your fitness journey flawlessly.",
    tools: [
      { name: "Cheat Meal Protocol", slug: "cheat-meal-protocol", desc: "Input your cheat meal to calculate macro spillover and generate a compensatory cardio or diet protocol.", badge: "Popular" },
      { name: "12-Week Roadmap Generator", slug: "roadmap-generator", desc: "Generate a step-by-step macro and weight trajectory for a complete 90-day physical transformation.", badge: "Premium" },
    ],
  },
];

const filters = [
  { id: "all", label: "All Tools" },
  { id: "calculators", label: "Diagnostics" },
  { id: "smart", label: "Intelligence" },
  { id: "planning", label: "Protocols" },
];

export default function ToolsHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter logic
  const filteredGroups = useMemo(() => {
    let result = groups;

    // Filter by Category Pill
    if (activeFilter !== "all") {
      result = result.filter((g) => g.id === activeFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.map((group) => {
        const filteredTools = group.tools.filter(
          (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
        );
        return { ...group, tools: filteredTools };
      }).filter((group) => group.tools.length > 0);
    }

    return result;
  }, [searchQuery, activeFilter]);

  return (
    <main className="min-h-screen bg-[#08050F] text-white font-sans selection:bg-[#A855F7] selection:bg-opacity-30 pb-24">
      <style dangerouslySetInnerHTML={{
        __html: `
        .font-display { font-family: var(--font-outfit), sans-serif; }
        .font-body { font-family: var(--font-inter), sans-serif; }
        
        @keyframes aurora1 {
          0% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(10%, -10%) scale(1.1); }
          66% { transform: translate(-10%, 10%) scale(0.9); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora2 {
          0% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(-15%, 15%) scale(1.2); }
          66% { transform: translate(15%, -15%) scale(0.8); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        .animate-aurora-1 { animation: aurora1 20s ease-in-out infinite; }
        .animate-aurora-2 { animation: aurora2 25s ease-in-out infinite reverse; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { display: inline-flex; animation: marquee 18s linear infinite; }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        .animate-pulse-dot { animation: pulseDot 1.5s infinite; }

        @keyframes blinkRealMotion {
          0% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px rgba(168,85,247,0.5); }
          5% { opacity: 0.4; transform: scale(0.98); box-shadow: none; }
          10% { opacity: 1; transform: scale(1); box-shadow: 0 0 20px rgba(168,85,247,0.8); }
          15% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 1; box-shadow: 0 0 10px rgba(168,85,247,0.5); }
        }
        .animate-blink-real { animation: blinkRealMotion 3s infinite; }
        `
      }} />

      {/* ─── AURORA BACKGROUND ─── */}
      <div className="fixed top-0 left-0 w-full h-[600px] z-[0] pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#A855F7]/20 blur-[120px] animate-aurora-1 mix-blend-screen" />
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#00D4FF]/15 blur-[140px] animate-aurora-2 mix-blend-screen" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 100%, transparent 0%, #08050F 80%)" }} />
      </div>

      <div className="absolute top-[80px] left-0 right-0 z-[100] w-full h-[30px] lg:h-[36px] bg-gradient-to-r from-[#05050B] via-[#1a0b2e] to-[#05050B] border-y border-[#A855F7]/20 shadow-[0_4px_30px_rgba(168,85,247,0.1)] flex items-center overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[60px] bg-gradient-to-r from-[#0d0018] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[60px] bg-gradient-to-l from-[#0d0018] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee whitespace-nowrap flex items-center font-body text-[11px] font-medium text-[#c084fc] tracking-[0.02em]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {["Need to calculate macros?", "Wondering about body fat?", "Want to track progress?", "Confused about cheat meals?", "Need a workout split?", "Want to optimise recovery?"].map((prob, idx) => (
                <div key={idx} className="flex items-center mr-[32px]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#c084fc] mr-2 animate-pulse-dot" />
                  {prob}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[10] max-w-[1280px] mx-auto px-5 lg:px-10 pt-32 lg:pt-40">

        {/* ─── HERO SECTION ─── */}
        <div className="flex flex-col items-center text-center mb-20 lg:mb-24">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 border border-[#A855F7]/40 bg-[#A855F7]/10 px-[16px] py-[8px] rounded-full backdrop-blur-md animate-blink-real">
              <BrainCircuit size={14} className="text-[#c084fc]" />
              <span className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#c084fc]">
                The Ultimate Toolkit
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-display font-bold text-[48px] md:text-[64px] lg:text-[76px] leading-[1.05] tracking-[-0.03em] max-w-[900px] text-white mb-6"
          >
            Your Body Runs on Data.<br />
            <span className="bg-[linear-gradient(to_right,#A855F7,#00D4FF)] bg-clip-text text-transparent">Now You Do Too.</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="font-body text-[16px] lg:text-[18px] text-[#AAB3C5] font-medium max-w-[640px] leading-[1.65] mb-8"
          >
            Evidence-based tools designed to simplify your nutrition. No bro-science, no fake promises—just a logical path to your best physique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="flex items-center gap-2 mb-12 bg-white/[0.03] border border-white/10 px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            <span className="text-[16px]">👉</span>
            <span className="font-body text-[14px] font-medium text-white/90">
              Used by people who are done guessing.
            </span>
          </motion.div>

          {/* Search Bar Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-[720px] relative group"
          >
            {/* Glow behind search */}
            <div className="absolute -inset-[2px] rounded-[24px] bg-gradient-to-r from-[#A855F7]/40 to-[#00D4FF]/40 blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-center w-full h-[64px] lg:h-[72px] glass-card rounded-[20px] overflow-hidden transition-all duration-300 border-white/10 group-focus-within:border-[#A855F7]/50 group-focus-within:bg-white/[0.04]">
              <div className="pl-6 pr-4 flex items-center justify-center">
                <Search size={24} className="text-[#AAB3C5] group-focus-within:text-[#00D4FF] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Find a tool (e.g., 'BMR', 'Macro', 'Quiz')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none text-[16px] lg:text-[18px] font-medium text-white placeholder:text-[#6B6F9A] font-body pr-6"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="pr-6 pl-2 text-[#AAB3C5] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => { setActiveFilter(f.id); setSearchQuery(""); }}
                className={`px-5 py-2.5 rounded-full font-body text-[14px] font-semibold transition-all duration-300 border ${activeFilter === f.id
                    ? "bg-[#A855F7]/20 border-[#A855F7]/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    : "bg-white/[0.03] border-white/10 text-[#9A9EC4] hover:bg-white/[0.08] hover:text-white"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ─── TOOLS GRID ─── */}
        <div className="w-full">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-[64px] h-[64px] mx-auto rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
                <Search size={28} className="text-[#6B6F9A]" />
              </div>
              <h3 className="font-display text-[24px] font-bold text-white mb-2">No tools found</h3>
              <p className="text-[#9A9EC4]">Try adjusting your search query to find what you're looking for.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                className="mt-6 text-[#00D4FF] font-semibold hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-16 lg:gap-24">
              <AnimatePresence>
                {filteredGroups.map((group) => (
                  <motion.section
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="scroll-mt-[120px]"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden group-hover:scale-110 transition-transform"
                        style={{
                          background: `radial-gradient(circle at top left, ${group.color}30, transparent)`,
                          borderColor: `${group.color}40`
                        }}
                      >
                        <group.icon size={24} color={group.color} />
                      </div>
                      <div>
                        <h2 className="font-display text-[24px] lg:text-[28px] font-bold text-white mb-1 tracking-tight">
                          {group.label}
                        </h2>
                        <p className="font-body text-[#9A9EC4] text-[14px] lg:text-[15px]">{group.desc}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] mb-8" style={{ background: `linear-gradient(90deg, ${group.color}40, transparent)` }} />

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {group.tools.map((tool) => (
                        <Link
                          href={`/tools/${tool.slug}`}
                          key={tool.slug}
                          className="group flex flex-col h-full glass-card rounded-[24px] p-6 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                          style={{ borderColor: "rgba(255,255,255,0.08)" }}
                        >
                          {/* Hover Glow Effect inside card */}
                          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white opacity-0 group-hover:opacity-[0.03] blur-[40px] rounded-full transition-opacity duration-500 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-[100px] h-[100px] opacity-0 group-hover:opacity-[0.1] blur-[50px] rounded-full transition-opacity duration-500 pointer-events-none" style={{ backgroundColor: group.color }} />

                          <div className="flex justify-between items-start mb-4 relative z-10">
                            <h3 className="font-display font-bold text-[18px] text-white leading-[1.3] pr-2 group-hover:text-[#00D4FF] transition-colors">
                              {tool.name}
                            </h3>
                            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border"
                              style={{
                                color: group.color,
                                backgroundColor: `${group.color}15`,
                                borderColor: `${group.color}30`
                              }}
                            >
                              {tool.badge}
                            </span>
                          </div>

                          <p className="font-body text-[14px] text-[#AAB3C5] leading-[1.6] mb-6 flex-grow relative z-10">
                            {tool.desc}
                          </p>

                          <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide relative z-10" style={{ color: group.color }}>
                            Launch Tool
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
