"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProgress, VocabularyItem, ChunkItem, GrammarPatternItem } from "../types";

interface GlobalState {
  progress: UserProgress;
  vocabulary: VocabularyItem[];
  addXp: (amount: number, reason?: string) => void;
  addWord: (word: Omit<VocabularyItem, "id" | "nextReviewDate" | "interval" | "easeFactor" | "repetitions">) => void;
  reviewWord: (id: string, quality: "Again" | "Hard" | "Good" | "Easy") => void;
  completeLesson: (topic: string) => void;
  addGrammarMistake: (mistake: string) => void;
  updateSpeakingScore: (score: number, part?: number) => void;
  updateWritingScore: (score: number, task?: number) => void;
  reviewChunk: (id: string, quality: "Again" | "Hard" | "Good" | "Easy") => void;
  reviewGrammar: (id: string, quality: "Again" | "Hard" | "Good" | "Easy") => void;
  isHydrated: boolean;
}

const defaultProgress: UserProgress = {
  level: "Beginner",
  xp: 0,
  wordsLearned: 0,
  streak: 0,
  lastActiveDate: null,
  lessonsCompleted: 0,
  flashcardReviews: 0,
  achievements: [],
  unlockedTopics: ["Greetings", "Introducing yourself", "Ordering food", "Shopping", "Asking for directions", "Talking about family", "Daily routines"],
  weakWords: [],
  weakTopics: [],
  grammarMistakes: [],
  speakingPart1: 0,
  speakingPart2: 0,
  speakingPart3: 0,
  speakingScore: 0,
  writingTask1: 0,
  writingTask2: 0,
  writingScore: 0,
  scoreHistory: [],
  lastLesson: "",
  chunkProgress: [],
  grammarProgress: [],
};

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedProgress = localStorage.getItem("el_progress");
    const savedVocab = localStorage.getItem("el_vocabulary");
    
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(p => ({
         ...defaultProgress,
         ...parsed,
         // Safely handle arrays/numbers that might be undefined in old localStorage
         unlockedTopics: parsed.unlockedTopics || defaultProgress.unlockedTopics,
         flashcardReviews: parsed.flashcardReviews || defaultProgress.flashcardReviews,
         weakWords: parsed.weakWords || defaultProgress.weakWords,
         weakTopics: parsed.weakTopics || defaultProgress.weakTopics,
         grammarMistakes: parsed.grammarMistakes || defaultProgress.grammarMistakes,
         speakingPart1: parsed.speakingPart1 || defaultProgress.speakingPart1,
         speakingPart2: parsed.speakingPart2 || defaultProgress.speakingPart2,
         speakingPart3: parsed.speakingPart3 || defaultProgress.speakingPart3,
         speakingScore: parsed.speakingScore || defaultProgress.speakingScore,
         writingTask1: parsed.writingTask1 || defaultProgress.writingTask1,
         writingTask2: parsed.writingTask2 || defaultProgress.writingTask2,
         writingScore: parsed.writingScore || defaultProgress.writingScore,
         scoreHistory: parsed.scoreHistory || defaultProgress.scoreHistory,
         lastLesson: parsed.lastLesson || defaultProgress.lastLesson,
         chunkProgress: parsed.chunkProgress || defaultProgress.chunkProgress,
         grammarProgress: parsed.grammarProgress || defaultProgress.grammarProgress,
      }));
    }
    if (savedVocab) { 
       const parsedVocab = JSON.parse(savedVocab).map((v: any) => ({
           ...v,
           status: v.status || (v.repetitions > 3 ? "mastered" : v.repetitions > 0 ? "reviewing" : "learning")
       }));
       setVocabulary(parsedVocab);
    }

    // Calculate streak
    const lastActive = savedProgress ? JSON.parse(savedProgress).lastActiveDate : null;
    const today = new Date().toDateString();
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = savedProgress ? JSON.parse(savedProgress).streak : 0;
      if (lastActive === yesterday.toDateString()) {
         // maintained streak
      } else if (lastActive) {
         newStreak = 0; // lost streak
      }
      
      setProgress(p => ({ ...p, streak: lastActive !== yesterday.toDateString() && lastActive ? 0 : newStreak + 1, lastActiveDate: today }));
    }
    
    setIsHydrated(true);
  }, []);

  // Sync Global DB totalXp dynamically over time (optional, we use local to be fast then override via backend event)
  useEffect(() => {
    if (isHydrated) {
      fetch("/api/progress")
        .then(res => res.json())
        .then(data => {
            if (data.totalXp) {
               // Update global total if remote has more XP (due to cross-device sync)
               setProgress(p => (p.xp < data.totalXp ? { ...p, xp: data.totalXp } : p));
            }
        })
        .catch(console.error);
    }
  }, [isHydrated]);

  // Save to local storage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("el_progress", JSON.stringify(progress));
      localStorage.setItem("el_vocabulary", JSON.stringify(vocabulary));
    }
  }, [progress, vocabulary, isHydrated]);

  const addXp = (amount: number, reason: string = "general") => {
    // Fire and forget to the database
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: reason, xp: amount })
    }).catch(console.error);

    setProgress((p) => {
      let newXp = p.xp + amount;
      let newLevel = p.level;
      if (newXp >= 200) newLevel = "Advanced"; // Simplified leveling
      else if (newXp >= 100) newLevel = "Intermediate";
      
      return { ...p, xp: newXp, level: newLevel };
    });
  };

  const completeLesson = (topic: string) => {
    setProgress((p) => {
      let newWeakTopics = [...p.weakTopics];
      // remove from weakTopics if we just learned it
      if (newWeakTopics.includes(topic)) {
         newWeakTopics = newWeakTopics.filter(t => t !== topic);
      }
      return { 
         ...p, 
         lessonsCompleted: p.lessonsCompleted + 1,
         lastLesson: topic,
         weakTopics: newWeakTopics
      };
    });
    addXp(20);
  };

  const addGrammarMistake = (mistake: string) => {
    setProgress(p => {
       const mistakes = [...p.grammarMistakes, mistake].slice(-10); // keep last 10
       return { ...p, grammarMistakes: mistakes };
    });
  };

  const updateSpeakingScore = (score: number, part?: number) => {
    setProgress(p => {
      // Create new progress object with updated part scores
      const newP = { ...p };
      
      if (part === 1) newP.speakingPart1 = score;
      if (part === 2) newP.speakingPart2 = score;
      if (part === 3) newP.speakingPart3 = score;
      
      // Calculate overall average
      const avg = Math.round(((newP.speakingPart1 + newP.speakingPart2 + newP.speakingPart3) / 3) * 10) / 10;
      newP.speakingScore = avg;

      // Update History Map for line charts
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const newHistory = [...p.scoreHistory];
      const latestEntry = newHistory[newHistory.length - 1];

      if (latestEntry && latestEntry.date === today) {
        latestEntry.speakingPart1 = newP.speakingPart1;
        latestEntry.speakingPart2 = newP.speakingPart2;
        latestEntry.speakingPart3 = newP.speakingPart3;
        latestEntry.speaking = avg;
      } else {
        if (newHistory.length >= 7) newHistory.shift();
        newHistory.push({
          date: today,
          speakingPart1: newP.speakingPart1,
          speakingPart2: newP.speakingPart2,
          speakingPart3: newP.speakingPart3,
          speaking: avg,
          writingTask1: latestEntry?.writingTask1 || 0,
          writingTask2: latestEntry?.writingTask2 || 0,
          writing: latestEntry?.writing || 0,
        });
      }

      newP.scoreHistory = newHistory;
      return newP;
    });
  };

  const updateWritingScore = (score: number, task?: number) => {
    setProgress(p => {
      // Create new progress object with updated task scores
      const newP = { ...p };
      
      if (task === 1) newP.writingTask1 = score;
      if (task === 2) newP.writingTask2 = score;
      
      // Calculate overall average
      const avg = Math.round(((newP.writingTask1 + newP.writingTask2) / 2) * 10) / 10;
      newP.writingScore = avg;

      // Update History Map for line charts
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const newHistory = [...p.scoreHistory];
      const latestEntry = newHistory[newHistory.length - 1];

      if (latestEntry && latestEntry.date === today) {
        latestEntry.writingTask1 = newP.writingTask1;
        latestEntry.writingTask2 = newP.writingTask2;
        latestEntry.writing = avg;
      } else {
        if (newHistory.length >= 7) newHistory.shift();
        newHistory.push({
          date: today,
          speakingPart1: latestEntry?.speakingPart1 || 0,
          speakingPart2: latestEntry?.speakingPart2 || 0,
          speakingPart3: latestEntry?.speakingPart3 || 0,
          speaking: latestEntry?.speaking || 0,
          writingTask1: newP.writingTask1,
          writingTask2: newP.writingTask2,
          writing: avg,
        });
      }

      newP.scoreHistory = newHistory;
      return newP;
    });
  };

  const calculateNextReview = (quality: string, repetitions: number): { interval: number, nextReviewDate: number, status: "learning" | "reviewing" | "mastered" } => {
    let newRepetitions = repetitions;
    let nextReviewDate = Date.now();

    const intervals = [10 / 1440, 1, 3, 7, 14, 30, 60]; // 10 minutes, 1 day, 3 days, 7 days...

    if (quality === "Again") {
      newRepetitions = 0;
    } else if (quality === "Hard") {
      newRepetitions = Math.max(1, newRepetitions - 1); // Drop interval by 1, min 1 day
    } else if (quality === "Good") {
      newRepetitions += 1;
    } else if (quality === "Easy") {
      newRepetitions += 2;
    }
    
    // Cap at max interval
    if (newRepetitions >= intervals.length) {
       newRepetitions = intervals.length - 1;
    }

    const interval = intervals[newRepetitions] || (10 / 1440);
    nextReviewDate += interval * 24 * 60 * 60 * 1000;
    
    let status: "learning" | "reviewing" | "mastered" = "learning";
    if (interval < 7) {
        status = "learning";
    } else if (interval >= 7 && interval <= 30) {
        status = "reviewing";
    } else {
        status = "mastered";
    }
    
    return { interval, nextReviewDate, status };
  };

  const reviewChunk = (id: string, quality: "Again" | "Hard" | "Good" | "Easy") => {
    setProgress(p => {
       const newChunks = [...p.chunkProgress];
       const idx = newChunks.findIndex(c => c.id === id);
       
       if (idx === -1) {
          // Chunk doesn't exist yet, we can't review it properly without the base data.
          // In a real app we'd fetch it, but here it's likely preloaded when learning starts.
          return p;
       }
       
       const c = newChunks[idx];
       const { interval, nextReviewDate, status } = calculateNextReview(quality, c.repetitions);
       
       newChunks[idx] = { 
          ...c, 
          repetitions: quality === "Again" ? 0 : c.repetitions + 1,
          interval,
          nextReviewDate,
          status
       };
       
       return { ...p, chunkProgress: newChunks, flashcardReviews: p.flashcardReviews + 1 };
    });
    addXp(5);
  };

  const reviewGrammar = (id: string, quality: "Again" | "Hard" | "Good" | "Easy") => {
    setProgress(p => {
       const newGrammar = [...p.grammarProgress];
       const idx = newGrammar.findIndex(g => g.id === id);
       
       if (idx === -1) return p;
       
       const g = newGrammar[idx];
       const { interval, nextReviewDate, status } = calculateNextReview(quality, g.repetitions);
       
       newGrammar[idx] = { 
          ...g, 
          repetitions: quality === "Again" ? 0 : g.repetitions + 1,
          interval,
          nextReviewDate,
          status
       };
       
       return { ...p, grammarProgress: newGrammar, flashcardReviews: p.flashcardReviews + 1 };
    });
    addXp(5);
  };

