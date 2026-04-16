import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateOfflineEntriesForTopic } from "./vocab-offline-generator";

type AllowedLevel = "A1" | "A2" | "B1" | "B2";
type RunStatus = "idle" | "generating" | "paused";
type TopicStatus = "planned" | "in-progress" | "completed";
type IssueSeverity = "error" | "warning";

interface ChunkEntry {
  id?: number | string;
  phrase?: string;
  base_word?: string;
  ipa?: string;
  pos?: string;
  type?: string;
  topic?: string;
  subcategory?: string;
  level?: string;
  meaning_vi?: string;
  example_en?: string;
  example_vi?: string;
  explanation_vi?: string;
}

interface TopicPlanEntry {
  topic: string;
  idStart: number;
  idEnd: number;
  targetCount: number;
  currentCount: number;
  nextId: number;
  status: TopicStatus;
}

interface PhraseIndexItem {
  canonicalKey: string;
  nearKey: string;
  normalizedPhrase: string;
  rawVariants: string[];
  topics: string[];
  ids: number[];
}

interface PhraseIndexFile {
  generatedAt: string;
  totalKeys: number;
  items: Record<string, PhraseIndexItem>;
}

interface TopicPhraseIndexFile {
  generatedAt: string;
  topics: Record<string, string[]>;
}

interface BatchState {
  currentTopic: string | null;
  nextTopic: string | null;
  nextBatchSize: number;
  lastCommittedBatchId: string | null;
  lastCommitTime: string | null;
  runStatus: RunStatus;
}

interface ValidationIssue {
  severity: IssueSeverity;
  code: string;
  message: string;
  entryId?: number | string;
  topic?: string;
  phrase?: string;
}

interface ValidationReport {
  generatedAt: string;
  totalEntries: number;
  approvedTopicEntries: number;
  issues: ValidationIssue[];
  topicCounts: Record<string, number>;
}

