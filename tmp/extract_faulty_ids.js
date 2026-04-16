const fs = require('fs');

const dataPath = 'c:/Users/Dell/english-learning-platform/tmp/grammar_fixed.json';
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Recursively flatten
  function flattenDeep(arr) {
     return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
  }
  if (Array.isArray(data)) {
      data = flattenDeep(data);
  }
} catch (e) {
  console.error("Failed to read JSON:", e.message);
  process.exit(1);
}

const errors = {
  STRUCTURE_ERROR: [],
  ID_ERROR: [],
  TOPIC_ERROR: [],
  LEVEL_ERROR: [],
  EXACT_DUPLICATE: [],
  NEAR_DUPLICATE: [],
  TEMPLATE_ERROR: [],
  PHRASE_QUALITY_ERROR: [],
  EXAMPLE_ERROR: [],
  VIETNAMESE_ERROR: [],
  IPA_ERROR: []
};

const deleteIds = new Set();
const exactPhrases = new Map(); // phrase -> [id]
const normPhrases = new Map();  // normalized -> [id]
const idsSeen = new Set();
const topicCount = {};

// ID Range Rule
const expectedTopicsList = [
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
const expectedTopics = new Map();
expectedTopicsList.forEach(t => {
  expectedTopics.set(t.t, t);
  topicCount[t.t] = 0;
});

// Pass 1: Collect Exact & Near Duplicates
data.forEach((item, index) => {
  if (!item || !item.id) return;
  
  const pLower = (item.phrase || '').toLowerCase().trim();
  if (pLower) {
    if (exactPhrases.has(pLower)) exactPhrases.get(pLower).push(item.id);
    else exactPhrases.set(pLower, [item.id]);

    const nLower = pLower.replace(/^(to|a|an|the|my|your|his|her|their|our)\s+/g, '').replace(/\s+(to|a|an|the|my|your|his|her|their|our)\s+/g, ' ').replace(/\s+(someone|something|someone's)\s*/g, ' ').trim();
    if (normPhrases.has(nLower)) normPhrases.get(nLower).push(item.id);
    else normPhrases.set(nLower, [item.id]);
  }
});

// Pass 2: Main rules
data.forEach((item, index) => {
  if (!item || typeof item !== 'object') return;
  const idStr = item.id !== undefined ? `ID ${item.id}` : `Index ${index}`;
  const id = item.id;

  if (id === undefined) {
    errors.STRUCTURE_ERROR.push(`${idStr} — missing ID`);
    return;
  }

  // STRUCTURE
  const required = ['phrase', 'base_word', 'ipa', 'pos', 'type', 'topic', 'subcategory', 'level', 'meaning_vi', 'example_en', 'example_vi', 'explanation_vi'];
  const missing = required.filter(k => typeof item[k] === 'undefined' || item[k] === null || item[k] === '');
  if (missing.length > 0) {
    errors.STRUCTURE_ERROR.push(`${idStr} — missing required fields: ${missing.join(', ')}`);
    deleteIds.add(id);
  }

  // ID ERROR
  if (idsSeen.has(id)) {
    errors.ID_ERROR.push(`${idStr} — duplicate ID`);
    deleteIds.add(id);
  } else {
    idsSeen.add(id);
  }

  if (id < 1 || id > 3000) {
    errors.ID_ERROR.push(`${idStr} — ID outside 1-3000 range`);
    deleteIds.add(id);
  }

  // TOPIC ERROR 
  const p = expectedTopics.get(item.topic);
  if (!p) {
    errors.TOPIC_ERROR.push(`${idStr} — invalid topic '${item.topic}'`);
    deleteIds.add(id);
  } else {
    if (id < p.s || id > p.e) {
      errors.TOPIC_ERROR.push(`${idStr} — wrong topic for ID (expected ${expectedTopicsList.find(x => id >= x.s && id <= x.e)?.t})`);
      deleteIds.add(id);
    }
  }

  // TOPIC COUNT Overflow
  if (item.topic) {
    topicCount[item.topic] = (topicCount[item.topic] || 0) + 1;
    if (topicCount[item.topic] > 150) {
       // Flag IDs that overflow the max 150 limit as TOPIC_ERROR or just ID_ERROR. The user said TOPIC_ERROR for wrong topic.
       // The instruction says "Each topic must have exactly 150 entries". I will flag extra items as ID_ERROR (ID outside range, since they usually exceed the topic's upper bound block).
       if (p && id > p.e) {
         // Already flagged by ID range
       } else {
         errors.ID_ERROR.push(`${idStr} — overflows topic limit of 150`);
         deleteIds.add(id);
       }
    }
  }

  // LEVEL ERROR
  if (!['A1', 'A2', 'B1', 'B2'].includes(item.level)) {
    errors.LEVEL_ERROR.push(`${idStr} — invalid level '${item.level}'`);
    deleteIds.add(id);
  }

  // EXACT DUPLICATE
  const pLower = (item.phrase || '').toLowerCase().trim();
  const exactSet = exactPhrases.get(pLower);
  if (exactSet && exactSet.length > 1) {
    // Determine the original (first ID seen) and flag the rest
    const originalId = exactSet[0];
    if (id !== originalId) {
       errors.EXACT_DUPLICATE.push(`${idStr} — duplicate of ID ${originalId} ("${item.phrase}")`);
       deleteIds.add(id);
    }
  }

  // NEAR DUPLICATE
  const nLower = pLower.replace(/^(to|a|an|the|my|your|his|her|their|our)\s+/g, '').replace(/\s+(to|a|an|the|my|your|his|her|their|our)\s+/g, ' ').replace(/\s+(someone|something|someone's)\s*/g, ' ').trim();
  const normSet = normPhrases.get(nLower);
  if (normSet && normSet.length > 1) {
    const isExact = exactSet && exactSet.length > 1;
    if (!isExact) { // Don't flag exact duplicates as near-duplicates
      const originalId = normSet[0];
      if (id !== originalId) {
         errors.NEAR_DUPLICATE.push(`${idStr} — near-duplicate of ID ${originalId} ("${item.phrase}")`);
         deleteIds.add(id);
      }
    }
  }

  // TEMPLATE ERROR
  const ts = ["talk about ", "plan ", "manage ", "prepare for ", "make time for ", "deal with ", "focus on ", "keep up with ", "catch up on "];
  const arti = ["clear update", "calm suggestion", "honest update", "kind plan", "friendly idea"];
  
  const hasTemplate = ts.some(t => pLower.startsWith(t.trim()) || pLower.includes(t)) || arti.some(t => pLower.includes(t));
  if (hasTemplate) {
    errors.TEMPLATE_ERROR.push(`${idStr} — obvious template or matrix generation ("${item.phrase}")`);
    deleteIds.add(id);
  }

  // PHRASE QUALITY
  if (pLower.split(' ').length > 6) {
     errors.PHRASE_QUALITY_ERROR.push(`${idStr} — phrase too long / unnatural`);
     deleteIds.add(id);
  }

  // EXAMPLE ERROR
  if (item.example_en && item.example_en.toLowerCase().includes("we have done a lot of good work")) {
     errors.EXAMPLE_ERROR.push(`${idStr} — robotic/repetitive example frame`);
     deleteIds.add(id);
  }

  // VIETNAMESE ERROR
  if (item.explanation_vi && item.explanation_vi.includes("Dùng để chỉ hành động") && item.explanation_vi.length < 35) {
     errors.VIETNAMESE_ERROR.push(`${idStr} — repetitive generic explanation_vi`);
     deleteIds.add(id);
  }

  // IPA ERROR
  if (item.ipa && (!item.ipa.includes('/') || item.ipa.length < 3)) {
     errors.IPA_ERROR.push(`${idStr} — malformed or suspicious IPA '${item.ipa}'`);
     deleteIds.add(id);
  }

});

// Output
console.log("A. BAD_IDS_BY_CATEGORY\n");

for (const [cat, errs] of Object.entries(errors)) {
  console.log(`${cat}:`);
  errs.forEach(e => console.log(`- ${e}`));
  console.log("");
}

const sortedIds = Array.from(deleteIds).sort((a,b) => a-b);
console.log("B. DELETE_AND_REGEN_IDS\n");
console.log("DELETE_AND_REGEN_IDS:");
console.log(JSON.stringify(sortedIds));
