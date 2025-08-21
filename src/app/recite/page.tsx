"use client";

import { useEffect, useRef, useState } from "react";

type RecognitionResultItem = { transcript: string };
type RecognitionAlternative = { 0: RecognitionResultItem };
type RecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<RecognitionAlternative>;
};

type RecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => RecognitionInstance;

type PartialWindowWithSpeech = Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor; SpeechRecognition?: SpeechRecognitionConstructor };

export default function RecitePage() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<RecognitionInstance | null>(null);

  useEffect(() => {
    const w = window as PartialWindowWithSpeech;
    const SR: SpeechRecognitionConstructor | undefined = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec = new SR();
    rec.lang = "ar-SA";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e: RecognitionEvent) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, []);

  function start() {
    if (!recRef.current) return;
    setTranscript("");
    setListening(true);
    recRef.current.start();
  }

  function stop() {
    if (!recRef.current) return;
    recRef.current.stop();
  }

  // Very basic feedback: length and presence of certain Arabic letters
  const feedback = transcript
    ? `Heard ${transcript.length} characters. Contains ق? ${/ق/.test(transcript) ? "yes" : "no"}, ض? ${/ض/.test(transcript) ? "yes" : "no"}.`
    : "";

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Recitation Feedback</h1>
      <p className="text-black/70 mt-1">Enable mic and recite in Arabic. Experimental.</p>
      {!supported && (
        <p className="mt-4 text-sm text-red-600">Speech recognition is not supported in this browser. Try Chrome.</p>
      )}
      <div className="mt-6 rounded border border-black/10 p-4 bg-white">
        <div className="flex items-center gap-2">
          <button disabled={!supported || listening} onClick={start} className="bg-brand disabled:opacity-50 text-white rounded px-4 py-2">Start</button>
          <button disabled={!supported || !listening} onClick={stop} className="rounded border border-black/20 px-4 py-2">Stop</button>
        </div>
        <div className="mt-4">
          <p className="text-xs text-black/60">Transcript (live):</p>
          <div className="rounded border border-black/10 p-3 min-h-16">{transcript || <span className="text-black/40">…</span>}</div>
        </div>
        {feedback && (
          <div className="mt-3 text-sm">
            <span className="font-medium">Feedback:</span> {feedback}
          </div>
        )}
      </div>
    </section>
  );
}


