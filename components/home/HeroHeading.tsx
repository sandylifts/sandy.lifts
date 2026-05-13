"use client";
import { motion } from "framer-motion";

export function HeroHeading() {
  return (
    <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center lg:items-start"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4DA3FF]/10 border border-[#4DA3FF]/25 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF] shadow-[0_0_8px_#4DA3FF]" />
          <span className="text-[#4DA3FF] text-[0.72rem] font-bold tracking-[0.1em] uppercase">
            Sandy.Lifts Fitness System
          </span>
        </div>
        <h1 className="text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold tracking-tight leading-[1.1] text-[#F5F7FA] max-w-2xl">
          Confused About Fitness?<br />
          <span className="bg-gradient-to-br from-[#4DA3FF] via-[#66E6FF] to-[#A78BFA] bg-clip-text text-transparent pb-1">
            You&apos;re Not Alone.
          </span>
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="text-[clamp(1rem,1.5vw,1.15rem)] text-[#AAB3C5] font-semibold leading-relaxed max-w-[480px] mt-2"
      >
        You show up. We take care of the rest.<br />
        We don&apos;t just guide — we take responsibility for your transformation.
      </motion.p>
    </div>
  );
}
