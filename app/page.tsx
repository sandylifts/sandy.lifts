import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { ToolsPreview } from "@/components/home/ToolsPreview";
import { AIPreview } from "@/components/home/AIPreview";
import { WhySection } from "@/components/features/WhySection";
import { InsuranceWidget } from "@/components/insurance/InsuranceWidget";
import { CommunityPreview } from "@/components/home/CommunityPreview";
import { TrustEcosystem } from "@/components/home/TrustEcosystem";
import { MythTicker } from "@/components/home/MythTicker";
import { EnergyCheckIn } from "@/components/home/EnergyCheckIn";

export const metadata: Metadata = {
  title: "Sandy.Lifts — Your Premium Fitness Hub",
  description: "AI-powered fitness tools, personalised workout plans, diet coaching, and a premium fitness community. Start your transformation today.",
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhySection />
      <MythTicker />
      <EnergyCheckIn />
      <TrustEcosystem />
      <FeaturesGrid />
      <ToolsPreview />
      <AIPreview />
      <CommunityPreview />
      <InsuranceWidget />
    </div>
  );
}
