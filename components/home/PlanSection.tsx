"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { WomenIntakeForm } from "@/components/intake/WomenIntakeForm";
import { MenIntakeForm } from "@/components/intake/MenIntakeForm";

// Countdown Hook
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

// Responsive 3D Tilt Card Component
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
  const badgeColor = isWomen ? "34,197,94" : "77,163,255"; // Green for women badge, blue for men
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
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
          {/* Badge - Always visible */}
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

          {/* Desktop Only Text */}
          <div className="hidden md:block">
            {subDesc && <p style={{ color: "#F5CAC3" }} className="text-[0.83rem] font-semibold leading-relaxed mt-2 mb-1">{subDesc}</p>}
            <p className="text-[#8B909E] text-[0.85rem] leading-relaxed m-0">{desc}</p>
          </div>
        </div>

        {/* Bullet Points - Hidden on mobile entirely */}
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

// Premium Consent Modal Component
function ConsentScreen({ type, onConsent, onCancel }: { type: "women" | "men", onConsent: () => void, onCancel: () => void }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isWomen = type === "women";
  
  const title = isWomen ? "Women's Programme" : "Men's Programme";
  const desc = isWomen 
    ? "To build a truly 1% custom plan, we need to understand your physiological profile, including any history with PCOS, bloating, or hormonal imbalances."
    : "To build a truly 1% custom plan, we need to understand your metabolic baseline, strength history, and body recomposition goals.";
  const points = isWomen ? W_PTS : M_PTS;
  const rgbColor = isWomen ? "229,152,155" : "77,163,255";
  const accent = isWomen ? "#E5989B" : "#4DA3FF";

  const handleProceed = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onConsent();
    }, 800); // < 1s smooth loading
  };

  return (
    <div className="p-4 sm:p-10 w-full max-w-[500px] mx-auto text-left relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none rounded-full blur-[100px]" style={{ background: `rgba(${rgbColor}, 0.15)` }} />
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <span className="text-3xl">{isWomen ? "💖" : "💪"}</span>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h3>
      </div>
      
      <p className="text-[#8B909E] text-[0.95rem] mb-8 leading-relaxed font-medium relative z-10">
        {desc}
      </p>

      {/* Premium Box */}
      <div className="relative flex flex-col gap-3 mb-10 bg-[rgba(255,255,255,0.02)] p-6 rounded-[20px] border border-white/10 backdrop-blur-md shadow-2xl z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20" style={{ background: accent }} />
        <p className="text-[0.7rem] font-black mb-2 tracking-[0.15em] uppercase" style={{ color: accent }}>What you're getting</p>
        {points.map(pt => (
          <div key={pt} className="flex items-center gap-3 text-[0.9rem] font-medium text-[#E5E7EB]">
            <span style={{ color: accent }}>✓</span> {pt}
          </div>
        ))}
      </div>

      {/* Consent Box */}
      <label className="flex items-start gap-4 p-5 rounded-[16px] border bg-[rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300 mb-8 group relative z-10" style={{ borderColor: isChecked ? `rgba(${rgbColor}, 0.5)` : 'rgba(255,255,255,0.1)', boxShadow: isChecked ? `0 0 20px rgba(${rgbColor}, 0.15)` : 'none' }}>
        <div className="relative flex items-center justify-center w-6 h-6 shrink-0 rounded-md bg-black border border-white/20 mt-0.5 group-hover:border-white/40 transition-colors" style={{ borderColor: isChecked ? accent : '' }}>
          <input 
            type="checkbox" 
            className="absolute opacity-0 w-full h-full cursor-pointer"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          {isChecked && (
             <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="20 6 9 17 4 12"></polyline>
             </motion.svg>
          )}
        </div>
        <p className="text-[0.85rem] text-gray-400 leading-relaxed select-none font-medium">
          I consent to providing my personal health and lifestyle data. I understand this data is strictly private and will only be used to create my customised fitness plan.
        </p>
      </label>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4 relative z-10">
        <button 
          onClick={onCancel}
          disabled={isTransitioning}
          className="px-5 sm:px-6 py-4 rounded-[14px] font-bold text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleProceed}
          disabled={!isChecked || isTransitioning}
          className={`flex-1 py-4 rounded-[14px] font-black flex items-center justify-center gap-2 transition-all duration-300 ${isChecked ? "text-[#07090D] scale-100" : "text-white/30 bg-white/5 scale-95 cursor-not-allowed"}`}
          style={isChecked ? { background: `linear-gradient(135deg, ${accent}, #fff)`, boxShadow: `0 0 25px rgba(${rgbColor},0.4)` } : {}}
        >
          {isTransitioning ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-2 border-black border-t-transparent rounded-full" />
          ) : (
            <>Proceed to Form <span className="text-xl leading-none">→</span></>
          )}
        </button>
      </div>
    </div>
  );
}

