"use client";

import { useState } from "react";
import { ArrowLeft, Check, X, Shield, Award } from "lucide-react";
import { useGlobalState } from "@/store/GlobalStateContext";
import { VOCAB_CHUNKS, GRAMMAR_PATTERNS } from "@/data/grammar-chunks";

type Question = {
  type: "chunk" | "grammar";
  id: string; // The phrase or pattern
  question: string;
  options: { text: string; isCorrect: boolean }[];
  correctAnswer: string;
  explanation: string;
};

// Simple shuffle helper
const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

export function DailyTestRunner({ onClose }: { onClose: () => void }) {
  const { progress, reviewChunk, reviewGrammar, addXp } = useGlobalState();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize Quiz
  const startQuiz = () => {
    const { chunkProgress, grammarProgress } = progress;
    
    // 1. Weakest Vocabulary Topics (Sort by fewest mastered or most 'Again')
    const chunkScoresByTopic: Record<string, number> = {};
    VOCAB_CHUNKS.forEach((c: any) => { chunkScoresByTopic[c.topic] = 0; });
    chunkProgress.forEach((c: any) => {
       if (c.status === "mastered") chunkScoresByTopic[c.topic] += 5;
       if (c.easeFactor < 2.0) chunkScoresByTopic[c.topic] -= 2; // Struggling
    });
    
    const sortedTopics = Object.keys(chunkScoresByTopic).sort((a, b) => chunkScoresByTopic[a] - chunkScoresByTopic[b]);
    const weakestTopics = sortedTopics.slice(0, 3);
    
    let targetedChunks = VOCAB_CHUNKS.filter((c: any) => weakestTopics.includes(c.topic));
    if (targetedChunks.length < 10) targetedChunks = [...targetedChunks, ...VOCAB_CHUNKS]; // fallback

    const randomChunks = shuffle([...targetedChunks]).slice(0, 10);

    // 2. Recently reviewed grammar (highest repetitions)
    const sortedGrammarProgress = [...grammarProgress].sort((a, b) => b.repetitions - a.repetitions);
    const recentGrammarIds = sortedGrammarProgress.slice(0, 10).map(g => g.id);
    let targetedGrammar = GRAMMAR_PATTERNS.filter((g: any) => recentGrammarIds.includes(g.pattern));
    if (targetedGrammar.length < 5) targetedGrammar = [...targetedGrammar, ...GRAMMAR_PATTERNS];

    const randomGrammar = shuffle([...targetedGrammar]).slice(0, 5);

    const generatedQuestions: Question[] = [];

    // 2. Generate multiple choice questions for chunks (Given meaning, find phrase)
    randomChunks.forEach((chunk: any) => {
        const correctPhrase = chunk.phrase;
        // get 3 wrong phrases
        const wrongPhrases = shuffle([...VOCAB_CHUNKS])
           .filter((c: any) => c.phrase !== correctPhrase)
           .slice(0, 3)
           .map((c: any) => c.phrase);
        
        const options = shuffle([
            { text: correctPhrase, isCorrect: true },
            ...wrongPhrases.map(w => ({ text: w, isCorrect: false }))
        ]);

        generatedQuestions.push({
            type: "chunk",
            id: correctPhrase,
            question: `Which phrase matches the meaning: "${chunk.meaning_vi}"?`,
            options,
            correctAnswer: correctPhrase,
            explanation: chunk.explanation_vi || ""
        });
    });

    // 3. Generate multiple choice questions for grammar (Fill in the blank example)
    randomGrammar.forEach((gram: any) => {
        const correctPattern = gram.pattern;
        const wrongPatterns = shuffle([...GRAMMAR_PATTERNS])
            .filter((g: any) => g.pattern !== correctPattern)
            .slice(0, 3)
            .map((g: any) => g.pattern);

        const options = shuffle([
            { text: correctPattern, isCorrect: true },
            ...wrongPatterns.map(w => ({ text: w, isCorrect: false }))
        ]);

        generatedQuestions.push({
            type: "grammar",
            id: correctPattern,
            question: `Which grammar structure matches this example: "${gram.example}"?`,
            options,
            correctAnswer: correctPattern,
            explanation: gram.explanation_vi || ""
        });
    });

    setQuestions(shuffle(generatedQuestions));
    setHasStarted(true);
  };

  const handleAnswer = (index: number, isCorrect: boolean) => {
      setSelectedOption(index);
      setShowExplanation(true);
      
      const currentQ = questions[currentIndex];
      
      if (isCorrect) {
          setScore(s => s + 1);
          // If correct, boost its SM-2 score slightly in GlobalState
          if (currentQ.type === "chunk") {
              reviewChunk(currentQ.id, "Good");
          } else {
              reviewGrammar(currentQ.id, "Good");
          }
      } else {
          // If wrong, penalize it
          if (currentQ.type === "chunk") {
              reviewChunk(currentQ.id, "Again");
          } else {
              reviewGrammar(currentQ.id, "Again");
          }
      }

      setTimeout(() => {
          if (currentIndex < questions.length - 1) {
              setCurrentIndex(c => c + 1);
              setSelectedOption(null);
              setShowExplanation(false);
          } else {
              setSessionCompleted(true);
              addXp(20, "daily_grammar_test");
          }
      }, isCorrect ? 1500 : 4000); // Give user more time to read explanation if wrong
  };

  if (!hasStarted) {
      return (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-center max-w-2xl mx-auto mt-10">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-blue-100 shadow-inner">
                  <Shield className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-4">Daily Check-up Test</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
                  You are about to be tested on 10 random vocabulary chunks and 5 grammar patterns. Passing this test unlocks those items into your Spaced Repetition flashcard deck.
              </p>
              <div className="flex items-center gap-4">
                  <button onClick={onClose} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                      Cancel
                  </button>
                  <button onClick={startQuiz} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-xl hover:shadow-[0_10px_25px_rgba(59,130,246,0.4)] hover:-translate-y-1 transition-all duration-300">
                      Start Test
                  </button>
              </div>
          </div>
      );
  }

  if (sessionCompleted) {
      const percentage = Math.round((score / questions.length) * 100);
      return (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-center animate-in zoom-in duration-500 max-w-2xl mx-auto mt-10">
              <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 border-4 border-yellow-100 shadow-inner">
                  <Award className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-4xl font-black text-gray-800 mb-2">
                 {percentage >= 80 ? "Excellent Work!" : percentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium text-lg">
                  You scored <strong className={`text-2xl ${percentage >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{score} / {questions.length}</strong>
              </p>
              
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 p-4 rounded-[16px] text-sm text-left mb-8 max-w-sm font-medium">
                  The items you encountered have been added to your Flashcard Review queue. Items you got wrong will appear sooner via the SM-2 algorithm.
              </div>

              <button onClick={onClose} className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Return to Dashboard
              </button>
          </div>
      );
  }

  const q = questions[currentIndex];

  return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-6 animate-in slide-in-from-bottom-4 duration-500 relative">
          <button onClick={onClose} className="absolute left-0 top-0 text-gray-400 hover:text-gray-700 transition">
              <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Progress Bar */}
          <div className="w-full mt-4 mb-10">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>Score: <span className="text-indigo-600">{score}</span></span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
                  {questions.map((_, i) => (
                      <div 
                         key={i} 
                         className={`h-full flex-1 border-r border-white/20 last:border-0 ${i < currentIndex ? "bg-indigo-500" : i === currentIndex ? "bg-blue-400 animate-pulse" : "bg-gray-200"}`} 
                      />
                  ))}
              </div>
          </div>

          {/* Question Card */}
          <div className="w-full bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8 md:p-10 text-center mb-8 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${q.type === 'chunk' ? 'bg-indigo-500' : 'bg-purple-500'}`} />
              
              <div className={`px-4 py-1.5 ${q.type === 'chunk' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'} rounded-full font-bold text-xs uppercase tracking-wider mb-6 inline-block mx-auto`}>
                  {q.type === "chunk" ? "Vocabulary Chunk" : "Grammar Pattern"}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 leading-tight mb-8">
                  {q.question}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                  {q.options.map((opt, i) => {
                      let bgColor = "bg-white hover:bg-gray-50 border-gray-200 text-gray-700";
                      let icon = null;

                      if (showExplanation) {
                          if (opt.isCorrect) {
                              bgColor = "bg-green-50 border-green-300 text-green-800";
                              icon = <Check className="w-5 h-5 text-green-600" />;
                          } else if (i === selectedOption) {
                              bgColor = "bg-red-50 border-red-300 text-red-800";
                              icon = <X className="w-5 h-5 text-red-600" />;
                          } else {
                              bgColor = "bg-white border-gray-100 text-gray-400 opacity-50";
                          }
                      }

                      return (
                          <button
                              key={i}
                              disabled={showExplanation}
                              onClick={() => handleAnswer(i, opt.isCorrect)}
                              className={`w-full p-4 rounded-[16px] border text-left font-bold transition-all relative flex items-center justify-between ${bgColor} ${!showExplanation && 'hover:shadow-md hover:-translate-y-0.5'}`}
                          >
                              <span>{opt.text}</span>
                              {icon && <span>{icon}</span>}
                          </button>
                      );
                  })}
              </div>
              
              {/* Show Explanation if wrong */}
              {showExplanation && selectedOption !== null && !q.options[selectedOption].isCorrect && q.explanation && (
                 <div className="mt-6 bg-red-50 p-4 rounded-[16px] border border-red-100 text-left animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-[10px] font-black uppercase text-red-400 mb-1 tracking-wider">Giải thích</div>
                    <div className="text-red-700 font-medium text-sm leading-relaxed">{q.explanation}</div>
                 </div>
              )}
          </div>
      </div>
  );
}
