"use client";

import { useState } from "react";
import { CheckCircle, PenLine } from "lucide-react";

interface Props {
  type: "informal" | "formal" | "essay";
  prompt: string;
  onComplete: (essay: string) => void;
}

export function WritingVstepPart({ type, prompt, onComplete }: Props) {
  const [essay, setEssay] = useState("");
  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  const targetWords = type === "informal" ? 120 : 250;
  const isEnough = wordCount >= targetWords;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[20px] border border-gray-100 flex flex-col h-full min-h-[60vh] shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
      <div className="bg-gray-50 p-6 rounded-[16px] border border-gray-100 mb-6 shadow-inner">
        <div className="text-[#8B5CF6] font-black text-sm tracking-wider uppercase mb-2">
          {type === "essay"
            ? "Writing Task 2 • Essay"
            : `Writing Task 1 • ${type === "formal" ? "Formal Letter" : "Informal Letter"}`}
        </div>
        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-bold">
          {prompt}
        </p>
      </div>

      <div className="flex-1 flex flex-col relative">
        <textarea
          className="flex-1 w-full bg-white border-2 border-gray-100 rounded-[16px] p-5 text-gray-700 focus:outline-none focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/10 resize-none font-medium text-lg leading-relaxed transition-all"
          placeholder="Start typing your letter here..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
        />
        <div
          className={`absolute bottom-4 right-4 text-sm font-bold px-3 py-1 rounded-full ${
            isEnough
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {wordCount} / {targetWords} words
        </div>
      </div>

      <button
        onClick={() => onComplete(essay)}
        disabled={wordCount < 10}
        className="w-full py-5 mt-6 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold text-lg rounded-[16px] hover:shadow-[0_10px_25px_rgba(139,92,246,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:translate-y-0 disabled:shadow-none shadow-md"
      >
        <CheckCircle className="w-6 h-6" /> Submit Writing
      </button>
    </div>
  );
}
