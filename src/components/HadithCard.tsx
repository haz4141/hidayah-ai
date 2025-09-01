import { Hadith, getGradingColor, formatHadithNumber } from "@/lib/hadith";

interface HadithCardProps {
  hadith: Hadith;
  onBookmark?: (hadithId: string) => void;
  isBookmarked?: boolean;
  showMetadata?: boolean;
}

export default function HadithCard({ 
  hadith, 
  onBookmark, 
  isBookmarked = false,
  showMetadata = true 
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
          <p className="text-sm text-black/70 leading-relaxed mb-4">{hadith.translation}</p>
          
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
