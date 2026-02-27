import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const AdminCourses = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const [courses, setCourses] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(backendUrl + '/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) setCourses(data.courses)
        else toast.error(data.message)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetch()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!courses) return <Loading />

  const filtered = courses.filter(
    (c) =>
      c.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.educator?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0)
  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrolledCount, 0)

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {courses.length} courses · ₹{totalRevenue.toLocaleString('en-IN')} total revenue ·{' '}
            {totalEnrollments} enrollments
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by title or educator…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Educator
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((course) => {
                const effectivePrice =
                  course.discount > 0
                    ? course.coursePrice - (course.coursePrice * course.discount) / 100
                    : course.coursePrice

                return (
                  <tr
                    key={course._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                        {course.courseTitle}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {new Date(course.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {course.educatorId?.name || '—'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[140px]">
                        {course.educatorId?.email || ''}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {course.enrolledCount}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">students</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ₹{course.revenue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {course.purchases} purchase{course.purchases !== 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        ₹{Math.round(effectivePrice).toLocaleString('en-IN')}
                      </p>
                      {course.discount > 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
                          ₹{course.coursePrice.toLocaleString('en-IN')}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          course.isPublished
                            ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800'
                            : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                        }`}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {search ? 'No courses match your search' : 'No courses yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCourses
