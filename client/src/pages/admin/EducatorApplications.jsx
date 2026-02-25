import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const STATUS_STYLES = {
  pending:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  approved:
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
  rejected:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
}

const FILTER_OPTIONS = ['all', 'pending', 'approved', 'rejected']

const EducatorApplications = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const [applications, setApplications] = useState(null)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [rejectModal, setRejectModal] = useState(null) // { id }
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(null) // id being actioned

  const fetchApplications = async () => {
    try {
      const token = await getToken()
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const { data } = await axios.get(backendUrl + '/api/admin/educator-applications' + params, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setApplications(data.applications)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      const token = await getToken()
      const { data } = await axios.patch(
        backendUrl + `/api/admin/educator-applications/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Application approved. Educator role granted.')
        fetchApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectSubmit = async () => {
    if (!rejectModal) return
    setActionLoading(rejectModal.id)
    try {
      const token = await getToken()
      const { data } = await axios.patch(
        backendUrl + `/api/admin/educator-applications/${rejectModal.id}/reject`,
        { reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Application rejected.')
        setRejectModal(null)
        setRejectReason('')
        fetchApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (!applications) return <Loading />

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Educator Applications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review and manage applications from users who want to become educators
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              filter === f
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 self-center">
          {applications.length} result{applications.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Applications list */}
      {applications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 py-16 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">No applications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const isExpanded = expandedId === app._id
            return (
              <div
                key={app._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                {/* Row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {app.professionalTitle}
                      </p>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[app.status]}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {app.expertise.join(', ')}
                      </p>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(app._id)}
                          disabled={actionLoading === app._id}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-medium transition"
                        >
                          {actionLoading === app._id ? '…' : 'Approve'}
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal({ id: app._id })
                            setRejectReason('')
                          }}
                          disabled={actionLoading === app._id}
                          className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 text-xs font-medium transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app._id)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      aria-label="Toggle details"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4 space-y-3 bg-gray-50/50 dark:bg-gray-700/20">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Bio
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{app.bio}</p>
                    </div>
                    {app.linkedinUrl && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          LinkedIn / Portfolio
                        </p>
                        <a
                          href={app.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                        >
                          {app.linkedinUrl}
                        </a>
                      </div>
                    )}
                    {app.status === 'rejected' && app.rejectionReason && (
                      <div>
                        <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {app.rejectionReason}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      User ID: {app.userId}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Reject Application
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Optionally provide a reason. The applicant will see this when they check their status.
            </p>
            <textarea
              rows={3}
              placeholder="Rejection reason (optional)…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading !== null}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium text-sm transition"
              >
                {actionLoading ? 'Rejecting…' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setRejectModal(null)
                  setRejectReason('')
                }}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EducatorApplications
