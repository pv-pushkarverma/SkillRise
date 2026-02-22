import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import ReactPlayer from 'react-player'
import axios from 'axios'
import { toast } from 'react-toastify'
import MarkdownRenderer from '../../components/chatbot/MarkDownRenderer'

const CourseDetails = () => {
  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    backendUrl,
    userData,
    navigate,
  } = useContext(AppContext)

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      if (data.success) setCourseData(data.courseData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const enrollCourse = () => {
    if (!userData) return toast.warn('Login to Enroll')
    if (isAlreadyEnrolled) return navigate('/player/' + courseData._id)
    navigate('/checkout/' + courseData._id)
  }

  useEffect(() => {
    fetchCourseData()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  if (!courseData) return <Loading />

  const discountedPrice = (
    courseData.coursePrice -
    (courseData.discount * courseData.coursePrice) / 100
  ).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero strip — description left, purchase card right */}
      <div className="bg-gradient-to-b from-teal-50 to-gray-50 dark:from-gray-900 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-10">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-400 mb-6">
            <span
              onClick={() => navigate('/')}
              className="text-teal-600 cursor-pointer hover:underline"
            >
              Home
            </span>
            <span className="mx-1.5">/</span>
            <span
              onClick={() => navigate('/course-list')}
              className="text-teal-600 cursor-pointer hover:underline"
            >
              Explore
            </span>
            <span className="mx-1.5">/</span>
            <span className="text-gray-700 dark:text-gray-300">{courseData.courseTitle}</span>
          </p>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: title + description + meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{courseData.courseTitle}</h1>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <MarkdownRenderer>{courseData.courseDescription}</MarkdownRenderer>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">{calculateRating(courseData)}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(calculateRating(courseData))
                          ? assets.star
                          : assets.star_blank
                      }
                      alt=""
                      className="w-3.5 h-3.5"
                    />
                  ))}
                </div>
                <span className="text-teal-600">
                  ({courseData.courseRatings.length}{' '}
                  {courseData.courseRatings.length === 1 ? 'rating' : 'ratings'})
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {courseData.enrolledStudents.length}{' '}
                  {courseData.enrolledStudents.length === 1 ? 'student' : 'students'}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                By <span className="text-teal-600 font-medium">{courseData.educator.name}</span>
              </p>
            </div>

            {/* Right: purchase card */}
            <div className="lg:sticky lg:top-24 w-full lg:w-80 xl:w-96 shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {playerData ? (
                  <div className="w-full aspect-video">
                    <ReactPlayer
                      url={playerData.videoId}
                      playing
                      controls
                      width="100%"
                      height="100%"
                    />
                  </div>
                ) : (
                  <img
                    src={courseData.courseThumbnail}
                    alt=""
                    className="w-full aspect-video object-cover"
                  />
                )}

                <div className="p-5">
                  {!isAlreadyEnrolled && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          className="w-3.5 opacity-70"
                          src={assets.time_left_clock_icon}
                          alt=""
                        />
                        <p className="text-sm text-red-500">
                          <span className="font-medium">5 days</span> left at this price
                        </p>
                      </div>
                      <div className="flex items-baseline gap-2.5 mb-4">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{discountedPrice}</p>
                        <p className="text-gray-400 line-through text-sm">
                          ₹{courseData.coursePrice}
                        </p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                          {courseData.discount}% off
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-5">
                    <div className="flex items-center gap-1.5">
                      <img src={assets.star} alt="" className="w-3.5 h-3.5" />
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {calculateRating(courseData)}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-600" />
                    <div className="flex items-center gap-1.5">
                      <img src={assets.time_clock_icon} alt="" className="w-3.5 h-3.5" />
                      <span>{calculateCourseDuration(courseData)}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-600" />
                    <div className="flex items-center gap-1.5">
                      <img src={assets.lesson_icon} alt="" className="w-3.5 h-3.5" />
                      <span>{calculateNoOfLectures(courseData)} lessons</span>
                    </div>
                  </div>

                  <button
                    onClick={enrollCourse}
                    className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition text-sm"
                  >
                    {isAlreadyEnrolled ? 'Resume Learning' : 'Enrol Now'}
                  </button>

                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">What's included</p>
                    <ul className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {[
                        'Lifetime access with free updates',
                        'Step-by-step, hands-on project guidance',
                        'Downloadable resources and source code',
                        'Quizzes to test your knowledge',
                        'Certificate of completion',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-teal-500 font-bold mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course structure */}
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Structure</h2>
        <div className="flex flex-col gap-2 max-w-3xl">
          {courseData.courseContent.map((chapter, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    className={`w-4 h-4 transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                    src={assets.down_arrow_icon}
                    alt=""
                  />
                  <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{chapter.chapterTitle}</p>
                </div>
                <p className="text-xs text-gray-400 shrink-0 ml-4">
                  {chapter.chapterContent.length} lectures · {calculateChapterTime(chapter)}
                </p>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex flex-col">
                  {chapter.chapterContent.map((lecture, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img
                          src={assets.play_icon}
                          alt=""
                          className="w-3.5 h-3.5 shrink-0 opacity-50"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                          {lecture.lectureTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        {lecture.isPreviewFree && (
                          <button
                            onClick={() =>
                              setPlayerData({
                                videoId: lecture.lectureUrl,
                              })
                            }
                            className="text-xs text-teal-600 font-medium hover:text-teal-700 transition"
                          >
                            Preview
                          </button>
                        )}
                        <span className="text-xs text-gray-400">
                          {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                            units: ['h', 'm'],
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CourseDetails
