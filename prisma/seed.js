const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const TOPICS = [
  "Daily Conversation", "Restaurant", "Travel", "Shopping",
  "Work", "Technology", "Emotions", "Phrasal Verbs", "Common Expressions"
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

async function main() {
  console.log("Cleaning database...");
  await prisma.lessonVocabulary.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.vocabulary.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.grammar.deleteMany();
  await prisma.progress.deleteMany();

  console.log("Seeding Database...");

  // 1. GENERATE 60 GRAMMAR LESSONS
  console.log("Generating 60 Grammar lessons...");
  const grammars = [];
  for (let i = 1; i <= 60; i++) {
    const level = LEVELS[i % 3];
    const grammar = await prisma.grammar.create({
      data: {
        title: `Grammar Point ${i}: Present Simple vs Continuous`,
        explanation: `This is the explanation for grammar point ${i}. It is meant for ${level} students.`,
        examples: JSON.stringify([
          `I play tennis (Grammar ${i})`,
          `I am playing tennis right now (Grammar ${i})`
        ]),
        level,
      }
    });
    grammars.push(grammar);
  }

  // 2. GENERATE 3000 VOCABULARY WORDS
  console.log("Generating 3000 Vocabulary words...");
  const vocabularies = [];
  for (let i = 1; i <= 3000; i++) {
    const topic = TOPICS[i % TOPICS.length];
    const level = LEVELS[i % 3];
    vocabularies.push({
      word: `Word${i}`,
      meaning: `The meaning of Word${i}`,
      exampleSentence: `This is an example sentence using Word${i}.`,
      pronunciation: `/wɜːrd${i}/`,
      topic,
      difficulty: level,
    });
  }
  
  await prisma.vocabulary.createMany({ data: vocabularies });
  
  const allVocabs = await prisma.vocabulary.findMany({ select: { id: true, difficulty: true } });

  // 3. GENERATE 200 CONVERSATION LESSONS
  console.log("Generating 200 Lessons...");
  for (let i = 1; i <= 200; i++) {
    const level = LEVELS[i % 3];
    const grammarId = grammars[i % grammars.length].id;
    
    const lesson = await prisma.lesson.create({
      data: {
        topic: `Conversation Topic ${i}`,
        level,
        grammarId,
      }
    });

    const vocabLinks = [];
    for (let j = 0; j < 5; j++) {
      const v = allVocabs[(i * 5 + j) % allVocabs.length];
      vocabLinks.push({
        lessonId: lesson.id,
        vocabularyId: v.id,
      });
    }

    await prisma.lessonVocabulary.createMany({ data: vocabLinks });
  }

  // 4. GENERATE SOME INITIAL FLASHCARDS FOR THE USER
  console.log("Generating initial Flashcards...");
  const flashcards = [];
  for (let i = 0; i < 20; i++) {
    flashcards.push({
      vocabularyId: allVocabs[i].id,
      difficulty: 0,
      nextReview: new Date(),
    });
  }
  await prisma.flashcard.createMany({ data: flashcards });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
