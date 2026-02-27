import crypto from 'crypto'
import { Webhook } from 'svix'
import Stripe from 'stripe'
import User from '../models/User.js'
import Purchase from '../models/Purchase.js'
import { completePurchase } from '../services/order.service.js'

// ─── Clerk ───────────────────────────────────────────────────────────────────

export const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    await webhook.verify(JSON.stringify(req.body), {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    })

    const { data, type } = req.body

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + ' ' + data.last_name,
          imageUrl: data.image_url,
        }
        await User.create(userData)
        res.json({})
        break
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + ' ' + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break
      }

      default:
        res.json({})
    }
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// ─── Stripe ──────────────────────────────────────────────────────────────────

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      })

      const { purchaseId } = sessions.data[0].metadata
      await completePurchase(purchaseId, paymentIntent.id)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      })

      const { purchaseId } = sessions.data[0].metadata
      const purchase = await Purchase.findById(purchaseId)
      if (purchase && purchase.status !== 'completed') {
        purchase.status = 'failed'
        purchase.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed'
        await purchase.save()
      }
      break
    }

    default:
      console.warn(`Unhandled Stripe event: ${event.type}`)
  }

  res.json({ received: true })
}

// ─── Razorpay ────────────────────────────────────────────────────────────────

export const razorpayWebhooks = async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  const rawBody = req.body // Buffer from express.raw()

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  if (
    !signature ||
    !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  ) {
    return res.status(400).json({ error: 'Invalid Razorpay webhook signature' })
  }

  const event = JSON.parse(rawBody.toString())

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity
    const purchaseId = payment?.notes?.purchaseId
    const paymentId = payment?.id

    if (purchaseId && paymentId) {
      await completePurchase(purchaseId, paymentId)
    }
  }

  res.json({ received: true })
}
