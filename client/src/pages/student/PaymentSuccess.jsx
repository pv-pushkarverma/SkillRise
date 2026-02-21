import { useContext, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'

const REDIRECT_AFTER = 6

const PaymentSuccess = () => {
  const { courseId } = useParams()
  const [searchParams] = useSearchParams()
  const { backendUrl } = useContext(AppContext)

  const [course, setCourse] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'complete' | 'failed'
  const [countdown, setCountdown] = useState(REDIRECT_AFTER)

  // Verify session with Stripe
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      setStatus('complete')
      return
    } // no session_id = direct nav, just show success

    axios
      .get(`${backendUrl}/api/user/session-status?session_id=${sessionId}`)
      .then((r) =>
        setStatus(r.data.success && r.data.status === 'complete' ? 'complete' : 'failed')
      )
      .catch(() => setStatus('failed'))
  }, [searchParams, backendUrl])

  // Fetch course info for display
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/course/${courseId}`)
      .then((r) => {
        if (r.data.success) setCourse(r.data.courseData)
      })
      .catch(() => {})
  }, [courseId, backendUrl])

  // Auto-redirect countdown (only on success, gives webhook time to process)
  useEffect(() => {
    if (status !== 'complete') return
    if (countdown === 0) {
      window.location.href = `/player/${courseId}`
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [status, countdown, courseId])

  const discountedPrice = course
    ? (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)
    : null

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 gap-4 text-center">
        <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-8 h-8 text-red-500"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Payment not completed</h1>
        <p className="text-sm text-gray-500">Your payment was not processed. No charge was made.</p>
        <Link
          to={`/course/${courseId}`}
          className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
        >
          Back to course
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-emerald-400" />

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-teal-50 border-2 border-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-8 h-8 text-teal-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment successful!</h1>
          <p className="text-sm text-gray-500 mb-6">You're now enrolled. Happy learning!</p>

          {course && (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6 text-left">
              {course.courseThumbnail && (
                <img
                  src={course.courseThumbnail}
                  alt=""
                  className="w-16 h-11 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{course.courseTitle}</p>
                <p className="text-xs text-gray-400 mt-0.5">by {course.educator?.name}</p>
              </div>
              {discountedPrice && (
                <p className="text-sm font-bold text-teal-700 shrink-0">₹{discountedPrice}</p>
              )}
            </div>
          )}

          <Link
            to={`/player/${courseId}`}
            className="block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition text-sm mb-3"
          >
            Start Learning →
          </Link>

          <p className="text-xs text-gray-400">
            Redirecting automatically in{' '}
            <span className="font-semibold text-gray-600">{countdown}s</span>
          </p>
        </div>
      </div>

      <Link
        to="/my-enrollments"
        className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition"
      >
        View all my courses
      </Link>
    </div>
  )
}

export default PaymentSuccess
