import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY });

export default async function responseGenerator(code: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${code}\n\nAnalyze the time complexity of the above code and provide an explanation in two to three sentences.`,
  });
  return response.text;
}
