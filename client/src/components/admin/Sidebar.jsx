import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Video, Users, DollarSign, FileText } from 'lucide-react'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'Courses',
    path: '/admin/courses',
    icon: <Video className="w-5 h-5" />,
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Purchases',
    path: '/admin/purchases',
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    name: 'Applications',
    path: '/admin/educator-applications',
    icon: <FileText className="w-5 h-5" />,
  },
]

const Sidebar = () => {
  const { isAdmin } = useContext(AppContext)

  if (!isAdmin) return null

  return (
    <aside className="md:w-56 w-16 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-56px)] bg-white dark:bg-gray-900 flex flex-col py-4 shrink-0 transition-colors duration-200">
      <nav className="flex flex-col gap-1 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all group
              ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`shrink-0 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                >
                  {item.icon}
                </span>
                <span
                  className={`hidden md:block text-sm font-medium truncate ${isActive ? 'text-indigo-700 dark:text-indigo-300' : ''}`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <span className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
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
