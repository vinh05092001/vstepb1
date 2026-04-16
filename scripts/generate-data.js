const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// We use direct REST API fetch to avoid SDK version mismatches
const apiKey = process.env.GEMINI_KEY_1 || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Missing GEMINI_KEY_1 in .env.local");
    process.exit(1);
}

const TOPICS = [
  "Family", "Education", "Work", "Free time", "Travel", "Food", 
  "Health", "Technology", "Transportation", "Environment", 
  "Shopping", "Sports", "Music", "Future plans"
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function generateChunksForTopic(topic) {
    console.log(`Generating 50 chunks for ${topic}...`);
    const prompt = `Role: English Teacher for Vietnamese learners preparing for VSTEP B1/B2.
Task: Generate EXACTLY 50 short vocabulary phrases (collocations) related to the topic "${topic}".
Rules:
- Generate short phrases (2-5 words), NOT single words.
- Natural English collocations useful for speaking and writing.
- Include the Vietnamese meaning.
- DO NOT generate example sentences.
- Ensure all phrases are unique.

Output strictly valid JSON matching this structure:
[
  { "topic": "${topic}", "phrase": "string", "meaning_vi": "string" }
]
Ensure the array contains exactly 50 elements. Do not output anything else but JSON.`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7 }
            })
        });

        if (!res.ok) {
            console.error(`Failed to generate ${topic}`, await res.text());
            return [];
        }

        const data = await res.json();
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error(`Error for ${topic}:`, error);
        return [];
    }
}

async function generateGrammarPatterns() {
    console.log("Generating 25 core VSTEP grammar patterns...");
    const prompt = `Role: English Teacher.
Task: Generate STRICTLY 25 essential English grammar patterns for CEFR B1 / VSTEP speakers.
Each grammar pattern must contain the exact grammar structure and a short example.

Example format:
{ "pattern": "If + present -> will + verb", "example": "If people exercise regularly, they will stay healthy" }

Output strictly valid JSON array:
[
  { "pattern": "string", "example": "string" }
]
Ensure exactly 25 elements. No markdown formatting.`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.4 }
            })
        });

        if (!res.ok) {
            console.error(`Failed grammar`, await res.text());
            return [];
        }

        const data = await res.json();
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error(`Error for grammar:`, error);
        return [];
    }
}

async function run() {
    let allChunks = [];
    
    for (const topic of TOPICS) {
        const chunks = await generateChunksForTopic(topic);
        if (chunks && Array.isArray(chunks)) {
            allChunks = allChunks.concat(chunks);
            console.log(`-> Received ${chunks.length} chunks for ${topic}`);
        }
        await sleep(4000); // Prevent rate limits (15 RPM free tier usually)
    }

    const grammarPatterns = await generateGrammarPatterns();
    console.log(`-> Received ${grammarPatterns.length} grammar patterns`);

    const fileContent = `// Auto-generated dataset of VSTEP vocabulary chunks and grammar
export const VOCAB_CHUNKS = ${JSON.stringify(allChunks, null, 2)};

export const GRAMMAR_PATTERNS = ${JSON.stringify(grammarPatterns, null, 2)};
`;

    fs.writeFileSync(path.join(__dirname, '../src/data/grammar-chunks.ts'), fileContent);
    console.log("Dataset successfully written to src/data/grammar-chunks.ts");
}

run();
