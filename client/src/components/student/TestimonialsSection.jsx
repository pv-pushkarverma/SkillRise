import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <section className="py-14">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            What our learners say
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
            Real stories from students who levelled up their careers with SkillRise.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  className="h-4 w-4"
                  src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                  alt="star"
                />
              ))}
            </div>

            {/* Feedback */}
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 leading-relaxed">{testimonial.feedback}</p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <img
                className="h-10 w-10 rounded-full object-cover shrink-0"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
