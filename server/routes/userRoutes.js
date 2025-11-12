import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js'
import { aiChatbot, getChatSession, recentAIChats } from '../controllers/chatbotController.js'

const userRouter = express.Router()

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)

userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)

userRouter.post('/ai-chat', aiChatbot)
userRouter.post('/previous-chats', recentAIChats)
userRouter.post('/:sessionId', getChatSession)

export default userRouter