interface BuildArtifacts {
  plan: TopicPlanEntry[];
  phraseIndex: PhraseIndexFile;
  topicPhraseIndex: TopicPhraseIndexFile;
  report: ValidationReport;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const META_DIR = path.join(ROOT_DIR, "meta");
const BACKUP_DIR = path.join(META_DIR, "backups");
const DATASET_PATH = path.join(ROOT_DIR, "src", "data", "grammar-chunks.ts");
const TOPIC_PLAN_PATH = path.join(META_DIR, "topic_plan.json");
const PHRASE_INDEX_PATH = path.join(META_DIR, "phrase_index.json");
const TOPIC_PHRASE_INDEX_PATH = path.join(META_DIR, "topic_phrase_index.json");
const BATCH_STATE_PATH = path.join(META_DIR, "batch_state.json");
const BATCH_LOG_PATH = path.join(META_DIR, "batch_log.jsonl");
const VALIDATION_REPORT_PATH = path.join(META_DIR, "validation_report.json");

const APPROVED_LEVELS: AllowedLevel[] = ["A1", "A2", "B1", "B2"];
const ALLOWED_TYPES = new Set([
  "communication phrase",
  "collocation",
  "phrasal verb",
  "single vocabulary word",
]);
const ARTICLE_TOKENS = new Set(["a", "an", "the"]);
const LOW_VALUE_MODIFIERS = new Set([
  "my",
  "your",
  "our",
  "his",
  "her",
  "their",
  "its",
  "this",
  "that",
  "these",
  "those",
  "final",
  "clear",
  "short",
  "quick",
  "new",
  "small",
  "big",
  "honest",
  "calm",
  "kind",
]);
const BANNED_PHRASE_PATTERNS = [
  /\bdeep learning\b/i,
  /\bneural network\b/i,
  /\bthermodynamics\b/i,
  /\bseries a funding\b/i,
  /\bangel investor\b/i,
  /\bsap modules?\b/i,
  /\bconfidential agreement\b/i,
  /\blora\b/i,
];
const GENERIC_EXAMPLE_PATTERNS = [
  /^this is /i,
  /^it is important to /i,
  /^in daily life/i,
  /^people often /i,
];

const TOPIC_SPECS: Array<Pick<TopicPlanEntry, "topic" | "idStart" | "idEnd" | "targetCount">> = [
  { topic: "Daily Life", idStart: 1, idEnd: 150, targetCount: 150 },
  { topic: "Home & Household", idStart: 151, idEnd: 300, targetCount: 150 },
  { topic: "Personal Habits", idStart: 301, idEnd: 450, targetCount: 150 },
  { topic: "Time & Schedules", idStart: 451, idEnd: 600, targetCount: 150 },
  { topic: "Food & Cooking", idStart: 601, idEnd: 750, targetCount: 150 },
  { topic: "Shopping", idStart: 751, idEnd: 900, targetCount: 150 },
  { topic: "Transportation", idStart: 901, idEnd: 1050, targetCount: 150 },
  { topic: "Health & Fitness", idStart: 1051, idEnd: 1200, targetCount: 150 },
  { topic: "Travel", idStart: 1201, idEnd: 1350, targetCount: 150 },
  { topic: "Weather", idStart: 1351, idEnd: 1500, targetCount: 150 },
  { topic: "Family & Relationships", idStart: 1501, idEnd: 1650, targetCount: 150 },
  { topic: "Friends & Social Life", idStart: 1651, idEnd: 1800, targetCount: 150 },
  { topic: "Emotions & Feelings", idStart: 1801, idEnd: 1950, targetCount: 150 },
  { topic: "Communication", idStart: 1951, idEnd: 2100, targetCount: 150 },
  { topic: "Entertainment", idStart: 2101, idEnd: 2250, targetCount: 150 },
  { topic: "Education", idStart: 2251, idEnd: 2400, targetCount: 150 },
  { topic: "Technology (basic)", idStart: 2401, idEnd: 2550, targetCount: 150 },
  { topic: "Media & Internet", idStart: 2551, idEnd: 2700, targetCount: 150 },
  { topic: "Work & Career", idStart: 2701, idEnd: 2850, targetCount: 150 },
  { topic: "Business Communication", idStart: 2851, idEnd: 3000, targetCount: 150 },
];

const TOPIC_LOOKUP = new Map(TOPIC_SPECS.map((spec) => [spec.topic, spec]));

function ensureMetaDir(): void {
  fs.mkdirSync(META_DIR, { recursive: true });
}

function ensureBackupDir(): void {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function nowIso(): string {
  return new Date().toISOString();
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJsonFile(filePath: string, data: unknown): void {
  ensureMetaDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function appendJsonLine(filePath: string, data: unknown): void {
  ensureMetaDir();
  fs.appendFileSync(filePath, JSON.stringify(data) + "\n", "utf8");
}

function parseArgs(argv: string[]): { command: string; options: Record<string, string> } {
  const [command = "help", ...rest] = argv;
  const options: Record<string, string> = {};

  for (const arg of rest) {
    if (!arg.startsWith("--")) {
      continue;
    }

    const [rawKey, rawValue] = arg.slice(2).split("=");
    if (rawKey) {
      options[rawKey] = rawValue ?? "true";
    }
  }

  return { command, options };
}

function findMatchingBracket(source: string, startIndex: number): number {
  let depth = 0;
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === "[") {
      depth += 1;
      continue;
    }

    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  throw new Error("Unable to find matching array bracket in dataset file.");
}

function extractNamedArray(source: string, constantName: string): string | null {
  const declarationCandidates = [`export const ${constantName}`, `const ${constantName}`];

  for (const declaration of declarationCandidates) {
    const declarationIndex = source.indexOf(declaration);
    if (declarationIndex === -1) {
      continue;
    }

    const equalsIndex = source.indexOf("=", declarationIndex);
    const arrayStart = source.indexOf("[", equalsIndex);
    if (arrayStart === -1) {
      continue;
    }

    const arrayEnd = findMatchingBracket(source, arrayStart);
    return source.slice(arrayStart, arrayEnd + 1);
  }

  if (constantName === "VOCAB_CHUNKS") {
    const trimmed = source.trim();
    if (trimmed.startsWith("[")) {
      const arrayEnd = findMatchingBracket(trimmed, 0);
      return trimmed.slice(0, arrayEnd + 1);
    }
  }

  return null;
}

function loadDataset(): { vocabChunks: ChunkEntry[]; grammarPatterns: unknown[] } {
  const source = fs.readFileSync(DATASET_PATH, "utf8");
  if (!source.trim()) {
    return {
      vocabChunks: [],
      grammarPatterns: [],
    };
  }

  const vocabArrayText = extractNamedArray(source, "VOCAB_CHUNKS");

  if (!vocabArrayText) {
    throw new Error(`Could not locate VOCAB_CHUNKS in ${DATASET_PATH}`);
  }

  const grammarArrayText = extractNamedArray(source, "GRAMMAR_PATTERNS") ?? "[]";

  return {
    vocabChunks: JSON.parse(vocabArrayText) as ChunkEntry[],
    grammarPatterns: JSON.parse(grammarArrayText) as unknown[],
  };
}

function saveDataset(vocabChunks: ChunkEntry[], grammarPatterns: unknown[]): void {
  const output = `export const VOCAB_CHUNKS = ${JSON.stringify(vocabChunks, null, 2)};\n\nexport const GRAMMAR_PATTERNS = ${JSON.stringify(grammarPatterns, null, 2)};\n`;
  fs.writeFileSync(DATASET_PATH, output, "utf8");
}

function createBackupIfNeeded(): string | null {
  if (!fs.existsSync(DATASET_PATH)) {
    return null;
  }

  const content = fs.readFileSync(DATASET_PATH, "utf8");
  if (!content.trim()) {
    return null;
  }

  ensureBackupDir();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `grammar-chunks.${stamp}.ts`);
  fs.writeFileSync(backupPath, content, "utf8");
  return backupPath;
}

function normalizeSpacing(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizePhrase(rawPhrase: string): string {
  return normalizeSpacing(
    rawPhrase
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[’`]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/[^a-z0-9\s'\-]/g, " ")
  );
}

function canonicalizePhrase(rawPhrase: string): string {
  const tokens = normalizePhrase(rawPhrase)
    .split(" ")
    .filter((token) => token && !ARTICLE_TOKENS.has(token));

  return tokens.join(" ");
}

function buildNearDuplicateKey(rawPhrase: string): string {
  const tokens = canonicalizePhrase(rawPhrase)
    .split(" ")
    .filter((token) => token && !LOW_VALUE_MODIFIERS.has(token));

  return tokens.join(" ");
}

function toNumericId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value);
  }

  return null;
}

function looksCorruptedVietnamese(value: string): boolean {
  return /�/.test(value) || /[A-Za-zÀ-ỹ]\?[A-Za-zÀ-ỹ]/u.test(value);
}

function validateIpa(ipa: string): boolean {
  const trimmed = ipa.trim();
  if (!trimmed.startsWith("/") || !trimmed.endsWith("/")) {
    return false;
  }

  const body = trimmed.slice(1, -1).trim();
  if (!body) {
    return false;
  }

  if (/[?�]/.test(body)) {
    return false;
  }

  if (/^[A-Za-z\s'-]+$/.test(body)) {
    return false;
  }

  return true;
}

function addIssue(report: ValidationReport, issue: ValidationIssue): void {
  report.issues.push(issue);
}

function createEmptyReport(totalEntries: number): ValidationReport {
  return {
    generatedAt: nowIso(),
    totalEntries,
    approvedTopicEntries: 0,
    issues: [],
    topicCounts: Object.fromEntries(TOPIC_SPECS.map((spec) => [spec.topic, 0])),
  };
}

function buildArtifacts(chunks: ChunkEntry[]): BuildArtifacts {
  const report = createEmptyReport(chunks.length);
  const phraseItems: Record<string, PhraseIndexItem> = {};
  const topicKeyMap = Object.fromEntries(TOPIC_SPECS.map((spec) => [spec.topic, new Set<string>()])) as Record<string, Set<string>>;
  const topicIds = new Map<string, number[]>();
  const seenNearKeys = new Map<string, string>();

  for (const chunk of chunks) {
    const rawPhrase = typeof chunk.phrase === "string" ? normalizeSpacing(chunk.phrase) : "";
    const topic = typeof chunk.topic === "string" ? chunk.topic.trim() : "";
    const numericId = toNumericId(chunk.id);

    if (!rawPhrase) {
      addIssue(report, {
        severity: "error",
        code: "missing_phrase",
        message: "Entry is missing a usable phrase.",
        entryId: chunk.id,
        topic,
      });
      continue;
    }

    if (!TOPIC_LOOKUP.has(topic)) {
      addIssue(report, {
        severity: "error",
        code: "invalid_topic",
        message: `Phrase uses a non-approved topic: ${topic || "(empty)"}.`,
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    } else {
      report.approvedTopicEntries += 1;
      report.topicCounts[topic] += 1;
    }

    if (!chunk.level || !APPROVED_LEVELS.includes(chunk.level as AllowedLevel)) {
      addIssue(report, {
        severity: "error",
        code: "invalid_level",
        message: `Phrase must use one of A1, A2, B1, B2. Received: ${chunk.level ?? "(empty)"}.`,
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    }

    if (!chunk.type || !ALLOWED_TYPES.has(chunk.type)) {
      addIssue(report, {
        severity: "error",
        code: "invalid_type",
        message: `Phrase must use an approved type. Received: ${chunk.type ?? "(empty)"}.`,
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    }

    for (const pattern of BANNED_PHRASE_PATTERNS) {
      if (pattern.test(rawPhrase)) {
        addIssue(report, {
          severity: "error",
          code: "banned_phrase_domain",
          message: "Phrase looks too technical or niche for the communication-focused dataset.",
          entryId: chunk.id,
          topic,
          phrase: rawPhrase,
        });
        break;
      }
    }

    if (!chunk.base_word || !normalizeSpacing(chunk.base_word)) {
      addIssue(report, {
        severity: "error",
        code: "missing_base_word",
        message: "Phrase is missing base_word.",
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    }

    if (!chunk.ipa || !validateIpa(chunk.ipa)) {
      addIssue(report, {
        severity: "error",
        code: "invalid_ipa",
        message: "Phrase has missing, fake, or malformed IPA.",
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    }

    for (const [fieldName, fieldValue] of [
      ["meaning_vi", chunk.meaning_vi],
      ["example_vi", chunk.example_vi],
      ["explanation_vi", chunk.explanation_vi],
    ] as Array<[string, string | undefined]>) {
      if (!fieldValue || !normalizeSpacing(fieldValue)) {
        addIssue(report, {
          severity: "error",
          code: `missing_${fieldName}`,
          message: `Phrase is missing ${fieldName}.`,
          entryId: chunk.id,
          topic,
          phrase: rawPhrase,
        });
        continue;
      }

      if (looksCorruptedVietnamese(fieldValue)) {
        addIssue(report, {
          severity: "error",
          code: `corrupted_${fieldName}`,
          message: `${fieldName} contains broken Vietnamese encoding.`,
          entryId: chunk.id,
          topic,
          phrase: rawPhrase,
        });
      }
    }

    if (!chunk.example_en || !normalizeSpacing(chunk.example_en)) {
      addIssue(report, {
        severity: "error",
        code: "missing_example_en",
        message: "Phrase is missing example_en.",
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    } else if (GENERIC_EXAMPLE_PATTERNS.some((pattern) => pattern.test(chunk.example_en ?? ""))) {
      addIssue(report, {
        severity: "warning",
        code: "generic_example_en",
        message: "example_en looks generic or templated.",
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    }

    const canonicalKey = canonicalizePhrase(rawPhrase);
    const nearKey = buildNearDuplicateKey(rawPhrase) || canonicalKey;
    if (!canonicalKey) {
      addIssue(report, {
        severity: "error",
        code: "empty_canonical_key",
        message: "Phrase collapses to an empty canonical key after normalization.",
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
      continue;
    }

    if (phraseItems[canonicalKey]) {
      addIssue(report, {
        severity: "error",
        code: "duplicate_phrase",
        message: `Phrase duplicates canonical key already in dataset: ${canonicalKey}.`,
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    }

    const existingNearKeyPhrase = seenNearKeys.get(nearKey);
    if (existingNearKeyPhrase && existingNearKeyPhrase !== canonicalKey) {
      addIssue(report, {
        severity: "warning",
        code: "near_duplicate_phrase",
        message: `Phrase is a near-duplicate variant of ${existingNearKeyPhrase}.`,
        entryId: chunk.id,
        topic,
        phrase: rawPhrase,
      });
    } else {
      seenNearKeys.set(nearKey, canonicalKey);
    }

    phraseItems[canonicalKey] = {
      canonicalKey,
      nearKey,
      normalizedPhrase: normalizePhrase(rawPhrase),
      rawVariants: [rawPhrase],
      topics: topic ? [topic] : [],
      ids: numericId === null ? [] : [numericId],
    };

    if (topicKeyMap[topic]) {
      topicKeyMap[topic].add(canonicalKey);
    }

    if (topic && numericId !== null) {
      const ids = topicIds.get(topic) ?? [];
      ids.push(numericId);
      topicIds.set(topic, ids);
    }

    if (topic && numericId !== null && TOPIC_LOOKUP.has(topic)) {
      const spec = TOPIC_LOOKUP.get(topic)!;
      if (numericId < spec.idStart || numericId > spec.idEnd) {
        addIssue(report, {
          severity: "warning",
          code: "id_out_of_topic_range",
          message: `ID ${numericId} is outside the approved range ${spec.idStart}-${spec.idEnd} for ${topic}.`,
          entryId: chunk.id,
          topic,
          phrase: rawPhrase,
        });
      }
    }
  }

  const plan = TOPIC_SPECS.map((spec) => {
    const currentCount = report.topicCounts[spec.topic] ?? 0;
    const numericIds = (topicIds.get(spec.topic) ?? []).filter((id) => id >= spec.idStart && id <= spec.idEnd);
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : spec.idStart;
    const status: TopicStatus = currentCount >= spec.targetCount ? "completed" : currentCount > 0 ? "in-progress" : "planned";

    if (currentCount > spec.targetCount) {
      addIssue(report, {
        severity: "warning",
        code: "topic_over_target",
        message: `${spec.topic} already has ${currentCount} items, above target ${spec.targetCount}.`,
        topic: spec.topic,
      });
    }

    return {
      ...spec,
      currentCount,
      nextId,
      status,
    };
  });

  return {
    plan,
    phraseIndex: {
      generatedAt: report.generatedAt,
      totalKeys: Object.keys(phraseItems).length,
      items: phraseItems,
    },
    topicPhraseIndex: {
      generatedAt: report.generatedAt,
      topics: Object.fromEntries(
        Object.entries(topicKeyMap).map(([topic, keys]) => [topic, Array.from(keys).sort()])
      ),
    },
    report,
  };
}

function chooseNextTopic(plan: TopicPlanEntry[]): string | null {
  const next = plan.find((entry) => entry.currentCount < entry.targetCount && entry.nextId <= entry.idEnd);
  return next?.topic ?? null;
}

function buildBatchState(plan: TopicPlanEntry[], currentTopic: string | null = null): BatchState {
  const activeTopic = currentTopic ?? chooseNextTopic(plan);
  const activePlan = activeTopic ? plan.find((entry) => entry.topic === activeTopic) : undefined;
  const nextTopic = chooseNextTopic(
    plan.map((entry) => (entry.topic === activeTopic ? { ...entry, currentCount: entry.targetCount } : entry))
  );

  return {
    currentTopic: activeTopic,
    nextTopic,
    nextBatchSize: activePlan ? Math.min(20, Math.max(activePlan.targetCount - activePlan.currentCount, 0)) : 0,
    lastCommittedBatchId: null,
    lastCommitTime: null,
    runStatus: "idle",
  };
}

function saveArtifacts(artifacts: BuildArtifacts, batchState?: BatchState): void {
  writeJsonFile(TOPIC_PLAN_PATH, artifacts.plan);
  writeJsonFile(PHRASE_INDEX_PATH, artifacts.phraseIndex);
  writeJsonFile(TOPIC_PHRASE_INDEX_PATH, artifacts.topicPhraseIndex);
  writeJsonFile(VALIDATION_REPORT_PATH, artifacts.report);

  const state = batchState ?? readJsonFile<BatchState | null>(BATCH_STATE_PATH, null) ?? buildBatchState(artifacts.plan);
  writeJsonFile(BATCH_STATE_PATH, state);

  if (!fs.existsSync(BATCH_LOG_PATH)) {
    fs.writeFileSync(BATCH_LOG_PATH, "", "utf8");
  }
}

function printValidationSummary(report: ValidationReport): void {
  const errors = report.issues.filter((issue) => issue.severity === "error").length;
  const warnings = report.issues.filter((issue) => issue.severity === "warning").length;
  console.log(`Validation complete: ${report.totalEntries} entries scanned.`);
  console.log(`Approved-topic entries: ${report.approvedTopicEntries}. Errors: ${errors}. Warnings: ${warnings}.`);

  for (const spec of TOPIC_SPECS) {
    console.log(`- ${spec.topic}: ${report.topicCounts[spec.topic]}/${spec.targetCount}`);
  }
}

function initOrReconcileMetadata(): void {
  const { vocabChunks } = loadDataset();
  const artifacts = buildArtifacts(vocabChunks);
  saveArtifacts(artifacts, buildBatchState(artifacts.plan));
  printValidationSummary(artifacts.report);
  console.log(`Metadata written to ${META_DIR}`);
}

function resetDataset(): void {
  const backupPath = createBackupIfNeeded();
  saveDataset([], []);

  const artifacts = buildArtifacts([]);
  saveArtifacts(artifacts, buildBatchState(artifacts.plan));
  fs.writeFileSync(BATCH_LOG_PATH, "", "utf8");

  console.log("Vocabulary dataset reset to an empty state.");
  if (backupPath) {
    console.log(`Backup created at ${backupPath}`);
  } else {
    console.log("No non-empty dataset backup was needed.");
  }
  console.log(`Metadata reinitialized in ${META_DIR}`);
}

function loadArtifactsFromMeta(): { plan: TopicPlanEntry[]; phraseIndex: PhraseIndexFile; topicPhraseIndex: TopicPhraseIndexFile; batchState: BatchState } {
  if (!fs.existsSync(TOPIC_PLAN_PATH) || !fs.existsSync(PHRASE_INDEX_PATH) || !fs.existsSync(TOPIC_PHRASE_INDEX_PATH) || !fs.existsSync(BATCH_STATE_PATH)) {
    throw new Error("Metadata is missing. Run `npm run vocab:init` first.");
  }

  return {
    plan: readJsonFile<TopicPlanEntry[]>(TOPIC_PLAN_PATH, []),
    phraseIndex: readJsonFile<PhraseIndexFile>(PHRASE_INDEX_PATH, { generatedAt: nowIso(), totalKeys: 0, items: {} }),
    topicPhraseIndex: readJsonFile<TopicPhraseIndexFile>(TOPIC_PHRASE_INDEX_PATH, { generatedAt: nowIso(), topics: {} }),
    batchState: readJsonFile<BatchState>(BATCH_STATE_PATH, buildBatchState([])),
  };
}

function summarizeTopicProgress(plan: TopicPlanEntry[], topic: string): string {
  const entry = plan.find((item) => item.topic === topic);
  if (!entry) {
    return "0/150";
  }

  return `${entry.currentCount}/${entry.targetCount}`;
}

function buildGenerationPrompt(topic: string, count: number, existingTopicKeys: string[]): string {
  const bannedTopicList = existingTopicKeys.slice(0, 150).join(", ");
  const desiredSingleWords = Math.max(1, Math.round(count * 0.1));
  const desiredPhrasalVerbs = Math.max(1, Math.round(count * 0.2));
  const desiredCommunicationPhrases = Math.max(count - desiredSingleWords - desiredPhrasalVerbs, 0);

  return [
    `Generate exactly ${count} vocabulary entries for the topic \"${topic}\".`,
    "The dataset is for a communication-focused English learning app.",
    "Use only these levels: A1, A2, B1, B2.",
    "Prefer spoken, practical, high-utility English that learners can say in real conversation.",
    "Do not generate academic jargon, technical jargon, legal jargon, startup language, or niche corporate phrases.",
    `Target type mix for this batch: about ${desiredCommunicationPhrases} communication phrases/collocations, ${desiredPhrasalVerbs} phrasal verbs, ${desiredSingleWords} single vocabulary words.`,
    "Reject robotic adjective-swapped collocations and weak variants that waste a dataset slot.",
    "Do not generate duplicates or low-value near-duplicates of existing dataset phrases.",
    bannedTopicList
      ? `Existing phrases already used in this topic: ${bannedTopicList}. Avoid them and avoid close variants.`
      : "This topic has no existing phrases yet.",
    "Output only a valid JSON array with these fields for every object:",
    `[
  {
    "phrase": "ask for help",
    "base_word": "help",
    "ipa": "/ɑːsk fɔːr help/",
    "pos": "phrase",
    "type": "communication phrase",
    "topic": "${topic}",
    "subcategory": "Practical interaction",
    "level": "A2",
    "meaning_vi": "nhờ giúp đỡ",
    "example_en": "If you do not understand the task, ask for help.",
    "example_vi": "Nếu bạn không hiểu bài tập, hãy nhờ giúp đỡ.",
    "explanation_vi": "Dùng khi người nói cần sự hỗ trợ từ người khác."
  }
]`,
    "Quality requirements:",
    "- phrase must be natural, useful, and worth one slot in a 3000-entry dataset",
    "- ipa must be real IPA in slash format, not fake spelling",
    "- meaning_vi, example_vi, explanation_vi must use clean, natural Vietnamese with proper Unicode",
    "- example_en must sound like natural everyday English and match the phrase",
    "- topic must stay exactly the same as requested",
    "- levels like B1-core, B2-core, B2-advanced, C1, C2 are forbidden",
  ].join("\n");
}

function normalizeForSets(rawPhrase: string): string {
  return canonicalizePhrase(rawPhrase);
}

function validateGeneratedEntry(
  candidate: ChunkEntry,
  topic: string,
  phraseIndex: PhraseIndexFile,
  topicPhraseIndex: TopicPhraseIndexFile,
  stagedCanonicalKeys: Set<string>,
  stagedNearKeys: Set<string>,
  remainingTopicCapacity: number
): { accepted: boolean; issues: ValidationIssue[]; canonicalKey?: string; nearKey?: string; normalized: ChunkEntry } {
  const issues: ValidationIssue[] = [];
  const normalized: ChunkEntry = {
    phrase: typeof candidate.phrase === "string" ? normalizeSpacing(candidate.phrase) : "",
    base_word: typeof candidate.base_word === "string" ? normalizeSpacing(candidate.base_word) : "",
    ipa: typeof candidate.ipa === "string" ? normalizeSpacing(candidate.ipa) : "",
    pos: typeof candidate.pos === "string" ? normalizeSpacing(candidate.pos) : "",
    type: typeof candidate.type === "string" ? normalizeSpacing(candidate.type) : "",
    topic: typeof candidate.topic === "string" ? normalizeSpacing(candidate.topic) : "",
    subcategory: typeof candidate.subcategory === "string" ? normalizeSpacing(candidate.subcategory) : "General",
    level: typeof candidate.level === "string" ? normalizeSpacing(candidate.level) : "",
    meaning_vi: typeof candidate.meaning_vi === "string" ? normalizeSpacing(candidate.meaning_vi) : "",
    example_en: typeof candidate.example_en === "string" ? normalizeSpacing(candidate.example_en) : "",
    example_vi: typeof candidate.example_vi === "string" ? normalizeSpacing(candidate.example_vi) : "",
    explanation_vi: typeof candidate.explanation_vi === "string" ? normalizeSpacing(candidate.explanation_vi) : "",
  };

  if (!normalized.phrase) {
    issues.push({ severity: "error", code: "missing_phrase", message: "Generated entry is missing phrase." });
    return { accepted: false, issues, normalized };
  }

  const canonicalKey = canonicalizePhrase(normalized.phrase);
  const nearKey = buildNearDuplicateKey(normalized.phrase) || canonicalKey;

  if (!canonicalKey) {
    issues.push({ severity: "error", code: "empty_canonical_key", message: "Generated phrase collapses to empty canonical form.", phrase: normalized.phrase, topic });
  }

  if (!normalized.base_word) {
    issues.push({ severity: "error", code: "missing_base_word", message: "Generated entry is missing base_word.", phrase: normalized.phrase, topic });
  }

  if (!normalized.topic || normalized.topic !== topic) {
    issues.push({ severity: "error", code: "topic_mismatch", message: `Generated topic must stay exactly ${topic}.`, phrase: normalized.phrase, topic: normalized.topic });
  }

  if (!normalized.level || !APPROVED_LEVELS.includes(normalized.level as AllowedLevel)) {
    issues.push({ severity: "error", code: "invalid_level", message: `Generated level must be one of ${APPROVED_LEVELS.join(", ")}.`, phrase: normalized.phrase, topic });
  }

  if (!normalized.type || !ALLOWED_TYPES.has(normalized.type)) {
    issues.push({ severity: "error", code: "invalid_type", message: "Generated type is not allowed.", phrase: normalized.phrase, topic });
  }

  if (!normalized.ipa || !validateIpa(normalized.ipa)) {
    issues.push({ severity: "error", code: "invalid_ipa", message: "Generated IPA is missing or malformed.", phrase: normalized.phrase, topic });
  }

  for (const [fieldName, fieldValue] of [
    ["meaning_vi", normalized.meaning_vi],
    ["example_vi", normalized.example_vi],
    ["explanation_vi", normalized.explanation_vi],
  ] as Array<[string, string | undefined]>) {
    if (!fieldValue) {
      issues.push({ severity: "error", code: `missing_${fieldName}`, message: `Generated entry is missing ${fieldName}.`, phrase: normalized.phrase, topic });
      continue;
    }

    if (looksCorruptedVietnamese(fieldValue)) {
      issues.push({ severity: "error", code: `corrupted_${fieldName}`, message: `${fieldName} contains corrupted Vietnamese text.`, phrase: normalized.phrase, topic });
    }
  }

  if (!normalized.example_en) {
    issues.push({ severity: "error", code: "missing_example_en", message: "Generated entry is missing example_en.", phrase: normalized.phrase, topic });
  } else if (GENERIC_EXAMPLE_PATTERNS.some((pattern) => pattern.test(normalized.example_en ?? ""))) {
    issues.push({ severity: "warning", code: "generic_example_en", message: "Generated example_en looks generic.", phrase: normalized.phrase, topic });
  }

  for (const pattern of BANNED_PHRASE_PATTERNS) {
    if (pattern.test(normalized.phrase)) {
      issues.push({ severity: "error", code: "banned_phrase_domain", message: "Generated phrase is too technical or niche.", phrase: normalized.phrase, topic });
      break;
    }
  }

  if (canonicalKey && phraseIndex.items[canonicalKey]) {
    issues.push({ severity: "error", code: "duplicate_phrase", message: "Generated phrase already exists in the dataset.", phrase: normalized.phrase, topic });
  }

  if (canonicalKey && stagedCanonicalKeys.has(canonicalKey)) {
    issues.push({ severity: "error", code: "duplicate_in_batch", message: "Generated phrase duplicates another accepted phrase in the same batch.", phrase: normalized.phrase, topic });
  }

  const topicKeys = new Set(topicPhraseIndex.topics[topic] ?? []);
  if (canonicalKey && topicKeys.has(canonicalKey)) {
    issues.push({ severity: "error", code: "duplicate_in_topic", message: "Generated phrase already exists in this topic.", phrase: normalized.phrase, topic });
  }

  if (nearKey && stagedNearKeys.has(nearKey)) {
    issues.push({ severity: "warning", code: "near_duplicate_in_batch", message: "Generated phrase is too close to another accepted phrase in this batch.", phrase: normalized.phrase, topic });
  }

  const nearKeyExists = Object.values(phraseIndex.items).some((item) => item.nearKey === nearKey);
  if (nearKey && nearKeyExists) {
    issues.push({ severity: "warning", code: "near_duplicate_dataset", message: "Generated phrase is too close to an existing dataset phrase.", phrase: normalized.phrase, topic });
  }

  if (remainingTopicCapacity <= 0) {
    issues.push({ severity: "error", code: "topic_full", message: `${topic} already reached its target count.`, phrase: normalized.phrase, topic });
  }

  const blockingIssues = issues.filter((issue) => issue.severity === "error");
  return {
    accepted: blockingIssues.length === 0,
    issues,
    canonicalKey,
    nearKey,
    normalized,
  };
}

async function generateNextBatch(options: Record<string, string>): Promise<void> {
  const { vocabChunks, grammarPatterns } = loadDataset();
  const { plan, phraseIndex, topicPhraseIndex, batchState } = loadArtifactsFromMeta();

  const explicitTopic = options.topic ? decodeURIComponent(options.topic) : undefined;
  const currentTopic = explicitTopic ?? batchState.currentTopic ?? chooseNextTopic(plan);
  if (!currentTopic) {
    console.log("All approved topics are already at target count.");
    return;
  }

  const topicPlan = plan.find((entry) => entry.topic === currentTopic);
  if (!topicPlan) {
    throw new Error(`Unknown topic requested: ${currentTopic}`);
  }

  const remainingCapacity = Math.max(topicPlan.targetCount - topicPlan.currentCount, 0);
  if (remainingCapacity === 0) {
    console.log(`${currentTopic} is already complete (${summarizeTopicProgress(plan, currentTopic)}).`);
    return;
  }

  const requestedCount = options.count ? Number(options.count) : 20;
  const batchSize = Math.min(remainingCapacity, Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : 20);
  const topicExistingKeys = topicPhraseIndex.topics[currentTopic] ?? [];
  const acceptedEntries: ChunkEntry[] = [];
  const stagedCanonicalKeys = new Set<string>();
  const stagedNearKeys = new Set<string>();
  const rejectionIssues: ValidationIssue[] = [];
  const existingCanonicalKeys = new Set(Object.keys(phraseIndex.items));
  const existingTopicCanonicalKeys = new Set(topicExistingKeys);

  console.log(`Generating next batch for ${currentTopic}. Progress before batch: ${summarizeTopicProgress(plan, currentTopic)}.`);

  const offlineCandidates = generateOfflineEntriesForTopic(currentTopic, Math.max(batchSize * 2, 40), existingCanonicalKeys, existingTopicCanonicalKeys);

  for (const rawItem of offlineCandidates) {
    if (acceptedEntries.length >= batchSize) {
      break;
    }

    const remainingSlots = batchSize - acceptedEntries.length;
    const result = validateGeneratedEntry(
      rawItem,
      currentTopic,
      phraseIndex,
      topicPhraseIndex,
      stagedCanonicalKeys,
      stagedNearKeys,
      remainingSlots
    );

    rejectionIssues.push(...result.issues.filter((issue) => !result.accepted || issue.severity === "warning"));

    if (!result.accepted || !result.canonicalKey || !result.nearKey) {
      continue;
    }

    const nextId = topicPlan.nextId + acceptedEntries.length;
    if (nextId > topicPlan.idEnd) {
      rejectionIssues.push({
        severity: "error",
        code: "id_range_exhausted",
        message: `${currentTopic} has no remaining IDs inside ${topicPlan.idStart}-${topicPlan.idEnd}.`,
        topic: currentTopic,
        phrase: result.normalized.phrase,
      });
      break;
    }

    stagedCanonicalKeys.add(result.canonicalKey);
    stagedNearKeys.add(result.nearKey);
    acceptedEntries.push({
      ...result.normalized,
      id: nextId,
    });
  }

  if (acceptedEntries.length === 0) {
    appendJsonLine(BATCH_LOG_PATH, {
      batchId: `failed-${Date.now()}`,
      topic: currentTopic,
      requested: batchSize,
      accepted: 0,
      rejected: rejectionIssues.length,
      timestamp: nowIso(),
      status: "failed",
    });
    throw new Error(`No valid entries were accepted for ${currentTopic}. Check ${VALIDATION_REPORT_PATH} and ${BATCH_LOG_PATH}.`);
  }

  const updatedChunks = [...vocabChunks, ...acceptedEntries];
  saveDataset(updatedChunks, grammarPatterns);

  const artifacts = buildArtifacts(updatedChunks);
  const refreshedCurrentTopic = artifacts.plan.find((entry) => entry.topic === currentTopic)?.topic ?? currentTopic;
  const nextTopic = chooseNextTopic(artifacts.plan);
  const refreshedTopicPlan = artifacts.plan.find((entry) => entry.topic === currentTopic);
  const refreshedBatchState: BatchState = {
    currentTopic: refreshedTopicPlan && refreshedTopicPlan.currentCount < refreshedTopicPlan.targetCount ? refreshedCurrentTopic : nextTopic,
    nextTopic,
    nextBatchSize: refreshedTopicPlan
      ? Math.min(20, Math.max(refreshedTopicPlan.targetCount - refreshedTopicPlan.currentCount, 0))
      : 0,
    lastCommittedBatchId: `batch-${Date.now()}`,
    lastCommitTime: nowIso(),
    runStatus: "idle",
  };

  saveArtifacts(artifacts, refreshedBatchState);
  appendJsonLine(BATCH_LOG_PATH, {
    batchId: refreshedBatchState.lastCommittedBatchId,
    topic: currentTopic,
    requested: batchSize,
    accepted: acceptedEntries.length,
    rejected: rejectionIssues.filter((issue) => issue.severity === "error").length,
    idRange: {
      start: acceptedEntries[0]?.id,
      end: acceptedEntries[acceptedEntries.length - 1]?.id,
    },
    timestamp: refreshedBatchState.lastCommitTime,
    status: "committed",
  });

  writeJsonFile(VALIDATION_REPORT_PATH, {
    ...artifacts.report,
    batchRejections: rejectionIssues,
  });

  console.log(`Committed ${acceptedEntries.length} entries to ${currentTopic}. Progress is now ${summarizeTopicProgress(artifacts.plan, currentTopic)}.`);
  if (rejectionIssues.length > 0) {
    console.log(`Rejected or warned entries captured: ${rejectionIssues.length}. See ${VALIDATION_REPORT_PATH}.`);
  }
}

async function generateAllBatches(): Promise<void> {
  while (true) {
    const { plan, batchState } = loadArtifactsFromMeta();
    const nextTopic = batchState.currentTopic ?? chooseNextTopic(plan);
    if (!nextTopic) {
      console.log("All topics have reached target count.");
      return;
    }

    const topicPlan = plan.find((entry) => entry.topic === nextTopic);
    if (!topicPlan) {
      throw new Error(`Unknown topic in batch state: ${nextTopic}`);
    }

    const remaining = topicPlan.targetCount - topicPlan.currentCount;
    if (remaining <= 0) {
      await generateNextBatch({ topic: encodeURIComponent(nextTopic), count: "0" });
      continue;
    }

    await generateNextBatch({ topic: encodeURIComponent(nextTopic), count: String(Math.min(remaining, 150)) });
  }
}

function printStatus(): void {
  const artifacts = loadArtifactsFromMeta();
  console.log(`Current topic: ${artifacts.batchState.currentTopic ?? "none"}`);
  console.log(`Next topic: ${artifacts.batchState.nextTopic ?? "none"}`);
  console.log(`Next batch size: ${artifacts.batchState.nextBatchSize}`);
  for (const entry of artifacts.plan) {
    console.log(`- ${entry.topic}: ${entry.currentCount}/${entry.targetCount} | nextId=${entry.nextId} | status=${entry.status}`);
  }
}

function printHelp(): void {
  console.log("Vocabulary pipeline commands:");
  console.log("- npm run vocab:reset");
  console.log("- npm run vocab:init");
  console.log("- npm run vocab:reconcile");
  console.log("- npm run vocab:validate");
  console.log("- npm run vocab:status");
  console.log("- npm run vocab:generate-next -- --topic=Communication --count=20");
  console.log("- npm run vocab:generate-all");
}

async function main(): Promise<void> {
  const { command, options } = parseArgs(process.argv.slice(2));

  switch (command) {
    case "reset":
      resetDataset();
      return;
    case "init":
    case "reconcile":
      initOrReconcileMetadata();
      return;
    case "validate": {
      const { vocabChunks } = loadDataset();
      const artifacts = buildArtifacts(vocabChunks);
      saveArtifacts(artifacts, readJsonFile<BatchState | null>(BATCH_STATE_PATH, null) ?? buildBatchState(artifacts.plan));
      printValidationSummary(artifacts.report);
      return;
    }
    case "generate-next":
      await generateNextBatch(options);
      return;
    case "generate-all":
      await generateAllBatches();
      return;
    case "status":
      printStatus();
      return;
    default:
      printHelp();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});