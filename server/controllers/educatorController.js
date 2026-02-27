import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'
import Purchase from '../models/Purchase.js'
import User from '../models/User.js'

//Update role to Educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      },
    })

    res.json({
      success: true,
      message: 'You can publish a course now',
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body
    const imageFile = req.file
    const educatorId = req.auth.userId

    if (!imageFile) {
      return res.json({
        success: false,
        message: 'Thumbnail Not Attached',
      })
    }

    const parsedCourseData = JSON.parse(courseData)
    parsedCourseData.educatorId = educatorId

    const newCourse = await Course.create(parsedCourseData)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    newCourse.courseThumbnail = imageUpload.secure_url

    await newCourse.save()

    res.json({
      success: true,
      message: 'Course Added Succesfully',
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Get All Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educatorId = req.auth.userId
    const courses = await Course.find({ educatorId })

    res.json({
      success: true,
      courses,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const educatorId = req.auth.userId
    const courses = await Course.find({ educatorId })
    const totalCourses = courses.length

    //Get all course Ids
    const courseIds = courses.map((course) => course._id)

    //Calculate total earnings
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    })

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

    //Collect enrolled students id with course titles
    const allStudentIds = courses.flatMap((course) => course.enrolledStudents)
    const allStudents = await User.find({ _id: { $in: allStudentIds } }, 'name imageUrl')
    const studentMap = Object.fromEntries(allStudents.map((s) => [s._id.toString(), s]))

    const enrolledStudentsData = courses.flatMap((course) =>
      course.enrolledStudents
        .map((studentId) => studentMap[studentId.toString()])
        .filter(Boolean)
        .map((student) => ({ courseTitle: course.courseTitle, student }))
    )

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Get Enrolled Students data with Purchases
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educatorId = req.auth.userId
    const courses = await Course.find({ educatorId })
    const courseIds = courses.map((course) => course._id)

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle')

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }))

    res.json({
      success: true,
      enrolledStudents,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}
