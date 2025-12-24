import { GoogleGenAI } from "@google/genai";

// Initialize the client lazily to avoid top-level errors
let ai: GoogleGenAI | null = null;
const apiKey = typeof process !== 'undefined' && process.env?.API_KEY ? process.env.API_KEY : '';

function getAI(): GoogleGenAI | null {
  if (ai) return ai;
  if (!apiKey) return null;
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (e) {
    console.error('Failed to initialize GoogleGenAI:', e);
    return null;
  }
}

export const askTunnelTutor = async (
  question: string,
  context: string
): Promise<string> => {
  // Get AI client lazily
  const client = getAI();
  
  // Check if AI is configured
  if (!client) {
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

    const response = await client.models.generateContent({
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
