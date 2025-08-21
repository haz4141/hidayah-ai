export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center gap-4">
        <img src="/hidayah-logo.svg" alt="Hidayah AI" className="h-12 w-12" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hidayah AI</h1>
          <p className="text-black/70">Learn, Recite, and Discover with Guidance from AI</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard title="Qur'an Reader" href="/quran" emoji="📖" desc="Uthmani script, tafsir, translations, audio, bookmarks" />
        <FeatureCard title="Hadith Insights" href="/hadith" emoji="📜" desc="Search, source verification, AI summaries" />
        <FeatureCard title="AI Chatbot" href="/chat" emoji="🤖" desc="Ask Islamic questions; includes disclaimers" />
        <FeatureCard title="Recitation Feedback" href="/recite" emoji="🎙️" desc="AI listens and corrects tajweed & pronunciation" />
        <FeatureCard title="Profile" href="/profile" emoji="👤" desc="History, streaks, bookmarks, progress" />
      </div>
    </section>
  );
}

function FeatureCard({ title, href, emoji, desc }: { title: string; href: string; emoji: string; desc: string }) {
  return (
    <a href={href} className="group rounded-lg border border-black/10 p-5 hover:shadow-sm transition">
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-semibold group-hover:text-brand">{title}</h3>
      </div>
      <p className="mt-1 text-sm text-black/70">{desc}</p>
    </a>
  );
}
