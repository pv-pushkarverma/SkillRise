import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import QuizQuestion from '../../components/quiz/QuizQuestion'
import QuizResults from '../../components/quiz/QuizResults'

const Quiz = () => {
  const { courseId, chapterId } = useParams()
  const { backendUrl, getToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [phase, setPhase] = useState('loading') // loading | quiz | submitting | results
  const [quiz, setQuiz] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(`${backendUrl}/api/quiz/${courseId}/${chapterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.success) {
          setQuiz(data.quiz)
          setAnswers(new Array(data.quiz.questions.length).fill(-1))
          setPhase('quiz')
        } else {
          toast.error(data.message)
          navigate(-1)
        }
      } catch (err) {
        toast.error(err.message)
        navigate(-1)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectOption = (idx) => {
    if (phase !== 'quiz') return
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = idx
      return next
    })
  }

  const goNext = () => {
    if (current < quiz.questions.length - 1) setCurrent((c) => c + 1)
  }
  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1)
  }

  const handleSubmit = async () => {
    const unanswered = answers.filter((a) => a === -1).length
    if (unanswered > 0) {
      toast.error(`Please answer all questions. ${unanswered} remaining.`)
      setCurrent(answers.findIndex((a) => a === -1))
      return
    }

    setPhase('submitting')
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/quiz/submit`,
        { courseId, chapterId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setResult(data.result)
        setPhase('results')
      } else {
        toast.error(data.message)
        setPhase('quiz')
      }
    } catch (err) {
      toast.error(err.message)
      setPhase('quiz')
    }
  }

  const handleRetake = () => {
    setAnswers(new Array(quiz.questions.length).fill(-1))
    setCurrent(0)
    setResult(null)
    setPhase('quiz')
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-teal-600">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Generating your quiz</p>
            <p className="text-sm text-gray-400 mt-1">
              AI is creating questions based on this chapter…
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-teal-500" />
          <div>
            <p className="font-semibold text-gray-900">Submitting your answers</p>
            <p className="text-sm text-gray-400 mt-1">Calculating score and generating feedback…</p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'results' && result) {
    return (
      <QuizResults
        result={result}
        quiz={quiz}
        answers={answers}
        courseId={courseId}
        navigate={navigate}
        onRetake={handleRetake}
      />
    )
  }

  return (
    <QuizQuestion
      quiz={quiz}
      current={current}
      answers={answers}
      courseId={courseId}
      onSelect={selectOption}
      onNext={goNext}
      onPrev={goPrev}
      onSubmit={handleSubmit}
      setCurrent={setCurrent}
    />
  )
}

export default Quiz
