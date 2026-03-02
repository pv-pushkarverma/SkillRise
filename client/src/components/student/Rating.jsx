import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0)

  const handleRating = (value) => {
    setRating(value)
    if (onRate) onRate(value)
  }

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating)
    }
  }, [initialRating])

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1

        return (
          <Star
            key={index}
            className={`w-6 h-6 cursor-pointer transition-colors ${starValue <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'}`}
            onClick={() => handleRating(starValue)}
          />
        )
      })}
    </div>
  )
}

export default Rating
