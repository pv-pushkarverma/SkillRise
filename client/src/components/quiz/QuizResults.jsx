import { useState } from 'react'
import ScoreRing from './ScoreRing'
import Footer from '../student/Footer'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

const GROUP_META = {
  needs_review: {
    label: 'Needs Review',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badgeBg: 'bg-red-100 text-red-700',
    bar: 'bg-red-400',
    icon: '📖',
  },
  on_track: {
    label: 'On Track',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-700',
    bar: 'bg-amber-400',
    icon: '🎯',
  },
  mastered: {
    label: 'Mastered',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    badgeBg: 'bg-teal-100 text-teal-700',
    bar: 'bg-teal-500',
    icon: '🏆',
  },
}

const QuizResults = ({ result, quiz, answers, courseId, navigate, onRetake }) => {
  const [showExplain, setShowExplain] = useState(false)
  const meta = GROUP_META[result.group]

  const bullets = result.recommendations
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <button
          onClick={() => navigate(`/player/${courseId}`)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to course
        </button>

        <div className={`bg-white rounded-2xl border ${meta.border} shadow-sm overflow-hidden`}>
          <div className={`${meta.bg} px-6 py-5 flex flex-col sm:flex-row items-center gap-5`}>
            <ScoreRing pct={result.percentage} group={result.group} />
            <div className="text-center sm:text-left">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${meta.badgeBg} mb-2`}
              >
                <span>{meta.icon}</span>
                {meta.label}
              </span>
              <p className="text-2xl font-bold text-gray-900">
                {result.score} / {result.total} correct
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{quiz?.chapterTitle}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
              <span>Needs Review (0–40%)</span>
              <span>On Track (41–75%)</span>
              <span>Mastered (76–100%)</span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute top-0 left-[40%] h-full w-px bg-white/60" />
              <div className="absolute top-0 left-[75%] h-full w-px bg-white/60" />
              <div
                className={`h-full rounded-full transition-all duration-1000 ${meta.bar}`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-indigo-600">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Personalized Recommendations</p>
              <p className="text-xs text-gray-400">Based on your performance</p>
            </div>
          </div>
          <ul className="space-y-2">
            {bullets.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed">
                <span className="text-teal-500 shrink-0 mt-0.5">•</span>
                <span>{line.replace(/^[•\\-]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
            onClick={() => setShowExplain((s) => !s)}
          >
            <span>Review Answers</span>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-4 h-4 text-gray-400 transition-transform ${showExplain ? 'rotate-180' : ''}`}
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          {showExplain && (
            <div className="border-t border-gray-100 divide-y divide-gray-100">
              {quiz.questions.map((q, i) => {
                const chosen = answers[i]
                const correct = q.correctIndex
                const isRight = chosen === correct
                return (
                  <div key={i} className="px-6 py-4 space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="text-gray-400 mr-1.5">{i + 1}.</span>
                      {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {q.options.map((opt, oi) => {
                        let cls = 'text-gray-500 bg-gray-50 border-gray-100'
                        if (oi === correct)
                          cls = 'text-teal-700 bg-teal-50 border-teal-200 font-semibold'
                        if (oi === chosen && !isRight)
                          cls = 'text-red-600 bg-red-50 border-red-200 line-through'
                        return (
                          <div key={oi} className={`px-3 py-2 rounded-lg border text-xs ${cls}`}>
                            <span className="font-bold mr-1">{OPTION_LABELS[oi]}.</span>
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-gray-400 italic">{q.explanation}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRetake}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate(`/player/${courseId}`)}
            className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition"
          >
            Continue Learning
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default QuizResults
