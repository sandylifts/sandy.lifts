import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Coach — Personalised Diet & Workout Plans",
  description:
    "Get a science-backed, personalised diet or workout plan in seconds. Sandy.Lifts AI Coach analyses your goals and creates a real-food meal plan or structured weekly workout — no bro-science.",
};

export default function AICoachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
