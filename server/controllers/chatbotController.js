import ChatSession from '../models/AiChat.js'
import { generateAIResponse } from '../services/aiChatbotService.js'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import { CourseProgress } from '../models/CourseProgress.js'
import QuizResult from '../models/QuizResult.js'

function formatMessages(messages) {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))
}

async function buildUserContext(userId) {
  try {
    const user = await User.findById(userId).populate(
      'enrolledCourses',
      'courseTitle courseContent'
    )

    if (!user || user.enrolledCourses.length === 0) {
      return `Student has not enrolled in any courses yet.`
    }

    const courseIds = user.enrolledCourses.map((c) => c._id.toString())

    const [progressRecords, quizResults] = await Promise.all([
      CourseProgress.find({ userId, courseId: { $in: courseIds } }),
      QuizResult.find({ userId }).sort({ createdAt: -1 }).limit(20),
    ])

    // Map courseId -> progress record
    const progressMap = {}
    progressRecords.forEach((p) => {
      progressMap[p.courseId] = p
    })

    // Build per-course context lines
    const courseLines = user.enrolledCourses
      .map((course) => {
        const courseId = course._id.toString()
        const progress = progressMap[courseId]
        const totalLectures = course.courseContent.reduce(
          (sum, ch) => sum + ch.chapterContent.length,
          0
        )
        const completedLectures = progress?.lectureCompleted?.length || 0
        const pct = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0
        const chapters = course.courseContent.map((ch) => ch.chapterTitle).join(', ')
        return `  • "${course.courseTitle}" — ${pct}% complete (${completedLectures}/${totalLectures} lectures)\n    Chapters: ${chapters}`
      })
      .join('\n')

    // Build lookup: courseId -> { title, chapters: { chapterId -> chapterTitle } }
    const courseLookup = {}
    user.enrolledCourses.forEach((course) => {
      const id = course._id.toString()
      courseLookup[id] = { title: course.courseTitle, chapters: {} }
      course.courseContent.forEach((ch) => {
        courseLookup[id].chapters[ch.chapterId] = ch.chapterTitle
      })
    })

    // Build quiz context lines
    let quizSection = 'Quiz Performance: No quizzes taken yet.'
    if (quizResults.length > 0) {
      const groupLabel = {
        needs_review: 'Needs Review',
        on_track: 'On Track',
        mastered: 'Mastered',
      }
      const quizLines = quizResults
        .map((qr) => {
          const ci = courseLookup[qr.courseId]
          const courseTitle = ci?.title || 'Unknown Course'
          const chapterTitle = ci?.chapters[qr.chapterId] || 'Unknown Chapter'
          return `  • ${courseTitle} — ${chapterTitle}: ${qr.score}/${qr.total} (${qr.percentage}%) [${groupLabel[qr.group] || qr.group}]`
        })
        .join('\n')

      const latestRec = quizResults.find((qr) => qr.recommendations)
      quizSection = `Quiz Performance (most recent first):\n${quizLines}`
      if (latestRec?.recommendations) {
        quizSection += `\n\nLatest AI Study Recommendations:\n${latestRec.recommendations}`
      }
    }

    return `Student Name: ${user.name}

Enrolled Courses & Progress:
${courseLines}

${quizSection}`
  } catch (err) {
    console.error('Failed to build user context:', err)
    return 'User context unavailable.'
  }
}

function buildSystemPrompt(userContext) {
  return `You are SkillRise AI Assistant, a personalized learning companion for the SkillRise e-learning platform.
- Help students with course content, tech-learning questions, and study guidance.
- Be concise, encouraging, and focused on educational queries.
- Use the student's learning context below to give personalized, relevant advice.
- When asked what to study next or where to focus, use their quiz performance and progress to guide them specifically.
- If a student is marked "Needs Review" on a topic, proactively suggest they revisit it.

=== STUDENT LEARNING CONTEXT ===
${userContext}
=================================`
}

export const aiChatbot = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { content, sessionId } = req.body

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Missing message' })
    }

    // Build fresh personalized system prompt on every request
    const userContext = await buildUserContext(userId)
    const systemPrompt = buildSystemPrompt(userContext)

    // Find existing session or create new one
    let chat = await ChatSession.findOne({ sessionId })

    if (!chat) {
      chat = await ChatSession.create({
        userId,
        sessionId: uuidv4(),
        messages: [{ role: 'system', content: systemPrompt }],
      })
    }

    const history = chat.messages.slice(-20)
    const activeSessionId = chat.sessionId

    chat.messages.push({ role: 'user', content })

    // Always inject fresh system prompt for the AI call (context may have changed)
    const messages = [
      { role: 'system', content: systemPrompt },
      ...formatMessages(history).filter((m) => m.role !== 'system'),
      { role: 'user', content: content.trim() },
    ]

    const aiReply = await generateAIResponse(messages)

    chat.messages.push({ role: 'assistant', content: aiReply })
    await chat.save()

    return res.json({
      success: true,
      activeSessionId,
      response: aiReply,
      conversationHistory: chat.messages,
    })
  } catch (err) {
    console.error('Chatbot Error:', err)
    return res.status(500).json({ success: false, message: 'Failed to generate AI response.' })
  }
}

export const recentAIChats = async (req, res) => {
  try {
    const { userId } = req.auth

    const allSessionChats = await ChatSession.find({ userId }).select(
      'sessionId messages updatedAt'
    )
    const chats = allSessionChats
      .map((session) => {
        return {
          _id: session._id,
          sessionId: session.sessionId,
          messages: session.messages[1]?.content,
          updatedAt: session.updatedAt.toDateString(),
        }
      })
      .reverse()

    res.json({ chats })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error while fetching conversations' })
  }
}

export const getChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId } = req.auth

    const fullChats = await ChatSession.aggregate([
      { $match: { sessionId, userId } },
      {
        $project: {
          _id: 1,
          messages: { $slice: ['$messages', 1, { $size: '$messages' }] },
        },
      },
    ])

    if (fullChats.length === 0) {
      return res.status(404).json({ success: false, message: 'Chat session not found' })
    }

    return res.json(fullChats[0])
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error while fetching conversation' })
  }
}

export const deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId } = req.auth

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Missing sessionId' })
    }

    const deleted = await ChatSession.findOneAndDelete({ sessionId, userId })

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Chat not found' })
    }

    return res.json({ success: true, message: 'Chat deleted successfully' })
  } catch (error) {
    console.error('Error deleting chat session:', error)
    return res.status(500).json({ success: false, message: 'Error while deleting conversation' })
  }
}
