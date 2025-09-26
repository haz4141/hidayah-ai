"use client";

import { useEffect, useMemo, useState } from "react";
import HadithCard from "@/components/HadithCard";
import { Hadith as LocalHadith, getCategories, getGradings, getNarrators } from "@/lib/hadith";

type NormalizedHadith = {
  key: string;
  arabic: string;
  translation: string;
  number: number;
  source: string;
  narrator?: string;
  grading?: string;
  category?: string;
  keywords?: string[];
};

const BOOKS = [
  { value: "sahih-bukhari", label: "Sahih Bukhari" },
  { value: "sahih-muslim", label: "Sahih Muslim" },
  { value: "jami-at-tirmidhi", label: "Jami' at-Tirmidhi" },
  { value: "sunan-an-nasai", label: "Sunan an-Nasa'i" },
  { value: "sunan-abu-dawood", label: "Sunan Abu Dawud" },
  { value: "sunan-ibn-e-majah", label: "Sunan Ibn Majah" },
];

const LOCAL_COLLECTIONS = [
  { value: "bukhari", label: "Sahih Bukhari" },
  { value: "muslim", label: "Sahih Muslim" },
  { value: "tirmidhi", label: "Jami' at-Tirmidhi" },
  { value: "nasai", label: "Sunan an-Nasa'i" },
  { value: "abudawud", label: "Sunan Abu Dawud" },
  { value: "ibnmajah", label: "Sunan Ibn Majah" },
];

const CATEGORIES = getCategories();
const GRADINGS = getGradings();
const NARRATORS = getNarrators();

export default function HadithPage() {
  const [dataSource, setDataSource] = useState<"local" | "external">("local");
  const [language, setLanguage] = useState<"english" | "malay">("english");
  const [book, setBook] = useState<string>(BOOKS[0].value);
  const [localCollection, setLocalCollection] = useState<string>(LOCAL_COLLECTIONS[0].value);
  const [category, setCategory] = useState<string>("");
  const [grading, setGrading] = useState<string>("");
  const [narrator, setNarrator] = useState<string>("");
  const [paginate, setPaginate] = useState<number>(20);
  const [q, setQ] = useState<string>("");
  const [items, setItems] = useState<NormalizedHadith[]>([]);
  const [localHadiths, setLocalHadiths] = useState<LocalHadith[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (dataSource === "local") {
          // Load from local dataset
          const searchParams = new URLSearchParams({ 
            limit: String(paginate),
            page: String(page)
          });
          if (localCollection) searchParams.set("collection", localCollection);
          if (category) searchParams.set("category", category);
          if (grading) searchParams.set("grading", grading);
          if (narrator) searchParams.set("narrator", narrator);
          if (q.trim()) searchParams.set("search", q.trim());
          
          const endpoint = language === "malay" ? "/api/hadith/malay" : "/api/hadith/local";
          const res = await fetch(`${endpoint}?${searchParams.toString()}`);
          const data = await res.json();
          
                     if (data.success) {
             const hadiths: LocalHadith[] = data.data.hadiths;
             setLocalHadiths(hadiths);
             const normalized: NormalizedHadith[] = hadiths.map((h) => ({
               key: h.id,
               arabic: h.arabic,
               translation: h.translation,
               number: h.hadith,
               source: LOCAL_COLLECTIONS.find(c => c.value === h.collection)?.label || h.collection,
               narrator: h.narrator,
               grading: h.grading,
               category: h.category,
               keywords: h.keywords,
             }));
             setItems(normalized);
             setTotal(data.data.total);
           }
        } else {
          // Load from external API
          const searchParams = new URLSearchParams({ book, paginate: String(paginate) });
          if (q.trim()) {
            searchParams.set("hadithArabic", q);
            searchParams.set("hadithEnglish", q);
          }
          searchParams.set("page", String(page));
          const res = await fetch(`/api/hadith?${searchParams.toString()}`);
          const data = await res.json();
          const list: unknown = data?.data?.hadiths || data?.data?.hadith || data?.hadiths || [];
          const array = Array.isArray(list) ? list : [];
          const normalized: NormalizedHadith[] = array.map((h: Record<string, unknown>, idx: number) => ({
            key: String((h.number as number | undefined) ?? (h.no as number | undefined) ?? idx + 1),
            arabic: (h.hadithArabic as string | undefined) ?? (h.arab as string | undefined) ?? (h.ar as string | undefined) ?? "",
            translation: (h.hadithEnglish as string | undefined) ?? (h.id as string | undefined) ?? (h.en as string | undefined) ?? (h.text as string | undefined) ?? "",
            number: Number((h.number as number | undefined) ?? (h.no as number | undefined) ?? idx + 1),
            source: BOOKS.find((b) => b.value === book)?.label || book,
          }));
          setItems(normalized);
          const metaTotal = Number(data?.data?.total || data?.total || normalized.length);
          setTotal(Number.isFinite(metaTotal) ? metaTotal : normalized.length);
        }
      } catch {
        setError("Failed to load hadith. Try again later.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [dataSource, language, book, localCollection, category, grading, narrator, paginate, q, page]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (h) => h.translation.toLowerCase().includes(t) || h.arabic.includes(q)
    );
  }, [q, items]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Hadith Insights</h1>
      <p className="text-black/70 mt-1">Browse authentic hadiths from major collections with local and external sources.</p>

      {/* Data Source and Language Toggle */}
      <div className="mt-6 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Data Source:</label>
          <div className="flex rounded-lg border border-black/20 p-1">
            <button
              onClick={() => setDataSource("local")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dataSource === "local" 
                  ? "bg-brand text-white" 
                  : "text-black/60 hover:text-black/80"
              }`}
            >
              Local Dataset
            </button>
            <button
              onClick={() => setDataSource("external")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dataSource === "external" 
                  ? "bg-brand text-white" 
                  : "text-black/60 hover:text-black/80"
              }`}
            >
              External API
            </button>
          </div>
        </div>

        {dataSource === "local" && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Language:</label>
            <div className="flex rounded-lg border border-black/20 p-1">
              <button
                onClick={() => setLanguage("english")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === "english" 
                    ? "bg-brand text-white" 
                    : "text-black/60 hover:text-black/80"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("malay")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === "malay" 
                    ? "bg-brand text-white" 
                    : "text-black/60 hover:text-black/80"
                }`}
              >
                Bahasa Melayu
              </button>
            </div>
          </div>
        )}
      </div>

             {/* Filters */}
       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
         {dataSource === "local" ? (
           <>
             <select 
               value={localCollection} 
               onChange={(e) => setLocalCollection(e.target.value)}
               className="rounded-lg border border-black/20 px-3 py-2 text-sm"
             >
               <option value="">All Collections</option>
               {LOCAL_COLLECTIONS.map((c) => (
                 <option key={c.value} value={c.value}>{c.label}</option>
               ))}
             </select>
             
             <select 
               value={category} 
               onChange={(e) => setCategory(e.target.value)}
               className="rounded-lg border border-black/20 px-3 py-2 text-sm"
             >
               <option value="">All Categories</option>
               {CATEGORIES.map((cat) => (
                 <option key={cat} value={cat}>{cat}</option>
               ))}
             </select>
             
             <select 
               value={grading} 
               onChange={(e) => setGrading(e.target.value)}
               className="rounded-lg border border-black/20 px-3 py-2 text-sm"
             >
               <option value="">All Gradings</option>
               {GRADINGS.map((g) => (
                 <option key={g} value={g}>{g}</option>
               ))}
             </select>
             
             <select 
               value={narrator} 
               onChange={(e) => setNarrator(e.target.value)}
               className="rounded-lg border border-black/20 px-3 py-2 text-sm"
             >
               <option value="">All Narrators</option>
               {NARRATORS.map((n) => (
                 <option key={n} value={n}>{n}</option>
               ))}
             </select>
           </>
         ) : (
           <select 
             value={book} 
             onChange={(e) => setBook(e.target.value)} 
             className="rounded-lg border border-black/20 px-3 py-2 text-sm"
           >
             {BOOKS.map((b) => (
               <option key={b.value} value={b.value}>{b.label}</option>
             ))}
           </select>
         )}
         
         <input 
           type="number" 
           min={10} 
           max={100} 
           step={10} 
           value={paginate} 
           onChange={(e) => setPaginate(Number(e.target.value))} 
           className="rounded-lg border border-black/20 px-3 py-2 text-sm" 
           placeholder="Per page" 
         />
         
         <input
           value={q}
           onChange={(e) => setQ(e.target.value)}
           placeholder="Search hadiths..."
           className="rounded-lg border border-black/20 px-3 py-2 text-sm"
         />
       </div>

      {loading && <p className="mt-4 text-sm text-black/60">Loading hadiths...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

             {/* Results */}
       <div className="mt-6 space-y-4">
         {dataSource === "local" ? (
            localHadiths.map((hadith) => (
              <HadithCard
                key={hadith.id}
                hadith={hadith}
                language={language}
                showMalay={language === "english"}
                onBookmark={(hadithId) => {
                  console.log("Bookmark:", hadithId);
                  // Add bookmark functionality here
                }}
              />
            ))
         ) : (
           results.map((h) => (
             <div key={h.key} className="rounded-lg border border-black/10 p-6 bg-white shadow-sm">
               <div className="flex items-start justify-between gap-4">
                 <div className="flex-1">
                   <div className="text-right mb-3">
                     <p className="text-xl leading-relaxed font-arabic">{h.arabic}</p>
                   </div>
                   <p className="text-sm text-black/70 leading-relaxed">{h.translation}</p>
                   
                   <div className="mt-3 flex flex-wrap gap-2">
                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                       {h.source}
                     </span>
                     {h.narrator && (
                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         {h.narrator}
                       </span>
                     )}
                     {h.grading && (
                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                         {h.grading}
                       </span>
                     )}
                     {h.category && (
                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                         {h.category}
                       </span>
                     )}
                   </div>
                   
                   {h.keywords && h.keywords.length > 0 && (
                     <div className="mt-2 flex flex-wrap gap-1">
                       {h.keywords.map((keyword, idx) => (
                         <span key={idx} className="text-xs text-black/50 bg-black/5 px-2 py-1 rounded">
                           {keyword}
                         </span>
                       ))}
                     </div>
                   )}
                 </div>
                 
                 <div className="flex flex-col gap-2 items-end">
                   <span className="text-sm text-black/40">#{h.number}</span>
                   <button 
                     onClick={() => {
                       // Add bookmark functionality
                       console.log("Bookmark:", h.key);
                     }}
                     className="text-sm text-brand hover:text-brand/80 transition-colors"
                   >
                     Bookmark
                   </button>
                 </div>
               </div>
             </div>
           ))
         )}
       </div>

      {/* Pagination */}
      {total > paginate && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-black/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-black/60">
            Page {page} of {Math.ceil(total / paginate)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(total / paginate)}
            className="px-4 py-2 rounded-lg border border-black/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5"
          >
            Next
          </button>
        </div>
      )}

      {results.length === 0 && !loading && (
        <div className="mt-8 text-center text-black/60">
          <p>No hadiths found. Try adjusting your search criteria.</p>
        </div>
      )}
    </section>
  );
}


