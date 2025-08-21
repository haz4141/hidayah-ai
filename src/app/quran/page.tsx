"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ChapterInfo = { number: number; name: string; englishName: string };

export default function QuranPage() {
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((d) => {
        const list: unknown = d?.data;
        const array = Array.isArray(list) ? list : [];
        setChapters(
          array.map((s: Record<string, unknown>) => ({
            number: Number(s.number as number),
            name: String(s.name as string),
            englishName: String(s.englishName as string),
          }))
        );
      });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Qur&apos;an Reader</h1>
      <p className="text-black/70 mt-1">Uthmani script, translation, audio, bookmarks.</p>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {chapters.map((c) => (
          <li key={c.number} className="rounded border border-black/10 p-4 flex items-center justify-between">
            <div>
              <p className="text-xl">{c.name}</p>
              <p className="text-xs text-black/60">{c.englishName}</p>
            </div>
            <Link href={`/quran/${c.number}`} className="text-brand text-sm">Open</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}


