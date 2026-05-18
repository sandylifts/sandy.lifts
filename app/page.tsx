import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { WhySection } from "@/components/features/WhySection";
import { TransformationSection } from "@/components/home/TransformationSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { TeamSection } from "@/components/home/TeamSection";
import { SandyShieldSection } from "@/components/home/SandyShieldSection";
import { PlanSection } from "@/components/home/PlanSection";

export const metadata: Metadata = {
  title: "Sandy.Lifts — Your Premium Fitness Hub",
  description: "AI-powered fitness tools, personalised workout plans, diet coaching, and a premium fitness community. Start your transformation today.",
};

import { IntakeSection } from "@/components/intake/IntakeSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhySection />
      <TransformationSection />
      <TestimonialSection />
      <TeamSection />
      <PlanSection />
      <SandyShieldSection />
    </div>
  );
}
