const CoursesTab = ({
  enrolledCourses,
  progressArray,
  coursesLoading,
  inProgressCount,
  completedCount,
  calculateCourseDuration,
  navigate,
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Enrolled</p>
        <p className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</p>
        <p className="text-sm text-gray-500 mt-1">total courses</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
          In Progress
        </p>
        <p className="text-3xl font-bold text-gray-900">{inProgressCount}</p>
        <p className="text-sm text-gray-500 mt-1">active courses</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
          Completed
        </p>
        <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
        <p className="text-sm text-gray-500 mt-1">finished courses</p>
      </div>
    </div>

    {enrolledCourses.length === 0 ? (
      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
        <div className="text-5xl mb-4">🎓</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No courses yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Enroll in a course to start tracking your progress here.
        </p>
        <button
          onClick={() => navigate('/course-list')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Browse courses
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrolledCourses.map((course, idx) => {
          const prog = progressArray[idx]
          const total = prog?.totalLectures || 0
          const completed = prog?.lectureCompleted || 0
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0
          const isDone = pct === 100

          return (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <img
                src={course.courseThumbnail}
                alt=""
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-3 flex-1">
                  {course.courseTitle}
                </h3>

                {coursesLoading || !prog ? (
                  <div className="h-1.5 bg-gray-100 rounded-full mb-4 animate-pulse" />
                ) : (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>
                        {completed} / {total} lectures
                      </span>
                      <span className="font-semibold text-gray-700">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isDone ? 'bg-teal-500' : 'bg-teal-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{calculateCourseDuration(course)}</span>
                  <div className="flex items-center gap-2">
                    {isDone && (
                      <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full font-medium">
                        Done
                      </span>
                    )}
                    <button
                      onClick={() => navigate('/player/' + course._id)}
                      className="px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition font-medium"
                    >
                      {isDone ? 'Review' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )}
  </>
)

export default CoursesTab
