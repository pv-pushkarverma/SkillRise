import { useContext, useMemo, useState } from 'react'
import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'
import { Sun, Moon, User } from 'lucide-react'
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
            src={isDark ? logoDark : logoLight}
            alt="Logo"
            className="w-32 sm:w-36 lg:w-44 cursor-pointer"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          {primaryLinks
            .filter((link) => !link.requiresAuth || user)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                {link.label}
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
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
                .filter((link) => !link.requiresAuth || user)
                .map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {link.label}
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
