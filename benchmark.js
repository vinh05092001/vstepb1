const githubToken = process.env.GITHUB_MODELS_TOKEN || "";
const qwenKey = process.env.QWEN_API_KEY || "";
const geminiKey = process.env.GEMINI_KEY_1 || "";

const models = [
    { provider: "OpenAI", name: "gpt-5" },
    { provider: "OpenAI", name: "gpt-4o" },
    { provider: "OpenAI", name: "gpt-4o-mini" },
    { provider: "Gemini", name: "gemini-3.1-pro" },
    { provider: "Gemini", name: "gemini-3.1-flash-lite" },
    { provider: "Gemini", name: "gemini-3-flash" },
    { provider: "Gemini", name: "gemini-2.5-flash" },
    { provider: "Qwen", name: "qwen3-max" },
    { provider: "Qwen", name: "qwen-plus" }
];

async function callOpenAI(model, prompt) {
    const start = Date.now();
    const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${githubToken}` },
        body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }] })
    });
    if(!res.ok) throw new Error(await res.text());
    return Date.now() - start;
}

async function callQwen(model, prompt) {
    const start = Date.now();
    const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${qwenKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }] })
    });
    if(!res.ok) throw new Error(await res.text());
    return Date.now() - start;
}

async function callGemini(model, prompt) {
    const start = Date.now();
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if(!res.ok) throw new Error(await res.text());
    return Date.now() - start;
}

async function run() {
    console.log("Starting quick latency benchmark...");
    const prompt = "Explain the difference between Present Perfect and Past Simple in English grammar. Provide 2 examples each.";
    
    for (const m of models) {
        try {
            let latency = 0;
            if (m.provider === "OpenAI") latency = await callOpenAI(m.name, prompt);
            else if (m.provider === "Qwen") latency = await callQwen(m.name, prompt);
            else if (m.provider === "Gemini") latency = await callGemini(m.name, prompt);
            
            console.log(`${m.provider} - ${m.name}: ${latency}ms`);
        } catch (e) {
            console.log(`${m.provider} - ${m.name}: FAILED - ${e.message.split('\n')[0].substring(0, 100)}`);
        }
    }
}

run();

