"use client";

import { useEffect, useState } from "react";
import { Hadith, getRandomHadith, getRandomMalayHadith } from "@/lib/hadith";
import HadithCard from "./HadithCard";

interface DailyHadithProps {
  language?: "english" | "malay";
}

export default function DailyHadith({ language = "english" }: DailyHadithProps) {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadDailyHadith() {
      try {
        setLoading(true);
        const endpoint = language === "malay" ? "/api/hadith/malay/random" : "/api/hadith/random";
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.success) {
          setHadith(data.data.hadith);
        } else {
          setError(language === "malay" ? "Gagal memuatkan hadith harian" : "Failed to load daily hadith");
        }
      } catch (err) {
        setError(language === "malay" ? "Gagal memuatkan hadith harian" : "Failed to load daily hadith");
      } finally {
        setLoading(false);
      }
    }

    loadDailyHadith();
  }, [language]);

  if (loading) {
    return (
      <div className="rounded-lg border border-black/10 p-6 bg-white shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !hadith) {
    return (
      <div className="rounded-lg border border-red-200 p-6 bg-red-50">
        <p className="text-red-600 text-center">{error || (language === "malay" ? "Tiada hadith tersedia" : "No hadith available")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brand">
          {language === "malay" ? "Hadith Harian" : "Daily Hadith"}
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-brand hover:text-brand/80 transition-colors"
        >
          ↻ {language === "malay" ? "Hadith Baru" : "New Hadith"}
        </button>
      </div>
      <HadithCard 
        hadith={hadith} 
        language={language}
        showMetadata={true}
        showMalay={language === "english"}
        onBookmark={(hadithId) => {
          console.log("Bookmark daily hadith:", hadithId);
          // Add bookmark functionality
        }}
      />
    </div>
  );
}
