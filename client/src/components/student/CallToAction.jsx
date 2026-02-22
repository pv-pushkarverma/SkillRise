import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <section className="py-14">
      <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-2xl px-8 py-14 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          Learn anything, anytime, anywhere
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto text-sm md:text-base">
          Access course content on your schedule. Build real skills at your own pace, and track
          every step of your progress.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="px-6 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition">
            Get started
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition">
            Learn more
            <img src={assets.arrow_icon} alt="" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
