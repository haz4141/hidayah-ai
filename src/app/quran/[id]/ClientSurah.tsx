"use client";

import { appendToList, safeGet, safeSet } from "@/lib/storage";
import { useEffect, useState } from "react";

type Verse = { numberInSurah: number; text: string; translation: string };
type SurahData = { id: number; name: string; englishName: string; verses: Verse[] };

export default function ClientSurah({ chapterId }: { chapterId: number }) {
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>(safeGet<number[]>(`bk_${chapterId}`, []));

  useEffect(() => {
    async function load() {
      // AlQuran Cloud: Arabic Uthmani + Sahih Intl translation
      const [ar, en] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${chapterId}`).then((r) => r.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/en.sahih`).then((r) => r.json()),
      ]);
      const name = ar.data.englishName;
      const arabicName = ar.data.name;
      const ayahs: unknown = ar?.data?.ayahs;
      const ayahsEn: unknown = en?.data?.ayahs;
      const arrAr = Array.isArray(ayahs) ? ayahs : [];
      const arrEn = Array.isArray(ayahsEn) ? ayahsEn : [];
      const verses: Verse[] = arrAr.map((a: Record<string, unknown>, i: number) => ({
        numberInSurah: Number(a.numberInSurah as number),
        text: String(a.text as string),
        translation: String((arrEn[i] as Record<string, unknown> | undefined)?.text ?? ""),
      }));
      setSurah({ id: chapterId, name: arabicName, englishName: name, verses });
    }
    load();
  }, [chapterId]);

  function toggleBookmark(ayahNum: number) {
    setBookmarks((prev) => {
      const has = prev.includes(ayahNum);
      const next = has ? prev.filter((n) => n !== ayahNum) : [...prev, ayahNum];
      safeSet(`bk_${chapterId}`, next);
      appendToList("hidayah_history", {
        type: "bookmark",
        chapterId,
        ayahNum,
        ts: Date.now(),
      });
      return next;
    });
  }

  function playAudio(ayahNum: number) {
    const verse = surah?.verses.find((v) => v.numberInSurah === ayahNum);
    if (!verse) return;
    const utter = new SpeechSynthesisUtterance(verse.translation);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">
        {surah?.name || "…"} <span className="text-black/60 text-base">({surah?.englishName || ""})</span>
      </h1>
      <div className="mt-6 space-y-3">
        {surah?.verses.map((v) => (
          <div key={v.numberInSurah} className="rounded border border-black/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-right flex-1">
                <p className="text-2xl leading-relaxed">{v.text}</p>
                <p className="text-sm text-black/70 mt-1">{v.translation}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button className="text-sm text-brand" onClick={() => playAudio(v.numberInSurah)}>Play</button>
                <button className="text-sm" onClick={() => toggleBookmark(v.numberInSurah)}>
                  {bookmarks.includes(v.numberInSurah) ? "Remove bookmark" : "Bookmark"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


