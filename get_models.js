const fs = require('fs');
const geminiKey = process.env.GEMINI_KEY_1 || "";
const githubToken = process.env.GITHUB_MODELS_TOKEN || "";
const qwenKey = process.env.QWEN_API_KEY || "";

async function run() {
    let out = {};
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const data = await res.json();
        out.gemini = data.models ? data.models.map(m => m.name.replace('models/', '')).filter(n => n.includes('gemini')) : [];
    } catch(e) {}
    
    try {
        const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/models", { headers: { "Authorization": `Bearer ${qwenKey}` }});
        const data = await res.json();
        out.qwen = data.data ? data.data.map(m => m.id) : [];
    } catch(e) {}
    
    fs.writeFileSync('valid_models.json', JSON.stringify(out, null, 2));
}
run();

