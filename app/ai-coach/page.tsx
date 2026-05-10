"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Dumbbell, Apple, Zap, User, Lock, ArrowRight, ShieldCheck,
  CheckCircle2, AlertTriangle, MessageSquare, Flame, BarChart3,
  BrainCircuit, RefreshCw, TrendingDown, TrendingUp, Wrench, MapPin, Salad, ChevronRight, Activity, ArrowLeft,
  Droplets, Moon, Clock
} from "lucide-react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────── */
type Phase = "hook" | "gender" | "path" | "quiz" | "analyzing" | "results";
type PathType = "workout" | "diet" | "both";

interface QuizOption { emoji: string; label: string; desc: string; badge?: string; }
interface QuizQuestion { id: string; text: string; subtitle: string; options: QuizOption[]; }
interface ChatMessage { id: string; sender: "ai" | "user"; text: string; options?: QuizOption[]; isTeaser?: boolean; }

/* ─── Core 3 Questions (always shown) ───────────────── */
const CORE_Q: QuizQuestion[] = [
  {
    id: "goal", text: "What's your main goal right now?", subtitle: "Be honest — no judgment here 💬",
    options: [
      { emoji: "🔥", label: "Lose Fat", desc: "Slim, lean aur confident dikhna chahta/chahti hoon" },
      { emoji: "💪", label: "Build Muscle", desc: "Strong, bigger aur powerful banna chahta/chahti hoon" },
      { emoji: "⚡", label: "Transform Completely", desc: "Fat ghataana + muscle build — complete change chahiye", badge: "Most Popular" },
    ]
  },
  {
    id: "level", text: "How long have you been training consistently?", subtitle: "This shapes your entire blueprint",
    options: [
      { emoji: "🌱", label: "Just Starting", desc: "Gym/exercise abhi start ki hai ya restart kar raha hoon" },
      { emoji: "🔥", label: "Some Experience", desc: "6+ months active hoon but results slow hain" },
      { emoji: "💎", label: "Experienced", desc: "2+ years serious training, next level chahiye" },
    ]
  },
  {
    id: "location", text: "Where do you train most often?", subtitle: "We'll build your plan around your setup",
    options: [
      { emoji: "🏋️", label: "Gym", desc: "Full equipment available" },
      { emoji: "🏠", label: "Home / Outdoor", desc: "Minimal or no equipment" },
      { emoji: "🔄", label: "Both", desc: "Flexible — gym + home mix" },
    ]
  },
];



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

