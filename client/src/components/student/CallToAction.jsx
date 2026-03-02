import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

const CallToAction = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-2xl px-8 py-14 text-center">
          {/* subtle animated background orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-300/20 rounded-full blur-2xl animate-float pointer-events-none" />
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl animate-float pointer-events-none"
            style={{ animationDelay: '3s' }}
          />

          <h2 className="relative text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Learn anything, anytime, anywhere
          </h2>
          <p className="relative text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto text-sm md:text-base">
            Access course content on your schedule. Build real skills at your own pace, and track
            every step of your progress.
          </p>

          <div className="relative flex items-center justify-center gap-4 mt-8">
            <Button asChild size="lg">
              <Link to="/course-list">Get started</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/about" className="flex items-center gap-1.5">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
