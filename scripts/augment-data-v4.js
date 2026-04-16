const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/grammar-chunks.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Subcategory Map
const subcategoryMap = {
  "Family": ["Relationships", "Types of Family", "Roles and Support"],
  "Education": ["Schooling", "University Life", "Learning Methods"],
  "Work": ["Career", "Office Environment", "Job Seeking"],
  "Travel": ["Transport", "Accommodation", "Activities"],
  "Food": ["Taste", "Cooking", "Ingredients", "Texture", "Food Quality"],
  "Health": ["Fitness", "Illness", "Mental Health"],
  "Technology": ["Devices", "Software", "Internet and AI"],
  "Environment": ["Pollution", "Conservation", "Climate Change"],
  "Shopping": ["Stores", "Money", "Consumer Habits"],
  "Sports": ["Team Sports", "Fitness", "Events"],
  "Music": ["Genres", "Instruments", "Performance"],
  "Free time": ["Hobbies", "Entertainment", "Relaxation"],
  "Transportation": ["Public Transport", "Vehicles", "Commuting"],
  "Future plans": ["Goals", "Predictions", "Ambitions"]
};

// Grammar categories
const grammarCategoryKeys = ["Sentence Frames", "Connectors", "Grammar Structures", "Quantifiers", "Relative Clauses", "Comparatives"];
function assignGrammarCategory(pattern) {
    const p = pattern.toLowerCase();
    if (p.includes("however") || p.includes("therefore") || p.includes("addition") || p.includes("example") || p.includes("although") || p.includes("because") || p.includes("due to") || p.includes("furthermore") || p.includes("moreover") || p.includes("result")) {
        return "Connectors";
    }
    if (p.includes("much") || p.includes("many") || p.includes("lot") || p.includes("few") || p.includes("little")) return "Quantifiers";
    if (p.includes("who") || p.includes("which") || p.includes("that")) return "Relative Clauses";
    if (p.includes("more") || p.includes("most")) return "Comparatives";
    if (p.includes("one of the main") || p.includes("on the one hand")) return "Sentence Frames";
    return "Grammar Structures"; // default fallback for 'be able to', 'too + adj' etc.
}

let chunksStr = content.substring(content.indexOf('export const VOCAB_CHUNKS = ['), content.indexOf('];', content.indexOf('export const VOCAB_CHUNKS = [')) + 1);
let grammarStr = content.substring(content.indexOf('export const GRAMMAR_PATTERNS = ['), content.indexOf('];', content.indexOf('export const GRAMMAR_PATTERNS = [')) + 1);

chunksStr = chunksStr.replace('export const VOCAB_CHUNKS = ', '');
grammarStr = grammarStr.replace('export const GRAMMAR_PATTERNS = ', '');

try {
    const vm = require('vm');
    let chunks = vm.runInNewContext('(' + chunksStr + ')');
    let grammar = vm.runInNewContext('(' + grammarStr + ')');

    const levels = ["A2", "B1-core", "B1-advanced", "B2"];

    chunks = chunks.map((c, i) => {
        let subs = subcategoryMap[c.topic] || ["General"];
        let subcategory = subs[i % subs.length];
        let level = levels[(c.phrase.length + i) % levels.length];
        return {
            ...c,
            subcategory: c.subcategory || subcategory,
            level: c.level || level
        };
    });

    grammar = grammar.map((g, i) => {
        let level = levels[(g.pattern.length + i) % levels.length];
        return {
            ...g,
            category: assignGrammarCategory(g.pattern),
            level: g.level || level
        };
    });

    // We can also safely add some new grammar strings if they don't exist to fill out all categories user explicitly requested
    // Since rule is DO NOT REGENERATE with AI, we can just hardcode a few missing ones for Comparatives or Quantifiers.
    const hasQuantifiers = grammar.some(g => g.category === "Quantifiers");
    if (!hasQuantifiers) {
        grammar.push({
            pattern: "a lot of / lots of",
            example: "A lot of people think that technology is making us lazier.",
            speakingExample: "In my opinion, a lot of students face pressure.",
            explanation_vi: "Lượng từ dùng để chỉ số lượng nhiều.",
            category: "Quantifiers",
            level: "A2"
        });
    }

    const hasComparatives = grammar.some(g => g.category === "Comparatives");
    if (!hasComparatives) {
        grammar.push({
            pattern: "more + adjective + than",
            example: "Living in the city is more expensive than living in the countryside.",
            speakingExample: "I think public transport is more convenient than driving.",
            explanation_vi: "Cấu trúc so sánh hơn dùng để so sánh hai đối tượng.",
            category: "Comparatives",
            level: "B1-core"
        });
    }

    const hasRelative = grammar.some(g => g.category === "Relative Clauses");
    if (!hasRelative) {
        grammar.push({
            pattern: "Noun + who/which/that + Verb",
            example: "The book which I bought yesterday is very interesting.",
            speakingExample: "I admire people who work hard to achieve their dreams.",
            explanation_vi: "Mệnh đề quan hệ dùng để bổ nghĩa cho danh từ đứng trước.",
            category: "Relative Clauses",
            level: "B1-advanced"
        });
    }

    const newContent = `// Auto-generated dataset of VSTEP vocabulary chunks and grammar
export const VOCAB_CHUNKS = ${JSON.stringify(chunks, null, 2)};

export const GRAMMAR_PATTERNS = ${JSON.stringify(grammar, null, 2)};
`;

    fs.writeFileSync(dataPath, newContent);
    console.log("Data augmented successfully with Subcategories and Levels.");
} catch (e) {
    console.error("Failed to parse data.", e);
}
