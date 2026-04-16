const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/grammar-chunks.ts');
let content = fs.readFileSync(dataPath, 'utf8');

const grammarCategoryMapVi = {
  "Sentence Frames": "Cấu trúc câu",
  "Connectors": "Từ nối",
  "Grammar Structures": "Cấu trúc ngữ pháp",
  "Comparatives": "So sánh",
  "Quantifiers": "Lượng từ",
  "Relative Clauses": "Mệnh đề quan hệ"
};

function assignVocabType(phrase) {
    const p = phrase.toLowerCase().trim();
    if (p.includes("up") && p.split(" ").length === 2) return "phrasal_verb";
    if (p.includes("out") && p.split(" ").length === 2) return "phrasal_verb";
    if (p.includes("down") && p.split(" ").length === 2) return "phrasal_verb";
    if (p.includes("in my ") || p.includes("to be honest") || p.includes("as far as")) return "expression";
    if (p.split(" ").length === 1) return "word";
    return "collocation";
}

let chunksStr = content.substring(content.indexOf('export const VOCAB_CHUNKS = ['), content.indexOf('];', content.indexOf('export const VOCAB_CHUNKS = [')) + 1);
let grammarStr = content.substring(content.indexOf('export const GRAMMAR_PATTERNS = ['), content.indexOf('];', content.indexOf('export const GRAMMAR_PATTERNS = [')) + 1);

chunksStr = chunksStr.replace('export const VOCAB_CHUNKS = ', '');
grammarStr = grammarStr.replace('export const GRAMMAR_PATTERNS = ', '');

try {
    const vm = require('vm');
    let chunks = vm.runInNewContext('(' + chunksStr + ')');
    let grammar = vm.runInNewContext('(' + grammarStr + ')');

    chunks = chunks.map(c => {
        return {
            ...c,
            type: assignVocabType(c.phrase)
        };
    });

    grammar = grammar.map(g => {
        // Change "Comparisons" to "Comparatives" if any
        let cat = g.category;
        if(cat === 'Comparisons') cat = 'Comparatives';
        
        return {
            ...g,
            category: cat,
            category_vi: grammarCategoryMapVi[cat] || "Cấu trúc ngữ pháp"
        };
    });

    const newContent = `// Auto-generated dataset of VSTEP vocabulary chunks and grammar
export const VOCAB_CHUNKS = ${JSON.stringify(chunks, null, 2)};

export const GRAMMAR_PATTERNS = ${JSON.stringify(grammar, null, 2)};
`;

    fs.writeFileSync(dataPath, newContent);
    console.log("Data augmented successfully with correct Word Types and Grammar category_vi mapping.");
} catch (e) {
    console.error("Failed to parse data.", e);
}
