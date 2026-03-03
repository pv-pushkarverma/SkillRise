import Course from '../models/Course.js'

//Get All Courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(['-courseContent', '-courseRatings', '-enrolledStudents'])
      .populate({ path: 'educatorId', select: 'name imageUrl' })

    const safeCourses = courses.map((course) => {
      const obj = course.toObject()
      return obj
    })

    res.json({
      success: true,
      courses: safeCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}

//Get Course by Id
export const getCourseById = async (req, res) => {
  const { id } = req.params

  try {
    const courseData = await Course.findById(id)
      .select(['-courseRatings', '-enrolledStudents'])
      .populate({
        path: 'educatorId',
        select: 'name imageUrl',
      })

    if (!courseData) return res.json({ success: false, message: 'Course not found' })

    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = ''
        }
      })
    })

    res.json({
      success: true,
      courseData,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    })
  }
}
