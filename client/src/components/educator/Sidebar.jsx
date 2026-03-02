import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BookOpen, Users } from 'lucide-react'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/educator',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'Add Course',
    path: '/educator/add-course',
    icon: <PlusCircle className="w-5 h-5" />,
  },
  {
    name: 'My Courses',
    path: '/educator/my-courses',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: 'Students',
    path: '/educator/students-enrolled',
    icon: <Users className="w-5 h-5" />,
  },
]

const Sidebar = () => {
  const { isEducator } = useContext(AppContext)

  if (!isEducator) return null

  return (
    <aside className="md:w-56 w-16 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-56px)] bg-white dark:bg-gray-900 flex flex-col py-4 shrink-0 transition-colors duration-200">
      <nav className="flex flex-col gap-1 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/educator'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all group
              ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`shrink-0 transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                >
                  {item.icon}
                </span>
                <span
                  className={`hidden md:block text-sm font-medium truncate ${isActive ? 'text-teal-700 dark:text-teal-300' : ''}`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <span className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
