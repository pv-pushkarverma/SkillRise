import User from '../models/User.js'
import CourseProgress from '../models/CourseProgress.js'
import { generateAIResponse } from '../services/aiChatbotService.js'

// JSON extractor to handles raw JSON, markdown code blocks, etc.
const parseJSON = (raw) => {
  const strategies = [
    () => JSON.parse(raw.trim()),
    () => {
      const m = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      return m ? JSON.parse(m[1]) : null
    },
    () => {
      const m = raw.match(/\{[\s\S]*\}/)
      return m ? JSON.parse(m[0]) : null
    },
  ]
  for (const strategy of strategies) {
    try {
      const result = strategy()
      if (result) return result
    } catch {}
  }
  return null
}

// Personal Roadmap
export const generatePersonalRoadmap = async (req, res) => {
  try {
    const userId = req.auth.userId

    const userData = await User.findById(userId).populate({
      path: 'enrolledCourses',
      select: 'courseTitle courseDescription courseContent',
    })
    if (!userData) return res.json({ success: false, message: 'User not found' })

    const courses = userData.enrolledCourses || []
    if (courses.length === 0) {
      return res.json({
        success: false,
        message: 'No enrolled courses found. Enroll in some courses first.',
      })
    }

    // Calculate per-course completion %
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const progress = await CourseProgress.findOne({ userId, courseId: course._id.toString() })
        const totalLectures = course.courseContent.reduce(
          (s, ch) => s + (ch.chapterContent?.length || 0),
          0
        )
        const doneLectures = progress?.lectureCompleted?.length || 0
        const pct = totalLectures > 0 ? Math.round((doneLectures / totalLectures) * 100) : 0
        // Strip HTML from description
        const desc = course.courseDescription
          ? course.courseDescription
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 250)
          : ''
        return {
          title: course.courseTitle,
          description: desc,
          completionPercent: pct,
          totalLectures,
          doneLectures,
        }
      })
    )

    const courseList = courseStats
      .map(
        (stat) =>
          `- "${stat.title}" — ${stat.completionPercent}% complete (${stat.doneLectures}/${stat.totalLectures} lectures)` +
          (stat.description ? `\n  Summary: ${stat.description}` : '')
      )
      .join('\n\n')

    const prompt = `You are a professional learning path advisor. Analyze this learner's enrolled courses and progress, then output a personalized roadmap as strict JSON only (no markdown, no prose outside JSON).

LEARNER'S COURSES:
${courseList}

Return ONLY this exact JSON shape:
{
  "title": "Your Personalized Learning Roadmap",
  "summary": "2–3 sentence motivating overview of their learning journey and potential",
  "stages": [
    {
      "id": "mastered",
      "label": "What You've Mastered",
      "status": "completed",
      "icon": "🏆",
      "skills": ["concrete skill 1", "concrete skill 2", "skill 3", "skill 4"],
      "highlights": ["key achievement 1", "key achievement 2", "key achievement 3"],
      "description": "1–2 sentences about their accomplishments"
    },
    {
      "id": "in_progress",
      "label": "Currently Building",
      "status": "current",
      "icon": "⚡",
      "skills": ["active skill 1", "active skill 2", "active skill 3"],
      "courses": [{"title": "Exact Course Title", "completion": 45}],
      "description": "1–2 sentences about what they are actively learning"
    },
    {
      "id": "next_steps",
      "label": "Recommended Next Steps",
      "status": "upcoming",
      "icon": "🎯",
      "recommendations": [
        {"title": "Specific Topic", "priority": "high", "reason": "concrete reason"},
        {"title": "Specific Topic", "priority": "high", "reason": "concrete reason"},
        {"title": "Specific Topic", "priority": "medium", "reason": "concrete reason"},
        {"title": "Specific Topic", "priority": "medium", "reason": "concrete reason"}
      ],
      "description": "1–2 sentences about the logical next steps"
    },
    {
      "id": "career_paths",
      "label": "Career Destinations",
      "status": "future",
      "icon": "🚀",
      "paths": [
        {"title": "Specific Job Role", "readiness": 70, "gap": ["missing skill 1", "missing skill 2"]},
        {"title": "Specific Job Role", "readiness": 55, "gap": ["missing skill 1", "missing skill 2"]},
        {"title": "Specific Job Role", "readiness": 40, "gap": ["missing skill 1"]}
      ],
      "description": "1–2 sentences about career opportunities aligned with their progress"
    }
  ]
}`

    const raw = await generateAIResponse([
      {
        role: 'system',
        content:
          'You are a JSON generator. Output only valid JSON with no markdown fences, no prose, no comments.',
      },
      { role: 'user', content: prompt },
    ])

    const roadmap = parseJSON(raw)
    if (!roadmap)
      return res.json({ success: false, message: 'Failed to parse AI response. Please try again.' })

    res.json({ success: true, roadmap, courseStats })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Custom Roadmap
