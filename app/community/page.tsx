"use client";
import { useState } from "react";
import { FileText, Vote, CalendarDays, ExternalLink } from "lucide-react";

export default function CommunityPage() {
  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [errors, setErrors] = useState<{ name?: string; story?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; story?: string } = {};
    if (!name.trim()) newErrors.name = "Name or handle is required.";
    if (!story.trim()) newErrors.story = "Your win is required.";
    else if (story.trim().length < 20) newErrors.story = "Please share at least 20 characters.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="badge badge-purple" style={{ marginBottom: "1rem" }}>The Sandy.Lifts Community</span>
          <h1 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>
            Real people.{" "}
            <span style={{ background: "linear-gradient(135deg, #C69FF5, #C3FCFE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Real transformations.
            </span>
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

            {submitted ? (
              <div style={{ padding: "1.5rem", borderRadius: "14px", background: "rgba(34,211,165,0.08)", border: "1px solid rgba(34,211,165,0.3)", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
                <h3 style={{ color: "#F5F7FA", fontWeight: 700, marginBottom: "0.5rem", fontSize: "1rem" }}>Thanks, {name.split(" ")[0]}!</h3>
                <p style={{ color: "#AAB3C5", fontSize: "0.875rem", margin: "0 0 1rem", lineHeight: 1.6 }}>
                  We&apos;ll review your story and may feature it in the community spotlight. Keep inspiring! 💪
                </p>
                <button
                  onClick={() => { setSubmitted(false); setName(""); setStory(""); setErrors({}); }}
                  style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "transparent", border: "1px solid rgba(34,211,165,0.3)", color: "#22D3A5", fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Submit another story
                </button>
              </div>
            ) : (
              <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="story-name" style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>
                    Your Name or Handle
                  </label>
                  <input
                    id="story-name"
                    className="input-field"
                    type="text"
                    placeholder="e.g. IronMike88"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" style={{ color: "#FC8181", fontSize: "0.78rem", marginTop: "0.35rem" }}>{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="story-content" style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>
                    Your Win
                  </label>
                  <textarea
                    id="story-content"
                    className="input-field"
                    rows={4}
                    style={{ resize: "vertical" }}
                    placeholder="Tell us what you achieved and how you did it... (min. 20 characters)"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    aria-describedby={errors.story ? "story-error" : undefined}
                  />
                  {errors.story && (
                    <p id="story-error" role="alert" style={{ color: "#FC8181", fontSize: "0.78rem", marginTop: "0.35rem" }}>{errors.story}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: "linear-gradient(135deg, rgba(198,159,245,0.2), rgba(155,93,186,0.15))", borderColor: "rgba(198,159,245,0.4)", color: "#C69FF5" }}
                >
                  Submit Story
                </button>
              </form>
            )}
          </div>

          {/* Voting & Interaction */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Poll */}
            <div className="surface-card" style={{ padding: "2rem", border: "1px solid rgba(195,252,254,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <Vote size={20} color="#C3FCFE" />
                <h3 style={{ color: "#D8DBFC", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>Weekly Poll</h3>
              </div>
              <p style={{ color: "#D8DBFC", fontWeight: 600, marginBottom: "1rem" }}>What&apos;s the hardest part of meal prep?</p>
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
                <h3 style={{ color: "#D8DBFC", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>Live Q&amp;A Sessions</h3>
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
