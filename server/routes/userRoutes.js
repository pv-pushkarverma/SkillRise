import express from 'express'
import {
  addUserRating,
  getSessionStatus,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
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

userRouter.get('/session-status', getSessionStatus)

userRouter.post('/ai-chat', aiChatbot)
userRouter.post('/previous-chats', recentAIChats)
userRouter.post('/:sessionId', getChatSession)
userRouter.delete('/chat/:sessionId', deleteChatSession)

export default userRouter
