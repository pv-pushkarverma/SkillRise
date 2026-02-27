import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const STATUS_OPTIONS = ['all', 'completed', 'created', 'pending', 'failed', 'refunded']

const STATUS_STYLES = {
  completed:
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
  created:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  pending:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  failed:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  refunded:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
}

const AdminPurchases = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const [purchases, setPurchases] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getToken()
        const params = filter !== 'all' ? `?status=${filter}` : ''
        const { data } = await axios.get(backendUrl + '/api/admin/purchases' + params, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) setPurchases(data.purchases)
        else toast.error(data.message)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetch()
  }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!purchases) return <Loading />

  const totalRevenue = purchases
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchases</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {purchases.length} record{purchases.length !== 1 ? 's' : ''}
          {filter === 'all' || filter === 'completed'
            ? ` · ₹${totalRevenue.toLocaleString('en-IN')} revenue`
            : ''}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              filter === s
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
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
                  Course
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Amount
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
              {purchases.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {p.courseId?.courseTitle || '—'}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate block max-w-[160px]">
                      {p.userId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[p.status]}`}
                    >
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500 hidden lg:table-cell">
                    {new Date(p.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {purchases.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">No purchases found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPurchases
