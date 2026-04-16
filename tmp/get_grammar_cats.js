const fs = require('fs');

const content = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');

const regex = /category:\s*"([^"]+)"/g;
const categories = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  categories.add(match[1]);
}

console.log(Array.from(categories));
