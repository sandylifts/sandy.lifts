"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

const questions = [
  {
    q: "What is your natural body frame?",
    opts: [
      { label: "Narrow shoulders, slim wrists", score: { ecto: 2, meso: 0, endo: 0 } },
      { label: "Medium frame, balanced", score: { ecto: 0, meso: 2, endo: 0 } },
      { label: "Broad shoulders, thick wrists", score: { ecto: 0, meso: 1, endo: 1 } },
    ],
  },
  {
    q: "How does your body respond to eating more?",
    opts: [
      { label: "Rarely gain weight", score: { ecto: 2, meso: 0, endo: 0 } },
      { label: "Gain muscle and some fat", score: { ecto: 0, meso: 2, endo: 0 } },
      { label: "Gain mostly fat easily", score: { ecto: 0, meso: 0, endo: 2 } },
    ],
  },
  {
    q: "How easy is it for you to build muscle?",
    opts: [
      { label: "Very hard — I stay lean but small", score: { ecto: 2, meso: 0, endo: 0 } },
      { label: "Relatively easy", score: { ecto: 0, meso: 2, endo: 0 } },
      { label: "I build strength but also gain fat", score: { ecto: 0, meso: 0, endo: 2 } },
    ],
  },
  {
    q: "How would you describe your metabolism?",
    opts: [
      { label: "Very fast — I can eat a lot", score: { ecto: 2, meso: 0, endo: 0 } },
      { label: "Moderate — balanced", score: { ecto: 0, meso: 2, endo: 0 } },
      { label: "Slow — I gain weight easily", score: { ecto: 0, meso: 0, endo: 2 } },
    ],
  },
  {
    q: "What does your current body shape look like?",
    opts: [
      { label: "Lean and light", score: { ecto: 2, meso: 0, endo: 0 } },
      { label: "Athletic and defined", score: { ecto: 0, meso: 2, endo: 0 } },
      { label: "Soft and rounded", score: { ecto: 0, meso: 0, endo: 2 } },
    ],
  },
  {
    q: "How long do you carry weight from a holiday or indulgent weekend?",
    opts: [
      { label: "Gone in 2–3 days", score: { ecto: 2, meso: 0, endo: 0 } },
      { label: "A week or so", score: { ecto: 0, meso: 2, endo: 0 } },
      { label: "It really sticks around", score: { ecto: 0, meso: 0, endo: 2 } },
    ],
  },
];

const bodyTypes: Record<string, { name: string; color: string; icon: string; desc: string; tips: string[] }> = {
  ecto: {
    name: "Ectomorph", color: "#C3FCFE", icon: "🏃",
    desc: "Naturally lean with a fast metabolism. You find it hard to gain weight or muscle. Your body burns through calories efficiently.",
    tips: ["Eat more — caloric surplus is your friend", "Focus on progressive strength training", "Don't skip meals — consistency is key", "Protein-rich diet: 2g per kg bodyweight"],
  },
  meso: {
    name: "Mesomorph", color: "#C69FF5", icon: "💪",
    desc: "The 'lucky' athletic build. You respond well to training and can gain muscle or lose fat relatively easily with the right approach.",
    tips: ["Balanced macros work well for you", "Variety in training keeps things progressing", "You're set up well — don't take it for granted!", "Consistent sleep and recovery maximises your edge"],
  },
  endo: {
    name: "Endomorph", color: "#60ADC7", icon: "🏋️",
    desc: "Naturally stocky with a slower metabolism. You gain weight easily but also have great potential for strength and power.",
    tips: ["Lower carb, higher protein approach helps most", "Cardio alongside weights for best results", "Sleep and stress management is crucial", "Smaller, more frequent meals can help manage appetite"],
  },
};

