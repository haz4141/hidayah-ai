import { NextResponse } from "next/server";
import { getRandomMalayHadith } from "@/lib/hadith";

export async function GET() {
  try {
    const hadith = getRandomMalayHadith();
    
    return NextResponse.json({
      success: true,
      data: {
        hadith,
        message: "Hadith Harian (Daily Hadith)"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get random Malay hadith" },
      { status: 500 }
    );
  }
}
