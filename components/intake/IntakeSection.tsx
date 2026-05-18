"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { WomenIntakeForm } from "@/components/intake/WomenIntakeForm";
import { MenIntakeForm } from "@/components/intake/MenIntakeForm";

function TiltCard({ type, onClick }: { type: "women" | "men", onClick: () => void }) {
  const isWomen = type === "women";
  const title = isWomen ? "Women's Programme" : "Men's Programme";
  const desc = "A 1% personalised system covering diet, lifting, and lifestyle.";
  const accent = isWomen ? "#E5989B" : "#4DA3FF";
  const bgGrad = isWomen ? "rgba(229,152,155,0.05)" : "rgba(77,163,255,0.05)";
  const border = isWomen ? "rgba(229,152,155,0.2)" : "rgba(77,163,255,0.2)";
  const glow = isWomen ? "rgba(229,152,155,0.3)" : "rgba(77,163,255,0.3)";

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
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
      className="relative w-full max-w-[340px] mx-auto rounded-[24px] cursor-pointer"
      onClick={onClick}
    >
      <div 
        style={{
          background: `linear-gradient(145deg, ${bgGrad}, rgba(255,255,255,0.02))`,
          border: `1px solid ${border}`,
          boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
          transform: "translateZ(40px)",
        }}
        className="p-8 rounded-[24px] flex flex-col items-center text-center transition-all duration-300 hover:border-white/30 backdrop-blur-sm"
      >
        <div 
          style={{ background: `linear-gradient(135deg, ${accent}, #fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          className="text-[1.75rem] font-black mb-3 leading-tight"
        >
          {title}
        </div>
        <p className="text-[#8B909E] text-[0.9rem] mb-8 leading-relaxed">{desc}</p>
        
        <button 
          className="w-full py-3.5 rounded-[14px] font-bold text-[#07090D] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
          style={{ background: `linear-gradient(135deg, ${accent}, #fff)`, boxShadow: `0 0 24px ${glow}` }}
        >
          Start Assessment <span className="text-xl leading-none">→</span>
        </button>
      </div>
      
      {/* 3D info button floating */}
      <div 
        style={{ transform: "translateZ(80px)" }}
        className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors shadow-xl"
        title="100% Private, Takes ~5 mins"
      >
        i
      </div>
    </motion.div>
  );
}

export function IntakeSection() {
  const [activeForm, setActiveForm] = useState<"women" | "men" | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [activeForm]);

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#07090D] overflow-hidden" id="intake-section">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#A78BFA] rounded-full blur-[200px] opacity-[0.07] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Blinking Limited Time Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] mb-8"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
          <span className="text-red-500 text-[0.65rem] sm:text-[0.7rem] font-black tracking-[0.2em] uppercase">Limited Intake Available</span>
        </motion.div>

        {/* Premium Headline with Clamp for Mobile */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center font-black text-white mb-5" 
          style={{ fontSize: "clamp(2rem, 6vw, 3.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          Claim Your 1% <span style={{ background:"linear-gradient(135deg,#4DA3FF,#A78BFA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Transformation</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#8B909E] text-center max-w-[540px] mx-auto mb-20" 
          style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", lineHeight: 1.6 }}
        >
          A highly exclusive, fully customised system designed to hit your peak. Select your programme below.
        </motion.p>

        {/* 3D Cards Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14" 
          style={{ perspective: "1200px" }}
        >
          <TiltCard type="women" onClick={() => setActiveForm("women")} />
          <TiltCard type="men" onClick={() => setActiveForm("men")} />
        </motion.div>
      </div>

      {/* Fullscreen iOS Glassmorphic Modal */}
      <AnimatePresence>
        {activeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6"
            style={{ 
              background: "rgba(0, 0, 0, 0.3)", 
              backdropFilter: "blur(32px)", 
              WebkitBackdropFilter: "blur(32px)"
            }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full h-full sm:h-auto max-w-[1100px] max-h-[100vh] sm:max-h-[95vh] overflow-y-auto sm:rounded-[32px] custom-scrollbar"
              style={{
                background: "rgba(7, 9, 13, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveForm(null)}
                className="fixed sm:absolute top-5 right-5 sm:top-8 sm:right-8 w-11 h-11 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.1)] transition-all z-[110] backdrop-blur-xl shadow-lg"
              >
                ✕
              </button>

              {/* Form Content - Remove top padding on mobile since forms have their own */}
              <div className="w-full">
                {activeForm === "women" ? <WomenIntakeForm /> : <MenIntakeForm />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </section>
  );
}
