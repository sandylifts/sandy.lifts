import { cn } from "@/lib/utils";
import React from "react";

interface StatCardProps {
  icon: string;
  title: string;
  sub: string;
  accent: string;
  className?: string;
}

export default function StatCard({ icon, title, sub, accent, className }: StatCardProps) {
  return (
    <div
      className={cn("sl-stat-card", className)}
      style={{
        flex: "1 1 0",
        minWidth: "100px",
        background: "rgba(11,14,22,0.75)",
        border: `1px solid ${accent}22`,
        borderRadius: "16px",
        padding: "1rem",
        backdropFilter: "blur(16px)",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F5F7FA", lineHeight: 1.3, marginBottom: "0.3rem" }}>{title}</div>
      <div style={{ fontSize: "0.71rem", color: "#AAB3C5" }}>{sub}</div>
    </div>
  );
}
