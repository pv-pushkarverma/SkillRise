import crypto from 'crypto'
import { Webhook } from 'svix'
import User from '../models/User.js'
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
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// ─── Razorpay ────────────────────────────────────────────────────────────────
// Razorpay calls this endpoint after a payment is captured on their side.
// It acts as a reliable fallback: even if the frontend's verify-razorpay call
// fails (network drop, browser close), enrollment still completes here.

export const razorpayWebhooks = async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  // req.body is a raw Buffer here (express.raw middleware), not parsed JSON.
  // Razorpay's HMAC is computed over the exact bytes they sent, so we must
  // verify before parsing — any JSON.parse would change the bytes.
  const rawBody = req.body

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
    // purchaseId was stored in Razorpay's `notes` field when the order was created.
    // This is how our internal ID survives through Razorpay's system.
    const purchaseId = payment?.notes?.purchaseId
    const paymentId = payment?.id

    if (purchaseId && paymentId) {
      await completePurchase(purchaseId, paymentId)
    }
  }

  res.json({ received: true })
}
