import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'
import User from '../models/User.js'
import CourseProgress from '../models/CourseProgress.js'
import { createOrder as paymentCreateOrder } from '../services/payments/payment.service.js'
import { verifyPayment as razorpayVerify } from '../services/payments/razorpay.service.js'
import { completePurchase } from '../services/order.service.js'

//Get User Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId
    const user = await User.findById(userId)

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
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Get User Enrolled Courses
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId
    const userData = await User.findById(userId).populate('enrolledCourses')

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Course Purchase
export const purchaseCourse = async (req, res) => {
  try {
    const { origin } = req.headers
    const userId = req.auth.userId
    const { courseId, provider = process.env.DEFAULT_PAYMENT_PROVIDER || 'stripe' } = req.body

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

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
      currency: process.env.CURRENCY || 'INR',
      paymentProvider: provider,
      status: 'created',
    })

    const providerResult = await paymentCreateOrder(provider, {
      purchaseId: newPurchase._id,
      courseId: courseData._id,
      amount,
      courseTitle: courseData.courseTitle,
      origin,
    })

    res.json({ success: true, purchaseId: newPurchase._id.toString(), ...providerResult })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

//Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { courseId, lectureId } = req.body
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
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { courseId } = req.body
    const progressData = await CourseProgress.findOne({ userId, courseId })

    res.json({
      success: true,
      progressData,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Add Ratings
export const addUserRating = async (req, res) => {
  const userId = req.auth.userId
  const { courseId, rating } = req.body

  try {
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: 'Invalid Details',
      })
    }
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
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// Verify Razorpay payment signature and complete the purchase (enrollment)
// Acts as primary completion path for local dev; webhook is fallback in production
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseId } = req.body

    const isValid = razorpayVerify({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    if (!isValid) {
      return res.json({ success: false, message: 'Invalid payment signature' })
    }

    await completePurchase(purchaseId, razorpay_payment_id)
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Check Stripe session status (used by PaymentSuccess page for Stripe flows)
export const getSessionStatus = async (req, res) => {
  try {
    const { stripeInstance } = await import('../services/payments/stripe.service.js')
    const session = await stripeInstance.checkout.sessions.retrieve(req.query.session_id)
    res.json({ success: true, status: session.status })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
