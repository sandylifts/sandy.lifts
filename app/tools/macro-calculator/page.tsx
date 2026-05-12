// SERVER COMPONENT — no "use client"
// searchParams is injected by Next.js App Router at request time

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { parseHandoffParams } from "./lib/parseHandoffParams";
import { HandoffBanner } from "./components/HandoffBanner";
import { MacroForm } from "./components/MacroForm";

export const metadata: Metadata = {
  title: "Maintenance Calories & TDEE Calculator | Sandy.Lifts",
  description: "Calculate your exact daily Maintenance Calories and TDEE (Total Daily Energy Expenditure). Seamlessly connect your BMI Calculator and NEAT Calculator data for clinically accurate macronutrient targets using the Mifflin-St Jeor equation.",
  keywords: ["TDEE calculator", "BMI calculator", "NEAT calculator", "maintenance calories", "macro calculator", "fitness tools", "Sandy.Lifts"],
};

/* ─── Page (Server Component) ────────────────────────────── */
export default async function MacroCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the Promise — required in Next.js 15+
  const resolvedParams = await searchParams;
  const { isHandoff, prefilled, neatScore } = parseHandoffParams(resolvedParams);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", background: "#07090D" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>

        {/* Back — static, server-rendered */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 mb-8 transition-colors duration-200"
          style={{ color: "#4B5265", fontSize: "13px", textDecoration: "none" }}
        >
          <ArrowLeft size={14} />
          Back to Toolkit
        </Link>

        {/* Page header — static, server-rendered */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(195,252,254,0.08)",
              border: "1px solid rgba(195,252,254,0.18)",
            }}
          >
            <Calculator size={20} color="#C3FCFE" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5"
                style={{ background: "rgba(195,252,254,0.08)", color: "#C3FCFE", border: "1px solid rgba(195,252,254,0.2)" }}
              >
                LIVE
              </span>
              <span
                className="text-[9px] font-semibold tracking-[0.08em] uppercase rounded-full px-2.5 py-0.5"
                style={{ background: "rgba(255,255,255,0.04)", color: "#4B5265", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                MIFFLIN-ST JEOR · 1990
              </span>
            </div>
            <h1 className="text-[20px] font-semibold" style={{ color: "#F2F4F8" }}>
              Maintenance Calories
            </h1>
          </div>
        </div>
        <p className="mb-8" style={{ color: "#8B92A5", fontSize: "13px", lineHeight: 1.7 }}>
          Your personalised daily calorie baseline using the Mifflin-St Jeor equation — the most
          validated formula in modern nutrition science.
        </p>

        {/* Handoff banner — client component, conditionally rendered on server */}
        {isHandoff && <HandoffBanner neatScore={neatScore} />}

        {/* Interactive form — client component, receives pre-computed server props */}
        <MacroForm
          isHandoff={isHandoff}
          prefilled={prefilled}
          neatScore={neatScore}
        />

        {/* Footer note — static */}
        <p className="text-center mt-8 text-[11px]" style={{ color: "#4B5265" }}>
          All calculations are research-based estimates. Not medical advice.
        </p>
      </div>
    </div>
  );
}
