const fs = require('fs');

const dataPath = 'c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts';
let raw = fs.readFileSync(dataPath, 'utf8');

console.log("Original length:", raw.length);

// Remove leading/trailing whitespace
raw = raw.trim();

// Add commas between adjacent arrays `] [` or `]\n[`
raw = raw.replace(/\]\s*\[/g, '],[');

// If it doesn't start with [, we shouldn't just wrap it, but it probably does.
// Let's wrap the whole thing in a master array:
if (!raw.startsWith('[[')) { // If it's already an array of arrays, don't wrap, wait...
  raw = `[${raw}]`;
}

let data;
try {
  data = JSON.parse(raw);
  console.log("Successfully parsed multi-array string!");
} catch (e) {
  console.log("Failed to parse after array wrap:", e.message);
  // Try extracting just objects using regex as a fallback
  const objects = [];
  const regex = /\{\s*"id":\s*\d+,[\s\S]*?\}/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
      try {
          objects.push(JSON.parse(match[0]));
      } catch (err) {
          // ignore broken single objects
      }
  }
  data = objects;
  console.log("Fallback block extraction found", data.length, "objects");
}

if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
  data = data.flat();
}

console.log("Total items flattened:", data.length);
fs.writeFileSync('c:/Users/Dell/english-learning-platform/tmp/grammar_fixed.json', JSON.stringify(data, null, 2));
