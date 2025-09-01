import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.HADITHAPI_KEY || "$2y$10$y5YFBla7izaeIPt30Y4DOIwskTsVJywnfodQk0QZm61J9aiISu";
  
  try {
    // Test the API with a simple query
    const testUrl = `https://hadithapi.com/public/api/hadiths?apiKey=${key}&book=sahih-bukhari&paginate=1`;
    const response = await fetch(testUrl, { 
      headers: { Accept: "application/json" } 
    });
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `API Error: ${response.status} ${response.statusText}`,
        details: "Check your API key and try again"
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: "HadithAPI.com connection successful!",
      data: {
        total: data.data?.total || "Unknown",
        hadiths: data.data?.hadiths?.length || 0,
        apiKey: key.substring(0, 10) + "..." // Show first 10 chars for verification
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to connect to HadithAPI.com",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
