"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";

const CARDS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="health-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981"/><stop offset="100%" stopColor="#34D399"/>
          </linearGradient>
        </defs>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#health-g)"/>
        <path d="M8 12l3 3 5-5" stroke="url(#health-g)" strokeWidth="2.2"/>
      </svg>
    ),
    title: "Niva Bupa Health Insurance",
    badge: "Direct Agent",
    badgeColor: "#10B981",
    badgeRgb: "16,185,129",
    accent: "#10B981",
    accentAlt: "#34D399",
    accentRgb: "16,185,129",
    points: ["Cashless at 10,000+ hospitals", "Individual & family floater plans", "Top-up & super top-up covers", "Direct agent = faster claims support"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="compare-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#FCD34D"/>
          </linearGradient>
        </defs>
        <circle cx="11" cy="11" r="8" stroke="url(#compare-g)"/>
        <path d="m21 21-4.35-4.35" stroke="url(#compare-g)"/>
        <path d="M8 11h6M11 8v6" stroke="url(#compare-g)" strokeWidth="2.2"/>
      </svg>
    ),
    title: "Compare 30+ Insurers",
    badge: "Best Rate",
    badgeColor: "#F59E0B",
    badgeRgb: "245,158,11",
    accent: "#F59E0B",
    accentAlt: "#FCD34D",
    accentRgb: "245,158,11",
    points: ["Health, Motor & General insurance", "Term life plans from top companies", "Travel insurance — domestic & abroad", "I compare. You pick. Zero extra cost."],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="lic-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#C4B5FD"/>
          </linearGradient>
        </defs>
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="url(#lic-g)"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="url(#lic-g)"/>
        <circle cx="12" cy="16" r="1" fill="#A78BFA"/>
      </svg>
    ),
    title: "LIC Life Insurance",
    badge: "Coming Soon",
    badgeColor: "#A78BFA",
    badgeRgb: "167,139,250",
    accent: "#A78BFA",
    accentAlt: "#C4B5FD",
    accentRgb: "167,139,250",
    points: ["Term plans — pure income protection", "Savings & money-back policies", "ULIPs for long-term wealth growth", "Application in process — stay tuned"],
  },
];

const TICKERS = ["Niva Bupa","Star Health","Care Health","HDFC ERGO","Bajaj Allianz","New India","ICICI Lombard","Tata AIG","Max Bupa","Reliance General","United India","Oriental"];

function ShieldCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-130, 130], [12, -12]), { stiffness: 280, damping: 26 });
  const rotY = useSpring(useTransform(mx, [-130, 130], [-12, 12]), { stiffness: 280, damping: 26 });
  const glowX = useTransform(mx, [-130, 130], [10, 90]);
  const glowY = useTransform(my, [-130, 130], [10, 90]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "900px" }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{
          rotateX: rotX, rotateY: rotY,
          transformStyle: "preserve-3d",
          boxShadow: hovered
            ? `0 0 0 1px rgba(${card.accentRgb},0.45), 0 0 40px rgba(${card.accentRgb},0.2), 0 30px 60px rgba(0,0,0,0.6)`
            : `0 0 0 1px rgba(${card.accentRgb},0.12), 0 20px 40px rgba(0,0,0,0.4)`,
          transition: "box-shadow 0.35s ease",
        }}
        className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden cursor-default"
      >
        {/* Glass background */}
        <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(7,9,13,0.96) 60%)", backdropFilter: "blur(12px)" }} />

        {/* Spotlight following cursor */}
        {hovered && (
          <motion.div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(${card.accentRgb},0.18) 0%, transparent 55%)` }} />
        )}

        {/* Flowing top border line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden rounded-t-2xl">
          <div className="ss-flow-line" style={{ "--c": card.accent } as React.CSSProperties} />
        </div>

        {/* Corner glow */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(${card.accentRgb},0.2) 0%, transparent 70%)`, filter: "blur(12px)" }} />

        {/* Icon — pops out in Z */}
        <div className="relative z-10 flex items-start justify-between" style={{ transform: "translateZ(20px)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, rgba(${card.accentRgb},0.18), rgba(${card.accentRgb},0.06))`, border: `1px solid rgba(${card.accentRgb},0.3)`, boxShadow: `0 0 16px rgba(${card.accentRgb},0.2), inset 0 1px 0 rgba(255,255,255,0.1)` }}>
            {card.icon}
          </div>
          {/* Animated badge */}
          <span className="ss-badge text-[9.5px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{ background: `linear-gradient(135deg, rgba(${card.accentRgb},0.18), rgba(${card.accentRgb},0.06))`, border: `1px solid rgba(${card.accentRgb},0.45)`, color: card.badgeColor, boxShadow: `0 0 12px rgba(${card.badgeRgb},0.25)` }}>
            {card.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="relative z-10 text-[15px] font-black text-white leading-snug" style={{ transform: "translateZ(12px)" }}>{card.title}</h3>

        {/* Points */}
        <ul className="relative z-10 flex flex-col gap-2">
          {card.points.map((pt) => (
            <li key={pt} className="flex items-center gap-2.5 text-[12px] leading-snug" style={{ color: "#8B909E" }}>
              <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `rgba(${card.accentRgb},0.15)`, boxShadow: `0 0 6px rgba(${card.accentRgb},0.2)` }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke={card.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {pt}
            </li>
          ))}
        </ul>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, rgba(${card.accentRgb},0.4), transparent)` }} />
      </motion.div>
    </motion.div>
  );
}

export function SandyShieldSection() {
  return (
    <section className="relative w-full pt-1 pb-16 bg-[#000000] overflow-hidden">
      <style>{`
        @keyframes ss-ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes ss-float   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.03)} }
        @keyframes ss-spin    { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes ss-pulse   { 0%,100%{opacity:0.25;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.12)} }
        @keyframes ss-flow    { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes ss-badge   { 0%,100%{box-shadow:0 0 8px rgba(245,158,11,0.25)} 50%{box-shadow:0 0 18px rgba(245,158,11,0.6)} }
        @keyframes ss-glow-breathe { 0%,100%{opacity:0.5} 50%{opacity:1} }

        .ss-ticker-wrap { display:flex; width:max-content; animation:ss-ticker 30s linear infinite; }
        .ss-ticker-wrap:hover { animation-play-state:paused; }

        .ss-flow-line {
          height:1px; width:100%;
          background:linear-gradient(90deg, transparent 0%, var(--c) 50%, transparent 100%);
          background-size:200% 100%;
          animation:ss-flow 2.2s ease-in-out infinite;
        }
        .ss-badge { animation:ss-badge 2.5s ease-in-out infinite; }
      `}</style>

      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px]" style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px]" style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 65%)", filter: "blur(80px)" }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Hero Shield ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8"
        >
          {/* Animated shield stack */}
          <div className="relative flex items-center justify-center mb-4" style={{ width: 84, height: 84 }}>
            <div className="absolute inset-0 rounded-full" style={{ border: "1px dashed rgba(245,158,11,0.3)", animation: "ss-spin 12s linear infinite" }} />
            <div className="absolute" style={{ inset: 10, borderRadius: "50%", border: "1px solid rgba(245,158,11,0.2)", animation: "ss-pulse 3s ease-in-out infinite" }} />
            <div className="absolute" style={{ inset: 20, borderRadius: "50%", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", animation: "ss-glow-breathe 2.5s ease-in-out infinite" }} />
            <div className="relative z-10" style={{ animation: "ss-float 4s ease-in-out infinite" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(145deg, rgba(245,158,11,0.2), rgba(245,158,11,0.06))", border: "1px solid rgba(245,158,11,0.4)", boxShadow: "0 0 20px rgba(245,158,11,0.35), 0 0 40px rgba(245,158,11,0.1), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="hero-shield" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#FCD34D"/>
                    </linearGradient>
                  </defs>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#hero-shield)" strokeWidth="1.8"/>
                  <path d="M9 12l2 2 4-4" stroke="url(#hero-shield)" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-[1px]" style={{ background: "linear-gradient(to right, transparent, #F59E0B)" }} />
            <span className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: "#F59E0B" }}>Sandy Shield</span>
            <div className="w-10 h-[1px]" style={{ background: "linear-gradient(to left, transparent, #F59E0B)" }} />
          </div>

          <h2 className="font-black text-center leading-[1.1] mb-3" style={{ fontSize: "clamp(24px, 3.5vw, 38px)" }}>
            <span className="text-white">Protect What </span>
            <span style={{ background: "linear-gradient(90deg, #F59E0B 0%, #FCD34D 60%, #F59E0B 100%)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "ss-flow 3s linear infinite" }}>
              You Build.
            </span>
          </h2>
          <p className="text-[13px] text-center max-w-[360px] leading-relaxed" style={{ color: "#71717A" }}>
            Free consultation. Right cover. Zero pressure. Sandy personally guides you.
          </p>
        </motion.div>

        {/* ── 3D Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {CARDS.map((card, i) => <ShieldCard key={card.title} card={card} index={i} />)}
        </div>

        {/* ── Ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-center text-[9px] font-black tracking-[0.28em] uppercase mb-3" style={{ color: "#3F3F46" }}>Partner Insurers</p>
          <div className="overflow-hidden relative" style={{ maskImage: "linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%)" }}>
            <div className="ss-ticker-wrap">
              {[...TICKERS, ...TICKERS].map((name, i) => (
                <span key={i} className="inline-flex items-center gap-2 mx-2.5 px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#52525B" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#F59E0B", opacity: 0.5, boxShadow: "0 0 4px rgba(245,158,11,0.8)" }} />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <a
            href="https://wa.me/916283752916?text=Hi%20Sandy!%20I%20want%20a%20free%20insurance%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-black text-[0.95rem] overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
            style={{ background: "linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)", backgroundSize: "200%", color: "#07090D", boxShadow: "0 0 32px rgba(245,158,11,0.45), 0 0 64px rgba(245,158,11,0.15), 0 8px 24px rgba(0,0,0,0.5)", animation: "ss-flow 3s linear infinite" }}
          >
            {/* Shimmer */}
            <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%)", animation: "ss-flow 2s linear infinite" }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="relative z-10">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="relative z-10">Book Free Consultation — It&apos;s Free</span>
          </a>

          <Link href="/sandy-shield" className="text-[12px] font-semibold hover:opacity-100 transition-opacity" style={{ color: "#F59E0B", opacity: 0.65 }}>
            Or use the Insurance Quiz →
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
