import Course from '../models/Course.js'
import Quiz from '../models/Quiz.js'
import QuizResult from '../models/QuizResult.js'
import { generateAIResponse } from '../services/aiChatbotService.js'
import { z } from 'zod'

// helpers
const getGroup = (pct) => {
  if (pct <= 40) return 'needs_review'
  if (pct <= 75) return 'on_track'
  return 'mastered'
}

const GROUP_LABEL = {
  needs_review: 'Needs Review',
  on_track: 'On Track',
  mastered: 'Mastered',
}

// Zod schemas — AI response
const QuizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().optional(),
})

const QuizResponseSchema = z.object({
  questions: z.array(QuizQuestionSchema).min(1).max(20),
})

// Zod schemas — request bodies
const GenerateQuizBodySchema = z.object({
  courseId: z.string().min(1),
  chapterId: z.string().min(1),
})

const SubmitQuizBodySchema = z.object({
  courseId: z.string().min(1),
  chapterId: z.string().min(1),
  answers: z.array(z.number().int().min(0).max(3)).min(1),
})

/* Build & persist a quiz for a given course + chapter */
const buildQuiz = async (course, chapter) => {
  const lectureList = chapter.chapterContent.map((lecture) => lecture.lectureTitle).join(', ')

  const prompt = `You are an educational quiz generator. Generate a quiz for a chapter titled "${chapter.chapterTitle}" from a course titled "${course.courseTitle}".
The chapter covers these lectures: ${lectureList}.

Generate exactly 10 multiple-choice questions that test conceptual understanding of the chapter topics.
Return ONLY valid JSON (no markdown, no extra text) in this exact structure:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation why this answer is correct."
    }
  ]
}`

  const raw = await generateAIResponse([{ role: 'user', content: prompt }])

  let rawParsed
  try {
    const jsonStr = raw.replace(/```json|```/g, '').trim()
    rawParsed = JSON.parse(jsonStr)
  } catch {
    throw new Error('AI returned invalid JSON for quiz generation')
  }

  const quizValidation = QuizResponseSchema.safeParse(rawParsed)
  if (!quizValidation.success) {
    throw new Error('AI returned invalid quiz structure')
  }

  const quiz = await Quiz.findOneAndUpdate(
    { courseId: course._id.toString(), chapterId: chapter.chapterId },
    {
      courseId: course._id.toString(),
      chapterId: chapter.chapterId,
      chapterTitle: chapter.chapterTitle,
      courseTitle: course.courseTitle,
      questions: quizValidation.data.questions,
    },
    { upsert: true, new: true }
  )

  return quiz
}

// GET /api/quiz/:courseId/:chapterId
// Student: fetch (or auto-generate) quiz
export const getQuiz = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params

    let quiz = await Quiz.findOne({ courseId, chapterId })

    if (!quiz) {
      const course = await Course.findById(courseId)
      if (!course) return res.json({ success: false, message: 'Course not found' })

      const chapter = course.courseContent.find((c) => c.chapterId === chapterId)
      if (!chapter) return res.json({ success: false, message: 'Chapter not found' })

      quiz = await buildQuiz(course, chapter)
    }

    const safeQuiz = {
      ...quiz.toObject(),
      questions: quiz.questions.map(({ question, options }) => ({ question, options })),
    }
    res.json({ success: true, quiz: safeQuiz })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// POST /api/quiz/generate   (educator)
