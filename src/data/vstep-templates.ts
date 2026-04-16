export interface VstepTemplate {
  id: string;
  title: string;
  type: "speaking_part2" | "speaking_part3" | "writing_informal" | "writing_formal";
  content: string[];
}

export const VSTEP_TEMPLATES: VstepTemplate[] = [
  {
    id: "sp2",
    title: "Speaking Part 2: Situation Selection",
    type: "speaking_part2",
    content: [
      "[INTRO]",
      "I am going to talk about the situation.",
      "(Then read the situation summarizing the prompt)",
      "",
      "[CHOICE STATEMENT]",
      "All three options are reasonable but when choosing among three options, I believe that [option A] is the best choice because of the following reasons.",
      "",
      "[BODY PRAISE]",
      "Firstly, it is convenient and suitable.",
      "Secondly, this option may bring me a wide range of benefits because when PMK.",
      "Thirdly, I like this option.",
      "Finally, it is fast / safe / comfortable / interesting.",
      "",
      "[EXPLAINING REJECTIONS]",
      "(Explain why the other two options are not suitable)",
      "",
      "[CONCLUSION]",
      "Therefore, they are the reasons why I agree with this solution."
    ]
  },
  {
    id: "sp3",
    title: "Speaking Part 3: Topic Development",
    type: "speaking_part3",
    content: [
      "[INTRO]",
      "It is a fact that [topic] plays an important role in our lives.",
      "",
      "[BODY]",
      "Firstly... because...",
      "Secondly... For example...",
      "Finally... This is because...",
      "",
      "[OWN IDEA]",
      "I think that 3 ideas are comprehensive. I cannot think of other ideas.",
      "",
      "[CONCLUSION]",
      "To sum up, I strongly believe that [topic statement]."
    ]
  },
  {
    id: "wr_informal",
    title: "Writing: Informal Letter",
    type: "writing_informal",
    content: [
      "[GREETING]",
      "Dear [Name],",
      "",
      "[OPENING]",
      "I was delighted to receive your letter. How have you been doing?",
      "I hope everything is going well with you.",
      "I am so sorry for not writing to you for so long because I have been working hard for the coming exam.",
      "",
      "[BODY]",
      "I am going to tell you about ...",
      "",
      "[ENDING]",
      "That is all for now.",
      "Please give my love to your family and let them know I have been thinking of them.",
      "Drop me a line if you have a moment.",
      "I look forward to hearing from you.",
      "",
      "[SIGN OFF]",
      "Best regards,"
    ]
  },
  {
    id: "wr_formal",
    title: "Writing: Formal Letter",
    type: "writing_formal",
    content: [
      "[GREETING]",
      "Dear Sir/Madam,",
      "",
      "[OPENING]",
      "My name is [name].",
      "I am [age] years old.",
      "I am from [city].",
      "I am a [job].",
      "",
      "[PURPOSE]",
      "I am writing to ...",
      "",
      "[BODY]",
      "(Answer all questions in the prompt directly)",
      "",
      "[ENDING]",
      "I am looking forward to hearing from you.",
      "",
      "[SIGN OFF]",
      "Best regards,"
    ]
  }
];

export const VSTEP_SPEAKING_P1_TOPICS = [
  "hometown", "hobbies", "education", "daily activities", 
  "friends", "travel", "sports", "food"
];

export const VSTEP_SPEAKING_P3_TOPICS = [
  "education", "technology", "health", "environment", 
  "transportation", "reading", "social media", "sports", 
  "family", "culture"
];
