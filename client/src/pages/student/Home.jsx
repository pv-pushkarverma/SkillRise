import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import ContinueLearning from '../../components/student/ContinueLearning'

const Home = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Hero />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm px-6 md:px-10 py-10 -mt-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">For students</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Learn by doing</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Structured lectures, progress tracking, and ratings you can trust.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">For creators</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Teach at scale</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Become an educator and publish courses from your dashboard.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">For teams</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Upskill faster</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Curated learning paths for practical, job‑ready skills.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Companies compact />
          </div>
        </div>
      </section>

      <ContinueLearning />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <CoursesSection />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <TestimonialsSection />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <CallToAction />
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Home
