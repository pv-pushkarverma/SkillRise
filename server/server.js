import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, razorpayWebhooks } from './controllers/webhooks.js'
import { verifyCertificatePublic } from './controllers/userController.js'
import educatorRouter from './routes/educatorRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import communityRouter from './routes/communityRoutes.js'
import quizRouter from './routes/quizRoutes.js'
import { rateLimit, ipKeyGenerator } from 'express-rate-limit'

const app = express()

//Connect to Database
await connectDB()
await connectCloudinary()

//Global Middlewares
app.use(helmet())
if (!process.env.FRONTEND_URL && process.env.NODE_ENV === 'production') {
  throw new Error('FRONTEND_URL env var is required in production')
}
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(clerkMiddleware())

app.post('/razorpay', express.raw({ type: 'application/json' }), razorpayWebhooks)

// Razorpay needs raw body for webhook signature verification, so keep this before express.json()
app.use(express.json())

// ─── Rate Limiter Factory ────────────────────────────────────────────────────
// Instead of copy-pasting the same config 6 times, we use a factory function.
// It takes only what changes between limiters (windowMs, limit, message) and
// fills in the shared defaults (keyGenerator, headers).
const makeLimiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    // Track by userId when authenticated, fall back to IP for guests.
    // This means one user can't bypass the limit by switching IPs.
    keyGenerator: (req) => req.auth?.userId || ipKeyGenerator(req),
    message: { success: false, message },
    standardHeaders: true, // sends standard RateLimit-* headers so clients know when to retry
    legacyHeaders: false, // don't send old X-RateLimit-* headers (redundant)
  })

// AI chat — 30 req / 10 min
// Chatbot is the most-used AI feature so the limit is generous.
const aiChatLimiter = makeLimiter(
  10 * 60 * 1000,
  30,
  'Too many requests. Please wait a moment before sending another message.'
)

// Payment — 10 req / 15 min
// Tight limit. A real user needs at most 1-2 attempts per purchase.
// Anything more is likely a fraud attempt or broken client retrying.
const paymentLimiter = makeLimiter(
  15 * 60 * 1000,
  10,
  'Too many payment attempts. Please try again later.'
)

// AI generation (quiz generate + roadmap) — 10 req / hour
// These call the AI API and are expensive. A user rarely needs more than
// a few generations per hour. Tighter window prevents API cost abuse.
const aiGenerationLimiter = makeLimiter(
  60 * 60 * 1000,
  10,
  'Too many generation requests. Please try again later.'
)

// Quiz submit — 30 req / 10 min
// Prevents brute-forcing quiz answers by submitting many combinations rapidly.
const quizSubmitLimiter = makeLimiter(
  10 * 60 * 1000,
  30,
  'Too many quiz submissions. Please wait before trying again.'
)

// Community write actions (posts + replies) — 20 req / 10 min
// Prevents spam flooding. Read actions are not limited here.
const communityWriteLimiter = makeLimiter(
  10 * 60 * 1000,
  20,
  'Too many community actions. Please slow down.'
)

// Admin panel — 100 req / 15 min
// Extra safety layer even though admin routes are already role-protected.
// Limits damage if an admin token is compromised.
const adminLimiter = makeLimiter(
  15 * 60 * 1000,
  100,
  'Too many admin requests. Please try again later.'
)

//Routes
app.get('/', (_req, res) => res.send('API Working'))
app.post('/clerk', clerkWebhooks)
app.get('/api/certificate/verify/:certificateId', verifyCertificatePublic)

// Each limiter is applied to its specific path BEFORE the router mounts.
// Express runs middleware in order — so the limiter runs first, and only
// calls next() if the limit hasn't been hit. The router then handles the request.
// Applying to a sub-path (e.g. /api/user/purchase) is more precise than
// applying to the whole router, so unrelated routes aren't affected.

app.use('/api/admin', adminLimiter)
app.use('/api/admin', adminRouter)

app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)

app.use('/api/user/ai-chat', aiChatLimiter)
app.use('/api/user/purchase', paymentLimiter)
app.use('/api/user/verify-razorpay', paymentLimiter)
app.use('/api/user/generate-personal-roadmap', aiGenerationLimiter)
app.use('/api/user/generate-custom-roadmap', aiGenerationLimiter)
app.use('/api/user', userRouter)

// POST-only community spam protection — applied before the community router.
// app.post() here doesn't create a handler; it just adds the limiter as
// middleware for POST requests on those paths, then passes to communityRouter.
app.post('/api/community/posts', communityWriteLimiter)
app.post('/api/community/posts/:postId/replies', communityWriteLimiter)
app.use('/api/community', communityRouter)

app.use('/api/quiz/submit', quizSubmitLimiter)
app.use('/api/quiz/generate', aiGenerationLimiter)
app.use('/api/quiz', quizRouter)

// 404 — unknown route
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler — catches next(err) and unhandled throws in middleware

app.use((err, _req, res, _next) => {
  // In development, log the full error with stack trace for debugging.
  // In production, log only the message to avoid leaking internals to log aggregators.
  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  } else {
    console.error(`[Error] ${err.message}`)
  }
  res.status(500).json({ success: false, message: 'Internal server error' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`)
})
