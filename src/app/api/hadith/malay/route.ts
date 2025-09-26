import { NextRequest, NextResponse } from "next/server";
import { searchMalayHadiths, getMalayCollections, getMalayCategories } from "@/lib/hadith";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  
  const collection = searchParams.get("collection") || undefined;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const grading = searchParams.get("grading") || undefined;
  const narrator = searchParams.get("narrator") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20");
  const page = parseInt(searchParams.get("page") || "1");
  
  try {
    const result = searchMalayHadiths(
      { collection, category, search, grading, narrator },
      page,
      limit
    );
    
    return NextResponse.json({
      success: true,
      data: {
        ...result,
        collections: getMalayCollections(),
        categories: getMalayCategories()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to search Malay hadiths" },
      { status: 500 }
    );
  }
}
