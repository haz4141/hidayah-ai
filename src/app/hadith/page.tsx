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
  { value: "bukhari", label: "Bukhari" },
  { value: "muslim", label: "Muslim" },
  { value: "tirmidzi", label: "Tirmidhi" },
  { value: "nasai", label: "Nasa'i" },
  { value: "abudawud", label: "Abu Dawud" },
  { value: "ibnumajah", label: "Ibn Majah" },
  { value: "ahmad", label: "Ahmad" },
];

export default function HadithPage() {
  const [book, setBook] = useState<string>(BOOKS[0].value);
  const [range, setRange] = useState<string>("1-50");
  const [q, setQ] = useState<string>("");
  const [items, setItems] = useState<NormalizedHadith[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/hadith?book=${encodeURIComponent(book)}&range=${encodeURIComponent(range)}`);
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
      } catch {
        setError("Failed to load hadith. Try again later.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [book, range]);

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
        <input value={range} onChange={(e) => setRange(e.target.value)} className="rounded border border-black/20 px-3 py-2" placeholder="Range e.g. 1-50" />
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
    </section>
  );
}


