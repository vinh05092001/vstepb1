const fs = require('fs');

const content = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');

const regex = /topic:\s*"([^"]+)"/g;
const topics = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  topics.add(match[1]);
}

console.log(Array.from(topics));
