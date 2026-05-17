import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { WhySection } from "@/components/features/WhySection";
import { TransformationSection } from "@/components/home/TransformationSection";

export const metadata: Metadata = {
  title: "Sandy.Lifts — Your Premium Fitness Hub",
  description: "AI-powered fitness tools, personalised workout plans, diet coaching, and a premium fitness community. Start your transformation today.",
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhySection />
      <TransformationSection />
    </div>
  );
}
