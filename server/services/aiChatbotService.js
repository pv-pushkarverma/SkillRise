import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_CHATBOT_API_KEY });

export const generateAIResponse = async (messages) => {

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages,
    temperature: 0.7,
    max_tokens: 700,
    top_p: 1,
    stream: false,
  });

  return completion.choices?.[0]?.message?.content?.trim() || "No response generated.";
};
