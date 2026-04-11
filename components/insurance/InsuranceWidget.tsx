import Link from "next/link";
import { Shield, Phone, ArrowRight } from "lucide-react";

export function InsuranceWidget() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "#05050B" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(96,173,199,0.08) 0%, rgba(198,159,245,0.08) 100%)",
          border: "1px solid rgba(96,173,199,0.2)",
          borderRadius: "24px",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1.5rem",
        }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "rgba(96,173,199,0.1)", border: "1px solid rgba(96,173,199,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={30} color="#60ADC7" />
          </div>

          <div>
            <span className="badge" style={{ background: "rgba(96,173,199,0.1)", color: "#60ADC7", border: "1px solid rgba(96,173,199,0.25)", marginBottom: "0.75rem", display: "inline-flex" }}>
              Insurance Help
            </span>
            <h2 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "0.5rem 0", lineHeight: 1.3 }}>
              Confused about health insurance?
            </h2>
            <p style={{ color: "#9A9EC4", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              Our insurance experts give you a free, no-pressure callback to help you find the right health cover — whether you're employed, self-employed, or somewhere in between.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/insurance" className="btn-primary" style={{ background: "linear-gradient(135deg, rgba(96,173,199,0.2), rgba(198,159,245,0.15))", borderColor: "rgba(96,173,199,0.4)", color: "#60ADC7" }}>
              <Phone size={16} />
              Request Free Callback
            </Link>
            <Link href="/insurance" className="btn-secondary">
              Learn More <ArrowRight size={14} />
            </Link>
          </div>

          <p style={{ color: "#6B6F9A", fontSize: "0.78rem" }}>
            ✓ No obligation &nbsp;·&nbsp; ✓ No medical questions upfront &nbsp;·&nbsp; ✓ We call you
          </p>
        </div>
      </div>
    </section>
  );
}
