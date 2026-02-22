import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)
  const featured = Array.isArray(allCourses) ? allCourses.slice(0, 8) : []

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Featured courses</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
              Hand‑picked courses with strong ratings and structured content. Explore, enroll, and
              start learning today.
            </p>
          </div>

          <Link
            to={'/course-list'}
            onClick={() => scrollTo(0, 0)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition w-full md:w-auto"
          >
            Browse all courses
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.length > 0
            ? featured.map((course, index) => (
                <CourseCard key={course?._id ?? index} course={course} />
              ))
            : [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 animate-pulse"
                >
                  <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-700" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mt-3" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3 mt-5" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}

export default CoursesSection
