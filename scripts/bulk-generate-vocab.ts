import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { generateAIFallback } from '../src/lib/ai-fallback';

/**
 * 2300 Items Bulk Generator for VSTEP
 * Run with: npx ts-node scripts/bulk-generate-vocab.ts
 */

const CEFR_DISTRIBUTION = [
  { level: 'A2', percentage: 0.3 },
  { level: 'B1-core', percentage: 0.4 },
  { level: 'B1-advanced', percentage: 0.2 },
  { level: 'B2', percentage: 0.1 }
];

const TOPICS = [
  "Family", "Education", "Work", "Technology", "Health",
  "Environment", "Travel", "Culture", "Media", "Economy",
  "Hobbies", "City", "Science", "Law"
];

// In this run, we generate exactly 100 items per chunk (23 chunks = 2300 items)
// We will distribute the counts per topic per CEFR level
async function generateBatch(topic: string, level: string, count: number) {
  const prompt = `
You are an expert English curriculum designer for VSTEP (Vietnamese Standardized Test of English Proficiency).
I need you to generate exactly ${count} realistic, highly useful English vocabulary items for the Topic: **${topic}**, targeting CEFR Level: **${level}**.

REQUIREMENTS:
1. You must mix base words, collocations, phrasal_verbs, and expressions.
2. If you generate a base_word (noun, verb, adj), you MUST generate closely related collocations directly after it to build a natural grouped learning flow.
3. Every item must map to the exact JSON schema provided.
4. Output nothing but valid JSON. No markdown wrappings (\`\`\`json). Just the array brackets.

SCHEMA FOR EACH ITEM:
{
  "phrase": "nuclear family",
  "base_word": "family",
  "word_type": "noun", // Or "verb", "adjective", "adverb"
  "type": "collocation", // Or "word", "phrasal_verb", "expression"
  "topic": "${topic}",
  "subcategory": "relationships", // Categorize intelligently
  "level": "${level}",
  "ipa": "/ˈnuːkliər ˈfæməli/",
  "meaning_vi": "gia đình hạt nhân",
  "explanation_vi": "Gia đình chỉ bao gồm bố mẹ và con cái sống chung.",
  "example": "I grew up in a traditional nuclear family."
}

Generate EXACTLY ${count} objects inside the array: [ { ... }, { ... } ]
`;

  try {
    const responseText = await generateAIFallback(prompt, 'generate-vocab');
    
    // Clean up potential markdown formatting
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
    if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
    if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);

    const data = JSON.parse(cleanText);
    return data;
  } catch (error) {
    console.error(`Error generating ${topic}/${level}:`, error);
    return [];
  }
}

async function main() {
  const TOTAL_TARGET = 2300;
  const BATCH_SIZE = 50; // Smaller batches are safer to avoid token limits
  let allGeneratedItems = [];
  
  console.log(`Starting generation for ${TOTAL_TARGET} items...`);
  
  for (const dist of CEFR_DISTRIBUTION) {
     const levelTarget = Math.floor(TOTAL_TARGET * dist.percentage);
     // Divide level pieces evenly across topics
     const itemsPerTopic = Math.floor(levelTarget / TOPICS.length);
     
     console.log(`\n=== CEFR ${dist.level} (Target: ${levelTarget} items) ===`);
     
     for (const topic of TOPICS) {
         console.log(`Generating ${itemsPerTopic} items for ${topic} at ${dist.level}...`);
         
         // Split into safe batches
         let remaining = itemsPerTopic;
         while (remaining > 0) {
            const batchCount = Math.min(remaining, BATCH_SIZE);
            console.log(`  -> Requesting batch of ${batchCount}...`);
            
            const newlyGenerated = await generateBatch(topic, dist.level, batchCount);
            if (Array.isArray(newlyGenerated) && newlyGenerated.length > 0) {
               allGeneratedItems.push(...newlyGenerated);
               console.log(`  -> Success! Total generated so far: ${allGeneratedItems.length}`);
            } else {
               console.log(`  -> Failed or empty array returned. Retrying once...`);
               // Retry once
               const retryGenerated = await generateBatch(topic, dist.level, batchCount);
               if (Array.isArray(retryGenerated) && retryGenerated.length > 0) {
                  allGeneratedItems.push(...retryGenerated);
                  console.log(`  -> Retry Success! Total: ${allGeneratedItems.length}`);
               }
            }
            
            remaining -= batchCount;
            // Sleep to avoid rate limits
            await new Promise(r => setTimeout(r, 4000));
         }
     }
  }

  // Dump to bulk JSON file
  const outputPath = path.join(__dirname, 'mass_vocab.json');
  fs.writeFileSync(outputPath, JSON.stringify(allGeneratedItems, null, 2));
  console.log(`\n✅ Generated ${allGeneratedItems.length} vocabulary chunks. Data saved to ${outputPath}.`);
}

main().catch(console.error);
