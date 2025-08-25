"use client";

import { appendToList, safeGet, safeSet } from "@/lib/storage";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";

type Verse = { numberInSurah: number; text: string; translation: string };
type SurahData = { id: number; name: string; englishName: string; verses: Verse[] };

const RECITERS = [
  { id: "mishari", name: "Mishari Rashid Alafasy", url: "https://server8.mp3quran.net/afs" },
  { id: "sudais", name: "Abdul Rahman Al-Sudais", url: "https://server8.mp3quran.net/sds" },
  { id: "ghamdi", name: "Saad Al-Ghamdi", url: "https://server8.mp3quran.net/s_gmd" },
  { id: "minshawi", name: "Muhammad Siddiq Al-Minshawi", url: "https://server8.mp3quran.net/minsh" },
];

export default function ClientSurah({ chapterId }: { chapterId: number }) {
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>(safeGet<number[]>(`bk_${chapterId}`, []));
  const [selectedReciter, setSelectedReciter] = useState<string>(RECITERS[0].id);
  const [audioError, setAudioError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
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
      } catch (error) {
        console.error("Failed to load surah:", error);
      }
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

  function getAudioUrl(ayahNum: number) {
    const reciter = RECITERS.find(r => r.id === selectedReciter);
    if (!reciter) return "";
    
    // Use MP3Quran.net format: {base_url}/{surah_number:ayah_number}.mp3
    const surahStr = chapterId.toString().padStart(3, '0');
    const ayahStr = ayahNum.toString().padStart(3, '0');
    return `${reciter.url}/${surahStr}${ayahStr}.mp3`;
  }

  function handleAudioError() {
    setAudioError("Audio not available for this reciter. Try another reciter.");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">
        {surah?.name || "…"} <span className="text-black/60 text-base">({surah?.englishName || ""})</span>
      </h1>
      
      <div className="mt-4 flex items-center gap-4">
        <label className="text-sm text-black/60">Reciter:</label>
        <select 
          value={selectedReciter} 
          onChange={(e) => {
            setSelectedReciter(e.target.value);
            setAudioError("");
          }}
          className="rounded border border-black/20 px-3 py-1 text-sm"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {audioError && (
        <div className="mt-2 text-sm text-red-600">{audioError}</div>
      )}

      <div className="mt-6 space-y-3">
        {surah?.verses.map((v) => (
          <div key={v.numberInSurah} className="rounded border border-black/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-right flex-1">
                <p className="text-2xl leading-relaxed">{v.text}</p>
                <p className="text-sm text-black/70 mt-1">{v.translation}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <AudioPlayer 
                  src={getAudioUrl(v.numberInSurah)}
                  onEnded={() => {}}
                  onError={handleAudioError}
                  className="w-64"
                />
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


