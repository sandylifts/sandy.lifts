"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROBLEMS = [
  "100 videos dekhte ho… but still don't know what to follow",
  "Diet plan milta hai… but real life mein follow nahi hota",
  "Workout kar raha hoon… but result nahi aa raha",
  "Diet follow karta hoon… but confuse ho jata hoon",
  "Har trainer kuch alag bolta hai",
  "Consistency maintain nahi ho pa rahi"
];

export function ProblemSlider() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROBLEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div 
      className="relative overflow-hidden flex flex-col justify-center w-full px-6 py-7 bg-gradient-to-br from-[#FF4D4D]/10 via-[#FF4D4D]/5 to-transparent border border-[#FF4D4D]/20 rounded-2xl backdrop-blur-md shadow-[0_8px_32px_rgba(255,77,77,0.1)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,77,77,0.2)] hover:border-[#FF4D4D]/40 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D4D]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 mb-4 z-10"
      >
        <div className="relative flex items-center justify-center w-3 h-3">
          <div className="absolute w-full h-full bg-[#FF4D4D] rounded-full animate-ping opacity-70" />
          <div className="w-1.5 h-1.5 bg-[#FF4D4D] rounded-full z-10" />
        </div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#FF4D4D] uppercase drop-shadow-[0_0_8px_rgba(255,77,77,0.5)]">
          Sounds familiar?
        </span>
      </motion.div>

      <div className="flex flex-col w-full relative z-10 min-h-[4.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={PROBLEMS[index]}
            initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              filter: "blur(0px)",
              color: "#ffffff"
            }}
            exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-[1.15rem] md:text-[1.25rem] font-semibold leading-relaxed w-full italic text-white/90"
          >
            &quot;{PROBLEMS[index]}&quot;
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5 mt-5 z-10">
        {PROBLEMS.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
              i === index ? 'w-8 bg-[#FF4D4D] shadow-[0_0_8px_rgba(255,77,77,0.8)]' : 'w-2 bg-white/10 hover:bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
