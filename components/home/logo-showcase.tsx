"use client";
import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";

const HERO_SLIDES = [
  { src: "/hero-selfie.png", alt: "Sandy - current physique transformation", pos: "center 20%" },
  { src: "/hero-before.png", alt: "Sandy - fitness journey before photo", pos: "center 30%" },
];

interface LogoShowcaseProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  slideIndex: number;
}

export default function LogoShowcase({ mouseX, mouseY, slideIndex }: LogoShowcaseProps) {
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  return (
    <motion.div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "540px",
        aspectRatio: "1 / 1",
        margin: "0 auto",
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
    >
      {/* Background aura removed as per request to remove blur effect */}

      {/* Outer rotating dashed ring */}
      <div aria-hidden="true" className="sl-ring-outer" style={{
        position: "absolute", inset: "-4%", borderRadius: "50%",
        border: "1px dashed rgba(77,163,255,0.18)",
      }} />

      {/* Mid glowing ring */}
      <div aria-hidden="true" className="sl-ring-pulse" style={{
        position: "absolute", inset: "4%", borderRadius: "50%",
        border: "1.5px solid rgba(77,163,255,0.35)",
        boxShadow: "0 0 30px rgba(77,163,255,0.35), 0 0 80px rgba(77,163,255,0.12), inset 0 0 30px rgba(77,163,255,0.06)",
      }} />

      {/* Inner subtle ring */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: "12%", borderRadius: "50%",
        border: "1px solid rgba(167,139,250,0.15)",
      }} />

      {/* HUD corner marks */}
      {[
        { top: "6%", left: "6%", rot: "0deg" },
        { top: "6%", right: "6%", rot: "90deg" },
        { bottom: "6%", left: "6%", rot: "270deg" },
        { bottom: "6%", right: "6%", rot: "180deg" },
      ].map((pos, i) => (
        <svg key={i} aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none"
          style={{ position: "absolute", ...pos, transform: `rotate(${pos.rot})`, opacity: 0.5 }}>
          <path d="M0 8 L0 0 L8 0" stroke="#4DA3FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ))}

      {/* Hero Image Slider — Ken Burns Cross-Fade */}
      <div className="sl-logo-float" style={{
        position: "absolute", inset: "6%", borderRadius: "50%", overflow: "hidden",
        boxShadow: "inset 0 0 60px rgba(7,9,13,0.9), 0 0 40px rgba(77,163,255,0.2)",
      }}>
        {/* Gradient overlay */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent 50%, rgba(7,9,13,0.55) 100%)",
        }} />
        {/* Scanning light */}
        <div aria-hidden="true" className="sl-scan-light" style={{
          position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
          background: "linear-gradient(180deg, transparent 0%, rgba(77,163,255,0.06) 50%, transparent 100%)",
        }} />
        {/* Shimmer overlay */}
        <div aria-hidden="true" className="sl-shimmer-overlay" style={{
          position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
          background: "linear-gradient(135deg, transparent 40%, rgba(77,163,255,0.04) 50%, transparent 60%)",
          backgroundSize: "300% 100%",
        }} />

        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={i === slideIndex ? "sl-kb-slide sl-kb-active" : "sl-kb-slide"}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 900px) 80vw, 42vw"
              style={{ objectFit: "cover", objectPosition: slide.pos }}
            />
          </div>
        ))}
      </div>

      {/* Floating UI Cards */}

      {/* Calorie card — bottom left */}
      <div className="sl-card-float" style={{
        position: "absolute", bottom: "4%", left: "-4%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(167,139,250,0.28)",
        borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6), 0 0 20px rgba(167,139,250,0.1)",
        minWidth: "130px", zIndex: 5,
      }}>
        <div style={{ fontSize: "8px", color: "#A78BFA", letterSpacing: "0.1em", marginBottom: "4px", fontWeight: 700 }}>CALORIES GOAL</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px" }}>
          <span style={{ fontSize: "22px", fontWeight: 800, color: "#F5F7FA", lineHeight: 1 }}>2,150</span>
          <span style={{ fontSize: "9px", color: "#AAB3C5", marginBottom: "2px" }}>kcal</span>
        </div>
        <div style={{ marginTop: "6px", height: "3px", borderRadius: "2px", background: "rgba(167,139,250,0.15)" }}>
          <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg, #A78BFA, #4DA3FF)", borderRadius: "2px" }} />
        </div>
      </div>

      {/* Progress graph card — top left */}
      <div className="sl-card-float-alt" style={{
        position: "absolute", top: "8%", left: "-6%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(77,163,255,0.25)",
        borderRadius: "14px", padding: "10px 12px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6), 0 0 16px rgba(77,163,255,0.1)", zIndex: 5,
      }}>
        <div style={{ fontSize: "8px", color: "#66E6FF", letterSpacing: "0.1em", marginBottom: "6px", fontWeight: 700 }}>PROGRESS</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "30px" }}>
          {[35, 52, 45, 68, 58, 80, 72].map((h, i) => (
            <div key={i} style={{
              width: "7px", height: `${h}%`, borderRadius: "2px 2px 0 0",
              background: i === 6 ? "#4DA3FF" : `rgba(77,163,255,${0.25 + i * 0.08})`,
            }} />
          ))}
        </div>
      </div>

      {/* Macro card — bottom right */}
      <div className="sl-card-float" style={{
        position: "absolute", bottom: "6%", right: "-5%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(102,230,255,0.22)",
        borderRadius: "14px", padding: "10px 14px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6), 0 0 16px rgba(102,230,255,0.08)",
        minWidth: "115px", zIndex: 5,
      }}>
        <div style={{ fontSize: "8px", color: "#66E6FF", letterSpacing: "0.1em", marginBottom: "5px", fontWeight: 700 }}>MACROS</div>
        {[
          { label: "Protein", color: "#4DA3FF", pct: "40%" },
          { label: "Carbs", color: "#A78BFA", pct: "40%" },
          { label: "Fat", color: "#66E6FF", pct: "20%" },
        ].map((m) => (
          <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: m.color, flexShrink: 0, boxShadow: `0 0 6px ${m.color}80` }} />
            <div style={{ fontSize: "9px", color: "#AAB3C5", flex: 1 }}>{m.label}</div>
            <div style={{ fontSize: "9px", color: "#F5F7FA", fontWeight: 600 }}>{m.pct}</div>
          </div>
        ))}
      </div>

      {/* Heartbeat card — top right */}
      <div className="sl-card-float-alt" style={{
        position: "absolute", top: "10%", right: "-4%",
        background: "rgba(11,14,22,0.88)", border: "1px solid rgba(77,163,255,0.2)",
        borderRadius: "14px", padding: "9px 12px", backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(7,9,13,0.6)", zIndex: 5,
      }}>
        <div style={{ fontSize: "8px", color: "#4DA3FF", letterSpacing: "0.1em", marginBottom: "5px", fontWeight: 700 }}>ACTIVITY</div>
        <svg width="80" height="26" viewBox="0 0 80 26" fill="none" aria-label="Activity heartbeat graph">
          <path d="M0 13 L12 13 L16 4 L22 22 L28 10 L34 13 L80 13" stroke="#4DA3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 13 L12 13 L16 4 L22 22 L28 10 L34 13 L80 13" stroke="rgba(77,163,255,0.2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
}
