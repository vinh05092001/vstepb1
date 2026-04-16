const fs = require('fs');
const report = require('c:/Users/Dell/english-learning-platform/tmp/audit_report_v2.json');
const s = report.summary;

let out = "";
out += "JSON errors: " + s.jsonErrors.length + "\n";
out += "Missing IDs: " + s.idProblems.missing.length + "\n";
if (s.idProblems.missing.length > 0) {
  out += "Missing IDs range: " + s.idProblems.missing[0] + " to " + s.idProblems.missing[s.idProblems.missing.length - 1] + "\n";
}
out += "Duplicate IDs: " + s.idProblems.duplicates.length + "\n";
out += "IDs wrong range: " + s.idProblems.wrongRange.length + "\n";
out += "Topic problems: " + s.topicProblems.length + "\n";

out += "Exact duplicate phrases: " + s.exactDuplicates.length + "\n";
out += "Near duplicate clusters: " + s.nearDuplicates.length + "\n";
out += "Cross-topic overlaps: " + s.crossTopicOverlap.length + "\n";
out += "Anti-templates/Matrix generation: " + s.antiTemplates.length + "\n";
out += "Quality - IPA: " + s.qualityIssues.ipa.length + "\n";
out += "Quality - Example: " + s.qualityIssues.example.length + "\n";
out += "Quality - VN: " + s.qualityIssues.vietnamese.length + "\n";

out += "\nTopic counts:\n";
for (const [t, c] of Object.entries(s.topicCounts)) {
  out += `${t}: ${c}\n`;
}

fs.writeFileSync('c:/Users/Dell/english-learning-platform/tmp/summary_counts.txt', out, 'utf8');
