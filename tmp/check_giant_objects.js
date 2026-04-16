const fs = require('fs');
const raw = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');
const data = JSON.parse(raw);

let out = "";
for (let i = 0; i < data.length; i++) {
  const item = data[i];
  // Check if item itself is an array
  if (Array.isArray(item)) {
     out += `Item ${i} is an ARRAY. Length: ${item.length}. Preview of first elem: ${JSON.stringify(item[0])}\n`;
  } else {
    for (const k of Object.keys(item)) {
        const strVal = JSON.stringify(item[k]);
        if (strVal && strVal.length > 500) {
            out += `Item ID ${item.id} has giant value in key '${k}'. Type: ${typeof item[k]}. Preview: ${strVal.substring(0, 100)}...\n`;
        }
    }
  }
}
fs.writeFileSync('C:/Users/Dell/.gemini/antigravity/brain/514f1b0f-b70b-4852-9c5e-358fc72232cd/giant_objects.txt', out, 'utf8');
