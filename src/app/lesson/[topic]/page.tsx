"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGlobalState } from "@/store/GlobalStateContext";
import { BookOpen, MessageCircle, HelpCircle, CheckCircle, ArrowRight, Star, X } from "lucide-react";
import Link from "next/link";

type LessonData = {
  title: string;
  vocabulary: { word: string; meaning: string; pronunciation?: string; exampleSentence?: string; collocations?: string[] }[];
  dialogue: { character: string; text: string }[];
  practiceQuestions: { question: string; options: string[]; correctAnswer: string }[];
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { progress, completeLesson, addWord } = useGlobalState();
  const topic = decodeURIComponent(params.topic as string);

  const [data, setData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"vocab" | "dialogue" | "quiz" | "done">("vocab");

  // Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch("/api/generateLesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, level: progress.level })
        });
        if (!res.ok) throw new Error("Failed to load lesson");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [topic, progress.level]);

  const handleNextStep = () => {
    if (step === "vocab") setStep("dialogue");
    else if (step === "dialogue") setStep("quiz");
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    setIsCorrect(option === data!.practiceQuestions[quizIdx].correctAnswer);
  };

  const handleNextQuestion = () => {
    if (quizIdx < data!.practiceQuestions.length - 1) {
      setQuizIdx(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
       completeLesson(topic as string);
       // Auto-add vocab to SRS
       data!.vocabulary.forEach(v => {
         addWord({
           word: v.word,
           meaning_en: v.meaning,
           meaning_vi: "", // AI lesson doesn't generate this yet
           phonetic: v.pronunciation || "",
           example_en: v.exampleSentence || "",
           example_vi: "",
           usage_vi: "",
           speaking_sentence: "",
           topic: topic as string,
           category: "Generated Lesson",
           level: progress.level,
           status: "learning"
         });
       });
       setStep("done");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-700">AI is generating your lesson...</h2>
        <p className="text-gray-400 mt-2 font-bold uppercase tracking-wide">Topic: {topic}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border-2 border-gray-200 text-center">
         <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
           <X className="w-8 h-8" />
         </div>
         <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
         <p className="text-gray-500 mb-6">{error || "Something went wrong"}</p>
         <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold uppercase hover:bg-blue-400 transition-colors inline-block">
           Back Home
         </Link>
      </div>
    );
  }

  // Progress Bar
  const progressPercent = step === "vocab" ? 25 : step === "dialogue" ? 50 : step === "quiz" ? 75 + (quizIdx / data.practiceQuestions.length) * 25 : 100;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header & Progress Bar */}
      <div className="p-4 flex items-center gap-4 border-b-2 border-gray-100">
        <button onClick={() => router.push("/")} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          
          {step === "vocab" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl"><BookOpen className="w-8 h-8" /></div>
                 <h2 className="text-3xl font-bold text-gray-800">New Words</h2>
              </div>
              <div className="space-y-4">
                {data.vocabulary.map((v, i) => (
                  <div key={i} className="bg-white border-2 border-gray-200 p-5 rounded-2xl shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                       <span className="text-2xl font-bold text-gray-800">{v.word}</span>
                       {v.pronunciation && <span className="text-gray-400 font-mono text-sm">{v.pronunciation}</span>}
                    </div>
                    <p className="text-lg font-bold text-green-600 mb-2">{v.meaning}</p>
                    {v.exampleSentence && <p className="italic text-gray-500 text-sm">"{v.exampleSentence}"</p>}
                  </div>
                ))}
              </div>
              <button onClick={handleNextStep} className="mt-8 w-full py-4 bg-green-500 hover:bg-green-400 rounded-2xl border-b-4 border-green-600 active:border-b-0 active:translate-y-[4px] text-white font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-2 transition-all">
                Continue <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {step === "dialogue" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><MessageCircle className="w-8 h-8" /></div>
                 <h2 className="text-3xl font-bold text-gray-800">Read the Dialogue</h2>
              </div>
              <div className="space-y-4">
                {data.dialogue.map((d, i) => (
                  <div key={i} className={`flex flex-col ${i % 2 === 0 ? "items-start" : "items-end"}`}>
                    <span className="text-xs font-bold text-gray-400 uppercase ml-2 mr-2 mb-1">{d.character}</span>
                    <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-lg ${
                      i % 2 === 0 ? "bg-gray-100 text-gray-800 rounded-tl-none border-2 border-transparent" : "bg-blue-500 text-white rounded-tr-none"
                    }`}>
                      {d.text}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleNextStep} className="mt-12 w-full py-4 bg-green-500 hover:bg-green-400 rounded-2xl border-b-4 border-green-600 active:border-b-0 active:translate-y-[4px] text-white font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-2 transition-all">
                Continue <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {step === "quiz" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><HelpCircle className="w-8 h-8" /></div>
                 <h2 className="text-3xl font-bold text-gray-800">Let's Practice!</h2>
              </div>
              
              <div className="bg-white border-2 border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm mb-6">
                 <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-snug">
                   {data.practiceQuestions[quizIdx].question}
                 </h3>

                 <div className="space-y-3">
                   {data.practiceQuestions[quizIdx].options.map((opt, i) => {
                     const isSelected = selectedAnswer === opt;
                     const isCorrectAns = opt === data.practiceQuestions[quizIdx].correctAnswer;
                     
                     let btnClass = "border-gray-200 text-gray-700 hover:bg-gray-50 border-b-4 bg-white";
                     
                     if (selectedAnswer !== null) {
                       if (isCorrectAns) btnClass = "border-green-500 bg-green-100 text-green-700 border-2";
                       else if (isSelected) btnClass = "border-red-500 bg-red-100 text-red-700 border-2";
                       else btnClass = "border-gray-200 text-gray-400 bg-white border-2 opacity-50";
                     }

                     return (
                       <button
                         key={i}
                         disabled={selectedAnswer !== null}
                         onClick={() => handleAnswer(opt)}
                         className={`w-full text-left p-4 rounded-2xl font-bold text-lg transition-all ${btnClass} ${selectedAnswer === null && "active:border-b-0 active:translate-y-[4px]"}`}
                       >
                         {opt}
                       </button>
                     );
                   })}
                 </div>
              </div>

              {selectedAnswer !== null && (
                <div className={`fixed bottom-0 left-0 w-full p-6 animate-in slide-in-from-bottom h-40 flex items-center border-t-2 ${
                  isCorrect ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"
                }`}>
                  <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCorrect ? "bg-white text-green-500" : "bg-white text-red-500"}`}>
                        {isCorrect ? <CheckCircle className="w-8 h-8" /> : <X className="w-8 h-8" />}
                      </div>
                      <h3 className={`text-2xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "Excellent!" : "Not quite right!"}
                      </h3>
                    </div>
                    <button onClick={handleNextQuestion} className={`py-4 px-8 rounded-2xl border-b-4 active:border-b-0 active:translate-y-[4px] font-bold text-lg uppercase tracking-wide text-white transition-all ${
                      isCorrect ? "bg-green-500 hover:bg-green-400 border-green-600" : "bg-red-500 border-red-600 hover:bg-red-400"
                    }`}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
               <div className="relative mb-8">
                 <Star className="w-32 h-32 text-yellow-400 fill-current animate-pulse" />
                 <Star className="w-16 h-16 text-yellow-300 fill-current absolute -top-4 -right-8 animate-bounce" />
                 <Star className="w-12 h-12 text-yellow-500 fill-current absolute top-12 -left-8 animate-bounce delay-100" />
               </div>
               <h2 className="text-4xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
               <p className="text-xl font-bold text-green-500 mb-8">+20 XP Earned</p>
               <p className="text-gray-500 text-center mb-8 max-w-sm">
                 You've learned new words about "{topic}" and practiced your skills. Keep it up!
               </p>
               <button onClick={() => router.push("/")} className="w-full py-4 bg-blue-500 hover:bg-blue-400 rounded-2xl border-b-4 border-blue-600 active:border-b-0 active:translate-y-[4px] text-white font-bold text-lg uppercase tracking-wide transition-all shadow-lg shadow-blue-500/30">
                 Continue
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
