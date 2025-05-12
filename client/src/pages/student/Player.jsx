import humanizeDuration from 'humanize-duration'
import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const Player = () => {

  const  { enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses } = useContext(AppContext)


  const { courseId } = useParams()
  const [ courseData, setCourseData ] = useState(null)
  const [ openSections, setOpenSections ] = useState({})
  const [ playerData, setPlayerData ] = useState(null)
  const [ progressData, setProgressData ] = useState(null)
  const [ initialRating, setInitialRating ] = useState(0)


  const toggleSection = (index)=>{
    setOpenSections((prev)=>(
      {...prev,[index]:!prev[index]}
    ))
  }

  const getCourseData = ()=> {
    enrolledCourses.map((course)=>{
      if(course._id === courseId ){
        setCourseData(course)
        course.courseRatings.map((item) => {
          if(item.userId === userData._id){
            setInitialRating(item.rating)
          }
        })
      }
    })
  }

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/user/update-course-progress', {courseId, lectureId}, { headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        getCourseProgress()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress', {courseId}, { headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        setProgressData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRating = async ( rating ) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/add-rating', {courseId, rating}, {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    if(enrolledCourses.length > 0){
      getCourseData()
    }
  },[enrolledCourses])

  useEffect(() => {
    getCourseProgress()
  },[])

  return courseData ? (
  <>
    <div className='p-4 sm:p-6 flex flex-col md:grid md:grid-cols-[3fr,1fr] gap-10 md:px-10'>

      {/* Player - Left on large screens */}
      <div className='md:order-1'>
        {playerData ? (
          <div>
            <div className='w-full aspect-video'>
              <ReactPlayer
                url={
                  playerData.lectureUrl.includes('youtu.be')
                    ? `https://www.youtube.com/watch?v=${playerData.lectureUrl.split('/').pop().split('?')[0]}`
                    : playerData.lectureUrl
                }
                controls
                playing
                width='100%'
                height='100%'
                config={{
                  youtube: {
                    modestbranding: 1,
                    rel: 0,
                  }
                }}
              />
            </div>

            <div className='flex justify-between items-center mt-1'>
              <p className='text-lg font-semibold'>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
              <button onClick={() => markLectureAsCompleted(playerData.lectureId)} className='text-teal-600'>
                {progressData && progressData.lectureCompleted.includes(playerData.lectureId)
                  ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 animate-fade-in'>
            <img 
              src={courseData.courseThumbnail} 
              alt='Course Thumbnail' 
              className='w-40 h-40 object-cover rounded-full shadow-md mb-4 ring-2 ring-teal-500/30'
            />
            <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>
              {courseData.courseTitle}
            </h2>
            <p className='text-sm md:text-base text-gray-600 mt-2 max-w-xs'>
              Select a lecture from the Course Structure on the right to begin watching.
            </p>
            <div className='mt-4 animate-bounce text-teal-600 text-sm'>↓ Start with a lecture</div>
          </div>
        )}
      </div>

      {/* Course Structure - Right on large screens */}
      <div className='text-gray-800 md:order-2'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>

        <div className='pt-5 space-y-4'>
          {courseData.courseContent.map((chapter, index) => (
            <div key={index} className='border border-gray-300 bg-white rounded-md shadow-sm overflow-hidden'>

              {/* Chapter Header */}
              <div
                className='flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition'
                onClick={() => toggleSection(index)}
              >
                <div className='flex items-center gap-2'>
                  <img
                    src={assets.down_arrow_icon}
                    alt='arrow icon'
                    className={`w-4 h-4 transform transition-transform duration-300 ${openSections[index] ? 'rotate-180' : ''}`}
                  />
                  <p className='font-medium text-sm md:text-base text-gray-800'>{chapter.chapterTitle}</p>
                </div>
                <p className='text-xs md:text-sm text-gray-600 whitespace-nowrap'>
                  {chapter.chapterContent.length} {chapter.chapterContent.length === 1 ? 'lecture' : 'lectures'}
                </p>
              </div>


              {/* Collapsible Lecture List */}
              <div className={`transition-all duration-300 ${openSections[index] ? 'max-h-[500px]' : 'max-h-0'} overflow-hidden`}>
                <ul className='divide-y divide-gray-200'>
                  {chapter.chapterContent.map((lecture, i) => (
                    <li key={i} className='px-5 py-3 flex flex-col md:flex-row md:items-center md:justify-between text-gray-700'>
                      <div className='flex items-start gap-4 md:max-w-[70%]'>
                        <img
                          src={progressData && progressData.lectureCompleted.includes(lecture.lectureId)
                            ? assets.teal_tick_icon : assets.play_icon}
                          alt='icon'
                          className='w-5 h-5 mt-1 mr-4'
                        />
                      </div>
                      <div className='flex flex-col md:flex-row md:justify-between w-full text-gray-800 text-sm md:text-base'>
                        <p
                          onClick={() =>
                            setPlayerData({
                              ...lecture,
                              chapter: index + 1,
                              lecture: i + 1,
                            })
                          }
                          className='cursor-pointer hover:text-teal-700 hover:underline font-medium transition-all duration-150'
                          title='Click to play this lecture'
                        >
                          {lecture.lectureTitle}
                        </p>
                        <p className='text-gray-500 md:text-right mt-1 md:mt-0'>
                          {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                        </p>
                      </div>

                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>



        <div className='flex items-center gap-2 py-3 mt-10'>
          <h1 className='text-xl font-bold'>Rate this Course:</h1>
          <Rating initialRating={initialRating} onRate={handleRating} />
        </div>
      </div>
    </div>

    <Footer />
  </>
) : <Loading />
}

export default Player
