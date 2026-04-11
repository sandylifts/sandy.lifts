export function StatsSection() {
  const stats = [
    { value: "20+", label: "Fitness Tools", sub: "Free to use" },
    { value: "AI", label: "Diet & Workout Coach", sub: "Personalised plans" },
    { value: "100%", label: "Dark Mode", sub: "Easy on the eyes" },
    { value: "Free", label: "Community Access", sub: "No hidden costs" },
  ];

  return (
    <section style={{ padding: "3rem 1.5rem", background: "#05050B" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "rgba(195,252,254,0.06)", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(195,252,254,0.08)" }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ padding: "2rem 1.5rem", background: "#05050B", textAlign: "center", position: "relative" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, background: i % 2 === 0 ? "linear-gradient(135deg, #C3FCFE, #60ADC7)" : "linear-gradient(135deg, #C69FF5, #9B5DBA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "0.25rem" }}>
                {stat.value}
              </div>
              <div style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.9rem" }}>{stat.label}</div>
              <div style={{ color: "#6B6F9A", fontSize: "0.8rem", marginTop: "0.2rem" }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
