import express from 'express'
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
} from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleware.js'
import {
  submitApplication,
  getApplicationStatus,
} from '../controllers/educatorApplicationController.js'

const educatorRouter = express.Router()

// Educator application
educatorRouter.post('/apply', submitApplication)
educatorRouter.get('/application-status', getApplicationStatus)

// Educator-only routes
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

export default educatorRouter
