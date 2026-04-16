export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  meaning_en: string;
  meaning_vi: string;
  example_en: string;
  example_vi: string;
  speaking_sentence: string;
  topic: string; // VSTEP topic category
  category?: string; // Sub-category from mindmap
  usage_vi?: string; // Grammatical usage in Vietnamese
  level: string; // E.g. "Intermediate"
  collocations?: string[];
  
  // Spaced Repetition States
  nextReviewDate?: number; 
  interval?: number;
  easeFactor?: number;
  repetitions?: number;
  status?: "learning" | "reviewing" | "mastered";
}

export interface ChunkItem {
  id: string; // usually the phrase itself encoded
  topic: string;
  phrase: string;
  base_word?: string;
  word_type?: string;
  meaning_vi: string;
  explanation_vi?: string;
  ipa?: string;
  type?: string;
  example_en?: string;
  example_vi?: string;
  
  // Spaced Repetition States
  nextReviewDate: number; 
  interval: number;
  easeFactor: number;
  repetitions: number;
  status: "learning" | "reviewing" | "mastered";
}

export interface GrammarPatternItem {
  id: string; // The pattern
  pattern: string;
  example: string;
  example_vi?: string;
  category?: string;
  category_vi?: string;
  explanation_vi?: string;
  speakingExample?: string;
  
  // Spaced Repetition States
  nextReviewDate: number; 
  interval: number;
  easeFactor: number;
  repetitions: number;
  status: "learning" | "reviewing" | "mastered";
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: Level;
  description: string;
  explanation: string;
  exampleSentences: { sentence: string; translation?: string; explanation?: string }[];
  commonMistakes: { wrong: string; right: string; explanation: string }[];
  practiceExercises: { question: string; options: string[]; answer: string; explanation: string }[];
  conversationExample: { role: string; text: string }[];
}

export interface UserProgress {
  level: Level;
  xp: number;
  wordsLearned: number;
  streak: number;
  lastActiveDate: string | null;
  lessonsCompleted: number;
  flashcardReviews: number;
  achievements: string[];
  unlockedTopics: string[]; // Topics user has access to
  weakWords: string[];
  weakTopics: string[];
  grammarMistakes: string[];
  speakingPart1: number;
  speakingPart2: number;
  speakingPart3: number;
  speakingScore: number;
  writingTask1: number;
  writingTask2: number;
  writingScore: number;
  scoreHistory: { 
    date: string, 
    speaking: number, 
    writing: number,
    speakingPart1: number,
    speakingPart2: number,
    speakingPart3: number,
    writingTask1: number,
    writingTask2: number,
  }[];
  lastLesson: string;
  chunkProgress: ChunkItem[];
  grammarProgress: GrammarPatternItem[];
}
