import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:space-y-7 text-center'>
      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>Unlock Your <span className='text-teal-600'>Potential</span> with <br/>Expert-Led Courses</h1>

      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>
      Join millions of learners worldwide and transform your career with our cutting-edge online learning platform.
      </p>

      <p className='md:hidden text-gray-500 max-w-sm mx-auto'>
      Transform your career with our cutting-edge online learning platform
      </p>

      <SearchBar/>

    </div>
  )
}

export default Hero
