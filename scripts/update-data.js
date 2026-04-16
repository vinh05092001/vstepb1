const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/grammar-chunks.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Quick and dirty manual addition to grammar patterns
const grammarAdditions = {
  "Subject + verb (present simple)": { category: "Grammar Structures", explanation_vi: "Cấu trúc thì hiện tại đơn để diễn tả thói quen hoặc sự thật hiển nhiên." },
  "Subject + verb (present continuous)": { category: "Grammar Structures", explanation_vi: "Cấu trúc thì hiện tại tiếp diễn diễn tả hành động đang xảy ra." },
  "Subject + verb (past simple)": { category: "Grammar Structures", explanation_vi: "Cấu trúc thì quá khứ đơn diễn tả hành động đã kết thúc trong quá khứ." },
  "Subject + verb (present perfect)": { category: "Grammar Structures", explanation_vi: "Cấu trúc thì hiện tại hoàn thành diễn tả hành động bắt đầu trong quá khứ và còn tiếp diễn." },
  "Subject + be going to + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả dự định chắc chắn trong tương lai." },
  "Subject + will + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả dự đoán hoặc quyết định tức thời trong tương lai." },
  "Subject + can + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả khả năng ở hiện tại." },
  "Subject + could + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả khả năng trong quá khứ hoặc yêu cầu lịch sự." },
  "Subject + should + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc đưa ra lời khuyên." },
  "Subject + must + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả sự bắt buộc hoặc suy luận chắc chắn." },
  "Subject + have to + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả sự cần thiết do khách quan." },
  "Subject + don't have to + verb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả sự không cần thiết." },
  "Subject + verb + object (transitive verbs)": { category: "Grammar Structures", explanation_vi: "Cấu trúc động từ theo sau là tân ngữ." },
  "Subject + verb + prepositional phrase": { category: "Grammar Structures", explanation_vi: "Cấu trúc động từ đi kèm giới từ." },
  "There is / There are + noun": { category: "Grammar Structures", explanation_vi: "Cấu trúc giới thiệu sự tồn tại của ai/cái gì." },
  "Comparative adjectives (adjective + -er / more + adjective + than)": { category: "Grammar Structures", explanation_vi: "Cấu trúc so sánh hơn." },
  "Superlative adjectives (the + adjective + -est / the most + adjective)": { category: "Grammar Structures", explanation_vi: "Cấu trúc so sánh nhất." },
  "If + present simple, will + verb (first conditional)": { category: "Grammar Structures", explanation_vi: "Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai." },
  "If + past simple, would + verb (second conditional)": { category: "Grammar Structures", explanation_vi: "Câu điều kiện loại 2 diễn tả sự việc không có thật ở hiện tại." },
  "Subject + verb + -ing (gerund after certain verbs)": { category: "Grammar Structures", explanation_vi: "Cấu trúc danh động từ đứng sau một số động từ cụ thể." },
  "Subject + verb + to + verb (infinitive after certain verbs)": { category: "Grammar Structures", explanation_vi: "Cấu trúc động từ nguyên thể có 'to' đứng sau một số động từ." },
  "Passive voice (present simple: is/are + past participle)": { category: "Grammar Structures", explanation_vi: "Câu bị động ở thì hiện tại đơn." },
  "Passive voice (past simple: was/were + past participle)": { category: "Grammar Structures", explanation_vi: "Câu bị động ở thì quá khứ đơn." },
  "Subject + verb + adverb of frequency": { category: "Grammar Structures", explanation_vi: "Cấu trúc miêu tả mức độ thường xuyên của hành động." },
  "Subject + verb + too + adjective/adverb": { category: "Grammar Structures", explanation_vi: "Cấu trúc diễn tả tính chất quá mức đến nỗi không thể làm gì." }
};

const extraConnectorsAndFrames = [
  { pattern: "One of the main reasons is that...", example: "One of the main reasons people exercise is health.", category: "Sentence Frames", explanation_vi: "Cấu trúc dùng để đưa ra luận điểm chính." },
  { pattern: "It is widely believed that...", example: "It is widely believed that technology has changed our lives.", category: "Sentence Frames", explanation_vi: "Cấu trúc dùng để nêu quan điểm phổ biến." },
  { pattern: "On the one hand... On the other hand...", example: "On the one hand, social media connects people. On the other hand, it can be distracting.", category: "Sentence Frames", explanation_vi: "Cấu trúc dùng để so sánh hai mặt của một vấn đề." },
  { pattern: "Therefore", example: "It was raining heavily; therefore, we stayed home.", category: "Connectors", explanation_vi: "Từ nối dùng để chỉ kết quả (Do đó, vì vậy)." },
  { pattern: "However", example: "She is very smart. However, she is quite lazy.", category: "Connectors", explanation_vi: "Từ nối dùng để chỉ sự đối lập (Tuy nhiên)." },
  { pattern: "In addition", example: "In addition to a competitive salary, the company offers great benefits.", category: "Connectors", explanation_vi: "Từ nối dùng để bổ sung thông tin (Hơn nữa, ngoài ra)." }
];

// parse the objects out from the typescript file using regex

let chunksStr = content.substring(content.indexOf('export const VOCAB_CHUNKS = ['), content.indexOf('];', content.indexOf('export const VOCAB_CHUNKS = [')) + 1);
let grammarStr = content.substring(content.indexOf('export const GRAMMAR_PATTERNS = ['), content.indexOf('];', content.indexOf('export const GRAMMAR_PATTERNS = [')) + 1);

chunksStr = chunksStr.replace('export const VOCAB_CHUNKS = ', '');
grammarStr = grammarStr.replace('export const GRAMMAR_PATTERNS = ', '');

try {
    const vm = require('vm');
    let chunks = vm.runInNewContext('(' + chunksStr + ')');
    let grammar = vm.runInNewContext('(' + grammarStr + ')');

    chunks = chunks.map(c => ({
        ...c,
        explanation_vi: "cụm từ mô tả " + c.meaning_vi.toLowerCase()
    }));

    grammar = grammar.map(g => {
        const addition = grammarAdditions[g.pattern];
        return {
            ...g,
            category: addition ? addition.category : "Grammar Structures",
            explanation_vi: addition ? addition.explanation_vi : "cấu trúc ngữ pháp nâng cao"
        };
    });

    grammar.push(...extraConnectorsAndFrames);

    const newContent = `// Auto-generated dataset of VSTEP vocabulary chunks and grammar
export const VOCAB_CHUNKS = ${JSON.stringify(chunks, null, 2)};

export const GRAMMAR_PATTERNS = ${JSON.stringify(grammar, null, 2)};
`;

    fs.writeFileSync(dataPath, newContent);
    console.log("Data updated successfully.");
} catch (e) {
    console.error("Failed to parse data.", e);
}
