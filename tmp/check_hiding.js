const fs = require('fs');
const raw = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');
const data = JSON.parse(raw);
console.log("Top-level items:", data.length);

let stringified = JSON.stringify(data);
const match = stringified.match(/"id":/g);
console.log("Total 'id': in stringified JSON:", match ? match.length : 0);

// Check if any element is unusually large
for (let i = 0; i < data.length; i++) {
  const str = JSON.stringify(data[i]);
  if (str.length > 5000) {
      console.log(`Item ${i} is huge: size ${str.length}`);
  }
}
