const fs = require('fs');

const dataPath = 'c:/Users/Dell/english-learning-platform/src/data/grammar-chunks.ts';
let raw = fs.readFileSync(dataPath, 'utf8');

const report = {
  jsonErrors: [],
  idProblems: { missing: [], duplicates: [], wrongRange: [] },
  topicProblems: [],
  levelProblems: [],
  exactDuplicates: [],
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
  report.jsonErrors.push(`Failed to parse raw JSON: ${e.message}`);
  raw = raw.trim();
  if (raw.endsWith(']\n]')) raw = raw.slice(0, -2);
  else if (raw.endsWith(']]')) raw = raw.slice(0, -1);
  else if (raw.endsWith('}\n]')) {
    // try to just add ]?
  }
  
  // Actually, sometimes it's missing trailing comma or something. Let's do a simple replace
  raw = raw.replace(/\}\s*\]\s*\]$/, '} ]');
  try {
    data = JSON.parse(raw);
    report.jsonErrors.push("Successfully parsed after stripping double trailing brackets.");
  } catch (e2) {
    report.jsonErrors.push(`Still failed to parse: ${e2.message}`);
    console.log("Failed to parse", e2.message);
  }
}

if (!Array.isArray(data)) {
  console.log("Data is not an array. Writing error report.");
  fs.writeFileSync('c:/Users/Dell/english-learning-platform/tmp/audit_report_raw.json', JSON.stringify(report, null, 2));
  process.exit(1);
}

// Global schema & ID validation
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
const levelCount = {};
const typeCount = {};
const exactPhrases = new Map();

for (const p of expectedTopics) {
  report.topicCounts[p.t] = 0;
  levelCount[p.t] = { A1: 0, A2: 0, B1: 0, B2: 0, OTHER: 0 };
}

data.forEach((item, index) => {
  const id = item.id;
  if (!id) {
    report.jsonErrors.push(`Item at index ${index} missing ID.`);
    return; // Can't process without ID
  }

  // Check Schema fields
  const required = ['phrase', 'base_word', 'ipa', 'pos', 'type', 'topic', 'subcategory', 'level', 'meaning_vi', 'example_en', 'example_vi', 'explanation_vi'];
  const missing = [];
  for (const k of required) {
    if (item[k] === undefined || item[k] === null || item[k] === '') {
      missing.push(k);
    }
  }
  if (missing.length > 0) report.jsonErrors.push(`ID ${id} missing or empty fields: ${missing.join(', ')}`);

  // IDs
  if (idsSeen.has(id)) {
    report.idProblems.duplicates.push(id);
  } else {
    idsSeen.add(id);
  }

  if (id < 1 || id > 3000) {
    report.idProblems.wrongRange.push(id);
  }

  // Topics
  const expectedT = expectedTopics.find(x => id >= x.s && id <= x.e);
  if (expectedT) {
    if (item.topic !== expectedT.t) {
      report.idProblems.wrongRange.push(`ID ${id} is in topic "${item.topic}" but should be "${expectedT.t}"`);
    }
  }

  if (report.topicCounts[item.topic] !== undefined) {
    report.topicCounts[item.topic]++;
  } else {
    report.topicProblems.push(`ID ${id} has unknown topic "${item.topic}"`);
  }

  // Level
  if (['A1', 'A2', 'B1', 'B2'].includes(item.level)) {
    if (levelCount[item.topic]) levelCount[item.topic][item.level]++;
  } else {
    report.levelProblems.push(`ID ${id} has invalid level "${item.level}"`);
    if (levelCount[item.topic]) levelCount[item.topic].OTHER++;
  }

  // Duplicate Phrases
  const pLower = (item.phrase || '').toLowerCase().trim();
  if (exactPhrases.has(pLower)) {
    exactPhrases.get(pLower).push(id);
  } else {
    exactPhrases.set(pLower, [id]);
  }

  // Anti-templates
  const ts = ["talk about ", "plan ", "manage ", "prepare for ", "make time for ", "deal with ", "focus on ", "keep up with ", "catch up on ", "clear update", "calm suggestion", "honest update", "kind plan", "friendly idea"];
  for (const t of ts) {
    if (pLower.includes(t)) {
      report.antiTemplates.push({ id, phrase: item.phrase, pattern: t });
    }
  }

  // Format checks
  if (item.ipa) {
    if (!item.ipa.startsWith('/') || !item.ipa.endsWith('/')) {
      report.qualityIssues.ipa.push(`ID ${id} IPA format awkward: ${item.ipa}`);
    }
    if (item.ipa.length < 3) {
      report.qualityIssues.ipa.push(`ID ${id} IPA too short: ${item.ipa}`);
    }
  }

  if (item.example_en && item.example_en.split(' ').length < 3 && item.phrase && item.phrase.split(' ').length < 2) {
    report.qualityIssues.example.push(`ID ${id} short example: ${item.example_en}`);
  }

});

// Missing IDs
for (let i = 1; i <= 3000; i++) {
  if (!idsSeen.has(i)) report.idProblems.missing.push(i);
}

// Exact Duplicates export
for (const [k, v] of exactPhrases.entries()) {
  if (v.length > 1) {
    report.exactDuplicates.push({ phrase: k, ids: v });
  }
}

// Write the intermediate report out
fs.writeFileSync('c:/Users/Dell/english-learning-platform/tmp/audit_report_raw.json', JSON.stringify({
  summary: report,
  levelCount
}, null, 2));

console.log("Audit complete. JSON written to audit_report_raw.json");
