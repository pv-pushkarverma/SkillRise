import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'

const MyCourses = () => {

  const { backendUrl, isEducator, getToken } = useContext(AppContext)

  const [ courses, setCourses ] = useState(null)

  const fetchEducatorCourses = async () =>{
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {headers: {Authorization: `Bearer ${token}`}})

      data.success && setCourses(data.courses)

    } catch (error) {
      toast.error(error.message)      
    }
  }

  useEffect(()=>{
    if(isEducator){
      fetchEducatorCourses()
    }
  },[ isEducator ])


  return courses ? (
    <div className='min-h-screen flex flex-col md:p-8 md:pb-6 p-4 pt-6'>
      
      <div className='w-full space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>My courses</h2>
          <p className='text-xs text-gray-500'>Total: {courses.length}</p>
        </div>

        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm'>
          <table className='md:table-auto table-fixed w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-200 text-xs md:text-sm text-left bg-gray-50/60'>

              <tr>
                <th className='px-4 py-3 font-semibold truncate'>Course</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Published</th>
              </tr>

            </thead>

            <tbody className='text-xs md:text-sm text-gray-600'>
              {courses.map((course) => (

                <tr key={course._id} className='border-b border-gray-500/20'>

                  <td className='md:px-4 pl2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                    <img src={course.courseThumbnail} alt='Course Image' className='w-12 h-12 rounded-md object-cover'/>
                    <span className='truncate hidden md:block font-medium text-gray-900'>{course.courseTitle}</span>
                  </td>

                  <td className='px-4 py-3'>
                    ₹{Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100)).toLocaleString()}
                  </td>

                  <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
                  <td className='px-4 py-3'>{new Date(course.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  ) : <Loading />
}

export default MyCourses
