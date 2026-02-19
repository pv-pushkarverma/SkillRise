import { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {

  const { backendUrl, isEducator, getToken } = useContext(AppContext)

  const [ dashboardData, setDashboardData ] = useState(null)

  const fetchDashboardData = async ()=>{
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', {headers: { Authorization: `Bearer ${token}`}})

      if(data.success){
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(isEducator){
      fetchDashboardData()
    }
  },[ isEducator ])


  return dashboardData ? (
    <div className='min-h-screen flex flex-col gap-8 md:p-8 md:pb-6 p-4 pt-6'>

      <div className='space-y-6'>
        <div className='flex flex-wrap gap-5 items-stretch'>

          <div className='flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3 shadow-sm min-w-[220px]'>
            <img src={assets.patients_icon} alt='patients_icon'/>
            <div>
              <p className='text-2xl font-semibold text-gray-900'>
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className='text-sm text-gray-500'>Total enrollments</p>
            </div>
          </div>


          <div className='flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3 shadow-sm min-w-[220px]'>
            <img src={assets.appointments_icon} alt='appointments_icon'/>
            <div>
              <p className='text-2xl font-semibold text-gray-900'>
                {dashboardData.totalCourses}
              </p>
              <p className='text-sm text-gray-500'>Published courses</p>
            </div>
          </div>

          
          <div className='flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3 shadow-sm min-w-[220px]'>
            <img src={assets.earning_icon} alt='patients_icon'/>
            <div>
              <p className='text-2xl font-semibold text-gray-900'>₹
                {dashboardData.totalEarnings.toLocaleString()}
              </p>
              <p className='text-sm text-gray-500'>Total earnings</p>
            </div>
          </div>

        </div>

        <div>
          <div className='flex items-center justify-between pb-3'>
            <h2 className='text-lg font-semibold text-gray-900'>Latest enrollments</h2>
            <p className='text-xs text-gray-500'>
              Showing {dashboardData.enrolledStudentsData.length} most recent
            </p>
          </div>

          <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm'>

            <table className='table-fixed md:table-auto w-full overflow-hidden'>
              <thead className='text-gray-900 border-b border-gray-200 text-xs md:text-sm text-left bg-gray-50/60'>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell w-10'>#</th>
                  <th className='px-4 py-3 font-semibold'>Student</th>
                  <th className='px-4 py-3 font-semibold'>Course</th>
                </tr>
              </thead>

              <tbody className='text-xs md:text-sm text-gray-600'>
                { dashboardData.enrolledStudentsData.map((item,index) => (
                  <tr key={index} className='border-b border-gray-500/20'>
                    
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>{ index + 1}</td>

                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img src={item.student.imageUrl} alt='Profile' className='w-8 h-8 rounded-full ring-1 ring-gray-200'/>
                      <span className='truncate font-medium text-gray-900'>{item.student.name}</span>
                    </td>

                    <td className='px-4 py-3 truncate text-gray-700'>{item.courseTitle}</td>
                  </tr>
                ))}

              </tbody>
            </table>

          </div>

        </div>
      </div>

    </div>
  ) : <Loading />
}

export default Dashboard
