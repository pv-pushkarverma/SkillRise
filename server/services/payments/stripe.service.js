import Stripe from 'stripe'

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Creates a Stripe Embedded Checkout Session.
 *
 * @param {object} params
 * @param {string} params.purchaseId  - Our internal Purchase document _id
 * @param {string} params.courseId    - Course _id (used in return URL)
 * @param {number} params.amount      - Amount in major currency unit (e.g. INR)
 * @param {string} params.courseTitle - Product name shown in Stripe UI
 * @param {string} params.origin      - Frontend origin for return URL
 * @returns {{ clientSecret: string }}
 */
export const createOrder = async ({ purchaseId, courseId, amount, courseTitle, origin }) => {
  const currency = (process.env.CURRENCY || 'INR').toLowerCase()

  const session = await stripeInstance.checkout.sessions.create({
    ui_mode: 'embedded',
    return_url: `${origin}/payment/success/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: courseTitle },
          unit_amount: Math.floor(amount) * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: { purchaseId: purchaseId.toString() },
  })

  return { clientSecret: session.client_secret }
}

export { stripeInstance }
