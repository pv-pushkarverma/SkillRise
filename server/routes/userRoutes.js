import express from 'express'
import { updateActivity, updateWatchTime, getUserProgress , addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js'
import { aiChatbot, recentAIChats } from '../controllers/chatbotController.js'

const userRouter = express.Router()

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)

userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)

userRouter.post('/ai-chat', aiChatbot)
userRouter.post('/previous-chats', recentAIChats)

// New progress tracking routes
userRouter.post("/update-activity", updateActivity)
userRouter.post("/update-watchtime", updateWatchTime)
userRouter.get("/progress/:userId", getUserProgress)

export default userRouter