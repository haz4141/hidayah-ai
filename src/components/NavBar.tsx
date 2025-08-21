"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <header className="border-b border-black/10 bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/hidayah-logo.svg" alt="Hidayah AI" className="h-7 w-7" />
          <span className="font-semibold tracking-tight">Hidayah AI</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link className="hover:text-brand" href="/quran">Qur&apos;an</Link>
          <Link className="hover:text-brand" href="/hadith">Hadith</Link>
          <Link className="hover:text-brand" href="/chat">AI Chatbot</Link>
          <Link className="hover:text-brand" href="/recite">Recite</Link>
          <Link className="hover:text-brand" href="/profile">Profile</Link>
        </nav>
      </div>
    </header>
  );
}


