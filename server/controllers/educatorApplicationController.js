import { clerkClient } from '@clerk/express'
import EducatorApplication from '../models/EducatorApplication.js'

// New educator application
export const submitApplication = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { professionalTitle, bio, expertise, linkedinUrl } = req.body

    if (!professionalTitle || !bio || !expertise || expertise.length === 0) {
      return res.json({ success: false, message: 'Please fill in all required fields.' })
    }

    // Check for an existing non-rejected application
    const existing = await EducatorApplication.findOne({ userId })
    if (existing && existing.status === 'pending') {
      return res.json({ success: false, message: 'You already have a pending application.' })
    }
    if (existing && existing.status === 'approved') {
      return res.json({ success: false, message: 'Your application has already been approved.' })
    }

    // If rejected, allow re-application by updating the existing document
    if (existing && existing.status === 'rejected') {
      existing.professionalTitle = professionalTitle
      existing.bio = bio
      existing.expertise = expertise
      existing.linkedinUrl = linkedinUrl || ''
      existing.status = 'pending'
      existing.rejectionReason = ''
      await existing.save()
      return res.json({ success: true, message: 'Application resubmitted successfully.' })
    }

    await EducatorApplication.create({
      userId,
      professionalTitle,
      bio,
      expertise,
      linkedinUrl: linkedinUrl || '',
    })

    res.json({
      success: true,
      message: 'Application submitted successfully. We will review it shortly.',
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get the current user's application status
export const getApplicationStatus = async (req, res) => {
  try {
    const userId = req.auth.userId
    const application = await EducatorApplication.findOne({ userId })

    res.json({ success: true, application: application || null })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// [Admin] List all applications, optionally filtered by status
export const listApplications = async (req, res) => {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const applications = await EducatorApplication.find(filter).sort({ createdAt: -1 })

    res.json({ success: true, applications })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// [Admin] Approve an application and grant educator role via Clerk
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params
    const application = await EducatorApplication.findById(id)

    if (!application) {
      return res.json({ success: false, message: 'Application not found.' })
    }

    application.status = 'approved'
    application.rejectionReason = ''
    await application.save()

    await clerkClient.users.updateUserMetadata(application.userId, {
      publicMetadata: { role: 'educator' },
    })

    res.json({ success: true, message: 'Application approved. Educator role granted.' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// [Admin] Reject an application with an optional reason
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    const application = await EducatorApplication.findById(id)

    if (!application) {
      return res.json({ success: false, message: 'Application not found.' })
    }

    application.status = 'rejected'
    application.rejectionReason = reason || ''
    await application.save()

    res.json({ success: true, message: 'Application rejected.' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
