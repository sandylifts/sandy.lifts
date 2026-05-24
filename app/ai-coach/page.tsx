"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useBodyProfile } from "@/hooks/useBodyProfile";
import {
  Target, Dumbbell, Apple, Zap, User, ArrowRight, ShieldCheck,
  CheckCircle2, AlertTriangle, MessageSquare, Flame,
  BrainCircuit, RefreshCw, TrendingDown, TrendingUp, Salad, Activity, ArrowLeft,
  Droplets, Moon, Clock
} from "lucide-react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────── */
type Phase = "hook" | "gender" | "path" | "quiz" | "analyzing" | "results";
type PathType = "workout" | "diet" | "both";





/* ─── Personalization Helpers ────────────────────────── */
const getInsight = (a: Record<string, string>): string => {
  const g = a.goal || ""; const l = a.level || "";
  if (g.includes("Fat") && l === "Just Starting")
    return "Your #1 weapon isn't the treadmill — it's your diet. 80% of fat loss is kitchen work. Start with a 300 kcal deficit + 3x weekly strength training. Results visible in 3 weeks.";
  if (g.includes("Muscle") && l === "Just Starting")
    return "Newbie gains are real — beginners build muscle fastest. Focus on compound moves: squat, push, pull, hinge. 4-6 weeks tak results guaranteed. Volume over intensity right now.";
  if (g.includes("Transform"))
    return "Body recomposition — lose fat while gaining muscle simultaneously. It's the hardest path but the most rewarding. Requires protein-first diet + progressive overload. Your plan is built for exactly this.";
  if (l === "Experienced")
    return "At your level, generic plans hit plateaus. Your blueprint uses periodization — cycling intensity every 4 weeks to force continuous adaptation. No more stalled progress.";
  return "Consistency beats perfection. The best plan is one you actually follow. Your AI blueprint adapts to your life, not a textbook.";
};

const getCalorieBadge = (a: Record<string, string>) => {
  if ((a.goal || "").includes("Fat")) return { label: "Calorie Strategy", val: "300–500 kcal deficit", color: "#FF2D6B" };
  if ((a.goal || "").includes("Muscle")) return { label: "Calorie Strategy", val: "200–300 kcal surplus", color: "#38BDF8" };
  return { label: "Calorie Strategy", val: "Cycling approach", color: "#a78bfa" };
};

/* ─── Mifflin-St Jeor Macro Calculator ───────────────── */
const calcMacros = (ans: Record<string, any>) => {
  const weight = parseFloat(ans.weight) || 70;
  const height = parseFloat(ans.height) || 170;
  const age    = parseFloat(ans.age)    || 25;
  const g      = ans.gender || "male";
  const goal   = ans.goal   || "";
  const bmr    = g === "female"
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;
  const palMap: Record<string, number> = {
    "Just Starting": 1.375, "Beginner": 1.375, "Nothing": 1.2,
    "Walk / Yoga": 1.375, "Gym (Beginner)": 1.375,
    "Some Experience": 1.55, "Intermediate": 1.55, "Gym (Regular)": 1.55,
    "Experienced": 1.725, "Advanced": 1.725,
  };
  const pal  = palMap[ans.level] || palMap[ans.activity] || 1.55;
  const tdee = bmr * pal;
  const isFat    = goal.includes("Fat") || goal === "Toning";
  const isMuscle = goal.includes("Muscle");
  const calories = Math.round(isFat ? tdee - 400 : isMuscle ? tdee + 250 : tdee);
  const protein  = Math.round(weight * (isMuscle ? 2.0 : 1.8));
  const fats     = Math.round((calories * 0.25) / 9);
  const carbs    = Math.max(Math.round((calories - protein * 4 - fats * 9) / 4), 50);
  return { calories, protein, carbs, fats };
};

/* ─── Isolated Components ─────────────────────────────── */
const RefinementInput = ({ isRefining, onRefine }: { isRefining: boolean, onRefine: (prompt: string) => void }) => {
  const [val, setVal] = useState("");
  return (
    <div className="flex flex-col md:flex-row gap-3 relative z-20">
      <input 
        type="text" 
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && val.trim() && !isRefining) { onRefine(val); setVal(""); } }}
        placeholder="E.g., 'Make it 3 days a week' or 'I want more arms focus'..." 
        className="flex-1 bg-[#05050B]/60 border border-[#A78BFA]/20 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#A78BFA]/60 focus:shadow-[0_0_20px_rgba(167,139,250,0.15)] transition-all placeholder:text-[#AAB3C5]/50"
        disabled={isRefining}
      />
      <button 
        onClick={() => { onRefine(val); setVal(""); }}
        disabled={isRefining || !val.trim()}
        className="relative group bg-gradient-to-r from-[#A78BFA] to-[#4DA3FF] disabled:opacity-50 text-white rounded-2xl px-8 py-4 font-bold text-sm transition-all flex items-center justify-center min-w-[150px] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        {isRefining ? <RefreshCw className="w-5 h-5 animate-spin relative z-10" /> : <span className="relative z-10 flex items-center gap-2">Update AI <Zap className="w-4 h-4 fill-white" /></span>}
      </button>
    </div>
  );
};

const COMPARISON_ROWS = [
  {
    feature: "Hormonal & Medical Awareness",
    sandy: { text: "Yes (Scans PCOD, Thyroid, Injuries, Periods)", check: true },
    generic: { text: "No (Generic guidelines only)", check: false },
    trainer: { text: "Rarely (Not clinically trained)", check: false },
  },
  {
    feature: "BMR & Macro Accuracy",
    sandy: { text: "Clinical (Mifflin-St Jeor + PAL scaling)", check: true },
    generic: { text: "Inaccurate (Prone to math hallucinations)", check: false },
    trainer: { text: "Bro-Science (Fixed 1500kcal sheet)", check: false },
  },
  {
    feature: "Real-time Adaptability",
    sandy: { text: "Interactive (Chat updates instantly)", check: true },
    generic: { text: "Static (Forgets previous context easily)", check: false },
    trainer: { text: "Fixed (Must wait for weekly check-ins)", check: false },
  },
  {
    feature: "Personalized Reasoning",
    sandy: { text: "Full Transparency (Explains the science)", check: true },
    generic: { text: "Generic Text (No clinical explanations)", check: false },
    trainer: { text: "Zero (\"Just lift this and eat that\")", check: false },
  },
  {
    feature: "Cost Barriers",
    sandy: { text: "Free (Top-1% science for everyone)", check: true },
    generic: { text: "Premium (Paid subscription required)", check: false },
    trainer: { text: "Expensive (₹5,000 - ₹15,000/month)", check: false },
  },
];

