import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import communityRouter from './routes/communityRoutes.js'
import quizRouter from './routes/quizRoutes.js'
import { rateLimit } from 'express-rate-limit'

const app = express()

//Connect to Database
await connectDB()
await connectCloudinary()

//Global Middlewares
app.use(cors())
app.use(clerkMiddleware())

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

//stripe needs raw body so move this after stripe
app.use(express.json())

// Rate limiter for AI chat — 30 requests per user per 10 minutes
const aiChatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  keyGenerator: (req) => req.auth?.userId || req.ip,
  message: {
    success: false,
    message: 'Too many requests. Please wait a moment before sending another message.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

//Routes
app.get('/', (_req, res) => res.send('API Working'))
app.post('/clerk', clerkWebhooks)
app.use('/api/educator', educatorRouter)
app.use('/api/admin', adminRouter)
app.use('/api/course', courseRouter)
app.use('/api/user/ai-chat', aiChatLimiter) // must be before the user router
app.use('/api/user', userRouter)
app.use('/api/community', communityRouter)
app.use('/api/quiz', quizRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
