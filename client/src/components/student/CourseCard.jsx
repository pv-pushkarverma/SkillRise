import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({course}) => {

  const { calculateRating } = useContext(AppContext)

  return (
    <Link to={'/course/'+ course._id} onClick={()=>scrollTo(0,0)}
    className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5'>
      <img className='w-full' src={course.courseThumbnail} alt=''/>
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
        <p className='text-gray-500'>{course.educator?.name}</p>

        <div className='flex items-center space-x-2'>
          <p>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_,i)=>(<img key={i} src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5'/>))}
          </div>
          <p className='text-gray-500'>{course.courseRatings.length}</p>
        </div>

        <p className='text-base font-semibold text-gray-800'>₹ {(course.coursePrice).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard
