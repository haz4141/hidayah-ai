"use client";

import { useEffect, useMemo, useState } from "react";
import HadithCard from "@/components/HadithCard";
import { getMalayCollections, getMalayCategories } from "@/lib/hadith";

type LocalHadith = {
  id: string;
  collection: string;
  book: number;
  hadith: number;
  arabic: string;
  translation: string;
  malay?: string;
  narrator: string;
  grading: string;
  category: string;
  keywords: string[];
};

const COLLECTIONS = getMalayCollections();
const CATEGORIES = getMalayCategories();

export default function MalayHadithPage() {
  const [collection, setCollection] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [grading, setGrading] = useState<string>("");
  const [narrator, setNarrator] = useState<string>("");
  const [paginate, setPaginate] = useState<number>(20);
  const [q, setQ] = useState<string>("");
  const [items, setItems] = useState<LocalHadith[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const searchParams = new URLSearchParams({ 
          limit: String(paginate),
          page: String(page)
        });
        if (collection) searchParams.set("collection", collection);
        if (category) searchParams.set("category", category);
        if (grading) searchParams.set("grading", grading);
        if (narrator) searchParams.set("narrator", narrator);
        if (q.trim()) searchParams.set("search", q.trim());
        
        const res = await fetch(`/api/hadith/malay?${searchParams.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          const hadiths: LocalHadith[] = data.data.hadiths;
          setItems(hadiths);
          setTotal(data.data.total);
        }
      } catch {
        setError("Gagal memuatkan hadith. Cuba lagi kemudian.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [collection, category, grading, narrator, paginate, q, page]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (h) => 
        h.translation.toLowerCase().includes(t) || 
        h.arabic.includes(q) ||
        (h.malay && h.malay.toLowerCase().includes(t))
    );
  }, [q, items]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-brand">Hadith Bahasa Melayu</h1>
        <p className="text-black/70 mt-2">Jelajahi koleksi hadith dengan terjemahan Bahasa Melayu</p>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <select 
          value={collection} 
          onChange={(e) => setCollection(e.target.value)}
          className="rounded-lg border border-black/20 px-3 py-2 text-sm"
        >
          <option value="">Semua Koleksi</option>
          {COLLECTIONS.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
        
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-black/20 px-3 py-2 text-sm"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select 
          value={grading} 
          onChange={(e) => setGrading(e.target.value)}
          className="rounded-lg border border-black/20 px-3 py-2 text-sm"
        >
          <option value="">Semua Penarafan</option>
          <option value="Sahih">Sahih</option>
          <option value="Hasan">Hasan</option>
          <option value="Da'if">Da'if</option>
        </select>
        
        <input 
          type="number" 
          min={10} 
          max={100} 
          step={10} 
          value={paginate} 
          onChange={(e) => setPaginate(Number(e.target.value))} 
          className="rounded-lg border border-black/20 px-3 py-2 text-sm" 
          placeholder="Bilangan per halaman" 
        />
        
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari hadith..."
          className="rounded-lg border border-black/20 px-3 py-2 text-sm"
        />
      </div>

      {loading && <p className="mt-4 text-sm text-black/60">Memuatkan hadith...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Results */}
      <div className="mt-6 space-y-4">
        {results.map((hadith) => (
          <HadithCard
            key={hadith.id}
            hadith={hadith}
            language="malay"
            showMetadata={true}
            onBookmark={(hadithId) => {
              console.log("Bookmark:", hadithId);
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {total > paginate && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-black/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5"
          >
            Sebelumnya
          </button>
          <span className="px-4 py-2 text-sm text-black/60">
            Halaman {page} dari {Math.ceil(total / paginate)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(total / paginate)}
            className="px-4 py-2 rounded-lg border border-black/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5"
          >
            Seterusnya
          </button>
        </div>
      )}

      {results.length === 0 && !loading && (
        <div className="mt-8 text-center text-black/60">
          <p>Tiada hadith dijumpai. Cuba sesuaikan kriteria carian anda.</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Maklumat Hadith Bahasa Melayu</h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li>• <strong>Terjemahan Asli:</strong> Semua terjemahan Bahasa Melayu telah disemak dan disahkan</li>
          <li>• <strong>Koleksi Sahih:</strong> Hadith dari koleksi yang dipercayai dan diiktiraf</li>
          <li>• <strong>Kategori Teratur:</strong> Hadith dikategorikan mengikut topik dan tema</li>
          <li>• <strong>Metadata Lengkap:</strong> Maklumat perawi, penarafan, dan sumber tersedia</li>
          <li>• <strong>Selalu Rujuk Ulama:</strong> Untuk perkara penting agama, sentiasa rujuk kepada ulama</li>
        </ul>
      </div>
    </section>
  );
}
