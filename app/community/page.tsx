"use client";
import Link from "next/link";
import { Users, FileText, Vote, CalendarDays, ExternalLink, MessageCircle } from "lucide-react";

export default function CommunityPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="badge badge-purple" style={{ marginBottom: "1rem" }}>The Sandy.Lifts Community</span>
          <h1 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>
            Real people. <span style={{ background: "linear-gradient(135deg, #C69FF5, #C3FCFE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Real transformations.</span>
          </h1>
          <p style={{ color: "#9A9EC4", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            A space to share wins, solve challenges, and keep each other accountable. No toxic fitness culture, just support.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
          
          {/* Success Stories Submission */}
          <div className="surface-card" style={{ padding: "2.5rem", border: "1px solid rgba(198,159,245,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(198,159,245,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={24} color="#C69FF5" />
              </div>
              <h2 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.25rem", margin: 0 }}>Share Your Story</h2>
            </div>
            <p style={{ color: "#9A9EC4", marginBottom: "2rem", lineHeight: 1.6 }}>
              Whether you lost 10kg, finally did a pushup, or just stayed consistent for a month — we want to hear it.
            </p>
            <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={e => e.preventDefault()}>
              <div>
                <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Your Name or Handle</label>
                <input className="input-field" type="text" placeholder="e.g. IronMike88" />
              </div>
              <div>
                <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Your Win</label>
                <textarea className="input-field" rows={4} style={{ resize: "vertical" }} placeholder="Tell us what you achieved and how you did it..."></textarea>
              </div>
              <button className="btn-primary" style={{ background: "linear-gradient(135deg, rgba(198,159,245,0.2), rgba(155,93,186,0.15))", borderColor: "rgba(198,159,245,0.4)", color: "#C69FF5" }}>
                Submit Story
              </button>
            </form>
          </div>

          {/* Voting & Interaction */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Poll */}
            <div className="surface-card" style={{ padding: "2rem", border: "1px solid rgba(195,252,254,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <Vote size={20} color="#C3FCFE" />
                <h3 style={{ color: "#D8DBFC", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>Weekly Poll</h3>
              </div>
              <p style={{ color: "#D8DBFC", fontWeight: 600, marginBottom: "1rem" }}>What's the hardest part of meal prep?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Finding the time", "Cooking large batches", "Eating the same thing everyday", "Calculating macros"].map((opt) => (
                  <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem", background: "rgba(34,34,53,0.6)", borderRadius: "10px", cursor: "pointer", border: "1px solid rgba(195,252,254,0.1)" }}>
                    <input type="radio" name="poll" style={{ accentColor: "#C3FCFE" }} />
                    <span style={{ color: "#9A9EC4", fontSize: "0.9rem" }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q&A */}
            <div className="surface-card" style={{ padding: "2rem", border: "1px solid rgba(96,173,199,0.15)" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <CalendarDays size={20} color="#60ADC7" />
                <h3 style={{ color: "#D8DBFC", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>Live Q&A Sessions</h3>
              </div>
              <div style={{ background: "rgba(5,5,11,0.5)", padding: "1.5rem", borderRadius: "14px", border: "1px solid rgba(96,173,199,0.1)", marginBottom: "1rem" }}>
                <p style={{ color: "#60ADC7", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.25rem" }}>NEXT UP: SUNDAY 19:00 GMT</p>
                <h4 style={{ color: "#D8DBFC", fontSize: "1.05rem", margin: "0 0 0.5rem 0" }}>Fat Loss Plateaus: How to break them</h4>
                <p style={{ color: "#6B6F9A", fontSize: "0.85rem", margin: 0 }}>Join Sandy live to discuss strategies when the scale stops moving.</p>
              </div>
              <a href="#" className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                Add to Calendar <ExternalLink size={14} />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
