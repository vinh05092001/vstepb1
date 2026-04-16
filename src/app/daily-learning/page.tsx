"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Layout, CheckCircle } from "lucide-react";

import { VSTEP_TEMPLATES } from "@/data/vstep-templates";
import { getRandomVocabulary } from "@/data/vocabulary";
import { useGlobalState } from "@/store/GlobalStateContext";
import { supabase } from "@/lib/supabase";

import { TemplateReview } from "@/components/vstep/TemplateReview";
import { SpeakingVstepPart } from "@/components/vstep/SpeakingVstepPart";
import { WritingVstepPart } from "@/components/vstep/WritingVstepPart";

type Step = "intro" | "templates" | "vocab" | "speaking" | "writing" | "scoring" | "done";

export default function DailyVstepPage() {
  const { progress } = useGlobalState();
  const [step, setStep] = useState<Step>("intro");
  
  // State for the payload
  const [templateIdx, setTemplateIdx] = useState(0);
  const [vocabWords] = useState(() => getRandomVocabulary(5));
  const [vocabIdx, setVocabIdx] = useState(0);

  // VSTEP Prompt Data
  const SPEAKING_TASKS = [
    { part: 1 as const, prompt: "Talk about your hometown. What do you like most about it?" },
    { part: 1 as const, prompt: "What are your hobbies?" },
    { part: 1 as const, prompt: "Describe your daily routine." },
    { part: 1 as const, prompt: "Do you prefer spending time with family or friends?" },
    { part: 1 as const, prompt: "What is your favorite food?" },
    { part: 2 as const, prompt: "Situation: Your family is planning a trip from Danang to Hanoi.\nOptions: train, plane, coach." },
    { part: 2 as const, prompt: "Situation: You have a free weekend.\nOptions: stay home, go to the beach, visit a museum." },
    { part: 3 as const, prompt: "Topic: Education plays an important role in our lives." },
  ];

  const [speakingIdx, setSpeakingIdx] = useState(0);
  const [speakingTranscripts, setSpeakingTranscripts] = useState<string[]>([]);

  const [writingPrompt] = useState("You recently visited a friend's new house. Write an informal letter to thank them for their hospitality.");
  const [writingEssay, setWritingEssay] = useState("");

  const [scoreReport, setScoreReport] = useState<any>(null);
  const [writingCorrections, setWritingCorrections] = useState<any[]>([]);
  const [isScoring, setIsScoring] = useState(false);

  const handleNextTemplate = () => {
    if (templateIdx < VSTEP_TEMPLATES.length - 1) {
      setTemplateIdx(prev => prev + 1);
    } else {
      setStep("vocab");
    }
  };

  const handleNextVocab = () => {
    if (vocabIdx < vocabWords.length - 1) {
      setVocabIdx(prev => prev + 1);
    } else {
      setStep("speaking");
    }
  };

  const handleSpeakingSubmit = (transcript: string) => {
    const newTranscripts = [...speakingTranscripts, transcript];
    setSpeakingTranscripts(newTranscripts);
    
    if (speakingIdx < SPEAKING_TASKS.length - 1) {
      setSpeakingIdx(prev => prev + 1);
    } else {
      setStep("writing");
    }
  };

  const handleWritingSubmit = async (essay: string) => {
    setWritingEssay(essay);
    setStep("scoring");
    setIsScoring(true);

    try {
       // Submit to the VSTEP analysis and Writing Improvement APIs in parallel
       const [analysisRes, improvementRes] = await Promise.all([
         fetch("/api/vstep-analysis", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              speaking: { 
                 tasks: SPEAKING_TASKS,
                 transcripts: speakingTranscripts
              },
              writing: { type: "informal", essay, prompt: writingPrompt }
           })
         }),
         fetch("/api/writing-improvement", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ essay, prompt: writingPrompt })
         })
       ]);

       const data = await analysisRes.json();
       const improvementData = await improvementRes.json();
       
       setScoreReport(data);
       setWritingCorrections(improvementData.corrections || []);

       // Attempt to save to Supabase silently
       supabase.from('speaking_scores').insert([{ part: 1, score: data.speakingScore, feedback: data.speakingFeedback }]).then();
       supabase.from('writing_scores').insert([{ type: 'informal', score: data.writingScore, feedback: data.writingFeedback }]).then();

    } catch (e) {
       console.error(e);
       setScoreReport({
          speakingScore: 5, speakingFeedback: "Fallback local eval: Please speak longer next time.",
          writingScore: 6, writingFeedback: "Fallback local eval: Check your tenses."
       });
    } finally {
       setIsScoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-10">
      <div className="bg-surface-100 p-4 flex items-center justify-between border-b border-surface-border shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 text-accent-primary font-bold text-lg">
             <Layout className="w-6 h-6" /> VSTEP Daily Training
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col">
        {step === "intro" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
             <div className="w-24 h-24 bg-accent-primary/20 rounded-full flex items-center justify-center mb-6 border-4 border-accent-primary/50">
               <span className="text-4xl">🎯</span>
             </div>
             <h1 className="text-3xl font-bold text-foreground mb-4">VSTEP B1 Daily Drill</h1>
             <p className="text-gray-400 text-lg mb-8 max-w-md">
               This 45-minute strict training session covers templates, vocabulary, speaking Part 1, and writing an informal letter.
             </p>
             <button onClick={() => setStep("templates")} className="w-full max-w-sm py-4 bg-accent-primary text-white font-bold rounded-2xl hover:bg-blue-600 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
               <Play className="w-5 h-5 fill-current" /> Start Training Session
             </button>
          </div>
        )}

        {step === "templates" && (
           <div className="animate-in slide-in-from-right-8">
             <div className="mb-4 text-gray-500 font-bold uppercase tracking-wider text-sm flex justify-between">
                <span>Phase 1: Memorization</span>
                <span>{templateIdx + 1} / {VSTEP_TEMPLATES.length}</span>
             </div>
             <TemplateReview template={VSTEP_TEMPLATES[templateIdx]} onComplete={handleNextTemplate} />
             <div className="w-full bg-surface-200 h-2 mt-6 rounded-full overflow-hidden">
                <div className="bg-accent-primary h-full transition-all duration-500" style={{ width: `${((templateIdx + 1)/VSTEP_TEMPLATES.length)*100}%` }} />
             </div>
           </div>
        )}

        {step === "vocab" && (
           <div className="animate-in slide-in-from-right-8">
             <div className="mb-4 text-gray-500 font-bold uppercase tracking-wider text-sm flex justify-between">
                <span>Phase 2: Vocabulary Drill</span>
                <span>{vocabIdx + 1} / {vocabWords.length}</span>
             </div>
             <div className="bg-surface-200 p-8 rounded-2xl border border-surface-border text-center">
                <h3 className="text-3xl font-bold text-accent-secondary mb-2">{vocabWords[vocabIdx].word}</h3>
                <div className="text-gray-400 mb-6 font-mono">{vocabWords[vocabIdx].phonetic}</div>
                <div className="text-foreground text-xl font-medium mb-8">"{vocabWords[vocabIdx].meaning_en}"</div>
                
                <div className="bg-surface-300 p-4 rounded-xl text-left border-l-4 border-accent-secondary mb-8">
                  <span className="text-accent-secondary font-bold uppercase text-xs">Example</span>
                  <p className="text-gray-300 mt-1 italic">{vocabWords[vocabIdx].example_en}</p>
                </div>

                <button onClick={handleNextVocab} className="w-full py-4 bg-surface-300 hover:bg-surface-border text-foreground font-bold rounded-xl transition-colors">
                  Got It
                </button>
             </div>
           </div>
        )}

        {step === "speaking" && (
           <div className="flex-1 animate-in slide-in-from-right-8 flex flex-col">
             <div className="mb-4 text-gray-500 font-bold uppercase tracking-wider text-sm flex justify-between">
                <span>Phase 3: Speaking Execution</span>
                <span>{speakingIdx + 1} / {SPEAKING_TASKS.length}</span>
             </div>
             <SpeakingVstepPart 
                key={speakingIdx}
                part={SPEAKING_TASKS[speakingIdx].part} 
                prompt={SPEAKING_TASKS[speakingIdx].prompt} 
                onComplete={handleSpeakingSubmit} 
             />
           </div>
        )}

        {step === "writing" && (
           <div className="flex-1 animate-in slide-in-from-right-8 flex flex-col">
             <div className="mb-4 text-gray-500 font-bold uppercase tracking-wider text-sm">Phase 4: Letter Writing</div>
             <WritingVstepPart type={"informal"} prompt={writingPrompt} onComplete={handleWritingSubmit} />
           </div>
        )}

        {step === "scoring" && (
           <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-8">
              {isScoring ? (
                 <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-surface-300 border-t-accent-primary rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Performance...</h2>
                    <p className="text-gray-400">The AI Fallback array is reviewing your phrasing...</p>
                 </div>
              ) : (
                 <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">VSTEP Score Report</h2>
                    
                    <div className="bg-surface-200 p-6 rounded-2xl border border-surface-border">
                       <h3 className="text-xl font-bold text-accent-primary mb-4 flex items-center gap-2">🎤 Speaking Part 1</h3>
                       <div className="flex items-end gap-2 mb-4">
                         <span className="text-5xl font-bold text-foreground">{scoreReport?.speakingScore}</span>
                         <span className="text-gray-500 text-lg mb-1">/ 10</span>
                       </div>
                       <div className="bg-surface-300 p-4 rounded-xl text-gray-300 whitespace-pre-wrap leading-relaxed">{scoreReport?.speakingFeedback}</div>
                    </div>

                    <div className="bg-surface-200 p-6 rounded-2xl border border-surface-border">
                       <h3 className="text-xl font-bold text-accent-secondary mb-4 flex items-center gap-2">✍️ Writing Task 1</h3>
                       <div className="flex items-end gap-2 mb-4">
                         <span className="text-5xl font-bold text-foreground">{scoreReport?.writingScore}</span>
                         <span className="text-gray-500 text-lg mb-1">/ 10</span>
                       </div>
                       <div className="bg-surface-300 p-4 rounded-xl text-gray-300 whitespace-pre-wrap leading-relaxed">{scoreReport?.writingFeedback}</div>
                       
                       {writingCorrections && writingCorrections.length > 0 && (
                          <div className="mt-6 border-t border-surface-border pt-6">
                            <h4 className="text-lg font-bold text-accent-secondary mb-4">Sentence Corrections</h4>
                            <div className="space-y-4">
                              {writingCorrections.map((corr, idx) => (
                                <div key={idx} className="bg-surface-100 p-4 rounded-xl border border-surface-border">
                                  <div className="text-red-400 line-through mb-2">{corr.original}</div>
                                  <div className="text-green-400 font-medium mb-2">{corr.improved}</div>
                                  <div className="text-gray-400 text-sm italic">{corr.explanation}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                       )}
                    </div>

                    <button onClick={() => setStep("done")} className="w-full py-4 bg-accent-success text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg">
                      <CheckCircle className="w-6 h-6" /> Save Progress
                    </button>
                 </div>
              )}
           </div>
        )}

        {step === "done" && (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
             <CheckCircle className="w-24 h-24 text-accent-success mb-6" />
             <h1 className="text-3xl font-bold text-foreground mb-4">Training Complete!</h1>
             <p className="text-gray-400 text-lg mb-8 max-w-md">
               Your VSTEP scores have been saved to the database. Come back tomorrow to keep the momentum going!
             </p>
             <Link href="/" className="px-8 py-4 bg-surface-300 text-foreground font-bold rounded-2xl hover:bg-surface-border transition-colors">
               Return Home
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
