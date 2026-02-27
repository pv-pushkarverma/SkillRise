import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

const BarTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
      <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
        {payload[0].value} enrollments
      </p>
    </div>
  )
}

const AreaTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-700 dark:text-gray-200 mb-0.5">{label}</p>
      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
        ₹{payload[0].value.toLocaleString('en-IN')}
      </p>
    </div>
  )
}

const StatCard = ({ icon, label, value, accent, sub, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group text-left bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all w-full"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent.bg}`}>
      <span className={accent.text}>{icon}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    {sub && (
      <p
        className={`text-[11px] mt-1 font-medium ${sub.urgent ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}
      >
        {sub.text}
      </p>
    )}
  </button>
)

const ChartCard = ({ title, sub, action, children }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden h-full">
    <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
)

const Empty = ({ text }) => (
  <div className="flex items-center justify-center py-10">
    <p className="text-xs text-gray-400 dark:text-gray-500">{text}</p>
  </div>
)

const AdminDashboard = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [charts, setCharts] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        const headers = { Authorization: `Bearer ${token}` }
        const [sRes, cRes] = await Promise.all([
          axios.get(backendUrl + '/api/admin/stats', { headers }),
          axios.get(backendUrl + '/api/admin/chart-data', { headers }),
        ])
        if (sRes.data.success) setStats(sRes.data.stats)
        else toast.error(sRes.data.message)
        if (cRes.data.success) setCharts(cRes.data)
        else toast.error(cRes.data.message)
      } catch (e) {
        toast.error(e.message)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!stats || !charts) return <Loading />

  const hasEnrollment = charts.topCourseData.some((c) => c.enrollments > 0)
  const hasRevenue = charts.weeklyRevenue?.some((d) => d.revenue > 0)

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      accent: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        text: 'text-indigo-600 dark:text-indigo-400',
      },
      route: '/admin/users',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      label: 'Total Educators',
      value: stats.totalEducators.toLocaleString(),
      accent: { bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' },
      route: '/admin/users',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      ),
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      accent: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        text: 'text-emerald-600 dark:text-emerald-400',
      },
      route: '/admin/purchases',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
    },
    {
      label: 'Total Enrollments',
      value: stats.totalEnrollments.toLocaleString(),
      accent: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
      route: '/admin/courses',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
        </svg>
      ),
    },
    {
      label: 'Total Courses',
      value: stats.totalCourses.toLocaleString(),
      accent: {
        bg: 'bg-violet-50 dark:bg-violet-900/30',
        text: 'text-violet-600 dark:text-violet-400',
      },
      route: '/admin/courses',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
        </svg>
      ),
    },
    {
      label: 'Pending Applications',
      value: stats.pendingApplications,
      accent: {
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400',
      },
      route: '/admin/educator-applications',
      sub:
        stats.pendingApplications > 0
          ? { text: 'Needs review', urgent: true }
          : { text: 'All clear', urgent: false },
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Platform overview</p>
        </div>
        <p className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 mt-1">{today}</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((c) => (
          <StatCard
            key={c.label}
            icon={c.icon}
            label={c.label}
            value={c.value}
            accent={c.accent}
            sub={c.sub}
            onClick={() => navigate(c.route)}
          />
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top courses by enrollment — left 2 cols */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Top Courses by Enrollment"
            sub="Most popular courses on the platform"
            action={
              <button
                onClick={() => navigate('/admin/courses')}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 mt-0.5"
              >
                View all
              </button>
            }
          >
            {hasEnrollment ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={charts.topCourseData}
                  layout="vertical"
                  margin={{ left: 4, right: 24, top: 4, bottom: 4 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<BarTip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  <Bar dataKey="enrollments" fill="#6366f1" radius={[0, 6, 6, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty text="No enrollment data yet" />
            )}
          </ChartCard>
        </div>

        {/* Weekly revenue — right col */}
        <div>
          <ChartCard
            title="Weekly Revenue"
            sub="Earnings over the last 7 days"
            action={
              <button
                onClick={() => navigate('/admin/purchases')}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 mt-0.5"
              >
                View all
              </button>
            }
          >
            {hasRevenue ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={charts.weeklyRevenue}
                  margin={{ left: 0, right: 8, top: 8, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                    tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)}
                  />
                  <Tooltip
                    content={<AreaTip />}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 2' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#10b981', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty text="No revenue this week" />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
