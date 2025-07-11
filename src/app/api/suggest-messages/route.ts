import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience of developers, especially curious junior developers. Avoid overly technical jargon or personal/sensitive topics. Focus on universal developer experiences such as learning, challenges, tools, and growth. For example, your output should be structured like this: 'What’s one piece of advice you wish you knew as a junior dev?||How do you choose what to build when learning something new?||What tech stack helped you land your first job?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment for developers."


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return Response.json({ text: response.text });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
