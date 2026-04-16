import { generateAIFallback } from "@/lib/ai-fallback";

/**
 * Main AI Gateway
 * Uses the Intelligent AI Router to dynamically assign models scaling from GPT-5 to Gemini Lite
 */

export async function executeHeavyTask(
  prompt: string, 
  systemInstruction?: string, 
  isJson?: boolean
) {
  // Heavy tasks map to DeepReasoning profile for highest accuracy
  const res = await generateAIFallback(systemInstruction || "", prompt, "DeepReasoning");
  if (!isJson) return res;
  
  // Clean JSON just in case the model returns markdown code blocks
  return res.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function executeLightweightTask(
  prompt: string, 
  systemInstruction?: string, 
  isJson?: boolean
) {
  // Lightweight tasks map to FastInteractive profile for lowest latency
  const res = await generateAIFallback(systemInstruction || "", prompt, "FastInteractive");
  if (!isJson) return res;
  
  // Clean JSON just in case the model returns markdown code blocks
  return res.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function executeBackgroundTask(
  prompt: string, 
  systemInstruction?: string, 
  isJson?: boolean
) {
  // Background tasks map to BackgroundTask profile for fast structured data generation
  const res = await generateAIFallback(systemInstruction || "", prompt, "BackgroundTask");
  if (!isJson) return res;
  
  return res.replace(/```json/g, "").replace(/```/g, "").trim();
}
