import { GoogleGenAI } from "@google/genai";

// 1. Configure the API Keys
const geminiKeys = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_KEY_4
].filter(Boolean) as string[];

const githubToken = process.env.GITHUB_MODELS_TOKEN || "";
const qwenKey = process.env.QWEN_API_KEY || "";

// State to remember which Gemini key we are currently using
let currentGeminiKeyIndex = 0;

// Type definition for task profiles determining model routing
export type TaskProfile = "DeepReasoning" | "FastInteractive" | "BackgroundTask";

/**
 * Intelligent AI Router
 * Dynamically assigns models based on empirical latency and accuracy benchmarks.
 * 
 * DeepReasoning - Max precision. Uses GPT-5 -> Gemini 3 Flash -> Qwen3 Max
 * FastInteractive - Sub-second TTFT. Uses Gemini 3.1 Flash Lite -> GPT-4o -> Qwen Plus
 * BackgroundTask - Structural JSON focus. Uses Gemini 3 Flash -> GPT-4o -> Qwen3 Max
 */
export async function generateAIFallback(systemInstruction: string, prompt: string, taskProfile: TaskProfile = "BackgroundTask"): Promise<string> {
  const profileConfig = {
    "DeepReasoning": { primary: "OpenAI", secondary: "Gemini", emergency: "Qwen", models: { openai: "gpt-5", gemini: "gemini-3-flash-preview", qwen: "qwen-max" } },
    "FastInteractive": { primary: "Gemini", secondary: "OpenAI", emergency: "Qwen", models: { openai: "gpt-4o", gemini: "gemini-3.1-flash-lite-preview", qwen: "qwen-plus" } },
    "BackgroundTask": { primary: "Gemini", secondary: "OpenAI", emergency: "Qwen", models: { openai: "gpt-4o", gemini: "gemini-3-flash-preview", qwen: "qwen-max" } }
  }[taskProfile];

  const callGemini = async (modelName: string) => {
    let geminiAttempts = 0;
    while (geminiAttempts < geminiKeys.length && geminiKeys.length > 0) {
      try {
        const currentKey = geminiKeys[currentGeminiKeyIndex];
        const ai = new GoogleGenAI({ apiKey: currentKey });
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { systemInstruction }
        });
        
        if (response.text) return response.text;
      } catch (error: any) {
        console.warn(`Gemini Key ${currentGeminiKeyIndex + 1} (${modelName}) failed:`, error.message);
        currentGeminiKeyIndex = (currentGeminiKeyIndex + 1) % geminiKeys.length;
        geminiAttempts++;
      }
    }
    throw new Error("Gemini exhausted");
  };

  const callOpenAI = async (modelName: string) => {
    if (!githubToken) throw new Error("No OpenAI token");
    const payload: any = {
      model: modelName,
      // Some frontier models (like gpt-5 alias or reasoning models) strictly reject the 'system' role. 
      // We concatenate the system instruction into the user prompt to guarantee 200 OK compatibility.
      messages: [
        { role: "user", content: systemInstruction ? `${systemInstruction}\n\nTask: ${prompt}` : prompt }
      ]
    };
    
    // Azure OpenAI 400 Bad Request fix: gpt-5/o1 reject temperature parameters.
    if (!modelName.includes("gpt-5") && !modelName.includes("o1") && !modelName.includes("o3")) {
        payload.temperature = 0.7;
    }

    const gptRes = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${githubToken}` },
      body: JSON.stringify(payload)
    });
    if (gptRes.ok) {
      const data = await gptRes.json();
      if (data.choices && data.choices[0]?.message?.content) return data.choices[0].message.content;
    }
    throw new Error(`OpenAI ${modelName} request failed with status: ${gptRes.status}`);
  };

  const callQwen = async (modelName: string) => {
    if (!qwenKey) throw new Error("No Qwen token");
    const qwenRes = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${qwenKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ]
      })
    });
    if (qwenRes.ok) {
      const data = await qwenRes.json();
      if (data.choices && data.choices[0]?.message?.content) return data.choices[0].message.content;
    }
    throw new Error(`Qwen ${modelName} request failed with status: ${qwenRes.status}`);
  };

  const runExecutor = async (provider: string) => {
    try {
      if (provider === "OpenAI") return await callOpenAI(profileConfig.models.openai);
      if (provider === "Gemini") return await callGemini(profileConfig.models.gemini);
      if (provider === "Qwen") return await callQwen(profileConfig.models.qwen);
    } catch (e: any) {
       console.warn(`[Router] ${provider} Failed: ${e.message}`);
       return null;
    }
    return null;
  }

  // Execute Intelligent Cascade Logic
  console.log(`\n======================================================`);
  console.log(`🤖 [AI ROUTER] Initializing Task Profile: [${taskProfile}]`);
  console.log(`======================================================\n`);
  
  console.log(`[AI ROUTER] 🔥 Attempting PRIMARY Engine: ${profileConfig.primary} (${profileConfig.models[profileConfig.primary.toLowerCase() as keyof typeof profileConfig.models]})`);
  let res = await runExecutor(profileConfig.primary);
  if (res) {
    console.log(`[AI ROUTER] ✅ SUCCESS! Output generated by ${profileConfig.models[profileConfig.primary.toLowerCase() as keyof typeof profileConfig.models]}\n`);
    return res;
  }

  console.log(`[AI ROUTER] ⚠️ Primary Failed. Falling back to SECONDARY: ${profileConfig.secondary} (${profileConfig.models[profileConfig.secondary.toLowerCase() as keyof typeof profileConfig.models]})`);
  res = await runExecutor(profileConfig.secondary);
  if (res) {
    console.log(`[AI ROUTER] ✅ SUCCESS! Output generated by ${profileConfig.models[profileConfig.secondary.toLowerCase() as keyof typeof profileConfig.models]}\n`);
    return res;
  }

  console.log(`[AI ROUTER] 🚨 Secondary Failed. Failing over to EMERGENCY: ${profileConfig.emergency} (${profileConfig.models[profileConfig.emergency.toLowerCase() as keyof typeof profileConfig.models]})`);
  res = await runExecutor(profileConfig.emergency);
  if (res) {
     console.log(`[AI ROUTER] ✅ SUCCESS! Output generated by ${profileConfig.models[profileConfig.emergency.toLowerCase() as keyof typeof profileConfig.models]}\n`);
     return res;
  }

  throw new Error("Intelligent AI Router exhausted all AI Providers (Gemini, GPT, Qwen) for task.");
}
