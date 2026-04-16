"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, PenLine, Sparkles } from "lucide-react";
import { WritingVstepPart } from "@/components/vstep/WritingVstepPart";
import { useGlobalState } from "@/store/GlobalStateContext";
import { VOCAB_CHUNKS, GRAMMAR_PATTERNS } from "@/data/grammar-chunks";

// AI Dynamic Generation replaces static prompts

export default function WritingPracticePage() {
  const [isFinished, setIsFinished] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [corrections, setCorrections] = useState<any[]>([]);
  const [type, setType] = useState<"informal" | "formal" | "essay">("informal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestedChunks, setSuggestedChunks] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestedGrammar, setSuggestedGrammar] = useState<any[]>([]);
  const [selectedPart, setSelectedPart] = useState<1 | 2 | null>(null);

  const { updateWritingScore } = useGlobalState();

  const startWritingSession = async (part: 1 | 2) => {
    setSelectedPart(part);
    setIsGenerating(true);

    try {
      const res = await fetch(`/api/generate-writing-topics?part=${part}`);
      if (!res.ok) throw new Error("Failed to fetch writing task");
      const data = await res.json();

      if (data && data.prompt && data.type) {
        setPrompt(data.prompt);
        setType(data.type);
      } else {
        throw new Error("Invalid structure returned");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      if (part === 1) {
        setPrompt(
          "You are planning a weekend trip and want to invite a friend. Write an email to them suggesting a destination and activities.",
        );
        setType("informal");
      } else {
        setPrompt(
          "Some people think that technology has made our lives too complex, while others believe it has simplified everything. Discuss both views and give your opinion.",
        );
        setType("essay");
      }
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shuffle = (array: any[]) =>
        [...array].sort(() => Math.random() - 0.5);
      setSuggestedChunks(shuffle(VOCAB_CHUNKS).slice(0, 4));
      setSuggestedGrammar(shuffle(GRAMMAR_PATTERNS).slice(0, 2));
      setIsGenerating(false);
    }
  };

  const submitToAPI = async (essay: string) => {
    setIsFinished(true);
    setIsScoring(true);

    try {
      const [analysisRes, improvementRes] = await Promise.all([
        fetch("/api/writing-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, transcript: essay }),
        }),
        fetch("/api/writing-improvement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ essay, prompt }),
        }).catch(() => ({ json: async () => ({ corrections: [] }) })),
      ]);

      const data = await analysisRes.json();
      const improvementData = await improvementRes.json();
      if (data.status === "fallback") {
        setResults({
          score: null,
          genericFeedback: "AI unavailable for scoring.",
          detailedFeedback: "",
        });
      } else {
        setResults(data);
        if (data.score) updateWritingScore(data.score, 1);
      }
      setCorrections(improvementData.corrections || []);
    } catch (e) {
      console.error("Scoring failed", e);
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-[#8B5CF6] font-black text-lg">
            <PenLine className="w-5 h-5" />{" "}
            {selectedPart ? `Writing Task ${selectedPart}` : "Writing Practice"}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col h-full">
        {!selectedPart && !isGenerating && !isFinished && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 mt-[-40px]">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 text-center">
              Ready to Write?
            </h2>
            <p className="text-gray-500 max-w-lg text-center mb-10 text-lg">
              Choose the writing task you want to practice. The AI Examiner will
              generate a unique, randomized topic based on official VSTEP
              formats.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              <button
                onClick={() => startWritingSession(1)}
                className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(139,92,246,0.15)] hover:border-[#8B5CF6]/30 transition-all duration-300 hover:-translate-y-2 flex flex-col items-start gap-4 text-left group"
              >
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-black text-xl">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800 mb-2">
                    Task 1: Letter
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Write a 120-word letter (informal, semi-formal, or formal)
                    based on a realistic scenario.
                  </p>
                </div>
              </button>

              <button
                onClick={() => startWritingSession(2)}
                className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(168,85,247,0.15)] hover:border-[#A855F7]/30 transition-all duration-300 hover:-translate-y-2 flex flex-col items-start gap-4 text-left group"
              >
                <div className="w-14 h-14 bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-black text-xl">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800 mb-2">
                    Task 2: Essay
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Write a 250-word essay discussing an issue, giving your
                    opinion, or providing solutions.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 mt-[-40px]">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-[#8B5CF6] rounded-full animate-spin mb-6"></div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">
              Crafting Writing Task...
            </h2>
            <p className="text-gray-500 max-w-md text-center">
              The AI Examiner is creating a unique, randomized scenario
              specifically for your session.
            </p>
          </div>
        )}

        {!isFinished && selectedPart && prompt && !isGenerating && (
          <div className="flex flex-col lg:flex-row gap-6 flex-1 mt-4 animate-in slide-in-from-right-8 h-full">
            <div className="flex-1 w-full max-w-5xl mx-auto">
              <WritingVstepPart
                type={type}
                prompt={prompt}
                onComplete={submitToAPI}
              />
            </div>
          </div>
        )}

        {isFinished && isScoring && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">
              AI Tutor is Reviewing...
            </h2>
            <p className="text-slate-500 max-w-md text-center">
              The system is correcting your grammar, vocabulary, and structural
              layout.
            </p>
          </div>
        )}

        {isFinished && !isScoring && results && (
          <div className="animate-in slide-in-from-bottom-8 mt-12 space-y-6">
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                <h2 className="text-2xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">
                  Writing Performance
                </h2>
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-6xl font-black text-[#8B5CF6]">
                    {results.writingScore}
                  </div>
                  <div className="text-xl text-gray-500 font-bold mt-4">
                    / 10
                  </div>
                </div>

                <div className="text-gray-600 font-medium whitespace-pre-wrap leading-relaxed text-lg bg-purple-50/50 p-6 rounded-[16px] italic mb-8 border border-purple-100">
                  &quot;{results.writingFeedback}&quot;
                </div>

                {corrections && corrections.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Sentence Improvements
                    </h3>
                    {corrections.map((corr, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-5 rounded-[16px] border border-gray-100"
                      >
                        <div className="text-red-400 line-through mb-2 font-medium">
                          {corr.original}
                        </div>
                        <div className="text-green-600 font-bold mb-3">
                          {corr.improved}
                        </div>
                        <div className="text-gray-600 text-sm bg-white border border-gray-100 p-3 rounded-[14px] italic shadow-sm">
                          {corr.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="xl:w-80 flex-shrink-0 flex flex-col gap-4">
                <div className="bg-purple-50 p-5 rounded-[20px] border border-purple-100 shadow-sm h-fit">
                  <h3 className="text-sm font-black text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Try to use
                  </h3>
                  <div className="space-y-3">
                    {suggestedChunks.map((chunk, i) => (
                      <div
                        key={i}
                        className="bg-white p-3 rounded-[12px] border border-gray-100 shadow-sm"
                      >
                        <div className="text-sm font-bold text-gray-800">
                          {chunk.phrase}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {chunk.meaning_vi}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-50 p-5 rounded-[20px] border border-indigo-100 shadow-sm h-fit">
                  <h3 className="text-sm font-black text-indigo-600 uppercase tracking-wider mb-4">
                    Grammar Challenge
                  </h3>
                  <div className="space-y-3">
                    {suggestedGrammar.map((g, i) => (
                      <div
                        key={i}
                        className="bg-white p-3 rounded-[12px] border border-gray-100 shadow-sm"
                      >
                        <div className="text-xs font-mono text-indigo-600 font-bold mb-1">
                          {g.pattern}
                        </div>
                        <div className="text-xs text-gray-500 italic">
                          &quot;{g.example}&quot;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm text-gray-700 font-bold rounded-[14px] transition-all duration-200 hover:-translate-y-1"
              >
                Try Another Task
              </button>
              <Link
                href="/"
                className="flex-1 py-5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:shadow-[0_10px_25px_rgba(139,92,246,0.3)] text-white font-bold rounded-[14px] transition-all duration-200 hover:-translate-y-1 text-center inline-block"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
