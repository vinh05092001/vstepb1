const geminiKey = process.env.GEMINI_KEY_1 || "";
const githubToken = process.env.GITHUB_MODELS_TOKEN || "";
const qwenKey = process.env.QWEN_API_KEY || "";

async function listGemini() {
    console.log("Fetching Gemini models...");
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const data = await res.json();
        if(data.models) {
            const names = data.models.map(m => m.name.replace('models/', '')).filter(n => n.includes('gemini'));
            console.log("Gemini Models:", names.join(', '));
        } else {
            console.log("Gemini error:", data);
        }
    } catch(e) {
        console.log("Gemini fetch error:", e.message);
    }
}

async function testGPT(model, useSystem) {
    console.log(`Testing GPT ${model} (System role: ${useSystem})...`);
    const messages = useSystem 
        ? [ { role: "system", content: "You are helpful." }, { role: "user", content: "hi" } ]
        : [ { role: "user", content: "hi" } ];
        
    try {
        const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${githubToken}` },
            body: JSON.stringify({ model: model, messages: messages })
        });
        console.log(`GPT ${model} (System role: ${useSystem}) -> Status: ${res.status}`);
        if(!res.ok) console.log(await res.text().catch(()=>""));
    } catch(e) {
         console.log(`GPT ${model} fetch error:`, e.message);
    }
}

async function listQwen() {
    console.log(`Testing Qwen models list...`);
    try {
        const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/models", {
            method: "GET",
            headers: { "Authorization": `Bearer ${qwenKey}` }
        });
        console.log(`Qwen List Status: ${res.status}`);
        const data = await res.json();
        if(data.data) {
             const names = data.data.map(m => m.id);
             console.log("Qwen Models:", names.join(', '));
        } else {
             console.log("Qwen error:", data);
        }
    } catch(e) {
         console.log(`Qwen List fetch error:`, e.message);
    }
}

async function run() {
    await listGemini();
    await listQwen();
    await testGPT("gpt-5", true);
    await testGPT("gpt-5", false);
    await testGPT("gpt-4o", true);
}
run();

