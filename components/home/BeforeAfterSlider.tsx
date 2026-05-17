"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeWeight?: string;
  afterWeight?: string;
}

export function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeWeight,
  afterWeight,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    } else {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, onPointerMove, onPointerUp]);

  return (
    <div 
      className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden group select-none touch-none"
      ref={containerRef}
      onPointerDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={afterImg}
          alt={afterLabel}
          fill
          sizes="(max-width: 768px) 100vw, 860px"
          style={{ objectFit: "cover", objectPosition: "top center", filter: "saturate(1.1) brightness(1.05) contrast(1.02)" }}
          draggable={false}
        />
        {/* After Label */}
        <div className="absolute top-3 right-3 bg-[rgba(0,0,0,0.7)] backdrop-blur-md border border-[rgba(77,163,255,0.3)] rounded-full px-3 py-1 z-20 transition-opacity duration-300 pointer-events-none" style={{ opacity: sliderPosition < 80 ? 1 : 0 }}>
          <span className="text-[10px] font-bold tracking-widest text-[#4DA3FF] uppercase">{afterLabel}</span>
        </div>
        {/* After Weight Badge */}
        {afterWeight && (
          <div className="absolute bottom-3 right-3 bg-[rgba(0,0,0,0.8)] backdrop-blur-md border border-[rgba(77,163,255,0.2)] rounded-xl px-3 py-1.5 z-10 pointer-events-none">
            <span className="text-[13px] font-bold text-white">{afterWeight}</span>
          </div>
        )}
        {/* Sandy.Lifts Watermark */}
        <div className="absolute bottom-12 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-md pointer-events-none"
          style={{ background: "rgba(7,9,13,0.55)", backdropFilter: "blur(8px)" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          <span style={{
            fontSize: "9px", fontWeight: 800, letterSpacing: "0.08em",
            background: "linear-gradient(90deg, #4DA3FF, #66E6FF)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            SANDY.LIFTS
          </span>
        </div>
      </div>

      {/* Before Image (Foreground, clipped) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image
          src={beforeImg}
          alt={beforeLabel}
          fill
          sizes="(max-width: 768px) 100vw, 860px"
          style={{ objectFit: "cover", objectPosition: "top center", filter: "saturate(0.7) brightness(0.85)" }}
          draggable={false}
        />
        {/* Before Label */}
        <div className="absolute top-3 left-3 bg-[rgba(0,0,0,0.7)] backdrop-blur-md border border-[rgba(255,80,80,0.3)] rounded-full px-3 py-1 z-20 transition-opacity duration-300 pointer-events-none" style={{ opacity: sliderPosition > 20 ? 1 : 0 }}>
          <span className="text-[10px] font-bold tracking-widest text-[#FF6B6B] uppercase">{beforeLabel}</span>
        </div>
        {/* Before Weight Badge */}
        {beforeWeight && (
          <div className="absolute bottom-3 left-3 bg-[rgba(0,0,0,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1.5 z-10 pointer-events-none">
            <span className="text-[13px] font-bold text-white">{beforeWeight}</span>
          </div>
        )}
        {/* Dark overlay at clip edge for depth */}
        <div 
          className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#000000] to-transparent pointer-events-none opacity-50"
          style={{ left: `calc(${sliderPosition}% - 16px)` }}
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] cursor-ew-resize z-30"
        style={{ 
          left: `${sliderPosition}%`, 
          transform: 'translateX(-50%)',
          background: "linear-gradient(180deg, transparent 5%, #4DA3FF 30%, #A78BFA 70%, transparent 95%)", 
          boxShadow: "0 0 20px rgba(77,163,255,0.6)" 
        }}
      >
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(77,163,255,0.5)] shadow-[0_0_20px_rgba(77,163,255,0.4)] transition-transform duration-200"
          style={{ 
            background: "rgba(7,9,13,0.9)", 
            backdropFilter: "blur(12px)",
            transform: isDragging ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 21 12 15 6" />
            <polyline points="9 18 3 12 9 6" />
          </svg>
        </div>
      </div>

      {/* Face blur overlay with premium instructional badge */}
      <div 
        className="absolute top-0 left-0 right-0 z-40 pointer-events-none flex items-center justify-center" 
        style={{ height: "20%", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", background: "rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.4)] shadow-[0_0_20px_rgba(77,163,255,0.15)] animate-pulse backdrop-blur-md">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
            <path d="M15 18l6-6-6-6" />
            <path d="M9 18l-6-6 6-6" />
          </svg>
          <span className="text-[9px] font-black tracking-[0.25em] text-[#E2E8F0] uppercase mt-[1px]">
            Swipe to Compare
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
            <path d="M9 18l6-6-6-6" />
            <path d="M15 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
