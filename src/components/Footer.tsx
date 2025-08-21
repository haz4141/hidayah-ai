export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-12">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-black/70 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Hidayah AI</p>
        <p className="italic">Guidance: Always consult qualified scholars. AI may be imperfect.</p>
      </div>
    </footer>
  );
}


