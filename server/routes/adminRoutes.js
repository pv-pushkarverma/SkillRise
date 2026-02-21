import express from 'express'
import { protectAdmin } from '../middlewares/authMiddleware.js'
import {
  listApplications,
  approveApplication,
  rejectApplication,
} from '../controllers/educatorApplicationController.js'

const adminRouter = express.Router()

adminRouter.get('/educator-applications', protectAdmin, listApplications)
adminRouter.patch('/educator-applications/:id/approve', protectAdmin, approveApplication)
adminRouter.patch('/educator-applications/:id/reject', protectAdmin, rejectApplication)

export default adminRouter
