import { clerkClient } from '@clerk/express'
import User from '../models/User.js'
import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'
import EducatorApplication from '../models/EducatorApplication.js'

export const getAdminStats = async (_req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalEducators,
      pendingApplications,
      revenueData,
      enrollmentData,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      EducatorApplication.countDocuments({ status: 'approved' }),
      EducatorApplication.countDocuments({ status: 'pending' }),
      Purchase.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Course.aggregate([
        { $project: { count: { $size: '$enrolledStudents' } } },
        { $group: { _id: null, total: { $sum: '$count' } } },
      ]),
    ])

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalEducators,
        pendingApplications,
        totalRevenue: revenueData[0]?.total || 0,
        totalEnrollments: enrollmentData[0]?.total || 0,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

export const getAdminCourses = async (_req, res) => {
  try {
    const courses = await Course.find()
      .select('courseTitle educator enrolledStudents isPublished coursePrice discount createdAt')
      .populate('educatorId', 'name email')
      .sort({ createdAt: -1 })

    const purchases = await Purchase.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$courseId', revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    ])

    const revenueMap = {}
    purchases.forEach((p) => {
      revenueMap[p._id.toString()] = { revenue: p.revenue, count: p.count }
    })

    const coursesWithStats = courses.map((c) => ({
      _id: c._id,
      courseTitle: c.courseTitle,
      educatorId: c.educatorId,
      enrolledCount: c.enrolledStudents.length,
      isPublished: c.isPublished,
      coursePrice: c.coursePrice,
      discount: c.discount,
      createdAt: c.createdAt,
      revenue: revenueMap[c._id.toString()]?.revenue || 0,
      purchases: revenueMap[c._id.toString()]?.count || 0,
    }))

    res.json({ success: true, courses: coursesWithStats })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

export const getAdminPurchases = async (req, res) => {
  try {
    const { status } = req.query
    const filter = status && status !== 'all' ? { status } : {}

    const purchases = await Purchase.find(filter)
      .select('userId courseId amount currency status createdAt')
      .populate('courseId', 'courseTitle')
      .sort({ createdAt: -1 })

    res.json({ success: true, purchases })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

export const getAdminChartData = async (_req, res) => {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const [topCourses, weeklyRevenueRaw] = await Promise.all([
      Course.find().select('courseTitle enrolledStudents').sort({ enrolledStudents: -1 }).limit(6),
      Purchase.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    const topCourseData = topCourses.map((c) => ({
      name: c.courseTitle.length > 22 ? c.courseTitle.substring(0, 22) + '…' : c.courseTitle,
      enrollments: c.enrolledStudents.length,
    }))

    const revenueByDay = {}
    weeklyRevenueRaw.forEach((d) => {
      revenueByDay[d._id] = d.revenue
    })

    const weeklyRevenue = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
      weeklyRevenue.push({ date: label, revenue: revenueByDay[key] || 0 })
    }

    res.json({ success: true, topCourseData, weeklyRevenue })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}

export const getAdminUsers = async (_req, res) => {
  try {
    const users = await User.find()
      .select('name email imageUrl enrolledCourses createdAt')
      .sort({ createdAt: -1 })

    const [clerkResponse, courseCounts] = await Promise.all([
      clerkClient.users.getUserList({ limit: 500 }),
      Course.aggregate([{ $group: { _id: '$educatorId', count: { $sum: 1 } } }]),
    ])

    const roleMap = {}
    clerkResponse.data.forEach((cu) => {
      roleMap[cu.id] = cu.publicMetadata?.role
    })

    const courseCountMap = {}
    courseCounts.forEach((c) => {
      courseCountMap[c._id] = c.count
    })

    const usersWithStats = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      imageUrl: u.imageUrl,
      enrolledCount: u.enrolledCourses.length,
      coursesCreated: courseCountMap[u._id] || 0,
      isEducator: roleMap[u._id] === 'educator',
      createdAt: u.createdAt,
    }))

    res.json({ success: true, users: usersWithStats })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
}