export const generateCustomRoadmap = async (req, res) => {
  try {
    const { topic } = req.body
    if (!topic?.trim() || topic.trim().length < 2) {
      return res.json({
        success: false,
        message: 'Please provide a valid topic (at least 2 characters).',
      })
    }

    const safeTopic = topic.trim().slice(0, 120)

    const prompt = `You are a professional learning path advisor. Generate a comprehensive, actionable learning roadmap for: "${safeTopic}"

Return ONLY this exact JSON shape (no markdown, no prose outside JSON):
{
  "title": "${safeTopic} — Learning Roadmap",
  "summary": "2–3 sentence overview of this learning path and what the learner will achieve",
  "stages": [
    {
      "id": "foundations",
      "label": "Prerequisites & Foundations",
      "status": "upcoming",
      "icon": "📚",
      "skills": ["prerequisite 1", "prerequisite 2", "prerequisite 3", "prerequisite 4"],
      "timeEstimate": "3–4 weeks",
      "resources": ["type of resource 1", "type of resource 2", "type of resource 3"],
      "description": "1–2 sentences about foundational knowledge needed before starting"
    },
    {
      "id": "core_skills",
      "label": "Core Skills",
      "status": "upcoming",
      "icon": "⚡",
      "skills": ["core skill 1", "core skill 2", "core skill 3", "core skill 4", "core skill 5"],
      "timeEstimate": "6–10 weeks",
      "projects": ["beginner project 1", "beginner project 2", "beginner project 3"],
      "description": "1–2 sentences about the essential skills that form the backbone"
    },
    {
      "id": "advanced",
      "label": "Advanced Topics",
      "status": "upcoming",
      "icon": "🔬",
      "skills": ["advanced skill 1", "advanced skill 2", "advanced skill 3", "advanced skill 4"],
      "timeEstimate": "8–12 weeks",
      "projects": ["intermediate project 1", "intermediate project 2"],
      "description": "1–2 sentences about advanced concepts and patterns to master"
    },
    {
      "id": "mastery",
      "label": "Mastery & Career Paths",
      "status": "future",
      "icon": "🚀",
      "paths": [
        {"title": "Career/Specialization Path 1", "readiness": 0, "gap": []},
        {"title": "Career/Specialization Path 2", "readiness": 0, "gap": []},
        {"title": "Career/Specialization Path 3", "readiness": 0, "gap": []}
      ],
      "certifications": ["relevant certification 1", "relevant certification 2"],
      "description": "1–2 sentences about mastery and where this skill set leads professionally"
    }
  ]
}`

    const raw = await generateAIResponse([
      {
        role: 'system',
        content:
          'You are a JSON generator. Output only valid JSON with no markdown fences, no prose, no comments.',
      },
      { role: 'user', content: prompt },
    ])

    const roadmap = parseJSON(raw)
    if (!roadmap)
      return res.json({ success: false, message: 'Failed to parse AI response. Please try again.' })

    res.json({ success: true, roadmap })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
