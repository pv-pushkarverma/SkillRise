import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {
  const { calculateRating } = useContext(AppContext)

  const educatorName =
    (course && typeof course.educator === 'object' && course.educator?.name) ||
    course?.educatorName ||
    (typeof course?.educator === 'string' ? 'Educator' : null) ||
    'Unknown educator'

  const price =
    typeof course?.coursePrice === 'number' ? course.coursePrice : Number(course?.coursePrice ?? 0)

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className="group border border-gray-200 dark:border-gray-700 overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition will-change-transform"
    >
      <div className="relative">
        <img className="w-full aspect-[16/9] object-cover" src={course.courseThumbnail} alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="p-4 text-left">
        <h3 className="text-[15px] leading-5 font-semibold text-gray-900 dark:text-white line-clamp-2">
          {course.courseTitle}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{educatorName}</p>

        <div className="flex items-center space-x-2 mt-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{calculateRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt=""
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">({course.courseRatings.length})</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            ₹ {Number.isFinite(price) ? price.toFixed(2) : '0.00'}
          </p>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
            View details
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
