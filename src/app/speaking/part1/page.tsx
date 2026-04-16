"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SpeakingVstepPart } from "@/components/vstep/SpeakingVstepPart";
import { useGlobalState } from "@/store/GlobalStateContext";
import { VOCAB_CHUNKS, GRAMMAR_PATTERNS } from "@/data/grammar-chunks";

// AI Dynamic Generation removes the need for fixed topics

export default function SpeakingPart1Page() {
  const [isFinished, setIsFinished] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const { updateSpeakingScore } = useGlobalState();
  const [isGenerating, setIsGenerating] = useState(true);
  const [suggestedChunks, setSuggestedChunks] = useState<any[]>([]);
  const [suggestedGrammar, setSuggestedGrammar] = useState<any[]>([]);

  useEffect(() => {
    const generateTopics = async () => {
       try {
          const res = await fetch("/api/generate-exam-topics");
          if (!res.ok) throw new Error("Failed to generate topics");
          const data = await res.json();
          
          if (data && data.part1 && data.part1.length >= 2) {
             const sit1 = data.part1[0];
             const sit2 = data.part1[1];
             const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

             const formattedPrompt = `Situation 1: ${capitalize(sit1.topic)}
1. ${sit1.questions[0]}
2. ${sit1.questions[1]}
3. ${sit1.questions[2]}

Situation 2: ${capitalize(sit2.topic)}
4. ${sit2.questions[0]}
5. ${sit2.questions[1]}
6. ${sit2.questions[2]}`;

             setPrompt(formattedPrompt);
          } else {
             throw new Error("Invalid structure returned");
          }
       } catch (error) {
          console.error("Error fetching AI topics:", error);
          // Fallback to emergency static text if AI connection drops
          setPrompt(`Situation 1: Technology\n1. What devices do you use daily?\n2. Are you addicted to your phone?\n3. How will technology change in the future?\n\nSituation 2: Online Shopping\n4. Do you often shop online?\n5. What was the last thing you bought?\n6. Are there any risks to internet shopping?`);
       } finally {
          // Load contextual suggestions based on random topics to challenge user
          const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);
          setSuggestedChunks(shuffle(VOCAB_CHUNKS).slice(0, 4));
          setSuggestedGrammar(shuffle(GRAMMAR_PATTERNS).slice(0, 2));
          setIsGenerating(false);
       }
    };
    
    generateTopics();
  }, []);

  const submitToAPI = async (transcript: string) => {
     setIsFinished(true);
     setIsScoring(true);

     try {
       const res = await fetch("/api/vstep-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            speaking: { part: "PART_1", prompt: prompt, transcript: transcript },
            writing: { type: "none", prompt: "ignore", essay: "ignore" }
          })
       });
       const data = await res.json();
       setResults(data);
       if (data.speakingScore) updateSpeakingScore(data.speakingScore, 1);
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
             Speaking Part 1: Social Interaction
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col h-full">
        {isGenerating && (
           <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 mt-[-40px]">
             <div className="w-16 h-16 border-4 border-blue-100 border-t-[#3B82F6] rounded-full animate-spin mb-6"></div>
             <h2 className="text-3xl font-black text-gray-800 mb-4">Generating Part 1 Topics...</h2>
             <p className="text-gray-500 max-w-md text-center">
               The AI Examiner is creating a unique, randomized set of questions specifically for your session.
             </p>
           </div>
        )}

        {!isFinished && prompt && !isGenerating && (
           <div className="flex flex-col md:flex-row gap-6 flex-1 mt-4 animate-in slide-in-from-right-8 h-full">
             <div className="flex-1 w-full max-w-4xl mx-auto">
               <SpeakingVstepPart 
                  part={1} 
                  prompt={prompt} 
                  onComplete={submitToAPI} 
                  speakTime={180}
               />
             </div>
           </div>
        )}

        {isFinished && isScoring && (
           <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95">
             <div className="w-16 h-16 border-4 border-surface-300 border-t-accent-primary rounded-full animate-spin mb-6"></div>
             <h2 className="text-3xl font-black text-foreground mb-4">Examiner is Grading...</h2>
             <p className="text-gray-500 max-w-md text-center">
               The AI is analyzing your pronunciation, fluency, and vocabulary usage for Part 1.
             </p>
           </div>
        )}

        {isFinished && !isScoring && results && (
           <div className="animate-in slide-in-from-bottom-8 mt-4 space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                 <div className="flex-1 bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                    <h2 className="text-2xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">Part 1 Score & Feedback</h2>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="text-6xl font-black text-[#3B82F6]">{results.speakingScore}</div>
                      <div className="text-xl text-gray-500 font-bold mt-4">/ 10</div>
                    </div>
                    
                    <div className="text-gray-600 font-medium whitespace-pre-wrap leading-relaxed text-lg bg-blue-50/50 p-6 rounded-[16px] italic border border-blue-100">
                      {results.speakingFeedback}
                    </div>
                 </div>

                 <div className="lg:w-80 flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-[#3B82F6]/5 p-5 rounded-[20px] border border-[#3B82F6]/20 shadow-sm h-fit">
                       <h3 className="text-sm font-black text-[#3B82F6] uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Sparkles className="w-4 h-4" /> Try to use
                       </h3>
                       <div className="space-y-3">
                         {suggestedChunks.map((chunk, i) => (
                            <div key={i} className="bg-white p-3 rounded-[12px] border border-gray-100 shadow-sm">
                               <div className="text-sm font-bold text-gray-800">{chunk.phrase}</div>
                               <div className="text-xs text-gray-500 mt-1">{chunk.meaning_vi}</div>
                            </div>
                         ))}
                       </div>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-[20px] border border-purple-100 shadow-sm h-fit">
                       <h3 className="text-sm font-black text-purple-600 uppercase tracking-wider mb-4">
                         Grammar Challenge
                       </h3>
                       <div className="space-y-3">
                         {suggestedGrammar.map((g, i) => (
                            <div key={i} className="bg-white p-3 rounded-[12px] border border-gray-100 shadow-sm">
                               <div className="text-xs font-mono text-purple-600 font-bold mb-1">{g.pattern}</div>
                               <div className="text-xs text-gray-500 italic">"{g.example}"</div>
                            </div>
                         ))}
                       </div>
                    </div>
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
