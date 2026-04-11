import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/setup-logo
 * Copies the brand logo from the temp media storage to public/sandy-lifts-logo.jpg
 * Run this once by visiting /api/setup-logo in your browser.
 */
export async function GET(_req: NextRequest) {
  const sourcePaths = [
    path.join(
      process.env.APPDATA || process.env.HOME || "",
      ".gemini/antigravity/brain/fc05e7fe-8c1a-4590-9340-c6c4740284e1/media__1774721677107.jpg"
    ),
    "C:/Users/Predator/.gemini/antigravity/brain/fc05e7fe-8c1a-4590-9340-c6c4740284e1/media__1774721677107.jpg",
  ];

  const destPath = path.join(process.cwd(), "public", "sandy-lifts-logo.jpg");

  // Already exists
  if (fs.existsSync(destPath)) {
    return NextResponse.json({ status: "already_exists", path: "/sandy-lifts-logo.jpg" });
  }

  for (const src of sourcePaths) {
    if (fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, destPath);
        return NextResponse.json({ status: "success", message: "Logo copied! Refresh the homepage now.", path: "/sandy-lifts-logo.jpg" });
      } catch {
        // continue
      }
    }
  }

  return NextResponse.json({
    status: "not_found",
    message: "Could not find source logo. Please manually copy your logo image to: public/sandy-lifts-logo.jpg",
    triedPaths: sourcePaths,
  }, { status: 404 });
}
