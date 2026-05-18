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
  const bgGrad = isWomen ? "rgba(229,152,155,0.04)" : "rgba(77,163,255,0.04)";
  const border = isWomen ? "rgba(229,152,155,0.18)" : "rgba(77,163,255,0.18)";
  const glow = isWomen ? "rgba(229,152,155,0.25)" : "rgba(77,163,255,0.25)";

  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    setIsHovered(true);
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    const xPct = mX / width - 0.5;
    const yPct = mY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
    mouseX.set(mX);
    mouseY.set(mY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Cursor following glow background style using motion transforms
  const movingGlow = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => `radial-gradient(280px circle at ${mx}px ${my}px, ${isWomen ? 'rgba(229,152,155,0.12)' : 'rgba(77,163,255,0.12)'}, transparent 80%)`
  );

  return (
    <div className="relative tilt-card-wrapper" style={{ perspective: "1000px" }}>
      {/* Ambient glow behind card */}
      <div 
        style={{
          position: "absolute",
          inset: "-15px",
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
          opacity: isHovered ? 0.15 : 0,
          filter: "blur(40px)",
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-[340px] mx-auto rounded-[28px] cursor-pointer transition-all duration-300"
        onClick={onClick}
      >
        <div 
          style={{
            background: "rgba(10, 12, 18, 0.4)",
            border: `1px solid ${isHovered ? 'rgba(255,255,255,0.18)' : border}`,
            boxShadow: isHovered 
              ? `0 30px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(${isWomen ? '229,152,155' : '77,163,255'}, 0.05)` 
              : `0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
            transform: "translateZ(40px)",
            transformStyle: "preserve-3d",
            transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          }}
          className="p-8 rounded-[28px] flex flex-col items-center text-center backdrop-blur-md relative overflow-hidden"
        >
          {/* Glow motion layer */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: movingGlow,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <div 
            style={{ 
              background: `linear-gradient(135deg, ${accent}, #fff)`, 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent",
              transform: isHovered ? "translateZ(55px)" : "translateZ(0px)",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            className="text-[1.75rem] font-black mb-3 leading-tight relative z-10 select-none"
          >
            {title}
          </div>
          
          <p 
            style={{ 
              transform: isHovered ? "translateZ(35px)" : "translateZ(0px)",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            className="text-[#8B909E] text-[0.9rem] mb-8 leading-relaxed relative z-10 select-none"
          >
            {desc}
          </p>
          
          <button 
            className="w-full py-4 rounded-[16px] font-bold text-[#07090D] flex items-center justify-center gap-2 transition-all duration-300 relative z-10"
            style={{ 
              background: `linear-gradient(135deg, ${accent}, #fff)`, 
              boxShadow: isHovered ? `0 0 28px ${glow}, 0 4px 12px rgba(0,0,0,0.3)` : `0 0 16px rgba(0,0,0,0.2)`,
              transform: isHovered ? "translateZ(50px) scale(1.03)" : "translateZ(0px) scale(1)",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease"
            }}
          >
            Start Assessment <span className="text-xl leading-none">→</span>
          </button>
        </div>
        
        {/* Floating 3D Info Badge */}
        <div 
          style={{ 
            transform: isHovered ? "translateZ(75px)" : "translateZ(20px)",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-[#0a0c12] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors shadow-2xl z-20 font-serif"
          title="100% Private, Takes ~5 mins"
        >
          i
        </div>
      </motion.div>
    </div>
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
      {/* Background Glows (Aurora Flow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#4DA3FF] opacity-[0.03] blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#A78BFA] opacity-[0.03] blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: "12s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#A78BFA] rounded-full blur-[200px] opacity-[0.05] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Blinking Neon Limited Time Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[rgba(239,68,68,0.03)] border border-[rgba(239,68,68,0.18)] mb-8 shadow-[0_0_20px_rgba(239,68,68,0.05)] neon-badge-glow"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
          </span>
          <span className="text-red-500 text-[0.68rem] sm:text-[0.72rem] font-black tracking-[0.22em] uppercase neon-text-flicker select-none">
            Limited Intake Available
          </span>
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
        
        /* Neon sign flicker animation */
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 4px rgba(239,68,68,0.85)) drop-shadow(0 0 10px rgba(239,68,68,0.4));
          }
          20%, 24%, 55% {
            opacity: 0.35;
            filter: none;
          }
        }
        @keyframes neon-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(239,68,68,0.05), inset 0 0 8px rgba(239,68,68,0.02);
            border-color: rgba(239,68,68,0.18);
          }
          50% {
            box-shadow: 0 0 25px rgba(239,68,68,0.15), inset 0 0 12px rgba(239,68,68,0.05);
            border-color: rgba(239,68,68,0.35);
          }
        }
        .neon-text-flicker {
          animation: neon-flicker 5s infinite alternate;
        }
        .neon-badge-glow {
          animation: neon-glow-pulse 2s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
