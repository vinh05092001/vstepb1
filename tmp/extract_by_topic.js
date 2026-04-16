const fs = require('fs');

const dataPath = 'c:/Users/Dell/english-learning-platform/tmp/grammar_fixed.json';
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
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

const topicData = {};
expectedTopicsList.forEach(t => {
   topicData[t.t] = { 
       MUST_DELETE: [], 
       REVIEW_FIRST: [],
       deleteIds: new Set(),
       reviewIds: new Set(),
       range: t
   };
});

// Since missing IDs don't have a topic, we put structure errors for missing stuff into a "GLOBAL" or just skip them if they lack ID?
// Wait, the user wants it grouped by TOPIC. If an item has a duplicate ID or missing topic, we try to guess it from the ID range.

const exactPhrases = new Map(); // phrase -> [item]
const normPhrases = new Map();  // normalized -> [item]
const idsSeen = new Set();
const topicCount = {};

// Pass 1: Collect Exact & Near Duplicates
data.forEach((item) => {
  if (!item || !item.id || !item.phrase) return;
  const pLower = item.phrase.toLowerCase().trim();
  if (pLower) {
    if (exactPhrases.has(pLower)) exactPhrases.get(pLower).push(item);
    else exactPhrases.set(pLower, [item]);

    // normalization
    const nWords = pLower.split(/\s+/).filter(w => !['to','a','an','the','my','your','his','her','their','our','someone','something',"someone's"].includes(w));
    const nLower = nWords.join(' ');
    
    if (normPhrases.has(nLower)) normPhrases.get(nLower).push(item);
    else normPhrases.set(nLower, [item]);
  }
});

// Helper to determine the mapped topic container
function getTopicBin(item) {
   let tName = item.topic;
   if (!tName || !topicData[tName]) {
       // fallback to ID range
       const rangeMatch = expectedTopicsList.find(r => item.id >= r.s && item.id <= r.e);
       tName = rangeMatch ? rangeMatch.t : "Daily Life";
   }
   return topicData[tName];
}

function processError(item, type, msg) {
   const bin = getTopicBin(item);
   const str = `- ID ${item.id} — ${msg}`;
   if (type === 'DELETE') {
       if (!bin.deleteIds.has(item.id)) {
          bin.MUST_DELETE.push(str);
          bin.deleteIds.add(item.id);
       }
   } else {
       if (!bin.reviewIds.has(item.id) && !bin.deleteIds.has(item.id)) {
          bin.REVIEW_FIRST.push(str);
          bin.reviewIds.add(item.id);
       }
   }
}

