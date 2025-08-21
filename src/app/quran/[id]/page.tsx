import ClientSurah from "./ClientSurah";

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

export default function SurahPage({ params }: { params: { id: string } }) {
  const chapterId = Number(params.id);
  if (!(chapterId >= 1 && chapterId <= 114)) {
    return <div className="mx-auto max-w-6xl px-4 py-8">Not found.</div>;
  }
  return <ClientSurah chapterId={chapterId} />;
}


