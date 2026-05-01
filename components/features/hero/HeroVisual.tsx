"use client";

import Image from "next/image";

// IMPORTANT: For the exact "Breakout" effect shown in your reference, 
// this photo MUST have a transparent background (.png).
const PHOTO_SRC = "/hero-selfie.png"; 

export default function HeroVisual() {
  return (
    <div 
      className="relative hidden lg:flex items-center justify-end w-full max-w-[650px] h-[650px] select-none -translate-y-4"
      aria-hidden="true"
    >
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>

      {/* THE BACKGROUND CIRCLES (Portal) */}
      <div 
        className="absolute left-[5%] top-[50%] -translate-y-1/2 w-[420px] h-[420px] rounded-full z-0"
        style={{
          border: "1px solid rgba(168,85,247,0.3)",
          background: "radial-gradient(circle at center, rgba(168,85,247,0.12) 0%, transparent 65%)",
          boxShadow: "0 0 60px rgba(168,85,247,0.15), inset 0 0 60px rgba(168,85,247,0.05)"
        }}
      />
      <div 
        className="absolute left-[12%] top-[50%] -translate-y-1/2 w-[340px] h-[340px] rounded-full z-0 pointer-events-none"
        style={{
          border: "1px dashed rgba(34,211,238,0.2)",
          transform: "rotate(15deg)"
        }}
      />

      {/* THE PERSON (Perfectly cropped out of the circle) */}
      <div className="absolute left-[-15%] bottom-[5%] w-[520px] h-[105%] z-20 pointer-events-none drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <Image
          src={PHOTO_SRC}
          alt="Sandy"
          fill
          priority
          sizes="(max-width: 1024px) 0px, 550px"
          style={{
            objectFit: "contain",
            objectPosition: "bottom center",
            filter: "saturate(1.1) contrast(1.05)"
          }}
        />
      </div>

      {/* THE CARDS (Right Side Stack) */}
      <div className="absolute right-[0%] top-[10%] flex flex-col gap-6 z-30 w-[240px]">
        
        {/* CARD 1 — CALORIES GOAL */}
        <div 
          className="flex flex-col p-4 w-full animate-[floatSlow_5s_ease-in-out_infinite]"
          style={{
            background: "rgba(8,10,20,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(34,211,238,0.25)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(34,211,238,0.05)",
            borderRadius: "16px"
          }}
        >
          <span className="text-[10px] font-bold tracking-wider text-[#22D3EE] mb-2">CALORIES GOAL</span>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-[28px] font-bold text-[#22D3EE] leading-none" style={{ fontFamily: "Syne, sans-serif" }}>2,150</span>
            <span className="text-[11px] text-gray-500 font-medium">kcal</span>
          </div>
          <div className="w-full h-[3px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mb-2">
            <div className="h-full w-[75%] bg-[#22D3EE] rounded-full shadow-[0_0_8px_#22D3EE]" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
            <span className="text-[9px] text-gray-400">75% of daily goal</span>
          </div>
        </div>

        {/* CARD 2 — AI COACH */}
        <div 
          className="flex flex-col p-4 w-full animate-[floatSlow_6s_ease-in-out_infinite_0.5s]"
          style={{
            background: "rgba(8,10,20,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(168,85,247,0.35)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(168,85,247,0.05)",
            borderRadius: "16px"
          }}
        >
          <span className="text-[10px] font-bold tracking-wider text-[#C084FC] mb-3">AI COACH</span>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#A855F7] to-[#7C3AED] shadow-[0_0_12px_rgba(168,85,247,0.5)]">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-semibold">Sandy</span>
              <span className="text-[#C084FC] text-[10px]">Adaptive Engine</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
            Deload week ready.<br/>Recovery at 62% ↑
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
            <span className="text-[10px] text-[#C084FC] font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Active now</span>
          </div>
        </div>

        {/* CARD 3 — MACROS */}
        <div 
          className="flex flex-col p-4 w-full animate-[floatSlow_5.5s_ease-in-out_infinite_1s]"
          style={{
            background: "rgba(8,10,20,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(34,211,238,0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            borderRadius: "16px"
          }}
        >
          <span className="text-[10px] font-bold tracking-wider text-[#C084FC] mb-3">MACROS</span>
          
          <div className="flex items-center justify-between gap-4">
            
            {/* Donut Chart */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(#A855F7 0% 40%, #7C3AED 40% 60%, #22D3EE 60% 100%)",
                  maskImage: "radial-gradient(circle, transparent 55%, black 56%)",
                  WebkitMaskImage: "radial-gradient(circle, transparent 55%, black 56%)"
                }}
              />
              {/* Inner glowing core */}
              <div className="w-10 h-10 rounded-full shadow-[inset_0_0_10px_rgba(34,211,238,0.2)] flex items-center justify-center">
                <span className="text-white font-bold text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>40%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                  <span className="text-[10px] text-gray-400">Protein</span>
                </div>
                <span className="text-[10px] text-white font-semibold">40%</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                  <span className="text-[10px] text-gray-400">Carbs</span>
                </div>
                <span className="text-[10px] text-white font-semibold">40%</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                  <span className="text-[10px] text-gray-400">Fat</span>
                </div>
                <span className="text-[10px] text-white font-semibold">20%</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
