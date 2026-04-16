const fs = require("fs");

const geminiKey = process.env.GEMINI_KEY_1 || "";
const githubToken = process.env.GITHUB_MODELS_TOKEN || "";

async function testGemini() {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const data = await res.json();
        if (data.models) {
            return data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace("models/", ""));
        }
    } catch (e) { }
    return [];
}

async function testGithub() {
    try {
        const res = await fetch("https://models.inference.ai.azure.com/models", {
            headers: {
                "Authorization": `Bearer ${githubToken}`
            }
        });
        const data = await res.json();
        if (data.data) {
             return data.data.map(m => m.id);
        }
    } catch (e) { }
    return [];
}

async function run() {
    const geminiModels = await testGemini();
    const githubModels = await testGithub();
    fs.writeFileSync("models.json", JSON.stringify({ gemini: geminiModels, github: githubModels }, null, 2));
}

run();

