import express from 'express'
import { protectAdmin } from '../middlewares/authMiddleware.js'
import {
  listApplications,
  approveApplication,
  rejectApplication,
} from '../controllers/educatorApplicationController.js'
import {
  getAdminStats,
  getAdminCourses,
  getAdminPurchases,
  getAdminUsers,
  getAdminChartData,
} from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.use(protectAdmin)

adminRouter.get('/stats', getAdminStats)
adminRouter.get('/chart-data', getAdminChartData)
adminRouter.get('/courses', getAdminCourses)
adminRouter.get('/purchases', getAdminPurchases)
adminRouter.get('/users', getAdminUsers)
adminRouter.get('/educator-applications', listApplications)
adminRouter.patch('/educator-applications/:id/approve', approveApplication)
adminRouter.patch('/educator-applications/:id/reject', rejectApplication)

export default adminRouter
