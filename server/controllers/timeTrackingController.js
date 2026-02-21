import TimeTracking from '../models/TimeTracking.js'
import Course from '../models/Course.js'

// Track Time
export const trackTime = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { page, path, duration } = req.body

    if (!page || !path || !duration || duration < 1) {
      return res.json({ success: false, message: 'Invalid tracking data' })
    }

    await TimeTracking.create({ userId, page, path, duration: Math.round(duration) })
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Pages not included in analytics display
const EXCLUDED_PAGES = new Set(['Home', 'Browse Courses', 'Course Details', 'Analytics', 'Other'])

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.auth.userId
    const records = await TimeTracking.find({ userId }).sort({ date: -1 })

    const activeRecords = records.filter((r) => !EXCLUDED_PAGES.has(r.page))

    // Per-page aggregation
    const pageMap = {}
    activeRecords.forEach((r) => {
      if (!pageMap[r.page]) {
        pageMap[r.page] = { page: r.page, path: r.path, totalDuration: 0, visits: 0 }
      }
      pageMap[r.page].totalDuration += r.duration
      pageMap[r.page].visits += 1
    })
    const pageStats = Object.values(pageMap).sort((a, b) => b.totalDuration - a.totalDuration)

    // Last 7 days daily breakdown
    const dailyMap = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dailyMap[d.toISOString().split('T')[0]] = 0
    }
    activeRecords.forEach((r) => {
      const key = new Date(r.date).toISOString().split('T')[0]
      if (key in dailyMap) dailyMap[key] += r.duration
    })
    const dailyStats = Object.entries(dailyMap).map(([date, duration]) => ({ date, duration }))

    const totalDuration = activeRecords.reduce((sum, r) => sum + r.duration, 0)
    const totalSessions = activeRecords.length

    // ── Course breakdown ──
    // Group learning time by courseId (from /player/:courseId)
    // Group quiz time by courseId + chapterId (from /quiz/:courseId/:chapterId)
    const breakdownMap = {}

    records
      .filter((r) => r.path.startsWith('/player/'))
      .forEach((r) => {
        const courseId = r.path.split('/')[2]
        if (!courseId) return
        if (!breakdownMap[courseId])
          breakdownMap[courseId] = {
            courseId,
            learningDuration: 0,
            learningSessions: 0,
            chapters: {},
          }
        breakdownMap[courseId].learningDuration += r.duration
        breakdownMap[courseId].learningSessions += 1
      })

    records
      .filter((r) => r.path.startsWith('/quiz/'))
      .forEach((r) => {
        const parts = r.path.split('/')
        const courseId = parts[2]
        const chapterId = parts[3]
        if (!courseId || !chapterId) return
        if (!breakdownMap[courseId])
          breakdownMap[courseId] = {
            courseId,
            learningDuration: 0,
            learningSessions: 0,
            chapters: {},
          }
        if (!breakdownMap[courseId].chapters[chapterId]) {
          breakdownMap[courseId].chapters[chapterId] = {
            chapterId,
            quizDuration: 0,
            quizSessions: 0,
          }
        }
        breakdownMap[courseId].chapters[chapterId].quizDuration += r.duration
        breakdownMap[courseId].chapters[chapterId].quizSessions += 1
      })

    // Fetch course titles + chapter titles in one query
    const allCourseIds = Object.keys(breakdownMap)
    const courses = await Course.find({ _id: { $in: allCourseIds } }).select(
      '_id courseTitle courseThumbnail courseContent'
    )
    const courseDataMap = {}
    courses.forEach((c) => {
      const chapterMap = {}
      c.courseContent.forEach((ch) => {
        chapterMap[ch.chapterId] = ch.chapterTitle
      })
      courseDataMap[c._id.toString()] = {
        title: c.courseTitle,
        thumbnail: c.courseThumbnail,
        chapterMap,
      }
    })

    const courseBreakdown = Object.values(breakdownMap)
      .map((entry) => {
        const info = courseDataMap[entry.courseId] || {}
        const chapters = Object.values(entry.chapters)
          .map((ch) => ({
            chapterId: ch.chapterId,
            chapterTitle: info.chapterMap?.[ch.chapterId] || 'Unknown Chapter',
            quizDuration: ch.quizDuration,
            quizSessions: ch.quizSessions,
          }))
          .sort((a, b) => b.quizDuration - a.quizDuration)

        const totalQuizDuration = chapters.reduce((s, c) => s + c.quizDuration, 0)
        return {
          courseId: entry.courseId,
          courseTitle: info.title || 'Unknown Course',
          courseThumbnail: info.thumbnail || null,
          learningDuration: entry.learningDuration,
          learningSessions: entry.learningSessions,
          totalQuizDuration,
          chapters,
        }
      })
      .sort(
        (a, b) =>
          b.learningDuration + b.totalQuizDuration - (a.learningDuration + a.totalQuizDuration)
      )

    res.json({
      success: true,
      analytics: { totalDuration, totalSessions, pageStats, dailyStats, courseBreakdown },
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
