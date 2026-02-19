import { useContext, useMemo, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)
  const [ mobileOpen, setMobileOpen ] = useState(false)

  const primaryLinks = useMemo(() => ([
    { to: '/course-list', label: 'Explore' },
    { to: '/my-enrollments', label: 'My enrollments', requiresAuth: true },
    { to: '/ai-chat', label: 'SkillRise AI', requiresAuth: true },
  ]), [])

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
    <header className='sticky top-0 z-40 backdrop-blur bg-white/75 border-b border-gray-200'>
      <div className='px-4 sm:px-10 md:px-14 lg:px-36 py-3 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <img
            onClick={() => navigate('/')}
            src={assets.logo_light}
            alt="Logo"
            className='w-32 sm:w-36 lg:w-44 cursor-pointer'
          />
        </div>

        <nav className='hidden md:flex items-center gap-6 text-sm font-medium text-gray-600'>
          {primaryLinks
            .filter(l => !l.requiresAuth || user)
            .map(l => (
              <Link key={l.to} to={l.to} className='hover:text-gray-900 transition'>
                {l.label}
              </Link>
            ))}
        </nav>

        <div className='hidden md:flex items-center gap-3'>
          {user && (
            <button
              onClick={becomeEducator}
              className='px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition'
            >
              {isEducator ? 'Educator dashboard' : 'Become educator'}
            </button>
          )}

          {user ? (
            <div className='pl-1'><UserButton /></div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className='bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition'
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className='md:hidden flex items-center gap-2'>
          {user ? <UserButton /> : (
            <button onClick={() => openSignIn()} className='p-2 rounded-lg border border-gray-200'>
              <img src={assets.user_icon} alt='' className='w-5 h-5' />
            </button>
          )}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className='p-2 rounded-lg border border-gray-200'
            aria-label='Toggle menu'
          >
            <span className='block w-5 h-0.5 bg-gray-700 mb-1' />
            <span className='block w-5 h-0.5 bg-gray-700 mb-1' />
            <span className='block w-5 h-0.5 bg-gray-700' />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className='md:hidden px-4 sm:px-10 pb-4'>
          <div className='rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
            <div className='p-3 flex flex-col gap-1 text-sm font-medium text-gray-700'>
              {primaryLinks
                .filter(l => !l.requiresAuth || user)
                .map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className='px-3 py-2 rounded-lg hover:bg-gray-50 transition'
                  >
                    {l.label}
                  </Link>
                ))}
              {user && (
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    becomeEducator()
                  }}
                  className='text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition'
                >
                  {isEducator ? 'Educator dashboard' : 'Become educator'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
