import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

// Dynamically loads the Razorpay checkout script from their CDN.
// Returns true when ready, false if the script fails to load.
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

const Checkout = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { backendUrl, getToken, userData } = useContext(AppContext)

  const [courseTitle, setCourseTitle] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect unauthenticated users away from checkout
  useEffect(() => {
    if (userData === null) navigate('/', { replace: true })
  }, [userData, navigate])

  // Fetch course title to display in the UI and pass to Razorpay modal
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/course/${courseId}`)
      .then((res) => {
        if (res.data.success) setCourseTitle(res.data.courseData.courseTitle)
      })
      .catch(() => {})
  }, [courseId, backendUrl])

  const handlePay = async () => {
    setLoading(true)
    try {
      // Step 1: Create a Purchase record and a Razorpay order on the server.
      // The server returns orderId (for the Razorpay modal) and keyId (to authenticate it).
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!data.success) {
        toast.error(data.message)
        setLoading(false)
        return
      }

      // Step 2: Load the Razorpay SDK if not already on the page
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error('Failed to load Razorpay. Please try again.')
        setLoading(false)
        return
      }

      const { purchaseId, orderId, keyId } = data

      // Step 3: Open the Razorpay payment modal.
      // On success, Razorpay calls the handler with orderId, paymentId, and signature.
      const options = {
        key: keyId,
        currency: 'INR',
        name: 'SkillRise',
        description: courseTitle,
        order_id: orderId,
        handler: (response) => {
          // Step 4: Verify the payment signature on the server.
          // This is fire-and-forget — we navigate to the success page immediately.
          // The Razorpay webhook is a reliable fallback: if this call fails
          // (network drop, browser close), the webhook still completes enrollment.
          getToken().then((t) =>
            axios
              .post(
                `${backendUrl}/api/user/verify-razorpay`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  purchaseId,
                },
                { headers: { Authorization: `Bearer ${t}` } }
              )
              .catch(() => {})
          )
          navigate(`/payment/success/${courseId}`)
        },
        modal: {
          // Reset loading state if the user closes the modal without paying
          ondismiss: () => setLoading(false),
        },
        theme: { color: '#14b8a6' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      toast.error(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1.5 mb-4 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Complete your purchase
          </h1>
          {courseTitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {courseTitle}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <span className="text-4xl mb-4 block">🏦</span>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            You&apos;ll be redirected to Razorpay to complete your payment securely.
          </p>
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold rounded-xl transition text-sm"
          >
            {loading ? 'Opening Razorpay…' : 'Pay with Razorpay'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
