import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EXPERTISE_OPTIONS = [
  'Web Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'Mobile Development',
  'DevOps & Cloud',
  'Cybersecurity',
  'AI & Machine Learning',
  'Other',
]

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-teal-50 text-teal-700 border-teal-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  }
  const labels = { pending: 'Under Review', approved: 'Approved', rejected: 'Rejected' }
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}

const BecomeEducator = () => {
  const { backendUrl, getToken, navigate, isEducator, applicationStatus, setApplicationStatus } =
    useContext(AppContext)

  const [form, setForm] = useState({
    professionalTitle: '',
    bio: '',
    expertise: [],
    linkedinUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [reapplying, setReapplying] = useState(false)

  // If already an educator, redirect to dashboard
  useEffect(() => {
    if (isEducator) {
      navigate('/educator')
    }
  }, [isEducator])

  const handleExpertiseToggle = (option) => {
    setForm((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(option)
        ? prev.expertise.filter((e) => e !== option)
        : [...prev.expertise, option],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.expertise.length === 0) {
      toast.error('Please select at least one area of expertise.')
      return
    }

    setSubmitting(true)
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/educator/apply', form, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        toast.success(data.message)
        // Refresh application status
        const statusRes = await axios.get(backendUrl + '/api/educator/application-status', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (statusRes.data.success) {
          setApplicationStatus(statusRes.data.application)
        }
        setReapplying(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Show pending state
  if (applicationStatus?.status === 'pending' && !reapplying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
              />
            </svg>
          </div>
          <StatusBadge status="pending" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Application Under Review</h2>
          <p className="mt-2 text-sm text-gray-500">
            Our team is reviewing your application. You will gain educator access once it is
            approved.
          </p>
          <div className="mt-6 text-left bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-600 border border-gray-100">
            <div>
              <span className="font-medium text-gray-700">Title: </span>
              {applicationStatus.professionalTitle}
            </div>
            <div>
              <span className="font-medium text-gray-700">Expertise: </span>
              {applicationStatus.expertise.join(', ')}
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  // Show rejected state
  if (applicationStatus?.status === 'rejected' && !reapplying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <StatusBadge status="rejected" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Application Not Approved</h2>
          {applicationStatus.rejectionReason && (
            <p className="mt-3 text-sm text-gray-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <span className="font-medium text-red-600">Reason: </span>
              {applicationStatus.rejectionReason}
            </p>
          )}
          <p className="mt-3 text-sm text-gray-500">You may update your application and reapply.</p>
          <button
            onClick={() => {
              setReapplying(true)
              setForm({
                professionalTitle: applicationStatus.professionalTitle || '',
                bio: applicationStatus.bio || '',
                expertise: applicationStatus.expertise || [],
                linkedinUrl: applicationStatus.linkedinUrl || '',
              })
            }}
            className="mt-6 w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition text-sm font-medium"
          >
            Update &amp; Reapply
          </button>
          <button
            onClick={() => navigate('/')}
            className="mt-3 w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  // Application form (new or reapplying)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Apply to Become an Educator</h1>
          <p className="mt-2 text-sm text-gray-500">
            Share your expertise with thousands of learners. Our team will review your application.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6"
        >
          {/* Professional Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Professional Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Software Engineer, UX Designer"
              value={form.professionalTitle}
              onChange={(e) => setForm((p) => ({ ...p, professionalTitle: e.target.value }))}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bio / About You <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Briefly describe your background, experience, and what you plan to teach..."
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Expertise <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map((option) => {
                const selected = form.expertise.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleExpertiseToggle(option)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      selected
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {form.expertise.length === 0 && (
              <p className="mt-1.5 text-xs text-gray-400">Select at least one area.</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              LinkedIn / Portfolio URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={form.linkedinUrl}
              onChange={(e) => setForm((p) => ({ ...p, linkedinUrl: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-medium text-sm transition"
            >
              {submitting
                ? 'Submitting…'
                : reapplying
                  ? 'Resubmit Application'
                  : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Applications are reviewed by our team. You will gain educator access once approved.
        </p>
      </div>
    </div>
  )
}

export default BecomeEducator
