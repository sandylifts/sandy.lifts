"use client";
import { useEffect, useRef, useState } from "react";

/* ─── Data ──────────────────────────────────────────────── */
const REVIEWS = [
  { name: "Rahul M.", text: "Lost 8kg in 10 weeks. No crash diets — just real food and consistency. Sandy's approach actually works.", rating: 5, tag: "Fat Loss" },
  { name: "Priya S.", text: "The AI diet plan is insane. Got a fully personalised vegetarian meal plan in 30 seconds. Game changer!", rating: 5, tag: "Vegetarian" },
  { name: "Arjun K.", text: "Finally a fitness platform that calls out bro-science. Calorie deficit without starving — this is the way.", rating: 5, tag: "Science-Based" },
  { name: "Meera D.", text: "70-day challenge changed my life. Community support + AI tools = unstoppable combo.", rating: 5, tag: "70-Day Challenge" },
  { name: "Vikram T.", text: "The workout plan generator is so smart. Adapted for my bad knees and still got me stronger.", rating: 5, tag: "Workout Plan" },
  { name: "Sneha R.", text: "Down 5kgs and actually eating MORE food. Sandy's macro approach is completely different and it WORKS.", rating: 5, tag: "Macro Tracking" },
  { name: "Dev P.", text: "Best fitness investment I've made. The AI coach feels like having a personal nutritionist 24/7.", rating: 5, tag: "AI Coach" },
  { name: "Ananya B.", text: "Transformation in 8 weeks. No supplements, no gym membership needed. Just the plan + discipline.", rating: 5, tag: "Home Workout" },
];

const ACHIEVEMENTS = [
  { icon: "🏆", label: "70-Day Challenge", sub: "Leaderboard Active", color: "#F59E0B" },
  { icon: "🔥", label: "428 kg Lost", sub: "Community Total", color: "#EF4444" },
  { icon: "⚡", label: "2,100+ Plans", sub: "AI Plans Generated", color: "#4DA3FF" },
  { icon: "🎯", label: "94% Success Rate", sub: "Challenge Completions", color: "#22D3A5" },
];

const TRANSFORMATIONS = [
  { name: "Rahul M.", weeks: 10, lost: "8 kg", note: "Fat Loss — Vegetarian Plan", emoji: "🔥" },
  { name: "Priya S.", weeks: 8,  lost: "6 kg", note: "Calorie Deficit — Non-Veg", emoji: "⚡" },
  { name: "Arjun K.", weeks: 12, lost: "10 kg", note: "70-Day Challenge Winner",  emoji: "🏆" },
  { name: "Meera D.", weeks: 6,  lost: "4 kg",  note: "Home Workout + Diet Plan",  emoji: "🌟" },
];

