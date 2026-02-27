import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

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
  // 'selection' → user picks provider; 'stripe' → show embedded checkout; 'razorpay' → show pay button
  const [step, setStep] = useState('selection')
  const [razorpayLoading, setRazorpayLoading] = useState(false)
  // clientSecret is set after a successful Stripe purchase call
  const [clientSecret, setClientSecret] = useState(null)
  const stripePurchaseDone = useRef(false)

  useEffect(() => {
    if (userData === null) navigate('/', { replace: true })
  }, [userData, navigate])

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/course/${courseId}`)
      .then((res) => {
        if (res.data.success) setCourseTitle(res.data.courseData.courseTitle)
      })
      .catch(() => {})
  }, [courseId, backendUrl])

  // Called by EmbeddedCheckoutProvider once when Stripe mounts
  const fetchClientSecret = useCallback(async () => {
    if (stripePurchaseDone.current) return clientSecret || ''
    stripePurchaseDone.current = true

    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId, provider: 'stripe' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!data.success) {
        toast.error(data.message)
        navigate(-1)
        return ''
      }
      setClientSecret(data.clientSecret)
      return data.clientSecret
    } catch (e) {
      toast.error(e.message)
      navigate(-1)
      return ''
    }
  }, [courseId, backendUrl, getToken, navigate, clientSecret])

  const handleProviderSelect = (selected) => {
    setStep(selected)
    stripePurchaseDone.current = false
  }

  const handleRazorpayPay = async () => {
    setRazorpayLoading(true)
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId, provider: 'razorpay' },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!data.success) {
        toast.error(data.message)
        setRazorpayLoading(false)
        return
      }

      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error('Failed to load Razorpay. Please try again.')
        setRazorpayLoading(false)
        return
      }

      const purchaseId = data.purchaseId

      const options = {
        key: data.keyId,
        amount: undefined, // order amount is set server-side via orderId
        currency: 'INR',
        name: 'SkillRise',
        description: courseTitle,
        order_id: data.orderId,
        handler: (response) => {
          // Verify signature server-side and complete enrollment.
          // Fire-and-forget — idempotency in completePurchase means
          // the webhook is a safe fallback if this call fails.
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
          navigate(`/payment/success/${courseId}?provider=razorpay`)
        },
        modal: {
          ondismiss: () => setRazorpayLoading(false),
        },
        theme: { color: '#14b8a6' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      toast.error(e.message)
      setRazorpayLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => (step === 'selection' ? navigate(-1) : setStep('selection'))}
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

        {/* Provider selection */}
        {step === 'selection' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Choose payment method
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleProviderSelect('stripe')}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition text-left"
              >
                <span className="text-2xl">💳</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Stripe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Card, Google Pay, Apple Pay
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleProviderSelect('razorpay')}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition text-left"
              >
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Razorpay</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    UPI, Net Banking, Wallet, Card
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Stripe Embedded Checkout */}
        {step === 'stripe' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {/* Razorpay — initiate on button click */}
        {step === 'razorpay' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <span className="text-4xl mb-4 block">🏦</span>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              You&apos;ll be redirected to Razorpay to complete your payment securely.
            </p>
            <button
              onClick={handleRazorpayPay}
              disabled={razorpayLoading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold rounded-xl transition text-sm"
            >
              {razorpayLoading ? 'Opening Razorpay…' : 'Pay with Razorpay'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