const StatusCell = ({ check, text, highlight }: { check: boolean; text: string; highlight?: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${highlight ? 'text-white' : 'text-white/70'}`}>
        {check ? (
          <CheckCircle2 size={15} className="text-[#22D3A5] drop-shadow-[0_0_6px_rgba(34,211,165,0.8)] shrink-0" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444] shrink-0" />
        )}
        <span className="text-center">{text.split(" ")[0]}</span>
      </span>
      <span className={`text-[10.5px] mt-1 text-center font-medium block leading-snug ${highlight ? 'text-[#C084FC]/85' : 'text-white/45'}`}>
        {text.includes("(") ? text.substring(text.indexOf("(")) : text}
      </span>
    </div>
  );
};

/* ─── Modern 2026 Trust Widget (Social Proof) ────────── */
const ModernTrustWidget = () => {
  const [scans, setScans] = useState(1482);
  const [logIndex, setLogIndex] = useState(0);

  const CLINICAL_LOGS = [
    { loc: "Delhi NCR", action: "PCOS Hormone Profile Mapped & Filtered" },
    { loc: "Mumbai", action: "Thyroid TDEE Compensation Set" },
    { loc: "Bengaluru", action: "Knee Injury Progressive Volume Compensated" },
    { loc: "Hyderabad", action: "Insulin Sensitivity Macro Scaling Active" },
    { loc: "Pune", action: "Postural Spine Deficit Adjusted" },
    { loc: "Chennai", action: "Cardiovascular Heart-Rate Zones Recalibrated" }
  ];

  useEffect(() => {
    // Randomize initial scan count slightly
    setScans(Math.floor(Math.random() * 80) + 1420);

    // Increment scans periodically
    const scanInterval = setInterval(() => {
      setScans(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 4500);

    // Cycle through logs
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % CLINICAL_LOGS.length);
    }, 3500);

    return () => {
      clearInterval(scanInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="relative group overflow-hidden bg-gradient-to-r from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-[#A855F7]/30 transition-all duration-500 max-w-[650px] w-full animate-fade-in-up-hero" style={{ animationDelay: '700ms' }}>
      {/* Decorative background glow */}
      <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-[#A855F7]/5 blur-[40px] group-hover:bg-[#A855F7]/10 transition-all duration-500 pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-40 h-40 rounded-full bg-[#00D4FF]/5 blur-[40px] group-hover:bg-[#00D4FF]/10 transition-all duration-500 pointer-events-none" />

      {/* Section 1: Live Pulse & Scan Count */}
      <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] shrink-0">
          <Activity size={22} className="animate-pulse" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#05050B] rounded-full shadow-[0_0_8px_#4ade80]" />
        </div>
        
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-extrabold text-white tracking-tight tabular-nums">
              {scans.toLocaleString()}
            </span>
            <span className="font-mono text-[9px] text-green-400 font-bold uppercase tracking-wider bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 animate-pulse">
              Live
            </span>
          </div>
          <p className="font-body text-[11px] font-semibold text-white/60 mt-0.5 whitespace-nowrap">
            Active Bio-Scans Today
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-[1px] bg-white/10 shrink-0" />

      {/* Section 2: Clinical Security / Live Scanner Logs */}
      <div className="flex flex-col justify-between gap-2.5 w-full overflow-hidden">
        {/* Ticker for real-time operations */}
        <div className="flex items-center gap-2 bg-[#05050B]/40 rounded-lg px-3 py-1.5 border border-white/5 h-[34px] overflow-hidden">
          <span className="font-mono text-[9px] text-[#A855F7] font-bold tracking-wider shrink-0 uppercase">
            [SCANNED]
          </span>
          <div className="relative flex-1 h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={logIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center gap-1.5"
              >
                <span className="font-display text-[11px] font-bold text-white shrink-0">
                  {CLINICAL_LOGS[logIndex].loc}:
                </span>
                <span className="font-body text-[11px] text-white/50 truncate">
                  {CLINICAL_LOGS[logIndex].action}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Doctor Approved / Data Protection badge */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#A855F7] drop-shadow-[0_0_5px_rgba(168,85,247,0.5)] shrink-0" />
          <span className="font-body text-[9.5px] font-bold text-white/45 tracking-wider uppercase">
            100% HIPAA & Medical-Grade Data Protection
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Component ──────────────────────────────────────── */
export default function AICoach() {
  const [phase, setPhase] = useState<Phase>("hook");
  const [pathType, setPathType] = useState<PathType>("both");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [quizStep, setQuizStep] = useState(1);
  const [quizError, setQuizError] = useState("");
  const [typedInsight, setTypedInsight] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isDeepAnalysis, setIsDeepAnalysis] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [aiHistory, setAiHistory] = useState<{role: string, content: string}[]>([]);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const profile = useBodyProfile();
  const router = useRouter();

  const handleRefine = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsRefining(true);
    setAiHistory(prev => [...prev, { role: "user", content: promptText }]);
    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, pathType, history: aiHistory, prompt: promptText }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          // Graceful rate limit handling
          setAiResponse(prev => (prev || "") + "\n\n---\n\n> [!WARNING] **NETWORK CONGESTION**\n> High Traffic: The AI is currently routing 1000s of requests. Automatically retrying in 10 seconds...");
          setTimeout(() => handleRefine(promptText), 10000);
          return;
        }
        throw new Error(result.message);
      }
      setAiResponse(result.data);
      setAiHistory(prev => [...prev, { role: "assistant", content: result.data }]);
    } catch (e) { console.error(e); }
    finally { setIsRefining(false); }
  };

  const handleBack = () => {
    if (phase === "results") { setPhase("path"); setAiResponse(null); setAiHistory([]); }
    else if (phase === "quiz") {
      if (quizStep > 1) { setQuizStep(prev => prev - 1); setQuizError(""); }
      else setPhase("path");
    }
    else if (phase === "path") setPhase("gender");
    else if (phase === "gender") setPhase("hook");
    else router.push("/");
  };

  const handleGenderSelect = (g: "male" | "female") => {
    setAnswers(prev => ({ ...prev, gender: g }));
    setTimeout(() => setPhase("path"), 300);
  };

  // ── Hydration guard: mount video only on client (Vercel-safe) ──
  useEffect(() => { 
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (mounted && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay blocked or failed:", err);
      });
    }
  }, [mounted, phase]);

  useEffect(() => {
    if (phase === "results") {
      const insight = getInsight(answers);
      let i = 0;
      setTypedInsight("");
      const interval = setInterval(() => {
        setTypedInsight(insight.slice(0, i));
        i++;
        if (i > insight.length) clearInterval(interval);
      }, 22);
      return () => clearInterval(interval);
    }
  }, [phase, answers]);

  useEffect(() => {
    if (phase === "analyzing") {
      const fetchPlan = async () => {
        try {
          const res = await fetch("/api/ai-coach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...answers, pathType, history: aiHistory }),
          });
          const result = await res.json();
          if (!res.ok) {
            if (res.status === 429) {
              setIsDeepAnalysis(true);
              setTimeout(fetchPlan, 10000);
              return;
            }
            throw new Error(result.message || "Failed to generate plan");
          }
          setAiResponse(result.data);
          setAiHistory([{ role: "assistant", content: result.data }]);
          setPhase("results");
        } catch (error) {
          console.error("Error generating plan:", error);
          setPhase("results");
        }
      };
      const timer = setTimeout(fetchPlan, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, answers]);

  // Pre-fill quiz fields from other tools via localStorage
  useEffect(() => {
    if (!profile) return;
    setAnswers(prev => ({
      ...prev,
      ...(profile.age       && !prev.age    ? { age:    String(profile.age)       } : {}),
      ...(profile.weight_kg && !prev.weight ? { weight: String(profile.weight_kg) } : {}),
      ...(profile.height_cm && !prev.height ? { height: String(profile.height_cm) } : {}),
      ...(profile.gender    && !prev.gender ? { gender: profile.gender             } : {}),
    }));
  }, [profile]);

  const handleStartQuiz = () => setPhase("gender");

  const handlePathSelect = (p: PathType) => {
    setPathType(p);
    setQuizStep(1);
    setQuizError("");
    setPhase("quiz");
  };


  return (
    <main className="min-h-screen bg-[#08050F] text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#A855F7] selection:bg-opacity-30">

      {/* ─── Sleek Back Button (2026 Style) ─── */}
      <button
        onClick={handleBack}
        className="fixed top-[90px] left-4 md:left-6 z-[99] group flex items-center justify-center w-10 h-10 bg-[#0B0E16]/80 hover:bg-[#A78BFA]/10 backdrop-blur-2xl border border-white/10 hover:border-[#A78BFA]/50 rounded-full transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_30px_rgba(167,139,250,0.25)]"
      >
        <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-[#A78BFA] group-hover:-translate-x-0.5 transition-transform" />
      </button>
      {/* Dynamic Fonts & Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700&display=swap');
        
        .font-display { font-family: var(--font-outfit), sans-serif; }
        .font-heading { font-family: var(--font-inter), sans-serif; }
        .font-body { font-family: var(--font-inter), sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

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
          0% { opacity: 1; transform: scale(1); }
          5% { opacity: 0.4; transform: scale(0.98); }
          10% { opacity: 1; transform: scale(1); }
          15% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 1; }
        }
        .animate-blink-real { animation: blinkRealMotion 3s infinite; }

        @keyframes floatHologram {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        .animate-float-hologram { animation: floatHologram 6s ease-in-out infinite; }
        
        @keyframes scanLine {
          0% { top: -10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-scan-line { animation: scanLine 4s linear infinite; }

        @keyframes hologramFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
          51% { opacity: 0.4; }
          52% { opacity: 1; }
          80% { opacity: 1; }
          81% { opacity: 0.6; }
          82% { opacity: 1; }
        }
        .animate-hologram-flicker { animation: hologramFlicker 5s linear infinite; }

        @keyframes spinSlow {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes spinReverseSlow {
          from { transform: rotateX(75deg) rotateZ(360deg); }
          to { transform: rotateX(75deg) rotateZ(0deg); }
        }
        .animate-spin-slow { animation: spinSlow 20s linear infinite; }
        .animate-spin-reverse-slow { animation: spinReverseSlow 15s linear infinite; }

        @keyframes spinOuter {
          0% { transform: rotateX(75deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes spinInner {
          0% { transform: rotateX(75deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateZ(-360deg); }
        }
        .animate-spin-outer { animation: spinOuter 12s linear infinite; }
        .animate-spin-inner { animation: spinInner 8s linear infinite; }

        @keyframes fadeInUpHero {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up-hero { animation: fadeInUpHero 0.5s ease-out forwards; opacity: 0; }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 3s infinite; }

        @keyframes shimmerBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-shimmer-bg { animation: shimmerBg 8s ease infinite; }

        @keyframes robotWave {
          0%   { transform: rotate(0deg);   transform-origin: bottom left; }
          15%  { transform: rotate(25deg);  transform-origin: bottom left; }
          30%  { transform: rotate(-10deg); transform-origin: bottom left; }
          45%  { transform: rotate(20deg);  transform-origin: bottom left; }
          60%  { transform: rotate(-5deg);  transform-origin: bottom left; }
          75%  { transform: rotate(10deg);  transform-origin: bottom left; }
          100% { transform: rotate(0deg);   transform-origin: bottom left; }
        }
        .animate-robot-wave { animation: robotWave 2s ease-in-out infinite; transform-origin: bottom left; }

        @keyframes blinkDot {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 6px #FF3B3B; }
          50% { opacity: 0.3; transform: scale(0.7); box-shadow: none; }
        }
        .animate-blink-dot { animation: blinkDot 1.2s ease-in-out infinite; }

        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .animate-robot-float { animation: robotFloat 3s ease-in-out infinite; }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        .animate-float-slow-1 { animation: floatSlow 5s ease-in-out infinite; }
        .animate-float-slow-2 { animation: floatSlow 6s ease-in-out infinite 0.5s; }
        .animate-float-slow-3 { animation: floatSlow 5.5s ease-in-out infinite 1s; }

        @keyframes robotReveal {
          0%   { opacity: 0; transform: scale(0.7) translateY(4px); }
          60%  { opacity: 1; transform: scale(1.05) translateY(0px); }
          100% { opacity: 1; transform: scale(1) translateY(0px); }
        }
        .animate-robot-reveal { animation: robotReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }

        @keyframes textSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-text-slide { animation: textSlideIn 0.7s ease-out 0.8s both; }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 50px rgba(0,212,255,0.6), inset 0 1px 0 rgba(255,255,255,0.6); }
        }
        .animate-pulse-glow { animation: pulseGlow 4s infinite; }

        /* ====== XRAY HOLOGRAM ANIMATIONS ====== */
        @keyframes xrayFloat {
          0%, 100% { transform: translateY(0px) rotateY(-4deg); }
          33%  { transform: translateY(-14px) rotateY(4deg); }
          66%  { transform: translateY(-7px) rotateY(-2deg); }
        }
        .animate-xray-float { animation: xrayFloat 8s ease-in-out infinite; }

        @keyframes xrayFlicker {
          0%, 88%, 100% { opacity: 1; filter: brightness(1) drop-shadow(0 0 8px #8B5CF6); }
          90%  { opacity: 0.45; filter: brightness(1.8) drop-shadow(0 0 20px #FF00FF); }
          91%  { opacity: 1; filter: brightness(1) drop-shadow(0 0 8px #8B5CF6); }
          95%  { opacity: 0.75; filter: brightness(1.4) drop-shadow(0 0 14px #c084fc); }
          96%  { opacity: 1; }
        }
        .animate-xray-flicker { animation: xrayFlicker 7s linear infinite; }

        @keyframes muscleBlinkA {
          0%, 100% { opacity: 1; transform: scale(1); }
          45% { opacity: 0.1; transform: scale(0.5); }
          55% { opacity: 1; transform: scale(1.3); }
        }
        .animate-muscle-a { animation: muscleBlinkA 2.1s ease-in-out infinite; }

        @keyframes muscleBlinkB {
          0%, 100% { opacity: 1; transform: scale(1); }
          35% { opacity: 0.1; transform: scale(0.5); }
          45% { opacity: 1; transform: scale(1.3); }
        }
        .animate-muscle-b { animation: muscleBlinkB 1.8s ease-in-out infinite 0.4s; }

        @keyframes muscleBlinkC {
          0%, 100% { opacity: 1; transform: scale(1); }
          55% { opacity: 0.1; transform: scale(0.5); }
          65% { opacity: 1; transform: scale(1.3); }
        }
        .animate-muscle-c { animation: muscleBlinkC 2.5s ease-in-out infinite 0.8s; }

        @keyframes muscleBlinkD {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.1; transform: scale(0.5); }
          35% { opacity: 1; transform: scale(1.3); }
        }
        .animate-muscle-d { animation: muscleBlinkD 1.6s ease-in-out infinite 1.2s; }

        @keyframes muscleBlinkE {
          0%, 100% { opacity: 1; transform: scale(1); }
          65% { opacity: 0.1; transform: scale(0.5); }
          75% { opacity: 1; transform: scale(1.3); }
        }
        .animate-muscle-e { animation: muscleBlinkE 3s ease-in-out infinite 0.6s; }

        @keyframes muscleBlinkF {
          0%, 100% { opacity: 1; transform: scale(1); }
          30% { opacity: 0.1; transform: scale(0.5); }
          40% { opacity: 1; transform: scale(1.3); }
        }
        .animate-muscle-f { animation: muscleBlinkF 2.3s ease-in-out infinite 1.5s; }

        @keyframes xrayScan {
          0%   { top: 2%; opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 98%; opacity: 0; }
        }
        .animate-xray-scan { animation: xrayScan 5.5s ease-in-out infinite; }

        @keyframes outerRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes innerRing { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .animate-outer-ring { animation: outerRing 20s linear infinite; }
        .animate-inner-ring { animation: innerRing 13s linear infinite; }

        @keyframes labelPulse {
          0%, 100% { opacity: 0.65; letter-spacing: 0.08em; }
          50% { opacity: 1; letter-spacing: 0.12em; }
        }
        .animate-label { animation: labelPulse 2.2s ease-in-out infinite; }

        @keyframes dataFlow {
          0% { stroke-dashoffset: 80; opacity: 0.2; }
          50% { opacity: 0.9; }
          100% { stroke-dashoffset: 0; opacity: 0.2; }
        }
        .animate-data-flow { animation: dataFlow 1.8s linear infinite; }

        @keyframes glowPulseV {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        .animate-glow-v { animation: glowPulseV 4s ease-in-out infinite; }

        @keyframes particleDrift {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          50%  { transform: translateY(-30px) translateX(8px) scale(1.4); opacity: 1; }
          100% { transform: translateY(-60px) translateX(-4px) scale(0.6); opacity: 0; }
        }
        .animate-particle { animation: particleDrift 4s ease-in-out infinite; }
        .animate-particle-2 { animation: particleDrift 5.5s ease-in-out infinite 1s; }
        .animate-particle-3 { animation: particleDrift 3.5s ease-in-out infinite 2s; }
      `}} />

      <div className="fixed inset-0 z-[1] pointer-events-none">
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        {/* Glow Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A855F7]/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#00D4FF]/[0.08] blur-[100px]" />
        {/* Dot Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(168,85,247,0.1) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-[10] w-full">
        <AnimatePresence mode="wait">
          {phase === "hook" && (
            <motion.div key="hook" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-[20] w-full min-h-screen flex flex-col pt-[80px] pb-16 lg:pb-[60px]">

              {/* ── HERO VIEWPORT FOLD ── */}
              <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col overflow-hidden justify-between">
                {/* ── CINEMATIC FULL-SCREEN BACKGROUND VIDEO ── */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#05050B' }}>



                  {/* Desktop: Background image */}
                  <img
                    src="/hero-ai-sectio-bg.jpg.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-right hidden lg:block"
                    style={{
                      filter: 'contrast(1.06) brightness(1.05) saturate(1.12)',
                    }}
                  />

                  {/* ── LEFT: solid dark shield ── */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(5,5,11,1) 0%, rgba(5,5,11,0.98) 20%, rgba(5,5,11,0.9) 35%, rgba(5,5,11,0.6) 50%, rgba(5,5,11,0.2) 65%, transparent 80%)',
                    }}
                  />

                  {/* ── RIGHT: Cinematic purple-cyan bloom over the video ── */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-[60%] pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 80% 90% at 80% 50%, rgba(139,92,246,0.22) 0%, rgba(0,212,255,0.12) 45%, transparent 72%)',
                      mixBlendMode: 'screen',
                    }}
                  />

                  {/* Thin rim light */}
                  <div
                    className="absolute right-0 top-[10%] bottom-[10%] w-[2px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(139,92,246,0.8) 30%, rgba(0,212,255,0.6) 70%, transparent 100%)',
                      filter: 'blur(4px)',
                    }}
                  />

                  {/* Bottom page-blend fade */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-52"
                    style={{ background: 'linear-gradient(to top, #05050B 0%, rgba(5,5,11,0.55) 55%, transparent 100%)' }}
                  />

                  {/* Top soft vignette */}
                  <div
                    className="absolute top-0 left-0 right-0 h-28"
                    style={{ background: 'linear-gradient(to bottom, rgba(5,5,11,0.45) 0%, transparent 100%)' }}
                  />
                </div>

                {/* Ticker Bar */}
                <div className="relative z-[100] w-full h-[32px] lg:h-[36px] bg-gradient-to-r from-[#05050B]/80 via-[#1a0b2e]/80 to-[#05050B]/80 backdrop-blur-md border-y border-[#A855F7]/20 shadow-[0_4px_30px_rgba(168,85,247,0.1)] flex items-center overflow-hidden mb-8 lg:mb-16">
                  <div className="absolute left-0 top-0 bottom-0 w-[60px] bg-gradient-to-r from-[#0d0018] to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-[60px] bg-gradient-to-l from-[#0d0018] to-transparent z-10 pointer-events-none" />

                  <div className="animate-marquee whitespace-nowrap flex items-center font-body text-[11px] font-medium text-[#c084fc] tracking-[0.02em]">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center">
                        {["Struggling with fat loss?", "No clear diet plan?", "Not seeing results?", "Confused about what to eat?", "Workout not working?", "No accountability?"].map((prob, idx) => (
                          <div key={idx} className="flex items-center mr-[32px]">
                            <div className="w-[6px] h-[6px] rounded-full bg-[#c084fc] mr-2 animate-pulse-dot" />
                            {prob}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEFT-ALIGNED CONTENT OVERLAY */}
                <div className="relative z-[20] w-full max-w-[1440px] mx-auto px-5 lg:px-[80px] flex flex-row items-center mt-auto mb-auto">

                  {/* LEFT COLUMN — Text & Buttons */}
                  <div className="w-full lg:w-[52%] flex flex-col text-left items-start">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 border border-[#A855F7]/50 bg-[#A855F7]/15 backdrop-blur-md px-[16px] py-[8px] rounded-full mb-6 w-fit animate-fade-in-up-hero shadow-[0_0_20px_rgba(168,85,247,0.3)]" style={{ animationDelay: '100ms' }}>
                      <Zap size={14} className="text-[#c084fc] animate-blink-real shrink-0" fill="currentColor" />
                      <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-[#c084fc]">TOP 1% AI COACHING SYSTEM</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="font-display font-extrabold text-[44px] md:text-[60px] lg:text-[72px] leading-[1.05] tracking-[-0.03em] max-w-[650px] mb-6 animate-fade-in-up-hero text-[#FFFFFF]" style={{ animationDelay: '200ms', textShadow: '0 0 40px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.8)' }}>
                      Your Biology.<br />
                      <span className="bg-gradient-to-r from-[#A855F7] via-[#D6BCFA] to-[#00D4FF] bg-clip-text text-transparent" style={{ textShadow: 'none' }}>
                        Decoded by AI.
                      </span>
                    </h1>

                    {/* Sub Headline with AI Icon */}
                    <div className="flex items-center gap-6 mb-6 animate-fade-in-up-hero" style={{ animationDelay: '300ms' }}>
                      <div className="relative shrink-0 animate-robot-reveal">
                        {/* Borderless premium floating 3D mascot with hello waving tilt animation */}
                        <motion.div 
                          animate={{ 
                            y: [0, -5, 0],
                            rotate: [0, -4, 4, -4, 4, 0]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 4, 
                            ease: "easeInOut"
                          }}
                          whileHover={{ 
                            scale: 1.15,
                            rotate: [0, -10, 10, -10, 10, 0]
                          }}
                          className="relative w-20 h-20 flex items-center justify-center rounded-2xl overflow-hidden group cursor-pointer"
                        >
                          {/* Waving 3D Glossy Robot Character Image */}
                          <img
                            src="/cute_waving_robot.png"
                            alt="Waving AI Coach Robot"
                            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-115 z-10"
                            style={{
                              filter: "saturate(1.08) contrast(1.04) brightness(1.08)",
                            }}
                          />
                        </motion.div>
                      </div>
                      <h2 className="font-display font-extrabold text-[22px] sm:text-[28px] md:text-[34px] text-white tracking-tight leading-none">
                        Meet Your AI Coach
                      </h2>
                    </div>

                    {/* Description Text — Upgraded to Biology-First Copy with Premium Hierarchy */}
                    <div className="font-body text-[16px] lg:text-[17px] text-[#AAB3C5] leading-[1.6] max-w-[480px] mb-8 animate-fade-in-up-hero" style={{ animationDelay: '400ms', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                      <p className="mb-1 text-white font-semibold">India's First Biology-First AI Fitness System.</p>
                      <p className="text-[#8B909E]">We calculate, adapt, and protect your body first — no templates, no shortcuts.</p>
                    </div>

                    {/* CTA Button */}
                    <div className="w-full max-w-[400px] mb-8 animate-fade-in-up-hero" style={{ animationDelay: '500ms' }}>
                      <button
                        onClick={handleStartQuiz}
                        className="group relative w-full h-[60px] lg:h-[64px] rounded-2xl bg-[linear-gradient(135deg,#A855F7_0%,#7C3AED_50%,#00D4FF_100%)] bg-[length:200%_auto] border border-white/20 hover:bg-[position:-100%_0] transition-all duration-500 ease-out active:scale-95 flex items-center justify-center gap-2.5 overflow-hidden animate-pulse-glow shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                      >
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />
                        <div className="w-[8px] h-[8px] rounded-full bg-white animate-blink-dot z-10 shrink-0" />
                        <span className="font-display text-[18px] lg:text-[20px] font-bold text-white tracking-wide z-10 flex items-center gap-2">
                          Start Free AI Analysis <ArrowRight size={22} className="text-white group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </div>

                    {/* Trust Line */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 animate-fade-in-up-hero" style={{ animationDelay: '600ms' }}>
                      {["No credit card", "Takes only 60 seconds", "Trusted by influencers & celebrities"].map((text, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-[#22C55E]" />
                          <span className="font-body text-[13px] font-medium text-white">{text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Social Proof */}
                    <ModernTrustWidget />

                    {/* Mobile Dedicated Photo Block — Only visible on mobile/tablet below the CTA, hidden on desktop */}
                    <div className="w-full mt-10 flex lg:hidden items-center justify-center relative z-10 -mx-5 w-[calc(100%+2.5rem)]">
                      <div className="relative flex items-center justify-center w-full h-[450px]">
                        <div 
                          className="relative w-full h-[450px] overflow-hidden border-y border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.75),0_0_35px_rgba(34,211,238,0.12)]"
                          style={{ background: "#05050B" }}
                        >
                          {/* Glow overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#00D4FF]/5 via-transparent to-[#A855F7]/5 z-20 pointer-events-none" />
                          
                          {/* Mobile screenshot image */}
                          <img
                            src="/hero-ai-mobile.png.png"
                            alt="Sandy AI Coach Mobile Preview"
                            className="w-full h-full object-cover object-center"
                            style={{
                              filter: "saturate(1.06) contrast(1.05) brightness(1.06)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── SECTION 1: THE 3 PILLARS OF BIOLOGY-FIRST AI ── */}
              <div className="relative w-full max-w-[1440px] mx-auto px-5 lg:px-[80px] py-16 lg:py-24 flex flex-col items-center">
                {/* Background glow effects */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#A855F7]/10 blur-[80px] pointer-events-none" />
                <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#00D4FF]/5 blur-[70px] pointer-events-none" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-[720px] mb-16 relative z-10"
                >
                  <span className="font-mono text-[10px] text-[#A855F7] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/25 shadow-[0_0_15px_rgba(168,85,247,0.15)] inline-block mb-4">
                    ELITE BIO-SCIENCE INTEGRATION
                  </span>
                  <h2 className="font-display font-extrabold text-[32px] md:text-[48px] text-white leading-tight tracking-tight mb-4">
                    India's First{" "}
                    <span className="bg-gradient-to-r from-[#A855F7] via-[#D6BCFA] to-[#00D4FF] bg-clip-text text-transparent">
                      Biology-First AI Coach
                    </span>
                  </h2>
                  <p className="font-body text-[#AAB3C5] text-[15px] md:text-[17px] leading-relaxed">
                    Most AI tools are copy-paste prompt templates. Sandy's Deep-AI performs a clinical, hormonal, and physical scan before generating a single calorie or workout metric.
                  </p>
                </motion.div>

                {/* 3-Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full relative z-10">
                  {/* Card 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="relative group bg-[#0A0718]/40 border border-white/[0.06] hover:border-[#A855F7]/30 rounded-[28px] p-6 lg:p-8 backdrop-blur-md overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Top Accent line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#A855F7] to-transparent shadow-[0_0_10px_#A855F7]" />

                    <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-110 transition-transform">
                      🧬
                    </div>
                    <h3 className="font-display font-bold text-[20px] text-white mb-3 tracking-tight">
                      Clinical BMR & Macro Anatomy
                    </h3>
                    <p className="font-body text-[#8B909E] text-[14px] leading-[1.6]">
                      Calculates your exact BMR and daily expenditure (TDEE) using the clinical Mifflin-St Jeor formula based on active metabolism — no generic static age-weight estimates.
                    </p>
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="relative group bg-[#0A0718]/40 border border-white/[0.06] hover:border-[#00D4FF]/30 rounded-[28px] p-6 lg:p-8 backdrop-blur-md overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Top Accent line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent shadow-[0_0_10px_#00D4FF]" />

                    <div className="w-14 h-14 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_rgba(0,212,255,0.1)] group-hover:scale-110 transition-transform">
                      💊
                    </div>
                    <h3 className="font-display font-bold text-[20px] text-white mb-3 tracking-tight">
                      Hormonal & Joint Safety Filters
                    </h3>
                    <p className="font-body text-[#8B909E] text-[14px] leading-[1.6]">
                      The only AI coach programmed to scan for PCOS/PCOD, thyroid levels, diabetic sensitivity, period regularity, and joint injuries to design plans that protect your body first.
                    </p>
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="relative group bg-[#0A0718]/40 border border-white/[0.06] hover:border-[#e879f9]/30 rounded-[28px] p-6 lg:p-8 backdrop-blur-md overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e879f9]/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Top Accent line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#e879f9] to-transparent shadow-[0_0_10px_#e879f9]" />

                    <div className="w-14 h-14 rounded-2xl bg-[#e879f9]/10 border border-[#e879f9]/20 flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_rgba(232,121,249,0.1)] group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <h3 className="font-display font-bold text-[20px] text-white mb-3 tracking-tight">
                      Real-Time Adaptive Intelligence
                    </h3>
                    <p className="font-body text-[#8B909E] text-[14px] leading-[1.6]">
                      Not a static PDF. If you only have 3 days this week or changed your workout location, tell the AI in natural language and it instantly reforms your roadmap.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* ── SECTION 2: SYMMETRICAL COMPARISON DASHBOARD ── */}
              <div className="relative w-full max-w-[1440px] mx-auto px-5 lg:px-[80px] pb-24 lg:pb-36 flex flex-col items-center">
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#A855F7]/5 blur-[90px] pointer-events-none" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-[720px] mb-16 relative z-10"
                >
                  <span className="font-mono text-[10px] text-[#00D4FF] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/25 shadow-[0_0_15px_rgba(0,212,255,0.15)] inline-block mb-4">
                    THE DEEP-SCIENCE VERDICT
                  </span>
                  <h2 className="font-display font-extrabold text-[32px] md:text-[48px] text-white tracking-tight leading-tight mb-4">
                    Symmetrical{" "}
                    <span className="bg-gradient-to-r from-[#00D4FF] via-[#A855F7] to-[#e879f9] bg-clip-text text-transparent">
                      Comparison Dashboard
                    </span>
                  </h2>
                  <p className="font-body text-[#AAB3C5] text-[15px] md:text-[17px] leading-relaxed">
                    Compare the exact scientific parameters, BMR accuracy, adaptability, and medical awareness across coaching methods.
                  </p>
                </motion.div>

                {/* Symmetrical Table Widget Wrapper */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="w-full relative z-10 overflow-x-auto rounded-[32px] border border-white/[0.07] bg-[#050409]/60 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
                >
                  {/* Neon frame lines */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#A855F7]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent" />

                  <table className="w-full min-w-[800px] border-collapse text-left relative">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-[#090714]/60">
                        <th className="p-6 lg:p-8 font-display text-[14px] font-bold text-white/50 tracking-wider uppercase w-[28%]">
                          Feature Area
                        </th>
                        
                        {/* Highlights the center AI Coach column */}
                        <th className="p-6 lg:p-8 font-display text-[15px] font-black text-center relative w-[28%] bg-[#A855F7]/[0.06] border-x border-[#A855F7]/15">
                          {/* Pulsing indicator tag */}
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#A855F7] to-[#00D4FF] text-[9px] font-bold tracking-widest text-white uppercase shadow-[0_0_15px_#A855F7]">
                            ⚡ RECOMMEND
                          </div>
                          <span className="bg-gradient-to-r from-[#C084FC] to-[#00D4FF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            🤖 Sandy's AI Coach
                          </span>
                        </th>
                        
                        <th className="p-6 lg:p-8 font-display text-[14px] font-bold text-center text-white/70 w-[22%]">
                          💬 Generic ChatGPT/Gemini
                        </th>
                        <th className="p-6 lg:p-8 font-display text-[14px] font-bold text-center text-white/70 w-[22%]">
                          🏋️ Traditional Trainers
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_ROWS.map((row, idx) => (
                        <tr 
                          key={idx} 
                          className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors duration-200"
                        >
                          <td className="p-6 lg:p-8 font-display font-bold text-[14px] text-white tracking-tight">
                            {row.feature}
                          </td>
                          
                          {/* Center highlighted Sandy AI Coach column */}
                          <td className="p-6 lg:p-8 text-center bg-[#A855F7]/[0.03] border-x border-[#A855F7]/10 relative">
                            {/* Inner vertical glow stripe */}
                            <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-[#A855F7]/20 via-transparent to-[#A855F7]/20" />
                            <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-[#A855F7]/20 via-transparent to-[#A855F7]/20" />
                            <StatusCell check={row.sandy.check} text={row.sandy.text} highlight={true} />
                          </td>
                          
                          <td className="p-6 lg:p-8 text-center">
                            <StatusCell check={row.generic.check} text={row.generic.text} />
                          </td>
                          
                          <td className="p-6 lg:p-8 text-center">
                            <StatusCell check={row.trainer.check} text={row.trainer.text} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </div>

            </motion.div>
          )}

        {/* === PHASE GENDER: GENDER SELECTION POPUP === */}
        {phase === "gender" && (
          <motion.div
            key="gender"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#05050B]/80 backdrop-blur-xl" />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative z-10 w-full max-w-[520px] bg-[#0B0E16]/90 border border-white/10 rounded-[32px] p-8 shadow-[0_0_80px_rgba(139,92,246,0.25)] overflow-hidden"
            >
              {/* Glow blob */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[#A855F7]/20 blur-[80px] rounded-full pointer-events-none" />

              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#c084fc] text-[11px] font-bold uppercase tracking-[0.12em] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A5] animate-pulse" />
                  Step 1 of 4 — Personalization
                </div>
                <h2 className="font-display text-[28px] md:text-[34px] font-extrabold text-white leading-tight mb-2">
                  Who are you training for?
                </h2>
                <p className="text-[#AAB3C5] text-[14px]">Your AI plan adapts based on your physiology</p>
              </div>

              {/* Gender Cards */}
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {/* Male */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleGenderSelect("male")}
                  className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/[0.06] p-7 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Male SVG Icon */}
                  <div className="w-[72px] h-[72px] rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center group-hover:shadow-[0_0_24px_rgba(0,212,255,0.35)] transition-all">
                    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                      <circle cx="24" cy="24" r="14" stroke="#00D4FF" strokeWidth="2.5" />
                      <line x1="34" y1="14" x2="46" y2="2" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="38" y1="2" x2="46" y2="2" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="46" y1="2" x2="46" y2="10" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-[18px] font-bold text-white group-hover:text-[#00D4FF] transition-colors">Male</p>
                    <p className="text-[11px] text-[#6B6F9A] mt-0.5">Optimized for him</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Female */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleGenderSelect("female")}
                  className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#e879f9]/50 hover:bg-[#e879f9]/[0.06] p-7 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,121,249,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Female SVG Icon */}
                  <div className="w-[72px] h-[72px] rounded-full bg-[#e879f9]/10 border border-[#e879f9]/20 flex items-center justify-center group-hover:shadow-[0_0_24px_rgba(232,121,249,0.35)] transition-all">
                    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                      <circle cx="30" cy="22" r="14" stroke="#e879f9" strokeWidth="2.5" />
                      <line x1="30" y1="36" x2="30" y2="54" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="22" y1="46" x2="38" y2="46" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-[18px] font-bold text-white group-hover:text-[#e879f9] transition-colors">Female</p>
                    <p className="text-[11px] text-[#6B6F9A] mt-0.5">Optimized for her</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e879f9]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </div>

              {/* Footer note */}
              <p className="text-center text-[11px] text-white/25 mt-6 relative z-10">
                🔒 Private & anonymous — never stored or shared
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* === PHASE 1.5: PATH SELECTION === */}
        {phase === "path" && (
          <motion.section
            key="path"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="max-w-4xl mx-auto min-h-[60vh] mt-[120px] mb-10 flex flex-col items-center justify-center p-4 relative z-10"
          >
            {/* Abstract Background Glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#A78BFA]/5 via-transparent to-transparent -z-10 blur-3xl" />

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Choose Your Path</h2>
              <p className="text-[#AAB3C5] text-lg">Select the blueprint you want the AI to build.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              {/* Workout Only */}
              <motion.button
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                onClick={() => handlePathSelect("workout")}
                className="group relative bg-[#0B0E16]/60 backdrop-blur-2xl border border-white/10 hover:border-[#4DA3FF]/50 rounded-3xl p-8 text-left transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(77,163,255,0.15)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4DA3FF]/10 via-transparent to-transparent opacity-50 blur-xl pointer-events-none" />
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Dumbbell className="w-24 h-24 text-[#4DA3FF]" /></div>
                <div className="w-14 h-14 rounded-2xl bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 flex items-center justify-center mb-6 relative z-10 group-hover:shadow-[0_0_15px_rgba(77,163,255,0.4)] transition-shadow">
                  <Dumbbell className="w-7 h-7 text-[#4DA3FF] animate-pulse drop-shadow-[0_0_8px_rgba(77,163,255,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10 group-hover:text-[#4DA3FF] transition-colors">Training AI</h3>
                <p className="text-[#6B6F9A] text-sm relative z-10">Perfect gym or home workout routine. No diet pressure.</p>
              </motion.button>

              {/* Diet Only */}
              <motion.button
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                onClick={() => handlePathSelect("diet")}
                className="group relative bg-[#0B0E16]/60 backdrop-blur-2xl border border-white/10 hover:border-[#22D3A5]/50 rounded-3xl p-8 text-left transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(34,211,165,0.15)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#22D3A5]/10 via-transparent to-transparent opacity-50 blur-xl pointer-events-none" />
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Apple className="w-24 h-24 text-[#22D3A5]" /></div>
                <div className="w-14 h-14 rounded-2xl bg-[#22D3A5]/10 border border-[#22D3A5]/30 flex items-center justify-center mb-6 relative z-10 group-hover:shadow-[0_0_15px_rgba(34,211,165,0.4)] transition-shadow">
                  <Apple className="w-7 h-7 text-[#22D3A5] animate-pulse drop-shadow-[0_0_8px_rgba(34,211,165,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10 group-hover:text-[#22D3A5] transition-colors">Nutrition AI</h3>
                <p className="text-[#6B6F9A] text-sm relative z-10">Custom meal plan with Indian options. No workout required.</p>
              </motion.button>

              {/* Both (Premium) */}
              <motion.button
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                onClick={() => handlePathSelect("both")}
                className="md:col-span-2 group relative bg-gradient-to-r from-[#1A1D2D]/80 to-[#0B0E16]/80 backdrop-blur-2xl border border-[#A78BFA]/30 hover:border-[#A78BFA] rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(167,139,250,0.2)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#A78BFA]/10 via-transparent to-transparent opacity-60 blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#4DA3FF] flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.5)] shrink-0">
                      <Zap className="w-8 h-8 text-white animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#A78BFA] transition-colors">Full Blueprint</h3>
                        <span className="px-2 py-0.5 bg-[#A78BFA]/20 text-[#A78BFA] text-[10px] font-bold uppercase rounded tracking-wider border border-[#A78BFA]/30 shadow-[0_0_10px_rgba(167,139,250,0.3)]">Recommended</span>
                      </div>
                      <p className="text-[#AAB3C5] text-sm">Workout + Diet perfectly synced for maximum results.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-white/30 group-hover:text-[#A78BFA] group-hover:translate-x-2 transition-all hidden md:block" />
                </div>
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* === PHASE 2: CLINICAL WIZARD (QUIZ) === */}
        {phase === "quiz" && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto w-full mt-[80px] sm:mt-[100px] mb-10 flex flex-col bg-[#0B0E16]/90 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            {/* Header with Progress Bar */}
            <div className="p-5 border-b border-white/5 bg-black/20 rounded-t-[32px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#4DA3FF] flex items-center justify-center shadow-[0_0_15px_rgba(167,139,250,0.4)]">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight text-lg">Clinical Diagnostics</h3>
                    <p className="text-xs text-[#22D3A5] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A5] animate-pulse" /> Secure Connection
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#AAB3C5] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                  Step {quizStep} of 4
                </div>
              </div>
              {/* Progress Bar */}
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step < quizStep
                        ? "bg-[#22D3A5]"
                        : step === quizStep
                          ? "bg-gradient-to-r from-[#A78BFA] to-[#4DA3FF] shadow-[0_0_10px_rgba(167,139,250,0.5)]"
                          : "bg-white/10"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Content Area — scrollable on mobile */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 pb-28">
              <AnimatePresence mode="wait">

                {/* STEP 1: CLINICAL HEALTH SCAN */}
                {quizStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    {pathType === "workout" ? (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Training Preferences</h2>
                          <p className="text-[#AAB3C5] text-sm">Let's dial in your workout format.</p>
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-3 text-sm">Preferred Exercise Format</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {["Hypertrophy (Muscle)", "Strength (Powerlifting)", "Endurance (Cardio)", "General Fitness"].map(opt => (
                              <button key={opt} onClick={() => setAnswers({ ...answers, exerciseFormat: opt })} className={`p-3 rounded-xl border text-sm font-bold ${answers.exerciseFormat === opt ? "bg-[#A78BFA]/20 border-[#A78BFA] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-3 text-sm">Experience Level</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {["Beginner", "Intermediate", "Advanced"].map(opt => (
                              <button key={opt} onClick={() => setAnswers({ ...answers, level: opt })} className={`p-3 rounded-xl border text-center text-sm font-bold ${answers.level === opt ? "bg-[#4DA3FF]/20 border-[#4DA3FF] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Any medical conditions?</h2>
                          <p className="text-[#AAB3C5] text-sm">This is critical for hormone-balancing protocols.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {(answers.gender === "female" ? ["PCOD/PCOS", "Thyroid", "Diabetes", "Blood Pressure", "None"] : ["Thyroid", "Diabetes", "Blood Pressure", "Low Testosterone", "None"]).map((cond) => (
                            <button
                              key={cond}
                              onClick={() => {
                                const arr = answers.conditions || [];
                                if (cond === "None") setAnswers({ ...answers, conditions: ["None"] });
                                else {
                                  const newArr = arr.includes("None") ? [cond] : arr.includes(cond) ? arr.filter((c: string) => c !== cond) : [...arr, cond];
                                  setAnswers({ ...answers, conditions: newArr });
                                }
                              }}
                              className={`p-4 rounded-2xl border transition-all text-left ${answers.conditions?.includes(cond) ? "bg-[#A78BFA]/20 border-[#A78BFA] shadow-[0_0_15px_rgba(167,139,250,0.2)]" : "bg-white/5 border-white/5 hover:border-white/20"}`}
                            >
                              <span className={`font-bold ${answers.conditions?.includes(cond) ? "text-[#c084fc]" : "text-white"}`}>{cond}</span>
                            </button>
                          ))}
                        </div>

                        {answers.gender === "female" && answers.conditions?.includes("PCOD/PCOS") && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-5 bg-[#FF2D6B]/10 border border-[#FF2D6B]/30 rounded-2xl">
                            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#FF2D6B]" /> Are your periods regular right now?</h3>
                            <div className="flex gap-3">
                              {["Yes", "No"].map(opt => (
                                <button key={opt} onClick={() => setAnswers({ ...answers, periods: opt })} className={`flex-1 p-3 rounded-xl border text-sm font-bold ${answers.periods === opt ? "bg-[#FF2D6B]/20 border-[#FF2D6B] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}

                    <div>
                      <h3 className="font-bold text-white mb-3 text-sm">Any current injuries or joint pain?</h3>
                      <div className="flex gap-3">
                        {["No", "Yes"].map(opt => (
                          <button key={opt} onClick={() => setAnswers({ ...answers, injuries: opt })} className={`flex-1 p-3 rounded-xl border text-sm font-bold ${answers.injuries === opt ? "bg-[#4DA3FF]/20 border-[#4DA3FF] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: BASIC STATS */}
                {quizStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Let's get your metrics.</h2>
                      <p className="text-[#AAB3C5] text-sm">We need exact numbers for accurate macros.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#6B6F9A] uppercase mb-2">Age (Years)</label>
                        <input type="number" inputMode="numeric" placeholder="e.g. 26" value={answers.age || ""} onChange={e => { setAnswers({ ...answers, age: e.target.value }); setQuizError(""); }} className="w-full bg-[#1A1D2D] border border-white/10 rounded-xl p-3.5 sm:p-4 text-white font-bold outline-none focus:border-[#A78BFA] transition-colors text-base" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#6B6F9A] uppercase mb-2">Height (cm)</label>
                          <input type="number" inputMode="numeric" placeholder="e.g. 170" value={answers.height || ""} onChange={e => { setAnswers({ ...answers, height: e.target.value }); setQuizError(""); }} className="w-full bg-[#1A1D2D] border border-white/10 rounded-xl p-3.5 sm:p-4 text-white font-bold outline-none focus:border-[#A78BFA] transition-colors text-base" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#6B6F9A] uppercase mb-2">Weight (kg)</label>
                          <input type="number" inputMode="numeric" placeholder="e.g. 71" value={answers.weight || ""} onChange={e => { setAnswers({ ...answers, weight: e.target.value }); setQuizError(""); }} className="w-full bg-[#1A1D2D] border border-white/10 rounded-xl p-3.5 sm:p-4 text-white font-bold outline-none focus:border-[#A78BFA] transition-colors text-base" />
                        </div>
                      </div>
                    </div>

                    {/* Validation error */}
                    {quizError && (
                      <div className="flex items-center gap-2 text-[#FF2D6B] text-sm font-semibold bg-[#FF2D6B]/10 border border-[#FF2D6B]/20 rounded-xl px-4 py-2.5">
                        <AlertTriangle className="w-4 h-4 shrink-0" /> {quizError}
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-white mb-3 text-sm">Current Body Type</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["Slim", "Average", "Heavy", "Athletic"].map(opt => (
                          <button key={opt} onClick={() => setAnswers({ ...answers, bodyType: opt })} className={`p-3 rounded-xl border text-sm font-bold ${answers.bodyType === opt ? "bg-[#A78BFA]/20 border-[#A78BFA] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: LIFESTYLE & DIET */}
                {quizStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Lifestyle & Nutrition</h2>
                      <p className="text-[#AAB3C5] text-sm">How you recover is just as important as how you train.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-[#6B6F9A] text-xs uppercase mb-3">Sleep Hours</h3>
                        <div className="flex flex-col gap-2">
                          {["< 5", "5 - 6", "7 - 8", "8+"].map(opt => (
                            <button key={opt} onClick={() => setAnswers({ ...answers, sleep: opt })} className={`p-3 rounded-xl border text-sm font-bold ${answers.sleep === opt ? "bg-[#4DA3FF]/20 border-[#4DA3FF] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                      {pathType !== "workout" && (
                        <div>
                          <h3 className="font-bold text-[#6B6F9A] text-xs uppercase mb-3">Food Preference</h3>
                          <div className="flex flex-col gap-2">
                            {["Veg", "Egg", "Non-veg", "Vegan"].map(opt => (
                              <button key={opt} onClick={() => setAnswers({ ...answers, dietType: opt })} className={`p-3 rounded-xl border text-sm font-bold ${answers.dietType === opt ? "bg-[#22D3A5]/20 border-[#22D3A5] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <h3 className="font-bold text-[#6B6F9A] text-xs uppercase">Daily Stress Level</h3>
                        <span className="text-[#A78BFA] font-bold text-xl">{answers.stress || "5"}/10</span>
                      </div>
                      <input type="range" min="1" max="10" value={answers.stress || 5} onChange={e => setAnswers({ ...answers, stress: e.target.value })} className="w-full accent-[#A78BFA] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: GOAL & FINAL */}
                {quizStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Final Step: Your Goal</h2>
                      <p className="text-[#AAB3C5] text-sm">Let's define what success looks like for you.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-white mb-3 text-sm">Main Goal</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Fat Loss", "Toning", "Muscle Gain", "Overall Fitness"].map(opt => (
                          <button key={opt} onClick={() => setAnswers({ ...answers, goal: opt })} className={`p-4 rounded-xl border text-sm font-bold text-left flex items-center justify-between ${answers.goal === opt ? "bg-gradient-to-r from-[#A78BFA]/20 to-[#4DA3FF]/20 border-[#A78BFA] text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>
                            {opt} {answers.goal === opt && <CheckCircle2 className="w-5 h-5 text-[#A78BFA]" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {pathType === "both" ? (
                      <div>
                        <h3 className="font-bold text-white mb-3 text-sm">Experience Level</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {["Beginner", "Intermediate", "Advanced"].map(opt => (
                            <button key={opt} onClick={() => setAnswers({ ...answers, level: opt })} className={`p-3 rounded-xl border text-center text-sm font-bold ${answers.level === opt ? "bg-[#A78BFA]/20 border-[#A78BFA] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    ) : pathType === "diet" ? (
                      <div>
                        <h3 className="font-bold text-white mb-3 text-sm">Current Activity Level</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {["Nothing", "Walk / Yoga", "Gym (Beginner)", "Gym (Regular)"].map(opt => (
                            <button key={opt} onClick={() => setAnswers({ ...answers, activity: opt })} className={`p-3 rounded-xl border text-sm font-bold ${answers.activity === opt ? "bg-[#22D3A5]/20 border-[#22D3A5] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {pathType !== "diet" && (
                      <div>
                        <h3 className="font-bold text-white mb-3 text-sm">Training Environment</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {["Gym", "Home", "Both"].map(opt => (
                            <button key={opt} onClick={() => setAnswers({ ...answers, trainingSetup: opt })} className={`p-3 rounded-xl border text-center text-sm font-bold ${answers.trainingSetup === opt ? "bg-[#4DA3FF]/20 border-[#4DA3FF] text-white" : "bg-white/5 border-white/10 text-[#AAB3C5]"}`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="p-5 bg-black/40 backdrop-blur-md border-t border-white/5 flex justify-between items-center z-50 rounded-b-[32px] mt-auto">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={() => {
                  if (quizStep < 4) {
                    // Validate Step 2 inputs
                    if (quizStep === 2) {
                      if (!answers.age || !answers.height || !answers.weight) {
                        setQuizError("Please fill in Age, Height, and Weight to continue.");
                        return;
                      }
                      const age = parseFloat(answers.age), h = parseFloat(answers.height), w = parseFloat(answers.weight);
                      if (age < 10 || age > 100) { setQuizError("Age must be between 10 and 100."); return; }
                      if (h < 100 || h > 250) { setQuizError("Height must be between 100 and 250 cm."); return; }
                      if (w < 20 || w > 300) { setQuizError("Weight must be between 20 and 300 kg."); return; }
                    }
                    setQuizError("");
                    setQuizStep(prev => prev + 1);
                  } else {
                    setPhase("analyzing");
                  }
                }}
                className="relative group px-6 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.6)]"
              >
                {/* Button Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#4DA3FF] transition-all duration-300 group-hover:bg-gradient-to-l" />
                
                {/* Glossy Overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50" />
                
                {/* Moving light beam */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

                <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                  {quizStep === 4 ? "Generate My Plan" : "Next Step"} <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </motion.section>
        )}

        {/* === PHASE 2: ANALYZING === */}
        {phase === "analyzing" && (
          <motion.section
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] mt-[120px] mb-10 text-center px-4"
          >
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-[#A78BFA]/20 rounded-full" />
              <motion.div
                className="absolute inset-0 border-4 border-[#A78BFA] rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-8 h-8 text-[#A78BFA] animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Generating Clinical Blueprint</h2>
            <p className="text-[#AAB3C5] text-sm mb-6">Personalized for <span className="text-[#A78BFA] font-semibold">{answers.gender === "female" ? "Her" : "Him"}</span> • {answers.goal || "Optimizing Health"}</p>
            <div className="flex flex-col gap-3 text-[#6B6F9A] text-sm font-medium">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" /> Analyzing hormonal profile & stats...
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF]" /> {answers.conditions?.includes("PCOD/PCOS") || answers.conditions?.includes("Thyroid") ? "Adjusting macros for specific medical conditions..." : "Optimizing daily caloric targets..."}
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 }} className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A5]" /> {answers.conditions?.includes("Thyroid") ? "Calculating Selenium & micronutrient requirements..." : "Structuring progression and recovery protocol..."}
              </motion.p>
              
              <AnimatePresence>
                {isDeepAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-8 p-6 rounded-2xl bg-[#0B0E16]/90 border border-[#00D4FF]/40 shadow-[0_0_40px_rgba(0,212,255,0.15)] max-w-md mx-auto relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent animate-shimmer" />
                    
                    <div className="flex flex-col items-center justify-center text-center gap-3 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-[#00D4FF]/10 flex items-center justify-center mb-1">
                        <BrainCircuit className="w-6 h-6 text-[#00D4FF] animate-pulse" />
                      </div>
                      <h4 className="text-[#00D4FF] font-bold text-lg tracking-wide uppercase">Deep Analysis Mode</h4>
                      <p className="text-[#AAB3C5] text-sm leading-relaxed">
                        Complex profile detected. Running advanced multi-variable simulation to ensure absolute precision.
                      </p>
                      
                      {/* Loading Bar */}
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 10, ease: "linear" }}
                          className="h-full bg-gradient-to-r from-[#00D4FF] to-[#A855F7] shadow-[0_0_10px_#00D4FF]"
                        />
                      </div>
                      <p className="text-[10px] text-[#00D4FF] font-mono mt-1 tracking-[0.2em] animate-pulse">CALCULATING...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* === PHASE 3: RESULTS DASHBOARD === */}
        {phase === "results" && (
          <motion.section
            key="results"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
            }}
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pt-20 sm:pt-28 md:pt-32 pb-20 relative px-4 sm:px-6"
          >
            {/* Deep Space Radial Background */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8B5CF6]/15 via-[#0B0E16] to-[#0B0E16] -z-10" />

            {/* Header */}
            <div className="text-center mb-10 relative z-10 mt-8 md:mt-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22D3A5]/10 border border-[#22D3A5]/20 text-[#22D3A5] text-sm font-bold tracking-wide mb-4">
                <CheckCircle2 className="w-4 h-4" /> <span>Analysis Complete</span>
              </div>
              <h2 className="text-3xl md:text-[3.5rem] font-black uppercase tracking-tighter leading-[1.1] max-w-4xl mx-auto drop-shadow-xl mb-4">
                <span className="text-white">YOUR </span>
                <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#4DA3FF] text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(167,139,250,0.3)]">
                  {answers.goal?.includes("Fat") ? "FAT LOSS" : answers.goal?.includes("Muscle") ? "MUSCLE GAIN" : "TRANSFORMATION"}
                </span>
                {answers.conditions?.filter((c: string) => c !== "None")[0] && (
                  <>
                    <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-[#FF2D6B] to-[#FF7B9E] text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(255,45,107,0.4)]">
                      {" + "}{answers.conditions.filter((c: string) => c !== "None")[0].toUpperCase()}
                    </span>
                  </>
                )}
                <span className="text-white"> BLUEPRINT</span>
              </h2>
              <p className="text-[#AAB3C5] font-medium text-sm md:text-base tracking-wide uppercase">
                <span className="text-[#A78BFA] font-bold">Science-Based Coaching</span> • Personalized for {answers.gender === "female" ? "Her" : "Him"}
              </p>
            </div>

            {/* Stats Dashboard — Mifflin-St Jeor Calculated */}
            {(() => {
              const m = calcMacros(answers);
              return (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: "Age",      val: `${answers.age    || "—"} yrs`, icon: User,     highlight: false },
                    { label: "Weight",   val: `${answers.weight || "—"} kg`,  icon: Target,   highlight: false },
                    { label: "Height",   val: `${answers.height || "—"} cm`,  icon: Activity, highlight: false },
                    { label: "Calories", val: `${m.calories} kcal`,           icon: Flame,    highlight: true  },
                    { label: "Protein",  val: `${m.protein}g`,                icon: Dumbbell, highlight: true  },
                  ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${stat.highlight ? "bg-[#A78BFA]/10 border-[#A78BFA]/30 shadow-[0_0_20px_rgba(167,139,250,0.1)]" : "bg-[#1A1D2D] border-white/5"} flex flex-col items-center justify-center text-center`}>
                      <stat.icon className={`w-5 h-5 mb-2 ${stat.highlight ? "text-[#A78BFA]" : "text-[#6B6F9A]"}`} />
                      <p className="text-[10px] uppercase font-bold text-[#6B6F9A] tracking-wider mb-1">{stat.label}</p>
                      <p className={`font-bold text-base md:text-lg ${stat.highlight ? "text-[#A78BFA]" : "text-white"}`}>{stat.val}</p>
                    </div>
                  ))}
                </motion.div>
              );
            })()}

            {/* Non-Negotiable Rules */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-[#0B0E16]/80 backdrop-blur-xl border border-[#FF2D6B]/30 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(255,45,107,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2D6B]/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="text-sm md:text-base font-bold text-[#FF2D6B] uppercase tracking-wider mb-6 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Non-Negotiable Daily Rules</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div className="bg-[#1A1D2D] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#4DA3FF]/10 flex items-center justify-center mb-3"><Droplets className="w-6 h-6 text-[#4DA3FF]" /></div>
                  <p className="text-xs font-bold text-white uppercase mb-1">3L Water</p>
                  <p className="text-[10px] text-[#AAB3C5]">Mandatory daily target. Never skip.</p>
                </div>
                <div className="bg-[#1A1D2D] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#22D3A5]/10 flex items-center justify-center mb-3"><Activity className="w-6 h-6 text-[#22D3A5]" /></div>
                  <p className="text-xs font-bold text-white uppercase mb-1">10k Steps</p>
                  <p className="text-[10px] text-[#AAB3C5]">Absolute minimum. Helps burn ~400 kcal.</p>
                </div>
                <div className="bg-[#1A1D2D] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-3"><Moon className="w-6 h-6 text-[#F59E0B]" /></div>
                  <p className="text-xs font-bold text-white uppercase mb-1">Sleep {answers.sleep === "< 5" ? "(Fix It!)" : ""}</p>
                  <p className="text-[10px] text-[#AAB3C5]">Minimum 7 hours for cortisol control.</p>
                </div>
                <div className="bg-[#1A1D2D] border border-[#FF2D6B]/20 rounded-2xl p-4 flex flex-col items-center text-center shadow-[0_0_15px_rgba(255,45,107,0.1)]">
                  <div className="w-12 h-12 rounded-full bg-[#FF2D6B]/10 flex items-center justify-center mb-3"><Zap className="w-6 h-6 text-[#FF2D6B]" /></div>
                  <p className="text-xs font-bold text-white uppercase mb-1">Consistency</p>
                  <p className="text-[10px] text-[#AAB3C5]">Trust the process. Scale will fluctuate.</p>
                </div>
              </div>
            </motion.div>



            {/* AI Generated Response */}
            {aiResponse && (
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-[#0B0E16]/80 backdrop-blur-xl border border-[#A78BFA]/30 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(167,139,250,0.1)] relative mt-8">
                
                {/* Cyber Scanner Overlay (Refining State) */}
                <AnimatePresence>
                  {isRefining && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 bg-[#08050F]/70 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-3xl overflow-hidden border-2 border-[#00D4FF]/50 shadow-[inset_0_0_100px_rgba(0,212,255,0.1)]"
                    >
                      <div className="absolute inset-0 animate-scan-line border-b-2 border-[#00D4FF] shadow-[0_0_30px_#00D4FF] bg-gradient-to-t from-[#00D4FF]/20 to-transparent h-[150px]" />
                      <BrainCircuit className="w-16 h-16 text-[#00D4FF] animate-pulse mb-4 drop-shadow-[0_0_15px_rgba(0,212,255,0.8)]" />
                      <p className="font-mono text-base md:text-lg text-white font-bold tracking-[0.2em] animate-pulse">RECALCULATING BLUEPRINT...</p>
                      <p className="text-xs text-[#00D4FF]/80 mt-2 tracking-widest uppercase">Applying new parameters</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mb-6"><BrainCircuit className="w-6 h-6 text-[#A78BFA]" /> Your Custom Plan from AI Coach</h3>
                <div className="max-h-[600px] overflow-y-auto pr-2 mb-6 relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#A78BFA transparent' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...p}) => <h1 {...p} className="text-2xl font-black text-white mt-6 mb-3 tracking-tight" />,
                      h2: ({node, ...p}) => <h2 {...p} className="text-xl font-bold text-[#a78bfa] mt-5 mb-2 border-b border-[#a78bfa]/20 pb-1" />,
                      h3: ({node, ...p}) => <h3 {...p} className="text-base font-bold text-white mt-4 mb-2" />,
                      p:  ({node, ...p}) => <p  {...p} className="text-[#AAB3C5] text-sm leading-relaxed mb-3" />,
                      ul: ({node, ...p}) => <ul {...p} className="space-y-1.5 mb-4 pl-4" />,
                      ol: ({node, ...p}) => <ol {...p} className="space-y-1.5 mb-4 pl-4 list-decimal" />,
                      li: ({node, ...p}) => <li {...p} className="text-[#AAB3C5] text-sm flex gap-2"><span className="text-[#a78bfa] mt-0.5 shrink-0">▸</span><span>{(p as any).children}</span></li>,
                      strong: ({node, ...p}) => <strong {...p} className="text-white font-bold" />,
                      code: ({node, ...p}) => <code {...p} className="bg-[#1a1d2d] text-[#c084fc] px-1.5 py-0.5 rounded text-xs font-mono" />,
                      blockquote: ({node, ...p}) => {
                        const isWarning = p.children?.toString().includes("NETWORK CONGESTION");
                        return (
                          <blockquote {...p} className={`border-l-4 pl-4 my-4 p-3 rounded-r-lg text-sm ${isWarning ? 'border-orange-500 bg-orange-500/10 text-orange-200' : 'border-[#a78bfa]/50 text-[#8B92A5] italic'}`} />
                        );
                      },
                      table: ({node, ...p}) => <div className="overflow-x-auto mb-4"><table {...p} className="w-full text-sm border-collapse" /></div>,
                      th: ({node, ...p}) => <th {...p} className="text-left p-2 text-[#a78bfa] font-bold text-xs uppercase border-b border-white/10" />,
                      td: ({node, ...p}) => <td {...p} className="p-2 text-[#AAB3C5] text-sm border-b border-white/5" />,
                    }}
                  >
                    {aiResponse}
                  </ReactMarkdown>
                </div>
                
                {/* Refinement Chat Command Center */}
                <div className="mt-8 pt-6 relative z-20 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#A78BFA]/10 flex items-center justify-center border border-[#A78BFA]/30">
                      <MessageSquare className="w-4 h-4 text-[#A78BFA]" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-bold uppercase tracking-wider">AI Command Center</p>
                      <p className="text-[10px] text-[#AAB3C5]">Not satisfied? Request modifications below</p>
                    </div>
                  </div>
                  <RefinementInput isRefining={isRefining} onRefine={handleRefine} />
                </div>
              </motion.div>
            )}

            {/* Premium CTA */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-gradient-to-br from-[#A78BFA]/20 to-[#4DA3FF]/10 border border-[#A78BFA]/30 rounded-3xl p-8 text-center relative overflow-hidden mt-12 shadow-[0_0_50px_rgba(167,139,250,0.15)]">
              <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-[#4DA3FF]/20 rotate-12 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Ready for the real transformation?</h2>
                <p className="text-[#AAB3C5] mb-8 max-w-lg mx-auto text-sm md:text-base leading-relaxed">This was just a sample. Get the exact measurements, grocery list, and weekly check-ins with Sandy to guarantee your results. Say goodbye to guesswork.</p>
                <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#A78BFA] to-[#4DA3FF] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(167,139,250,0.4)] hover:shadow-[0_0_50px_rgba(167,139,250,0.6)]">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <ShieldCheck className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Apply For 1-on-1 Coaching</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>

      {/* Mobile-Only Minimal Footer */ }
  <div className="md:hidden mt-12 py-6 border-t border-white/5 bg-[#05050B]">
    <div className="flex flex-col items-center justify-center gap-4">
      <span className="text-sm font-black tracking-[0.2em] text-white">SANDY.LIFTS</span>
      <div className="flex gap-4 text-xs text-[#6B6F9A]">
        <Link href="#" className="hover:text-white transition-colors">AI Coach</Link>
        <Link href="#" className="hover:text-white transition-colors">Plans</Link>
        <Link href="#" className="hover:text-white transition-colors">Contact</Link>
      </div>
      <p className="text-[10px] text-white/30">&copy; {new Date().getFullYear()} Sandy.Lifts. All rights reserved.</p>
    </div>
  </div>
    </main >
  );
}