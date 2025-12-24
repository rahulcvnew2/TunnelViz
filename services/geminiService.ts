import { GoogleGenAI } from "@google/genai";

// Initialize the client only if API key is available
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const askTunnelTutor = async (
  question: string, 
  context: string
): Promise<string> => {
  // Check if AI is configured
  if (!ai || !apiKey) {
    return "**AI Tutor is not configured.** To enable this feature, set the `API_KEY` environment variable with your Google Gemini API key in your Vercel project settings.";
  }

  try {
    const model = 'gemini-2.0-flash';
    const systemInstruction = `You are Professor TunnelViz, a world-class expert in civil engineering and tunneling. 
    Your goal is to explain complex concepts simply to undergraduate students. 
    Keep answers concise (under 150 words) unless asked for detail. 
    Use analogies. 
    Format your response using Markdown (bolding, lists) for better readability.
    Context provided by user: ${context}`;

    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while contacting the AI Tutor. Please check your API key configuration.";
  }
};
