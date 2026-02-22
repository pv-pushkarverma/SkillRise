import { useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'

const ContinueLearning = () => {
  const { user } = useUser()
  const {
    enrolledCourses,
    calculateNoOfLectures,
    calculateCourseDuration,
    backendUrl,
    getToken,
    navigate,
  } = useContext(AppContext)

  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || enrolledCourses.length === 0) return
    const fetchProgress = async () => {
      setLoading(true)
      try {
        const token = await getToken()
        const entries = await Promise.all(
          enrolledCourses.map(async (course) => {
            const { data } = await axios.post(
              `${backendUrl}/api/user/get-course-progress`,
              { courseId: course._id },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            const total = calculateNoOfLectures(course)
            const completed = data.progressData ? data.progressData.lectureCompleted.length : 0
            const updatedAt = data.progressData?.updatedAt
              ? new Date(data.progressData.updatedAt)
              : null
            return [course._id, { total, completed, updatedAt }]
          })
        )
        setProgressMap(Object.fromEntries(entries))
      } catch {
        // progress bars just won't render
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [user, enrolledCourses])

  // Only render for logged-in users with enrolled courses
  if (!user || enrolledCourses.length === 0) return null

  // Most recently accessed first; never-opened courses (no updatedAt) go last
  const display = [...enrolledCourses]
    .sort((a, b) => (progressMap[b._id]?.updatedAt ?? 0) - (progressMap[a._id]?.updatedAt ?? 0))
    .slice(0, 3)

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-14">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Pick up where you left off</p>
          </div>
          <button
            onClick={() => navigate('/analytics?tab=courses')}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition"
          >
            View all ({enrolledCourses.length})
          </button>
        </div>

        <div
          className={`grid gap-5 ${
            display.length === 1
              ? 'grid-cols-1 max-w-sm mx-auto'
              : display.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {display.map((course) => {
            const prog = progressMap[course._id]
            const total = prog?.total || 0
            const completed = prog?.completed || 0
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0
            const isDone = pct === 100

            return (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <img
                  src={course.courseThumbnail}
                  alt=""
                  className="w-full aspect-video object-cover cursor-pointer"
                  onClick={() => navigate('/player/' + course._id)}
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 mb-3 flex-1">
                    {course.courseTitle}
                  </h3>

                  {loading || !prog ? (
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 animate-pulse" />
                  ) : (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                        <span>
                          {completed} / {total} lectures
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isDone ? 'bg-teal-500' : 'bg-teal-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{calculateCourseDuration(course)}</span>
                    <button
                      onClick={() => navigate('/player/' + course._id)}
                      className="px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition font-medium"
                    >
                      {isDone ? 'Review' : pct > 0 ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ContinueLearning
