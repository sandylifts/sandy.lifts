import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/setup-hero
 * Copies the premium hero selfie to public/hero-selfie.png
 */
export async function GET(_req: NextRequest) {
  const sourceDirs = [
    path.join(process.env.APPDATA || process.env.HOME || "", ".gemini/antigravity/brain/fc05e7fe-8c1a-4590-9340-c6c4740284e1"),
    "C:/Users/Predator/.gemini/antigravity/brain/fc05e7fe-8c1a-4590-9340-c6c4740284e1",
  ];

  const destPath = path.join(process.cwd(), "public", "hero-selfie.png");

  // Try to find the premium_hero_selfie*.png file
  let sourcePath = null;
  for (const dir of sourceDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const target = files.find(f => f.startsWith("premium_hero_selfie_") && f.endsWith(".png"));
      if (target) {
        sourcePath = path.join(dir, target);
        break;
      }
    }
  }

  if (sourcePath && fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      return NextResponse.json({ status: "success", message: "Hero photo copied!", path: "/hero-selfie.png" });
    } catch {
      // ignore
    }
  }

  return NextResponse.json({
    status: "not_found",
    message: "Could not find generated hero photo.",
  }, { status: 404 });
}
