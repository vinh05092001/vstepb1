const fs = require('fs');
const raw = fs.readFileSync('c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts', 'utf8');
const data = JSON.parse(raw);
console.log("Length of parsed outer array:", data.length);
if (data.length > 0) {
  console.log("Type of first element:", typeof data[0]);
  if (Array.isArray(data[0])) {
      console.log("First element is array of length:", data[0].length);
      console.log("Second element is array of length:", data[1] ? data[1].length : 'none');
      const total = data.reduce((acc, val) => acc + (Array.isArray(val) ? val.length : 1), 0);
      console.log("Total flattened items:", total);
  } else {
      console.log("First element keys:", Object.keys(data[0]));
  }
}
