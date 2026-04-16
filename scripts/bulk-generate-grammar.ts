import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { generateAIFallback } from '../src/lib/ai-fallback';

/**
 * 95 Items Bulk Grammar Generator for VSTEP
 * Run with: npx ts-node scripts/bulk-generate-grammar.ts
 */

const CATEGORIES = [
  { en: "Sentence Frames", vi: "Khung câu mẫu" },
  { en: "Connectors", vi: "Từ nối" },
  { en: "Grammar Structures", vi: "Cấu trúc ngữ pháp" },
  { en: "Quantifiers", vi: "Lượng từ" },
  { en: "Comparatives", vi: "So sánh hơn / so sánh nhất" },
  { en: "Relative Clauses", vi: "Mệnh đề quan hệ" }
];

const CEFR_LEVELS = ['A2', 'B1', 'B2'];

async function generateGrammarBatch(category: string, catVi: string, level: string, count: number) {
  const prompt = `
You are an expert English grammar curriculum designer for VSTEP (Vietnamese Standardized Test of English Proficiency).
Generate exactly ${count} highly useful English grammar patterns for Category: **${category}**, Level: **${level}**.

SCHEMA FOR EACH ITEM:
{
  "pattern": "If + present simple, ... will + infinitive",
  "category": "${category}",
  "category_vi": "${catVi}",
  "level": "${level}",
  "example": "If it rains, we will stay at home.",
  "explanation_vi": "Sử dụng để nói về các sự việc có thể xảy ra trong tương lai (Câu điều kiện loại 1).",
  "speakingExample": "If I pass the VSTEP exam, I will apply for my master's degree."
}

Generate EXACTLY ${count} patterns inside a JSON array: [ { ... } ]
Do not wrap in \`\`\`json. Output raw JSON only.
`;

  try {
    let responseText = await generateAIFallback(prompt, 'generate-vocab');
    
    // Clean up
    responseText = responseText.trim();
    if (responseText.startsWith('```json')) responseText = responseText.substring(7);
    if (responseText.startsWith('```')) responseText = responseText.substring(3);
    if (responseText.endsWith('```')) responseText = responseText.substring(0, responseText.length - 3);

    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Error generating Grammar ${category}/${level}:`, error);
    return [];
  }
}

async function main() {
  const TARGET = 95;
  const ITEMS_PER_CAT = Math.ceil(TARGET / CATEGORIES.length);
  let allGeneratedItems = [];
  
  console.log(`Starting generation for Grammar items...`);
  
  for (const cat of CATEGORIES) {
     console.log(`\n=== Category: ${cat.en} ===`);
     
     // Split level requests evenly
     for (const level of CEFR_LEVELS) {
         const count = Math.ceil(ITEMS_PER_CAT / CEFR_LEVELS.length);
         console.log(` Generating ${count} patterns at ${level}...`);
         
         const newlyGenerated = await generateGrammarBatch(cat.en, cat.vi, level, count);
         if (Array.isArray(newlyGenerated) && newlyGenerated.length > 0) {
            allGeneratedItems.push(...newlyGenerated);
            console.log(`  -> Success! Total generated so far: ${allGeneratedItems.length}`);
         }
         
         await new Promise(r => setTimeout(r, 4000));
     }
  }

  const outputPath = path.join(__dirname, 'mass_grammar.json');
  fs.writeFileSync(outputPath, JSON.stringify(allGeneratedItems, null, 2));
  console.log(`\n✅ Generated ${allGeneratedItems.length} grammar patterns. Data saved to ${outputPath}.`);
}

main().catch(console.error);
