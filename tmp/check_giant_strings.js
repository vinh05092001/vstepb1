const fs = require('fs');
const raw = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');
const data = JSON.parse(raw);

const giantItems = [];
for (let i = 0; i < data.length; i++) {
  const item = data[i];
  const keys = Object.keys(item);
  for (const k of keys) {
      const val = item[k];
      if (typeof val === 'string' && val.length > 500) {
          console.log(`Item ${i} (ID: ${item.id}) has a giant string in key '${k}'. Length: ${val.length}. Preview: ${val.substring(0, 100)}...`);
      }
  }
}
