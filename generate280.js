import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const GEMINI_KEY = '';
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const topics = ["education", "health", "technology", "environment", "transportation", "family", "travel", "work", "food", "culture", "sports", "communication", "reading", "daily life"];

async function run() {
  let allVocab = [];
  console.log("Starting to generate 280 VSTEP words...");
  
  // Use Promise.all with chunks or just sequential to avoid rate limits? 
  // Sequential is safer for rate limits since we are generating 14 times.
  for (const topic of topics) {
     console.log(`Generating 20 words for ${topic}...`);
     try {
       const prompt = `Return a JSON array of exactly 20 advanced B1/B2 English vocabulary words for the topic '${topic}'.
       Each object must have exactly these keys: topic ("${topic}"), word, phonetic, meaning_en, meaning_vi, example_en, example_vi, speaking_sentence. Make the Vietnamese translations accurate.`;
       
       const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
          }
       });
       
       const jsonArray = JSON.parse(response.text);
       allVocab.push(...jsonArray);
       console.log(`-> Success: ${topic}`);
     } catch (e) {
       console.error(`Error on ${topic}:`, e.message);
     }
  }
  
  const tsContent = `import { VocabularyItem } from "../types";\n\n` + 
  `export const VSTEP_TOPICS = ${JSON.stringify(topics)};\n\n` +
  `export const INITIAL_VOCABULARY: VocabularyItem[] = ` + JSON.stringify(allVocab.map(v => ({
      id: (v.word || '').replace(/ /g, '-').toLowerCase() + '-' + Math.floor(Math.random()*1000), 
      word: v.word || '',
      phonetic: v.phonetic || '',
      meaning_en: v.meaning_en || '',
      meaning_vi: v.meaning_vi || '',
      example_en: v.example_en || '',
      example_vi: v.example_vi || '',
      speaking_sentence: v.speaking_sentence || '',
      topic: v.topic || '',
      level: "Intermediate", 
      collocations: []
  })), null, 2) + `;\n\n` +
  `export const getRandomVocabulary = (count: number = 5, filterTopic?: string, filterLevel?: string) => {\n` +
  `  let pool = [...INITIAL_VOCABULARY];\n` +
  `  if (filterTopic) pool = pool.filter(v => v.topic === filterTopic);\n` +
  `  if (filterLevel) pool = pool.filter(v => v.level === filterLevel);\n` +
  `  return pool.sort(() => 0.5 - Math.random()).slice(0, count);\n` +
  `};\n`;
  
  fs.writeFileSync('src/data/vocabulary.ts', tsContent);
  console.log("Successfully wrote all 280 records to src/data/vocabulary.ts");
}

run();

