import Link from "next/link";
import { Bot, Dumbbell, ArrowRight, Shield, Zap } from "lucide-react";

export function AIPreview() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "#05050B" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-cyan" style={{ marginBottom: "1rem" }}>Dual-Core AI Coach</span>
          <h2 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>
            One coach. Two superpowers.
          </h2>
          <p style={{ color: "#9A9EC4", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            Science-backed diet plans <em>and</em> periodised workout programs — generated in seconds by your AI command center.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
          {/* Diet Coach */}
          <div style={{ background: "#343553", borderRadius: "24px", border: "1px solid rgba(195,252,254,0.12)", overflow: "hidden", padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(195,252,254,0.1)", border: "1px solid rgba(195,252,254,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={24} color="#C3FCFE" />
              </div>
              <div>
                <h3 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>AI Diet Coach</h3>
                <p style={{ color: "#6B6F9A", fontSize: "0.8rem", margin: 0 }}>Real-food meal planning · Macro ring chart</p>
              </div>
            </div>

            {/* Chip preview */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
              {["🔥 Fat Loss", "🥗 No Bro-Science", "🌿 High Protein Veg", "⏰ IF"].map(c => (
                <span key={c} style={{ padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 600, background: "rgba(195,252,254,0.08)", border: "1px solid rgba(195,252,254,0.18)", color: "#AAB3C5" }}>{c}</span>
              ))}
            </div>

            {/* Fake chat preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div className="chat-bubble-user" style={{ fontSize: "0.85rem" }}>
                Fat Loss · Vegetarian · Moderately active
              </div>
              <div className="chat-bubble-ai" style={{ fontSize: "0.85rem" }}>
                ✨ Here&apos;s your 1,850 kcal plan: Protein 40% · Carbs 30% · Fat 30%. Includes macro ring chart and grocery list...
              </div>
            </div>

            <div style={{ background: "rgba(195,252,254,0.05)", borderRadius: "10px", padding: "0.875rem", marginBottom: "1.5rem", border: "1px solid rgba(195,252,254,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#C3FCFE", fontSize: "0.8rem", fontWeight: 600 }}>
                <Shield size={14} /> Educational purposes only · Not medical advice
              </div>
            </div>

            <Link href="/ai-coach" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Start Diet Coaching <ArrowRight size={15} />
            </Link>
          </div>

          {/* Workout Coach */}
          <div style={{ background: "#343553", borderRadius: "24px", border: "1px solid rgba(198,159,245,0.12)", overflow: "hidden", padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(198,159,245,0.1)", border: "1px solid rgba(198,159,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Dumbbell size={24} color="#C69FF5" />
              </div>
              <div>
                <h3 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>AI Workout Coach</h3>
                <p style={{ color: "#6B6F9A", fontSize: "0.8rem", margin: 0 }}>Periodised weekly programs · Downloadable</p>
              </div>
            </div>

            {/* Chip preview */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
              {["🏋️ Hypertrophy", "🏠 Home Workout", "⚡ Fat Burn HIIT", "♾️ Full Body"].map(c => (
                <span key={c} style={{ padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 600, background: "rgba(198,159,245,0.08)", border: "1px solid rgba(198,159,245,0.18)", color: "#AAB3C5" }}>{c}</span>
              ))}
            </div>

            {/* Mini plan preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {["Mon: Push — Chest / Shoulders / Triceps", "Tue: Pull — Back / Biceps", "Wed: REST / Active Recovery", "Thu: Legs — Squat Focus", "Fri: Full Body Strength + HIIT"].map((day, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.875rem", background: "rgba(34,34,53,0.6)", borderRadius: "8px", border: "1px solid rgba(198,159,245,0.1)" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C69FF5", flexShrink: 0 }} />
                  <span style={{ color: "#9A9EC4", fontSize: "0.83rem" }}>{day}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(198,159,245,0.05)", borderRadius: "10px", padding: "0.875rem", marginBottom: "1.5rem", border: "1px solid rgba(198,159,245,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#C69FF5", fontSize: "0.8rem", fontWeight: 600 }}>
                <Zap size={14} /> Progressive overload tips included · Export as .txt
              </div>
            </div>

            <Link href="/ai-coach" className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, rgba(198,159,245,0.15), rgba(155,93,186,0.15))", borderColor: "rgba(198,159,245,0.4)", color: "#C69FF5" }}>
              Get My Workout Plan <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
