"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Rahul",
    handle: "@rahul.m",
    result: "Lost 10kg in 12 weeks",
    text: "Pehle lagta tha time nahi milega. But the system is so practical. 12 weeks mein 10kg down, aur energy levels ekdum top notch.",
    initials: "R",
  },
  {
    name: "Sneha",
    handle: "@sneha_fit",
    result: "Recomp & Fat Loss",
    text: "No crash diets, no starving. I eat what I love, just structured better. Sandy.Lifts completely changed my relationship with food.",
    initials: "S",
  },
  {
    name: "Amit",
    handle: "@amit.v",
    result: "Broke 4-month plateau",
    text: "Bhai, the AI insights are insane. It literally predicts when I'll plateau and adjusts my macros beforehand. True 1% level coaching.",
    initials: "A",
  },
  {
    name: "Priya",
    handle: "@dr.priya",
    result: "Lost 8kg sustainably",
    text: "As a doctor, I'm very skeptical of fitness fads. But the science-backed approach here is flawless. Sustainable and highly effective.",
    initials: "P",
  },
  {
    name: "Vikram",
    handle: "@vikram_r",
    result: "Hostel Transformation",
    text: "Hostel mein rehkar diet maintain karna mushkil tha, but the custom plan made it effortless. Best investment for my health.",
    initials: "V",
  },
];

export function TestimonialSection() {
  return (
    <section className="relative w-full pt-4 pb-12 bg-[#000000] overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-[rgba(168,85,247,0.04)] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-[rgba(77,163,255,0.04)] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#A78BFA]" />
            <span className="text-[9px] font-bold tracking-[0.25em] text-[#A78BFA] uppercase">Client Experiences</span>
            <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#A78BFA]" />
          </div>

          <h2
            className="font-bold text-center leading-[1.1] mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
          >
            <span className="text-white">Don't Just Take </span>
            <span
              style={{
                background: "linear-gradient(90deg, #A78BFA 0%, #4DA3FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Word For It.
            </span>
          </h2>
          
          <p className="text-[#A1A1AA] text-[13px] text-center max-w-[420px] leading-relaxed">
            Real feedback from people who trusted the process and unlocked their potential.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative flex overflow-hidden pb-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
          {/* Mask for smooth fade at edges */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 z-20 pointer-events-none bg-gradient-to-r from-[#000000] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 z-20 pointer-events-none bg-gradient-to-l from-[#000000] to-transparent" />
          
          <div className="flex gap-6 w-max animate-scroll">
            {/* Double the array for seamless looping */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div
                key={idx}
                className="w-[300px] sm:w-[380px] flex-shrink-0 relative group rounded-2xl p-[1px] overflow-hidden"
              >
                {/* Glow Border on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(168,85,247,0.3)] to-[rgba(77,163,255,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative h-full bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 sm:p-7 flex flex-col transition-all duration-300 group-hover:bg-[#0c0c0e] group-hover:-translate-y-1 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                  
                  {/* User Profile Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      {/* Avatar Placeholder */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a24] to-[#0A0A0A] border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#A78BFA] font-bold text-[14px]">
                        {t.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-bold text-white">{t.name}</span>
                          {/* Verified Badge */}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#4DA3FF">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
                          </svg>
                        </div>
                        <div className="text-[12px] text-[#A1A1AA] mt-0.5">{t.handle}</div>
                      </div>
                    </div>
                    {/* Small Twitter/Social-style icon or just a sleek quote mark */}
                    <svg className="w-5 h-5 text-[rgba(168,85,247,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-[14px] text-[#E2E8F0] leading-relaxed mb-6 flex-grow font-normal">
                    {t.text}
                  </p>
                  
                  {/* Tag / Result */}
                  <div className="flex items-center pt-4 border-t border-[rgba(255,255,255,0.06)]">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(77,163,255,0.08)] border border-[rgba(77,163,255,0.15)] text-[10px] font-bold text-[#4DA3FF] uppercase tracking-wider">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {t.result}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Write a Review Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-6"
        >
          <a
            href="/submit-review"
            className="group relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(77,163,255,0.05)] hover:shadow-[0_0_40px_rgba(77,163,255,0.2)]"
          >
            {/* Gradient background with border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(168,85,247,0.15)] to-[rgba(77,163,255,0.15)] rounded-full backdrop-blur-md border border-[rgba(255,255,255,0.1)] group-hover:border-[rgba(77,163,255,0.4)] transition-colors duration-300" />
            
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className="relative z-10 text-[14px] font-bold text-white tracking-wide">
              Submit Your Story
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
