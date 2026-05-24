import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const src = 'C:\\Users\\Predator\\.gemini\\antigravity-ide\\brain\\54a8f622-9eae-4e55-84eb-bfb4d8ee30b4\\cute_waving_robot_1779652222982.png';
  const dest = path.join(process.cwd(), 'public', 'cute_waving_robot.png');

  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      return NextResponse.json({ success: true, message: 'Image successfully copied to public folder!' });
    } else {
      return NextResponse.json({ success: false, error: 'Source file does not exist.' });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
