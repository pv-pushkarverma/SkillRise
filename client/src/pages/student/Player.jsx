import humanizeDuration from 'humanize-duration'
import { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import VideoPlayer from '../../components/student/VideoPlayer'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const Player = () => {
  const { enrolledCourses, backendUrl, getToken, userData, fetchUserEnrolledCourses, navigate } =
    useContext(AppContext)

  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)
  const [quizResultsMap, setQuizResultsMap] = useState({}) // chapterId -> last result

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  // Saves the chosen lecture and persists it so the course resumes from here
  const selectLecture = (lecture, chapterIndex, lectureIndex) => {
    const data = { ...lecture, chapter: chapterIndex + 1, lecture: lectureIndex + 1, chapterIndex }
    setPlayerData(data)
    localStorage.setItem(`lastPlayed_${courseId}`, JSON.stringify(data))
  }

  const getCourseData = () => {
    if (!Array.isArray(enrolledCourses) || !userData?._id) return
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course)
        course.courseRatings.forEach((item) => {
          if (item.userId === userData._id) setInitialRating(item.rating)
        })
      }
    })
  }

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        backendUrl + '/api/user/update-course-progress',
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        getCourseProgress()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        backendUrl + '/api/user/get-course-progress',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) setProgressData(data.progressData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRating = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        backendUrl + '/api/user/add-rating',
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (Array.isArray(enrolledCourses) && enrolledCourses.length > 0) getCourseData()
  }, [enrolledCourses]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getCourseProgress()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch all quiz results for this course once on mount
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(`${backendUrl}/api/quiz/course-results/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) {
          // Keep only the most recent attempt per chapter
          const map = {}
          data.results.forEach((r) => {
            if (!map[r.chapterId]) map[r.chapterId] = r
          })
          setQuizResultsMap(map)
        }
      } catch {
        /* badge just won't show */
      }
    }
    fetchQuizResults()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hasAutoSelectedRef = useRef(false)

  // 1. Restore from localStorage as soon as courseData is ready
  useEffect(() => {
    if (!courseData || hasAutoSelectedRef.current) return
    try {
      const saved = localStorage.getItem(`lastPlayed_${courseId}`)
      if (saved) {
        const data = JSON.parse(saved)
        setPlayerData(data)
        if (data.chapterIndex !== undefined) setOpenSections({ [data.chapterIndex]: true })
        hasAutoSelectedRef.current = true
      }
    } catch {
      /* corrupted — ignore */
    }
  }, [courseData, courseId])

  // 2. If no localStorage, pick the first incomplete lecture once progressData arrives
  useEffect(() => {
    if (!courseData || !progressData || hasAutoSelectedRef.current) return
    if (localStorage.getItem(`lastPlayed_${courseId}`)) return

    let found = null
    outer: for (let ci = 0; ci < courseData.courseContent.length; ci++) {
      for (let li = 0; li < courseData.courseContent[ci].chapterContent.length; li++) {
        const lec = courseData.courseContent[ci].chapterContent[li]
        if (!progressData.lectureCompleted?.includes(lec.lectureId)) {
          found = { ...lec, chapter: ci + 1, lecture: li + 1, chapterIndex: ci }
          break outer
        }
      }
    }

    // All complete — fall back to first lecture
    if (!found) {
      const ch = courseData.courseContent[0]
      if (ch?.chapterContent.length) {
        found = { ...ch.chapterContent[0], chapter: 1, lecture: 1, chapterIndex: 0 }
      }
    }

    if (found) {
      setPlayerData(found)
      setOpenSections({ [found.chapterIndex]: true })
      hasAutoSelectedRef.current = true
    }
  }, [courseData, progressData, courseId])

  if (!courseData) return <Loading />

  const completedCount = progressData?.lectureCompleted?.length || 0
  const totalLectures = courseData.courseContent.reduce((s, c) => s + c.chapterContent.length, 0)
  const progressPct = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-8">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-6">
          <span
            onClick={() => navigate('/')}
            className="text-teal-600 cursor-pointer hover:underline"
          >
            Home
          </span>
          <span className="mx-1.5">/</span>
          <span
            onClick={() => navigate('/analytics?tab=courses')}
            className="text-teal-600 cursor-pointer hover:underline"
          >
            My Courses
          </span>
          <span className="mx-1.5">/</span>
          <span className="text-gray-700 line-clamp-1">{courseData.courseTitle}</span>
        </p>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: video + lecture info + rating */}
          <div className="flex-1 min-w-0">
            {/* Player */}
            {playerData ? (
              <VideoPlayer url={playerData.lectureUrl} />
            ) : (
              <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500" />
              </div>
            )}

            {/* Lecture info + mark complete */}
            {playerData && (
              <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">
                    Chapter {playerData.chapter} · Lecture {playerData.lecture}
                  </p>
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {playerData.lectureTitle}
                  </p>
                </div>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    progressData?.lectureCompleted?.includes(playerData.lectureId)
                      ? 'bg-teal-50 text-teal-700 border border-teal-100 cursor-default'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {progressData?.lectureCompleted?.includes(playerData.lectureId)
                    ? '✓ Completed'
                    : 'Mark Complete'}
                </button>
              </div>
            )}

            {/* Rating */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">Rate this course</p>
              <Rating initialRating={initialRating} onRate={handleRating} />
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div className="lg:sticky lg:top-24 w-full lg:w-72 xl:w-80 shrink-0">
            {/* Progress */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Your progress</span>
                <span className="font-semibold text-teal-600">{progressPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {completedCount} of {totalLectures} lectures completed
              </p>
            </div>

            {/* Chapter list */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">Course Structure</p>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {courseData.courseContent.map((chapter, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0">
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition select-none"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={assets.down_arrow_icon}
                          alt=""
                          className={`w-3.5 h-3.5 shrink-0 transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                        />
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 shrink-0 ml-2">
                        {chapter.chapterContent.length}
                      </p>
                    </div>

                    {openSections[index] && (
                      <div className="bg-gray-50 border-t border-gray-100">
                        {chapter.chapterContent.map((lecture, i) => {
                          const isCompleted = progressData?.lectureCompleted?.includes(
                            lecture.lectureId
                          )
                          const isActive = playerData?.lectureId === lecture.lectureId
                          return (
                            <div
                              key={i}
                              onClick={() => selectLecture(lecture, index, i)}
                              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition ${
                                isActive ? 'bg-teal-50' : 'hover:bg-gray-100'
                              }`}
                            >
                              <img
                                src={isCompleted ? assets.teal_tick_icon : assets.play_icon}
                                alt=""
                                className="w-3.5 h-3.5 shrink-0 opacity-70"
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs truncate ${isActive ? 'text-teal-700 font-semibold' : 'text-gray-700'}`}
                                >
                                  {lecture.lectureTitle}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                    units: ['h', 'm'],
                                  })}
                                </p>
                              </div>
                            </div>
                          )
                        })}

                        {/* Quiz button — appears when all lectures in the chapter are marked complete */}
                        {chapter.chapterContent.length > 0 &&
                          chapter.chapterContent.every((lec) =>
                            progressData?.lectureCompleted?.includes(lec.lectureId)
                          ) && (
                            <div className="px-4 py-3 border-t border-gray-200 bg-white">
                              <button
                                onClick={() => navigate(`/quiz/${courseId}/${chapter.chapterId}`)}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-3.5 h-3.5"
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                {quizResultsMap[chapter.chapterId]
                                  ? 'Retake Quiz'
                                  : 'Take Chapter Quiz'}
                              </button>
                              {quizResultsMap[chapter.chapterId] &&
                                (() => {
                                  const r = quizResultsMap[chapter.chapterId]
                                  const badgeColor =
                                    r.group === 'mastered'
                                      ? 'text-teal-700 bg-teal-50'
                                      : r.group === 'on_track'
                                        ? 'text-amber-700 bg-amber-50'
                                        : 'text-red-700 bg-red-50'
                                  const icon =
                                    r.group === 'mastered'
                                      ? '🏆'
                                      : r.group === 'on_track'
                                        ? '🎯'
                                        : '📖'
                                  return (
                                    <p
                                      className={`mt-2 text-center text-xs rounded-lg py-1 px-2 font-medium ${badgeColor}`}
                                    >
                                      {icon} Last: {r.percentage}% ·{' '}
                                      {r.group === 'mastered'
                                        ? 'Mastered'
                                        : r.group === 'on_track'
                                          ? 'On Track'
                                          : 'Needs Review'}
                                    </p>
                                  )
                                })()}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Player
