const fs = require('fs');
const path = require('path');

// Parse .env.local manually to ensure exact values
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const keys = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    keys[key.trim()] = values.join('=').trim();
  }
});

const geminiKeys = [
  keys['GEMINI_KEY_1'],
  keys['GEMINI_KEY_2'],
  keys['GEMINI_KEY_3']
].filter(Boolean);

console.log(`Found ${geminiKeys.length} potential Gemini API keys in .env.local\n`);

async function testKey(apiKey, index) {
  console.log(`Testing Key ${index + 1}: ${apiKey.substring(0, 10)}... (Length: ${apiKey.length})`);
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Say 'Hello World' in exactly 2 words." }] }]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No text returned";
      console.log(`✅ Key ${index + 1} is VALID! Response: ${text.trim()}\n`);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ Key ${index + 1} FAILED.`);
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${JSON.stringify(errorData)}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Key ${index + 1} FAILED with network error: ${error.message}\n`);
    return false;
  }
}

async function runTests() {
  if (geminiKeys.length === 0) {
    console.log("No Gemini keys found to test.");
    return;
  }
  
  let validKeys = 0;
  for (let i = 0; i < geminiKeys.length; i++) {
    const isValid = await testKey(geminiKeys[i], i);
    if (isValid) validKeys++;
  }
  
  console.log(`\nTest Summary: ${validKeys}/${geminiKeys.length} keys are valid and working.`);
}

runTests();
