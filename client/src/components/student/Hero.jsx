import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
      {/* floating orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-200/40 blur-3xl rounded-full animate-float" />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-200/40 blur-3xl rounded-full animate-float"
        style={{ animationDelay: '3s' }}
      />

      <div className="relative px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* badge pill */}
          <p
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            Learn. Build. Level up.
          </p>

          <h1
            className="mt-5 text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            Unlock your <span className="text-teal-700">potential</span> with
            <span className="block">expert‑led courses</span>
          </h1>

          <p
            className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            A modern learning platform to help you go from "I'm curious" to "I can ship". Search,
            enroll, and track progress in one place.
          </p>

          <div className="mt-7 animate-fade-up" style={{ animationDelay: '320ms' }}>
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
