import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {
  const { path } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
      </div>
    </div>
  )
}

export default Loading
