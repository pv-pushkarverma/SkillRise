import ChatSession from "../models/AiChat.js";
import { generateAIResponse } from "../services/aiChatbotService.js";
import { v4 as uuidv4 } from "uuid";

function formatMessages(messages) {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}


export const aiChatbot = async (req, res) => {
  try {
    const userId = req.auth.userId
    const {content, sessionId } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Missing message" });
    }

    // Find existing chat session or create new one
    let chat = await ChatSession.findOne({ sessionId });
    let history = "";

    if (!chat) {
      chat = await ChatSession.create({
        userId: userId,
        sessionId: uuidv4(),
        messages: [
          {
            role: "system",
            content: `You are SkillRise AI Assistant, a helpful learning companion for the SkillRise e-learning platform.
                    - Help students with courses and tech-learning questions.
                    - Be concise, encouraging, and focused on educational queries.`,
          },
        ],
      });
      history = "";
    }

    history = chat.messages.slice(-20);
    const activeSessionId = chat.sessionId;

    // Add user's message
    chat.messages.push({ role: "user", content });

    const messages = [
        ...formatMessages(history),
        { role: "user", content: content.trim() }
    ]
    // Send to AI
    const aiReply = await generateAIResponse(messages);

    // Save AI response
    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    return res.json({
      success: true,
      activeSessionId,
      response: aiReply,
      conversationHistory: chat.messages,
    });
  } catch (err) {
    console.error("Chatbot Error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate AI response." });
  }
};

export const recentAIChats = async (req, res) => {
  try {
    const { userId } = req.auth;

    const allSessionChats = await ChatSession.find({ userId }).select('sessionId messages')
    const chats = allSessionChats.map(session => {
      return {
        _id: session._id,
        sessionId: session.sessionId,
        messages: session.messages[1]?.content
      }
    }).reverse()

    res.json({ chats })
  } catch (error) {
    res.json({ message: 'Error while fetching conversations'})
  }
}

export const getChatSession = async (req, res) => {
  try {
    // const { userId } = req.auth;
    const { sessionId } = req.params;

    const Chats = await ChatSession.findOne({ sessionId });
    return res.json({ Chats })

  } catch (error) {
    res.json({ message: 'Error while fetching conversation'})
  }
}