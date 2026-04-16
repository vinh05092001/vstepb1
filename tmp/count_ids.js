const fs = require('fs');
const dataPath = 'c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts';
const raw = fs.readFileSync(dataPath, 'utf8');

const idMatches = raw.match(/"id":/g);
console.log(`Total "id": occurrences: ${idMatches ? idMatches.length : 0}`);

const arrayStartMatches = raw.match(/^\[/gm);
console.log(`Array start '[' matches at line starts: ${arrayStartMatches ? arrayStartMatches.length : 0}`);

const arrayEndMatches = raw.match(/^\]/gm);
console.log(`Array end ']' matches at line starts: ${arrayEndMatches ? arrayEndMatches.length : 0}`);
