const fs = require('fs');

async function main() {
  const filePath = './src/data/grammar-chunks.ts';
  let rawContent = fs.readFileSync(filePath, 'utf8');
  
  // Extract just the VOCAB_CHUNKS array string
  const vocabStart = rawContent.indexOf('export const VOCAB_CHUNKS = [');
  const grammarStart = rawContent.indexOf('export const GRAMMAR_PATTERNS = [');
  
  if (vocabStart === -1 || grammarStart === -1) {
     console.log("Could not find array declarations");
     return;
  }
  
  // We will patch the raw text using Regex to avoid TS compilation issues in Node
  let currentVocabStr = rawContent.substring(vocabStart + 28, grammarStart);
  
  // This is a naive regex parse to replace/inject "base_word" and "word_type". 
  // It's safer to read it, eval it (or parse it), modify objects, then stringify back.
  
  try {
     // Because ts files are tricky to parse natively, we write a temporary JS file, require it, modify, and rewrite.
     fs.writeFileSync('./scripts/temp-data.js', rawContent.replace('export const', 'exports.').replace('export const', 'exports.'));
     const data = require('./temp-data.js');
     
     let updatedVocab = data.VOCAB_CHUNKS.map(item => {
        // Simple heuristic to guess base_word if not exists
        let base_word = item.phrase.split(' ').pop(); // Just take the last word as a fallback base
        
        // If it's a known collocation, try to find the noun or verb
        if (item.phrase.includes('family')) base_word = 'family';
        if (item.phrase.includes('health')) base_word = 'health';
        if (item.phrase.includes('money')) base_word = 'money';
        if (item.phrase.includes('friend')) base_word = 'friend';
        if (item.phrase.includes('work')) base_word = 'work';
        if (item.phrase.includes('job')) base_word = 'job';
        if (item.phrase.includes('time')) base_word = 'time';
        if (item.phrase.includes('food')) base_word = 'food';
        
        let word_type = item.type === 'word' ? 'noun' : 
                        item.type === 'phrasal_verb' ? 'verb' : 'noun';
                        
        return {
           ...item,
           base_word: item.base_word || base_word,
           word_type: item.word_type || word_type
        };
     });
     
     // Reconstruct TS file
     let newTsContent = `export const VOCAB_CHUNKS = ${JSON.stringify(updatedVocab, null, 2)};\n\nexport const GRAMMAR_PATTERNS = ${JSON.stringify(data.GRAMMAR_PATTERNS, null, 2)};\n`;
     fs.writeFileSync(filePath, newTsContent);
     console.log("Successfully patched existing dataset with base_word and word_type.");
     
     // Clean up
     fs.unlinkSync('./scripts/temp-data.js');
     
  } catch (e) {
     console.error("Error patching data:", e);
  }
}

main();