// Pass 2: Main rules
data.forEach((item, index) => {
  if (!item || typeof item !== 'object') return;
  const id = item.id;
  if (id === undefined) return; // ignore completely broken items without ID for this specific topic grouping 

  const bin = getTopicBin(item);
  let isDelete = false;

  // STRUCTURE
  const required = ['phrase', 'base_word', 'ipa', 'pos', 'type', 'topic', 'subcategory', 'level', 'meaning_vi', 'example_en', 'example_vi', 'explanation_vi'];
  const missing = required.filter(k => typeof item[k] === 'undefined' || item[k] === null || item[k] === '');
  if (missing.length > 0) {
    processError(item, 'DELETE', `missing required fields: ${missing.join(', ')}`);
    isDelete = true;
  }

  // ID ERROR
  if (idsSeen.has(id)) {
    processError(item, 'DELETE', `duplicate ID`);
    isDelete = true;
  } else {
    idsSeen.add(id);
  }

  if (id < 1 || id > 3000) {
    processError(item, 'DELETE', `ID outside 1-3000 range`);
    isDelete = true;
  }

  // TOPIC ERROR 
  if (!topicData[item.topic]) {
    processError(item, 'DELETE', `invalid topic '${item.topic}'`);
    isDelete = true;
  } else {
    const p = topicData[item.topic].range;
    if (id < p.s || id > p.e) {
      processError(item, 'DELETE', `wrong topic for ID range`);
      isDelete = true;
    }
  }

  // TOPIC COUNT Overflow
  if (item.topic) {
    topicCount[item.topic] = (topicCount[item.topic] || 0) + 1;
    if (topicCount[item.topic] > 150) {
       // if ID is strictly higher than range upper bound, it's an overflow
       const p = topicData[item.topic]?.range;
       if (p && id > p.e) {
           processError(item, 'DELETE', `topic overflow item (exceeds 150 count)`);
           isDelete = true;
       }
    }
  }

  // LEVEL ERROR
  if (!['A1', 'A2', 'B1', 'B2'].includes(item.level)) {
    processError(item, 'DELETE', `invalid level '${item.level}'`);
    isDelete = true;
  }

  // EXACT DUPLICATE
  const pLower = (item.phrase || '').toLowerCase().trim();
  const exactSet = exactPhrases.get(pLower) || [];
  if (exactSet.length > 1) {
    const originalItem = exactSet[0];
    if (id !== originalItem.id) {
       // check if it's a single word
       const isSingle = pLower.split(' ').length === 1;
       if (isSingle) {
           processError(item, 'REVIEW', `single-word exact duplicate of ID ${originalItem.id} ("${item.phrase}")`);
       } else {
           processError(item, 'DELETE', `exact duplicate phrase of ID ${originalItem.id} ("${item.phrase}")`);
           isDelete = true;
       }
    }
  }

  // NEAR DUPLICATE
  const nWords = pLower.split(/\s+/).filter(w => !['to','a','an','the','my','your','his','her','their','our','someone','something',"someone's"].includes(w));
  const nLower = nWords.join(' ');
  const normSet = normPhrases.get(nLower) || [];
  if (normSet.length > 1) {
    const isExact = exactSet.length > 1;
    if (!isExact) {
      const originalItem = normSet[0];
      if (id !== originalItem.id) {
         processError(item, 'REVIEW', `near-duplicate of ID ${originalItem.id} ("${item.phrase}")`);
      }
    }
  }

  // TEMPLATE ERROR
  const ts = ["talk about ", "plan ", "manage ", "prepare for ", "make time for ", "deal with ", "focus on ", "keep up with ", "catch up on "];
  const arti = ["clear update", "calm suggestion", "honest update", "kind plan", "friendly idea"];
  const hasStrongTemplate = arti.some(t => pLower.includes(t)) || ["talk about", "plan"].some(t => pLower === t || pLower.startsWith(t + " "));
  const hasWeakTemplate = ts.some(t => pLower.startsWith(t.trim()) || pLower.includes(t));
  
  if (hasStrongTemplate) {
    processError(item, 'DELETE', `obvious machine-generated template ("${item.phrase}")`);
    isDelete = true;
  } else if (hasWeakTemplate) {
    processError(item, 'REVIEW', `possible template issue ("${item.phrase}")`);
  }

  // PHRASE QUALITY
  if (pLower.split(' ').length > 6) {
     processError(item, 'REVIEW', `borderline phrase quality issue (too long: "${item.phrase}")`);
  }

  // EXAMPLE ERROR
  if (item.example_en && item.example_en.toLowerCase().includes("we have done a lot of good work")) {
     processError(item, 'DELETE', `robotic/repetitive example frame`);
  } else if (item.example_en && item.example_en.length < 15) {
     processError(item, 'REVIEW', `weak example ("${item.example_en}")`);
  }

  // VIETNAMESE ERROR
  if (item.explanation_vi && item.explanation_vi.includes("Dùng để chỉ hành động") && item.explanation_vi.length < 35) {
     processError(item, 'REVIEW', `borderline Vietnamese issue (repetitive generic explanation)`);
  }

  // IPA ERROR
  if (item.ipa && (!item.ipa.includes('/') || item.ipa.length < 3)) {
     processError(item, 'DELETE', `clearly broken IPA ('${item.ipa}')`);
  }
});

let out = "";
expectedTopicsList.forEach(t => {
   const tName = t.t;
   const bin = topicData[tName];
   
   out += `TOPIC: ${tName}\n`;
   out += `MUST_DELETE:\n`;
   if (bin.MUST_DELETE.length === 0) out += `(none)\n`;
   bin.MUST_DELETE.forEach(s => out += s + "\n");
   
   out += `\nREVIEW_FIRST:\n`;
   if (bin.REVIEW_FIRST.length === 0) out += `(none)\n`;
   // remove review IDs that got deleted later
   bin.REVIEW_FIRST.filter(lines => {
      const idMatch = lines.match(/ID (\d+)/);
      if (idMatch) return !bin.deleteIds.has(parseInt(idMatch[1]));
      return true;
   }).forEach(s => out += s + "\n");

   const finalDelete = Array.from(bin.deleteIds).sort((a,b)=>a-b);
   const finalReview = Array.from(bin.reviewIds).filter(id => !bin.deleteIds.has(id)).sort((a,b)=>a-b);

   out += `\nFINAL_MUST_DELETE_IDS:\n[${finalDelete.join(', ')}]\n\n`;
   out += `FINAL_REVIEW_IDS:\n[${finalReview.join(', ')}]\n\n`;
});

out += `GLOBAL_REGEN_PRIORITY:\n`;
expectedTopicsList.forEach(t => {
   const c = topicCount[t.t] || 0;
   const bin = topicData[t.t];
   const deleteLen = bin.deleteIds.size;
   if (deleteLen > 0 || c !== 150) {
       let msg = "";
       if (c !== 150) msg += `Topic gen count is ${c} instead of 150. `;
       if (deleteLen > 0) msg += `Has ${deleteLen} MUST_DELETE items to replace.`;
       out += `- ${t.t} — ${msg.trim()}\n`;
   }
});

console.log(out);