export default function BodyTypeQuizPage() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const scores = { ecto: 0, meso: 0, endo: 0 };
  answers.forEach((a, qi) => {
    const s = questions[qi]?.opts[a]?.score;
    if (s) { scores.ecto += s.ecto; scores.meso += s.meso; scores.endo += s.endo; }
  });

  const selectAnswer = (i: number) => {
    const newAnswers = [...answers.slice(0, currentQ), i];
    setAnswers(newAnswers);
    if (currentQ + 1 >= questions.length) {
      const max = Math.max(scores.ecto + questions[currentQ].opts[i].score.ecto, scores.meso + questions[currentQ].opts[i].score.meso, scores.endo + questions[currentQ].opts[i].score.endo);
      const tempScores = { ecto: scores.ecto + questions[currentQ].opts[i].score.ecto, meso: scores.meso + questions[currentQ].opts[i].score.meso, endo: scores.endo + questions[currentQ].opts[i].score.endo };
      const winner = (Object.entries(tempScores) as [string, number][]).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const reset = () => { setAnswers([]); setCurrentQ(0); setResult(null); };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "660px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#6B6F9A", textDecoration: "none", marginBottom: "2rem", fontSize: "0.875rem" }}>
          <ArrowLeft size={15} /> Back to Tools Hub
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(195,252,254,0.1)", border: "1px solid rgba(195,252,254,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={24} color="#C3FCFE" />
          </div>
          <h1 style={{ color: "#D8DBFC", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>Body Type Quiz</h1>
        </div>
        <p style={{ color: "#9A9EC4", lineHeight: 1.7, marginBottom: "2rem" }}>
          A fun, 6-question heuristic quiz. Remember: body types exist on a spectrum — this is a starting framework, not a fixed identity.
        </p>

        {!result ? (
          <div style={{ background: "#343553", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(195,252,254,0.1)" }}>
            {/* Progress */}
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "2rem" }}>
              {questions.map((_, i) => (
                <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i <= currentQ ? "linear-gradient(90deg, #C3FCFE, #C69FF5)" : "rgba(195,252,254,0.1)", transition: "background 0.3s" }} />
              ))}
            </div>
            <p style={{ color: "#6B6F9A", fontSize: "0.8rem", marginBottom: "0.75rem" }}>Question {currentQ + 1} of {questions.length}</p>
            <h2 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.15rem", marginBottom: "1.5rem" }}>{questions[currentQ].q}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {questions[currentQ].opts.map((opt, i) => (
                <button key={i} onClick={() => selectAnswer(i)} style={{ padding: "1rem 1.25rem", borderRadius: "12px", border: "1px solid rgba(195,252,254,0.15)", background: answers[currentQ] === i ? "rgba(195,252,254,0.1)" : "rgba(34,34,53,0.6)", color: answers[currentQ] === i ? "#C3FCFE" : "#9A9EC4", fontWeight: 500, fontSize: "0.95rem", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: "#343553", borderRadius: "24px", padding: "2.5rem", border: `1px solid rgba(${bodyTypes[result].color === "#C3FCFE" ? "195,252,254" : bodyTypes[result].color === "#C69FF5" ? "198,159,245" : "96,173,199"},0.25)`, textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>{bodyTypes[result].icon}</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: bodyTypes[result].color, marginBottom: "0.5rem" }}>{bodyTypes[result].name}</div>
            <p style={{ color: "#9A9EC4", lineHeight: 1.7, marginBottom: "2rem" }}>{bodyTypes[result].desc}</p>
            <div style={{ textAlign: "left", background: "rgba(34,34,53,0.6)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#D8DBFC", fontWeight: 700, marginBottom: "1rem", fontSize: "0.95rem" }}>Personalised tips for you:</h3>
              {bodyTypes[result].tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "0.625rem", marginBottom: "0.625rem", color: "#9A9EC4", fontSize: "0.875rem" }}>
                  <span style={{ color: bodyTypes[result].color, fontWeight: 700 }}>→</span> {tip}
                </div>
              ))}
            </div>
            <p style={{ color: "#6B6F9A", fontSize: "0.78rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              This is a fun heuristic quiz. Body types are a simplified model — real physiology is far more nuanced. Use this as a starting point, not a label.
            </p>
            <button className="btn-secondary" onClick={reset} style={{ width: "100%", justifyContent: "center" }}>Retake Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}
