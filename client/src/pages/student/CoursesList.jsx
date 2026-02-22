import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
]

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext)
  const { input } = useParams()

  const [filteredCourse, setFilteredCourse] = useState([])
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      let courses = allCourses.slice()

      if (input) {
        courses = courses.filter((c) => c.courseTitle.toLowerCase().includes(input.toLowerCase()))
      }

      if (sortBy === 'popular') {
        courses = [...courses].sort(
          (a, b) => (b.courseRatings?.length || 0) - (a.courseRatings?.length || 0)
        )
      } else if (sortBy === 'price-asc') {
        courses = [...courses].sort(
          (a, b) => (Number(a.coursePrice) || 0) - (Number(b.coursePrice) || 0)
        )
      } else if (sortBy === 'price-desc') {
        courses = [...courses].sort(
          (a, b) => (Number(b.coursePrice) || 0) - (Number(a.coursePrice) || 0)
        )
      }

      setFilteredCourse(courses)
    }
  }, [allCourses, input, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-3">
            <span
              className="text-teal-600 cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Home
            </span>
            <span className="mx-1.5">/</span>
            <span className="text-gray-700 dark:text-gray-300">Explore</span>
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Discover the right course to level up your skills</p>
        </div>

        {/* Search bar + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <SearchBar data={input} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-4 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:border-teal-400 transition cursor-pointer shrink-0"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Result count + active search pill */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-100">{filteredCourse.length}</span>
            &nbsp;{filteredCourse.length === 1 ? 'course' : 'courses'}
            {input ? ` matching "${input}"` : ' available'}
          </p>
          {input && (
            <button
              type="button"
              onClick={() => navigate('/course-list')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <img src={assets.cross_icon} alt="clear" className="w-2.5 h-2.5 opacity-60" />
              Clear search
            </button>
          )}
        </div>

        {/* Course grid or empty state */}
        {filteredCourse.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">No courses found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              {input
                ? `We couldn't find any courses matching "${input}". Try a different search term.`
                : 'No courses are available right now. Check back soon.'}
            </p>
            {input && (
              <button
                onClick={() => navigate('/course-list')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
              >
                View all courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CoursesList
