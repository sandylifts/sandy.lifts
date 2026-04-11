"use client";
import { useState } from "react";
import Link from "next/link";

const ENERGY_LEVELS = [
  { range: [1, 2], emoji: "😴", label: "Exhausted", suggestion: "Rest Day", desc: "Light mobility or rest. Your body is asking for recovery.", color: "#6B6F9A", mode: "diet", chipHint: "High Hydration" },
  { range: [3, 4], emoji: "😑", label: "Low Energy", suggestion: "Active Recovery", desc: "Gentle yoga, walking, or stretching. Keep moving without taxing your system.", color: "#A78BFA", mode: "workout", chipHint: "Morning Routine" },
  { range: [5, 6], emoji: "😐", label: "Moderate", suggestion: "Moderate Training", desc: "Upper/lower split or a technique-focused session. Great day to focus on form.", color: "#4DA3FF", mode: "workout", chipHint: "Full Body" },
  { range: [7, 8], emoji: "😊", label: "Good Energy", suggestion: "Full Training", desc: "Hit your planned session with focus. Today is a great lifting day.", color: "#22D3A5", mode: "workout", chipHint: "Hypertrophy" },
  { range: [9, 10], emoji: "🔥", label: "Unstoppable", suggestion: "Push Hard Day", desc: "Max effort session — PRs possible. Prioritise compound lifts and intensity.", color: "#F59E0B", mode: "workout", chipHint: "Fat Burn HIIT" },
];

function getLevel(val: number) {
  return ENERGY_LEVELS.find(l => val >= l.range[0] && val <= l.range[1]) || ENERGY_LEVELS[2];
}

export function EnergyCheckIn() {
  const [energy, setEnergy] = useState(7);
  const level = getLevel(energy);

  return (
    <section style={{ padding: "0 1.5rem 4rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(11,14,22,0.9), rgba(11,14,22,0.95))`,
          border: `1px solid ${level.color}22`,
          borderRadius: "24px", padding: "2rem",
          backdropFilter: "blur(20px)",
          boxShadow: `0 0 40px ${level.color}08`,
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.4rem", color: level.color }}>⚡ DAILY ENERGY CHECK-IN</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F5F7FA", margin: 0 }}>How&apos;s your energy today?</h3>
              <p style={{ fontSize: "0.8rem", color: "#6B6F9A", margin: "0.2rem 0 0" }}>Instantly get an AI suggestion calibrated to your current state.</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{level.emoji}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: level.color, marginTop: "0.2rem" }}>{energy}/10</div>
            </div>
          </div>

          {/* Slider */}
          <div style={{ marginBottom: "1.25rem" }}>
            <style>{`
              .ec-slider { -webkit-appearance: none; width: 100%; height: 5px; border-radius: 3px; outline: none; transition: background 0.3s ease; }
              .ec-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; transition: box-shadow 0.2s; }
            `}</style>
            <input
              type="range" min={1} max={10} value={energy}
              onChange={e => setEnergy(Number(e.target.value))}
              className="ec-slider"
              style={{
                background: `linear-gradient(to right, ${level.color} ${(energy - 1) / 9 * 100}%, rgba(77,163,255,0.15) ${(energy - 1) / 9 * 100}%)`,
              } as React.CSSProperties}
            />
            <style>{`.ec-slider::-webkit-slider-thumb { background: ${level.color}; box-shadow: 0 0 12px ${level.color}80; }`}</style>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
              <span style={{ fontSize: "0.68rem", color: "#6B6F9A" }}>😴 Exhausted</span>
              <span style={{ fontSize: "0.68rem", color: "#6B6F9A" }}>🔥 Unstoppable</span>
            </div>
          </div>

          {/* Result card */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.875rem",
            background: `${level.color}0D`, border: `1px solid ${level.color}2A`,
            borderRadius: "14px", padding: "1rem 1.25rem",
            transition: "all 0.4s ease",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: level.color, marginBottom: "0.25rem" }}>
                {level.emoji} {level.label.toUpperCase()} — AI RECOMMENDS: {level.suggestion.toUpperCase()}
              </div>
              <p style={{ fontSize: "0.85rem", color: "#AAB3C5", margin: 0, lineHeight: 1.55 }}>{level.desc}</p>
            </div>
            <Link
              href={`/ai-coach`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.6rem 1.1rem", borderRadius: "12px",
                background: `${level.color}1A`, border: `1px solid ${level.color}40`,
                color: level.color, fontWeight: 700, fontSize: "0.8rem",
                textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              Get AI Plan →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
