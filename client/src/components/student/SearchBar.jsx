import { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data || '')

  const onSearchHandler = (e) => {
    e.preventDefault()
    navigate('/course-list/' + input)
  }

  return (
    <form
      onSubmit={onSearchHandler}
      className="flex items-center w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 overflow-hidden focus-within:border-teal-400 transition"
    >
      <img src={assets.search_icon} alt="search" className="w-4 h-4 ml-4 shrink-0 opacity-40" />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Search courses..."
        className="flex-1 h-11 px-3 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none bg-transparent"
      />
      <button
        type="submit"
        className="h-11 px-5 bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition shrink-0"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
