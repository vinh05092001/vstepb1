const fs = require('fs');
const lines = fs.readFileSync('src/data/grammar-chunks.ts', 'utf8').split('\n');

let depth = 0;
let arrayDepth = 0;
let lastId = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('"id":')) {
    lastId = line.trim();
  }

  for (let c of line) {
    if (c === '{') depth++;
    if (c === '}') depth--;
    if (c === '[') arrayDepth++;
    if (c === ']') arrayDepth--;
  }
  
  // If we close an object, depth should be 0 (meaning we are back inside the outer array)
  if (depth < 0) {
    console.log(`Error: Too many '}' at line ${i+1}. Last ID seen: ${lastId}`);
    process.exit(1);
  }
  
  // If we start a new object but the previous didn't close
  if (line.includes('  {') && line.trim() === '{') {
     if (depth > 1) {
        console.log(`Error: Missing '}' before line ${i+1}. Last ID seen: ${lastId}`);
        process.exit(1);
     }
  }
}

console.log('Final arrayDepth:', arrayDepth, 'Final object depth:', depth);
