"use client";

import { useEffect, useMemo, useState } from "react";

type NormalizedHadith = {
  key: string;
  arabic: string;
  translation: string;
  number: number;
  source: string;
};

const BOOKS = [
  { value: "sahih-bukhari", label: "Sahih Bukhari" },
  { value: "sahih-muslim", label: "Sahih Muslim" },
  { value: "jami-at-tirmidhi", label: "Jami' at-Tirmidhi" },
  { value: "sunan-an-nasai", label: "Sunan an-Nasa'i" },
  { value: "sunan-abu-dawood", label: "Sunan Abu Dawud" },
  { value: "sunan-ibn-e-majah", label: "Sunan Ibn Majah" },
];

export default function HadithPage() {
  const [book, setBook] = useState<string>(BOOKS[0].value);
  const [paginate, setPaginate] = useState<number>(50);
  const [q, setQ] = useState<string>("");
  const [items, setItems] = useState<NormalizedHadith[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
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
      } catch {
        setError("Failed to load hadith. Try again later.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [book, paginate, q, page]);

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
      <p className="text-black/70 mt-1">Browse from public API (client-side). Verify with scholars.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
        <select value={book} onChange={(e) => setBook(e.target.value)} className="rounded border border-black/20 px-3 py-2">
          {BOOKS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <input type="number" min={10} max={200} step={10} value={paginate} onChange={(e) => setPaginate(Number(e.target.value))} className="rounded border border-black/20 px-3 py-2" placeholder="Per page" />
        <div className="md:col-span-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (Arabic or translation)"
            className="w-full rounded border border-black/20 px-3 py-2"
          />
        </div>
      </div>

      {loading && <p className="mt-4 text-sm">Loading…</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 space-y-3">
        {results.map((h) => (
          <li key={h.key} className="rounded border border-black/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xl text-right">{h.arabic}</p>
                <p className="text-sm text-black/70 mt-1">{h.translation}</p>
              </div>
              <div className="text-xs text-black/60 text-right min-w-20">
                <div>{h.source}</div>
                <div>No. {h.number}</div>
              </div>
            </div>
          </li>
        ))}
        {!loading && results.length === 0 && (
          <li className="text-sm text-black/60">No results in this range.</li>
        )}
      </ul>

      <div className="mt-4 flex items-center gap-3">
        <button disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded border border-black/20 px-3 py-2 disabled:opacity-50">Prev</button>
        <span className="text-sm text-black/60">Page {page}</span>
        <button disabled={loading || items.length < paginate} onClick={() => setPage((p) => p + 1)} className="rounded border border-black/20 px-3 py-2 disabled:opacity-50">Next</button>
      </div>
    </section>
  );
}


