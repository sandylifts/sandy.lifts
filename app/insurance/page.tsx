"use client";
import { useState } from "react";
import { ShieldAlert, HeartPulse, Send, CheckCircle2, PhoneCall, Info } from "lucide-react";

export default function InsurancePage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", time: "", consent: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.consent) return;
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#05050B" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="badge badge-cyan" style={{ marginBottom: "1rem" }}>Health Insurance Support</span>
          <h1 className="text-headline" style={{ color: "#D8DBFC", marginBottom: "1rem" }}>
            Let's sort out your <span style={{ background: "linear-gradient(135deg, #60ADC7, #C3FCFE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>health cover.</span>
          </h1>
          <p style={{ color: "#9A9EC4", maxWidth: "660px", margin: "0 auto", lineHeight: 1.7 }}>
            Navigating policies is confusing. Our insurance experts provide clear, unbiased guidance to help you find the right private health plan — without any pressure.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          
          {/* Informational left pane */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(96,173,199,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <HeartPulse size={20} color="#60ADC7" />
                </div>
                <h2 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.25rem", margin: 0 }}>Why get covered?</h2>
              </div>
              <ul style={{ padding: "0 0 0 1rem", color: "#9A9EC4", lineHeight: 1.8, fontSize: "0.95rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Fast-track your access to consultants and specialists.</li>
                <li style={{ marginBottom: "0.5rem" }}>Private facilities, private rooms, flexible appointment times.</li>
                <li>Specialist diagnostics like MRI, CT, and PET scans without the wait.</li>
              </ul>
            </div>
            
            <div style={{ background: "rgba(5,5,11,0.6)", padding: "2rem", borderRadius: "16px", border: "1px solid rgba(195,252,254,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <ShieldAlert size={20} color="#C3FCFE" />
                <h3 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.05rem", margin: 0 }}>Privacy First</h3>
              </div>
              <p style={{ color: "#9A9EC4", margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
                We will <strong>never</strong> ask for sensitive medical history or pre-existing conditions through this form. An expert will simply call you at your preferred time to discuss your generic requirements.
              </p>
            </div>
          </div>

          {/* Form right pane */}
          <div className="surface-card" style={{ padding: "3rem", border: "1px solid rgba(96,173,199,0.2)" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <PhoneCall size={20} color="#60ADC7" />
                  <h3 style={{ color: "#D8DBFC", fontWeight: 700, fontSize: "1.25rem", margin: 0 }}>Request a Free Callback</h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Full Name *</label>
                    <input className="input-field" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Email Address *</label>
                    <input className="input-field" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Phone Number</label>
                    <input className="input-field" type="tel" placeholder="+44 7000 000000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Location (City)</label>
                    <input className="input-field" type="text" placeholder="London" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label style={{ color: "#D8DBFC", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>Preferred Callback Time</label>
                  <select className="select-field" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                    <option value="">Anytime</option>
                    <option value="morning">Morning (9am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 5pm)</option>
                    <option value="evening">Evening (5pm - 8pm)</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginTop: "0.5rem" }}>
                  <input type="checkbox" id="consent" checked={form.consent} onChange={e => setForm(p => ({...p, consent: e.target.checked }))} style={{ marginTop: "4px", accentColor: "#60ADC7" }} required />
                  <label htmlFor="consent" style={{ color: "#9A9EC4", fontSize: "0.85rem", lineHeight: 1.6, cursor: "pointer" }}>
                    I consent to Sandy.Lifts passing my contact details to a regulated insurance partner to contact me regarding health insurance quotes. 
                  </label>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "1rem", justifyContent: "center", padding: "1rem", background: "linear-gradient(135deg, rgba(96,173,199,0.2), rgba(195,252,254,0.15))", borderColor: "rgba(96,173,199,0.4)", color: "#C3FCFE" }}>
                  <Send size={18} /> Send Request
                </button>
              </form>
            ) : (
               <div style={{ textAlign: "center", padding: "2rem" }}>
                 <CheckCircle2 size={64} color="#60ADC7" style={{ margin: "0 auto 1.5rem" }} />
                 <h2 style={{ color: "#D8DBFC", fontWeight: 800, fontSize: "1.75rem", marginBottom: "1rem" }}>We've received your request</h2>
                 <p style={{ color: "#9A9EC4", lineHeight: 1.7, marginBottom: "2rem" }}>
                   Thank you for trusting us. One of our partnered experts will review your details and be in touch soon at your preferred time.
                 </p>
                 <button className="btn-secondary" onClick={() => setSubmitted(false)}>Submit Another Request</button>
               </div>
            )}
          </div>
        </div>

        {/* Media Query for responsive grid */}
        <style>{`@media (max-width: 900px) { div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </div>
  );
}
