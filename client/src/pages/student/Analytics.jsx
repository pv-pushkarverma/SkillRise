/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import ActivityTab from '../../components/analytics/ActivityTab'
import CoursesTab from '../../components/analytics/CoursesTab'
import QuizzesTab from '../../components/analytics/QuizzesTab'

const Analytics = () => {
  const {
    backendUrl,
    getToken,
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    calculateNoOfLectures,
  } = useContext(AppContext)
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const { search } = useLocation()

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(search)
    return params.get('tab') === 'courses' ? 'courses' : 'activity'
  })

  const [analytics, setAnalytics] = useState(null)
  const [activityLoading, setActivityLoading] = useState(true)
  const [activityError, setActivityError] = useState(null)

  const [progressArray, setProgressArray] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(false)

  const [quizHistory, setQuizHistory] = useState([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizFetched, setQuizFetched] = useState(false)

  useEffect(() => {
    if (!user) {
      setActivityLoading(false)
      return
    }
    const load = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(`${backendUrl}/api/user/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) setAnalytics(data.analytics)
        else setActivityError(data.message)
      } catch (e) {
        setActivityError(e.message)
      } finally {
        setActivityLoading(false)
      }
    }
    load()
  }, [user])

  useEffect(() => {
    if (userData) fetchUserEnrolledCourses()
  }, [userData])

  useEffect(() => {
    if (activeTab !== 'quizzes' || !user || quizFetched) return
    const fetchQuizHistory = async () => {
      setQuizLoading(true)
      try {
        const token = await getToken()
        const { data } = await axios.get(`${backendUrl}/api/quiz/my-results`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) setQuizHistory(data.results)
      } catch {
        // silently fail — empty state will show
      } finally {
        setQuizLoading(false)
        setQuizFetched(true)
      }
    }
    fetchQuizHistory()
  }, [activeTab, user])

  useEffect(() => {
    if (!Array.isArray(enrolledCourses) || enrolledCourses.length === 0) return
    const fetchProgress = async () => {
      setCoursesLoading(true)
      try {
        const token = await getToken()
        const result = await Promise.all(
          enrolledCourses.map(async (course) => {
            const { data } = await axios.post(
              `${backendUrl}/api/user/get-course-progress`,
              { courseId: course._id },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            const totalLectures = calculateNoOfLectures(course)
            const lectureCompleted = data.progressData
              ? data.progressData.lectureCompleted.length
              : 0
            return { totalLectures, lectureCompleted }
          })
        )
        setProgressArray(result)
      } catch {
        // progress bars just won't render
      } finally {
        setCoursesLoading(false)
      }
    }
    fetchProgress()
  }, [backendUrl, calculateNoOfLectures, enrolledCourses, getToken])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">📊</div>
        <h2 className="text-2xl font-semibold text-gray-800">Sign in to view your dashboard</h2>
        <p className="text-gray-500 max-w-sm">
          Track time spent, monitor course progress, and see your learning stats.
        </p>
        <button
          onClick={() => openSignIn()}
          className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
        >
          Sign in
        </button>
      </div>
    )
  }

  const completedCount = progressArray.filter(
    (p) => p.totalLectures > 0 && p.lectureCompleted === p.totalLectures
  ).length
  const inProgressCount = progressArray.filter(
    (p) => p.lectureCompleted > 0 && p.lectureCompleted < p.totalLectures
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Track your learning progress and time spent on SkillRise
          </p>
        </div>

        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'activity'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'courses'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Courses
            {enrolledCourses.length > 0 && (
              <span className="text-xs bg-teal-100 text-teal-700 rounded-full px-1.5 py-0.5 font-semibold leading-none">
                {enrolledCourses.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'quizzes'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Quizzes
            {quizHistory.length > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-1.5 py-0.5 font-semibold leading-none">
                {quizHistory.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'activity' && (
          <ActivityTab
            analytics={analytics}
            activityLoading={activityLoading}
            activityError={activityError}
            navigate={navigate}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesTab
            enrolledCourses={enrolledCourses}
            progressArray={progressArray}
            coursesLoading={coursesLoading}
            inProgressCount={inProgressCount}
            completedCount={completedCount}
            calculateCourseDuration={calculateCourseDuration}
            navigate={navigate}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizzesTab quizHistory={quizHistory} quizLoading={quizLoading} navigate={navigate} />
        )}
      </div>
    </div>
  )
}

export default Analytics
