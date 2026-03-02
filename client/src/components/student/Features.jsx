import Companies from './Companies'
import { useInView } from '../../hooks/useInView'

const featureItems = [
  {
    label: 'For students',
    title: 'Learn by doing',
    description: 'Structured lectures, progress tracking, and ratings you can trust.',
  },
  {
    label: 'For creators',
    title: 'Teach at scale',
    description: 'Become an educator and publish courses from your dashboard.',
  },
  {
    label: 'For teams',
    title: 'Upskill faster',
    description: 'Curated learning paths for practical, job‑ready skills.',
  },
]

const Features = () => {
  const [ref, inView] = useInView()

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-14 pb-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-100 dark:border-gray-800 pb-12"
        >
          {featureItems.map((item, i) => (
            <div
              key={item.label}
              className="transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: inView ? `${i * 120}ms` : '0ms',
              }}
            >
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                {item.label}
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</p>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="pt-10">
          <Companies compact />
        </div>
      </div>
    </section>
  )
}

export default Features
