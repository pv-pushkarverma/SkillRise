import { useContext, useEffect, useState } from 'react'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'

const StudentsEnrolled = () => {

  const { backendUrl, getToken, isEducator } = useContext(AppContext) 
  const [ enrolledStudents, setEnrolledStudents ] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {headers: { Authorization: `Bearer ${token}`}})

      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(isEducator){
      fetchEnrolledStudents()
    }
  },[isEducator])

  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col md:p-8 md:pb-6 p-4 pt-6'>
      
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm'>
        <table className='table-fixed md:table-auto w-full overflow-hidden pb-4'>

          <thead className='text-gray-900 border-b border-gray-200 text-xs md:text-sm text-left bg-gray-50/60'>

            <tr>
              <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell w-10'>#</th>
              <th className='px-4 py-3 font-semibold'>Student</th>
              <th className='px-4 py-3 font-semibold'>Course</th>
              <th className='px-4 py-3 font-semibold'>Date</th>
            </tr>
          </thead>

          <tbody className='text-xs md:text-sm text-gray-600'>
            {enrolledStudents.map((item,index) => (

              <tr key={index} className='border-b border-gray-500/20'>

                <td className='px-4 py-3 text-center hidden sm:table-cell'>{ index + 1}</td>

                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img src={item.student.imageUrl} alt='' className='w-8 h-8 rounded-full ring-1 ring-gray-200'/>
                  <span className='truncate font-medium text-gray-900'>{item.student.name}</span>
                </td>

                <td className='px-4 py-3 truncate text-gray-700'>{item.courseTitle}</td>

                <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  ) : <Loading />
}

export default StudentsEnrolled
