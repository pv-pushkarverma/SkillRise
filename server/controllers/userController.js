/* eslint-disable no-unused-vars */
import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'
import User from '../models/User.js'
import CourseProgress from '../models/CourseProgress.js'
import Certificate from '../models/Certificate.js'
import {
  createOrder as razorpayCreateOrder,
  verifyPayment as razorpayVerify,
} from '../services/payments/razorpay.service.js'
import { completePurchase } from '../services/payments/order.service.js'
import { generateCertificateHtml } from '../utils/generateCertificateHtml.js'
import { generatePdfBuffer } from '../utils/generatePdf.js'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { ca } from 'zod/v4/locales'
import { v2 as cloudinary } from 'cloudinary'

// Zod schemas — request bodies
const PurchaseCourseBodySchema = z.object({
  courseId: z.string().min(1),
})

const UpdateProgressBodySchema = z.object({
  courseId: z.string().min(1),
  lectureId: z.string().min(1),
})

const GetProgressBodySchema = z.object({
  courseId: z.string().min(1),
})

const AddRatingBodySchema = z.object({
  courseId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
})

const VerifyRazorpayBodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  purchaseId: z.string().min(1),
})

const uploadPdfBuffer = async (buffer, publicId) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'skillrise/certificates',
        public_id: publicId,
        resource_type: 'raw',
        format: 'pdf',
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    const pdfChunk = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
    stream.end(pdfChunk)
  })

const getBackendPublicUrl = () =>
  (
    process.env.BACKEND_PUBLIC_URL ||
    process.env.VITE_BACKEND_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')

const ensureCertificate = async ({ userId, courseId, courseTitle, studentName }) => {
  const existing = await Certificate.findOne({ userId, courseId })
  if (existing) return { certificate: existing, created: false }

  const certificateId = uuidv4()
  const issuedAt = new Date().toLocaleDateString()
  const verificationUrl = `${getBackendPublicUrl()}/api/certificate/verify/${encodeURIComponent(certificateId)}`

  const certificateHtml = generateCertificateHtml({
    studentName,
    courseTitle,
    certificateId,
    issuedAt,
    verificationUrl,
  })

  const pdfBuffer = await generatePdfBuffer(certificateHtml)
  const uploadResult = await uploadPdfBuffer(
    pdfBuffer,
    `${courseId}-${userId}-${certificateId.replace(/-/g, '')}`
  )

  const certificate = await Certificate.create({
    userId,
    courseId,
    certificateId,
    pdfUrl: uploadResult.secure_url,
    issuedAt: new Date(),
  })

  return { certificate, created: true }
}

//Get User Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId
    const user = await User.findById(userId).select('_id name email imageUrl enrolledCourses')

    if (!user) {
      return res.json({
        success: false,
        message: 'User Not Found',
      })
    }

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}

//Get User Enrolled Courses
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId

    const userData = await User.findById(userId).populate({
      path: 'enrolledCourses',
      select: '-enrolledStudents',
    })

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const transformedCourses = userData.enrolledCourses.map((course) => {
      const userRatingObj = course.courseRatings?.find(
        (r) => r.userId.toString() === userId.toString()
      )

      return {
        _id: course._id,
        title: course.courseTitle,
        thumbnail: course.courseThumbnail,
        price: course.coursePrice,
        educator: course.educatorId,
        totalLectures: course.totalLectures,
        totalDurationMinutes: course.totalDurationMinutes,
        userRating: userRatingObj ? userRatingObj.rating : null,
      }
    })

    res.json({
      success: true,
      enrolledCourses: transformedCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}

//Get Full Course Data for Enrolled Course
export const getEnrolledCourseData = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { courseId } = req.params

    const courseData = await Course.findOne({
      _id: courseId,
      enrolledStudents: userId,
    })
      .populate({ path: 'educatorId', select: 'name imageUrl' })
      .lean()

    if (!courseData) {
      return res.status(403).json({
        success: false,
        message: 'Access denied or course not found',
      })
    }

    const userRatingObj = courseData.courseRatings?.find((r) => r.userId === userId)

    const userRating = userRatingObj ? userRatingObj.rating : null

    res.json({
      success: true,
      courseData,
      userRating,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}

//Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId

    const bodyResult = UpdateProgressBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { courseId, lectureId } = bodyResult.data

    const progressData = await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      {
        $addToSet: { lectureCompleted: lectureId },
      },
      {
        new: true,
        upsert: true,
      }
    )

    const course = await Course.findById(courseId).select(
      'courseTitle totalLectures courseContent enrolledStudents'
    )
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    const isEnrolled = course.enrolledStudents.some((studentId) => studentId === userId)
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'Course not purchased' })
    }

    const totalLectures = course.totalLectures
    const completedCount = progressData.lectureCompleted.length
    const isCourseCompleted = totalLectures > 0 && completedCount >= totalLectures
    let certificateAvailable = false

    if (isCourseCompleted) {
      if (!progressData.completed) {
        progressData.completed = true
        await progressData.save()
      }

      const user = await User.findById(userId).select('name')
      if (user) {
        const certResult = await ensureCertificate({
          userId,
          courseId,
          courseTitle: course.courseTitle,
          studentName: user.name,
        })
        certificateAvailable = Boolean(certResult.certificate?.pdfUrl)
      }
    }

    res.json({
      success: true,
      message: 'Progress Updated',
      isCourseCompleted,
      certificateAvailable,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}

//Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId

    const bodyResult = GetProgressBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { courseId } = bodyResult.data

    const progressData = await CourseProgress.findOne({ userId, courseId })

    res.json({
      success: true,
      progressData,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}

// Get existing certificate for completed course
export const getCertificate = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { courseId } = req.params

    const course = await Course.findById(courseId).select(
      'courseTitle totalLectures courseContent enrolledStudents'
    )
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    const isEnrolled = course.enrolledStudents.some((studentId) => studentId === userId)
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: 'Course not purchased' })
    }

    const progress = await CourseProgress.findOne({ userId, courseId })
    const totalLectures = course.totalLectures

    if (!progress || totalLectures === 0 || progress.lectureCompleted.length < totalLectures) {
      return res.status(404).json({ success: false, message: 'Certificate not available yet' })
    }

    if (!progress.completed) {
      progress.completed = true
      await progress.save()
    }

    let certificate = await Certificate.findOne({ userId, courseId })

    // Fallback self-heal: if the record was deleted after completion,
    // regenerate the certificate on demand.
    if (!certificate) {
      const user = await User.findById(userId).select('name')
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      const certResult = await ensureCertificate({
        userId,
        courseId,
        courseTitle: course.courseTitle,
        studentName: user.name,
      })
      certificate = certResult.certificate
    }

    return res.json({
      success: true,
      message: 'Certificate fetched successfully',
      pdfUrl: certificate.pdfUrl,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// Public endpoint for QR verification (no auth required)
export const verifyCertificatePublic = async (req, res) => {
  try {
    const { certificateId } = req.params

    const certificate = await Certificate.findOne({ certificateId }).lean()
    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Certificate not found',
      })
    }

    const [user, course] = await Promise.all([
      User.findById(certificate.userId).select('name').lean(),
      Course.findById(certificate.courseId).select('courseTitle').lean(),
    ])

    return res.json({
      success: true,
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: user?.name || 'Unknown',
        courseTitle: course?.courseTitle || 'Unknown',
        completionDate: certificate.issuedAt,
        issuedAt: certificate.issuedAt,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, valid: false, message: 'Internal server error' })
  }
}

