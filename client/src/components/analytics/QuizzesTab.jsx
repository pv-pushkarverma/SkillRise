const QuizzesTab = ({ quizHistory, quizLoading, navigate }) => {
  if (quizLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (quizHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
        <div className="text-5xl mb-4">🧠</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No quizzes taken yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Complete all lectures in a chapter to unlock and take its quiz.
        </p>
        <button
          onClick={() => navigate('/course-list')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Browse courses
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Attempts
          </p>
          <p className="text-3xl font-bold text-gray-900">{quizHistory.length}</p>
          <p className="text-sm text-gray-500 mt-1">total quiz attempts</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Avg Score
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(quizHistory.reduce((s, r) => s + r.percentage, 0) / quizHistory.length)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">across all attempts</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Mastered
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {quizHistory.filter((r) => r.group === 'mastered').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">chapters mastered</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">All Attempts</p>
        </div>
        <div className="divide-y divide-gray-100">
          {quizHistory.map((r) => {
            const badgeColor =
              r.group === 'mastered'
                ? 'text-teal-700 bg-teal-50 border-teal-100'
                : r.group === 'on_track'
                  ? 'text-amber-700 bg-amber-50 border-amber-100'
                  : 'text-red-700 bg-red-50 border-red-100'
            const icon = r.group === 'mastered' ? '🏆' : r.group === 'on_track' ? '🎯' : '📖'
            const label =
              r.group === 'mastered'
                ? 'Mastered'
                : r.group === 'on_track'
                  ? 'On Track'
                  : 'Needs Review'
            return (
              <div
                key={r._id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.chapterTitle}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{r.courseTitle}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-700 tabular-nums w-10 text-right">
                    {r.percentage}%
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}
                  >
                    {icon} {label}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(r.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => navigate(`/quiz/${r.courseId}/${r.chapterId}`)}
                    className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                  >
                    Retake
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default QuizzesTab
