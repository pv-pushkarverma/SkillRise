import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/educator',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    name: 'Add Course',
    path: '/educator/add-course',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),
  },
  {
    name: 'My Courses',
    path: '/educator/my-courses',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
      </svg>
    ),
  },
  {
    name: 'Students',
    path: '/educator/students-enrolled',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
]

const Sidebar = () => {
  const { isEducator } = useContext(AppContext)

  if (!isEducator) return null

  return (
    <aside className="md:w-56 w-16 border-r border-gray-200 min-h-[calc(100vh-56px)] bg-white flex flex-col py-4 shrink-0">
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
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`shrink-0 transition-colors ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                >
                  {item.icon}
                </span>
                <span
                  className={`hidden md:block text-sm font-medium truncate ${isActive ? 'text-teal-700' : ''}`}
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
