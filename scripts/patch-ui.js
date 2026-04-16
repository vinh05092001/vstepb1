const fs = require('fs');
const file = 'c:/Users/Dell/english-learning-platform/src/app/grammar-chunks/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<h2 className="text-2xl font-black text-gray-800 mb-4">{selectedTopic} Vocabulary</h2>',
  '<h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#6366F1] mb-6 tracking-tight">{selectedTopic} Vocabulary</h2>'
);

content = content.replace(
  'const count = GRAMMAR_PATTERNS.filter((g: any) => g.category === category).length;',
  'const count = GRAMMAR_PATTERNS.filter((g: any) => g.category === category).length;\n                               const catItem = GRAMMAR_PATTERNS.find((g: any) => g.category === category);\n                               const catVi = catItem?.category_vi || "Cấu trúc ngữ pháp";'
);

fs.writeFileSync(file, content);
console.log('Replaced UI Elements.');
