import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export async function POST(request: Request) {
  try {
    const { message, mode } = await request.json();

    if (!message || !mode) {
      return NextResponse.json({ error: 'Message and mode are required.' }, { status: 400 });
    }

    let systemInstruction = '';
    if (mode === 'vent') {
      systemInstruction = `
        You are an empathetic, supportive AI assistant named 'Echo'. 
        Your only role is to listen to the user vent, validate their feelings, and offer encouragement. 
        Do NOT offer solutions or advice. Keep your responses short, calming, and reassuring.
        If the user uses a different language, do NOT stop them, try to follow accordingly if possible. If not, simply respond in English. 
        You can occasionally (once every 7-8 messages) add a reaffirming response. Do NOT be repetitive.
        Example reaffirming responses: "That sounds really tough.", "It's completely okay to feel that way.", "I'm here to listen."
      `;
    } else if (mode === 'idea') {
      systemInstruction = `
        You are a creative, energetic AI assistant named 'Spark'. 
        Your role is to brainstorm exciting and innovative ideas for social media content (e.g. Book content on Instagram). 
        Be enthusiastic and provide actionable suggestions. Format your ideas with bullet points for clarity.
      `;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction, safetySettings });
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json({ error: 'Failed to get a response from the AI.' }, { status: 500 });
  }
}