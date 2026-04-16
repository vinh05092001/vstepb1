const githubToken = process.env.GITHUB_MODELS_TOKEN || "";

async function testAzure(model, useTemp) {
    console.log(`Testing ${model} (Temp: ${useTemp})...`);
    try {
        const payload = {
            model: model,
            messages: [{ role: "user", content: "hello" }]
        };
        if (useTemp) payload.temperature = 0.7;
        
        const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${githubToken}` },
            body: JSON.stringify(payload)
        });
        
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text}`);
    } catch(e) {
        console.log(`Error: ${e.message}`);
    }
}

async function run() {
    await testAzure("gpt-5", true);
    await testAzure("gpt-5", false);
}
run();

