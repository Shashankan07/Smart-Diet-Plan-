import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const nutritionModel = "gemini-3-flash-preview";

export async function analyzeMealImage(base64Image: string) {
  const prompt = `Analyze this food image. Provide:
  1. Food name (English & Local if possible)
  2. Estimated portion size (g or ml)
  3. Estimated calories
  4. Detailed nutritional breakdown:
     - Macros: protein (g), carbs (g), fat (g)
     - Fiber (g), sugar (g)
     - Micros (Crucial): sodium (mg), calcium (mg), iron (mg), potassium (mg)
  5. Healthiness score (1-10)
  6. Key benefits or warnings (e.g., high sodium, good protein source)
  Return as a valid JSON object with snake_case keys (food_name, estimated_calories, macro_breakdown, micronutrients, etc).`;

  const response = await getAI().models.generateContent({
    model: nutritionModel,
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ]
    }],
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || "{}");
}

export async function getFoodNutritionFromAI(foodName: string) {
  const prompt = `Analyze this food item: "${foodName}". 
  Provide accurate nutritional information including micronutrients.
  Return as a valid JSON object with these keys:
  {
    "name": string,
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number,
    "calcium": number (mg),
    "iron": number (mg),
    "potassium": number (mg),
    "serving_size": string,
    "gi": "Low" | "Medium" | "High",
    "local_name": string
  }`;

  const response = await getAI().models.generateContent({
    model: nutritionModel,
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || "{}");
}

export async function getDietCoachResponse(message: string, userHealthProfile: Record<string, unknown>, chatHistory: { role: string; text: string }[]) {
  const systemInstruction = `You are NutriSense AI, a helpful diet and nutrition coach. 
  User Health Stats: ${JSON.stringify(userHealthProfile)}.
  Be professional, encouraging, and science-based.`;

  const chat = getAI().chats.create({
    model: nutritionModel,
    config: { systemInstruction },
    history: chatHistory.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }))
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
