import type { Metadata } from "next";
import { MenIntakeForm } from "@/components/intake/MenIntakeForm";

export const metadata: Metadata = {
  title: "Men's Free Fitness Assessment — Sandy.Lifts",
  description: "Fill your personalised fitness and nutrition assessment. Get your custom men's plan in 24 hours.",
};

export default function MenStartPage() {
  return <MenIntakeForm />;
}
