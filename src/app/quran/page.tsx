export const metadata = { title: "Qur'an Reader • Hidayah AI" };

import quran from "@/data/quran.json";
import Link from "next/link";

export default function QuranPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Qur&apos;an Reader</h1>
      <p className="text-black/70 mt-1">Uthmani script, translation, audio, bookmarks.</p>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {quran.chapters.map((c) => (
          <li key={c.id} className="rounded border border-black/10 p-4 flex items-center justify-between">
            <div>
              <p className="text-xl">{c.name}</p>
              <p className="text-xs text-black/60">{c.englishName}</p>
            </div>
            <Link href={`/quran/${c.id}`} className="text-brand text-sm">Open</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}


