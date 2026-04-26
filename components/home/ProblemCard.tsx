"use client";
import { motion } from "framer-motion";

export function ProblemCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{ 
        opacity: { duration: 0.8, delay: 0.5 },
        scale: { duration: 0.8, delay: 0.5 },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
      className="relative w-full max-w-[340px] mx-auto lg:mx-0"
    >
      {/* Subtle Glow Behind Card */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#4DA3FF]/20 via-[#66E6FF]/10 to-[#A78BFA]/20 rounded-2xl blur-xl opacity-70" />
      
      {/* Glassmorphism Card */}
      <div className="relative bg-[#07090D]/85 backdrop-blur-2xl border border-[#4DA3FF]/20 rounded-2xl p-6 md:p-7 shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#4DA3FF]/10 flex items-center justify-center border border-[#4DA3FF]/25 shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <p className="text-[1.05rem] font-medium text-[#AAB3C5]">
                Problem <span className="text-white font-semibold">aap</span> nahi ho.
              </p>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#A78BFA]/10 flex items-center justify-center border border-[#A78BFA]/25 shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <p className="text-[1.05rem] font-medium text-[#AAB3C5]">
                Problem <span className="text-white font-semibold">system</span> ka lack hai.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4DA3FF]/30 to-transparent my-1" />
          
          <div className="text-center">
            <p className="text-[1.15rem] font-bold bg-gradient-to-r from-[#4DA3FF] via-[#66E6FF] to-[#A78BFA] bg-clip-text text-transparent leading-tight">
              Aur isi liye Sandy.Lifts<br/>exist karta hai.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
