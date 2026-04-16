import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envContent = '';
try { envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8'); } 
catch (e) { try { envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8'); } catch(err) {} }

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

const GRAMMAR_CATEGORIES = [
  { category: "Sentence Frames", category_vi: "Cấu trúc câu cố định" },
  { category: "Connectors", category_vi: "Từ nối" },
  { category: "Grammar Structures", category_vi: "Cấu trúc ngữ pháp cơ bản" },
  { category: "Quantifiers", category_vi: "Lượng từ" },
  { category: "Comparatives", category_vi: "So sánh hơn / nhất" },
  { category: "Relative Clauses", category_vi: "Mệnh đề quan hệ" },
  { category: "Conditionals", category_vi: "Câu điều kiện" },
  { category: "Passive Voice", category_vi: "Câu bị động" },
  { category: "Modal Verbs", category_vi: "Động từ khuyết thiếu" },
  { category: "Reported Speech", category_vi: "Câu tường thuật" }
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
                    systemInstruction: { parts: [{ text: "You are an expert English curriculum designer for VSTEP." }]},
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

async function generateBatch(catObj, level, count) {
  const prompt = `
Generate exactly ${count} highly useful VSTEP English Grammar Patterns for the category: **${catObj.category}** (${catObj.category_vi}), targeting CEFR Level: **${level}**.

REQUIREMENTS:
1. Provide highly practical patterns used in VSTEP Speaking and Writing.
2. Output ONLY a valid JSON array. No markdown blocks like \`\`\`json.
3. Maps exactly to the schema.

SCHEMA FOR EACH ITEM:
{
  "pattern": "Would you mind + V-ing...?",
  "category": "${catObj.category}",
  "category_vi": "${catObj.category_vi}",
  "level": "${level}",
  "example": "Would you mind helping me with this report?",
  "explanation_vi": "Cấu trúc dùng để yêu cầu ai đó làm gì một cách lịch sự."
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
    console.error(`Error generating ${catObj.category}/${level}:`, error.message);
    return [];
  }
}

async function main() {
  const TARGET_AI_ITEMS = 95; 
  const outputPath = path.join(__dirname, 'mass_grammar_real.json');
  let allGeneratedItems = [];
  if (fs.existsSync(outputPath)) {
    try {
      allGeneratedItems = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    } catch(e){}
  }

  console.log(`Resuming Grammar Data Generation... Current: ${allGeneratedItems.length} | Target: ${TARGET_AI_ITEMS}`);

  while (allGeneratedItems.length < TARGET_AI_ITEMS) {
     const dist = CEFR_DISTRIBUTION[Math.floor(Math.random() * CEFR_DISTRIBUTION.length)];
     const catObj = GRAMMAR_CATEGORIES[Math.floor(Math.random() * GRAMMAR_CATEGORIES.length)];
     const batchCount = Math.min(5, TARGET_AI_ITEMS - allGeneratedItems.length);
     
     console.log(`Generating ${batchCount} items for ${catObj.category} at ${dist.level}... (Current: ${allGeneratedItems.length})`);
     
     const newlyGenerated = await generateBatch(catObj, dist.level, batchCount);
     if (Array.isArray(newlyGenerated) && newlyGenerated.length > 0) {
         const currentPatterns = new Set(allGeneratedItems.map(i => i.pattern ? i.pattern.toLowerCase() : ''));
         const uniqueNew = newlyGenerated.filter(i => i.pattern && !currentPatterns.has(i.pattern.toLowerCase()));
         
         allGeneratedItems.push(...uniqueNew);
         fs.writeFileSync(outputPath, JSON.stringify(allGeneratedItems, null, 2));
         console.log(`  -> Success! Added ${uniqueNew.length} unique grammar patterns. Total: ${allGeneratedItems.length}/${TARGET_AI_ITEMS}`);
     } else {
         console.log("  -> Timeout limit reached. Pausing, returning in 4sec...");
     }
     await new Promise(r => setTimeout(r, 4500));
  }
  console.log("✅ Strict 95-Grammar Target Reached! The background loop will now exit.");
}

main().catch(console.error);
