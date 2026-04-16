const { GoogleGenAI } = require('@google/genai');

// Here we simulate the environment where Key 1 is completely exhausted (or invalid) but Key 2 is working.
const geminiKeys = [
    "FAKE_EXHAUSTED_KEY", // Simulating a rate-limited key
    process.env.GEMINI_KEY_1 || "", // The actual working key
];

let currentGeminiKeyIndex = 0;

async function simulateGeminiCall(modelName, prompt) {
    let geminiAttempts = 0;
    while (geminiAttempts < geminiKeys.length && geminiKeys.length > 0) {
      try {
        const currentKey = geminiKeys[currentGeminiKeyIndex];
        console.log(`[Testing] Attempting to generate using Gemini Key Index: ${currentGeminiKeyIndex}`);
        
        const ai = new GoogleGenAI({ apiKey: currentKey });
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        
        if (response.text) {
             console.log(`[Testing] âœ… SUCCESS! Output generated successfully using Key Index: ${currentGeminiKeyIndex}.`);
             return response.text;
        }
      } catch (error) {
        console.log(`[Testing] âš ï¸ Gemini Key ${currentGeminiKeyIndex} failed:`, error.message.split('\n')[0].substring(0, 150));
        currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % geminiKeys.length;
        geminiAttempts++;
        console.log(`[Testing] ðŸ”„ Rotating to next Gemini Key...`);
      }
    }
    throw new Error("Gemini exhausted all keys.");
}

async function run() {
    console.log("======================================================");
    console.log("ðŸ¤– [AI ROUTER SIMULATION] Testing Gemini Key Rotation");
    console.log("======================================================");
    await simulateGeminiCall("gemini-3-flash-preview", "Say hello in 3 words.");
}

run();

