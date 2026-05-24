"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center lg:items-start gap-5 mt-2 w-full"
    >
      <p className="text-[1.05rem] font-semibold tracking-wide bg-gradient-to-r from-[#4DA3FF] to-[#66E6FF] bg-clip-text text-transparent text-center lg:text-left">
        No guesswork. No confusion. SIRF RESULTS.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-full sm:w-auto group mt-2"
      >
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4DA3FF] via-[#A78BFA] to-[#66E6FF] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        />
        <Link
          href="/get-started"
          className="relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4DA3FF] via-[#5BA4FF] to-[#66E6FF] text-[#07090D] rounded-full font-bold text-[1.1rem] w-full sm:w-auto overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/20"
        >
          <motion.div
            animate={{ x: ["-200%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
          />
          <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            Start Your Transformation
          </span>
        </Link>
      </motion.div>

      <div className="flex flex-col gap-2.5 mt-0 text-[0.85rem] text-[#AAB3C5]/90 items-center lg:items-start pl-0 lg:pl-1">
        <div className="flex items-center gap-2.5">
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#4DA3FF" className="drop-shadow-[0_0_6px_rgba(77,163,255,0.8)]"><polygon points="12 2 15 10 23 12 15 14 12 22 9 14 1 12 9 10 12 2" /></svg>
          </motion.div>
          <span>Free plan. No signup required</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E] shadow-[0_0_8px_#22C55E]"></span>
          </span>
          <span className="text-[#4ADE80] font-semibold">Live: 4 active coaching slots remaining</span>
        </div>
      </div>
    </motion.div>
  );
}
