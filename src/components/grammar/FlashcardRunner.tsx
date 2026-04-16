"use client";

import { useState } from "react";
import { ArrowLeft, Brain, Check, X, Repeat, History, Volume2, Settings2 } from "lucide-react";
import { useGlobalState } from "@/store/GlobalStateContext";
import { VOCAB_CHUNKS, GRAMMAR_PATTERNS } from "@/data/grammar-chunks";

// We merge chunks and grammar into a uniform flashcard deck shape
type StudyCard = {
  type: "chunk" | "grammar";
  id: string; // The phrase or pattern text
  front: string; // Sub-text (Pattern or Topic)
  back: string; // Main target (Phrase or Pattern)
  ipa?: string; // IPA phonetics
  wordType?: string; // Noun phrase, etc
  meaning: string; // Meaning or Example
  example_en?: string; // Contextual example
  explanation: string; // Vietnamese Explanation
  repetitions: number;
};

export function FlashcardRunner({ onClose }: { onClose: () => void }) {
  const { progress, reviewChunk, reviewGrammar } = useGlobalState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  // Filter States
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [filterTopic, setFilterTopic] = useState<string>("All");
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const allTopics = Array.from(new Set(VOCAB_CHUNKS.map((c: any) => c.topic)));
  const allLevels = Array.from(new Set([...VOCAB_CHUNKS.map((c:any) => c.level), ...GRAMMAR_PATTERNS.map((g:any) => g.level)]));
  const allTypes = Array.from(new Set(VOCAB_CHUNKS.map((c: any) => c.type)));
  const allCategories = Array.from(new Set(GRAMMAR_PATTERNS.map((g: any) => g.category)));

  // 1. Gather all "Due" cards
  const now = Date.now();
  
  let dueChunks = progress.chunkProgress.filter(c => c.nextReviewDate <= now);
  let dueGrammar = progress.grammarProgress.filter(g => g.nextReviewDate <= now);

  // 2. Identify "New" cards to drip feed if they have no Due cards
  const activeChunkIds = progress.chunkProgress.map(c => c.id);
  const activeGrammarIds = progress.grammarProgress.map(g => g.id);

  let unstartedChunks = VOCAB_CHUNKS.filter((c: any) => !activeChunkIds.includes(c.phrase));
  let unstartedGrammar = GRAMMAR_PATTERNS.filter((g: any) => !activeGrammarIds.includes(g.pattern));
  
  // Apply Filters
  if (filterTopic !== "All") {
     dueChunks = dueChunks.filter(c => VOCAB_CHUNKS.find((v:any) => v.phrase === c.id)?.topic === filterTopic);
     unstartedChunks = unstartedChunks.filter((c: any) => c.topic === filterTopic);
     // Grammar doesn't have Topic, so if user filters by Topic, they only want vocab
     dueGrammar = [];
     unstartedGrammar = [];
  }
  if (filterLevel !== "All") {
     dueChunks = dueChunks.filter(c => VOCAB_CHUNKS.find((v:any) => v.phrase === c.id)?.level === filterLevel);
     unstartedChunks = unstartedChunks.filter((c: any) => c.level === filterLevel);
     dueGrammar = dueGrammar.filter(g => GRAMMAR_PATTERNS.find((v:any) => v.pattern === g.id)?.level === filterLevel);
     unstartedGrammar = unstartedGrammar.filter((g: any) => g.level === filterLevel);
  }
  if (filterType !== "All") {
     dueChunks = dueChunks.filter(c => VOCAB_CHUNKS.find((v:any) => v.phrase === c.id)?.type === filterType);
     unstartedChunks = unstartedChunks.filter((c: any) => c.type === filterType);
     dueGrammar = [];
     unstartedGrammar = [];
  }
  if (filterCategory !== "All") {
     dueGrammar = dueGrammar.filter(g => GRAMMAR_PATTERNS.find((v:any) => v.pattern === g.id)?.category === filterCategory);
     unstartedGrammar = unstartedGrammar.filter((g: any) => g.category === filterCategory);
     dueChunks = [];
     unstartedChunks = [];
  }

  // Determine Deck
  const deck: StudyCard[] = [];

  // Add due cards
  dueChunks.forEach(c => {
    deck.push({ type: "chunk", id: c.id, front: c.topic, back: c.phrase, ipa: c.ipa, wordType: c.type, meaning: c.meaning_vi, example_en: c.example_en, explanation: c.explanation_vi || "", repetitions: c.repetitions });
  });
  
  dueGrammar.forEach(g => {
    deck.push({ type: "grammar", id: g.id, front: g.category || "Grammar Pattern", back: g.pattern, meaning: g.example, example_en: g.speakingExample, explanation: g.explanation_vi || "", repetitions: g.repetitions });
  });

  // If the user has empty deck (e.g. first login or fully reviewed), give them up to 15 unstarted items matching filters
  if (dueChunks.length === 0 && dueGrammar.length === 0) {
      unstartedChunks.slice(0, 10).forEach((c: any) => {
          deck.push({ type: "chunk", id: c.phrase, front: c.topic, back: c.phrase, ipa: c.ipa, wordType: c.type, meaning: c.meaning_vi, example_en: c.example_en, explanation: c.explanation_vi || "",  repetitions: 0 });
      });
      unstartedGrammar.slice(0, 5).forEach((g: any) => {
          deck.push({ type: "grammar", id: g.pattern, front: g.category || "Grammar Pattern", back: g.pattern, meaning: g.example, example_en: g.speakingExample, explanation: g.explanation_vi || "", repetitions: 0 });
      });
  }

  const currentCard = deck[currentIndex];

  const handleGrade = (quality: "Again" | "Hard" | "Good" | "Easy") => {
    // 1. Dispatch to global state to update SM-2 metrics
    if (currentCard.type === "chunk") {
      // The `reviewChunk` will automatically create the ChunkItem if it didn't exist in progress yet
      reviewChunk(currentCard.id, quality);
    } else {
      reviewGrammar(currentCard.id, quality);
    }
    
    // 2. Local session state
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(c => c + 1);
      setIsFlipped(false);
    } else {
      setSessionCompleted(true);
    }
  };

  if (isConfiguring) {
    return (
      <div className="flex flex-col items-center w-full max-w-xl mx-auto py-10 my-10 bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-500 relative">
         <button onClick={onClose} className="absolute left-6 top-6 text-gray-400 hover:text-gray-700 transition">
            <ArrowLeft className="w-6 h-6" />
         </button>
         
         <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
            <Settings2 className="w-8 h-8" />
         </div>
         <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Configure Flashcards</h2>
         
         <div className="w-full space-y-6">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topic Filter</label>
               <select value={filterTopic} onChange={e => { setFilterTopic(e.target.value); if(e.target.value !== "All") setFilterCategory("All"); }} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                  <option value="All">All Topics</option>
                  {allTopics.map((t: any) => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Grammar Category Filter</label>
               <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); if(e.target.value !== "All") { setFilterTopic("All"); setFilterType("All"); } }} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                  <option value="All">All Categories</option>
                  {allCategories.map((c: any) => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CEFR Level</label>
                   <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      <option value="All">All Levels</option>
                      {allLevels.map((l: any) => <option key={l} value={l}>{l}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Word Type</label>
                   <select value={filterType} onChange={e => { setFilterType(e.target.value); if(e.target.value !== "All") setFilterCategory("All"); }} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      <option value="All">All Types</option>
                      {allTypes.map((t: any) => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
            </div>
         </div>
         
         <button onClick={() => setIsConfiguring(false)} className="mt-10 w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg shadow-[0_8px_20px_rgba(79,70,229,0.25)]">
            Start Reviewing {dueChunks.length + dueGrammar.length > 0 ? `(${dueChunks.length + dueGrammar.length} Due)` : '(New subset)'}
         </button>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-[24px] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-center animate-in zoom-in duration-500">
         <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100 shadow-inner">
            <Check className="w-12 h-12 text-green-500" />
         </div>
         <h2 className="text-3xl font-black text-gray-800 mb-4">Session Complete!</h2>
         <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
           You reviewed <strong>{deck.length}</strong> items. The spaced repetition algorithm has updated their intervals based on your answers.
         </p>
         <button onClick={onClose} className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Return to Dashboard
         </button>
      </div>
    );
  }

  if (deck.length === 0) {
     return (
        <div className="text-center p-10 bg-white rounded-[24px]">
           <p className="text-gray-500">You have no cards to review right now! Take the Daily Test to unlock more.</p>
           <button onClick={onClose} className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg">Back</button>
        </div>
     );
  }

  const gradeColors = {
    Again: "border-red-500 text-red-700 bg-red-50 hover:bg-red-100",
    Hard: "border-orange-500 text-orange-700 bg-orange-50 hover:bg-orange-100",
    Good: "border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100",
    Easy: "border-green-500 text-green-700 bg-green-50 hover:bg-green-100"
  };

  const getIntervalLabel = (quality: "Again" | "Hard" | "Good" | "Easy") => {
    if (!currentCard) return "1 day";
    if (quality === "Again") return "< 1 min";
    
    let reps = currentCard.repetitions || 0;
    const intervals = [1, 3, 7, 14, 30];
    
    if (quality === "Hard") reps = Math.max(0, reps - 1);
    else if (quality === "Good") reps += 1;
    else if (quality === "Easy") reps += 2;
    
    if (reps >= intervals.length) reps = intervals.length - 1;
    
    return `${intervals[reps]} ${intervals[reps] === 1 ? 'day' : 'days'}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      <button onClick={onClose} className="absolute left-0 top-0 text-gray-400 hover:text-gray-700 transition">
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Progress Bar */}
      <div className="w-full mt-4 mb-8">
         <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
           <span>Reviewing</span>
           <span>{currentIndex + 1} / {deck.length}</span>
         </div>
         <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300" 
             style={{ width: `${((currentIndex) / deck.length) * 100}%` }}
           />
         </div>
      </div>

      {/* Flashcard */}
      <div className="relative w-full aspect-[4/3] md:aspect-[3/2] mb-8" style={{ perspective: '1000px' }}>
        <div 
           className="w-full h-full transition-all duration-500 cursor-pointer relative"
           style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
           onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div 
             className="absolute inset-0 bg-white rounded-[24px] border-2 border-indigo-100 shadow-[0_15px_35px_rgba(99,102,241,0.1)] flex flex-col items-center justify-center p-8 text-center overscroll-contain"
             style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
          >
             <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full font-bold text-xs uppercase tracking-wider mb-6 flex items-center gap-2">
                {currentCard.type === "chunk" ? `Topic: ${currentCard.front}` : "Grammar Pattern"}
             </div>
             
             <div className="flex items-center gap-4 mb-2">
                 <p className="text-3xl md:text-4xl font-black text-gray-800 leading-tight">
                   {currentCard.back}
                 </p>
                 <button 
                    title="Play Pronunciation" 
                    onClick={(e) => {
                       e.stopPropagation(); // prevent flipping the card
                       const utterance = new SpeechSynthesisUtterance(currentCard.back);
                       utterance.lang = "en-US";
                       window.speechSynthesis.speak(utterance);
                    }} 
                    className="p-3 rounded-full bg-gray-50 hover:bg-indigo-50 text-gray-400 hover:text-indigo-500 transition-colors shadow-sm cursor-pointer"
                  >
                     <Volume2 className="w-5 h-5" />
                  </button>
             </div>
             
             {currentCard.type === "chunk" && (
                 <div className="flex items-center gap-2 mt-4">
                    <span className="text-gray-400 font-mono text-sm">{currentCard.ipa}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{currentCard.wordType}</span>
                 </div>
             )}

             <div className="absolute bottom-6 text-gray-400 text-sm font-medium animate-pulse flex items-center gap-2">
               <Repeat className="w-4 h-4" /> Tap to flip
             </div>
          </div>

          {/* Back */}
          <div 
             className="absolute inset-0 bg-white rounded-[24px] border-2 border-indigo-200 shadow-[0_15px_35px_rgba(0,0,0,0.1)] flex flex-col items-center p-8 text-center pb-24 border-b-8 custom-scrollbar overflow-y-auto"
             style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
             <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
                 {currentCard.type === "chunk" ? "Vietnamese Meaning" : "Example"}
             </div>
             <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 pb-6 border-b border-gray-100 w-full flex justify-center items-center gap-4">
               <span>{currentCard.back}</span>
               <button 
                  title="Play Pronunciation" 
                  onClick={(e) => {
                     e.stopPropagation();
                     const utterance = new SpeechSynthesisUtterance(currentCard.back);
                     utterance.lang = "en-US";
                     window.speechSynthesis.speak(utterance);
                  }} 
                  className="p-2 rounded-full bg-gray-50 hover:bg-indigo-50 text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                   <Volume2 className="w-5 h-5" />
                </button>
             </h3>
             <p className={`text-xl md:text-2xl font-bold ${currentCard.type === "chunk" ? "text-blue-600" : "text-gray-600 italic font-serif leading-relaxed"}`}>
               {currentCard.type === "grammar" && '"'}{currentCard.meaning}{currentCard.type === "grammar" && '"'}
             </p>
             
             {currentCard.example_en && (
                <div className="text-gray-600 italic border-l-2 border-indigo-100 pl-4 mt-6 text-sm w-full text-left bg-indigo-50/30 p-3 rounded-r-lg">
                   <div className="text-[10px] font-black uppercase text-indigo-400 mb-1 tracking-wider">English Example</div>
                   "{currentCard.example_en}"
                </div>
             )}
             
             {currentCard.explanation && (
                <div className="mt-4 bg-gray-50 p-4 rounded-[12px] border border-gray-100 w-full text-left mx-auto">
                   <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Giải thích việt ngữ</div>
                   <div className="text-gray-600 font-medium text-sm leading-relaxed">{currentCard.explanation}</div>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Action Buttons (Only visible when flipped) */}
      <div className={`w-full grid grid-cols-2 md:grid-cols-4 gap-3 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} transition-all duration-300`}>
        <button onClick={() => handleGrade("Again")} className={`p-4 rounded-[16px] border-2 flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-sm ${gradeColors.Again}`}>
           <History className="w-5 h-5 mb-1 opacity-70" />
           <span className="font-black">Again</span>
           <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-60">{getIntervalLabel("Again")}</span>
        </button>
        <button onClick={() => handleGrade("Hard")} className={`p-4 rounded-[16px] border-2 flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-sm ${gradeColors.Hard}`}>
           <Brain className="w-5 h-5 mb-1 opacity-70" />
           <span className="font-black">Hard</span>
           <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-60">{getIntervalLabel("Hard")}</span>
        </button>
        <button onClick={() => handleGrade("Good")} className={`p-4 rounded-[16px] border-2 flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-sm ${gradeColors.Good}`}>
           <Check className="w-5 h-5 mb-1 opacity-70" />
           <span className="font-black">Good</span>
           <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-60">{getIntervalLabel("Good")}</span>
        </button>
        <button onClick={() => handleGrade("Easy")} className={`p-4 rounded-[16px] border-2 flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-sm ${gradeColors.Easy}`}>
           <Check className="w-5 h-5 mb-1 opacity-70" />
           <span className="font-black text-green-700">Easy</span>
           <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-60">{getIntervalLabel("Easy")}</span>
        </button>
      </div>

    </div>
  );
}
