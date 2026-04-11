"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Transformation" },
  { href: "/tools", label: "Tools" },
  { href: "/ai-coach", label: "Nutrition" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <>
      <style>{`
        .nav-desktop-links { display: flex; align-items: center; gap: 0.125rem; }
        .sl-nav-link {
          color: #AAB3C5;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.4rem 0.875rem;
          border-radius: 10px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .sl-nav-link:hover { color: #F5F7FA; background: rgba(77,163,255,0.07); }
        .sl-nav-link.active { color: #66E6FF; background: rgba(77,163,255,0.1); }
        .sl-nav-cta {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, rgba(77,163,255,0.18) 0%, rgba(167,139,250,0.18) 100%);
          border: 1px solid rgba(77,163,255,0.4);
          color: #66E6FF; border-radius: 12px;
          font-weight: 700; font-size: 0.85rem;
          text-decoration: none; white-space: nowrap; margin-left: 0.75rem;
          transition: all 0.25s ease;
        }
        .sl-nav-cta:hover {
          background: linear-gradient(135deg, rgba(77,163,255,0.3) 0%, rgba(167,139,250,0.3) 100%);
          box-shadow: 0 0 28px rgba(77,163,255,0.3);
          transform: translateY(-1px);
        }
        .sl-mobile-btn {
          display: none; background: none; border: none;
          color: #AAB3C5; cursor: pointer; padding: 0.5rem;
          border-radius: 8px; transition: color 0.2s, background 0.2s;
          align-items: center; justify-content: center;
        }
        .sl-mobile-btn:hover { color: #F5F7FA; background: rgba(77,163,255,0.08); }
        @media (max-width: 960px) {
          .nav-desktop-links { display: none !important; }
          .sl-mobile-btn { display: flex !important; }
        }
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sl-mobile-menu { animation: navSlideDown 0.2s ease both; }
        .sl-mobile-link {
          display: block; color: #AAB3C5; font-size: 1.1rem; font-weight: 600;
          padding: 1rem 1.25rem; border-radius: 12px; text-decoration: none;
          border-bottom: 1px solid rgba(77,163,255,0.06);
          transition: color 0.2s, background 0.2s;
        }
        .sl-mobile-link:hover { color: #F5F7FA; background: rgba(77,163,255,0.07); }
        .sl-mobile-link.active { color: #66E6FF; background: rgba(77,163,255,0.1); }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
          backgroundColor: scrolled ? "rgba(7,9,13,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(1.5)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.5)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(77,163,255,0.1)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(7,9,13,0.6)" : "none",
        }}
      >
        <nav
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}
            aria-label="Sandy.Lifts home"
          >
            {/* Logo mark */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "linear-gradient(135deg, rgba(77,163,255,0.05) 0%, rgba(167,139,250,0.05) 100%)",
                border: "1px solid rgba(77,163,255,0.2)",
                boxShadow: "0 0 20px rgba(77,163,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/sandy-lifts-classic-neon.png" 
                alt="Sandy.Lifts" 
                style={{ width: "125%", height: "125%", objectFit: "cover", mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.15)" }} 
              />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                background: "linear-gradient(135deg, #66E6FF 0%, #4DA3FF 50%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}
            >
              SANDY.LIFTS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-desktop-links">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={`sl-nav-link${pathname === link.href ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/tools" className="sl-nav-cta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(); }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="sl-mobile-btn"
            id="mobile-menu-toggle"
            style={{ position: "relative", zIndex: 9999, pointerEvents: "auto", touchAction: "manipulation" }}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ pointerEvents: "none" }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ pointerEvents: "none" }}>
                <circle cx="5" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="19" cy="12" r="2" fill="currentColor" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="sl-mobile-menu-container"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed",
                top: "72px",
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(4, 5, 9, 0.98)",
                backdropFilter: "blur(32px)",
                padding: "2rem 1.5rem 4rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                overflowY: "auto",
                zIndex: 999,
                borderTop: "1px solid rgba(0,200,255,0.1)",
              }}
            >
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={`mob-${link.href}-${link.label}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        style={{
                          display: "block",
                          padding: "1.2rem 1.5rem",
                          borderRadius: "16px",
                          textDecoration: "none",
                          fontSize: isActive ? "1.3rem" : "1.15rem",
                          fontWeight: isActive ? 800 : 500,
                          color: isActive ? "#FFF" : "rgba(170, 179, 197, 0.55)",
                          background: isActive ? "linear-gradient(90deg, rgba(0, 200, 255, 0.1) 0%, transparent 100%)" : "transparent",
                          borderLeft: isActive ? "4px solid #00c8ff" : "4px solid transparent",
                          textShadow: isActive ? "0 0 20px rgba(0, 200, 255, 0.6)" : "none",
                          boxShadow: isActive ? "inset 20px 0 40px -20px rgba(0,200,255,0.15)" : "none",
                          transition: "color 0.3s, text-shadow 0.3s, font-size 0.3s, font-weight 0.3s",
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.06 + 0.1 }}
                style={{ marginTop: "1rem" }}
              >
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(123,111,255,0.3), transparent)", margin: "1.5rem 0" }} />
                
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="sl-nav-cta"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "1.2rem",
                    fontSize: "1.1rem",
                    marginLeft: 0,
                    borderRadius: "16px",
                    width: "100%",
                    boxShadow: "0 0 30px rgba(0,200,255,0.2)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Start Your Transformation
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  marginTop: "auto",
                  paddingTop: "3rem",
                  fontSize: "0.85rem",
                  color: "#64748b",
                  textAlign: "center",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}
              >
                Backed by real experience
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
