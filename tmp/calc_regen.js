const fs = require('fs');

const dataPath = 'c:/Users/Dell/english-learning-platform/tmp/grammar_fixed.json';
const reportPath = 'c:/Users/Dell/english-learning-platform/tmp/extract_by_topic_clean.txt';

let data, reportStr;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  function flattenDeep(arr) {
     return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
  }
  if (Array.isArray(data)) data = flattenDeep(data);
  
  reportStr = fs.readFileSync(reportPath, 'utf8');
} catch (e) {
  console.error("Failed to read files:", e.message);
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

// Topic to MUST_DELETE_IDS mapping
const mustDeleteMap = {};
const sections = reportStr.split("TOPIC: ");
sections.shift(); // remove first empty

sections.forEach(sec => {
   const lines = sec.split('\n');
   const tName = lines[0].trim();
   
   const match = sec.match(/FINAL_MUST_DELETE_IDS:\n\[(.*?)\]/);
   let ids = [];
   if (match && match[1]) {
       ids = match[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
   }
   mustDeleteMap[tName] = new Set(ids);
});

const getTopicBin = (item) => {
   let tName = item.topic;
   if (!tName || !expectedTopicsList.find(x => x.t === tName)) {
       const rangeMatch = expectedTopicsList.find(r => item.id >= r.s && item.id <= r.e);
       tName = rangeMatch ? rangeMatch.t : "Daily Life";
   }
   return tName;
};

// Map each item ID to see if it implicitly exists AND is not deleted
const idsKept = new Set();
const currentCounts = {};

data.forEach(item => {
   if (!item || !item.id || !item.phrase) return;
   const tName = getTopicBin(item);
   
   currentCounts[tName] = (currentCounts[tName] || 0) + 1;

   const topicDef = expectedTopicsList.find(x => x.t === tName);
   if (!topicDef) return;

   // Is it inside the expected range for this topic?
   if (item.id >= topicDef.s && item.id <= topicDef.e) {
       // Is it marked as must delete?
       const delSet = mustDeleteMap[tName];
       if (delSet && !delSet.has(item.id)) {
           idsKept.add(item.id);
       }
   }
});

let out = "";
let totalRegen = 0;

expectedTopicsList.forEach(t => {
   const tName = t.t;
   const currentCount = currentCounts[tName] || 0;
   const delSet = mustDeleteMap[tName] || new Set();
   const sortedDeletes = Array.from(delSet).sort((a,b)=>a-b);

   // Calculate missing IDs strictly inside its allowed [s, e] range
   const missingIds = [];
   for (let i = t.s; i <= t.e; i++) {
       if (!idsKept.has(i)) {
           missingIds.push(i);
       }
   }
   
   const countAfterDelete = 150 - missingIds.length;
   const regenNeeded = missingIds.length;
   totalRegen += regenNeeded;

   out += `TOPIC: ${tName}\n`;
   out += `CURRENT_COUNT_BEFORE_DELETE: ${currentCount}\n`;
   out += `MUST_DELETE_IDS: [${sortedDeletes.join(', ')}]\n`;
   out += `COUNT_AFTER_DELETE: ${countAfterDelete}\n`;
   out += `REGEN_NEEDED: ${regenNeeded}\n`;
   out += `REGEN_IDS: [${missingIds.join(', ')}]\n\n`;
});

out += `TOTAL_REGEN_NEEDED: ${totalRegen}\n`;

fs.writeFileSync('c:/Users/Dell/english-learning-platform/tmp/calc_regen_result.txt', out, 'utf8');
console.log("Done calculating.");
