import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const GEMINI_KEY = '';
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const data = fs.readFileSync('mindmap_dataset.txt', 'utf8').split(/\n(?=\d+ )/);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  let allVocab = [];
  
  for (const chunk of data) {
      if(!chunk.trim()) continue;
      const lines = chunk.trim().split('\n');
      const topicMatch = lines[0].match(/^\d+\s+(.*)$/);
      if(!topicMatch) continue;
      const topic = topicMatch[1].trim().toLowerCase();
      console.log(`Processing topic: ${topic}`);
      
      const prompt = `Parse this mindmap section into a JSON array of vocabulary objects.
Section text:
${chunk}

For each phrase listed under a category, output exactly this JSON structure:
{
  "topic": "${topic}",
  "category": string (e.g. "Advantages", "Disadvantages", "Places", etc. whatever is listed before the phrases),
  "word": string (the exact phrase, e.g. "be safer"),
  "meaning_vi": string (accurate Vietnamese translation of the phrase),
  "usage_vi": string (Short grammatical usage note in Vietnamese explaining how to use this phrase correctly in VSTEP B1 speaking, e.g., "Cáº¥u trÃºc: S + be safer than... DÃ¹ng Ä‘á»ƒ so sÃ¡nh lá»£i Ã­ch.", "DÃ¹ng vá»›i giá»›i tá»«: spend money ON..."),
  "example_en": string (a high-quality B1/B2 English example sentence using the phrase naturally)
}`;

       try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
         });
         
         const jsonArray = JSON.parse(response.text);
         allVocab.push(...jsonArray);
         console.log(`-> Mapped ${jsonArray.length} phrases for ${topic}`);
         await sleep(5000); // 5 sec delay
       } catch (e) {
         console.error(`Error on ${topic}:`, e);
       }
  }
  
  const topics = [...new Set(allVocab.map(v => v.topic))];
  
  const tsContent = `import { VocabularyItem } from "../types";\n\n` + 
  `export const VSTEP_TOPICS = ${JSON.stringify(topics)};\n\n` +
  `export const INITIAL_VOCABULARY: VocabularyItem[] = ` + JSON.stringify(allVocab.map(v => ({
      id: (v.word || '').replace(/ /g, '-').toLowerCase() + '-' + Math.floor(Math.random()*10000), 
      word: v.word || '',
      phonetic: '',
      meaning_en: '',
      meaning_vi: v.meaning_vi || '',
      example_en: v.example_en || '',
      example_vi: '',
      usage_vi: v.usage_vi || '',
      speaking_sentence: '',
      topic: v.topic || '',
      category: v.category || '',
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
  console.log("Successfully wrote all records to src/data/vocabulary.ts");
}

run();

