import { useContext, useMemo, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const { navigate, isEducator } = useContext(AppContext)
  const { isDark, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const primaryLinks = useMemo(
    () => [
      { to: '/course-list', label: 'Explore' },
      { to: '/analytics', label: 'My Learning', requiresAuth: true },
      { to: '/roadmap', label: 'Roadmap', requiresAuth: true },
      { to: '/community', label: 'Community' },
      { to: '/ai-chat', label: 'SkillRise AI', requiresAuth: true },
    ],
    []
  )

  const handleEducatorButton = () => {
    if (isEducator) {
      navigate('/educator')
    } else {
      navigate('/become-educator')
    }
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/75 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            onClick={() => navigate('/')}
            src={isDark ? assets.logo : assets.logo_light}
            alt="Logo"
            className="w-32 sm:w-36 lg:w-44 cursor-pointer"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          {primaryLinks
            .filter((l) => !l.requiresAuth || user)
            .map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                {l.label}
              </Link>
            ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && (
            <button
              onClick={handleEducatorButton}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {isEducator ? 'Educator dashboard' : 'Become educator'}
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="pl-1">
              <UserButton />
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          {user ? (
            <UserButton />
          ) : (
            <button onClick={() => openSignIn()} className="p-2 rounded-lg border border-gray-200 dark:border-gray-600">
              <img src={assets.user_icon} alt="" className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-600"
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-300" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 sm:px-10 pb-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="p-3 flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              {primaryLinks
                .filter((l) => !l.requiresAuth || user)
                .map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {l.label}
                  </Link>
                ))}
              {user && (
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    handleEducatorButton()
                  }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
