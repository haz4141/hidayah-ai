export const metadata = { title: "Profile • Hidayah AI" };

"use client";

import { useEffect, useMemo, useState } from "react";
import { safeGet, updateStreak } from "@/lib/storage";

type HistoryItem = { type: string; ts: number; [k: string]: any };

export default function ProfilePage() {
  const [streak, setStreak] = useState<number>(0);
  const history = useMemo<HistoryItem[]>(() => safeGet("hidayah_history", []), []);
  useEffect(() => {
    setStreak(updateStreak());
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-black/70 mt-1">Local-only: history, streaks, bookmarks.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border border-black/10 p-4">
          <p className="text-sm text-black/60">Streak</p>
          <p className="text-3xl font-semibold">{streak} days</p>
        </div>
        <div className="rounded border border-black/10 p-4 md:col-span-2">
          <p className="text-sm text-black/60">Recent activity</p>
          <ul className="mt-2 space-y-2 max-h-64 overflow-auto">
            {history.length === 0 && <li className="text-sm text-black/50">No recent activity.</li>}
            {history.map((h, i) => (
              <li key={i} className="rounded border border-black/10 p-2 text-sm">
                <span className="uppercase text-xs text-black/50">{h.type}</span>
                <span className="mx-2">•</span>
                <span>{new Date(h.ts).toLocaleString()}</span>
                {h.type === "bookmark" && (
                  <span className="ml-2 text-black/70">Surah {h.chapterId}, Ayah {h.ayahNum}</span>
                )}
                {h.type === "chat" && (
                  <span className="ml-2 text-black/70">Q: {h.q}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


