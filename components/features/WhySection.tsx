"use client";

import { motion, useInView, animate } from "framer-motion";
import { Target, FileText, TrendingUp, Brain, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        onUpdate(value) {
          if (nodeRef.current) nodeRef.current.textContent = Math.round(value).toString();
        },
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView]);

  return <span ref={nodeRef}>{from}</span>;
}

const CARDS = [
  {
    num: "01",
    title: "Built Around You",
    desc: "AI learns your body type, schedule & food habits. No generic templates — ever.",
    icon: Target,
    iconColor: "#A855F7",
    iconBg: "rgba(124,58,237,0.2)",
    accentText: "#C084FC",
    accentWord: "You",
    hoverBorder: "rgba(168,85,247,0.25)",
    hoverGlow: "rgba(168,85,247,0.15)",
    href: "/get-started",
  },
  {
    num: "02",
    title: "One System. All Inside.",
    desc: "Workout, diet & habit tracking — unified. Skip the 6 different apps.",
    icon: FileText,
    iconColor: "#A855F7",
    iconBg: "transparent",
    accentText: "#C084FC",
    accentWord: "All Inside",
    isHero: true,
    hoverBorder: "rgba(168,85,247,0.5)",
    hoverGlow: "rgba(168,85,247,0.3)",
    href: "/tools",
  },
  {
    num: "03",
    title: "Track. Improve. Win.",
    desc: "See your progress every week. Numbers don't lie — and yours will move fast.",
    icon: TrendingUp,
    iconColor: "#22D3EE",
    iconBg: "rgba(34,211,238,0.12)",
    accentText: "#22D3EE",
    accentWord: "Improve.",
    hoverBorder: "rgba(34,211,238,0.20)",
    hoverGlow: "rgba(34,211,238,0.15)",
    href: "/tools",
  },
  {
    num: "04",
    title: "AI That Thinks Ahead",
    desc: "Adjusts your plan before you plateau. Smart, proactive — not reactive.",
    icon: Brain,
    iconColor: "#A855F7",
    iconBg: "rgba(124,58,237,0.2)",
    accentText: "#C084FC",
    accentWord: "AI",
    hoverBorder: "rgba(168,85,247,0.25)",
    hoverGlow: "rgba(168,85,247,0.15)",
    href: "/ai-coach",
  },
  {
    num: "05",
    title: "Results That Last",
    desc: "No crash diet. No rebound. Built to keep working long after Week 12.",
    icon: ShieldCheck,
    iconColor: "#A855F7",
    iconBg: "rgba(124,58,237,0.2)",
    accentText: "#C084FC",
    accentWord: "Last",
    hoverBorder: "rgba(168,85,247,0.25)",
    hoverGlow: "rgba(168,85,247,0.15)",
    href: "/get-started",
  },
];

const MARQUEE_WORDS = [
  "TRANSFORM", "AI COACH", "DISCIPLINE", "RESULTS",
  "STRENGTH", "SYSTEM", "NUTRITION", "SANDY.LIFTS", "MINDSET",
];

