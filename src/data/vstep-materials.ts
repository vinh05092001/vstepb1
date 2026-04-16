// src/data/vstep-materials.ts

export const MEMORIZE_DATA = {
  speaking_templates: [
    {
      title: "Part 1 - Standard Answer (Answer + Reason + Example)",
      structures: [
        "Yes, I really like [topic].",
        "It is interesting because [reason].",
        "For example, I often [activity]."
      ],
      example: {
        question: "Do you like sports?",
        answer: "Yes, I really like sports because they help me stay healthy. For example, I often play badminton with my friends in the evening."
      }
    },
    {
      title: "Part 2 - Solution Discussion",
      structures: [
        "**Introduction:** I am going to talk about the situation. [Read the situation]. I believe that all options have their own advantages and disadvantages; however, after considering three options, I would say that [Option A] is the best choice.",
        "**Body (Pros of Choice):** Firstly, it is convenient and suitable. Secondly, this option may bring me/him/them a wide range of benefits. Thirdly, I/He/She like(s)... Finally, it is [positive adjective]. Therefore, they are the reasons why I agree with this solution.",
        "**Body (Cons of Others):** And there are some reasons why I don't choose the other options. [Option B] isn't my choice because it is boring and inconvenient. Moreover, I am not interested in... Finally, it is [negative adjective]. I don't think [Option C] is the suitable choice because it lacks suitability and convenience. Moreover, I am not a big fan of... Finally, it is [negative adjective]. Hence, they are the reasons why I do not agree with these solutions.",
        "**Conclusion:** To sum up, if I were in the situation, I would go for [Option A] because it is the most suitable."
      ],
      example: {
        question: "Situation: You have to choose between a laptop, a smartphone, or a tablet for studying.",
        answer: "I am going to talk about the situation..."
      }
    },
    {
      title: "Part 3 - Topic Development",
      structures: [
        "**Introduction:** It is a fact that [Broad Topic] plays an important role in our lives. Nowadays, an increasing number of people are concerned about [Exam Topic]. Today, I am going to talk about the topic [Repeat the exact exam prompt].",
        "**Body 1:** Firstly, it is the fact that [Main Idea 1]. [Details/Examples]. Therefore, it is good for / bad for...",
        "**Body 2:** Secondly, it is obvious that [Main Idea 2]. [Details/Examples]. Hence, it is beneficial to / harmful to people.",
        "**Body 3:** Finally, we cannot deny that [Main Idea 3]. [Details/Examples]. Thus, it has positive / negative effects on...",
        "**Your Own Idea:** I think that 3 ideas are comprehensive. I cannot think of other ideas.",
        "**Conclusion:** To sum up, I strongly believe that [Repeat the exact exam prompt]."
      ],
      example: {
        question: "Topic: The benefits of reading books.",
        answer: "It is a fact that reading plays an important role in our lives..."
      }
    }
  ],
  memorization_phrases: {
    adjectives: [
      { type: "Positive (Khen)", words: "time-saving, quick, fast, convenient, cheap/affordable, easy, quiet, interesting/fun, popular, comfortable, effective, healthy, safe, clean/hygienic, big/huge, practical" },
      { type: "Negative (Chê)", words: "time-consuming, slow, inconvenient, expensive/costly, difficult, noisy, boring, unpopular, uncomfortable, ineffective, unhealthy, unsafe, dirty/not hygienic, small, impractical" }
    ],
    liking: [
      { phrase: "be into", context: "I am into reading books." },
      { phrase: "be interested in", context: "She is interested in learning English." },
      { phrase: "be keen on", context: "He is keen on playing sports." },
      { phrase: "be passionate about", context: "I am passionate about technology." },
      { phrase: "be enthusiastic about", context: "We are enthusiastic about the new project." },
      { phrase: "be crazy about", context: "My brother is crazy about football." },
      { phrase: "be a big fan of", context: "I am a big fan of action movies." },
      { phrase: "be fond of", context: "They are fond of traveling." },
      { phrase: "love", context: "I love spending time with my family." },
      { phrase: "adore", context: "She adores her pet dog." },
      { phrase: "enjoy + Ving", context: "I enjoy listening to music." }
    ],
    alone_or_with_people: [
      {
         answer: "with other people",
         reasons: [
           "I love sharing moments with people.",
           "I want to spend quality time with my friends and family."
         ]
      }
    ],
    past_vs_present: [
      {
         answer: "No change",
         reasons: [
           "because I still like/love it.",
           "because it is still my favorite activity."
         ]
      }
    ],
    idea_development: [
      { type: "Adjective", structure: "Topic + to be + adj", example: "Reading is fun. It is interesting." },
      { type: "Noun", structure: "People can have + N", example: "People can have relaxation. People can relax." },
      { type: "Verb", structure: "Topic + helps people + V", example: "Reading helps people reduce stress." },
      { type: "Adj + Noun", structure: "N + to be + adj", example: "The air is fresh." }
    ]
  },
  grammar_patterns: [
    {
      structure: "S (V-ing) + to be + adj",
      description: "Using a gerund as a subject",
      examples: [
        "Reading is interesting.",
        "Learning English is difficult."
      ]
    },
    {
      structure: "S + to be + a/an + Noun",
      description: "Describing what a subject is",
      examples: [
        "I am a student.",
        "Danang is a city."
      ]
    },
    {
      structure: "S + V",
      description: "Simple Subject + Verb statement",
      examples: [
        "I like badminton.",
        "We go to school.",
        "He likes music."
      ]
    }
  ],
  letter_templates: {
    informal: {
      type: "Informal Letter",
      greeting: "Dear [Name],",
      opening: [
        "I was very delighted to receive your letter.",
        "How have you been doing?",
        "I hope everything is going well with you.",
        "I am so sorry for not writing to you for so long because I have been working hard for the coming exam."
      ],
      body: "I am going to tell you about... (Answer + Reason + Example)",
      ending: [
        "That is all for now.",
        "Please give my love to your family and let them know I have been thinking of them.",
        "Drop me a line if you have a moment.",
        "I look forward to hearing from you."
      ],
      sign_off: "Best regards,"
    },
    formal: {
      type: "Formal Letter",
      greeting: [
        "Dear Sir/Madam, (if no name or gender is known)",
        "Dear Sir, or Dear Madam, (if gender is known)",
        "Dear Mr. David Beckham, Dear Ms. Victoria Beckham, (if name and gender are known)"
      ],
      opening: [
        "Introduce yourself: (name, age, from, family, job)",
        "Introduce the topic: (copy exactly from the prompt)",
        "Purpose of writing: I am writing to...",
        "+ give you some information about...",
        "+ complain about...",
        "+ apply for the job..."
      ],
      body: [
        "ANSWER ALL REQUIREMENTS OF THE PROMPT"
      ],
      ending: [
        "Should you require any further information or have any questions, please do not hesitate to contact me at 0988215886 or via email at 20tenglish@gmail.com.",
        "I am looking forward to hearing from you. Please write to me soon."
      ],
      sign_off: "Best regards,"
    },
    vocabulary: [
      "I am very happy to get your letter.",
      "How are you?",
      "I am sorry for not writing to you for so long.",
      "I have been so busy these days.",
      "I have been working hard for the coming exam.",
      "I am looking forward to hearing from you.",
      "Write to me soon."
    ]
  }
};
