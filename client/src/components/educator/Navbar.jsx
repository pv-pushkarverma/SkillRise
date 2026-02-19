import { assets } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const { user } = useUser()


  return (
    <header className='sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200'>
      <div className='flex items-center justify-between px-4 md:px-8 lg:px-10 py-3'>
        <Link to='/' className='flex items-center gap-3'>
          <img src={assets.logo_light} alt='Logo' className='w-32 lg:w-40 cursor-pointer' />
          <span className='hidden sm:inline text-xs font-medium tracking-wide px-2 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100'>
            Educator dashboard
          </span>
        </Link>

        <div className='flex items-center gap-4 text-sm text-gray-600'>
          <p className='hidden sm:block'>
            Hi, <span className='font-semibold text-gray-900'>{user ? user.fullName : 'Creator'}</span>
          </p>
          {user && (
            <div className='h-6 w-px bg-gray-200 hidden sm:block' />
          )}
          {user ? (
            <UserButton />
          ) : (
            <img className='w-8 h-8 rounded-full object-cover border border-gray-200' src={assets.profile_img} alt='Profile' />
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
