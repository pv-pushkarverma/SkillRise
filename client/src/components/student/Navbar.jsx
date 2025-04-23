import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const isCourseListPage = location.pathname.includes('/course-list')

  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)

  const becomeEducator = async () => {
    try {
      if(isEducator){
        navigate('/educator')
        return
      }

      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 bg-cyan-200/70 border-b border border-white`}>
      <img onClick={()=> navigate('/')} src={assets.logo_light} alt="Logo" className='w-36 lg:w-56 cursor-pointer'/>
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          { user && 
            <>
                <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
        </div>
        { user ? <UserButton/> : 
          <button onClick={()=>openSignIn()} className='bg-teal-500 text-white px-5 py-2 rounded-full'>Create Account</button>
        }
      </div>

      {/*Mobile Screens*/}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
          <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          { user && 
            <>
                <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
          </div>
          {
            user ? <UserButton/> :
              <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt=''/></button>
          }
      </div>
    </div>
  )
}

export default Navbar