/* ─── Counting animation hook ────────────────────────────── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Active Transformers Counter ────────────────────────── */
function ActiveCounter() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(47, 2200, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: "rgba(11,14,22,0.85)", border: "1px solid rgba(77,163,255,0.2)",
      borderRadius: "20px", padding: "1.75rem", textAlign: "center",
      backdropFilter: "blur(16px)",
      boxShadow: "0 0 40px rgba(77,163,255,0.08), inset 0 0 20px rgba(77,163,255,0.02)",
    }}>
      <div style={{ fontSize: "0.68rem", color: "#66E6FF", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.5rem" }}>🔴 LIVE</div>
      <div style={{
        fontSize: "3.5rem", fontWeight: 900, lineHeight: 1,
        background: "linear-gradient(135deg,#4DA3FF,#66E6FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        fontVariantNumeric: "tabular-nums",
      }}>
        {count}+
      </div>
      <div style={{ color: "#F5F7FA", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.4rem" }}>Active Transformers</div>
      <div style={{ color: "#6B6F9A", fontSize: "0.75rem", marginTop: "0.2rem" }}>Real people. Real results.</div>
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "4px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i < 6 ? "#4DA3FF" : "rgba(77,163,255,0.2)",
            boxShadow: i < 6 ? "0 0 6px #4DA3FF" : "none",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Achievement Badges ─────────────────────────────────── */
function AchievementBadges() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      <div style={{ fontSize: "0.68rem", color: "#A78BFA", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.25rem" }}>🎖️ ACHIEVEMENTS</div>
      {ACHIEVEMENTS.map((a, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          background: "rgba(11,14,22,0.75)", border: `1px solid ${a.color}22`,
          borderRadius: "14px", padding: "0.75rem 1rem",
          backdropFilter: "blur(12px)", transition: "all 0.25s ease",
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = `${a.color}55`)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = `${a.color}22`)}
        >
          <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{a.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F5F7FA", lineHeight: 1.2 }}>{a.label}</div>
            <div style={{ fontSize: "0.72rem", color: "#6B6F9A" }}>{a.sub}</div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, boxShadow: `0 0 8px ${a.color}`, flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Journey Transformation Cards ──────────────────────── */
function JourneyCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(p => (p + 1) % TRANSFORMATIONS.length), 3500);
    return () => clearInterval(id);
  }, []);

  const t = TRANSFORMATIONS[idx];
  return (
    <div style={{
      background: "rgba(11,14,22,0.85)", border: "1px solid rgba(167,139,250,0.18)",
      borderRadius: "20px", padding: "1.5rem", backdropFilter: "blur(16px)",
      overflow: "hidden", position: "relative",
    }}>
      <div style={{ fontSize: "0.68rem", color: "#A78BFA", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.875rem" }}>🌟 TRANSFORMATION SPOTLIGHT</div>

      <div style={{ minHeight: 100, transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,rgba(77,163,255,0.3),rgba(167,139,250,0.3))",
            border: "1.5px solid rgba(167,139,250,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
          }}>
            {t.emoji}
          </div>
          <div>
            <div style={{ color: "#F5F7FA", fontWeight: 700, fontSize: "0.9rem" }}>{t.name}</div>
            <div style={{ color: "#6B6F9A", fontSize: "0.72rem" }}>{t.note}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div style={{ flex: 1, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "0.625rem 0.875rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", color: "#FC8181", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>LOST</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FCA5A5" }}>{t.lost}</div>
          </div>
          <div style={{ flex: 1, background: "rgba(34,211,165,0.08)", border: "1px solid rgba(34,211,165,0.2)", borderRadius: "10px", padding: "0.625rem 0.875rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", color: "#34D399", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>WEEKS</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#6EE7B7" }}>{t.weeks}</div>
          </div>
        </div>
      </div>

      {/* Dot pagination */}
      <div style={{ display: "flex", gap: "5px", marginTop: "1rem", justifyContent: "center" }}>
        {TRANSFORMATIONS.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: "3px", background: i === idx ? "#A78BFA" : "rgba(167,139,250,0.2)", transition: "all 0.3s ease", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Live Reviews Marquee ───────────────────────────────── */
function LiveReviews() {
  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ fontSize: "0.68rem", color: "#22D3A5", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.875rem" }}>
        💬 VERIFIED CLIENT REVIEWS
      </div>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .te-marquee { animation: marqueeScroll 35s linear infinite; }
        .te-marquee:hover { animation-play-state: paused; }
      `}</style>
      <div style={{ display: "flex", overflow: "hidden", maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
        <div className="te-marquee" style={{ display: "flex", gap: "0.875rem", width: "max-content" }}>
          {doubled.map((r, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 240,
              background: "rgba(11,14,22,0.85)", border: "1px solid rgba(34,211,165,0.15)",
              borderRadius: "14px", padding: "0.875rem",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#F5F7FA" }}>{r.name}</span>
                <span style={{ fontSize: "0.65rem", background: "rgba(34,211,165,0.12)", color: "#22D3A5", padding: "0.15rem 0.5rem", borderRadius: "999px", border: "1px solid rgba(34,211,165,0.2)" }}>{r.tag}</span>
              </div>
              <div style={{ display: "flex", gap: "2px", marginBottom: "0.4rem" }}>
                {Array.from({ length: r.rating }).map((_, s) => <span key={s} style={{ color: "#F59E0B", fontSize: "0.7rem" }}>★</span>)}
              </div>
              <p style={{ color: "#AAB3C5", fontSize: "0.78rem", lineHeight: 1.55, margin: 0 }}>&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────── */
export function TrustEcosystem() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "linear-gradient(180deg, #07090D 0%, #05050B 50%, #07090D 100%)", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(77,163,255,0.03) 0%, transparent 70%)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 1rem", borderRadius: "999px", background: "rgba(34,211,165,0.08)", border: "1px solid rgba(34,211,165,0.25)", marginBottom: "1rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22D3A5", boxShadow: "0 0 8px #22D3A5", display: "inline-block" }} />
            <span style={{ color: "#22D3A5", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>SOCIAL PROOF & COMMUNITY</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "#F5F7FA", marginBottom: "0.75rem" }}>
            Real People.{" "}
            <span style={{ background: "linear-gradient(135deg,#22D3A5,#4DA3FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Real Transformations.</span>
          </h2>
          <p style={{ color: "#AAB3C5", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Join an active community of people who ditched bro-science and chose results.
          </p>
        </div>

        {/* Top grid: Counter + Achievements + Carousel */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <ActiveCounter />
          <AchievementBadges />
          <JourneyCarousel />
        </div>

        {/* Reviews marquee */}
        <div style={{ background: "rgba(11,14,22,0.6)", border: "1px solid rgba(34,211,165,0.1)", borderRadius: "20px", padding: "1.5rem 1.25rem", backdropFilter: "blur(12px)" }}>
          <LiveReviews />
        </div>
      </div>
    </section>
  );
}
