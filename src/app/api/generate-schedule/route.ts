import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { subjects, deadline } = await request.json();

    if (!subjects || !deadline) {
      return NextResponse.json(
        { error: 'Subjects and deadline are required.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Create a structured study schedule based on the following topics and deadline.
      The user needs to cover these subjects: ${subjects}.
      The deadline is ${deadline}.

      Generate a list of tasks specified by the user.
      If user says something like - I have subject A and subject B to study, A will take be 5 hours and B will take 3 hours. deadline's this date. B is harder than A. I'm busy from this time to that time on this day.
      Now the deadline is the focal point. Then you will take all that into consideration and generate a healthy recommended schedule up to the deadline,
      Each task must be a JSON object with the following keys: "id", "title", "description", "dueDate", "priority", "completedHours".
      The "dueDate" should be in 'YYYY-MM-DD' format.
      The "description" should be concise and clear, don't add anything by yourself. (e.g. if the user says they have to study CSE340 the description would simply be "Study CSE340", nothing more).
      The "priority" should be High, Medium, or Low.
      The "completedHours" should be all initially 0 of course.
      Return ONLY a valid JSON object in the following format: { "tasks": [...] }.
      Do not include any other text, explanations, or markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const schedule = JSON.parse(cleanedJsonString);

    return NextResponse.json(schedule);

  } catch (error) {
    console.error('Error generating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to generate schedule.' },
      { status: 500 }
    );
  }
}