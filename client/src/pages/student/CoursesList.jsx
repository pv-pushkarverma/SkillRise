import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CoursesList = () => {

  const { navigate, allCourses } = useContext(AppContext)
  const { input } = useParams()

  const [ filteredCourse, setFilteredCourse ] = useState([])

  useEffect(()=>{
    if(allCourses && allCourses.length>0){
      const tempCourses = allCourses.slice()

      input ?
      setFilteredCourse(
        tempCourses.filter(
          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      )
      : setFilteredCourse(tempCourses)
    }
  },[allCourses, input])

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>

          <div>
            <h1 className='text-3xl md:text-4xl font-semibold text-gray-900'>All courses</h1>
            <p className='text-sm text-gray-500 mt-1'>
              <span className='text-teal-600 cursor-pointer' onClick={()=> navigate('/')}>Home</span>
              <span className='mx-1'>/</span>
              <span>All courses</span>
            </p>
          </div>

          <SearchBar data={input} />
        </div>

        {input && (
          <div className='inline-flex items-center gap-3 px-4 py-2 mt-6 -mb-6 rounded-full border border-gray-200 bg-white text-gray-600 text-sm shadow-sm'>
            <span className='font-medium text-gray-900'>Search:</span>
            <p className='truncate max-w-[160px]'>{input}</p>
            <button
              type='button'
              className='ml-1 rounded-full p-1 hover:bg-gray-100'
              onClick={()=> navigate('/course-list')}
            >
              <img src={assets.cross_icon} alt='clear' className='w-3.5 h-3.5'/>
            </button>
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-4 px-2 md:p-0'>
          {filteredCourse.map((course, index)=><CourseCard key={index} course={course}/>)}
        </div>
      </div>

      <Footer/>
    </>
  )
}

export default CoursesList
