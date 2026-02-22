import { useContext, useEffect, useState } from 'react'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null)
  const [search, setSearch] = useState('')

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setEnrolledStudents(data.enrolledStudents.reverse())
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) fetchEnrolledStudents()
  }, [isEducator]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!enrolledStudents) return <Loading />

  const filtered = enrolledStudents.filter(
    (item) =>
      item.student.name.toLowerCase().includes(search.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students Enrolled</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {enrolledStudents.length} total enrollment{enrolledStudents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search student or course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 w-full sm:w-64 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden sm:table-cell w-12">
                  #
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Student
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Course
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Enrolled On
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-gray-400 dark:text-gray-500 hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 border border-gray-100 dark:border-gray-600 shrink-0"
                      />
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {item.student.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {item.courseTitle}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-400 dark:text-gray-500 hidden md:table-cell">
                    {new Date(item.purchaseDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {search ? `No results for "${search}"` : 'No enrollments yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentsEnrolled
