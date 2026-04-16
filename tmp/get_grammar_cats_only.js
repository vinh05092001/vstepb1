const fs = require('fs');

const content = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');

const regex = /GRAMMAR_PATTERNS\s*=\s*\[([\s\S]*?)\];/;
const matchStr = content.match(regex);
if (matchStr) {
  const grammarStr = matchStr[1];
  const catRegex = /category:\s*"([^"]+)"/g;
  const categories = new Set();
  let m;
  while ((m = catRegex.exec(grammarStr)) !== null) {
    categories.add(m[1]);
  }
  console.log(Array.from(categories));
}
