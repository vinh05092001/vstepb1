const report = require('c:/Users/Dell/english-learning-platform/tmp/audit_report_raw.json');
const s = report.summary;
console.log("JSON errors:", s.jsonErrors.length);
console.log("Missing IDs:", s.idProblems.missing.length);
if (s.idProblems.missing.length > 0) {
  console.log("Missing IDs range:", s.idProblems.missing[0], "to", s.idProblems.missing[s.idProblems.missing.length - 1]);
}
console.log("Duplicate IDs:", s.idProblems.duplicates.length);
console.log("IDs wrong range:", s.idProblems.wrongRange.length);
console.log("Topic problems:", s.topicProblems.length);
console.log("Level problems:", s.levelProblems.length);
console.log("Exact duplicate phrases:", s.exactDuplicates.length);
console.log("Anti-templates:", s.antiTemplates.length);
console.log("Quality - IPA:", s.qualityIssues.ipa.length);
console.log("Quality - Example:", s.qualityIssues.example.length);
console.log("Quality - VN:", s.qualityIssues.vietnamese.length);

console.log("\nTopic counts:");
for (const [t, c] of Object.entries(s.topicCounts)) {
  console.log(`${t}: ${c}`);
}
