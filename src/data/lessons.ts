import { Level } from "../types";

export interface LessonTopic {
  id: string;
  topic: string;
  level: Level;
  description: string;
  theme: "travel" | "work" | "daily" | "social" | "academic";
}

export const LESSON_TOPICS: LessonTopic[] = [
  // Beginner
  { id: "greetings", topic: "Greetings", level: "Beginner", description: "Learn how to say hello and goodbye.", theme: "social" },
  { id: "introducing-yourself", topic: "Introducing yourself", level: "Beginner", description: "Learn to tell people about who you are.", theme: "social" },
  { id: "ordering-food", topic: "Ordering food", level: "Beginner", description: "Learn how to order in a restaurant.", theme: "daily" },
  { id: "shopping", topic: "Shopping", level: "Beginner", description: "Vocabulary for buying things.", theme: "daily" },
  { id: "asking-directions", topic: "Asking for directions", level: "Beginner", description: "Never get lost in a new city.", theme: "travel" },
  { id: "daily-routines", topic: "Daily routines", level: "Beginner", description: "Talking about your day.", theme: "daily" },

  // Intermediate
  { id: "talking-work", topic: "Talking about work", level: "Intermediate", description: "Discuss your job and office life.", theme: "work" },
  { id: "making-plans", topic: "Making plans", level: "Intermediate", description: "Scheduling and arranging meetings.", theme: "social" },
  { id: "travel-conversations", topic: "Travel conversations", level: "Intermediate", description: "Dealing with airports and hotels.", theme: "travel" },
  { id: "phone-calls", topic: "Phone calls", level: "Intermediate", description: "Telephone etiquette and common phrases.", theme: "work" },
  
  // Advanced
  { id: "storytelling", topic: "Storytelling", level: "Advanced", description: "Telling engaging personal anecdotes.", theme: "social" },
  { id: "debates", topic: "Debates", level: "Advanced", description: "Expressing complex opinions and disagreeing politely.", theme: "academic" },
  { id: "problem-solving", topic: "Problem solving", level: "Advanced", description: "Negotiating and resolving conflicts.", theme: "work" }
];

export function getLessonPicksForUser(unlockedTopics: string[]) {
   // Return a mix of unlocked topics and the very next locked topic
   return LESSON_TOPICS.filter(lt => unlockedTopics.includes(lt.topic) || unlockedTopics.includes(lt.id));
}
