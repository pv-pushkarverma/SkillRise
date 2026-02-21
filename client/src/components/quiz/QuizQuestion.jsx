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
  const q = quiz.questions[current]
  const totalQ = quiz.questions.length
  const progressPct = Math.round(((current + 1) / totalQ) * 100)
  const answered = answers[current]
  const answeredCount = answers.filter((a) => a !== -1).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Exit quiz
          </button>
          <span className="text-xs text-gray-400 font-medium">
            {answeredCount} / {totalQ} answered
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>{quiz.chapterTitle}</span>
            <span>
              Question {current + 1} of {totalQ}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <p className="text-base font-semibold text-gray-900 leading-relaxed">{q.question}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, oi) => {
              const isSelected = answered === oi
              return (
                <button
                  key={oi}
                  onClick={() => onSelect(oi)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm text-left transition-all ${
                    isSelected
                      ? 'border-teal-400 bg-teal-50 text-teal-800 font-semibold shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:border-teal-200 hover:bg-teal-50/40'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500'
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
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {current < totalQ - 1 ? (
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
