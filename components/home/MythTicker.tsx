"use client";
import { useEffect, useState } from "react";

const MYTHS = [
  {
    myth: "Eating fat makes you fat.",
    science: "Dietary fat doesn't directly cause body fat. A calorie surplus from any macronutrient causes fat gain. Healthy fats (avocado, nuts) are essential.",
  },
  {
    myth: "You must eat 6 meals a day to keep your metabolism active.",
    science: "Total daily calories determine fat loss, not meal frequency. 3 meals and intermittent fasting produce identical results in research.",
  },
  {
    myth: "Cardio is the best way to lose fat.",
    science: "Resistance training builds muscle that burns calories 24/7. Cardio + strength training together is optimal — but strength training wins for long-term fat loss.",
  },
  {
    myth: "Protein shakes are required to build muscle.",
    science: "Whole food protein (chicken, eggs, legumes, paneer) works equally well. Supplements are convenient, not necessary.",
  },
  {
    myth: "Sweating more means burning more fat.",
    science: "Sweat is your body regulating temperature, not burning fat. Fat loss occurs through a calorie deficit, not sweat output.",
  },
  {
    myth: "Spot reduction — doing crunches burns belly fat.",
    science: "Fat loss occurs systemically. You cannot target fat from specific areas. A calorie deficit and full-body training reduces fat everywhere, including the belly.",
  },
  {
    myth: "You need supplements to lose weight.",
    science: "No supplement can replace a calorie deficit. Whole foods, adequate protein, and consistency beat any pill or powder.",
  },
  {
    myth: "Lifting weights will make women 'bulky'.",
    science: "Women have significantly less testosterone than men. Lifting makes women lean and defined, not bulky. It's one of the best tools for body recomposition.",
  },
];

export function MythTicker() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setRevealed(false);
      setTimeout(() => {
        setIdx(p => (p + 1) % MYTHS.length);
        setAnimating(false);
      }, 400);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const current = MYTHS[idx];

  return (
    <section style={{ padding: "0 1.5rem 3rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          background: "rgba(11,14,22,0.85)", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "18px", padding: "1.25rem 1.5rem", backdropFilter: "blur(16px)",
          display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap",
          boxShadow: "0 0 30px rgba(245,158,11,0.04)",
          transition: "opacity 0.4s ease",
          opacity: animating ? 0 : 1,
        }}>
          {/* Left label */}
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem" }}>⚗️</span>
            <div>
              <div style={{ fontSize: "0.62rem", color: "#F59E0B", letterSpacing: "0.1em", fontWeight: 700 }}>MYTH vs SCIENCE</div>
              <div style={{ fontSize: "0.62rem", color: "#6B6F9A" }}>#{(idx + 1).toString().padStart(2, "0")} / {MYTHS.length.toString().padStart(2, "0")}</div>
            </div>
          </div>

          <div style={{ width: "1px", alignSelf: "stretch", background: "rgba(245,158,11,0.15)", flexShrink: 0 }} />

          {/* Myth */}
          <div style={{ flex: "1 1 200px", minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", color: "#FC8181", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.2rem" }}>❌ MYTH</div>
            <div style={{ fontSize: "0.88rem", color: "#F5F7FA", fontWeight: 600, lineHeight: 1.4 }}>&ldquo;{current.myth}&rdquo;</div>
          </div>

          <div style={{ width: "1px", alignSelf: "stretch", background: "rgba(77,163,255,0.1)", flexShrink: 0 }} />

          {/* Science toggle */}
          <div style={{ flex: "1 1 200px", minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", color: "#22D3A5", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.2rem" }}>✅ SCIENCE</div>
            {revealed ? (
              <div style={{ fontSize: "0.83rem", color: "#AAB3C5", lineHeight: 1.55 }}>{current.science}</div>
            ) : (
              <button
                onClick={() => setRevealed(true)}
                style={{ padding: "0.3rem 0.875rem", borderRadius: "999px", background: "rgba(34,211,165,0.1)", border: "1px solid rgba(34,211,165,0.25)", color: "#22D3A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              >
                Reveal the Science →
              </button>
            )}
          </div>

          {/* Nav dots */}
          <div style={{ display: "flex", gap: "4px", alignSelf: "center", flexShrink: 0 }}>
            {MYTHS.map((_, i) => (
              <div
                key={i}
                onClick={() => { setIdx(i); setRevealed(false); }}
                style={{ width: i === idx ? 14 : 5, height: 5, borderRadius: "2.5px", background: i === idx ? "#F59E0B" : "rgba(245,158,11,0.2)", cursor: "pointer", transition: "all 0.3s ease" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