//Add Ratings
export const addUserRating = async (req, res) => {
  const userId = req.auth.userId

  const bodyResult = AddRatingBodySchema.safeParse(req.body)
  if (!bodyResult.success) {
    return res.status(400).json({ success: false, message: 'Invalid Details' })
  }
  const { courseId, rating } = bodyResult.data

  try {
    const course = await Course.findById(courseId)

    if (!course) {
      return res.json({
        success: false,
        message: 'Course not found.',
      })
    }

    const user = await User.findById(userId)

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: 'Course not purchased.',
      })
    }

    const existingRatingIndex = course.courseRatings.findIndex((r) => r.userId === userId)

    if (existingRatingIndex > -1) {
      // User updating existing rating
      const oldRating = course.courseRatings[existingRatingIndex].rating

      course.courseRatings[existingRatingIndex].rating = rating

      // Recalculate average without changing total count
      const totalSum = course.averageRating * course.totalRatings - oldRating + rating

      course.averageRating = totalSum / course.totalRatings
    } else {
      // New rating
      course.courseRatings.push({ userId, rating })

      const totalSum = course.averageRating * course.totalRatings + rating

      course.totalRatings += 1
      course.averageRating = totalSum / course.totalRatings
    }

    // Optional: round to 1 decimal place
    course.averageRating = Number(course.averageRating.toFixed(1))

    await course.save()

    return res.json({
      success: true,
      message: 'Rating Added',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}

//Course Purchase
export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.auth.userId

    const bodyResult = PurchaseCourseBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { courseId } = bodyResult.data

    const [userData, courseData] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId),
    ])

    if (!userData || !courseData) {
      return res.json({ success: false, message: 'Data Not Found' })
    }

    const amount = parseFloat(
      (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)
    )

    // Step 1: Create a Purchase record immediately (status: 'created').
    // This acts as a soft reservation before the user pays — both the
    // synchronous verify endpoint and the Razorpay webhook reference it by ID.
    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
      currency: process.env.CURRENCY || 'INR',
      status: 'created',
    })

    // Step 2: Create a Razorpay order and get back orderId + keyId.
    // The orderId is shown to the Razorpay modal and later verified in /verify-razorpay.
    // If this fails, we clean up the Purchase record in the catch block below
    // so it doesn't sit as an orphaned 'created' doc in the DB.
    let orderId, keyId
    try {
      ;({ orderId, keyId } = await razorpayCreateOrder({
        purchaseId: newPurchase._id,
        amount,
        courseTitle: courseData.courseTitle,
      }))
    } catch (razorpayError) {
      // Razorpay call failed — delete the Purchase we just created to keep the DB clean
      await Purchase.findByIdAndDelete(newPurchase._id).exec()
      throw razorpayError
    }

    res.json({ success: true, purchaseId: newPurchase._id.toString(), orderId, keyId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

// Verify Razorpay payment signature and complete the purchase (enrollment)
// Acts as primary completion path for local dev; webhook is fallback in production
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const bodyResult = VerifyRazorpayBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseId } =
      bodyResult.data

    const isValid = razorpayVerify({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    if (!isValid) {
      return res.json({ success: false, message: 'Invalid payment signature' })
    }

    // Verify the purchaseId belongs to this user and matches the orderId that was signed.
    // Without this, a valid signature for Order A could be used to complete a different purchase (Order B).
    const purchase = await Purchase.findById(purchaseId)
    if (
      !purchase ||
      purchase.userId !== req.auth.userId ||
      purchase.providerOrderId !== razorpay_order_id
    ) {
      return res.status(403).json({ success: false, message: 'Purchase verification failed' })
    }

    if (purchase.status === 'completed') {
      return res.status(409).json({ success: false, message: 'Purchase already completed' })
    }

    await completePurchase(purchaseId, razorpay_payment_id)
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}
