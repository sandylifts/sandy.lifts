import Link from "next/link";
import { Dumbbell, Globe, MessageCircle, Share2, Heart } from "lucide-react";

const socialLinks = [
  { Icon: Globe, label: "Website", href: "#" },
  { Icon: MessageCircle, label: "Community Chat", href: "#" },
  { Icon: Share2, label: "Share", href: "#" },
];

export function Footer() {
  return (
    <footer style={{ background: "#05050B", borderTop: "1px solid rgba(195,252,254,0.06)", padding: "4rem 1.5rem 2rem" }}>
      <style>{`
        .footer-link {
          display: block;
          color: #6B6F9A;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #9A9EC4; }
        .footer-social {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(34,34,53,0.8);
          border: 1px solid rgba(195,252,254,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B6F9A;
          transition: all 0.2s;
          text-decoration: none;
          flex-shrink: 0;
        }
        .footer-social:hover {
          border-color: rgba(195,252,254,0.35);
          color: #C3FCFE;
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginBottom: "1rem" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", overflow: "hidden", background: "linear-gradient(135deg, rgba(195,252,254,0.05), rgba(198,159,245,0.05))", border: "1px solid rgba(195,252,254,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/sandy-lifts-classic-neon.png" alt="Sandy.Lifts Classic" style={{ width: "135%", height: "135%", objectFit: "cover", mixBlendMode: "screen", filter: "brightness(1.15) contrast(1.15)" }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(135deg, #C3FCFE, #C69FF5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Sandy.Lifts
              </span>
            </Link>
            <p style={{ color: "#6B6F9A", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "220px" }}>
              Your premium fitness companion. AI-powered tools, expert community, and real results.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              {socialLinks.map(({ Icon, label, href }, i) => (
                <a key={i} href={href} aria-label={label} className="footer-social">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 style={{ color: "#D8DBFC", fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Tools Hub</h4>
            {["Macro Calculator", "Body Type Quiz", "Workout Planner", "AI Diet Coach", "Progress Tracker", "Body Fat %"].map(item => (
              <Link key={item} href="/tools" className="footer-link">{item}</Link>
            ))}
          </div>

          {/* Pages */}
          <div>
            <h4 style={{ color: "#D8DBFC", fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Explore</h4>
            {[
              { label: "AI Coach", href: "/ai-coach" },
              { label: "Community", href: "/community" },
              { label: "Myths Busted", href: "/myths" },
              { label: "About Sandy", href: "/about" },
              { label: "Insurance Help", href: "/insurance" },
            ].map(item => (
              <Link key={item.href} href={item.href} className="footer-link">{item.label}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: "#D8DBFC", fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>Legal & Health</h4>
            <p style={{ color: "#6B6F9A", fontSize: "0.8rem", lineHeight: 1.7, marginBottom: "1rem" }}>
              All content is for educational purposes only. Always consult a qualified healthcare professional before starting any fitness or diet programme.
            </p>
            <p style={{ color: "#6B6F9A", fontSize: "0.8rem", lineHeight: 1.7 }}>
              The AI tools on this site do not provide medical advice or diagnosis.
            </p>
          </div>
        </div>

        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(195,252,254,0.1), transparent)", marginBottom: "1.5rem" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ color: "#6B6F9A", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} Sandy.Lifts. All rights reserved.
          </p>
          <p style={{ color: "#6B6F9A", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            Made with <Heart size={13} color="#C69FF5" fill="#C69FF5" /> for the fitness community
          </p>
        </div>
      </div>
    </footer>
  );
}
