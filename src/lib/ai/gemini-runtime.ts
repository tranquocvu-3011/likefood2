/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemSettingTrimmed } from "@/lib/system-settings";

export async function getGeminiApiKey(): Promise<string> {
  const fromDb = await getSystemSettingTrimmed("gemini_api_key");
  const fromEnv = (process.env.GEMINI_API_KEY ?? "").trim();
  return fromDb || fromEnv;
}

export async function getGeminiModel(params?: {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  useSearch?: boolean;
}) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: params?.model ?? "gemini-2.0-flash",
    ...(params?.useSearch ? { tools: [{ googleSearchRetrieval: {} }] } : {}),
    generationConfig: {
      temperature: params?.temperature ?? 0.6,
      maxOutputTokens: params?.maxOutputTokens ?? 800,
      topP: params?.topP ?? 0.9,
      topK: params?.topK ?? 32,
    },
  });
}

