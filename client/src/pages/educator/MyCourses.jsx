import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Skeleton from '../../components/Skeleton'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyCourses = () => {
  const { backendUrl, isEducator, getToken, navigate } = useContext(AppContext)
  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setCourses(data.courses)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) fetchEducatorCourses()
  }, [isEducator]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!courses) {
    return (
      <div className="min-h-screen p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="w-14 h-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-8 hidden sm:block" />
                <Skeleton className="h-4 w-16 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0)
  const totalEarnings = courses.reduce((sum, course) => {
    return (
      sum +
      Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount * course.coursePrice) / 100))
    )
  }, 0)

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} · {totalStudents} student
            {totalStudents !== 1 ? 's' : ''} enrolled
          </p>
        </div>
        <button
          onClick={() => navigate('/educator/add-course')}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New Course
        </button>
      </div>

      {/* Summary strip */}
      {courses.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Total earnings
            </span>
            <span className="text-sm font-bold text-teal-700">
              ₹{totalEarnings.toLocaleString()}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Total students
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {totalStudents}
            </span>
          </div>
        </div>
      )}

      {/* Course table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Course
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Students
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Earnings
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Published
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {courses.map((course) => {
                const earnings = Math.floor(
                  course.enrolledStudents.length *
                    (course.coursePrice - (course.discount * course.coursePrice) / 100)
                )
                const discountedPrice = Math.floor(
                  course.coursePrice - (course.discount * course.coursePrice) / 100
                )
                return (
                  <tr
                    key={course._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.courseThumbnail}
                          alt=""
                          className="w-14 h-10 rounded-lg object-cover shrink-0 border border-gray-100 dark:border-gray-600"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                            {course.courseTitle}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              ₹{discountedPrice.toLocaleString()}
                            </span>
                            {course.discount > 0 && (
                              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-100">
                                {course.discount}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                        >
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {course.enrolledStudents.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        ₹{earnings.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500 hidden md:table-cell">
                      {new Date(course.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {courses.length === 0 && (
            <div className="py-16 text-center space-y-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              <p className="text-gray-400 dark:text-gray-500 text-sm">No courses yet</p>
              <button
                onClick={() => navigate('/educator/add-course')}
                className="text-teal-600 text-sm font-semibold hover:underline"
              >
                Create your first course →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyCourses
