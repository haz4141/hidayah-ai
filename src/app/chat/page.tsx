"use client";

import { useRef, useState } from "react";
import quran from "@/data/quran.json";
import hadith from "@/data/hadith.json";
import { appendToList } from "@/lib/storage";

type Message = { id: string; role: "user" | "assistant"; content: string };

function searchCorpus(query: string) {
  const t = query.toLowerCase();
  const ayat = quran.chapters
    .flatMap((c) => c.verses.map((v) => ({ c, v })))
    .filter(({ c, v }) => c.englishName.toLowerCase().includes(t) || v.text.includes(query) || v.translation.toLowerCase().includes(t))
    .slice(0, 3)
    .map(({ c, v }) => `Qur'an ${c.englishName} ${v.num}: ${v.translation}`);

  const ahadith = hadith.hadiths
    .filter((h) => h.arabic.includes(query) || h.translation.toLowerCase().includes(t))
    .slice(0, 3)
    .map((h) => `Hadith (${h.collection}): ${h.translation} [${h.grading}]`);

  return { ayat, ahadith };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  function send() {
    const q = input.trim();
    if (!q) return;
    const id = crypto.randomUUID();
    const userMsg: Message = { id, role: "user", content: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const { ayat, ahadith } = searchCorpus(q);
    const citations = [...ayat, ...ahadith];
    const answer = citations.length
      ? `Here are relevant references:\n- ${citations.join("\n- ")}`
      : "I could not find a direct reference in the local dataset. Please consult a scholar.";
    const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: answer };
    setMessages((m) => [...m, aiMsg]);
    appendToList("hidayah_history", { type: "chat", q, ts: Date.now() });
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">AI Chatbot</h1>
      <p className="text-black/70 mt-1">AI may be imperfect. Verify with scholars.</p>
      <div ref={listRef} className="mt-6 h-[50vh] overflow-y-auto rounded border border-black/10 p-4 space-y-3 bg-white">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className={"inline-block rounded px-3 py-2 " + (m.role === "user" ? "bg-brand text-white" : "bg-black/5")}>
              <pre className="whitespace-pre-wrap font-sans text-sm">{m.content}</pre>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-black/60">Ask about prayer, fasting, or search by keyword (e.g., &quot;mercy&quot;).</p>}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input className="flex-1 rounded border border-black/20 px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question" />
        <button onClick={send} className="bg-brand text-white rounded px-4 py-2">Send</button>
      </div>
    </section>
  );
}


