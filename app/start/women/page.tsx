import type { Metadata } from "next";
import { WomenIntakeForm } from "@/components/intake/WomenIntakeForm";

export const metadata: Metadata = {
  title: "Women's Free Fitness Assessment — Sandy.Lifts",
  description: "Fill your personalised fitness and nutrition assessment. Get your custom women's plan in 24 hours.",
};

export default function WomenStartPage() {
  return <WomenIntakeForm />;
}
