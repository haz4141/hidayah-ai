import { NextResponse } from "next/server";
import { getRandomHadith } from "@/lib/hadith";

export async function GET() {
  try {
    const hadith = getRandomHadith();
    
    return NextResponse.json({
      success: true,
      data: {
        hadith,
        message: "Daily Hadith"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get random hadith" },
      { status: 500 }
    );
  }
}
