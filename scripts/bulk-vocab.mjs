import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local natively
let envContent = '';
try {
  envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
} catch (e) {
  try {
    envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
  } catch (err) { }
}

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const geminiKeys = [
  envVars['GEMINI_KEY_1'] || process.env.GEMINI_KEY_1,
  envVars['GEMINI_KEY_2'] || process.env.GEMINI_KEY_2,
  envVars['GEMINI_KEY_3'] || process.env.GEMINI_KEY_3,
].filter(Boolean);

let currentGeminiKeyIndex = 0;

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

async function callAIAggressive(prompt) {
  if (geminiKeys.length === 0) throw new Error("No GEMINI_KEY supplied.");
  let attempts = 0;

  while (attempts < geminiKeys.length) {
    try {
      const currentKey = geminiKeys[currentGeminiKeyIndex];
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${currentKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: "You are an expert English curriculum designer for VSTEP." }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) throw new Error("429 Rate Limit");
        throw new Error("Fetch failed (" + res.status + "): " + errText);
      }

      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.log(`  [Rotate] Key ${currentGeminiKeyIndex + 1} hit limit. Rotating... Reason: ` + error.message);
      currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % geminiKeys.length;
      attempts++;
    }
  }
  throw new Error("All rotated tokens are exhausted! Backing off...");
}

async function generateBatch(topic, level, count) {
  const prompt = `
I need you to generate exactly ${count} highly useful English vocabulary items for the Topic: **${topic}**, targeting CEFR Level: **${level}**.

REQUIREMENTS:
1. Mix base words, collocations, phrasal_verbs, and expressions.
2. Every item must map to the exact JSON schema provided.
3. Output ONLY a valid JSON array. No markdown blocks like \`\`\`json.

SCHEMA FOR EACH ITEM:
{
  "phrase": "nuclear family",
  "base_word": "family",
  "word_type": "noun", // Or "verb", "adjective", "adverb"
  "type": "collocation", // Or "word", "phrasal_verb", "expression"
  "topic": "${topic}",
  "subcategory": "relationships", 
  "level": "${level}",
  "ipa": "/ˈnuːkliər ˈfæməli/",
  "meaning_vi": "gia đình hạt nhân",
  "explanation_vi": "Gia đình chỉ bao gồm bố mẹ và con cái sống chung.",
  "example": "I grew up in a traditional nuclear family."
}

Generate EXACTLY ${count} objects inside the array: [ { ... } ]
`;

  try {
    const responseText = await callAIAggressive(prompt);
    let cleanText = responseText.trim();
    if (cleanText.startsWith('\`\`\`json')) cleanText = cleanText.substring(7);
    if (cleanText.startsWith('\`\`\`')) cleanText = cleanText.substring(3);
    if (cleanText.endsWith('\`\`\`')) cleanText = cleanText.substring(0, cleanText.length - 3);

    return JSON.parse(cleanText);
  } catch (error) {
    console.error(`Error generating ${topic}/${level}:`, error.message);
    return [];
  }
}

async function main() {
  const TARGET_AI_ITEMS = 2300;
  const outputPath = path.join(__dirname, 'mass_vocab_real.json');
  let allGeneratedItems = [];
  if (fs.existsSync(outputPath)) {
    try {
      allGeneratedItems = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    } catch (e) { }
  }

  console.log(`Resuming Vocabulary Data Generation... Current Checkpoint: ${allGeneratedItems.length} | Target: ${TARGET_AI_ITEMS}`);

  while (allGeneratedItems.length < TARGET_AI_ITEMS) {
    const dist = CEFR_DISTRIBUTION[Math.floor(Math.random() * CEFR_DISTRIBUTION.length)];
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const batchCount = Math.min(50, TARGET_AI_ITEMS - allGeneratedItems.length);

    console.log(`Generating ${batchCount} items for ${topic} at ${dist.level}... (Current: ${allGeneratedItems.length})`);
    const newlyGenerated = await generateBatch(topic, dist.level, batchCount);

    if (Array.isArray(newlyGenerated) && newlyGenerated.length > 0) {
      // Simple deduplication based on phrase
      const currentPhrases = new Set(allGeneratedItems.map(i => i.phrase ? i.phrase.toLowerCase() : ''));
      const uniqueNew = newlyGenerated.filter(i => i.phrase && !currentPhrases.has(i.phrase.toLowerCase()));

      allGeneratedItems.push(...uniqueNew);
      fs.writeFileSync(outputPath, JSON.stringify(allGeneratedItems, null, 2));
      console.log(`  -> Success! Added ${uniqueNew.length} unique chunks to vault. Total: ${allGeneratedItems.length}/${TARGET_AI_ITEMS}`);
    } else {
      console.log("  -> API Timeout limit reached. Retrying instantly in 4 seconds...");
    }
    // Delay to respect strict ratelimits smoothly
    await new Promise(r => setTimeout(r, 4500));
  }
  console.log("✅ Massive 2300-Vocabulary Target Reached! The background loop will now exit.");
}

main().catch(console.error);
