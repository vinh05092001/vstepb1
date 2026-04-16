const fs = require('fs');
const path = require('path');

const chunk1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'grammar_1.json'), 'utf8'));
const chunk2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'grammar_2.json'), 'utf8'));
const chunk3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'grammar_3.json'), 'utf8'));

const allData = [...chunk1, ...chunk2, ...chunk3];

const tsContent = `export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Beginner" | "Intermediate" | "Advanced";

export interface GrammarStructure {
  id: number;
  category: string;
  topic: string;
  subcategory: string;
  pattern: string;
  structure: string;
  level: Level | string;
  meaning_vi: string;
  usage_vi: string;
  example_en: string;
  example_vi: string;
  tags: string[];
}

export const GRAMMAR_STRUCTURES: GrammarStructure[] = ${JSON.stringify(allData, null, 2)};

export function getGrammarStructureById(id: number): GrammarStructure | undefined {
  return GRAMMAR_STRUCTURES.find(g => g.id === id);
}

export function getRandomGrammarStructure(level?: string): GrammarStructure {
  const filtered = level ? GRAMMAR_STRUCTURES.filter(g => g.level === level) : GRAMMAR_STRUCTURES;
  if (filtered.length === 0) return GRAMMAR_STRUCTURES[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
}
`;

const outPath = path.join(__dirname, '../src/data/grammar.ts');
fs.writeFileSync(outPath, tsContent, 'utf8');

console.log('Successfully wrote', allData.length, 'grammar structures to src/data/grammar.ts');
