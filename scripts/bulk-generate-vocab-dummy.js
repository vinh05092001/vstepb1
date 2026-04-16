import fs from 'fs';
import path from 'path';

/**
 * 2300 Items Dummy Bulk Generator for VSTEP
 * Run with: npx ts-node scripts/bulk-generate-vocab-dummy.ts
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

const BASE_WORDS = ["advantage", "system", "increase", "reduce", "develop", "protect", "impact", "effect", "benefit", "risk", "environment", "budget", "policy", "project", "strategy", "technology", "community", "research", "process", "result"];

async function main() {
  const TOTAL_TARGET = 2300;
  let allGeneratedItems = [];
  
  console.log(`Starting DUMMY generation for ${TOTAL_TARGET} items...`);
  
  for (const dist of CEFR_DISTRIBUTION) {
     const levelTarget = Math.floor(TOTAL_TARGET * dist.percentage);
     const itemsPerTopic = Math.floor(levelTarget / TOPICS.length);
     
     console.log(`\n=== CEFR ${dist.level} (Target: ${levelTarget} items) ===`);
     
     for (const topic of TOPICS) {
         
         for (let i = 0; i < itemsPerTopic; i++) {
             // Every 5th item is a "word", the rest are "collocations" tied to a base word
             const base_word = BASE_WORDS[Math.floor(Math.random() * BASE_WORDS.length)];
             const isBase = i % 5 === 0;
             
             let phrase = isBase ? base_word : `adjective ${base_word} ${Math.floor(Math.random() * 1000)}`;
             
             allGeneratedItems.push({
                 phrase: phrase,
                 base_word: base_word,
                 word_type: "noun",
                 type: isBase ? "word" : "collocation",
                 topic: topic,
                 subcategory: "general",
                 level: dist.level,
                 ipa: `/${phrase.replace(/ /g, ' ')}/`,
                 meaning_vi: `Ý nghĩa giả định của ${phrase}`,
                 explanation_vi: `Đây là giải thích giả định cho cụm từ này trong bối cảnh ${topic}.`,
                 example: `This is a dummy example sentence for ${phrase}.`
             });
         }
     }
  }

  // Dump to bulk JSON file
  const outputPath = path.join(__dirname, 'mass_vocab.json');
  fs.writeFileSync(outputPath, JSON.stringify(allGeneratedItems, null, 2));
  console.log(`\n✅ Generated ${allGeneratedItems.length} dummy vocabulary chunks. Data saved to ${outputPath}.`);
}

main().catch(console.error);
