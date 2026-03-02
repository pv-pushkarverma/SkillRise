import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'
import User from '../models/User.js'
import CourseProgress from '../models/CourseProgress.js'
import { createOrder as razorpayCreateOrder, verifyPayment as razorpayVerify } from '../services/payments/razorpay.service.js'
import { completePurchase } from '../services/order.service.js'
import { z } from 'zod'

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
      select: '-enrolledStudents -courseRatings',
    })

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
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
      paymentProvider: 'razorpay',
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

//Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId

    const bodyResult = UpdateProgressBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { courseId, lectureId } = bodyResult.data

    const progressData = await CourseProgress.findOne({ userId, courseId })

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: 'Lecture Already Completed',
        })
      }

      progressData.lectureCompleted.push(lectureId)
      await progressData.save()
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      })
    }

    res.json({
      success: true,
      message: 'Progress Updated',
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
      course.courseRatings[existingRatingIndex].rating = rating
    } else {
      course.courseRatings.push({ userId, rating })
    }

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

// Verify Razorpay payment signature and complete the purchase (enrollment)
// Acts as primary completion path for local dev; webhook is fallback in production
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const bodyResult = VerifyRazorpayBodySchema.safeParse(req.body)
    if (!bodyResult.success) {
      return res.status(400).json({ success: false, message: 'Invalid request data' })
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseId } = bodyResult.data

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

