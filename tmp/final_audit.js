const fs = require('fs');

const dataPath = 'c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts';
let raw = fs.readFileSync(dataPath, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);

let data;
try {
  data = JSON.parse(raw);
  function flattenDeep(arr) {
     return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
  }
  if (Array.isArray(data)) {
      data = flattenDeep(data);
  }
} catch (e) {
  console.error("Failed to parse JSON:", e.message);
  process.exit(1);
}

const expectedTopics = [
  { s: 1, e: 150, t: "Daily Life" },
  { s: 151, e: 300, t: "Home & Household" },
  { s: 301, e: 450, t: "Personal Habits" },
  { s: 451, e: 600, t: "Time & Schedules" },
  { s: 601, e: 750, t: "Food & Cooking" },
  { s: 751, e: 900, t: "Shopping" },
  { s: 901, e: 1050, t: "Transportation" },
  { s: 1051, e: 1200, t: "Health & Fitness" },
  { s: 1201, e: 1350, t: "Travel" },
  { s: 1351, e: 1500, t: "Weather" },
  { s: 1501, e: 1650, t: "Family & Relationships" },
  { s: 1651, e: 1800, t: "Friends & Social Life" },
  { s: 1801, e: 1950, t: "Emotions & Feelings" },
  { s: 1951, e: 2100, t: "Communication" },
  { s: 2101, e: 2250, t: "Entertainment" },
  { s: 2251, e: 2400, t: "Education" },
  { s: 2401, e: 2550, t: "Technology (basic)" },
  { s: 2551, e: 2700, t: "Media & Internet" },
  { s: 2701, e: 2850, t: "Work & Career" },
  { s: 2851, e: 3000, t: "Business Communication" }
];

let hardErrors = [];
let softWarnings = [];
let topicCounts = {};
expectedTopics.forEach(t => topicCounts[t.t] = 0);
let missingIds = [];
let duplicateIds = [];
let wrongRangeIds = [];

const allIds = new Set();
const seenIds = new Set();
const exactPhrases = new Map();
const requiredFields = ['id', 'phrase', 'base_word', 'ipa', 'pos', 'type', 'topic', 'subcategory', 'level', 'meaning_vi', 'example_en', 'example_vi', 'explanation_vi'];

let totalEntries = 0;

data.forEach(item => {
  if (!item || typeof item !== 'object') {
     hardErrors.push(`Malformed entry found: ${JSON.stringify(item).substring(0, 50)}...`);
     return;
  }
  
  if (item.id === undefined) {
     hardErrors.push(`Entry missing ID: ${item.phrase}`);
     return;
  }
  
  totalEntries++;
  
  // Track ID occurrences
  if (seenIds.has(item.id)) {
      duplicateIds.push(item.id);
  } else {
      seenIds.add(item.id);
  }
  allIds.add(item.id);

  // Track Topics
  const topicDef = expectedTopics.find(t => t.t === item.topic);
  if (topicDef) {
      topicCounts[item.topic]++;
      if (item.id < topicDef.s || item.id > topicDef.e) {
          wrongRangeIds.push({id: item.id, topic: item.topic, expectedRange: `[${topicDef.s}-${topicDef.e}]`});
      }
  } else {
      hardErrors.push(`ID ${item.id}: Unknown or invalid topic "${item.topic}".`);
  }

  // Schema & Quality Verification
  const missing = requiredFields.filter(k => typeof item[k] === 'undefined' || item[k] === null || item[k] === '');
  if (missing.length > 0) {
      hardErrors.push(`ID ${item.id}: Missing fields [${missing.join(', ')}]`);
  }

  if (item.level && !['A1', 'A2', 'B1', 'B2'].includes(item.level)) {
      hardErrors.push(`ID ${item.id}: Invalid level "${item.level}"`);
  }

  if (item.ipa && (!item.ipa.includes('/') || item.ipa.length < 3)) {
      hardErrors.push(`ID ${item.id}: Bad IPA format "${item.ipa}"`);
  }

  // Exact duplicates
  if (item.phrase) {
     const pLower = item.phrase.toLowerCase().trim();
     if (exactPhrases.has(pLower)) {
         exactPhrases.get(pLower).push(item.id);
     } else {
         exactPhrases.set(pLower, [item.id]);
     }

     const arti = ["clear update", "calm suggestion", "honest update", "kind plan", "friendly idea"];
     if (arti.some(t => pLower.includes(t)) || ["talk about", "plan"].some(t => pLower === t || pLower.startsWith(t + " "))) {
         hardErrors.push(`ID ${item.id}: Obvious machine template phrase "${item.phrase}"`);
     }
  }
  
  if (item.example_en && item.example_en.toLowerCase().includes("we have done a lot of good work")) {
      hardErrors.push(`ID ${item.id}: Machine template example_en`);
  }
});

