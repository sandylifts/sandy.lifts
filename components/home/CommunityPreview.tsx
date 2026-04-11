import Link from "next/link";
import { Users, Trophy, Video, ChevronRight, Clock } from "lucide-react";

export function CommunityPreview() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "#0A0A14" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-purple" style={{ marginBottom: "1rem" }}>Community</span>
          <h2 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>
            Real people. Real results.
          </h2>
          <p style={{ color: "#9A9EC4", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Share your story, vote on what matters, and join live Q&A sessions with the Sandy.Lifts community.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {/* Success Stories */}
          <div className="surface-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Trophy size={24} color="#C3FCFE" />
              <h3 style={{ color: "#D8DBFC", fontWeight: 700, margin: 0 }}>Success Stories</h3>
            </div>
            <p style={{ color: "#9A9EC4", fontSize: "0.875rem", lineHeight: 1.7 }}>
              Real transformations from our community. Submit yours for a chance to be featured and inspire others.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["Lost 15kg in 12 weeks 💪", "Gained muscle without a gym 🏠", "Finally consistent at 50+ 🌟"].map((story, i) => (
                <div key={i} style={{ padding: "0.625rem 0.875rem", background: "rgba(34,34,53,0.6)", borderRadius: "8px", color: "#9A9EC4", fontSize: "0.82rem" }}>
                  {story}
                </div>
              ))}
            </div>
            <Link href="/community" className="btn-secondary" style={{ justifyContent: "center" }}>
              Share Your Story <ChevronRight size={14} />
            </Link>
          </div>

          {/* Weekly Poll */}
          <div className="surface-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Users size={24} color="#C69FF5" />
              <h3 style={{ color: "#D8DBFC", fontWeight: 700, margin: 0 }}>Weekly Poll</h3>
            </div>
            <p style={{ color: "#C3FCFE", fontWeight: 600, marginBottom: "0.5rem" }}>
              What's your biggest fitness challenge right now?
            </p>
            {[
              { label: "Staying consistent", pct: 42 },
              { label: "Eating right", pct: 33 },
              { label: "Finding the time", pct: 25 },
            ].map((opt, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#D8DBFC" }}>{opt.label}</span>
                  <span style={{ color: "#6B6F9A" }}>{opt.pct}%</span>
                </div>
                <div style={{ height: "6px", background: "rgba(195,252,254,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${opt.pct}%`, background: i === 0 ? "linear-gradient(90deg, #60ADC7, #C3FCFE)" : i === 1 ? "linear-gradient(90deg, #9B5DBA, #C69FF5)" : "linear-gradient(90deg, #343553, #4A4A75)", borderRadius: "3px", transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
            <Link href="/community" className="btn-secondary" style={{ justifyContent: "center" }}>
              Vote This Week <ChevronRight size={14} />
            </Link>
          </div>

          {/* Q&A Schedule */}
          <div className="surface-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Video size={24} color="#60ADC7" />
              <h3 style={{ color: "#D8DBFC", fontWeight: 700, margin: 0 }}>Live Q&A</h3>
            </div>
            <div style={{ background: "rgba(195,252,254,0.05)", borderRadius: "12px", padding: "1.25rem", border: "1px solid rgba(195,252,254,0.1)", textAlign: "center" }}>
              <div style={{ color: "#6B6F9A", fontSize: "0.8rem", marginBottom: "0.5rem" }}>NEXT SESSION</div>
              <div style={{ color: "#C3FCFE", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>Sunday, 7PM GMT</div>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                {["03d", "14h", "22m"].map((unit, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ background: "#343553", borderRadius: "8px", padding: "0.375rem 0.625rem", color: "#D8DBFC", fontWeight: 700, fontSize: "1.1rem", fontFamily: "monospace" }}>{unit.slice(0, -1)}</div>
                    <div style={{ color: "#6B6F9A", fontSize: "0.65rem", marginTop: "0.25rem" }}>{i === 0 ? "DAYS" : i === 1 ? "HRS" : "MIN"}</div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ color: "#9A9EC4", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Topic: Fat Loss Myths vs Reality — submit your Q in advance!
            </p>
            <Link href="/community" className="btn-secondary" style={{ justifyContent: "center" }}>
              Join the Session <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
