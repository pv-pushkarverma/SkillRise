import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate()

  const { getToken } = useAuth()
  const { user } = useUser()

  const [allCourses, setAllCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [userData, setUserData] = useState(null)
  const [applicationStatus, setApplicationStatus] = useState(null)

  // Derived from Clerk's publicMetadata — single source of truth, no stale state
  const userRole = user?.publicMetadata?.role
  const isEducator = userRole === 'educator'
  const isAdmin = userRole === 'admin'

  //Fetch Course Data
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/all')

      if (data.success) {
        setAllCourses(Array.isArray(data.courses) ? data.courses : [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //Fetch User Data
  const fetchUserData = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setUserData(data.user)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //calculate course rating
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0
    const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0)
    return Math.floor(total / course.courseRatings.length)
  }

  //Function to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    const time = chapter.chapterContent.reduce((sum, lec) => sum + lec.lectureDuration, 0)
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
  }

  //Function to calculate course duration
  const calculateCourseDuration = (course) => {
    const time = course.courseContent.reduce(
      (sum, chapter) =>
        sum + chapter.chapterContent.reduce((s, lec) => s + lec.lectureDuration, 0),
      0
    )
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
  }

  //Function to calculate number of lectures in course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0

    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length
      }
    })

    return totalLectures
  }

  //Fetch Educator Application Status
  const fetchApplicationStatus = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/application-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        setApplicationStatus(data.application)
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // non-critical, silently ignore
    }
  }

  //Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        //reverse to get latest courses first
        const list = Array.isArray(data.enrolledCourses) ? data.enrolledCourses : []
        setEnrolledCourses(list.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllCourses()
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserData()
      fetchUserEnrolledCourses()
      fetchApplicationStatus()
    }
  }, [user])

  const value = {
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    isAdmin,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    applicationStatus,
    setApplicationStatus,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
