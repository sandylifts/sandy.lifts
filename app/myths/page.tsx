import { FileQuestion, Quote, Info, Search } from "lucide-react";

const myths = [
  {
    title: "“I need to do endless cardio to lose fat”",
    reality: "Fat loss is primarily driven by a caloric deficit. While cardio burns energy, weight training builds muscle, which increases your resting metabolic rate. A combination of both—plus a solid diet—is the most effective approach.",
    citation: "Westcott et al., 2015"
  },
  {
    title: "“Eating late at night causes weight gain”",
    reality: "Your body doesn't magically store all food as fat after 8 PM. Total daily caloric intake vs. total daily expenditure dictates weight change, regardless of meal timing.",
    citation: "Kinsey & Ormsbee, 2015"
  },
  {
    title: "“Lifting weights will make me bulky”",
    reality: "Getting ‘bulky’ requires an intentional, massive caloric surplus and years of specific hypertrophic training. For most people, lifting weights results in a lean, defined, ‘toned’ appearance.",
    citation: "American College of Sports Medicine"
  },
  {
    title: "“I can target belly fat with crunches”",
    reality: "Spot reduction is a myth. You cannot choose where your body burns fat. Crunches will build your abdominal muscles, but to reveal them, you must reduce overall body fat through diet and full-body exercise.",
    citation: "Vispute et al., 2011"
  },
  {
    title: "“Carbs make you fat”",
    reality: "Excess calories make you fat. Carbohydrates are your body's preferred energy source, especially for high-intensity training. The issue arises when we overconsume highly palatable, ultra-processed carb-heavy foods.",
    citation: "Hall et al., 2015"
  }
];

export default function MythsBustedPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="badge badge-cyan" style={{ marginBottom: "1rem" }}>Myths Busted</span>
          <h1 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>
            Separating <span style={{ background: "linear-gradient(135deg, #C3FCFE, #60ADC7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Fact from Fiction</span>
          </h1>
          <p style={{ color: "#9A9EC4", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
            The fitness industry is full of noise, BS marketing, and outdated advice. Let's break down the most common myths using actual science and common sense.
          </p>
        </div>

        {/* Content list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {myths.map((myth, i) => (
            <div key={i} className="surface-card" style={{ padding: "2.5rem", border: "1px solid rgba(195,252,254,0.15)" }}>
               <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                 <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(195,252,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileQuestion size={20} color="#C3FCFE" />
                 </div>
                 <div>
                    <h2 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.25rem", margin: "0 0 0.25rem 0", lineHeight: 1.4 }}>{myth.title}</h2>
                    <span className="badge" style={{ background: "rgba(255,107,107,0.1)", color: "#FF6B6B", border: "1px solid rgba(255,107,107,0.2)", fontSize: "0.7rem", display: "inline-flex" }}>MYTH</span>
                 </div>
               </div>

               <div style={{ background: "rgba(34,34,53,0.5)", borderRadius: "14px", padding: "1.5rem", borderLeft: "4px solid #60ADC7", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem", color: "#60ADC7" }}>
                    <Search size={16} />
                    <strong style={{ fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>The Reality</strong>
                  </div>
                  <p style={{ color: "#D8DBFC", margin: 0, lineHeight: 1.7, fontSize: "0.95rem" }}>
                    {myth.reality}
                  </p>
               </div>

               <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "#6B6F9A", fontSize: "0.8rem", justifyContent: "flex-end" }}>
                 <Info size={14} /> Source: {myth.citation}
               </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: "4rem", textAlign: "center", padding: "2rem", background: "rgba(195,252,254,0.05)", borderRadius: "20px", border: "1px solid rgba(195,252,254,0.1)" }}>
          <Quote size={28} color="#60ADC7" style={{ opacity: 0.5, margin: "0 auto 1rem" }} />
          <p style={{ color: "#9A9EC4", fontSize: "1.1rem", fontStyle: "italic", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            "Good fitness advice should simplify your life, not complicate it with endless, rigid rules based on bad science."
          </p>
          <div style={{ color: "#C3FCFE", fontWeight: 700, marginTop: "1rem", fontSize: "0.9rem" }}>— Sandy</div>
        </div>
      </div>
    </div>
  );
}
