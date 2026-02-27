import crypto from 'crypto'
import Razorpay from 'razorpay'
import Purchase from '../../models/Purchase.js'

/**
 * Creates a Razorpay order and stores the providerOrderId on the Purchase.
 *
 * @param {object} params
 * @param {string} params.purchaseId  - Our internal Purchase document _id
 * @param {number} params.amount      - Amount in major currency unit (e.g. INR)
 * @param {string} params.courseTitle - Description for Razorpay order
 * @returns {{ orderId: string, keyId: string }}
 */
export const createOrder = async ({ purchaseId, amount, courseTitle }) => {
  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

  const currency = process.env.CURRENCY || 'INR'

  const order = await razorpayInstance.orders.create({
    amount: Math.round(amount * 100), // convert to paise
    currency,
    receipt: purchaseId.toString(),
    notes: {
      purchaseId: purchaseId.toString(),
      courseTitle,
    },
  })

  // Store the Razorpay order id on the Purchase so it can be referenced later
  await Purchase.findByIdAndUpdate(purchaseId, { providerOrderId: order.id })

  return {
    orderId: order.id,
    keyId: process.env.RAZORPAY_KEY_ID,
  }
}

/**
 * Verifies the Razorpay payment signature received from the frontend handler.
 * Uses HMAC-SHA256 with the Key Secret.
 *
 * @param {{ orderId: string, paymentId: string, signature: string }} params
 * @returns {boolean}
 */
export const verifyPayment = ({ orderId, paymentId, signature }) => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
