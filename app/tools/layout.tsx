import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools Hub — 20+ Free Fitness Tools | Sandy.Lifts",
  description: "Every fitness tool you'll ever need: macro calculator, body type quiz, workout planner, before/after simulator, progress chart, and much more. All free.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