// Body: { courseId, chapterId }
export const generateQuiz = async (req, res) => {
  try {
    const bodyResult = GenerateQuizBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { courseId, chapterId } = bodyResult.data

    const course = await Course.findById(courseId)
    if (!course) return res.json({ success: false, message: 'Course not found' })

    const chapter = course.courseContent.find((c) => c.chapterId === chapterId)
    if (!chapter) return res.json({ success: false, message: 'Chapter not found' })

    const quiz = await buildQuiz(course, chapter)
    res.json({ success: true, quiz })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// POST /api/quiz/submit
export const submitQuiz = async (req, res) => {
  try {
    const userId = req.auth.userId

    const bodyResult = SubmitQuizBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { courseId, chapterId, answers } = bodyResult.data

    const quiz = await Quiz.findOne({ courseId, chapterId })
    if (!quiz) return res.json({ success: false, message: 'Quiz not found' })

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ success: false, message: 'Answer count does not match question count' })
    }

    // Score
    let score = 0
    const wrongQuestions = []
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) {
        score++
      } else {
        wrongQuestions.push(q.question)
      }
    })

    const total = quiz.questions.length
    const percentage = Math.round((score / total) * 100)
    const group = getGroup(percentage)

    // AI recommendations
    const wrongList = wrongQuestions.length
      ? wrongQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')
      : 'None — all questions answered correctly!'

    const recPrompt = `A student scored ${score}/${total} (${percentage}%) on a quiz about "${quiz.chapterTitle}" from "${quiz.courseTitle}".
They are in the "${GROUP_LABEL[group]}" group.

Questions they answered incorrectly:
${wrongList}

Provide 4-5 concise, actionable bullet points to help them improve. Focus on:
- Concepts to revisit
- Short exercises or practice ideas
- Motivational tips suited to their performance level

Return only the bullet points (start each with •). No intro, no conclusion.`

    const recommendations = await generateAIResponse([{ role: 'user', content: recPrompt }])

    // Persist result
    const result = await QuizResult.create({
      userId,
      courseId,
      chapterId,
      score,
      total,
      percentage,
      group,
      recommendations,
      answers,
    })

    res.json({
      success: true,
      result: {
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        group: result.group,
        recommendations: result.recommendations,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// GET /api/quiz/results/:courseId/:chapterId
// Get past quiz results
export const getQuizResults = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { courseId, chapterId } = req.params

    const results = await QuizResult.find({ userId, courseId, chapterId }).sort({ createdAt: -1 })
    res.json({ success: true, results })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// GET /api/quiz/course-results/:courseId
// Student gets all their attempts for every chapter in one course
export const getCourseQuizResults = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { courseId } = req.params

    const results = await QuizResult.find({ userId, courseId }).sort({ createdAt: -1 })

    const quizzes = await Quiz.find({ courseId }).select('chapterId chapterTitle')
    const titleMap = Object.fromEntries(quizzes.map((q) => [q.chapterId, q.chapterTitle]))

    const enriched = results.map((r) => ({
      chapterId: r.chapterId,
      chapterTitle: titleMap[r.chapterId] || 'Unknown Chapter',
      percentage: r.percentage,
      group: r.group,
    }))

    res.json({ success: true, results: enriched })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// GET /api/quiz/my-results
// Student: all their attempts across every course
export const getAllMyQuizResults = async (req, res) => {
  try {
    const userId = req.auth.userId

    const results = await QuizResult.find({ userId }).sort({ createdAt: -1 })

    const courseIds = [...new Set(results.map((r) => r.courseId))]
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } }).select(
      'courseId chapterId chapterTitle courseTitle'
    )

    const titleMap = Object.fromEntries(
      quizzes.map((q) => [
        `${q.courseId}__${q.chapterId}`,
        { chapterTitle: q.chapterTitle, courseTitle: q.courseTitle },
      ])
    )

    const enriched = results.map((r) => {
      const titles = titleMap[`${r.courseId}__${r.chapterId}`] || {}
      return {
        chapterTitle: titles.chapterTitle || 'Unknown Chapter',
        courseTitle: titles.courseTitle || 'Unknown Course',
        percentage: r.percentage,
        group: r.group,
        createdAt: r.createdAt,
      }
    })

    res.json({ success: true, results: enriched })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// GET /api/quiz/educator-insights   (educator)
// Returns per-chapter quiz stats for educator's courses
export const getEducatorQuizInsights = async (req, res) => {
  try {
    const educatorId = req.auth.userId

    const courses = await Course.find({ educatorId })
    const courseIds = courses.map((c) => c._id.toString())

    const allResults = await QuizResult.find({ courseId: { $in: courseIds } })

    // Group by courseId + chapterId
    const statsMap = {}
    allResults.forEach((r) => {
      const key = `${r.courseId}__${r.chapterId}`
      if (!statsMap[key]) {
        statsMap[key] = {
          courseId: r.courseId,
          chapterId: r.chapterId,
          attempts: 0,
          totalPct: 0,
          needs_review: 0,
          on_track: 0,
          mastered: 0,
        }
      }
      statsMap[key].attempts++
      statsMap[key].totalPct += r.percentage
      statsMap[key][r.group]++
    })

    // Attach chapter + course titles
    const insights = Object.values(statsMap).map((entry) => {
      const course = courses.find((c) => c._id.toString() === entry.courseId)
      const chapter = course?.courseContent.find((ch) => ch.chapterId === entry.chapterId)
      return {
        ...entry,
        courseTitle: course?.courseTitle || 'Unknown',
        chapterTitle: chapter?.chapterTitle || 'Unknown',
        avgPct: Math.round(entry.totalPct / entry.attempts),
      }
    })

    // Sort by most attempts desc
    insights.sort((a, b) => b.attempts - a.attempts)

    res.json({ success: true, insights })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}
