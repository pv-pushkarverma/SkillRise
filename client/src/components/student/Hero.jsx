import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <section className='relative w-full overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-b from-teal-50 via-white to-white' />
      <div className='absolute -top-24 -right-24 w-72 h-72 bg-teal-200/40 blur-3xl rounded-full' />
      <div className='absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-200/40 blur-3xl rounded-full' />

      <div className='relative px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-10'>
        <div className='max-w-4xl mx-auto text-center'>
          <p className='inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-white/70 border border-gray-200 text-gray-700'>
            Learn. Build. Level up.
          </p>

          <h1 className='mt-5 text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight'>
            Unlock your <span className='text-teal-700'>potential</span> with
            <span className='block'>expert‑led courses</span>
          </h1>

          <p className='mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto'>
            A modern learning platform to help you go from “I’m curious” to “I can ship”.
            Search, enroll, and track progress in one place.
          </p>

          <div className='mt-7 flex flex-col items-center gap-4'>
            <SearchBar />
            <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600'>
              <span className='font-medium text-gray-800'>Popular:</span>
              <span className='hover:text-teal-700 cursor-default'>Web dev</span>
              <span className='hover:text-teal-700 cursor-default'>Data</span>
              <span className='hover:text-teal-700 cursor-default'>Design</span>
              <span className='hover:text-teal-700 cursor-default'>AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
