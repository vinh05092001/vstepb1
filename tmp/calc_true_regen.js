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

const getTopicBin = (item) => {
   let tName = item.topic;
   if (!tName || !expectedTopicsList.find(x => x.t === tName)) {
       const rangeMatch = expectedTopicsList.find(r => item.id >= r.s && item.id <= r.e);
       tName = rangeMatch ? rangeMatch.t : "Daily Life";
   }
   return tName;
};

// Global exact duplicate checks
const exactPhrases = new Map();
data.forEach((item, index) => {
  item._idx = index; // Keep original index for tie-breaking
  if (!item || !item.id || !item.phrase) return;
  const pLower = item.phrase.toLowerCase().trim();
  if (pLower) {
    if (exactPhrases.has(pLower)) exactPhrases.get(pLower).push(item);
    else exactPhrases.set(pLower, [item]);
  }
});

let totalDuplicateExtra = 0;
let totalRealDeletes = 0;
let totalRegenNeeded = 0;
let out = "";

expectedTopicsList.forEach(t => {
   const tName = t.t;
   // Get all items that map to this topic
   const topicItems = data.filter(item => item && item.id !== undefined && getTopicBin(item) === tName);
   const rawItemCount = topicItems.length;

   // 1. Evaluate basic quality of all items in this topic
   topicItems.forEach(item => {
       item._isBad = false;
       
       // Missing required
       const required = ['phrase', 'base_word', 'ipa', 'pos', 'type', 'topic', 'subcategory', 'level', 'meaning_vi', 'example_en', 'example_vi', 'explanation_vi'];
       const missing = required.filter(k => typeof item[k] === 'undefined' || item[k] === null || item[k] === '');
       if (missing.length > 0) item._isBad = true;

       // Invalid level
       if (!['A1', 'A2', 'B1', 'B2'].includes(item.level)) item._isBad = true;

       // Exact duplicate phrase
       const pLower = (item.phrase || '').toLowerCase().trim();
       const exactSet = exactPhrases.get(pLower) || [];
       if (exactSet.length > 1) {
           const originalItem = exactSet[0];
           if (item._idx !== originalItem._idx) {
               const isSingle = pLower.split(' ').length === 1;
               if (!isSingle) item._isBad = true; // Delete only if multi-word duplicate
           }
       }

       // Template error
       const arti = ["clear update", "calm suggestion", "honest update", "kind plan", "friendly idea"];
       const hasStrongTemplate = arti.some(tmpl => pLower.includes(tmpl)) || ["talk about", "plan"].some(tmpl => pLower === tmpl || pLower.startsWith(tmpl + " "));
       if (hasStrongTemplate) item._isBad = true;

       // Robotic example
       if (item.example_en && item.example_en.toLowerCase().includes("we have done a lot of good work")) item._isBad = true;

       // Broken IPA
       if (item.ipa && (!item.ipa.includes('/') || item.ipa.length < 3)) item._isBad = true;

       // Out of bounds for the topic's slot pool
       if (item.id < t.s || item.id > t.e) {
           item._isBad = true;
       }
   });

   // 2. Bucketing by ID inside the valid range to preserve slots
   const duplicateExtras = [];
   const realSlotDeletes = [];
   const regenIds = [];
   
   let countAfterDedup = 0;

   // Process the valid slots [s, e]
   for (let searchId = t.s; searchId <= t.e; searchId++) {
       const objectsForId = topicItems.filter(o => o.id === searchId);
       
       if (objectsForId.length === 0) {
           // Truly empty slot
           regenIds.push(searchId);
       } else {
           const good = objectsForId.filter(o => !o._isBad);
           const bad = objectsForId.filter(o => o._isBad);

           if (good.length > 0) {
               // Great! We can salvage this slot.
               // One good item is kept. It survives.
               countAfterDedup++;
               
               // All other items sharing this ID are DUPLICATE_EXTRA
               const extrasToDrop = good.slice(1).concat(bad);
               extrasToDrop.forEach(o => duplicateExtras.push(o.id));
           } else {
               // ALL objects for this ID are bad. The slot is destroyed completely.
               bad.forEach(o => realSlotDeletes.push(o.id));
               regenIds.push(searchId);
           }
       }
   }

   // 3. Process items mapped to this topic but out-of-bounds (Overflows)
   const outOfBounds = topicItems.filter(o => o.id < t.s || o.id > t.e);
   outOfBounds.forEach(o => {
       // Since it does not belong to any valid slot in this topic, it is a hard delete that must go away.
       // The user requested distinction between extra duplicates and real slot deletes.
       // Let's count them as real slot deletes (meaning they are garbage items taking up space without adding a slot).
       realSlotDeletes.push(o.id);
   });

   // Prepare strings for output
   duplicateExtras.sort((a,b)=>a-b);
   realSlotDeletes.sort((a,b)=>a-b);
   regenIds.sort((a,b)=>a-b);

   totalDuplicateExtra += duplicateExtras.length;
   totalRealDeletes += realSlotDeletes.length;
   totalRegenNeeded += regenIds.length;

   out += `TOPIC: ${tName}\n`;
   out += `RAW_ITEM_COUNT: ${rawItemCount}\n`;
   
   out += `DUPLICATE_EXTRA_OBJECTS_TO_REMOVE:\n`;
   if (duplicateExtras.length > 0) out += `[${duplicateExtras.join(', ')}]\n`;
   else out += `[]\n`;

   out += `REAL_SLOT_DELETE_IDS:\n`;
   if (realSlotDeletes.length > 0) out += `[${realSlotDeletes.join(', ')}]\n`;
   else out += `[]\n`;

   out += `COUNT_AFTER_TRUE_DEDUP:\n${countAfterDedup}\n`;
   out += `TRUE_REGEN_NEEDED:\n${regenIds.length}\n`;
   
   out += `TRUE_REGEN_IDS:\n`;
   if (regenIds.length > 0) out += `[${regenIds.join(', ')}]\n\n`;
   else out += `[]\n\n`;
});

out += `FINAL_GLOBAL_SUMMARY:\n`;
out += `TOTAL_DUPLICATE_EXTRA_OBJECTS_TO_REMOVE: ${totalDuplicateExtra}\n`;
out += `TOTAL_REAL_SLOT_DELETES: ${totalRealDeletes}\n`;
out += `TOTAL_TRUE_REGEN_NEEDED: ${totalRegenNeeded}\n`;

console.log(out);
