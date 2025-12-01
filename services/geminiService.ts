import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRouteAIAnalysis = async (title: string, start: string, end: string, distance: number): Promise<string> => {
  try {
    const prompt = `
      I am a road captain for a motorcycle club. We are planning a trip called "${title}" from "${start}" to "${end}" which is roughly ${distance}km.
      
      Give me a short, hype-filled paragraph describing why this is a great ride for motorcyclists. 
      Mention potential road conditions (twisties, scenic views, highway) based on general geography of these types of locations. 
      Keep it under 100 words. Use biker terminology but keep it friendly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Ride details unavailable right now, but keep the rubber side down!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not load AI analysis. Just ride safe!";
  }
};

export const getChatAssistantReply = async (messages: string[]): Promise<string> => {
  try {
    const context = messages.slice(-5).join("\n");
    const prompt = `
      You are a helpful AI assistant for a motorcycle club group chat. 
      Here is the recent conversation context:
      ${context}

      A user just asked for advice or info. Provide a very short (1-2 sentences) helpful response regarding motorcycle safety, maintenance, or route planning relevant to the chat.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Ride safe out there!";
  } catch (error) {
    return "Radio silence from the AI tower.";
  }
}
