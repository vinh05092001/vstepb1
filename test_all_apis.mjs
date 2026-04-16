import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envContent = '';
try { envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8'); } catch(e) {}
const envVars = {};
envContent.split('\n').forEach(line => {
   const match = line.match(/^([^=]+)=(.*)$/);
   if (match) envVars[match[1].trim()] = match[2].trim();
});

const results = [];

async function logResult(apiName, status, details) {
    const mark = status === 'OK' ? '✅' : '❌';
    const msg = `${mark} [${apiName}] ${status} - ${details}`;
    console.log(msg);
    results.push(msg);
}

// 1. Test Gemini
async function testGemini(keyIndex, keyStr) {
    if (!keyStr) {
        await logResult(`Gemini Key ${keyIndex}`, 'SKIP', 'Key not found');
        return;
    }
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyStr}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        });
        if (res.ok) {
            await logResult(`Gemini Key ${keyIndex}`, 'OK', 'gemini-2.0-flash is active');
        } else {
            const err = await res.text();
            await logResult(`Gemini Key ${keyIndex}`, 'FAIL', `${res.status} ${err.substring(0, 50)}`);
        }
    } catch (e) {
        await logResult(`Gemini Key ${keyIndex}`, 'ERROR', e.message);
    }
}

// 2. Test Github Models
async function testGithub() {
    const keyStr = envVars['GITHUB_MODELS_TOKEN'];
    if (!keyStr) return logResult('GitHub Azure', 'SKIP', 'No token');
    try {
        const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${keyStr}` },
            body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: "hi" }] })
        });
        if (res.ok) {
            await logResult('GitHub Azure', 'OK', 'gpt-4o is active');
        } else {
            const err = await res.json();
            await logResult('GitHub Azure', 'FAIL', `${res.status} - ${err.error?.message || err.error?.code}`);
        }
    } catch (e) {
        await logResult('GitHub Azure', 'ERROR', e.message);
    }
}

// 3. Test OpenAI
async function testOpenAI() {
    const keyStr = envVars['OPENAI_API_KEY'];
    if (!keyStr) return logResult('OpenAI', 'SKIP', 'No token');
    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${keyStr}` },
            body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: "hi" }] })
        });
        if (res.ok) {
            await logResult('OpenAI', 'OK', 'gpt-4o-mini is active');
        } else {
            const err = await res.json();
            await logResult('OpenAI', 'FAIL', `${res.status} - ${err.error?.message || err.error?.code}`);
        }
    } catch (e) {
        await logResult('OpenAI', 'ERROR', e.message);
    }
}

// 4. Test OpenRouter
async function testOpenRouter() {
    const keyStr = envVars['OPENROUTER_API_KEY'];
    if (!keyStr) return logResult('OpenRouter', 'SKIP', 'No token');
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${keyStr}` },
            body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: "hi" }] })
        });
        if (res.ok) {
            await logResult('OpenRouter', 'OK', 'Active');
        } else {
            const err = await res.text();
            await logResult('OpenRouter', 'FAIL', `${res.status} - ${err.substring(0, 50)}`);
        }
    } catch (e) {
        await logResult('OpenRouter', 'ERROR', e.message);
    }
}

// 5. Test Qwen
async function testQwen() {
    const keyStr = envVars['QWEN_API_KEY'];
    if (!keyStr) return logResult('Qwen', 'SKIP', 'No token');
    try {
        const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${keyStr}` },
            body: JSON.stringify({ model: "qwen-plus", messages: [{ role: "user", content: "hi" }] })
        });
        if (res.ok) {
            await logResult('Qwen', 'OK', 'qwen-plus is active');
        } else {
            const err = await res.text();
            await logResult('Qwen', 'FAIL', `${res.status} - ${err.substring(0, 50)}`);
        }
    } catch (e) {
        await logResult('Qwen', 'ERROR', e.message);
    }
}

async function run() {
    console.log("=== API HEALTH CHECK ===");
    await testGemini(1, envVars['GEMINI_KEY_1']);
    await testGemini(2, envVars['GEMINI_KEY_2']);
    await testGemini(3, envVars['GEMINI_KEY_3']);
    await testGithub();
    await testOpenAI();
    await testOpenRouter();
    await testQwen();
    console.log("=== DONE ===");
}
run();
