import { useContext, useEffect, useState } from 'react'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const GROUP_COLORS = {
  needs_review: { bar: 'bg-red-400', label: 'Needs Review', text: 'text-red-600', bg: 'bg-red-50' },
  on_track: { bar: 'bg-amber-400', label: 'On Track', text: 'text-amber-600', bg: 'bg-amber-50' },
  mastered: { bar: 'bg-teal-500', label: 'Mastered', text: 'text-teal-600', bg: 'bg-teal-50' },
}

const StatCard = ({ icon, label, value, iconBg, iconColor }) => (
  <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-5 shadow-sm flex-1 min-w-[190px]">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const { backendUrl, isEducator, getToken } = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)
  const [quizInsights, setQuizInsights] = useState([])

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setDashboardData(data.dashboardData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchQuizInsights = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/quiz/educator-insights', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setQuizInsights(data.insights)
    } catch {
      /* non-critical, fail silently */
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
      fetchQuizInsights()
    }
  }, [isEducator]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!dashboardData) return <Loading />

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8 bg-gray-50">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your courses, students, and earnings
        </p>
      </div>

      {/* Stat cards */}
      <div className="flex flex-wrap gap-4">
        <StatCard
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          }
          label="Total Enrollments"
          value={dashboardData.enrolledStudentsData.length}
        />
        <StatCard
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
          }
          label="Published Courses"
          value={dashboardData.totalCourses}
        />
        <StatCard
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          }
          label="Total Earnings"
          value={`₹${dashboardData.totalEarnings.toLocaleString()}`}
        />
      </div>

      {/* Latest enrollments */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Latest Enrollments</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {dashboardData.enrolledStudentsData.length} students total
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell w-12">
                  #
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Course
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-gray-400 hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white border border-gray-100 shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-900">{item.student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 max-w-xs truncate">
                    {item.courseTitle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dashboardData.enrolledStudentsData.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-gray-400 text-sm">No enrollments yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Insights */}
      {quizInsights.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Quiz Insights</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Student performance across chapter quizzes
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {quizInsights.map((item, i) => {
              const total = item.needs_review + item.on_track + item.mastered
              return (
                <div key={i} className="px-6 py-4 space-y-2">
                  {/* Chapter + course */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.chapterTitle}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{item.courseTitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-900">{item.avgPct}%</p>
                      <p className="text-xs text-gray-400">
                        {item.attempts} attempt{item.attempts !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Stacked bar */}
                  <div className="flex h-2 rounded-full overflow-hidden gap-px">
                    {['needs_review', 'on_track', 'mastered'].map((g) => {
                      const pct = total > 0 ? Math.round((item[g] / total) * 100) : 0
                      return pct > 0 ? (
                        <div
                          key={g}
                          title={`${GROUP_COLORS[g].label}: ${item[g]} student${item[g] !== 1 ? 's' : ''}`}
                          className={`${GROUP_COLORS[g].bar} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      ) : null
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3">
                    {['needs_review', 'on_track', 'mastered'].map((g) => (
                      <span
                        key={g}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${GROUP_COLORS[g].bg} ${GROUP_COLORS[g].text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${GROUP_COLORS[g].bar}`} />
                        {GROUP_COLORS[g].label}: {item[g]}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
