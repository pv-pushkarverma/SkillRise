import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const StatCard = ({ icon, label, value, iconBg, iconColor }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-5 shadow-sm flex-1 min-w-[190px]">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</p>
    </div>
  </div>
)

const STATUS_STYLES = {
  pending:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  approved:
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
  rejected:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
}

const AdminDashboard = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [applications, setApplications] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(backendUrl + '/api/admin/educator-applications', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) setApplications(data.applications)
        else toast.error(data.message)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetch()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!applications) return <Loading />

  const pending = applications.filter((a) => a.status === 'pending')
  const approved = applications.filter((a) => a.status === 'approved')
  const rejected = applications.filter((a) => a.status === 'rejected')
  const recent = applications.slice(0, 5)

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8 bg-gray-50 dark:bg-gray-950">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of educator applications and platform activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="flex flex-wrap gap-4">
        <StatCard
          iconBg="bg-indigo-50 dark:bg-indigo-900/30"
          iconColor="text-indigo-600 dark:text-indigo-400"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
          }
          label="Total Applications"
          value={applications.length}
        />
        <StatCard
          iconBg="bg-amber-50 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          }
          label="Pending Review"
          value={pending.length}
        />
        <StatCard
          iconBg="bg-teal-50 dark:bg-teal-900/30"
          iconColor="text-teal-600 dark:text-teal-400"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          }
          label="Approved"
          value={approved.length}
        />
        <StatCard
          iconBg="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-500 dark:text-red-400"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          }
          label="Rejected"
          value={rejected.length}
        />
      </div>

      {/* Recent applications */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Recent Applications
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Latest educator applications submitted
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/educator-applications')}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recent.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {app.userId}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {app.professionalTitle}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[app.status]}`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-400 dark:text-gray-500 hidden lg:table-cell">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {applications.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">No applications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
