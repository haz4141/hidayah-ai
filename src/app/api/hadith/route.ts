import { NextRequest, NextResponse } from "next/server";

// Proxy to HadithAPI.com using an environment variable for the key
// Example usage: /api/hadith?book=sahih-bukhari&hadithEnglish=mercy&paginate=10

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const key = process.env.HADITHAPI_KEY;
  if (!key) {
    return NextResponse.json({ error: "Missing HADITHAPI_KEY" }, { status: 500 });
  }

  const params = new URLSearchParams(url.searchParams);
  params.set("apiKey", key);

  const upstream = `https://hadithapi.com/public/api/hadiths?${params.toString()}`;

  try {
    const res = await fetch(upstream, { headers: { Accept: "application/json" } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}


