import { formatDuration, formatDate } from '../../utils/time'
import { getIcon, getColor } from '../../utils/analyticsHelpers'

const ActivityTab = ({ analytics, activityLoading, activityError, navigate }) => {
  if (activityLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
      </div>
    )
  }

  if (activityError) {
    return (
      <div className="py-24 text-center text-red-500">
        Failed to load analytics: {activityError}
      </div>
    )
  }

  const {
    totalDuration = 0,
    pageStats = [],
    dailyStats = [],
    courseBreakdown = [],
  } = analytics || {}
  const maxPageDuration = pageStats[0]?.totalDuration || 1
  const maxDailyDuration = Math.max(...dailyStats.map((d) => d.duration), 1)
  const activeDays = dailyStats.filter((d) => d.duration > 0).length
  const topPage = pageStats[0]?.page || '—'

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Total time
          </p>
          <p className="text-3xl font-bold text-gray-900">{formatDuration(totalDuration)}</p>
          <p className="text-sm text-gray-500 mt-1">across all pages</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Active days
          </p>
          <p className="text-3xl font-bold text-gray-900">{activeDays}</p>
          <p className="text-sm text-gray-500 mt-1">of the last 7 days</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Most time spent
          </p>
          <p className="text-3xl font-bold text-gray-900 truncate">{topPage}</p>
          <p className="text-sm text-gray-500 mt-1">
            {pageStats[0] ? formatDuration(pageStats[0].totalDuration) : '—'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Time by topic</h2>
          {pageStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-400 text-sm">
                No data yet. Start browsing to see your stats.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pageStats.map(({ page, totalDuration: dur, visits }) => {
                const pct = Math.max(4, (dur / maxPageDuration) * 100)
                return (
                  <div key={page}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <span>{getIcon(page)}</span>
                        {page}
                      </span>
                      <span className="text-sm text-gray-500 tabular-nums">
                        {formatDuration(dur)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getColor(page)} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {visits} {visits === 1 ? 'session' : 'sessions'}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">Last 7 days</h2>
          {dailyStats.every((d) => d.duration === 0) ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-400 text-sm">No activity recorded this week.</p>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-1.5 h-48">
              {dailyStats.map(({ date, duration }) => {
                const heightPct = Math.max(
                  duration > 0 ? 6 : 0,
                  (duration / maxDailyDuration) * 100
                )
                const isToday = date === new Date().toISOString().split('T')[0]
                const label = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                return (
                  <div key={date} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-xs text-gray-500 tabular-nums">
                      {duration > 0 ? formatDuration(duration) : ''}
                    </span>
                    <div
                      className="w-full flex items-end justify-center"
                      style={{ height: '120px' }}
                    >
                      <div
                        className={`w-full rounded-t-md transition-all duration-700 ${isToday ? 'bg-teal-500' : 'bg-teal-200'}`}
                        style={{ height: `${heightPct}%` }}
                        title={`${formatDate(date)}: ${formatDuration(duration)}`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${isToday ? 'text-teal-600' : 'text-gray-400'}`}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>This week</span>
            <span className="font-medium text-gray-700">
              {formatDuration(dailyStats.reduce((s, d) => s + d.duration, 0))}
            </span>
          </div>
        </div>
      </div>

      {courseBreakdown.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Course breakdown</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Watch time per course · quiz time per chapter
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {courseBreakdown.map(
              ({
                courseId,
                courseTitle,
                courseThumbnail,
                learningDuration,
                learningSessions,
                totalQuizDuration,
                chapters,
              }) => (
                <div key={courseId} className="p-5">
                  <div
                    className="flex items-center gap-3 cursor-pointer group mb-4"
                    onClick={() => navigate('/player/' + courseId)}
                  >
                    {courseThumbnail && (
                      <img
                        src={courseThumbnail}
                        alt=""
                        className="w-16 h-11 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700 transition truncate">
                        {courseTitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400 mt-0.5">
                        {learningDuration > 0 && (
                          <span>
                            ▶ {formatDuration(learningDuration)} watched · {learningSessions}{' '}
                            {learningSessions === 1 ? 'session' : 'sessions'}
                          </span>
                        )}
                        {totalQuizDuration > 0 && (
                          <span>🧠 {formatDuration(totalQuizDuration)} in quizzes</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {chapters.length > 0 && (
                    <div className="ml-1 pl-4 border-l-2 border-gray-100 flex flex-col gap-3">
                      {chapters.map(({ chapterId, chapterTitle, quizDuration, quizSessions }) => {
                        const maxChapterDur = chapters[0].quizDuration || 1
                        const pct = Math.max(4, (quizDuration / maxChapterDur) * 100)
                        return (
                          <div key={chapterId}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600 truncate pr-3">
                                {chapterTitle}
                              </span>
                              <span className="text-xs font-medium text-gray-500 tabular-nums shrink-0">
                                {formatDuration(quizDuration)}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Quiz · {quizSessions} {quizSessions === 1 ? 'attempt' : 'attempts'}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {pageStats.length === 0 && (
        <div className="mt-8 bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center">
          <p className="text-teal-700 font-medium text-lg mb-1">Your analytics will appear here</p>
          <p className="text-teal-600 text-sm">
            Browse courses, watch lectures, and use SkillRise AI — your activity is tracked
            automatically.
          </p>
        </div>
      )}
    </>
  )
}

export default ActivityTab
