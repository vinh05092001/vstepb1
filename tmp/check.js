const fs = require('fs');
const raw = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');
try {
  JSON.parse(raw);
  console.log("It parses fine?!");
} catch (e) {
  console.log("Parse Error:", e.message);
  
  // Find context
  const posMatch = e.message.match(/position (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const start = Math.max(0, pos - 50);
    const end = Math.min(raw.length, pos + 50);
    console.log("Context:");
    console.log("..." + raw.substring(start, pos) + ">>ERR>>" + raw.substring(pos, end) + "...");
  }
}