for (let i = 1; i <= 3000; i++) {
   if (!seenIds.has(i)) missingIds.push(i);
}

// Check duplicates
const actualExactDupes = [];
for (const [phrase, ids] of exactPhrases.entries()) {
   if (ids.length > 1) {
       actualExactDupes.push(`Phrase "${phrase}" appears in IDs: [${ids.join(', ')}]`);
   }
}

// Very basic near-dupe check (same start word logic from before)
const startWordMap = new Map();
for (const phrase of exactPhrases.keys()) {
    const words = phrase.split(' ');
    if (words.length > 2) {
        const firstTwo = words[0] + ' ' + words[1];
        if (!startWordMap.has(firstTwo)) startWordMap.set(firstTwo, []);
        startWordMap.get(firstTwo).push(phrase);
    }
}
const nearDupes = [];
for (const [key, group] of startWordMap.entries()) {
    if (group.length > 3) { // 4+ items starting with same 2 words
       nearDupes.push(`Cluster "${key}...": ${group.length} variants found`);
    }
}

// Compute Verdict
let isReady = true;
let isMinor = false;
let needsRegen = false;

if (hardErrors.length > 0) isReady = false;
if (duplicateIds.length > 0) isReady = false;
if (missingIds.length > 0) isReady = false;
if (wrongRangeIds.length > 0) isReady = false;
if (actualExactDupes.length > 0) isReady = false;

const badTopicCounts = Object.keys(topicCounts).filter(k => topicCounts[k] !== 150);
if (badTopicCounts.length > 0) isReady = false;

let verdict = "READY";
let rec = "release vocab";

if (!isReady) {
    // If it has missing/duplicate/count errors, it's NOT READY. 
    if (missingIds.length > 0 || duplicateIds.length > 0 || actualExactDupes.length > 0 || hardErrors.length > 0 || badTopicCounts.length > 0) {
        verdict = "NOT READY";
        rec = "re-audit needed & fix hard errors";
    } else {
        verdict = "READY WITH MINOR FIXES";
        rec = "fix small issues first";
    }
}

let out = "";
out += "A. FINAL VERDICT\n";
out += `${verdict}\n\n`;

out += "B. HARD ERRORS\n";
if (hardErrors.length === 0) out += "None\n\n";
else {
    out += hardErrors.join('\n') + '\n\n';
}

out += "C. SOFT WARNINGS\n";
if (softWarnings.length === 0 && nearDupes.length === 0) out += "None\n\n";
else {
    out += nearDupes.map(x => "Notice: " + x).join('\n') + '\n\n';
}

out += "D. TOPIC COUNT CHECK\n";
Object.keys(topicCounts).forEach(t => {
   out += `- ${t}: ${topicCounts[t]} ` + (topicCounts[t] !== 150 ? "(ERROR)" : "(OK)") + "\n";
});
out += "\n";

out += "E. ID INTEGRITY CHECK\n";
// Deduplicate missing and duplicate ID arrays for cleaner output
const uDupes = Array.from(new Set(duplicateIds)).sort((a,b)=>a-b);
out += `- duplicate IDs: ${uDupes.length > 0 ? "[" + uDupes.join(', ') + "]" : "None"}\n`;
out += `- missing IDs: ${missingIds.length > 0 ? "[" + missingIds.join(', ') + "]" : "None"}\n`;
out += `- wrong-range IDs: `;
if (wrongRangeIds.length > 0) {
   out += "\n  " + wrongRangeIds.map(x => `ID ${x.id} in ${x.topic} (expected ${x.expectedRange})`).join('\n  ') + "\n";
} else {
   out += "None\n";
}
out += "\n";

out += "F. DUPLICATE CHECK\n";
out += `- exact duplicates:\n`;
if (actualExactDupes.length > 0) {
   out += "  " + actualExactDupes.join('\n  ') + "\n";
} else {
   out += "  None\n";
}
out += `- worst near-duplicate clusters:\n`;
if (nearDupes.length > 0) {
   out += "  " + nearDupes.join('\n  ') + "\n";
} else {
   out += "  None\n";
}
out += "\n";

out += "G. FINAL RECOMMENDATION\n";
out += `- ${rec}\n`;

fs.writeFileSync('c:/Users/Dell/english-learning-platform/tmp/final_audit_report.txt', out, 'utf8');
console.log("Audit complete.");
