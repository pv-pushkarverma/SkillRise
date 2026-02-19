import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

  const { isEducator } = useContext(AppContext)

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon:assets.home_icon},
    { name: 'Add Course', path: '/educator/add-course', icon:assets.add_icon},
    { name: 'My Courses', path: '/educator/my-courses', icon:assets.my_course_icon},
    { name: 'Students Enrolled', path: '/educator/students-enrolled', icon:assets.person_tick_icon},
  ];

  return isEducator && (
    <aside className='md:w-64 w-16 border-r border-gray-200 min-h-[calc(100vh-56px)] text-sm py-3 bg-white'>
      <nav className='flex flex-col gap-1'>
        {menuItems.map((item)=>(
          <NavLink 
            to={item.path} 
            key={item.name} 
            end={item.path === '/educator'}
            className={({isActive})=> `
              flex items-center md:flex-row flex-col md:justify-start justify-center py-3 md:px-5 gap-3
              border-l-4
              ${isActive 
                ? 'bg-teal-50 border-teal-500 text-teal-700' 
                : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900'}
            `}
          >
            <img src={item.icon} alt='' className='w-5 h-5' />
            <p className='md:block hidden text-center font-medium'>{item.name}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
