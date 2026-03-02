import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import { Badge } from '../ui/badge'

const CourseCard = ({ course }) => {
  const { calculateRating } = useContext(AppContext)

  const rating = calculateRating(course)
  const educatorName =
    (course && typeof course.educatorId === 'object' && course.educatorId?.name) ||
    course?.educatorName ||
    (typeof course?.educatorId === 'string' ? 'Educator' : null) ||
    'Unknown educator'

  const price =
    typeof course?.coursePrice === 'number' ? course.coursePrice : Number(course?.coursePrice ?? 0)

  const fullStars = Math.floor(rating)

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

        <div className="flex items-center gap-1.5 mt-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{rating}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5"
                fill={i < fullStars ? '#f59e0b' : 'none'}
                stroke={i < fullStars ? '#f59e0b' : '#d1d5db'}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ({course.courseRatings.length})
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            ₹ {Number.isFinite(price) ? price.toFixed(2) : '0.00'}
          </p>
          <Badge>View details</Badge>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