/* ─── Component ──────────────────────────────────────── */
export default function AICoach() {
  const [phase, setPhase] = useState<Phase>("hook");
  const [pathType, setPathType] = useState<PathType>("both");
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [quizStep, setQuizStep] = useState(1);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [typedInsight, setTypedInsight] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isDeepAnalysis, setIsDeepAnalysis] = useState(false);
  const [refineInput, setRefineInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [aiHistory, setAiHistory] = useState<{role: string, content: string}[]>([]);
  const router = useRouter();

  const handleRefine = async () => {
    if (!refineInput.trim()) return;
    const promptText = refineInput;
    setRefineInput("");
    setIsRefining(true);
    
    setAiHistory(prev => [...prev, { role: "user", content: promptText }]);
    
    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, pathType, history: aiHistory, prompt: promptText }),
      });
      const result = await res.json();
      if (res.ok) {
        setAiResponse(result.data);
        setAiHistory(prev => [...prev, { role: "assistant", content: result.data }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };


  const handleBack = () => {
    if (phase === "results") setPhase("quiz");
    else if (phase === "quiz") {
      if (quizStep > 1) setQuizStep(prev => prev - 1);
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
          // Keep it false initially
          const res = await fetch("/api/ai-coach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...answers, pathType, history: aiHistory }),
          });
          const result = await res.json();
          
          if (!res.ok) {
            if (res.status === 429) {
              setIsDeepAnalysis(true); // Trigger the Top 1% UX
              setTimeout(fetchPlan, 10000); // Smart Retry after 10s
              return;
            }
            throw new Error(result.message || "Failed to generate plan");
          }
          
          setAiResponse(result.data);
          setAiHistory([{ role: "assistant", content: result.data }]);
          setPhase("results");
        } catch (error) {
          console.error("Error generating plan:", error);
          setPhase("results"); // Fallback to results if error
        }
      };

      const timer = setTimeout(fetchPlan, 1500); // Small UI delay before fetch
      return () => clearTimeout(timer);
    }
  }, [phase, answers]);

  useEffect(() => {
    if (phase === "quiz" && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory, phase]);

  const handleStartQuiz = () => setPhase("gender");

  const handlePathSelect = (p: PathType) => {
    setPathType(p);
    setPhase("quiz");
    setCurrentQIdx(0);
    setChatHistory([
      { id: "intro", sender: "ai", text: "Perfect. 3 quick questions and your blueprint is ready ⚡" },
      { id: "q-0", sender: "ai", text: CORE_Q[0].text, options: CORE_Q[0].options }
    ]);
  };

  const handleAnswer = (answer: string) => {
    const q = CORE_Q[currentQIdx];
    const msgId = `q-${currentQIdx}`;
    setAnswers(prev => ({ ...prev, [q.id]: answer }));
    setChatHistory(prev => [
      ...prev.map(m => m.id === msgId ? { ...m, options: undefined } : m),
      { id: `a-${currentQIdx}`, sender: "user", text: answer }
    ]);
    const isLast = currentQIdx === CORE_Q.length - 1;
    if (isLast) {
      setTimeout(() => { setPhase("analyzing"); }, 700);
    } else {
      const nextIdx = currentQIdx + 1;
      const nextQ = CORE_Q[nextIdx];
      setTimeout(() => {
        setChatHistory(prev => [...prev, { id: `q-${nextIdx}`, sender: "ai", text: nextQ.text, options: nextQ.options }]);
        setCurrentQIdx(nextIdx);
      }, 600);
    }
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
            <motion.div key="hook" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-[20] w-full min-h-screen pt-[80px] pb-16 lg:pb-[60px]">

              {/* Ticker Bar (Z=100) */}
              <div className="relative z-[100] w-full h-[30px] lg:h-[36px] bg-gradient-to-r from-[#05050B] via-[#1a0b2e] to-[#05050B] border-y border-[#A855F7]/20 shadow-[0_4px_30px_rgba(168,85,247,0.1)] flex items-center overflow-hidden">
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

              {/* Top Navigation Bar Removed */}

              <div className="max-w-[1440px] mx-auto px-5 lg:px-[80px] pt-6 lg:pt-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-[60px]">

                {/* LEFT COLUMN */}
                <div className="w-full lg:w-[55%] flex flex-col text-center lg:text-left relative z-[20]">

                  {/* Badge */}
                  <div className="inline-flex items-center justify-center lg:justify-start gap-2 border border-[#A855F7]/50 bg-[#A855F7]/15 px-[14px] py-[6px] rounded-full mb-5 mx-auto lg:mx-0 w-fit animate-fade-in-up-hero shadow-[0_0_16px_rgba(168,85,247,0.3)]" style={{ animationDelay: '100ms' }}>
                    <Zap size={13} className="text-[#c084fc] animate-blink-real shrink-0" fill="currentColor" />
                    <span className="font-heading text-[10px] font-bold tracking-[0.09em] uppercase text-[#c084fc]">TOP 1% AI COACHING SYSTEM</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="font-display font-bold text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-0.03em] max-w-[600px] mb-2 mx-auto lg:mx-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-fade-in-up-hero text-[#FFFFFF]" style={{ animationDelay: '200ms' }}>
                    Trends Fail. Science Wins.
                  </h1>

                  {/* Sub Headline with Robot */}
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 mb-5 animate-fade-in-up-hero" style={{ animationDelay: '300ms' }}>

                    {/* Cute Futuristic SVG Robot */}
                    <div className="relative shrink-0 w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] animate-robot-reveal">
                      <div className="animate-robot-float w-full h-full">
                        <svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                          <defs>
                            <radialGradient id="eyeGlowL" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#00D4FF" stopOpacity="1" />
                            </radialGradient>
                            <radialGradient id="eyeGlowR" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#00D4FF" stopOpacity="1" />
                            </radialGradient>
                            <linearGradient id="headG" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2d1060" />
                              <stop offset="100%" stopColor="#0e0528" />
                            </linearGradient>
                            <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1a0850" />
                              <stop offset="100%" stopColor="#080220" />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                          </defs>
                          {/* Antenna base */}
                          <line x1="30" y1="4" x2="30" y2="13" stroke="url(#eyeGlowL)" strokeWidth="1.5" strokeLinecap="round" />
                          {/* Antenna tip glowing */}
                          <circle cx="30" cy="3" r="2.5" fill="#00D4FF" filter="url(#glow)" className="animate-pulse-dot" />
                          {/* Head — big rounded cute */}
                          <rect x="10" y="13" width="40" height="24" rx="10" fill="url(#headG)" stroke="#A855F7" strokeWidth="1" />
                          {/* Visor strip across top of head */}
                          <rect x="13" y="13" width="34" height="7" rx="7" fill="#A855F7" opacity="0.2" />
                          {/* Eyes — large, cute, glowing */}
                          <rect x="15" y="19" width="10" height="9" rx="3" fill="url(#eyeGlowL)" filter="url(#glow)" />
                          <rect x="35" y="19" width="10" height="9" rx="3" fill="url(#eyeGlowR)" filter="url(#glow)" />
                          {/* Eye pupils */}
                          <circle cx="20" cy="23.5" r="2.5" fill="#0a0020" opacity="0.8" />
                          <circle cx="40" cy="23.5" r="2.5" fill="#0a0020" opacity="0.8" />
                          {/* Eye shine */}
                          <circle cx="21.5" cy="21.5" r="1" fill="white" opacity="0.9" />
                          <circle cx="41.5" cy="21.5" r="1" fill="white" opacity="0.9" />
                          {/* Smile */}
                          <path d="M21 31 Q30 36 39 31" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" fill="none" filter="url(#glow)" />
                          {/* Neck */}
                          <rect x="26" y="37" width="8" height="4" rx="2" fill="#7C3AED" opacity="0.7" />
                          {/* Body — rounded square */}
                          <rect x="13" y="41" width="34" height="22" rx="8" fill="url(#bodyG)" stroke="#7C3AED" strokeWidth="1" />
                          {/* Chest panel */}
                          <rect x="20" y="46" width="20" height="11" rx="4" fill="#A855F7" opacity="0.12" stroke="#A855F7" strokeWidth="0.5" />
                          {/* Chest glow dot */}
                          <circle cx="30" cy="51.5" r="3" fill="#00D4FF" opacity="0.9" filter="url(#glow)" className="animate-pulse-dot" />
                          <circle cx="30" cy="51.5" r="1.5" fill="white" opacity="0.7" />
                          {/* Left arm — static */}
                          <rect x="3" y="42" width="9" height="5" rx="2.5" fill="#7C3AED" opacity="0.85" />
                          <circle cx="2.5" cy="44.5" r="3" fill="#A855F7" opacity="0.7" />
                          {/* Right arm — continuous wave */}
                          <g className="animate-robot-wave" style={{ transformOrigin: '49px 43px' }}>
                            <rect x="48" y="41" width="9" height="5" rx="2.5" fill="#A855F7" opacity="0.9" />
                            <circle cx="58.5" cy="43.5" r="3.5" fill="#00D4FF" opacity="0.9" filter="url(#glow)" />
                            {/* Little sparkle on hand */}
                            <line x1="57" y1="41" x2="60" y2="38" stroke="#00D4FF" strokeWidth="0.8" opacity="0.6" />
                            <line x1="60" y1="42" x2="63" y2="41" stroke="#00D4FF" strokeWidth="0.8" opacity="0.6" />
                          </g>
                          {/* Legs */}
                          <rect x="18" y="63" width="9" height="6" rx="3" fill="#7C3AED" opacity="0.85" />
                          <rect x="33" y="63" width="9" height="6" rx="3" fill="#7C3AED" opacity="0.85" />
                          {/* Feet */}
                          <rect x="16" y="67" width="13" height="4" rx="2" fill="#A855F7" opacity="0.5" />
                          <rect x="31" y="67" width="13" height="4" rx="2" fill="#A855F7" opacity="0.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Gradient text */}
                    <h2 className="animate-text-slide font-display font-bold text-[21px] sm:text-[25px] md:text-[31px] lg:text-[37px] bg-[linear-gradient(to_right,#A855F7,#7C3AED,#00D4FF)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer-bg drop-shadow-[0_0_12px_rgba(168,85,247,0.35)] tracking-tight leading-[1.15]">
                      Meet Your Smart AI Coach
                    </h2>
                  </div>

                  {/* Description Text */}
                  <div className="font-body text-[15px] lg:text-[17px] text-[#AAB3C5] leading-[1.65] max-w-[480px] mb-8 mx-auto lg:mx-0 animate-fade-in-up-hero" style={{ animationDelay: '400ms' }}>
                    <p className="mb-2">Your body is unique. Your fitness plan should be too.<br />Let AI build your perfect roadmap.</p>
                    <p className="text-white/90 font-medium">You’ve tried the trends. Now, try the truth.</p>
                  </div>

                  {/* CTA Button */}
                  <div className="w-full max-w-[440px] mx-auto lg:mx-0 mb-6 animate-fade-in-up-hero" style={{ animationDelay: '500ms' }}>
                    <button
                      onClick={handleStartQuiz}
                      className="group relative w-full h-[56px] lg:h-[60px] rounded-2xl bg-[linear-gradient(135deg,#A855F7_0%,#7C3AED_50%,#00D4FF_100%)] bg-[length:200%_auto] border border-white/20 hover:bg-[position:-100%_0] transition-all duration-500 ease-out active:scale-95 flex items-center justify-center gap-2.5 overflow-hidden animate-pulse-glow"
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />
                      {/* Live blinking dot */}
                      <div className="w-[8px] h-[8px] rounded-full bg-white animate-blink-dot z-10 shrink-0" />
                      <span className="font-display text-[16px] lg:text-[18px] font-bold text-white tracking-wide z-10 flex items-center gap-2">
                        Start Free AI Analysis <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>

                  {/* Trust Line */}
                  <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-y-3 gap-x-5 mb-10 animate-fade-in-up-hero" style={{ animationDelay: '600ms' }}>
                    {[
                      "No credit card", "Takes only 60 seconds", "Trusted by influencers & celebrities"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#22C55E]" />
                        <span className="font-body text-[13px] md:text-[14px] font-medium text-white/[0.65]">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hologram - Mobile */}
                  <div className="lg:hidden w-full flex items-center justify-center relative my-6 animate-fade-in-up-hero" style={{ animationDelay: '700ms' }}>
                    <div className="relative w-[260px] h-[390px]">
                      {/* Deep glow aura */}
                      <div className="absolute inset-[-30%] rounded-full bg-[#7C3AED]/25 blur-[80px] animate-glow-v" />
                      <div className="absolute inset-[-12%] rounded-full bg-[#A855F7]/10 blur-[40px]" />
                      {/* Platform rings */}
                      <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[170px] h-[40px]">
                        <div className="absolute inset-0 rounded-[100%] border border-[#8B5CF6]/60 animate-outer-ring" />
                        <div className="absolute inset-[7px] rounded-[100%] border border-[#c084fc]/30 animate-inner-ring" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80px] h-[12px] bg-[#8B5CF6]/30 blur-lg rounded-full animate-glow-v" />
                      </div>
                      {/* Body image */}
                      <div className="absolute inset-0 flex items-center justify-center animate-xray-float" style={{ animationDuration: '8s' }}>
                        <img
                          src="/body-hologram.png"
                          alt="AI Body Analysis Model"
                          className="w-full h-full object-contain select-none pointer-events-none"
                          style={{
                            mixBlendMode: 'screen',
                            filter: 'hue-rotate(55deg) saturate(1.6) brightness(1.35) drop-shadow(0 0 20px rgba(139,92,246,0.9)) drop-shadow(0 0 50px rgba(167,139,250,0.5))',
                          }}
                        />
                      </div>
                      {/* Scan line */}
                      <div className="absolute left-[-15%] right-[-15%] h-[2px] animate-xray-scan pointer-events-none" style={{ background: 'linear-gradient(90deg,transparent,#7c3aed,#a855f7,#c084fc,#a855f7,#7c3aed,transparent)', boxShadow: '0 0 18px #8B5CF6, 0 0 36px rgba(139,92,246,0.3)' }} />
                      {/* HUD Labels */}
                      <div className="absolute top-[18%] -left-[82px] flex items-center gap-1.5">
                        <span className="font-mono text-[8px] font-bold tracking-[0.14em] animate-label" style={{ color: '#e879f9', textShadow: '0 0 8px #e879f9' }}>TRAPS</span>
                        <div className="w-[26px] h-[1px]" style={{ background: 'linear-gradient(to right,rgba(232,121,249,0.7),rgba(232,121,249,0.1))' }} />
                        <div className="w-[5px] h-[5px] rounded-full animate-muscle-a shrink-0" style={{ background: '#e879f9', boxShadow: '0 0 7px #e879f9' }} />
                      </div>
                      <div className="absolute top-[32%] -right-[78px] flex items-center gap-1.5">
                        <div className="w-[5px] h-[5px] rounded-full animate-muscle-c shrink-0" style={{ background: '#FF00FF', boxShadow: '0 0 7px #FF00FF' }} />
                        <div className="w-[22px] h-[1px]" style={{ background: 'linear-gradient(to left,rgba(255,0,255,0.7),rgba(255,0,255,0.1))' }} />
                        <span className="font-mono text-[8px] font-bold tracking-[0.14em] animate-label" style={{ color: '#e879f9', textShadow: '0 0 8px #FF00FF' }}>CHEST</span>
                      </div>
                      <div className="absolute top-[52%] -left-[72px] flex items-center gap-1.5">
                        <span className="font-mono text-[8px] font-bold tracking-[0.14em] animate-label" style={{ color: '#a78bfa', textShadow: '0 0 8px #a78bfa' }}>CORE</span>
                        <div className="w-[20px] h-[1px]" style={{ background: 'linear-gradient(to right,rgba(167,139,250,0.7),rgba(167,139,250,0.1))' }} />
                        <div className="w-[5px] h-[5px] rounded-full animate-muscle-d shrink-0" style={{ background: '#a78bfa', boxShadow: '0 0 7px #a78bfa' }} />
                      </div>
                    </div>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-fade-in-up-hero w-full max-w-[500px] mx-auto lg:mx-0" style={{ animationDelay: '800ms' }}>
                    {[
                      { icon: BrainCircuit, text: "AI Powered Personal Analysis" },
                      { icon: ShieldCheck, text: "Privacy First, Always" },
                      { icon: Target, text: "100% Plan Built For You" },
                      { icon: TrendingDown, text: "Data-Driven Predictions" }
                    ].map((feat, i) => (
                      <div key={i} className="group flex items-center gap-3 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-[16px] hover:-translate-y-1 hover:bg-[#A855F7]/[0.05] hover:border-[#A855F7]/[0.3] hover:shadow-[0_8px_20px_rgba(168,85,247,0.1)] transition-all duration-300 cursor-default">
                        <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#00D4FF]/20 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
                          <feat.icon size={18} className="text-[#00D4FF]" />
                        </div>
                        <span className="font-heading text-[13px] font-bold text-white/[0.85] leading-tight">{feat.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social Proof / Rating Card */}
                  <div className="flex flex-col sm:flex-row items-center justify-between bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl p-[20px] animate-fade-in-up-hero w-full max-w-[500px] mx-auto lg:mx-0" style={{ animationDelay: '900ms' }}>
                    <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left mb-4 sm:mb-0">
                      <div className="text-[#FBBF24] text-[16px] tracking-[4px] mb-1">★★★★★</div>
                      <div className="font-body text-[13px] font-semibold text-white/80">50,000+ Lives Transformed</div>
                    </div>
                    <div className="hidden sm:block w-[1px] h-[40px] bg-white/10 mx-4" />
                    <div className="w-full h-[1px] bg-white/10 my-4 sm:hidden" />
                    <div className="flex flex-col items-center sm:items-end gap-1 text-center sm:text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-[26px] font-extrabold text-white leading-none">4.9</span>
                        <span className="font-body text-[14px] text-white/50 font-medium">/5</span>
                      </div>
                      <span className="font-body text-[12px] text-[#00D4FF] font-semibold uppercase tracking-wider">User Rating</span>
                    </div>
                  </div>


                </div>

                {/* RIGHT COLUMN - 3D BODY MODEL (Desktop) */}
                <div className="hidden lg:flex w-[45%] items-center justify-center relative z-[10] min-h-[640px] animate-fade-in-up-hero" style={{ animationDelay: '550ms' }}>
                  <div className="relative flex items-center justify-center w-full h-[640px]">

                    {/* ── LEFT LABELS ── */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-around py-[70px] z-40 w-[100px]">
                      {[
                        { label: 'TRAPS',  color: '#e879f9', anim: 'animate-muscle-a' },
                        { label: 'CHEST',  color: '#FF00FF', anim: 'animate-muscle-c' },
                        { label: 'LATS',   color: '#c084fc', anim: 'animate-muscle-b' },
                        { label: 'ABS',    color: '#a78bfa', anim: 'animate-muscle-d' },
                        { label: 'QUADS',  color: '#8B5CF6', anim: 'animate-muscle-e' },
                        { label: 'CALVES', color: '#c084fc', anim: 'animate-muscle-f' },
                      ].map(({ label, color, anim }) => (
                        <div key={label} className="flex items-center gap-2 justify-end group">
                          <span className="font-mono text-[9px] font-bold tracking-[0.16em] animate-label transition-all" style={{ color, textShadow: `0 0 10px ${color}` }}>{label}</span>
                          <div className="w-[28px] h-[1px]" style={{ background: `linear-gradient(to right,${color}90,${color}15)` }} />
                          <div className={`w-[6px] h-[6px] rounded-full ${anim} shrink-0`} style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 16px ${color}60` }} />
                        </div>
                      ))}
                    </div>

                    {/* ── CENTRAL HOLOGRAM ── */}
                    <div className="relative w-[300px] h-[580px] mx-auto">
                      {/* Multi-layer glow aura */}
                      <div className="absolute inset-[-20%] rounded-full bg-[#7C3AED]/20 blur-[90px] animate-glow-v pointer-events-none" />
                      <div className="absolute inset-[-8%] rounded-full bg-[#A855F7]/10 blur-[50px] pointer-events-none" />

                      {/* Platform rings */}
                      <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-[240px] h-[56px]">
                        <div className="absolute inset-0 rounded-[100%] border border-[#8B5CF6]/65 animate-outer-ring" style={{ boxShadow: '0 0 20px rgba(139,92,246,0.35)' }} />
                        <div className="absolute inset-[7px] rounded-[100%] border border-[#c084fc]/35 animate-inner-ring" />
                        <div className="absolute inset-[-16px] rounded-[100%] border border-[#A855F7]/12 animate-outer-ring" style={{ animationDuration: '30s' }} />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110px] h-[14px] bg-[#8B5CF6]/35 blur-xl rounded-full animate-glow-v" />
                      </div>

                      {/* Body image */}
                      <div className="absolute inset-0 flex items-center justify-center animate-xray-float" style={{ animationDuration: '9s' }}>
                        <img
                          src="/body-hologram.png"
                          alt="3D AI Body Model"
                          className="w-full h-full object-contain select-none pointer-events-none"
                          style={{
                            mixBlendMode: 'screen',
                            filter: 'hue-rotate(55deg) saturate(1.65) brightness(1.3) drop-shadow(0 0 28px rgba(139,92,246,0.95)) drop-shadow(0 0 70px rgba(167,139,250,0.45)) drop-shadow(0 0 120px rgba(168,85,247,0.2))',
                          }}
                        />
                      </div>

                      {/* Scan line */}
                      <div className="absolute left-[-12%] right-[-12%] h-[3px] animate-xray-scan pointer-events-none" style={{ background: 'linear-gradient(90deg,transparent,#7c3aed,#a855f7,#c084fc,#a855f7,#7c3aed,transparent)', boxShadow: '0 0 24px #8B5CF6, 0 0 48px rgba(139,92,246,0.3)' }} />
                    </div>

                    {/* ── RIGHT LABELS ── */}
                    <div className="absolute right-0 top-0 h-full flex flex-col justify-around py-[70px] z-40 w-[100px]">
                      {[
                        { label: 'BICEPS',  color: '#c084fc', anim: 'animate-muscle-b' },
                        { label: 'DELTS',   color: '#a78bfa', anim: 'animate-muscle-a' },
                        { label: 'CORE',    color: '#8B5CF6', anim: 'animate-muscle-d' },
                        { label: 'GLUTES',  color: '#e879f9', anim: 'animate-muscle-c' },
                        { label: 'HAMS',    color: '#a78bfa', anim: 'animate-muscle-e' },
                        { label: 'TIBIAL',  color: '#c084fc', anim: 'animate-muscle-f' },
                      ].map(({ label, color, anim }) => (
                        <div key={label} className="flex items-center gap-2 justify-start group">
                          <div className={`w-[6px] h-[6px] rounded-full ${anim} shrink-0`} style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 16px ${color}60` }} />
                          <div className="w-[28px] h-[1px]" style={{ background: `linear-gradient(to left,${color}90,${color}15)` }} />
                          <span className="font-mono text-[9px] font-bold tracking-[0.16em] animate-label" style={{ color, textShadow: `0 0 10px ${color}` }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* ── HUD CARDS ── */}
                    <div className="absolute top-[10px] left-[106px] bg-black/75 backdrop-blur-xl border border-[#8B5CF6]/30 rounded-2xl p-3.5 z-30 shadow-[0_0_30px_rgba(139,92,246,0.18)] w-[140px]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#e879f9] animate-muscle-a" />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Metabolic Rate</span>
                      </div>
                      <p className="text-[22px] font-mono text-white font-bold leading-none">1,842</p>
                      <p className="text-[9px] text-[#c084fc] mt-1 font-semibold flex items-center gap-1"><Activity size={9} /> ACTIVE SCAN</p>
                    </div>

                    <div className="absolute top-[10px] right-[106px] bg-black/75 backdrop-blur-xl border border-[#FF00FF]/18 rounded-2xl p-3.5 z-30 shadow-[0_0_30px_rgba(255,0,255,0.08)] w-[140px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Muscle Density</span>
                        <TrendingUp size={11} className="text-[#e879f9]" />
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#FF00FF] rounded-full w-[78%]" style={{ boxShadow: '0 0 8px #8B5CF6' }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[16px] font-mono text-white font-bold">78.4%</span>
                        <span className="text-[9px] text-[#e879f9] font-bold">+1.2%</span>
                      </div>
                    </div>

                    <div className="absolute bottom-[8px] left-[106px] bg-black/75 backdrop-blur-xl border border-[#c084fc]/22 rounded-2xl p-3.5 z-30 shadow-[0_0_24px_rgba(192,132,252,0.12)] w-[140px]">
                      <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Body Composition</div>
                      <div className="flex items-end gap-1.5">
                        <span className="text-[22px] font-mono text-white font-bold">14.2</span>
                        <span className="text-[12px] text-[#c084fc] font-bold pb-0.5">BF%</span>
                      </div>
                      <div className="mt-1 text-[8px] text-[#FBBF24] flex items-center gap-1 font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />PEAK ATHLETIC RANGE
                      </div>
                    </div>

                    <div className="absolute bottom-[8px] right-[106px] bg-[#8B5CF6]/10 backdrop-blur-2xl border border-[#8B5CF6]/28 rounded-2xl p-4 z-30 shadow-[0_0_36px_rgba(139,92,246,0.18)] w-[140px]">
                      <div className="text-[9px] font-bold text-[#c084fc] uppercase tracking-[0.18em] mb-1.5">30-Day Projection</div>
                      <div className="flex items-center gap-2">
                        <div className="text-[24px] font-mono text-white font-bold leading-none">-5.2<span className="text-[14px] opacity-50">kg</span></div>
                        <div className="h-8 w-[1px] bg-[#8B5CF6]/30" />
                        <div className="text-[9px] text-white/65 leading-tight font-medium">94%<br />Confidence</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* ── AI METRICS GRAPH STRIP ── */}
              <div className="w-full max-w-[1440px] mx-auto px-5 lg:px-[80px] mt-6 animate-fade-in-up-hero" style={{ animationDelay: '1100ms' }}>
                <div className="relative bg-white/[0.02] border border-white/[0.07] rounded-2xl px-6 py-5 backdrop-blur-md overflow-hidden">
                  {/* subtle glow bg */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none" />
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22D3A5] animate-pulse" />
                    <span className="font-mono text-[10px] text-[#6B6F9A] uppercase tracking-[0.18em]">LIVE AI SCAN — PERFORMANCE METRICS</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-blink-dot" />
                      <span className="font-mono text-[9px] text-[#A855F7] font-bold tracking-widest">SCANNING</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                    {[
                      { label: 'Muscle Recovery', val: 94, color: '#A855F7', glow: 'rgba(168,85,247,0.5)' },
                      { label: 'Fat Burn Rate',   val: 78, color: '#00D4FF', glow: 'rgba(0,212,255,0.5)' },
                      { label: 'Metabolic Score', val: 86, color: '#e879f9', glow: 'rgba(232,121,249,0.5)' },
                      { label: 'Nutrition Sync',  val: 91, color: '#22D3A5', glow: 'rgba(34,211,165,0.5)' },
                    ].map(({ label, val, color, glow }) => (
                      <div key={label} className="flex flex-col gap-2">
                        <div className="flex justify-between items-baseline">
                          <span className="font-heading text-[11px] text-white/50 font-semibold">{label}</span>
                          <span className="font-mono text-[14px] font-bold" style={{ color, textShadow: `0 0 10px ${glow}` }}>{val}<span className="text-[10px] opacity-60">%</span></span>
                        </div>
                        <div className="relative h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${val}%`,
                              background: `linear-gradient(90deg, ${color}60, ${color})`,
                              boxShadow: `0 0 10px ${glow}, 0 0 20px ${glow}60`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between">
                          {[0,25,50,75,100].map(t => (
                            <div key={t} className="w-[1px] h-[4px] rounded-full" style={{ background: t <= val ? `${color}50` : 'rgba(255,255,255,0.06)' }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto h-auto max-h-[85vh] mt-[100px] mb-10 flex flex-col bg-[#0B0E16]/90 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl relative"
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

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-hide pb-32">
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

                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-[#6B6F9A] uppercase mb-2">Age (Years)</label>
                        <input type="number" placeholder="e.g. 26" value={answers.age || ""} onChange={e => setAnswers({ ...answers, age: e.target.value })} className="w-full bg-[#1A1D2D] border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-[#A78BFA] transition-colors" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#6B6F9A] uppercase mb-2">Height (cm)</label>
                          <input type="number" placeholder="e.g. 155" value={answers.height || ""} onChange={e => setAnswers({ ...answers, height: e.target.value })} className="w-full bg-[#1A1D2D] border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-[#A78BFA] transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#6B6F9A] uppercase mb-2">Weight (kg)</label>
                          <input type="number" placeholder="e.g. 71" value={answers.weight || ""} onChange={e => setAnswers({ ...answers, weight: e.target.value })} className="w-full bg-[#1A1D2D] border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-[#A78BFA] transition-colors" />
                        </div>
                      </div>
                    </div>

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
                  if (quizStep < 4) setQuizStep(prev => prev + 1);
                  else setPhase("analyzing");
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
            className="max-w-4xl mx-auto space-y-8 pt-24 md:pt-32 pb-24 relative px-4"
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

            {/* Stats Dashboard */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Age", val: `${answers.age || "26"} yrs`, icon: User },
                { label: "Weight", val: `${answers.weight || "70"} kg`, icon: Target },
                { label: "Height", val: `${answers.height || "160"} cm`, icon: Activity },
                { label: "Calories", val: `~${answers.goal?.includes("Fat") ? "1650" : "2200"}`, icon: Flame, highlight: true },
                { label: "Protein", val: `~${answers.goal?.includes("Muscle") ? "140" : "110"}g`, icon: Dumbbell, highlight: true }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${stat.highlight ? "bg-[#A78BFA]/10 border-[#A78BFA]/30 shadow-[0_0_20px_rgba(167,139,250,0.1)]" : "bg-[#1A1D2D] border-white/5"} flex flex-col items-center justify-center text-center`}>
                  <stat.icon className={`w-5 h-5 mb-2 ${stat.highlight ? "text-[#A78BFA]" : "text-[#6B6F9A]"}`} />
                  <p className="text-[10px] uppercase font-bold text-[#6B6F9A] tracking-wider mb-1">{stat.label}</p>
                  <p className={`font-bold text-lg md:text-xl ${stat.highlight ? "text-[#A78BFA]" : "text-white"}`}>{stat.val}</p>
                </div>
              ))}
            </motion.div>

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

            {/* Daily Schedule Grid */}
            {pathType !== "workout" && (
              <>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2"><Clock className="w-6 h-6 text-[#A78BFA]" /> Daily Schedule (Blueprint Unlocked)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Morning Card */}
                <div className="bg-[#1A1D2D]/80 border border-[#22D3A5]/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[#22D3A5]/60 transition-colors">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#22D3A5] shadow-[0_0_15px_rgba(34,211,165,0.5)]" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[#22D3A5] font-bold text-[10px] uppercase tracking-wider mb-1">6:30 - 7:00 AM</p>
                      <h4 className="text-white font-bold text-lg md:text-xl">Morning Ritual (Empty Stomach)</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#22D3A5]/10 flex items-center justify-center shrink-0"><Droplets className="w-5 h-5 text-[#22D3A5]" /></div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#22D3A5] font-bold mt-0.5">•</span> Warm water + Lemon squeeze + ACV (1 spoon)</li>
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#22D3A5] font-bold mt-0.5">•</span> {answers.conditions?.includes("Thyroid") ? "Take Thyroid medication first, wait 30 mins before anything" : "Soaked walnuts (2) and almonds (5) for healthy fats"}</li>
                  </ul>
                  <div className="bg-[#22D3A5]/10 border border-[#22D3A5]/20 rounded-xl p-4">
                    <p className="text-[10px] font-black text-[#22D3A5] uppercase tracking-wider mb-1 flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5" /> Sandy's Tip</p>
                    <p className="text-xs text-[#E2E8F0] font-medium leading-relaxed">Yeh drink insulin sensitivity aur digestion ke liye best morning start hai. Kabhi skip mat karna.</p>
                  </div>
                </div>

                {/* Pre-Workout / Breakfast */}
                <div className="bg-[#1A1D2D]/80 border border-[#FF2D6B]/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[#FF2D6B]/60 transition-colors">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF2D6B] shadow-[0_0_15px_rgba(255,45,107,0.5)]" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[#FF2D6B] font-bold text-[10px] uppercase tracking-wider mb-1">8:30 - 9:00 AM</p>
                      <h4 className="text-white font-bold text-lg md:text-xl">Pre-Workout & Breakfast</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FF2D6B]/10 flex items-center justify-center shrink-0"><Flame className="w-5 h-5 text-[#FF2D6B]" /></div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#FF2D6B] font-bold mt-0.5">•</span> Black Coffee or Beetroot + Amla Juice</li>
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#FF2D6B] font-bold mt-0.5">•</span> {answers.dietType === "Veg" || answers.dietType === "Vegan" ? "Tofu (100g) + Papaya (150g)" : "3 Egg Whites + 1 Whole Egg + Watermelon"}</li>
                  </ul>
                  <div className="bg-[#FF2D6B]/10 border border-[#FF2D6B]/20 rounded-xl p-4">
                    <p className="text-[10px] font-black text-[#FF2D6B] uppercase tracking-wider mb-1 flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5" /> Sandy's Tip</p>
                    <p className="text-xs text-[#E2E8F0] font-medium leading-relaxed">Beetroot nitric oxide boost karta hai - gym performance aur fat burning dono improve hoti hai.</p>
                  </div>
                </div>

                {/* Main Lunch */}
                <div className="bg-[#1A1D2D]/80 border border-[#4DA3FF]/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[#4DA3FF]/60 transition-colors">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4DA3FF] shadow-[0_0_15px_rgba(77,163,255,0.5)]" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[#4DA3FF] font-bold text-[10px] uppercase tracking-wider mb-1">1:30 - 2:00 PM</p>
                      <h4 className="text-white font-bold text-lg md:text-xl">Main Lunch</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#4DA3FF]/10 flex items-center justify-center shrink-0"><Salad className="w-5 h-5 text-[#4DA3FF]" /></div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#4DA3FF] font-bold mt-0.5">•</span> Rice (100g cooked) or 2 Multigrain Roti</li>
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#4DA3FF] font-bold mt-0.5">•</span> {answers.dietType === "Veg" ? "Dal (1 bowl) + Soya Chunks (40g)" : "Chicken Breast (100g) air-fried, minimal ghee"}</li>
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#4DA3FF] font-bold mt-0.5">•</span> Cucumber + Tomato + Lemon Salad (mandatory)</li>
                  </ul>
                  <div className="bg-[#4DA3FF]/10 border border-[#4DA3FF]/20 rounded-xl p-4">
                    <p className="text-[10px] font-black text-[#4DA3FF] uppercase tracking-wider mb-1 flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5" /> Sandy's Tip</p>
                    <p className="text-xs text-[#E2E8F0] font-medium leading-relaxed">Ek baar mein itna nahi khana isliye meals split kiye. Yeh protein hit metabolism ko active rakhega.</p>
                  </div>
                </div>

                {/* Dinner & Before Bed */}
                <div className="bg-[#1A1D2D]/80 border border-[#A78BFA]/30 rounded-3xl p-6 relative overflow-hidden group hover:border-[#A78BFA]/60 transition-colors">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A78BFA] shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[#A78BFA] font-bold text-[10px] uppercase tracking-wider mb-1">8:00 - 10:00 PM</p>
                      <h4 className="text-white font-bold text-lg md:text-xl">Dinner & Before Bed</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#A78BFA]/10 flex items-center justify-center shrink-0"><Moon className="w-5 h-5 text-[#A78BFA]" /></div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#A78BFA] font-bold mt-0.5">•</span> Dinner: {answers.dietType === "Veg" ? "Besan Chilla + Tofu stuffing" : "Fish/Chicken Tikka + Mixed Veggies"}</li>
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#A78BFA] font-bold mt-0.5">•</span> 30 min post-dinner walk (10k steps complete karo)</li>
                    <li className="text-sm text-[#AAB3C5] flex items-start gap-3 leading-relaxed"><span className="text-[#A78BFA] font-bold mt-0.5">•</span> Bedtime: Flaxseed powder (1 tsp) + Lukewarm Water</li>
                  </ul>
                  <div className="bg-[#A78BFA]/10 border border-[#A78BFA]/20 rounded-xl p-4">
                    <p className="text-[10px] font-black text-[#A78BFA] uppercase tracking-wider mb-1 flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5" /> Sandy's Tip</p>
                    <p className="text-xs text-[#E2E8F0] font-medium leading-relaxed">Isabgol ya Flaxseed = overnight gut cleansing. Subah fresh feel aayega guaranteed.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Daily Macros Footer */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-[#05050B] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-wrap gap-6 md:gap-10 items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-blue-500/5 to-green-500/5" />
              <h3 className="w-full text-center text-[10px] md:text-xs font-black text-[#6B6F9A] uppercase tracking-[0.2em] mb-2 relative z-10">Daily Macros Requirement</h3>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center"><Flame className="w-6 h-6 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" /></div>
                <div><p className="text-[10px] text-[#AAB3C5] uppercase font-bold tracking-wider">Calories</p><p className="font-bold text-white text-lg">~{answers.goal?.includes("Fat") ? "1650" : "2200"} kcal</p></div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden md:block relative z-10" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center"><Dumbbell className="w-6 h-6 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" /></div>
                <div><p className="text-[10px] text-[#AAB3C5] uppercase font-bold tracking-wider">Protein</p><p className="font-bold text-white text-lg">~{answers.goal?.includes("Muscle") ? "140" : "110"}g</p></div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden md:block relative z-10" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center"><Activity className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" /></div>
                <div><p className="text-[10px] text-[#AAB3C5] uppercase font-bold tracking-wider">Carbs</p><p className="font-bold text-white text-lg">~140g</p></div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden md:block relative z-10" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center"><Target className="w-6 h-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" /></div>
                <div><p className="text-[10px] text-[#AAB3C5] uppercase font-bold tracking-wider">Fats</p><p className="font-bold text-white text-lg">~55g</p></div>
              </div>
            </motion.div>
            </>
            )}

            {/* AI Generated Response */}
            {aiResponse && (
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-[#0B0E16]/80 backdrop-blur-xl border border-[#A78BFA]/30 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(167,139,250,0.1)] relative overflow-hidden mt-8">
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mb-6"><BrainCircuit className="w-6 h-6 text-[#A78BFA]" /> Your Custom Plan from AI Coach</h3>
                <div className="text-[#AAB3C5] font-body text-sm md:text-base whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto pr-4 mb-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#A78BFA transparent' }}>
                  {aiResponse}
                </div>
                
                {/* Refinement Chat */}
                <div className="border-t border-white/10 pt-6 mt-2">
                  <p className="text-xs text-[#AAB3C5] mb-3 font-bold uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#A78BFA]" /> Not satisfied? Refine your plan
                  </p>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={refineInput}
                      onChange={(e) => setRefineInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                      placeholder="E.g., 'Make it 3 days a week' or 'I want more arms focus'..." 
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#A78BFA]/50 transition-colors"
                      disabled={isRefining}
                    />
                    <button 
                      onClick={handleRefine}
                      disabled={isRefining || !refineInput.trim()}
                      className="bg-[#A78BFA] hover:bg-[#8B5CF6] disabled:opacity-50 text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors flex items-center justify-center min-w-[120px]"
                    >
                      {isRefining ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Update AI"}
                    </button>
                  </div>
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