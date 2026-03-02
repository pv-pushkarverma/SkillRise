import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon, User } from 'lucide-react'

const Navbar = () => {
  const { user } = useUser()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-10 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={isDark ? logoDark : logoLight}
            alt="Logo"
            className="w-32 lg:w-40 cursor-pointer"
          />
          <span className="hidden sm:inline text-xs font-medium tracking-wide px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800">
            Educator dashboard
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <p className="hidden sm:block">
            Hi,{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {user ? user.fullName : 'Creator'}
            </span>
          </p>
          {user && <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? <UserButton /> : <User className="w-7 h-7 text-gray-400 dark:text-gray-500" />}
        </div>
      </div>
    </header>
  )
}

export default Navbar
