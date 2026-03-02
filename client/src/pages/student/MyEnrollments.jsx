import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Skeleton from '../../components/common/Skeleton'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext)

  const [progressArray, setProgressArray] = useState([])
  const [progressLoading, setProgressLoading] = useState(false)

  const getCourseProgress = async () => {
    setProgressLoading(true)
    try {
      const token = await getToken()

      const progressResults = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          const totalLectures = calculateNoOfLectures(course)
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
          return { totalLectures, lectureCompleted }
        })
      )

      setProgressArray(progressResults)
    } catch (error) {
      toast.error(error.message)
    }
    setProgressLoading(false)
  }

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses()
    }
  }, [userData])

  useEffect(() => {
    if (Array.isArray(enrolledCourses) && enrolledCourses.length > 0) {
      getCourseProgress()
    }
  }, [enrolledCourses])

  if (progressLoading) {
    return (
      <>
        <div className="md:px-36 px-4 pt-10 pb-10">
          <Skeleton className="h-8 w-48 mb-6" />
          {/* Mobile skeleton */}
          <div className="sm:hidden space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-3"
              >
                <Skeleton className="w-20 h-14 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop skeleton */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="border dark:border-gray-700 rounded mt-4 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-4 py-4 flex items-center gap-4">
                  <Skeleton className="w-28 h-16 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-20 hidden md:block" />
                  <Skeleton className="h-4 w-20 hidden md:block" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="md:px-36 px-4 pt-10 pb-10">
        <h1 className="text-2xl font-semibold dark:text-white mb-6">My Enrollments</h1>

        {/* Mobile card layout */}
        <div className="sm:hidden space-y-4">
          {enrolledCourses.map((course, index) => {
            const prog = progressArray[index]
            const pct = prog ? (prog.lectureCompleted / prog.totalLectures) * 100 : 0
            const isCompleted = prog && prog.lectureCompleted / prog.totalLectures === 1
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-3"
              >
                <img
                  src={course.courseThumbnail}
                  alt=""
                  className="w-20 h-14 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {course.courseTitle}
                  </p>
                  <Line
                    strokeColor={'#009688'}
                    strokeWidth={3}
                    percent={pct}
                    className="bg-gray-200 dark:bg-gray-600 rounded-full"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {prog
                        ? `${prog.lectureCompleted}/${prog.totalLectures} lectures`
                        : calculateCourseDuration(course)}
                    </p>
                    <button
                      className="px-3 py-1 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition"
                      onClick={() => navigate('/player/' + course._id)}
                    >
                      {isCompleted ? 'Completed' : 'On Going'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="table-auto w-full border dark:border-gray-700 mt-4">
            <thead className="text-gray-900 dark:text-white border-b border-gray-500/20 dark:border-gray-700 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Course</th>
                <th className="px-4 py-3 font-semibold truncate">Duration</th>
                <th className="px-4 py-3 font-semibold truncate">Completed</th>
                <th className="px-4 py-3 font-semibold truncate">Status</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300">
              {enrolledCourses.map((course, index) => {
                const prog = progressArray[index]
                const pct = prog ? (prog.lectureCompleted * 100) / prog.totalLectures : 0
                const isCompleted = prog && prog.lectureCompleted / prog.totalLectures === 1
                return (
                  <tr key={index} className="border-b border-gray-500/20 dark:border-gray-700">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img src={course.courseThumbnail} alt="" className="w-24 md:w-28" />

                      <div className="flex-1">
                        <p className="mb-1">{course.courseTitle}</p>
                        <Line
                          strokeColor={'#009688'}
                          strokeWidth={2}
                          percent={pct}
                          className="bg-gray-300 dark:bg-gray-600 rounded-full"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3">{calculateCourseDuration(course)}</td>

                    <td className="px-4 py-3">
                      {prog && `${prog.lectureCompleted} / ${prog.totalLectures}`}{' '}
                      <span>Lectures</span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        className="px-5 py-2 bg-teal-600 text-white hover:bg-teal-700 transition"
                        onClick={() => navigate('/player/' + course._id)}
                      >
                        {isCompleted ? 'Completed' : 'On Going'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default MyEnrollments
