"use client";

import { appendToList, safeGet, safeSet } from "@/lib/storage";
import { useState } from "react";

type Chapter = {
  id: number;
  name: string;
  englishName: string;
  verses: { num: number; text: string; translation: string }[];
};

export default function ClientSurah({ chapter }: { chapter: Chapter }) {
  const [bookmarks, setBookmarks] = useState<number[]>(
    safeGet<number[]>(`bk_${chapter.id}`, [])
  );

  function toggleBookmark(ayahNum: number) {
    setBookmarks((prev) => {
      const has = prev.includes(ayahNum);
      const next = has ? prev.filter((n) => n !== ayahNum) : [...prev, ayahNum];
      safeSet(`bk_${chapter.id}`, next);
      appendToList("hidayah_history", {
        type: "bookmark",
        chapterId: chapter.id,
        ayahNum,
        ts: Date.now(),
      });
      return next;
    });
  }

  function playAudio(ayahNum: number) {
    const verse = chapter.verses.find((v) => v.num === ayahNum);
    if (!verse) return;
    const utter = new SpeechSynthesisUtterance(verse.translation);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">
        {chapter.name} <span className="text-black/60 text-base">({chapter.englishName})</span>
      </h1>
      <div className="mt-6 space-y-3">
        {chapter.verses.map((v) => (
          <div key={v.num} className="rounded border border-black/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-right flex-1">
                <p className="text-2xl leading-relaxed">{v.text}</p>
                <p className="text-sm text-black/70 mt-1">{v.translation}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button className="text-sm text-brand" onClick={() => playAudio(v.num)}>Play</button>
                <button className="text-sm" onClick={() => toggleBookmark(v.num)}>
                  {bookmarks.includes(v.num) ? "Remove bookmark" : "Bookmark"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