// In types/index.ts we added topic & level to VocabularyItem, so no specific type change needed here,
  // but let's review addWord to ensure it accepts them.
  const addWord = (wordData: Omit<VocabularyItem, "id" | "nextReviewDate" | "interval" | "easeFactor" | "repetitions" | "status">) => {
    const newWord: VocabularyItem = {
      ...wordData,
      id: Date.now().toString(),
      nextReviewDate: Date.now(),
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      status: "learning"
    };
    setVocabulary(v => [...v, newWord]);
    setProgress(p => ({ ...p, wordsLearned: p.wordsLearned + 1 }));
  };

  const reviewWord = (id: string, quality: "Again" | "Hard" | "Good" | "Easy") => {
    // Note: Find the word first to avoid putting side-effects (setProgress) inside setState updaters
    const targetWord = vocabulary.find(w => w.id === id);
    if (!targetWord) {
       // Also add XP for flashcard review
       addXp(5);
       setProgress(p => ({ ...p, flashcardReviews: p.flashcardReviews + 1 }));
       return;
    }

    let isWeak = false;
    let isMastered = false;

    setVocabulary(v => v.map(word => {
      if (word.id !== id) return word;

      let { repetitions = 0, status } = word;
      let interval = 0;
      let easeFactor = 2.5;
      let nextReviewDate = Date.now();

      if (quality === "Again") {
        repetitions = 0;
        interval = 0;
        status = "learning";
        isWeak = true;
      } else if (quality === "Hard") {
        repetitions = Math.max(1, repetitions);
        interval = 1;
        nextReviewDate += 24 * 60 * 60 * 1000; // 1 day
        status = "learning";
        isWeak = true;
      } else if (quality === "Good") {
        repetitions += 1;
        interval = 3;
        nextReviewDate += 3 * 24 * 60 * 60 * 1000; // 3 days
        status = "reviewing";
      } else if (quality === "Easy") {
        repetitions += 1;
        interval = 5;
        nextReviewDate += 5 * 24 * 60 * 60 * 1000; // 5 days
        status = "mastered";
        isMastered = true;
      }

      return { ...word, repetitions, interval, easeFactor, nextReviewDate, status };
    }));
    
    // Perform setProgress outside of the setVocabulary updater
    if (isWeak) {
       setProgress(p => ({
          ...p,
          weakWords: p.weakWords.includes(targetWord.word) ? p.weakWords : [...p.weakWords, targetWord.word]
       }));
    } else if (isMastered) {
       setProgress(p => ({
           ...p,
           weakWords: p.weakWords.filter(w => w !== targetWord.word)
       }));
    }
    
    // Add XP for flashcard review (Prompt says +5 XP)
    addXp(5);
    setProgress(p => ({ ...p, flashcardReviews: p.flashcardReviews + 1 }));
  };

  return (
    <GlobalStateContext.Provider value={{ progress, vocabulary, addXp, addWord, reviewWord, completeLesson, addGrammarMistake, updateSpeakingScore, updateWritingScore, reviewChunk, reviewGrammar, isHydrated }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
