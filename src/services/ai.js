import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // only for testing! 🔥
});

export async function getInterviewFeedback(answer) {
  const prompt = `
You are an expert interview coach.
Evaluate the following candidate's answer in 4 sentences.
Give friendly feedback on structure, tone, clarity, and confidence.
Answer in a conversational style.

Candidate's answer:
"${answer}"
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("AI error:", err);
    return "⚠ Sorry,You need to be online to complete this action!";
  }
}