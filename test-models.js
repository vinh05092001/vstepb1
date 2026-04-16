const geminiKey = process.env.GEMINI_KEY_1 || "";
const githubToken = process.env.GITHUB_MODELS_TOKEN || "";

async function checkGemini() {
    console.log("================ GEMINI MODELS ================");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const data = await response.json();
        
        if (data.models) {
            const models = data.models.map(m => m.name.replace("models/", ""));
            
            // Lá»c cÃ¡c model Ä‘Ã¡ng chÃº Ã½ (Gemini 2.5, 3.x, thá»­ nghiá»‡m)
            const highlightGemini = models.filter(m => 
                m.includes("gemini-3") || 
                m.includes("gemini-2.5") || 
                m.includes("gemini-2.0") ||
                m.includes("pro-preview") ||
                m.includes("flash-preview")
            );
            
            console.log("ðŸ”¥ CÃ¡c Model Gemini Má»›i Nháº¥t:");
            highlightGemini.forEach(m => console.log(`   - ${m}`));
            
            console.log(`\n(Tá»•ng cá»™ng cÃ³ ${models.length} model há»£p lá»‡ tá»« Gemini)`);
        } else {
            console.log("âŒ Lá»—i khi láº¥y model tá»« Gemini");
        }
    } catch (e) {
        console.log("âŒ KhÃ´ng thá»ƒ káº¿t ná»‘i Gemini API");
    }
}

async function checkGithubModels() {
    console.log("\n================ GITHUB / AZURE MODELS ================");
    try {
        const response = await fetch("https://models.inference.ai.azure.com/models", {
            headers: {
                "Authorization": `Bearer ${githubToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.data) {
            const models = data.data.map(m => m.id);
            
            // Lá»c cÃ¡c model GPT (OpenAI)
            const gptModels = models.filter(m => m.includes("gpt") || m.includes("o1") || m.includes("o3"));
            console.log("ðŸ§  CÃ¡c Model OpenAI (GPT/o-series):");
            gptModels.forEach(m => console.log(`   - ${m}`));
            
            // Lá»c cÃ¡c model Qwen (Alibaba)
            const qwenModels = models.filter(m => m.toLowerCase().includes("qwen"));
            console.log("\nðŸ‰ CÃ¡c Model Alibaba (Qwen):");
            qwenModels.forEach(m => console.log(`   - ${m}`));
            
            // Lá»c cÃ¡c model xAI (Grok) náº¿u cÃ³
            const grokModels = models.filter(m => m.toLowerCase().includes("grok"));
            if (grokModels.length > 0) {
                 console.log("\nâœ– CÃ¡c Model xAI (Grok):");
                 grokModels.forEach(m => console.log(`   - ${m}`));
            }

            console.log(`\n(Tá»•ng cá»™ng cÃ³ ${models.length} model há»£p lá»‡ trÃªn GitHub Models)`);
            
            // Kiá»ƒm tra cá»¥ thá»ƒ GPT-5 vÃ  Qwen-VL-OCR
            console.log("\nðŸ” Kiá»ƒm tra theo yÃªu cáº§u Ä‘áº·c biá»‡t:");
            const hasGpt5 = models.some(m => m.toLowerCase().includes("gpt-5"));
            const hasQwenVl = models.some(m => m.toLowerCase().includes("qwen-vl") || m.toLowerCase().includes("ocr"));
            console.log(`   - CÃ³ GPT-5 khÃ´ng? ${hasGpt5 ? "âœ… CÃ“" : "âŒ KHÃ”NG TÃŒM THáº¤Y TRONG DANH SÃCH API TRáº¢ Vá»€"}`);
            console.log(`   - CÃ³ Qwen VL OCR khÃ´ng? ${hasQwenVl ? "âœ… CÃ“" : "âŒ KHÃ”NG TÃŒM THáº¤Y TRONG DANH SÃCH API TRáº¢ Vá»€"}`);
            
        } else {
            console.log("âŒ Lá»—i khi láº¥y model tá»« GitHub Models");
        }
    } catch (e) {
        console.log("âŒ KhÃ´ng thá»ƒ káº¿t ná»‘i GitHub Models API");
    }
}

async function run() {
    await checkGemini();
    await checkGithubModels();
}

run();

