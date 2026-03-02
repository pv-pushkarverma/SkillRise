import express from 'express'
import { requireAuth } from '@clerk/express'
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
  verifyRazorpayPayment,
} from '../controllers/userController.js'
import {
  aiChatbot,
  getChatSession,
  recentAIChats,
  deleteChatSession,
} from '../controllers/chatbotController.js'
import { trackTime, getAnalytics } from '../controllers/timeTrackingController.js'
import { generatePersonalRoadmap, generateCustomRoadmap } from '../controllers/roadmapController.js'

const userRouter = express.Router()

userRouter.use(requireAuth())

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.get('/analytics', getAnalytics)
userRouter.post('/purchase', purchaseCourse)

userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)
userRouter.post('/track-time', trackTime)
userRouter.post('/generate-personal-roadmap', generatePersonalRoadmap)
userRouter.post('/generate-custom-roadmap', generateCustomRoadmap)

userRouter.post('/verify-razorpay', verifyRazorpayPayment)

userRouter.post('/ai-chat', aiChatbot)
userRouter.post('/previous-chats', recentAIChats)
userRouter.get('/chat/:sessionId', getChatSession)
userRouter.delete('/chat/:sessionId', deleteChatSession)

export default userRouter
