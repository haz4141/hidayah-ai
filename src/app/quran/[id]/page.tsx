import quran from "@/data/quran.json";
import ClientSurah from "./ClientSurah";

type Chapter = (typeof quran.chapters)[number];

export function generateStaticParams() {
  return quran.chapters.map((c) => ({ id: String(c.id) }));
}

export default function SurahPage({ params }: { params: { id: string } }) {
  const chapterId = Number(params.id);
  const chapter: Chapter | undefined = quran.chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    return <div className="mx-auto max-w-6xl px-4 py-8">Not found.</div>;
  }
  return <ClientSurah chapter={chapter} />;
}


