import { Hadith, getGradingColor, formatHadithNumber } from "@/lib/hadith";

interface HadithCardProps {
  hadith: Hadith;
  onBookmark?: (hadithId: string) => void;
  isBookmarked?: boolean;
  showMetadata?: boolean;
  showMalay?: boolean;
  language?: "english" | "malay";
}

export default function HadithCard({ 
  hadith, 
  onBookmark, 
  isBookmarked = false,
  showMetadata = true,
  showMalay = false,
  language = "english"
}: HadithCardProps) {
  return (
    <div className="rounded-lg border border-black/10 p-6 bg-white shadow-sm hadith-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Arabic Text */}
          <div className="text-right mb-4">
            <p className="text-xl leading-relaxed font-arabic">{hadith.arabic}</p>
          </div>
          
          {/* Translation */}
          <div className="mb-4 space-y-2">
            {language === "malay" && hadith.malay ? (
              <p className="text-sm text-black/70 leading-relaxed">{hadith.malay}</p>
            ) : (
              <p className="text-sm text-black/70 leading-relaxed">{hadith.translation}</p>
            )}
            
            {showMalay && hadith.malay && language === "english" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-900 mb-1">Terjemahan Bahasa Melayu:</p>
                <p className="text-sm text-blue-800 leading-relaxed">{hadith.malay}</p>
              </div>
            )}
          </div>
          
          {/* Metadata Tags */}
          {showMetadata && (
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {formatHadithNumber(hadith.collection, hadith.book, hadith.hadith)}
              </span>
              
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradingColor(hadith.grading)}`}>
                {hadith.grading}
              </span>
              
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {hadith.narrator}
              </span>
              
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {hadith.category}
              </span>
            </div>
          )}
          
          {/* Keywords */}
          {hadith.keywords && hadith.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hadith.keywords.map((keyword, idx) => (
                <span key={idx} className="text-xs text-black/50 bg-black/5 px-2 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2 items-end">
          <span className="text-sm text-black/40">#{hadith.hadith}</span>
          
          {onBookmark && (
            <button 
              onClick={() => onBookmark(hadith.id)}
              className={`text-sm transition-colors ${
                isBookmarked 
                  ? "text-accent" 
                  : "text-brand hover:text-brand/80"
              }`}
            >
              {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
