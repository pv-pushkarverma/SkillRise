import Stripe from 'stripe'
import Course from '../models/Course.js'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'
import { CourseProgress } from '../models/CourseProgress.js'

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
    const userData = await User.findById(userId)

    const { courseId } = req.body
    const courseData = await Course.findById(courseId)

    if (!userData || !courseData) {
      return res.json({
        success: false,
        message: 'Data Not Found',
      })
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    }

    const newPurchase = await Purchase.create(purchaseData)

    //Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const currency = process.env.CURRENCY.toLowerCase()

    //Creating Line Items for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ]

    const session = await stripeInstance.checkout.sessions.create({
      ui_mode: 'embedded',
      return_url: `${origin}/payment/success/${courseData._id}?session_id={CHECKOUT_SESSION_ID}`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    })

    res.json({
      success: true,
      clientSecret: session.client_secret,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
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
    const { courseId, lectureId } = req.body
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

// Check Stripe session status (used by PaymentSuccess page)
export const getSessionStatus = async (req, res) => {
  try {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripeInstance.checkout.sessions.retrieve(req.query.session_id)
    res.json({ success: true, status: session.status })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
