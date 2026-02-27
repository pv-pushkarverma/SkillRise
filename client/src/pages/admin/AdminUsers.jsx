import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const Avatar = ({ user }) =>
  user.imageUrl ? (
    <img
      src={user.imageUrl}
      alt={user.name}
      className="w-8 h-8 rounded-full object-cover shrink-0"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        {user.name.charAt(0).toUpperCase()}
      </span>
    </div>
  )

const AdminUsers = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const [users, setUsers] = useState(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('students')

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(backendUrl + '/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) setUsers(data.users)
        else toast.error(data.message)
      } catch (error) {
        toast.error(error.message)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!users) return <Loading />

  const students = users.filter((u) => !u.isEducator)
  const educators = users.filter((u) => u.isEducator)
  const list = (tab === 'students' ? students : educators).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {users.length} total · {educators.length} educator{educators.length !== 1 ? 's' : ''} ·{' '}
            {students.length} student{students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <input
          type="text"
          placeholder={`Search ${tab}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 w-fit shadow-sm">
        {[
          { key: 'students', label: 'Students', count: students.length },
          { key: 'educators', label: 'Educators', count: educators.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key)
              setSearch('')
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              tab === t.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
            <span
              className={`text-xs rounded-full px-1.5 py-0.5 ${tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  {tab === 'students' ? 'Student' : 'Educator'}
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  {tab === 'students' ? 'Enrolled Courses' : 'Courses Created'}
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {list.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={u} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {tab === 'students' ? u.enrolledCount : u.coursesCreated}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500 hidden lg:table-cell">
                    {fmt(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {search ? `No ${tab} match your search` : `No ${tab} yet`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
