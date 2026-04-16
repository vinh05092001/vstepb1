import React, { useState } from "react";
import { VocabularyItem } from "@/types";
import { motion, useAnimation } from "framer-motion";
import { Volume2, MessageCircle } from "lucide-react";

interface FlashcardProps {
  word: VocabularyItem;
  onReview: (quality: "Again" | "Hard" | "Good" | "Easy") => void;
}

export function Flashcard({ word, onReview }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const controls = useAnimation();

  const handleReview = (quality: "Again" | "Hard" | "Good" | "Easy") => {
    onReview(quality);
    setIsFlipped(false);
  };

  const playAudio = (e: React.MouseEvent, textToPlay: string) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToPlay);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (!isFlipped) return;
    
    // Swipe gestures
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleReview("Easy"); // Swipe right = Easy
    } else if (info.offset.x < -threshold) {
      handleReview("Again"); // Swipe left = Again
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-[3/4] md:aspect-[4/5] perspective-1000 relative">
      <motion.div
        drag={isFlipped ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="w-full h-full relative preserve-3d cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <motion.div 
           className="w-full h-full preserve-3d absolute inset-0"
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#F97316] to-[#FDBA74] rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center p-8 text-white border-4 border-white/20">
            <div className="absolute top-6 right-6 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm shadow-sm">
              {word.category || "Vocabulary"}
            </div>
            
            <div className="flex flex-col items-center justify-center gap-6 mb-4 w-full px-4 relative z-10">
               <button 
                  onClick={(e) => playAudio(e, word.word)}
                  className="p-5 rounded-full bg-white text-[#F97316] hover:bg-orange-50 transition-colors shadow-lg hover:scale-110 active:scale-95"
                  aria-label="Play pronunciation"
               >
                  <Volume2 className="w-8 h-8" />
               </button>
               <h2 className="text-4xl md:text-5xl font-black text-center break-words w-full drop-shadow-md leading-tight">{word.word}</h2>
            </div>
            
            {!isFlipped && (
               <p className="absolute bottom-8 text-sm text-white/70 font-black uppercase tracking-widest animate-pulse border border-white/30 px-6 py-2 rounded-full">Tap to reveal</p>
            )}
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-white border-4 border-orange-100 rounded-[2.5rem] shadow-xl flex flex-col p-6 md:p-8 [transform:rotateY(180deg)] overflow-y-auto">
            <div className="absolute top-6 right-6 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider bg-orange-100 text-orange-600">
              {word.topic}
            </div>
            
            <div className="flex-1 mt-10 flex flex-col text-center md:text-left justify-center pb-4">
              <h3 className="text-3xl font-black text-[#F97316] mb-4 pb-4 border-b border-gray-100 capitalize">{word.meaning_vi}</h3>
              
              {word.usage_vi && (
                <div className="mb-4 bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <h4 className="flex items-center gap-2 text-blue-700 font-bold uppercase tracking-wide text-xs mb-2">
                     📚 Usage / Grammar Tip
                  </h4>
                  <p className="text-gray-700 font-medium text-sm leading-relaxed">{word.usage_vi}</p>
                </div>
              )}

              {word.example_en && (
                <div className="mb-2 bg-orange-50/50 p-6 rounded-2xl border border-orange-100 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#F97316]"></div>
                  <h4 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-3">Example</h4>
                  <p className="text-gray-800 italic font-medium text-lg md:text-xl leading-relaxed">"{word.example_en}"</p>
                  {word.example_vi && (
                     <p className="text-orange-700/80 font-bold text-sm mt-3 border-t border-orange-100/50 pt-2">💡 Dịch: {word.example_vi}</p>
                  )}
                </div>
              )}

              {word.speaking_sentence && (
                 <div className="mt-4 mb-2 bg-blue-50 border-2 border-blue-100 p-5 rounded-2xl text-left shadow-inner">
                   <div className="flex items-center justify-between mb-3">
                     <div className="text-blue-600 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                        <MessageCircle className="w-4 h-4"/> B1 Speaking Template
                     </div>
                     <button 
                       onClick={(e) => playAudio(e, word.speaking_sentence)}
                       className="p-2 rounded-full bg-white hover:bg-blue-200 text-blue-600 transition-colors shadow-sm"
                     >
                       <Volume2 className="w-5 h-5" />
                     </button>
                   </div>
                   <p className="text-gray-800 italic font-medium text-lg md:text-xl leading-relaxed">"{word.speaking_sentence}"</p>
                 </div>
              )}
            </div>

            <div className="w-full grid grid-cols-4 gap-2 md:gap-3 mt-4 shrink-0 font-sans">
               <button onClick={(e) => { e.stopPropagation(); handleReview("Again"); }} className="py-4 bg-red-100 text-red-700 rounded-2xl font-black text-xs md:text-sm tracking-tight hover:bg-red-200 transition-colors shadow-sm">Again</button>
               <button onClick={(e) => { e.stopPropagation(); handleReview("Hard"); }} className="py-4 bg-amber-100 text-amber-700 rounded-2xl font-black text-xs md:text-sm tracking-tight hover:bg-amber-200 transition-colors shadow-sm">Hard</button>
               <button onClick={(e) => { e.stopPropagation(); handleReview("Good"); }} className="py-4 bg-blue-100 text-blue-700 rounded-2xl font-black text-xs md:text-sm tracking-tight hover:bg-blue-200 transition-colors shadow-sm">Good</button>
               <button onClick={(e) => { e.stopPropagation(); handleReview("Easy"); }} className="py-4 bg-green-100 text-green-700 rounded-2xl font-black text-xs md:text-sm tracking-tight hover:bg-green-200 transition-colors shadow-sm">Easy</button>
            </div>
            
            {isFlipped && (
               <div className="text-center mt-4 w-full text-xs text-gray-400 font-bold uppercase tracking-widest hidden md:block">
                  Swipe <span className="text-red-400">Left (Again)</span> or <span className="text-green-400">Right (Easy)</span>
               </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