function Card({ card, i, isMobile }: { card: typeof CARDS[0]; i: number; isMobile: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.5, delay: isMobile ? 0 : (i + 1) * 0.1 }}
      className="group relative h-full"
    >
      <div
        className={`relative h-full flex flex-col p-6 rounded-2xl transition-all duration-300 ${
          card.isHero
            ? "bg-[#0A0A0A] bg-[linear-gradient(160deg,rgba(61,26,110,0.45),rgba(17,17,17,0.95))] border border-[rgba(168,85,247,0.3)] shadow-[0_0_40px_rgba(168,85,247,0.12)] hover:-translate-y-[6px] hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(168,85,247,0.25)]"
            : "bg-[#111111] border border-[rgba(255,255,255,0.06)] hover:-translate-y-[4px] hover:border-[rgba(255,255,255,0.10)]"
        }`}
      >
        {/* Hover top border glow */}
        <div
          className="sl-card-top-glow absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${card.hoverBorder}, transparent)`,
            boxShadow: `0 0 15px ${card.hoverGlow}`,
          }}
        />

        {/* Bottom Flowing Glow Line — same as Team Section */}
        <div
          className="why-card-glow-line absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl z-10"
        />

        {/* Core System badge */}
        {card.isHero && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[rgba(168,85,247,0.15)] border border-[rgba(168,85,247,0.3)] rounded-full px-3 py-1 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-pulse shadow-[0_0_8px_#C084FC]" />
            <span className="text-[8px] font-bold tracking-widest text-[#C084FC] uppercase">CORE SYSTEM</span>
          </div>
        )}

        {/* Number */}
        <div className="absolute top-4 right-5 text-[#52525B] font-mono text-sm font-medium transition-colors duration-300 group-hover:text-[#C084FC]">
          {card.num}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ background: card.iconBg }}
        >
          <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
        </div>

        {/* Content */}
        <h3 className="text-[17px] font-bold text-[#FFFFFF] mb-3 leading-tight">
          {card.title.split(card.accentWord).map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 && <span style={{ color: card.accentText }}>{card.accentWord}</span>}
            </span>
          ))}
        </h3>
        <p className="text-[13px] text-[#A1A1AA] leading-relaxed mb-6 flex-grow">{card.desc}</p>

        {/* Link */}
        <Link
          href={card.href}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#52525B] hover:text-[#C084FC] transition-colors mt-auto w-max"
        >
          → learn more
        </Link>
      </div>
    </motion.div>
  );
}

