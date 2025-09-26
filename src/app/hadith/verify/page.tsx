"use client";

import { useState } from "react";
import { searchHadiths } from "@/lib/hadith";
import HadithCard from "@/components/HadithCard";

export default function HadithVerifyPage() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function verifyHadith() {
    if (!inputText.trim()) {
      setError("Please enter hadith text to verify");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Search in local dataset
      const localResults = searchHadiths({ search: inputText }, 1, 10);
      
      // Also search in external API if needed
      const externalResults = await fetch(`/api/hadith?hadithArabic=${encodeURIComponent(inputText)}&hadithEnglish=${encodeURIComponent(inputText)}&paginate=5`)
        .then(res => res.json())
        .catch(() => ({ data: { hadiths: [] } }));

      setResults([
        ...localResults.hadiths.map(h => ({ ...h, source: 'local' })),
        ...(externalResults.data?.hadiths || []).map((h: any) => ({ ...h, source: 'external' }))
      ]);
      
    } catch (err) {
      setError("Failed to verify hadith. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-brand">Hadith Verification</h1>
        <p className="text-black/70 mt-2">Enter hadith text to verify its authenticity and find source references</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-black/10 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="hadith-text" className="block text-sm font-medium text-black/80 mb-2">
              Enter Hadith Text (Arabic or English)
            </label>
            <textarea
              id="hadith-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the hadith text you want to verify here..."
              className="w-full h-32 p-3 border border-black/20 rounded-lg resize-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          
          <button
            onClick={verifyHadith}
            disabled={loading}
            className="w-full bg-brand text-white py-3 px-6 rounded-lg font-medium hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Verifying..." : "Verify Hadith"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Verification Results ({results.length} found)
          </h2>
          
          <div className="space-y-4">
            {results.map((hadith, index) => (
              <div key={index} className="relative">
                {hadith.source === 'local' ? (
                  <HadithCard 
                    hadith={hadith} 
                    showMetadata={true}
                    onBookmark={(id) => console.log("Bookmark:", id)}
                  />
                ) : (
                  <div className="rounded-lg border border-black/10 p-6 bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-right mb-3">
                          <p className="text-xl leading-relaxed font-arabic">
                            {hadith.hadithArabic || "Arabic text not available"}
                          </p>
                        </div>
                        <p className="text-sm text-black/70 leading-relaxed">
                          {hadith.hadithEnglish || hadith.text || "Translation not available"}
                        </p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            External Source
                          </span>
                          {hadith.number && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              #{hadith.number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use Hadith Verification</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Copy and paste</strong> the hadith text (Arabic or English)</li>
          <li>• <strong>Click "Verify Hadith"</strong> to search our database</li>
          <li>• <strong>Review results</strong> to see authenticity and sources</li>
          <li>• <strong>Check metadata</strong> including narrator, grading, and collection</li>
          <li>• <strong>Always consult scholars</strong> for important religious matters</li>
        </ul>
      </div>
    </section>
  );
}
