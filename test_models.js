const githubToken = process.env.GITHUB_MODELS_TOKEN || "";
const qwenKey = process.env.QWEN_API_KEY || "";

async function testAzure(modelName) {
    console.log(`Testing Azure ${modelName}...`);
    const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${githubToken}` },
        body: JSON.stringify({ model: modelName, messages: [{ role: "user", content: "hi" }] })
    });
    console.log(`Azure ${modelName} Status:`, res.status);
    if (!res.ok) console.log(await res.text());
}

async function testQwen(modelName) {
    console.log(`Testing Qwen ${modelName}...`);
    const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${qwenKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName, messages: [{ role: "user", content: "hi" }] })
    });
    console.log(`Qwen ${modelName} Status:`, res.status);
    if (!res.ok) console.log(await res.text());
}

async function run() {
    await testAzure("gpt-5");
    await testAzure("o3");
    await testAzure("gpt-5-chat");
    await testQwen("qwen-max-latest");
    await testQwen("qwen3-max");
}
run();

