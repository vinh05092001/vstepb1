"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SpeakingVstepPart } from "@/components/vstep/SpeakingVstepPart";
import { useGlobalState } from "@/store/GlobalStateContext";

export default function SpeakingPart2Page() {
  const [isFinished, setIsFinished] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [situationData, setSituationData] = useState<{situation: string, options: string[]} | null>(null);
  const { updateSpeakingScore } = useGlobalState();
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
     const generateSituations = async () => {
        try {
           const res = await fetch("/api/generate-exam-topics");
           if (!res.ok) throw new Error("Failed to generate topics");
           const data = await res.json();
           
           if (data && data.part2 && data.part2.situation && data.part2.options) {
               setSituationData(data.part2);
           } else {
               throw new Error("Invalid structure returned");
           }
        } catch (error) {
           console.error("Error fetching AI topics:", error);
           setSituationData({
             situation: "Your family is planning a trip from Danang to Hanoi.",
             options: ["taking the train", "flying by plane", "going by coach"]
           });
        } finally {
           setIsGenerating(false);
        }
     };
     generateSituations();
  }, []);

  const submitToAPI = async (transcript: string) => {
     setIsFinished(true);
     setIsScoring(true);

     const prompt = `Situation: ${situationData?.situation}\nOptions: ${situationData?.options.join(", ")}\nUser Answer: ${transcript}`;

     try {
       const res = await fetch("/api/vstep-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            speaking: { part: "PART_2", prompt: "Evaluate Part 2 answer", transcript: prompt },
            writing: { type: "none", prompt: "ignore", essay: "ignore" }
          })
       });
       const data = await res.json();
       setResults(data);
       if (data.speakingScore) updateSpeakingScore(data.speakingScore, 2);
     } catch(e) {
       console.error("Scoring failed", e);
     } finally {
       setIsScoring(false);
     }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-[#3B82F6] font-black text-lg">
             Speaking Part 2: Solution Discussion
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col h-full">
        {isGenerating && (
           <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 mt-[-40px]">
             <div className="w-16 h-16 border-4 border-blue-100 border-t-[#3B82F6] rounded-full animate-spin mb-6"></div>
             <h2 className="text-3xl font-black text-gray-800 mb-4">Generating Part 2 Topic...</h2>
             <p className="text-gray-500 max-w-md text-center">
               The AI Examiner is creating a unique situation and options for you.
             </p>
           </div>
        )}

        {!isFinished && situationData && !isGenerating && (
           <div className="flex-1 animate-in slide-in-from-right-8 flex flex-col h-full mt-4">
             <SpeakingVstepPart 
                part={2} 
                prompt={`Situation:\n${situationData.situation}\n\nOptions:\n- ${situationData.options.join("\n- ")}`} 
                onComplete={submitToAPI} 
                prepTime={30}
                speakTime={60}
             />
           </div>
        )}

        {isFinished && isScoring && (
           <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95">
             <div className="w-16 h-16 border-4 border-surface-300 border-t-accent-primary rounded-full animate-spin mb-6"></div>
             <h2 className="text-3xl font-black text-foreground mb-4">Examiner is Grading...</h2>
             <p className="text-gray-500 max-w-md text-center">
               The AI is checking your vocabulary choice and structural coherence for Part 2.
             </p>
           </div>
        )}

        {isFinished && !isScoring && results && (
           <div className="animate-in slide-in-from-bottom-8 mt-4 space-y-6">
              <div className="bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                 <h2 className="text-2xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">Part 2 Score & Feedback</h2>
                 <div className="flex items-center gap-2 mb-6">
                   <div className="text-6xl font-black text-[#3B82F6]">{results.speakingScore}</div>
                   <div className="text-xl text-gray-500 font-bold mt-4">/ 10</div>
                 </div>
                 
                 <div className="text-gray-600 font-medium whitespace-pre-wrap leading-relaxed text-lg bg-blue-50/50 p-6 rounded-[16px] italic border border-blue-100">
                   {results.speakingFeedback}
                 </div>
              </div>

              <div className="flex gap-4 mt-8">
                 <button onClick={() => window.location.reload()} className="flex-1 py-5 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm text-gray-700 font-bold rounded-[14px] transition-all duration-200 hover:-translate-y-1">
                    Try Again
                 </button>
                 <Link href="/" className="flex-1 py-5 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:shadow-[0_10px_25px_rgba(59,130,246,0.3)] text-white font-bold rounded-[14px] transition-all duration-200 hover:-translate-y-1 text-center inline-block">
                    Return to Dashboard
                 </Link>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