export function WhySection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="relative w-full pt-8 bg-[#000000] overflow-hidden">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes flowGlow { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-flow-glow {
          background: linear-gradient(90deg, transparent, #22D3EE, #A855F7, transparent);
          background-size: 200% 100%;
          animation: flowGlow 3s infinite linear;
        }
        @keyframes flowGlowVertical { 0% { background-position: 0 -200%; } 100% { background-position: 0 200%; } }
        .animate-flow-glow-vertical {
          background: linear-gradient(180deg, transparent, #22D3EE, #A855F7, transparent);
          background-size: 100% 200%;
          animation: flowGlowVertical 3s infinite linear;
        }
        @keyframes whyCardFlowGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .why-card-glow-line {
          background: linear-gradient(90deg, transparent, #22D3EE, #A855F7, transparent);
          background-size: 200% 100%;
          animation: whyCardFlowGlow 3s infinite linear;
        }
        .text-gradient-primary {
          background: linear-gradient(90deg, #22D3EE 0%, #67B7F7 30%, #A78BFA 65%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @media (hover: none) {
          .sl-card-top-glow { opacity: 1 !important; }
        }
      `}</style>

      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[rgba(168,85,247,0.07)] blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 -left-[200px] w-[400px] h-[400px] bg-[rgba(34,211,238,0.04)] blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -right-[200px] w-[400px] h-[400px] bg-[rgba(168,85,247,0.04)] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#7C3AED]" />
          <span className="text-[9px] font-bold tracking-[0.25em] text-[#C084FC] uppercase">THE SANDY.LIFTS SYSTEM</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#7C3AED]" />
        </div>

        {/* Heading */}
        <h2
          className="font-bold text-center leading-[1.1] mb-6 flex flex-col items-center"
          style={{ fontSize: "clamp(28px, 4.5vw, 44px)" }}
        >
          <span className="text-[#FFFFFF]">What Makes This</span>
          <span className="text-gradient-primary">System Different?</span>
        </h2>

        {/* Subtext */}
        <p className="text-[#A1A1AA] text-[13px] text-center max-w-[420px] mb-14 leading-relaxed">
          Results don't come from motivation. They come from systems.
        </p>

        {/* Cards — 3+2 bento grid */}
        <div className="relative w-full max-w-[1200px] mb-0">

          {/* Flow line desktop */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-[rgba(255,255,255,0.04)] z-0">
            <div className="w-full h-full animate-flow-glow" />
          </div>
          {/* Flow line mobile */}
          <div className="block lg:hidden absolute top-0 bottom-0 left-12 w-[1px] bg-[rgba(255,255,255,0.04)] z-0">
            <div className="w-full h-full animate-flow-glow-vertical" />
          </div>

          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {CARDS.slice(0, 3).map((card, i) => (
              <Card key={card.num} card={card} i={i} isMobile={isMobile} />
            ))}
          </div>

          {/* Row 2 — 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mt-4 lg:w-[66.67%] lg:mx-auto">
            {CARDS.slice(3, 5).map((card, i) => (
              <Card key={card.num} card={card} i={i + 3} isMobile={isMobile} />
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="w-full max-w-[1200px] mx-auto bg-[#111111] rounded-2xl border border-[rgba(168,85,247,0.12)] flex flex-col md:flex-row relative z-10 overflow-hidden mt-4">

          {/* Left — Quote + photo */}
          <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center border-b md:border-b-0 md:border-r border-[rgba(168,85,247,0.12)]">
            <span className="absolute top-6 left-6 text-5xl text-[#A855F7] font-serif leading-none opacity-60">"</span>
            <p className="text-xl md:text-2xl font-bold text-[#FFFFFF] relative z-10 pl-6 leading-tight mb-5">
              This isn't just another fitness plan.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22D3EE] to-[#A855F7]">
                It's your edge.
              </span>
            </p>
            <div className="flex items-center gap-3 pl-6">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[rgba(168,85,247,0.4)] shadow-[0_0_12px_rgba(168,85,247,0.25)] flex-shrink-0">
                <Image
                  src="/hero-selfie.png"
                  alt="Sandy"
                  fill
                  sizes="36px"
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
              <span className="text-[13px] text-[#52525B] font-medium">— Sandy, Founder &amp; Head Coach</span>
            </div>
          </div>

          {/* Right — Stats */}
          <div className="flex-[1.2] p-8 md:p-12 grid grid-cols-2 sm:grid-cols-4 gap-6 items-start">
            {[
              { value: 4, suffix: "+", label: "Years Exp.", sub: "Verified", color: "text-[#C084FC]" },
              { value: 35, suffix: "+", label: "Clients Globally", sub: "Real clients", color: "text-[#22D3EE]" },
              { value: "All", label: "Ages", sub: "18–60+", color: "text-[#FFFFFF]" },
              { value: "All", label: "Levels", sub: "Beginner ok", color: "text-[#A1A1AA]" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left group cursor-default">
                <div className={`text-3xl md:text-4xl font-black mb-1 transition-transform duration-300 group-hover:-translate-y-[2px] ${stat.color}`}>
                  {typeof stat.value === "number" ? (
                    <AnimatedCounter from={0} to={stat.value} duration={2} />
                  ) : (
                    stat.value
                  )}
                  {stat.suffix}
                </div>
                <div className="text-[12px] font-bold text-[#A1A1AA] mb-1 uppercase tracking-wider">{stat.label}</div>
                <div className="text-[11px] text-[#3F3F46]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Marquee strip */}
      <div className="w-full mt-24 border-t border-[rgba(255,255,255,0.04)] bg-[#000000] overflow-hidden py-5 relative z-10">
        <div className="flex w-max animate-marquee">
          {[...Array(4)].map((_, arrayIndex) => (
            <div key={arrayIndex} className="flex items-center">
              {MARQUEE_WORDS.map((word, i) => {
                const isHighlight1 = i % 3 === 1;
                const isHighlight2 = i % 3 === 2;
                let colorClass = "text-[rgba(255,255,255,0.08)]";
                if (isHighlight1) colorClass = "text-[rgba(168,85,247,0.4)]";
                if (isHighlight2) colorClass = "text-[rgba(34,211,238,0.3)]";
                return (
                  <div key={i} className="flex items-center">
                    <span className={`text-[13px] font-bold tracking-[0.2em] uppercase px-8 ${colorClass}`}>{word}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
