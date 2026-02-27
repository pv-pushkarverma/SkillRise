import Footer from '../student/Footer'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

const QuizQuestion = ({
  quiz,
  current,
  answers,
  onSelect,
  onNext,
  onPrev,
  onSubmit,
  setCurrent,
}) => {
  const question = quiz.questions[current]
  const totalQuestions = quiz.questions.length
  const progressPct = Math.round(((current + 1) / totalQuestions) * 100)
  const answered = answers[current]
  const answeredCount = answers.filter((a) => a !== -1).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Exit quiz
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {answeredCount} / {totalQuestions} answered
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1.5">
            <span>{quiz.chapterTitle}</span>
            <span>
              Question {current + 1} of {totalQuestions}
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                i === current
                  ? 'bg-teal-600 text-white'
                  : answers[i] !== -1
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-5">
          <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
            {question.question}
          </p>

          <div className="space-y-2.5">
            {question.options.map((opt, oi) => {
              const isSelected = answered === oi
              return (
                <button
                  key={oi}
                  onClick={() => onSelect(oi)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm text-left transition-all ${
                    isSelected
                      ? 'border-teal-400 bg-teal-50 text-teal-800 font-semibold shadow-sm'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-teal-200 hover:bg-teal-50/40 dark:hover:bg-teal-900/20'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {OPTION_LABELS[oi]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPrev}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {current < totalQuestions - 1 ? (
            <button
              onClick={onNext}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default QuizQuestion
