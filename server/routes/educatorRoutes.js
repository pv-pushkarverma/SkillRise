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

educatorRouter.post('/apply', submitApplication)
educatorRouter.get('/application-status', getApplicationStatus)

educatorRouter.use(protectEducator)
educatorRouter.post('/add-course', upload.single('image'), addCourse)
educatorRouter.get('/courses', getEducatorCourses)
educatorRouter.get('/dashboard', educatorDashboardData)
educatorRouter.get('/enrolled-students', getEnrolledStudentsData)

export default educatorRouter
