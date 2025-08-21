"use client";

import data from "@/data/hadith.json";
import { useMemo, useState } from "react";

export default function HadithPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data.items;
    return data.items.filter(
      (h) =>
        h.text.toLowerCase().includes(t) ||
        h.translation.toLowerCase().includes(t) ||
        h.source.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Hadith Insights</h1>
      <p className="text-black/70 mt-1">Search sample hadith and view grading/source.</p>
      <div className="mt-6 flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search hadith (Arabic or English)"
          className="w-full rounded border border-black/20 px-3 py-2"
        />
      </div>
      <ul className="mt-6 space-y-3">
        {results.map((h) => (
          <li key={h.id} className="rounded border border-black/10 p-4">
            <p className="text-xl">{h.text}</p>
            <p className="text-sm text-black/70 mt-1">{h.translation}</p>
            <div className="text-xs text-black/60 mt-2 flex items-center gap-3">
              <span>{h.source}</span>
              <span className="px-2 py-0.5 rounded bg-black/5">{h.grading}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}


