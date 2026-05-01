"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Dumbbell, Apple, Zap, User, Lock, ArrowRight, ShieldCheck,
  CheckCircle2, AlertTriangle, MessageSquare, Flame, BarChart3,
  BrainCircuit, RefreshCw, TrendingDown, TrendingUp, Wrench, MapPin, Salad, ChevronRight, Activity, ArrowLeft
} from "lucide-react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────── */
type Phase = "hook" | "path" | "quiz" | "analyzing" | "results";
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
const getInsight = (a: Record<string,string>): string => {
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

const getCalorieBadge = (a: Record<string,string>) => {
  if ((a.goal||"").includes("Fat")) return { label:"Calorie Strategy", val:"300–500 kcal deficit", color:"#FF2D6B" };
  if ((a.goal||"").includes("Muscle")) return { label:"Calorie Strategy", val:"200–300 kcal surplus", color:"#38BDF8" };
  return { label:"Calorie Strategy", val:"Cycling approach", color:"#a78bfa" };
};

/* ─── Component ──────────────────────────────────────── */
export default function AICoach() {
  const [phase, setPhase]           = useState<Phase>("hook");
  const [pathType, setPathType]     = useState<PathType>("both");
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [answers, setAnswers]       = useState<Record<string,string>>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [typedInsight, setTypedInsight] = useState("");
  const router = useRouter();

  const handleBack = () => {
    if (phase === "results") setPhase("quiz");
    else if (phase === "quiz") setPhase("path");
    else if (phase === "path") setPhase("hook");
    else router.push("/");
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
    if (phase === "quiz" && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory, phase]);

  const handleStartQuiz = () => setPhase("path");

  const handlePathSelect = (p: PathType) => {
    setPathType(p);
    setPhase("quiz");
    setCurrentQIdx(0);
    setChatHistory([
      { id:"intro", sender:"ai", text:"Perfect. 3 quick questions and your blueprint is ready ⚡" },
      { id:"q-0",   sender:"ai", text: CORE_Q[0].text, options: CORE_Q[0].options }
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
      setTimeout(() => { setPhase("analyzing"); setTimeout(() => setPhase("results"), 2500); }, 700);
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
                  <div className="inline-flex items-center justify-center lg:justify-start gap-2 border border-[#A855F7]/50 bg-[#A855F7]/15 px-[14px] py-[6px] rounded-full mb-5 mx-auto lg:mx-0 w-fit animate-fade-in-up-hero shadow-[0_0_16px_rgba(168,85,247,0.3)]" style={{animationDelay: '100ms'}}>
                    <Zap size={13} className="text-[#c084fc] animate-blink-real shrink-0" fill="currentColor" />
                    <span className="font-heading text-[10px] font-bold tracking-[0.09em] uppercase text-[#c084fc]">TOP 1% AI COACHING SYSTEM</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="font-display font-bold text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-0.03em] max-w-[600px] mb-2 mx-auto lg:mx-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-fade-in-up-hero text-[#FFFFFF]" style={{animationDelay: '200ms'}}>
                    Trends Fail. Science Wins.
                  </h1>

                  {/* Sub Headline with Robot */}
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 mb-5 animate-fade-in-up-hero" style={{animationDelay: '300ms'}}>

                    {/* Cute Futuristic SVG Robot */}
                    <div className="relative shrink-0 w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] animate-robot-reveal">
                      <div className="animate-robot-float w-full h-full">
                        <svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                          <defs>
                            <radialGradient id="eyeGlowL" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                              <stop offset="100%" stopColor="#00D4FF" stopOpacity="1"/>
                            </radialGradient>
                            <radialGradient id="eyeGlowR" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                              <stop offset="100%" stopColor="#00D4FF" stopOpacity="1"/>
                            </radialGradient>
                            <linearGradient id="headG" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2d1060"/>
                              <stop offset="100%" stopColor="#0e0528"/>
                            </linearGradient>
                            <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1a0850"/>
                              <stop offset="100%" stopColor="#080220"/>
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                          </defs>
                          {/* Antenna base */}
                          <line x1="30" y1="4" x2="30" y2="13" stroke="url(#eyeGlowL)" strokeWidth="1.5" strokeLinecap="round"/>
                          {/* Antenna tip glowing */}
                          <circle cx="30" cy="3" r="2.5" fill="#00D4FF" filter="url(#glow)" className="animate-pulse-dot"/>
                          {/* Head — big rounded cute */}
                          <rect x="10" y="13" width="40" height="24" rx="10" fill="url(#headG)" stroke="#A855F7" strokeWidth="1"/>
                          {/* Visor strip across top of head */}
                          <rect x="13" y="13" width="34" height="7" rx="7" fill="#A855F7" opacity="0.2"/>
                          {/* Eyes — large, cute, glowing */}
                          <rect x="15" y="19" width="10" height="9" rx="3" fill="url(#eyeGlowL)" filter="url(#glow)"/>
                          <rect x="35" y="19" width="10" height="9" rx="3" fill="url(#eyeGlowR)" filter="url(#glow)"/>
                          {/* Eye pupils */}
                          <circle cx="20" cy="23.5" r="2.5" fill="#0a0020" opacity="0.8"/>
                          <circle cx="40" cy="23.5" r="2.5" fill="#0a0020" opacity="0.8"/>
                          {/* Eye shine */}
                          <circle cx="21.5" cy="21.5" r="1" fill="white" opacity="0.9"/>
                          <circle cx="41.5" cy="21.5" r="1" fill="white" opacity="0.9"/>
                          {/* Smile */}
                          <path d="M21 31 Q30 36 39 31" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" fill="none" filter="url(#glow)"/>
                          {/* Neck */}
                          <rect x="26" y="37" width="8" height="4" rx="2" fill="#7C3AED" opacity="0.7"/>
                          {/* Body — rounded square */}
                          <rect x="13" y="41" width="34" height="22" rx="8" fill="url(#bodyG)" stroke="#7C3AED" strokeWidth="1"/>
                          {/* Chest panel */}
                          <rect x="20" y="46" width="20" height="11" rx="4" fill="#A855F7" opacity="0.12" stroke="#A855F7" strokeWidth="0.5"/>
                          {/* Chest glow dot */}
                          <circle cx="30" cy="51.5" r="3" fill="#00D4FF" opacity="0.9" filter="url(#glow)" className="animate-pulse-dot"/>
                          <circle cx="30" cy="51.5" r="1.5" fill="white" opacity="0.7"/>
                          {/* Left arm — static */}
                          <rect x="3" y="42" width="9" height="5" rx="2.5" fill="#7C3AED" opacity="0.85"/>
                          <circle cx="2.5" cy="44.5" r="3" fill="#A855F7" opacity="0.7"/>
                          {/* Right arm — continuous wave */}
                          <g className="animate-robot-wave" style={{transformOrigin: '49px 43px'}}>
                            <rect x="48" y="41" width="9" height="5" rx="2.5" fill="#A855F7" opacity="0.9"/>
                            <circle cx="58.5" cy="43.5" r="3.5" fill="#00D4FF" opacity="0.9" filter="url(#glow)"/>
                            {/* Little sparkle on hand */}
                            <line x1="57" y1="41" x2="60" y2="38" stroke="#00D4FF" strokeWidth="0.8" opacity="0.6"/>
                            <line x1="60" y1="42" x2="63" y2="41" stroke="#00D4FF" strokeWidth="0.8" opacity="0.6"/>
                          </g>
                          {/* Legs */}
                          <rect x="18" y="63" width="9" height="6" rx="3" fill="#7C3AED" opacity="0.85"/>
                          <rect x="33" y="63" width="9" height="6" rx="3" fill="#7C3AED" opacity="0.85"/>
                          {/* Feet */}
                          <rect x="16" y="67" width="13" height="4" rx="2" fill="#A855F7" opacity="0.5"/>
                          <rect x="31" y="67" width="13" height="4" rx="2" fill="#A855F7" opacity="0.5"/>
                        </svg>
                      </div>
                    </div>

                    {/* Gradient text */}
                    <h2 className="animate-text-slide font-display font-bold text-[21px] sm:text-[25px] md:text-[31px] lg:text-[37px] bg-[linear-gradient(to_right,#A855F7,#7C3AED,#00D4FF)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer-bg drop-shadow-[0_0_12px_rgba(168,85,247,0.35)] tracking-tight leading-[1.15]">
                      Meet Your Smart AI Coach
                    </h2>
                  </div>

                  {/* Description Text */}
                  <div className="font-body text-[15px] lg:text-[17px] text-[#AAB3C5] leading-[1.65] max-w-[480px] mb-8 mx-auto lg:mx-0 animate-fade-in-up-hero" style={{animationDelay: '400ms'}}>
                    <p className="mb-2">Your body is unique. Your fitness plan should be too.<br/>Let AI build your perfect roadmap.</p>
                    <p className="text-white/90 font-medium">You’ve tried the trends. Now, try the truth.</p>
                  </div>

                  {/* CTA Button */}
                  <div className="w-full max-w-[440px] mx-auto lg:mx-0 mb-6 animate-fade-in-up-hero" style={{animationDelay: '500ms'}}>
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
                  <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-y-3 gap-x-5 mb-10 animate-fade-in-up-hero" style={{animationDelay: '600ms'}}>
                    {[
                      "No credit card", "Takes only 60 seconds", "Trusted by influencers & celebrities"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#22C55E]" />
                        <span className="font-body text-[13px] md:text-[14px] font-medium text-white/[0.65]">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hologram - Mobile (AFTER content) */}
                  <div className="lg:hidden w-full flex items-center justify-center relative my-4 animate-fade-in-up-hero" style={{animationDelay: '700ms'}}>
                    <div className="relative w-[300px] h-[420px] animate-xray-float">
                      {/* Glow aura */}
                      <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/10 blur-3xl animate-glow-v" />
                      {/* Rotating rings */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[220px] h-[60px]">
                        <div className="absolute inset-0 rounded-[100%] border border-[#8B5CF6]/50 animate-outer-ring" style={{transformOrigin:'center'}} />
                        <div className="absolute inset-[8px] rounded-[100%] border border-[#FF00FF]/30 animate-inner-ring" style={{transformOrigin:'center'}} />
                      </div>
                      {/* SVG X-Ray Body */}
                      <div className="absolute inset-0 flex items-center justify-center animate-xray-flicker">
                        <svg viewBox="0 0 320 480" className="w-full h-full overflow-visible">
                          <defs>
                            <filter id="xglow-m"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                            <linearGradient id="xbodyM" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9"/>
                              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7"/>
                              <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.4"/>
                            </linearGradient>
                            <linearGradient id="muscleHotM" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.6"/>
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                            </linearGradient>
                          </defs>
                          <g filter="url(#xglow-m)">
                            <path d="M160,28 C147,28 138,42 138,60 C138,78 147,88 155,98 C151,108 128,118 108,138 C88,158 88,196 88,244 C88,272 97,292 107,312 L97,450 C97,468 115,468 124,450 L143,276 L143,248 C153,257 167,257 177,248 L177,276 L196,450 C205,468 223,468 223,450 L213,312 C223,292 232,272 232,244 C232,196 232,158 212,138 C192,118 169,108 165,98 C173,88 182,78 182,60 C182,42 173,28 160,28 Z"
                              stroke="url(#xbodyM)" strokeWidth="1.8" fill="rgba(139,92,246,0.04)" opacity="0.95"/>
                            {/* Spine */}
                            <line x1="160" y1="98" x2="160" y2="268" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="5 4" opacity="0.5"/>
                            {/* Chest */}
                            <path d="M128,148 Q160,166 192,148" stroke="#FF00FF" strokeWidth="1" fill="none" opacity="0.5"/>
                            <path d="M122,162 Q160,180 198,162" stroke="#FF00FF" strokeWidth="0.8" fill="none" opacity="0.3"/>
                            {/* Abs */}
                            <line x1="144" y1="206" x2="176" y2="206" stroke="#c084fc" strokeWidth="0.7" opacity="0.4"/>
                            <line x1="144" y1="224" x2="176" y2="224" stroke="#c084fc" strokeWidth="0.7" opacity="0.4"/>
                            <line x1="144" y1="242" x2="176" y2="242" stroke="#c084fc" strokeWidth="0.7" opacity="0.4"/>
                            {/* Muscle fills */}
                            <ellipse cx="138" cy="156" rx="18" ry="12" fill="url(#muscleHotM)" opacity="0.18"/>
                            <ellipse cx="182" cy="156" rx="18" ry="12" fill="url(#muscleHotM)" opacity="0.18"/>
                          </g>
                          {/* Muscle nodes */}
                          <circle cx="160" cy="110" r="5" fill="#c084fc" className="animate-muscle-a" filter="url(#xglow-m)"/>
                          <circle cx="108" cy="148" r="4" fill="#FF00FF" className="animate-muscle-b" filter="url(#xglow-m)"/>
                          <circle cx="160" cy="168" r="4" fill="#8B5CF6" className="animate-muscle-c" filter="url(#xglow-m)"/>
                          <circle cx="88" cy="200" r="3.5" fill="#e879f9" className="animate-muscle-d" filter="url(#xglow-m)"/>
                          <circle cx="120" cy="330" r="3.5" fill="#c084fc" className="animate-muscle-e" filter="url(#xglow-m)"/>
                          <circle cx="200" cy="330" r="3.5" fill="#c084fc" className="animate-muscle-f" filter="url(#xglow-m)"/>
                        </svg>
                        {/* Scan line */}
                        <div className="absolute left-0 right-0 h-[2px] animate-xray-scan pointer-events-none" style={{background:'linear-gradient(90deg,transparent,#c084fc,#FF00FF,#c084fc,transparent)',boxShadow:'0 0 12px #8B5CF6'}}/>
                      </div>
                      {/* Mini labels */}
                      <div className="absolute top-[20%] -left-[70px] flex items-center gap-1.5">
                        <span className="font-mono text-[9px] text-[#c084fc] font-bold tracking-widest animate-label">TRAPS</span>
                        <div className="w-[28px] h-[1px] bg-[#8B5CF6]/60"/>
                        <div className="w-[5px] h-[5px] rounded-full bg-[#FF00FF] animate-muscle-b"/>
                      </div>
                      <div className="absolute top-[34%] -right-[65px] flex items-center gap-1.5">
                        <div className="w-[5px] h-[5px] rounded-full bg-[#c084fc] animate-muscle-c"/>
                        <div className="w-[24px] h-[1px] bg-[#8B5CF6]/60"/>
                        <span className="font-mono text-[9px] text-[#c084fc] font-bold tracking-widest animate-label">CHEST</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-fade-in-up-hero w-full max-w-[500px] mx-auto lg:mx-0" style={{animationDelay: '800ms'}}>
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
                  <div className="flex flex-col sm:flex-row items-center justify-between bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl p-[20px] animate-fade-in-up-hero w-full max-w-[500px] mx-auto lg:mx-0" style={{animationDelay: '900ms'}}>
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

                {/* RIGHT COLUMN - XRAY HOLOGRAM (Desktop) */}
                <div className="hidden lg:flex w-[45%] items-center justify-center relative z-[10] min-h-[640px] animate-fade-in-up-hero" style={{animationDelay: '550ms'}}>
                  {/* === OUTER LAYOUT: labels | body | labels === */}
                  <div className="relative flex items-center justify-center w-full h-[640px]">

                    {/* ── LEFT LABELS COLUMN ── */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-around py-[80px] z-40 w-[90px]">
                      {[
                        {label:'TRAPS', color:'#e879f9', anim:'animate-muscle-a'},
                        {label:'CHEST', color:'#FF00FF', anim:'animate-muscle-c'},
                        {label:'LATS',  color:'#c084fc', anim:'animate-muscle-b'},
                        {label:'ABS',   color:'#8B5CF6', anim:'animate-muscle-d'},
                        {label:'QUADS', color:'#a78bfa', anim:'animate-muscle-e'},
                        {label:'CALVES',color:'#e879f9', anim:'animate-muscle-f'},
                      ].map(({label,color,anim})=>(
                        <div key={label} className="flex items-center gap-1.5 justify-end">
                          <span className="font-mono text-[9px] font-bold tracking-[0.18em] animate-label" style={{color}}>{label}</span>
                          <div className="w-[22px] h-[1px]" style={{background:`linear-gradient(to right,${color}80,${color}20)`}}/>
                          <div className={`w-[5px] h-[5px] rounded-full ${anim} shrink-0`} style={{background:color, boxShadow:`0 0 6px ${color}`}}/>
                        </div>
                      ))}
                    </div>

                    {/* ── CENTRAL HOLOGRAM ── */}
                    <div className="relative w-[320px] h-[580px] mx-auto animate-xray-float" style={{animationDuration:'9s'}}>

                      {/* Aura glow */}
                      <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/15 blur-[70px] animate-glow-v pointer-events-none"/>

                      {/* Rotating base rings */}
                      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[260px] h-[60px]">
                        <div className="absolute inset-0 rounded-[100%] border border-[#8B5CF6]/70 animate-outer-ring" style={{boxShadow:'0 0 16px rgba(139,92,246,0.4)'}}/>
                        <div className="absolute inset-[8px] rounded-[100%] border border-[#FF00FF]/40 animate-inner-ring"/>
                        <div className="absolute inset-[-14px] rounded-[100%] border border-[#c084fc]/15 animate-outer-ring" style={{animationDuration:'28s'}}/>
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[120px] h-[16px] bg-[#8B5CF6]/40 blur-xl rounded-full animate-glow-v"/>
                      </div>

                      {/* SVG Athletic Body */}
                      <div className="absolute inset-0 flex items-center justify-center animate-xray-flicker">
                        <svg viewBox="0 0 280 560" className="w-full h-full overflow-visible">
                          <defs>
                            <filter id="gD"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                            <filter id="gS"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                            <linearGradient id="bG" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#e879f9" stopOpacity="0.95"/>
                              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85"/>
                              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.65"/>
                            </linearGradient>
                            <radialGradient id="hot" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#FF2D6B" stopOpacity="0.75"/>
                              <stop offset="55%" stopColor="#e879f9" stopOpacity="0.35"/>
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0"/>
                            </radialGradient>
                            <radialGradient id="cool" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55"/>
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0"/>
                            </radialGradient>
                            <radialGradient id="warm" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#e879f9" stopOpacity="0.55"/>
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0"/>
                            </radialGradient>
                          </defs>

                          {/* ── HEAD ── */}
                          <g filter="url(#gD)">
                            <ellipse cx="140" cy="34" rx="24" ry="29" stroke="url(#bG)" strokeWidth="2" fill="rgba(139,92,246,0.08)"/>
                          </g>
                          {/* Face detail */}
                          <ellipse cx="140" cy="32" rx="14" ry="16" fill="rgba(139,92,246,0.04)" stroke="#a855f7" strokeWidth="0.5" opacity="0.5"/>

                          {/* ── NECK ── */}
                          <path d="M127,62 C125,70 125,78 127,84 C131,88 149,88 153,84 C155,78 155,70 153,62"
                            stroke="url(#bG)" strokeWidth="1.6" fill="rgba(139,92,246,0.06)"/>

                          {/* ── TORSO (V-taper, clean) ── */}
                          <g filter="url(#gD)">
                            <path d="M127,84 C105,88 66,102 44,128 C34,146 36,174 46,200 C56,224 76,236 92,244 C90,256 88,270 88,280 L192,280 C192,270 190,256 188,244 C204,236 224,224 234,200 C244,174 246,146 236,128 C214,102 175,88 153,84 Z"
                              stroke="url(#bG)" strokeWidth="2" fill="rgba(100,60,200,0.09)"/>
                          </g>

                          {/* ── DELTOID CAPS ── */}
                          <ellipse cx="46" cy="132" rx="20" ry="14" fill="url(#hot)" opacity="0.7"/>
                          <ellipse cx="234" cy="132" rx="20" ry="14" fill="url(#hot)" opacity="0.7"/>
                          <path d="M44,128 C38,136 36,148 40,156" stroke="#e879f9" strokeWidth="1.3" fill="none" opacity="0.6"/>
                          <path d="M236,128 C242,136 244,148 240,156" stroke="#e879f9" strokeWidth="1.3" fill="none" opacity="0.6"/>

                          {/* ── PECTORALS ── */}
                          <path d="M68,130 C80,154 106,164 128,162 C120,148 102,134 80,128 Z" fill="url(#hot)" opacity="0.6"/>
                          <path d="M212,130 C200,154 174,164 152,162 C160,148 178,134 200,128 Z" fill="url(#hot)" opacity="0.6"/>
                          <path d="M44,130 Q90,162 140,166 Q190,162 236,130" stroke="#FF2D6B" strokeWidth="1.5" fill="none" opacity="0.65"/>
                          <path d="M56,150 Q92,175 140,178 Q188,175 224,150" stroke="#e879f9" strokeWidth="0.9" fill="none" opacity="0.4"/>
                          <line x1="140" y1="130" x2="140" y2="168" stroke="#e879f9" strokeWidth="0.8" opacity="0.4"/>

                          {/* ── LEFT UPPER ARM ── */}
                          <g filter="url(#gS)">
                            <path d="M44,128 C30,148 22,180 24,218 C26,242 36,258 48,256 C58,254 64,240 62,218 C60,196 58,170 60,150 L66,132 Z"
                              stroke="url(#bG)" strokeWidth="1.7" fill="rgba(80,40,160,0.07)"/>
                          </g>
                          {/* Bicep fill L */}
                          <ellipse cx="28" cy="188" rx="11" ry="26" fill="url(#hot)" opacity="0.55"/>

                          {/* ── RIGHT UPPER ARM ── */}
                          <g filter="url(#gS)">
                            <path d="M236,128 C250,148 258,180 256,218 C254,242 244,258 232,256 C222,254 216,240 218,218 C220,196 222,170 220,150 L214,132 Z"
                              stroke="url(#bG)" strokeWidth="1.7" fill="rgba(80,40,160,0.07)"/>
                          </g>
                          {/* Bicep fill R */}
                          <ellipse cx="252" cy="188" rx="11" ry="26" fill="url(#hot)" opacity="0.55"/>

                          {/* ── LEFT FOREARM ── */}
                          <g filter="url(#gS)">
                            <path d="M24,218 C18,238 16,260 18,278 C20,292 28,300 38,300 C48,300 56,290 58,276 C60,260 60,240 62,220 Z"
                              stroke="url(#bG)" strokeWidth="1.5" fill="rgba(80,40,160,0.06)"/>
                          </g>
                          <ellipse cx="36" cy="258" rx="10" ry="22" fill="url(#cool)" opacity="0.35"/>
                          {/* Left hand */}
                          <ellipse cx="34" cy="310" rx="12" ry="16" stroke="url(#bG)" strokeWidth="1.3" fill="rgba(139,92,246,0.04)"/>

                          {/* ── RIGHT FOREARM ── */}
                          <g filter="url(#gS)">
                            <path d="M256,218 C262,238 264,260 262,278 C260,292 252,300 242,300 C232,300 224,290 222,276 C220,260 220,240 218,220 Z"
                              stroke="url(#bG)" strokeWidth="1.5" fill="rgba(80,40,160,0.06)"/>
                          </g>
                          <ellipse cx="244" cy="258" rx="10" ry="22" fill="url(#cool)" opacity="0.35"/>
                          {/* Right hand */}
                          <ellipse cx="246" cy="310" rx="12" ry="16" stroke="url(#bG)" strokeWidth="1.3" fill="rgba(139,92,246,0.04)"/>

                          {/* ── LATS ── */}
                          <path d="M50,148 Q38,196 44,240" stroke="#c084fc" strokeWidth="1.8" fill="none" opacity="0.55"/>
                          <path d="M230,148 Q242,196 236,240" stroke="#c084fc" strokeWidth="1.8" fill="none" opacity="0.55"/>

                          {/* ── ABS (6-pack) ── */}
                          <rect x="121" y="195" width="17" height="13" rx="5" fill="url(#cool)" opacity="0.65"/>
                          <rect x="142" y="195" width="17" height="13" rx="5" fill="url(#cool)" opacity="0.65"/>
                          <rect x="121" y="213" width="17" height="13" rx="5" fill="url(#cool)" opacity="0.55"/>
                          <rect x="142" y="213" width="17" height="13" rx="5" fill="url(#cool)" opacity="0.55"/>
                          <rect x="122" y="231" width="16" height="11" rx="5" fill="url(#cool)" opacity="0.4"/>
                          <rect x="142" y="231" width="16" height="11" rx="5" fill="url(#cool)" opacity="0.4"/>
                          <line x1="140" y1="190" x2="140" y2="268" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5"/>
                          <line x1="119" y1="208" x2="161" y2="208" stroke="#a78bfa" strokeWidth="0.6" opacity="0.4"/>
                          <line x1="119" y1="226" x2="161" y2="226" stroke="#a78bfa" strokeWidth="0.6" opacity="0.38"/>
                          <line x1="119" y1="244" x2="161" y2="244" stroke="#a78bfa" strokeWidth="0.6" opacity="0.3"/>

                          {/* ── OBLIQUES ── */}
                          <path d="M92,200 Q82,240 90,264" stroke="#c084fc" strokeWidth="1.1" fill="none" opacity="0.5"/>
                          <path d="M188,200 Q198,240 190,264" stroke="#c084fc" strokeWidth="1.1" fill="none" opacity="0.5"/>

                          {/* ── SPINE ── */}
                          <line x1="140" y1="84" x2="140" y2="278" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>

                          {/* ── TRAP LINE ── */}
                          <path d="M44,128 Q92,104 140,100 Q188,104 236,128" stroke="#e879f9" strokeWidth="1.4" fill="none" opacity="0.6"/>

                          {/* ── LEFT LEG ── */}
                          <g filter="url(#gS)">
                            <path d="M88,280 C80,318 76,366 78,414 C80,452 92,474 106,474 C118,474 126,456 126,422 C126,386 124,342 122,304 L122,280 Z"
                              stroke="url(#bG)" strokeWidth="1.7" fill="rgba(80,40,160,0.07)"/>
                          </g>
                          {/* Quad fills L */}
                          <ellipse cx="102" cy="355" rx="16" ry="42" fill="url(#hot)" opacity="0.45"/>
                          <path d="M86,285 Q76,360 80,428" stroke="#a78bfa" strokeWidth="1.3" fill="none" opacity="0.5"/>
                          <path d="M118,285 Q128,360 124,428" stroke="#a78bfa" strokeWidth="1.3" fill="none" opacity="0.5"/>
                          <path d="M104,285 Q100,360 104,428" stroke="#c084fc" strokeWidth="0.8" fill="none" opacity="0.35"/>

                          {/* ── RIGHT LEG ── */}
                          <g filter="url(#gS)">
                            <path d="M192,280 C200,318 204,366 202,414 C200,452 188,474 174,474 C162,474 154,456 154,422 C154,386 156,342 158,304 L158,280 Z"
                              stroke="url(#bG)" strokeWidth="1.7" fill="rgba(80,40,160,0.07)"/>
                          </g>
                          {/* Quad fills R */}
                          <ellipse cx="178" cy="355" rx="16" ry="42" fill="url(#hot)" opacity="0.45"/>
                          <path d="M194,285 Q204,360 200,428" stroke="#a78bfa" strokeWidth="1.3" fill="none" opacity="0.5"/>
                          <path d="M162,285 Q152,360 156,428" stroke="#a78bfa" strokeWidth="1.3" fill="none" opacity="0.5"/>
                          <path d="M176,285 Q180,360 176,428" stroke="#c084fc" strokeWidth="0.8" fill="none" opacity="0.35"/>

                          {/* ── LEFT CALF ── */}
                          <g filter="url(#gS)">
                            <path d="M106,474 C100,504 100,530 102,544 C104,554 112,556 120,552 C126,548 128,538 128,524 C128,506 126,480 126,452 L122,422 Z"
                              stroke="url(#bG)" strokeWidth="1.5" fill="rgba(80,40,160,0.06)"/>
                          </g>
                          <ellipse cx="114" cy="498" rx="10" ry="24" fill="url(#warm)" opacity="0.4"/>

                          {/* ── RIGHT CALF ── */}
                          <g filter="url(#gS)">
                            <path d="M174,474 C180,504 180,530 178,544 C176,554 168,556 160,552 C154,548 152,538 152,524 C152,506 154,480 154,452 L158,422 Z"
                              stroke="url(#bG)" strokeWidth="1.5" fill="rgba(80,40,160,0.06)"/>
                          </g>
                          <ellipse cx="166" cy="498" rx="10" ry="24" fill="url(#warm)" opacity="0.4"/>

                          {/* ── RIBS ── */}
                          <path d="M60,182 Q82,196 118,192" stroke="#8B5CF6" strokeWidth="0.7" fill="none" opacity="0.35"/>
                          <path d="M220,182 Q198,196 162,192" stroke="#8B5CF6" strokeWidth="0.7" fill="none" opacity="0.35"/>
                          <path d="M56,198 Q80,212 118,208" stroke="#8B5CF6" strokeWidth="0.6" fill="none" opacity="0.25"/>
                          <path d="M224,198 Q200,212 162,208" stroke="#8B5CF6" strokeWidth="0.6" fill="none" opacity="0.25"/>

                          {/* ── BLINK NODES ── */}
                          <circle cx="140" cy="100" r="5" fill="#e879f9" className="animate-muscle-a" filter="url(#gD)"/>
                          <circle cx="96" cy="152" r="5.5" fill="#FF2D6B" className="animate-muscle-c" filter="url(#gD)"/>
                          <circle cx="184" cy="152" r="5.5" fill="#FF2D6B" className="animate-muscle-c" filter="url(#gS)"/>
                          <circle cx="44" cy="202" r="4.5" fill="#c084fc" className="animate-muscle-b" filter="url(#gD)"/>
                          <circle cx="236" cy="202" r="4.5" fill="#c084fc" className="animate-muscle-b" filter="url(#gS)"/>
                          <circle cx="140" cy="228" r="4" fill="#38BDF8" className="animate-muscle-d" filter="url(#gS)"/>
                          <circle cx="28" cy="190" r="4" fill="#FF2D6B" className="animate-muscle-e" filter="url(#gS)"/>
                          <circle cx="252" cy="190" r="4" fill="#FF2D6B" className="animate-muscle-e" filter="url(#gS)"/>
                          <circle cx="102" cy="360" r="5" fill="#e879f9" className="animate-muscle-e" filter="url(#gS)"/>
                          <circle cx="178" cy="360" r="5" fill="#e879f9" className="animate-muscle-e" filter="url(#gS)"/>
                          <circle cx="114" cy="496" r="4" fill="#e879f9" className="animate-muscle-f" filter="url(#gS)"/>
                          <circle cx="166" cy="496" r="4" fill="#e879f9" className="animate-muscle-f" filter="url(#gS)"/>
                        </svg>


















                        {/* Scan line */}
                        <div className="absolute left-[-8%] right-[-8%] h-[3px] animate-xray-scan pointer-events-none" style={{background:'linear-gradient(90deg,transparent,#7c3aed,#a855f7,#FF00FF,#e879f9,#FF00FF,#a855f7,#7c3aed,transparent)', boxShadow:'0 0 20px #8B5CF6, 0 0 50px rgba(255,0,255,0.25)'}}/>
                        <div className="absolute left-[-8%] right-[-8%] h-[90px] animate-xray-scan pointer-events-none" style={{background:'linear-gradient(to bottom,rgba(139,92,246,0.1),transparent)', marginTop:'-90px'}}/>
                      </div>
                    </div>

                    {/* ── RIGHT LABELS COLUMN ── */}
                    <div className="absolute right-0 top-0 h-full flex flex-col justify-around py-[80px] z-40 w-[90px]">
                      {[
                        {label:'BICEPS', color:'#c084fc', anim:'animate-muscle-b'},
                        {label:'DELTS',  color:'#a78bfa', anim:'animate-muscle-a'},
                        {label:'CORE',   color:'#8B5CF6', anim:'animate-muscle-d'},
                        {label:'GLUTES', color:'#e879f9', anim:'animate-muscle-c'},
                        {label:'HAMS',   color:'#a78bfa', anim:'animate-muscle-e'},
                        {label:'TIBIAL', color:'#c084fc', anim:'animate-muscle-f'},
                      ].map(({label,color,anim})=>(
                        <div key={label} className="flex items-center gap-1.5 justify-start">
                          <div className={`w-[5px] h-[5px] rounded-full ${anim} shrink-0`} style={{background:color, boxShadow:`0 0 6px ${color}`}}/>
                          <div className="w-[22px] h-[1px]" style={{background:`linear-gradient(to left,${color}80,${color}20)`}}/>
                          <span className="font-mono text-[9px] font-bold tracking-[0.18em] animate-label" style={{color}}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* ── HUD CARDS (top + bottom only, away from body) ── */}
                    {/* Top-left */}
                    <div className="absolute top-[10px] left-[96px] bg-black/70 backdrop-blur-xl border border-[#8B5CF6]/35 rounded-2xl p-3.5 z-30 shadow-[0_0_28px_rgba(139,92,246,0.2)] w-[148px]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#e879f9] animate-muscle-a"/>
                        <span className="text-[9px] font-bold text-white/45 uppercase tracking-widest">Metabolic Rate</span>
                      </div>
                      <p className="text-[22px] font-mono text-white font-bold leading-none">1,842</p>
                      <p className="text-[9px] text-[#c084fc] mt-1 font-semibold flex items-center gap-1"><Activity size={9}/> ACTIVE SCAN</p>
                    </div>

                    {/* Top-right */}
                    <div className="absolute top-[10px] right-[96px] bg-black/70 backdrop-blur-xl border border-[#FF00FF]/20 rounded-2xl p-3.5 z-30 shadow-[0_0_28px_rgba(255,0,255,0.1)] w-[148px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-white/45 uppercase tracking-widest">Muscle Density</span>
                        <TrendingUp size={11} className="text-[#e879f9]"/>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#FF00FF] rounded-full w-[78%]" style={{boxShadow:'0 0 8px #8B5CF6'}}/>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[16px] font-mono text-white font-bold">78.4%</span>
                        <span className="text-[9px] text-[#e879f9] font-bold">+1.2%</span>
                      </div>
                    </div>

                    {/* Bottom-left */}
                    <div className="absolute bottom-[8px] left-[96px] bg-black/70 backdrop-blur-xl border border-[#c084fc]/25 rounded-2xl p-3.5 z-30 shadow-[0_0_24px_rgba(192,132,252,0.15)] w-[148px]">
                      <div className="text-[9px] font-bold text-white/45 uppercase tracking-widest mb-1">Body Composition</div>
                      <div className="flex items-end gap-1.5">
                        <span className="text-[22px] font-mono text-white font-bold">14.2</span>
                        <span className="text-[12px] text-[#c084fc] font-bold pb-0.5">BF%</span>
                      </div>
                      <div className="mt-1 text-[8px] text-[#FBBF24] flex items-center gap-1 font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse"/>PEAK ATHLETIC RANGE
                      </div>
                    </div>

                    {/* Bottom-right */}
                    <div className="absolute bottom-[8px] right-[96px] bg-[#8B5CF6]/10 backdrop-blur-2xl border border-[#8B5CF6]/30 rounded-2xl p-4 z-30 shadow-[0_0_36px_rgba(139,92,246,0.2)] w-[148px]">
                      <div className="text-[9px] font-bold text-[#c084fc] uppercase tracking-[0.18em] mb-1.5">30-Day Projection</div>
                      <div className="flex items-center gap-2">
                        <div className="text-[24px] font-mono text-white font-bold leading-none">-5.2<span className="text-[14px] opacity-50">kg</span></div>
                        <div className="h-8 w-[1px] bg-[#8B5CF6]/30"/>
                        <div className="text-[9px] text-white/65 leading-tight font-medium">94%<br/>Confidence</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
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

              <motion.div variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}} className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Choose Your Path</h2>
                <p className="text-[#AAB3C5] text-lg">Select the blueprint you want the AI to build.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                {/* Workout Only */}
                <motion.button
                  variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}}
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
                  variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}}
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
                  variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}}
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

          {/* === PHASE 2: QUIZ === */}
          {phase === "quiz" && (
            <motion.section
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto h-[75vh] mt-[120px] mb-10 flex flex-col bg-[#0B0E16]/90 backdrop-blur-xl rounded-[32px] border border-white/5 overflow-hidden shadow-2xl relative"
            >
              {/* Header with Progress Bar */}
              <div className="p-5 border-b border-white/5 bg-black/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#4DA3FF] flex items-center justify-center shadow-lg relative z-10">
                        <BrainCircuit className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-[#A78BFA] rounded-full blur-md opacity-50 animate-pulse" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22D3A5] border-2 border-[#0B0E16] rounded-full z-20" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-tight text-lg">AI Coach</h3>
                      <p className="text-xs text-[#22D3A5] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A5] animate-pulse" /> Online
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#6B6F9A] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    {currentQIdx + 1} / {CORE_Q.length}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="flex gap-1.5">
                  {CORE_Q.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i < currentQIdx
                          ? "bg-gradient-to-r from-[#A78BFA] to-[#4DA3FF]"
                          : i === currentQIdx
                          ? "bg-gradient-to-r from-[#A78BFA] to-[#4DA3FF] opacity-60"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide pb-32 scroll-smooth">
                <AnimatePresence initial={false}>
                  {chatHistory.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      {/* Message Bubble */}
                      <div className={`
                        relative max-w-[90%] md:max-w-[80%] px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm
                        ${msg.sender === "user"
                          ? "bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] text-white rounded-br-sm ml-auto shadow-[0_4px_20px_rgba(167,139,250,0.3)]"
                          : msg.isTeaser
                            ? "bg-gradient-to-br from-[#A78BFA]/20 to-[#4DA3FF]/20 text-white rounded-bl-sm border border-[#A78BFA]/30"
                            : "bg-[#1A1D2D] text-[#E2E8F0] rounded-bl-sm border border-white/5"}
                      `}>
                        {msg.text}
                      </div>

                      {/* Rich Options */}
                      {msg.options && (
                        <div className="flex flex-col gap-3 mt-4 w-full md:w-[90%]">
                          {msg.options.map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => handleAnswer(opt.label)}
                              className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#A78BFA]/50 hover:bg-[#A78BFA]/10 transition-all text-left overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#A78BFA]/0 via-[#A78BFA]/0 to-[#A78BFA]/0 group-hover:from-[#A78BFA]/5 group-hover:to-transparent transition-all" />
                              <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform relative z-10">
                                {opt.emoji}
                              </div>
                              <div className="flex-1 relative z-10">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-bold text-white text-[15px] group-hover:text-[#A78BFA] transition-colors">{opt.label}</span>
                                  {opt.badge && <span className="text-[9px] uppercase tracking-wider font-bold bg-[#A78BFA]/20 text-[#A78BFA] px-2 py-0.5 rounded shadow-[0_0_8px_rgba(167,139,250,0.3)]">{opt.badge}</span>}
                                </div>
                                <span className="text-xs text-[#6B6F9A] line-clamp-1 group-hover:text-[#AAB3C5] transition-colors">{opt.desc}</span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-[#6B6F9A] group-hover:text-[#A78BFA] group-hover:translate-x-1 transition-all relative z-10" />
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* End of chat marker removed */}
              </div>

              {/* Teaser prompt removed — flow goes directly to analyzing */}
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
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BrainCircuit className="w-8 h-8 text-[#A78BFA] animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Building Your Blueprint</h2>
              <p className="text-[#AAB3C5] text-sm mb-6">Personalized for <span className="text-[#A78BFA] font-semibold">{answers.goal || "your goal"}</span> • {answers.location || "your setup"}</p>
              <div className="flex flex-col gap-2 text-[#6B6F9A] text-sm font-medium">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>✦ Calculating your calorie targets...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>✦ Structuring {answers.location === "Gym" ? "gym" : "home"} workout progression...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>✦ Finalizing your {answers.goal?.includes("Fat") ? "fat loss" : answers.goal?.includes("Muscle") ? "muscle building" : "body recomposition"} blueprint...</motion.p>
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
              className="max-w-4xl mx-auto space-y-6 pt-24 md:pt-32 pb-24 relative"
            >
              {/* Deep Space Radial Background */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#A78BFA]/10 via-transparent to-transparent -z-10 blur-3xl" />
              
              <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22D3A5]/10 border border-[#22D3A5]/20 text-[#22D3A5] text-sm font-bold tracking-wide mb-4">
                  <CheckCircle2 className="w-4 h-4" /> <span>Analysis Complete</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white">Your Custom Blueprint</h2>
                <p className="text-[#AAB3C5] mt-3">Tailored for {answers.goal || "your goals"}. Based on millions of data points.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. User Snapshot Card */}
                <motion.div variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}} className="bg-[#0B0E16]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><User className="w-24 h-24" /></div>
                  <h3 className="text-sm font-bold text-[#6B6F9A] uppercase tracking-wider mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-[#4DA3FF] animate-pulse drop-shadow-[0_0_8px_rgba(77,163,255,0.8)]" /> Profile Snapshot</h3>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div><p className="text-xs text-[#6B6F9A] mb-1">Goal</p><p className="font-bold text-white">{answers.goal || "Fat Loss"}</p></div>
                    <div><p className="text-xs text-[#6B6F9A] mb-1">Experience</p><p className="font-bold text-white">{answers.level || "Just Starting"}</p></div>
                    <div><p className="text-xs text-[#6B6F9A] mb-1">Location</p><p className="font-bold text-white">{answers.location || "Gym"}</p></div>
                    <div><p className="text-xs text-[#6B6F9A] mb-1">Commitment</p><p className="font-bold text-white">{answers.days || "3-4 Days"}</p></div>
                  </div>
                  <div className="mt-6 p-4 bg-[#4DA3FF]/10 rounded-2xl border border-[#4DA3FF]/20">
                    <p className="text-sm font-semibold text-[#4DA3FF] flex items-start gap-2">
                      <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                      Based on your profile, expect visible changes in 14–21 days with 80%+ adherence.
                    </p>
                  </div>
                </motion.div>

                {/* 2. Transformation Prediction */}
                <motion.div variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}} className="bg-[#0B0E16]/60 backdrop-blur-2xl border border-[#A78BFA]/20 rounded-3xl p-6 shadow-[0_10px_30px_rgba(167,139,250,0.1)] relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#A78BFA]/10 blur-3xl rounded-full pointer-events-none" />
                  <h3 className="text-sm font-bold text-[#A78BFA] uppercase tracking-wider mb-5 flex items-center gap-2"><Flame className="w-4 h-4 animate-pulse drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" /> Transformation Timeline</h3>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1A1D2D] border border-white/5 flex items-center justify-center font-bold text-white shrink-0">30d</div>
                      <div><p className="text-sm font-bold text-white">Initial Shift</p><p className="text-xs text-[#AAB3C5]">Noticeable {answers.goal?.includes("Fat") ? "fat drop &" : "strength gain &"} higher energy.</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1A1D2D] border border-[#A78BFA]/30 flex items-center justify-center font-bold text-[#A78BFA] shrink-0">60d</div>
                      <div><p className="text-sm font-bold text-[#A78BFA]">Visible Remodeling</p><p className="text-xs text-[#AAB3C5]">Clothes fit differently, {answers.goal?.includes("Muscle") ? "muscles pop" : "definition appears"}.</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#4DA3FF] flex items-center justify-center font-bold text-white shrink-0 shadow-lg">90d</div>
                      <div><p className="text-sm font-bold text-white">Major Transformation</p><p className="text-xs text-[#AAB3C5]">People start asking what you're doing.</p></div>
                    </div>
                  </div>

                  <p className="mt-5 text-xs text-[#6B6F9A] font-medium border-t border-white/5 pt-4">
                    ⚠️ <span className="text-[#F1F5F9]">Reality check:</span> If consistency drops &lt; 60% → progress slows by 40–50%.
                  </p>
                </motion.div>

                {/* 3. Personalized Insight Card */}
                <motion.div variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}} className="bg-gradient-to-br from-[#1A1D2D] to-[#0B0E16] border border-[#4DA3FF]/20 rounded-3xl p-6 md:col-span-2 relative shadow-2xl">
                  <div className="absolute top-0 right-0 p-4"><MessageSquare className="w-6 h-6 text-[#4DA3FF]/20" /></div>
                  <h3 className="text-sm font-bold text-[#4DA3FF] uppercase tracking-wider mb-4 flex items-center gap-2"><BrainCircuit className="w-4 h-4 animate-pulse drop-shadow-[0_0_8px_rgba(77,163,255,0.8)]" /> AI Coach Diagnosis</h3>
                  <p className="text-lg text-white font-medium leading-relaxed mb-4 min-h-[80px]">
                    "{typedInsight}"<motion.span animate={{opacity:[0,1,0]}} transition={{repeat:Infinity, duration:0.8}} className="inline-block w-1 h-5 bg-[#22D3A5] ml-1 align-middle"/>
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 bg-[#0B0E16] p-3 rounded-xl border border-white/5">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getCalorieBadge(answers).color}20` }}>
                        <Zap className="w-5 h-5" style={{ color: getCalorieBadge(answers).color }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#6B6F9A] uppercase font-bold">{getCalorieBadge(answers).label}</p>
                        <p className="text-sm font-bold text-white">{getCalorieBadge(answers).val}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#0B0E16] p-3 rounded-xl border border-white/5">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#22D3A5]/20">
                        <Dumbbell className="w-5 h-5 text-[#22D3A5]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#6B6F9A] uppercase font-bold">Training Focus</p>
                        <p className="text-sm font-bold text-white">{answers.goal?.includes("Muscle") ? "Progressive Overload" : "Hypertrophy + Output"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 4. Workout Preview (Locked or Unlocked based on Path) */}
                {(pathType === "workout" || pathType === "both") && (
                  <motion.div variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}} className="bg-[#0B0E16]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    {/* Blurred Abstract Gym Mesh Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4DA3FF]/10 via-transparent to-transparent opacity-50 blur-xl pointer-events-none" />
                    
                    <h3 className="text-sm font-bold text-[#6B6F9A] uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10"><Dumbbell className="w-4 h-4 text-[#F87171] animate-pulse drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" /> Blueprint: Training</h3>

                    <div className="space-y-3 mb-10 relative z-10">
                      {/* FREE UNLOCKED PHASE */}
                      <div className="bg-[#1A1D2D] rounded-xl p-4 border border-white/10 shadow-md">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-[#4DA3FF] font-bold">Day 1: Base Foundation</p>
                          <span className="text-[9px] uppercase font-bold bg-[#22D3A5]/20 text-[#22D3A5] px-2 py-0.5 rounded">Free Preview</span>
                        </div>
                        <p className="text-sm text-white font-medium mb-1">A1. Primary Compound — 3×8-10</p>
                        <p className="text-sm text-white font-medium">A2. Secondary Movement — 3×10-12</p>
                        <p className="text-xs text-[#6B6F9A] mt-2">+ tailored accessories based on your level</p>
                      </div>
                      
                      {/* LOCKED PHASE */}
                      <div className="bg-[#1A1D2D]/30 rounded-xl p-4 border border-white/5 opacity-50 relative overflow-hidden">
                        <div className="absolute inset-0 backdrop-blur-sm z-10" />
                        <p className="text-xs text-[#AAB3C5] font-bold mb-1">Day 2: Output / Recovery</p>
                        <p className="text-sm text-[#AAB3C5] select-none">Targeted energy systems</p>
                      </div>
                    </div>

                    {/* Lock Overlay Only on the bottom half */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B0E16] via-[#0B0E16] to-transparent flex flex-col items-center justify-end p-6 text-center z-20">
                      <Lock className="w-6 h-6 text-[#AAB3C5] mb-2" />
                      <p className="text-sm font-bold text-white mb-1">Unlock Full 4-Week Progression</p>
                      <p className="text-xs text-[#6B6F9A]">Weekly auto-adjustments & volume tracking.</p>
                    </div>
                  </motion.div>
                )}

                {/* 5. Diet Preview (Locked or Unlocked based on Path) */}
                {(pathType === "diet" || pathType === "both") && (
                  <motion.div variants={{hidden: {opacity: 0, y: 20}, show: {opacity: 1, y: 0}}} className="bg-[#0B0E16]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    {/* Blurred Abstract Diet Mesh Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#22D3A5]/10 via-transparent to-transparent opacity-50 blur-xl pointer-events-none" />
                    
                    <h3 className="text-sm font-bold text-[#6B6F9A] uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10"><Salad className="w-4 h-4 text-[#22D3A5] animate-pulse drop-shadow-[0_0_8px_rgba(34,211,165,0.8)]" /> Blueprint: Nutrition</h3>

                    <div className="space-y-3 mb-10 relative z-10">
                      {/* FREE UNLOCKED PHASE */}
                      <div className="bg-[#1A1D2D] rounded-xl p-4 border border-white/10 shadow-md">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-[#22D3A5] font-bold">Sample Day 1 Menu</p>
                          <span className="text-[9px] uppercase font-bold bg-[#22D3A5]/20 text-[#22D3A5] px-2 py-0.5 rounded">Free Preview</span>
                        </div>
                        <p className="text-sm text-white font-medium mb-1">Meal 1: High Protein {answers.diet?.includes("Veg") && !answers.diet?.includes("Non") ? "Poha/Oats" : "Eggs/Oats"}</p>
                        <p className="text-sm text-white font-medium">Meal 2: {answers.diet?.includes("Veg") && !answers.diet?.includes("Non") ? "Paneer/Tofu" : "Chicken/Fish"} + Rice</p>
                        <p className="text-xs text-[#6B6F9A] mt-2">{answers.diet || "Balanced"} Focus • Adjusted for {answers.goal || "Fat Loss"}</p>
                      </div>
                      
                      {/* LOCKED PHASE */}
                      <div className="bg-[#1A1D2D]/30 rounded-xl p-4 border border-white/5 opacity-50 relative overflow-hidden">
                        <div className="absolute inset-0 backdrop-blur-sm z-10" />
                        <p className="text-xs text-[#AAB3C5] font-bold mb-1">Complete Grocery List</p>
                        <p className="text-sm text-[#AAB3C5] select-none">Exact macros & portions</p>
                      </div>
                    </div>

                    {/* Lock Overlay Only on the bottom half */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B0E16] via-[#0B0E16] to-transparent flex flex-col items-center justify-end p-6 text-center z-20">
                      <Lock className="w-6 h-6 text-[#AAB3C5] mb-2" />
                      <p className="text-sm font-bold text-white mb-1">Unlock Exact Macros & Diet</p>
                      <p className="text-xs text-[#6B6F9A]">Adapts based on your weekly weight changes.</p>
                    </div>
                  </motion.div>
                )}

                {/* 6. Premium CTA */}
                <div className="bg-gradient-to-br from-[#4DA3FF]/10 to-[#A78BFA]/10 border border-[#A78BFA]/30 rounded-3xl p-8 md:col-span-2 text-center relative overflow-hidden mt-4">
                  <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-[#4DA3FF]/20 rotate-12 blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-white text-[#05050B] rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-lg">
                      🔥 Unlock Your Full Blueprint
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Start your transformation today.</h2>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8 text-sm font-semibold text-[#AAB3C5]">
                      <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22D3A5]" /> {pathType === "workout" ? "Full Training Plan" : pathType === "diet" ? "Full Meal Plan" : "Full Training & Meal Plan"}</span>
                      <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22D3A5]" /> Weekly Auto-Adjustments</span>
                      <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22D3A5]" /> 24/7 AI Access</span>
                    </div>

                    <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#05050B] rounded-2xl font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                      <span className="relative z-10">Get My Plan Now</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 7. Free Tools & Fit Path Navigation */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  {/* FIT PATH */}
                  <Link href="#fit-path" className="group bg-[#0B0E16] border border-[#22D3A5]/20 hover:border-[#22D3A5]/50 rounded-3xl p-6 transition-colors flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all"><MapPin className="w-20 h-20 text-[#22D3A5]" /></div>
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#22D3A5]/10 flex items-center justify-center mb-4">
                        <MapPin className="w-6 h-6 text-[#22D3A5]" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">Explore Fit Path</h3>
                      <p className="text-[#6B6F9A] text-sm mb-6">Read real-life roadmaps and structured guides for men and women.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#22D3A5] text-sm font-bold">
                      Read Guides <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  {/* TOOLS */}
                  <Link href="#tools" className="group bg-[#0B0E16] border border-[#4DA3FF]/20 hover:border-[#4DA3FF]/50 rounded-3xl p-6 transition-colors flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all"><Wrench className="w-20 h-20 text-[#4DA3FF]" /></div>
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#4DA3FF]/10 flex items-center justify-center mb-4">
                        <Wrench className="w-6 h-6 text-[#4DA3FF]" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">Free Calculators</h3>
                      <p className="text-[#6B6F9A] text-sm mb-6">Manually calculate your TDEE, macros, and BMI without the AI coach.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#4DA3FF] text-sm font-bold">
                      Open Tools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>

                {/* 8. Human Coach Fallback */}
                <div className="bg-[#1A1D2D]/50 border border-white/5 rounded-3xl p-6 md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-[#1A1D2D] transition-colors mt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[#AAB3C5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-md">Need 1-on-1 Human Guidance?</h3>
                      <p className="text-[#6B6F9A] text-sm">Book a free 15-min consult to clear your doubts.</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors text-center border border-white/10">
                    Book Consult
                  </button>
                </div>

              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-Only Minimal Footer */}
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
    </main>
  );
}