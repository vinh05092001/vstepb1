const fs = require('fs');
const report = require('c:/Users/Dell/english-learning-platform/tmp/audit_report_v2.json');
const s = report.summary;

let md = `# VSTEP AI Pro: 3000-Entry Dataset Audit Report

## A. Executive Summary
- **Overall Verdict:** **PARTIAL REBUILD REQUIRED**
- **Summary:** The dataset contains severe structural and conceptual issues. Although the core JSON object structure is valid, the data generation process used deep nesting of arrays that broke native flat parsing. From a content perspective, the dataset has 3100 items instead of 3000, 100 duplicate IDs, 344 exact duplicate phrases, 408 cross-topic overlaps, and significant anti-template violations (matrix generation). The "Time & Schedules" and "Weather" topics are overpopulated (200 entries each). The dataset is usable only after an extensive cleanup and partial rebuild of the overlapping sections.

## B. Global Problems

### 1. JSON / Structure Problems
- **Issue:** The raw dataset in \`grammar-chunks.ts\` is exported not as a clean flat array, but as an array populated with both objects and nested arrays of objects (e.g. \`[ {id:1}, ..., [{id:101}...]]\`). This breaks standard \`JSON.parse\` map loops and hides 2900 items inside subset arrays. 
- **Severity:** High
- **Example:** Parsing natively without \`flat(Infinity)\` only yields 143 items.

### 2. ID Problems
- **Issue:** There are 3100 items but the IDs must be 1-3000. 100 IDs are exact duplicates.
- **Severity:** Critical
- **Example:** ${s.idProblems.duplicates.slice(0, 10).join(', ')}...

### 3. Topic Problems
- **Issue:** Two topics exceed the 150-entry strict limit. "Time & Schedules" and "Weather" have 200 items each.
- **Severity:** High

### 4. Level Problems
- **Issue:** The levels are correctly formatted (A1, A2, B1, B2) across the dataset, with 0 invalid tags.
- **Severity:** Low

### 5. Exact Duplicate Problems
- **Issue:** There are ${s.exactDuplicates.length} exact duplicate phrases across the dataset. The AI failed to generate unique items, merely repeating the same words under different subcategories or topics.
- **Severity:** Critical

### 6. Near-Duplicate / Overlap Problems
- **Issue:** ${Object.keys(s.nearDuplicates).length} near-duplicate clusters and ${s.crossTopicOverlap.length} cross-topic overlaps. Phrases share exactly the same root verbs and nouns with minor particle differences.
- **Severity:** High

### 7. Template-Generation Problems
- **Issue:** ${s.antiTemplates.length} anti-template violations and matrix generations detected.
- **Severity:** High

## C. Topic Count Check
| Topic | Count | Status |
|---|---|---|
`;

for (const [t, c] of Object.entries(s.topicCounts)) {
  const status = c === 150 ? '✅ PASS' : '❌ FAIL';
  md += `| ${t} | ${c} | ${status} |\n`;
}

md += `

## D. ID Integrity Check
- **Duplicate IDs:** ${s.idProblems.duplicates.length} duplicate IDs detected. 
- **Missing IDs:** None (Range 1-3000 is fully covered, but 100 IDs are repeated).
- **IDs in Wrong Topic Range:** ${s.idProblems.wrongRange.length} IDs fall outside their allowed numeric ranges based on their assigned topics.

## E. Exact Duplicate Phrase List
Showing top 20 exact duplicate phrases:
`;

s.exactDuplicates.slice(0, 20).forEach(d => {
  md += `- **"${d.phrase}"** appears ${d.instances.length} times (IDs: ${d.instances.map(i => i.id).join(', ')})\n`;
});

md += `

## F. Worst Near-Duplicate Clusters
`;
s.nearDuplicates.slice(0, 10).forEach(d => {
  md += `- Cluster **"${d.normalized}"**: \n`;
  d.instances.forEach(i => {
      md += `  - ID ${i.id}: "${i.phrase}" (${i.topic})\n`;
  });
});

md += `

## G. Cross-Topic Overlap Problems
Showing top 15 cross-topic overlaps:
`;
s.crossTopicOverlap.slice(0, 15).forEach(o => {
  md += `- ID ${o.id}: "${o.phrase}" (in **${o.currentTopic}**, overlaps with **${o.otherTopic}**)\n`;
});

md += `

## H. Topic-by-Topic Review
`;
const topics = Object.keys(s.topicCounts);
topics.forEach(t => {
  const c = s.topicCounts[t];
  const verdict = c === 150 ? (s.exactDuplicates.some(e => e.instances.some(i => i.topic === t)) ? 'PASS WITH WARNINGS' : 'PASS') : 'FAIL';
  md += `### ${t}\n`;
  md += `- **Verdict:** ${verdict}\n`;
  const prob = c !== 150 ? "Entry count is " + c + " instead of 150." : "Suffers from exact duplicates.";
  md += "- **Main Problems:** " + prob + "\n\n";
});

md += `
## I. Priority Fix Plan
1. **Fix JSON Nested Array Structure:** The generator script must use \`...array\` spreading or \`flat()\` instead of nesting output arrays.
2. **Trim Overpopulated Topics:** Delete the 50 extra items in "Time & Schedules" and "Weather" to strictly hit 150 items.
3. **De-duplicate IDs:** Re-index the entire dataset so IDs strictly go from 1 to 3000.
4. **Remove Exact Duplicates:** Regenerate the 344 exact duplicate phrases with fresh prompts ensuring uniqueness.
5. **Resolve Cross-Topic Overlap:** Eliminate the ~400 items that share root words across different topics.

## J. Final Recommendation
**PARTIAL REBUILD**
- The basic JSON schema is sound and the level/attribute formatting conforms to requirements.
- However, dataset collision is massive. Over 10% of the dataset consists of exact duplicates, and there are 100 stray IDs breaking the 3000 ceiling. 
- A targeted script should prune the extra 100 items, strip the 344 absolute duplicates, and trigger a regeneration cycle strictly banning previously outputted phrases.
`;

fs.writeFileSync('C:/Users/Dell/.gemini/antigravity/brain/514f1b0f-b70b-4852-9c5e-358fc72232cd/audit_report.md', md, 'utf8');
console.log("Audit Report generated.");
