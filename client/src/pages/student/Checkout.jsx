import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const Checkout = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { backendUrl, getToken, userData } = useContext(AppContext)
  const [courseTitle, setCourseTitle] = useState('')

  // Redirect away if not logged in
  useEffect(() => {
    if (userData === null) navigate('/', { replace: true })
  }, [userData, navigate])

  // Fetch course title for the header
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/course/${courseId}`)
      .then((r) => {
        if (r.data.success) setCourseTitle(r.data.courseData.courseTitle)
      })
      .catch(() => {})
  }, [courseId, backendUrl])

  const fetchClientSecret = useCallback(async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!data.success) {
        toast.error(data.message)
        navigate(-1)
        return ''
      }
      return data.clientSecret
    } catch (e) {
      toast.error(e.message)
      navigate(-1)
      return ''
    }
  }, [courseId, backendUrl, getToken, navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 mb-4 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Complete your purchase</h1>
          {courseTitle && <p className="text-sm text-gray-500 mt-0.5 truncate">{courseTitle}</p>}
        </div>

        {/* Stripe Embedded Checkout */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}

export default Checkout
