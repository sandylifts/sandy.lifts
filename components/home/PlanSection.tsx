"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function useCountdown(initSecs: number) {
  const [secs, setSecs] = useState(initSecs);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return { h: Math.floor(secs / 3600), m: Math.floor((secs % 3600) / 60), s: secs % 60 };
}
const pad = (n: number) => String(n).padStart(2, "0");

const W_PTS = ["PCOS / PCOD aware planning","Period-friendly schedule","Hormonal balance nutrition","Fat loss & body toning","Focus: Belly, Thighs, Arms","Veg-friendly meal plan"];
const M_PTS = ["Fat loss & muscle building","Exercise history review","Body recomposition plans","Strength & stamina goals","Diet & supplement guidance","Performance nutrition"];
const TRUST = [{ icon:"🔒", label:"100% Private" },{ icon:"✅", label:"No Login" },{ icon:"⏱", label:"~5 mins" },{ icon:"📋", label:"Plan in 24 hrs" }];

const Check = ({ color }: { color: string }) => (
  <span style={{ width:18,height:18,borderRadius:"50%",background:`rgba(${color},0.15)`,border:`1px solid rgba(${color},0.4)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke={`rgb(${color})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>
);

function TiltCard({ type, onClick }: { type: "women" | "men", onClick: () => void }) {
  const isWomen = type === "women";

  const title = isWomen ? "Let's Understand Your Body First" : "Men's Programme";
  const badgeText = isWomen ? "Coach Reviewed Application" : "Active Coaching Slots";
  const subDesc = isWomen ? "Your body needs understanding — not punishment." : "";
  const desc = isWomen
    ? "Supportive fat loss coaching designed for women dealing with PCOS, bloating, cravings, hormonal imbalances & stubborn weight."
    : "Built for male physiology — muscle, fat loss, recomposition and strength building.";
  const points = isWomen ? W_PTS : M_PTS;

  const accent = isWomen ? "#E5989B" : "#4DA3FF";
  const rgbColor = isWomen ? "229,152,155" : "77,163,255";
  const badgeColor = isWomen ? "34,197,94" : "77,163,255";
  const bgGrad = `rgba(${rgbColor},0.04)`;
  const border = `rgba(${rgbColor},0.25)`;
  const glow = `rgba(${rgbColor},0.35)`;

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-[420px] mx-auto rounded-[24px]"
    >
      <div
        style={{
          background: `linear-gradient(145deg, ${bgGrad}, rgba(255,255,255,0.01))`,
          border: `1px solid ${border}`,
          boxShadow: `0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
          transform: "translateZ(30px)",
        }}
        className="p-6 md:p-8 rounded-[24px] flex flex-col gap-5 transition-all duration-300 hover:border-white/30 backdrop-blur-sm"
      >
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(${rgbColor},0.15) 0%, transparent 70%)` }} />

        <div style={{ transform: "translateZ(20px)" }} className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: `rgba(${badgeColor},0.1)`, border: `1px solid rgba(${badgeColor},0.3)` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: `rgb(${badgeColor})` }} />
            <span className="text-[0.7rem] font-bold tracking-wider" style={{ color: `rgb(${badgeColor})` }}>{badgeText}</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{isWomen ? '💖' : '💪'}</span>
            <div>
              <p style={{ color: accent }} className="text-[0.7rem] font-bold tracking-[0.15em] uppercase m-0">{isWomen ? 'For Women' : 'For Men'}</p>
              <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight m-0">{title}</h3>
            </div>
          </div>

          <div className="hidden md:block">
            {subDesc && <p style={{ color: "#F5CAC3" }} className="text-[0.83rem] font-semibold leading-relaxed mt-2 mb-1">{subDesc}</p>}
            <p className="text-[#8B909E] text-[0.85rem] leading-relaxed m-0">{desc}</p>
          </div>
        </div>

        <div style={{ transform: "translateZ(25px)" }} className="hidden md:flex flex-col gap-2.5">
          {points.map(pt => (
            <div key={pt} className="flex items-center gap-3 text-[0.875rem] text-[#D8DBFC]">
              <Check color={rgbColor} /> {pt}
            </div>
          ))}
        </div>

        <div style={{ transform: "translateZ(40px)" }} className="mt-2 md:mt-2">
          <button
            onClick={onClick}
            className="w-full py-3.5 md:py-4 rounded-xl font-bold text-[#07090D] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${accent}, #fff)`, boxShadow: `0 0 28px ${glow}` }}
          >
            Start Assessment <span className="text-xl leading-none">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function PlanSection() {
  const { h, m, s } = useCountdown(11 * 3600 + 47 * 60 + 32);
  const router = useRouter();

  return (
    <section id="intake" className="relative w-full bg-[#07090D] overflow-hidden" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 15px rgba(239,68,68,0.8); }
          50% { opacity: 0.6; box-shadow: 0 0 5px rgba(239,68,68,0.3); }
        }
      `}</style>

      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(229,152,155,0.04) 0%, transparent 70%)" }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(77,163,255,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-[1000px] mx-auto px-5 relative z-10 flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] mb-5 backdrop-blur-sm shadow-[0_0_24px_rgba(239,68,68,0.1)]"
        >
          <span className="text-sm">🔥</span>
          <span className="text-red-500 text-[0.68rem] font-black tracking-[0.14em] uppercase">Limited Time Free</span>
          <span className="w-[1px] h-3 bg-red-500/30 mx-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[pulse-glow_1.5s_ease-in-out_infinite]" />
          <span className="text-[#FCA5A5] text-[0.68rem] font-bold">Only 4 spots left</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center font-black text-white mb-3"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.9rem)", lineHeight: 1.1 }}
        >
          Get Your Free <span style={{ background:"linear-gradient(90deg,#E5989B,#4DA3FF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Personalised Plan</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#8B909E] text-center max-w-[460px] mx-auto mb-6"
          style={{ fontSize: "0.95rem", lineHeight: 1.65 }}
        >
          Usually <span className="line-through text-gray-500">₹2,999</span> <span className="text-green-400 font-bold">free this week only.</span> Sandy personally reviews every form — no bots, no templates.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-[14px] px-4 py-2.5 mb-11 backdrop-blur-md"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-[0.1em]">Offer ends in</span>
          <div className="flex items-center gap-0.5 ml-1">
            {[pad(h),":",pad(m),":",pad(s)].map((seg,i) => (
              <span key={i} className={`${i%2===0 ? "text-white font-black text-[1.05rem] min-w-[22px] text-center" : "text-gray-600 font-bold text-[0.7rem]"} font-mono`}>
                {seg}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-12"
          style={{ perspective: "1200px" }}
        >
          <TiltCard type="women" onClick={() => router.push("/start/women")} />
          <TiltCard type="men" onClick={() => router.push("/start/men")} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {TRUST.map(t => (
            <div key={t.label} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[0.8rem] text-[#8B909E] font-medium">
              <span>{t.icon}</span>{t.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
