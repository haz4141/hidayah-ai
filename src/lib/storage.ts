"use client";

type JsonValue = unknown;

export function safeGet<T = JsonValue>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback as T;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback as T;
    return JSON.parse(raw) as T;
  } catch {
    return fallback as T;
  }
}

export function safeSet<T = JsonValue>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function appendToList<T = JsonValue>(key: string, item: T, limit = 100): void {
  const list = safeGet<T[]>(key, []);
  list.unshift(item);
  const trimmed = list.slice(0, limit);
  safeSet(key, trimmed);
}

export function updateStreak(key = "hidayah_streak") {
  const today = new Date().toISOString().slice(0, 10);
  const data = safeGet<{ last: string; count: number }>(key, { last: "", count: 0 });
  if (data.last === today) return data.count;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = data.last === yesterday ? data.count + 1 : 1;
  safeSet(key, { last: today, count });
  return count;
}