type ActiveState = null | "women-consent" | "men-consent" | "women-intake" | "men-intake";

export function PlanSection() {
  const { h, m, s } = useCountdown(11 * 3600 + 47 * 60 + 32);
  const [activeState, setActiveState] = useState<ActiveState>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeState) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [activeState]);

  const handleCardClick = (type: "women" | "men") => {
    setActiveState(`${type}-consent`);
  };

  return (
    <section id="intake" className="relative w-full bg-[#07090D] overflow-hidden" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <style>{`
        @keyframes pulse-glow { 
          0%, 100% { opacity: 1; box-shadow: 0 0 15px rgba(239,68,68,0.8); } 
          50% { opacity: 0.6; box-shadow: 0 0 5px rgba(239,68,68,0.3); } 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(229,152,155,0.04) 0%, transparent 70%)" }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(77,163,255,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-[1000px] mx-auto px-5 relative z-10 flex flex-col items-center">
        
        {/* Blinking Limited Time Badge */}
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

        {/* Premium Headline with Clamp for Mobile */}
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

        {/* Countdown */}
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

        {/* 3D Responsive Cards Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-12" 
          style={{ perspective: "1200px" }}
        >
          <TiltCard type="women" onClick={() => handleCardClick("women")} />
          <TiltCard type="men" onClick={() => handleCardClick("men")} />
        </motion.div>

        {/* Trust Badges */}
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

      {/* Fullscreen iOS Glassmorphic Modal */}
      <AnimatePresence>
        {activeState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[40] flex items-start justify-center overflow-y-auto overflow-x-hidden custom-scrollbar"
            style={{ 
              background: "rgba(0, 0, 0, 0.4)", 
              backdropFilter: "blur(32px)", 
              WebkitBackdropFilter: "blur(32px)"
            }}
          >
            {/* Close Button - Completely outside the transform so it stays fixed to the viewport */}
            <button 
              onClick={() => setActiveState(null)}
              className="fixed top-24 right-4 sm:top-24 sm:right-8 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all z-[45] backdrop-blur-xl shadow-2xl cursor-pointer"
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-[1100px] sm:rounded-[32px] sm:my-20 my-0 min-h-[100vh] sm:min-h-0"
              style={{
                background: "rgba(7, 9, 13, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* Dynamic Modal Content with mobile top padding to avoid close button overlap */}
              <div className="w-full h-full flex flex-col justify-center pt-28 sm:pt-10 pb-10 sm:pb-10 px-0 sm:px-4">
                {activeState === "women-consent" && (
                   <ConsentScreen type="women" onConsent={() => setActiveState("women-intake")} onCancel={() => setActiveState(null)} />
                )}
                {activeState === "men-consent" && (
                   <ConsentScreen type="men" onConsent={() => setActiveState("men-intake")} onCancel={() => setActiveState(null)} />
                )}
                
                {activeState === "women-intake" && <WomenIntakeForm />}
                {activeState === "men-intake" && <MenIntakeForm />}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
