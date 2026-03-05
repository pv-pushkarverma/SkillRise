import humanizeDuration from 'humanize-duration'
import { useContext, useEffect, useRef, useState } from 'react'
import { ChevronDown, CheckCircle2, Play } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import VideoPlayer from '../../components/student/VideoPlayer'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/common/Loading'

const QUIZ_GROUP_CONFIG = {
  mastered: { color: 'text-teal-700 bg-teal-50', icon: '🏆', label: 'Mastered' },
  on_track: { color: 'text-amber-700 bg-amber-50', icon: '🎯', label: 'On Track' },
  needs_review: { color: 'text-red-700 bg-red-50', icon: '📖', label: 'Needs Review' },
}

const Player = () => {
  const { backendUrl, getToken, fetchUserEnrolledCourses, navigate } = useContext(AppContext)

  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(undefined)
  const [initialRating, setInitialRating] = useState(0)
  const [quizResultsMap, setQuizResultsMap] = useState({}) // chapterId -> last result
  const [certificateLoading, setCertificateLoading] = useState(false)
  const [hasFetchedCertificate, setHasFetchedCertificate] = useState(false)

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  // Saves the chosen lecture and persists it so the course resumes from here
  const selectLecture = (lecture, chapterIndex, lectureIndex) => {
    const lectureEntry = {
      ...lecture,
      chapter: chapterIndex + 1,
      lecture: lectureIndex + 1,
      chapterIndex,
    }
    setPlayerData(lectureEntry)
    localStorage.setItem(`lastPlayed_${courseId}`, JSON.stringify(lectureEntry))
  }

  const getCourseData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + `/api/user/enrolled-courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        setCourseData(data.courseData)
        setInitialRating(data.userRating || 0)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const markLectureAsCompleted = async (lectureId) => {
    if (!lectureId) return
    if (progressData?.lectureCompleted?.includes(lectureId)) return

    try {
      const token = await getToken()
      const { data } = await axios.post(
        backendUrl + '/api/user/update-course-progress',
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        if (data.isCourseCompleted)
          toast.success('Course completed. You can now get your certificate.')
        getCourseProgress()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const viewCertificate = async () => {
    try {
      setCertificateLoading(true)
      const token = await getToken()
      const { data } = hasFetchedCertificate
        ? await axios.get(`${backendUrl}/api/user/certificate/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(
            `${backendUrl}/api/user/certificate/generate/${courseId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )

      if (!data.success) {
        toast.error(data.message)
        return
      }

      if (!hasFetchedCertificate && data.created)
        toast.success('Certificate generated successfully.')
      toast.success(data.message)
      setHasFetchedCertificate(true)
      if (data.pdfUrl) {
        window.open(data.pdfUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.info(
          error?.response?.data?.message ||
            (hasFetchedCertificate
              ? 'Certificate not found. Try generating again.'
              : 'Certificate not available yet')
        )
      } else {
        toast.error(error?.response?.data?.message || error.message)
      }
    } finally {
      setCertificateLoading(false)
    }
  }

  const checkCertificate = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`${backendUrl}/api/user/certificate/check/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setHasFetchedCertificate(Boolean(data.certificateExists))
      }
    } catch {
      // Silent fallback: keep default CTA and let on-demand generation handle it.
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
    getCourseData()
    getCourseProgress()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!courseData || progressData === undefined) return

    const totalLectures = courseData.totalLectures || 0
    const completedCount = progressData?.lectureCompleted?.length || 0
    const isCompleted = totalLectures > 0 && completedCount >= totalLectures

    if (!isCompleted) {
      setHasFetchedCertificate(false)
      return
    }

    checkCertificate()
  }, [courseData, progressData, courseId]) // eslint-disable-line react-hooks/exhaustive-deps

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

  // Enrollment guard: if courseData is still null after mount, the webhook may not have
  // fired yet. Re-fetch enrolled courses after 3s, then redirect after 10s if still missing.
  useEffect(() => {
    if (courseData) return // Already enrolled — clear any pending timers on re-run

    // Re-fetch enrolled courses in case the Razorpay webhook just finished processing
    const retryId = setTimeout(fetchUserEnrolledCourses, 3000)

    // If still not enrolled after 10s, redirect to course page so user isn't stuck
    const giveUpId = setTimeout(() => {
      toast.error('Enrollment not confirmed. If you completed payment, please contact support.')
      navigate(`/course/${courseId}`)
    }, 10000)

    return () => {
      clearTimeout(retryId)
      clearTimeout(giveUpId)
    }
  }, [courseData]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasAutoSelectedRef = useRef(false)

  // Load lecture from localStorage as soon as courseData is ready
  useEffect(() => {
    if (!courseData || hasAutoSelectedRef.current) return
    if (progressData === undefined) return

    try {
      // Check first in localStorage
      const saved = localStorage.getItem(`lastPlayed_${courseId}`)
      if (saved) {
        const data = JSON.parse(saved)
        setPlayerData(data)
        if (data.chapterIndex !== undefined) {
          setOpenSections({ [data.chapterIndex]: true })
        }
        hasAutoSelectedRef.current = true
        return
      }

      const completed = progressData?.lectureCompleted ?? []

      let found = null
      outer: for (let ci = 0; ci < courseData.courseContent.length; ci++) {
        for (let li = 0; li < courseData.courseContent[ci].chapterContent.length; li++) {
          const lec = courseData.courseContent[ci].chapterContent[li]
          if (!completed.includes(lec.lectureId)) {
            found = { ...lec, chapter: ci + 1, lecture: li + 1, chapterIndex: ci }
            break outer
          }
        }
      }

      // if not in local storage and progress (new or completed)
      if (!found) {
        const first = courseData.courseContent[0]?.chapterContent[0]
        if (first) {
          found = { ...first, chapter: 1, lecture: 1, chapterIndex: 0 }
        }
      }

      if (found) {
        setPlayerData(found)
        setOpenSections({ [found.chapterIndex]: true })
        hasAutoSelectedRef.current = true
      }
    } catch {
      /* corrupted storage — ignore safely */
    }
  }, [courseData, progressData, courseId])

  if (!courseData) return <Loading />

  const completedCount = progressData?.lectureCompleted?.length || 0
  const totalLectures = courseData.totalLectures || 0
  const progressPct = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
            {courseData.courseTitle}
          </span>
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
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">
                    Chapter {playerData.chapter} · Lecture {playerData.lecture}
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {playerData.lectureTitle}
                  </p>
                </div>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  disabled={
                    !playerData?.lectureId ||
                    progressData === undefined ||
                    progressData?.lectureCompleted?.includes(playerData.lectureId)
                  }
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    progressData?.lectureCompleted?.includes(playerData.lectureId)
                      ? 'bg-teal-50 text-teal-700 border border-teal-100 cursor-not-allowed'
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
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Rate this course
              </p>
              <Rating initialRating={initialRating} onRate={handleRating} />
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div className="lg:sticky lg:top-24 w-full lg:w-72 xl:w-80 shrink-0">
            {/* Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-200">Your progress</span>
                <span className="font-semibold text-teal-600">{progressPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {completedCount} of {courseData.totalLectures} lectures completed
              </p>
            </div>

            {progressPct === 100 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Certificate
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Get your course completion certificate.
                </p>
                <button
                  onClick={viewCertificate}
                  disabled={certificateLoading}
                  className={`w-full py-2 rounded-lg text-sm font-semibold transition ${
                    certificateLoading
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {certificateLoading
                    ? 'Opening...'
                    : hasFetchedCertificate
                      ? 'View Certificate'
                      : 'Get Certificate'}
                </button>
              </div>
            )}

            {/* Chapter list */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  Course Structure
                </p>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {courseData.courseContent.map((chapter, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition select-none"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronDown
                          className={`w-3.5 h-3.5 shrink-0 transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                        />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 shrink-0 ml-2">
                        {chapter.chapterContent.length}
                      </p>
                    </div>

                    {openSections[index] && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
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
                                isActive
                                  ? 'bg-teal-50 dark:bg-teal-900/20'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-teal-600" />
                              ) : (
                                <Play className="w-3.5 h-3.5 shrink-0 opacity-50 text-gray-500 dark:text-gray-400" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs truncate ${isActive ? 'text-teal-700 font-semibold' : 'text-gray-700 dark:text-gray-200'}`}
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
                            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                                  const groupCfg =
                                    QUIZ_GROUP_CONFIG[r.group] || QUIZ_GROUP_CONFIG.needs_review
                                  return (
                                    <p
                                      className={`mt-2 text-center text-xs rounded-lg py-1 px-2 font-medium ${groupCfg.color}`}
                                    >
                                      {groupCfg.icon} Last: {r.percentage}% · {groupCfg.label}
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
