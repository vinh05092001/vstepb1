import fs from 'fs';
import path from 'path';

/**
 * Merge Script to compile the massive synthesized local datasets back into the static Next.js source tree.
 */

async function main() {
    console.log("Compiling final 3000-item dataset...");

    const sourcePath = path.join(__dirname, '../src/data/grammar-chunks.ts');
    
    // Load existing (safe eval to bypass TS ast compiler complexities)
    const tempPath = path.join(__dirname, 'temp-merge.js');
    let rawSource = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(tempPath, rawSource.replace('export const', 'exports.').replace('export const', 'exports.'));
    
    const existingData = require('./temp-merge.js');
    fs.unlinkSync(tempPath);

    let finalVocab = [...existingData.VOCAB_CHUNKS];
    let finalGrammar = [...existingData.GRAMMAR_PATTERNS];

    // Read Mass Vocab
    const massVocabPath = path.join(__dirname, 'mass_vocab.json');
    if (fs.existsSync(massVocabPath)) {
        const massVocab = JSON.parse(fs.readFileSync(massVocabPath, 'utf8'));
        console.log(`Discovered ${massVocab.length} new Vocabulary Chunks.`);
        
        // Ensure no duplicates by phrase
        for (const item of massVocab) {
           if (!finalVocab.find(v => v.phrase.toLowerCase() === item.phrase.toLowerCase())) {
               // Assign UUID
               item.id = `chunk_${Math.random().toString(36).substr(2, 9)}`;
               finalVocab.push(item);
           }
        }
    }

    // Read Mass Grammar
    const massGrammarPath = path.join(__dirname, 'mass_grammar.json');
    if (fs.existsSync(massGrammarPath)) {
        const massGrammar = JSON.parse(fs.readFileSync(massGrammarPath, 'utf8'));
        console.log(`Discovered ${massGrammar.length} new Grammar Patterns.`);
        
        for (const item of massGrammar) {
           if (!finalGrammar.find(g => g.pattern.toLowerCase() === item.pattern.toLowerCase())) {
               item.id = `grammar_${Math.random().toString(36).substr(2, 9)}`;
               finalGrammar.push(item);
           }
        }
    }

    console.log(`Final Vocab Count: ${finalVocab.length}`);
    console.log(`Final Grammar Count: ${finalGrammar.length}`);

    // Reconstruct TypeScript File
    const tsOutput = `export const VOCAB_CHUNKS = ${JSON.stringify(finalVocab, null, 2)};\n\nexport const GRAMMAR_PATTERNS = ${JSON.stringify(finalGrammar, null, 2)};\n`;
    fs.writeFileSync(sourcePath, tsOutput);
    
    console.log(`✅ Merge complete! Wrote to ${sourcePath}`);
}

main().catch(console.error);
