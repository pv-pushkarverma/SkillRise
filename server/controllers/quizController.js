import Course from '../models/Course.js'
import Quiz from '../models/Quiz.js'
import QuizResult from '../models/QuizResult.js'
import { generateAIResponse } from '../services/aiChatbotService.js'

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

/* Build & persist a quiz for a given course + chapter */
const buildQuiz = async (course, chapter) => {
  const lectureList = chapter.chapterContent.map((l) => l.lectureTitle).join(', ')

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

  let parsed
  try {
    const jsonStr = raw.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(jsonStr)
  } catch {
    throw new Error('AI returned invalid JSON for quiz generation')
  }

  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('AI returned no questions')
  }

  const quiz = await Quiz.findOneAndUpdate(
    { courseId: course._id.toString(), chapterId: chapter.chapterId },
    {
      courseId: course._id.toString(),
      chapterId: chapter.chapterId,
      chapterTitle: chapter.chapterTitle,
      courseTitle: course.courseTitle,
      questions: parsed.questions,
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

    res.json({ success: true, quiz })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/quiz/generate   (educator)
// Body: { courseId, chapterId }
export const generateQuiz = async (req, res) => {
  try {
    const { courseId, chapterId } = req.body

    const course = await Course.findById(courseId)
    if (!course) return res.json({ success: false, message: 'Course not found' })

    const chapter = course.courseContent.find((c) => c.chapterId === chapterId)
    if (!chapter) return res.json({ success: false, message: 'Chapter not found' })

    const quiz = await buildQuiz(course, chapter)
    res.json({ success: true, quiz })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/quiz/submit
export const submitQuiz = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { courseId, chapterId, answers } = req.body

    const quiz = await Quiz.findOne({ courseId, chapterId })
    if (!quiz) return res.json({ success: false, message: 'Quiz not found' })

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

    res.json({ success: true, result })
  } catch (error) {
    res.json({ success: false, message: error.message })
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
    res.json({ success: false, message: error.message })
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
    const titleMap = {}
    quizzes.forEach((q) => {
      titleMap[q.chapterId] = q.chapterTitle
    })

    const enriched = results.map((r) => ({
      ...r.toObject(),
      chapterTitle: titleMap[r.chapterId] || 'Unknown Chapter',
    }))

    res.json({ success: true, results: enriched })
  } catch (error) {
    res.json({ success: false, message: error.message })
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

    const titleMap = {}
    quizzes.forEach((q) => {
      titleMap[`${q.courseId}__${q.chapterId}`] = {
        chapterTitle: q.chapterTitle,
        courseTitle: q.courseTitle,
      }
    })

    const enriched = results.map((r) => {
      const titles = titleMap[`${r.courseId}__${r.chapterId}`] || {}
      return {
        ...r.toObject(),
        chapterTitle: titles.chapterTitle || 'Unknown Chapter',
        courseTitle: titles.courseTitle || 'Unknown Course',
      }
    })

    res.json({ success: true, results: enriched })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/quiz/educator-insights   (educator)
// Returns per-chapter quiz stats for educator's courses
export const getEducatorQuizInsights = async (req, res) => {
  try {
    const educatorId = req.auth.userId

    const courses = await Course.find({ educator: educatorId })
    const courseIds = courses.map((c) => c._id.toString())

    const allResults = await QuizResult.find({ courseId: { $in: courseIds } })

    // Group by courseId + chapterId
    const map = {}
    allResults.forEach((r) => {
      const key = `${r.courseId}__${r.chapterId}`
      if (!map[key]) {
        map[key] = {
          courseId: r.courseId,
          chapterId: r.chapterId,
          attempts: 0,
          totalPct: 0,
          needs_review: 0,
          on_track: 0,
          mastered: 0,
        }
      }
      map[key].attempts++
      map[key].totalPct += r.percentage
      map[key][r.group]++
    })

    // Attach chapter + course titles
    const insights = Object.values(map).map((entry) => {
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
    res.json({ success: false, message: error.message })
  }
}
