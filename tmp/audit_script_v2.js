const fs = require('fs');

const dataPath = 'c:/Users/Dell/english-learning-platform/tmp/grammar_fixed.json';
let raw = fs.readFileSync(dataPath, 'utf8');

const report = {
  jsonErrors: [],
  idProblems: { missing: [], duplicates: [], wrongRange: [] },
  topicProblems: [],
  levelProblems: [],
  exactDuplicates: [],
  nearDuplicates: [],
  crossTopicOverlap: [],
  antiTemplates: [],
  qualityIssues: {
    phrase: [],
    example: [],
    vietnamese: [],
    ipa: []
  },
  topicCounts: {}
};

let data = [];
try {
  data = JSON.parse(raw);
} catch (e) {
  raw = raw.replace(/\}\s*\]\s*\]$/, '} ]');
  try {
    data = JSON.parse(raw);
  } catch (e2) {
    report.jsonErrors.push(`Failed to parse: ${e2.message}`);
    console.log("Failed to parse", e2.message);
    process.exit(1);
  }
}

// Flatten arrays if needed
if (Array.isArray(data)) {
  data = data.flat(Infinity);
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

const idsSeen = new Set();
const exactPhrases = new Map();
const normPhrases = new Map();
const baseWordVerbs = new Map(); // tracks base_word + head verb
const topicPhrases = new Map();  // For cross topic overlap

for (const p of expectedTopics) {
  report.topicCounts[p.t] = 0;
  topicPhrases.set(p.t, new Set());
}

data.forEach((item, index) => {
  const id = item.id;
  if (!id) {
    report.jsonErrors.push(`Item at index ${index} missing ID.`);
    return;
  }

  // Schema checks
  const required = ['phrase', 'base_word', 'ipa', 'pos', 'type', 'topic', 'subcategory', 'level', 'meaning_vi', 'example_en', 'example_vi', 'explanation_vi'];
  const missing = required.filter(k => !item[k]);
  if (missing.length > 0) report.jsonErrors.push(`ID ${id} missing fields: ${missing.join(', ')}`);

  // Type checks
  if (item.id && typeof item.id !== 'number') report.jsonErrors.push(`ID ${id} is not a number`);

  // IDs
  if (idsSeen.has(id)) report.idProblems.duplicates.push(id);
  else idsSeen.add(id);

  if (id < 1 || id > 3000) report.idProblems.wrongRange.push(id);

  // Topics
  const expectedT = expectedTopics.find(x => id >= x.s && id <= x.e);
  if (expectedT && item.topic !== expectedT.t) {
    report.idProblems.wrongRange.push(`ID ${id} is in topic "${item.topic}" but should be "${expectedT.t}"`);
  }
  if (report.topicCounts[item.topic] !== undefined) report.topicCounts[item.topic]++;
  else report.topicProblems.push(`ID ${id} has unknown topic "${item.topic}"`);

  // Level
  if (!['A1', 'A2', 'B1', 'B2'].includes(item.level)) {
    report.levelProblems.push(`ID ${id} has invalid level "${item.level}"`);
  }

  // Exact Duplicates
  const pLower = (item.phrase || '').toLowerCase().trim();
  if (exactPhrases.has(pLower)) exactPhrases.get(pLower).push(item);
  else exactPhrases.set(pLower, [item]);

  // Near Duplicates
  const nLower = pLower.replace(/^(to|a|an|the|my|your|his|her|their|our)\s+/g, '').replace(/\s+(to|a|an|the|my|your|his|her|their|our)\s+/g, ' ').replace(/\s+(someone|something|someone's)\s*/g, ' ').trim();
  if (normPhrases.has(nLower)) normPhrases.get(nLower).push(item);
  else normPhrases.set(nLower, [item]);

  // Cross-topic Overlap
  if (item.topic) {
    for (const [t, pSet] of topicPhrases.entries()) {
      if (t !== item.topic && pSet.has(nLower)) {
        report.crossTopicOverlap.push({ phrase: item.phrase, id: item.id, currentTopic: item.topic, otherTopic: t });
      }
    }
    const mySet = topicPhrases.get(item.topic);
    if (mySet) mySet.add(nLower);
  }

  // Anti-templates
  const ts = ["talk about", "plan ", "manage ", "prepare for", "make time for", "deal with", "focus on", "keep up with", "catch up on", "clear update", "calm suggestion", "honest update", "kind plan", "friendly idea", "quick update", "nice thought"];
  for (const t of ts) {
    if (pLower.includes(t)) report.antiTemplates.push({ id, phrase: item.phrase, pattern: t, topic: item.topic });
  }

  // Suspicious matrix generation: e.g. "update a schedule", "manage a schedule", "plan a schedule"
  const firstWord = pLower.split(' ')[0];
  const lastWord = pLower.split(' ').pop();
  if (pLower.split(' ').length > 1) {
    const key = `${firstWord}_${lastWord}`;
    if (baseWordVerbs.has(key)) baseWordVerbs.get(key).push(item);
    else baseWordVerbs.set(key, [item]);
  }

  // Quality checks
  if (item.ipa && (!item.ipa.startsWith('/') || !item.ipa.endsWith('/'))) report.qualityIssues.ipa.push(`ID ${id} IPA format awkward: ${item.ipa}`);
  if (item.example_en && item.example_en.includes('We have done a lot of good work') && id !== 3000) report.qualityIssues.example.push(`ID ${id} repetitive example template`);
});

// Missing IDs
for (let i = 1; i <= 3000; i++) {
  if (!idsSeen.has(i)) report.idProblems.missing.push(i);
}

// Extract Duplicates
for (const [k, v] of exactPhrases.entries()) {
  if (v.length > 1) report.exactDuplicates.push({ phrase: k, instances: v.map(i => ({id: i.id, topic: i.topic})) });
}

// Extract Near Duplicates
for (const [k, v] of normPhrases.entries()) {
  if (v.length > 1 && v.some(i => i.phrase !== v[0].phrase)) {
    report.nearDuplicates.push({ normalized: k, instances: v.map(i => ({phrase: i.phrase, id: i.id, topic: i.topic})) });
  }
}

// Extract Matrix Generators
for (const [k, v] of baseWordVerbs.entries()) {
  if (v.length > 3) {
    report.antiTemplates.push({ pattern: `Matrix: ${k}`, instances: v.map(i => ({id: i.id, phrase: i.phrase})) });
  }
}

fs.writeFileSync('c:/Users/Dell/english-learning-platform/tmp/audit_report_v2.json', JSON.stringify({ summary: report }, null, 2));

console.log("Audit complete. output to temporary file audit_report_v2.json.");
