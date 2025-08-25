import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { subjects } = await request.json();

    if (!subjects) {
      return NextResponse.json(
        { error: 'Subjects input is required.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Get current date and time
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTimeString = currentDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format

    const prompt = `
      Today's date is ${currentDateString} and the current time is ${currentTimeString}.
      
      Create a structured study schedule based on the following user input: ${subjects}

      Extract the deadline, subjects, time requirements, and any constraints from the user's text.
      Generate a list of tasks based on what the user specified.
      
      Each task must be a JSON object with the following keys: "id", "title", "description", "dueDate", "dueTime", "priority", "completedHours".
      The "id" is the task id, not particularly important here.
      The "title" should be the name of the course/subject (e.g. if the user says they need to study CSE471 the title would be "CSE471").
      The "description" should be concise and clear, there should not be any extra words. (e.g. if the user says they have to study CSE340 the description would simply be "Study CSE340", nothing more).
      The "dueDate" should be in 'YYYY-MM-DD' format and should be between today (${currentDateString}) and the deadline mentioned by the user.
      The "dueTime" should be in 'HH:MM' format.
      The "priority" should be High, Medium, or Low based on difficulty or importance mentioned by the user.
      The "completedHours" should be all initially 0.
      Return ONLY a valid JSON object in the following format: { "tasks": [...] }.
      Do not include any other extra text, explanations, or markdown formatting.
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