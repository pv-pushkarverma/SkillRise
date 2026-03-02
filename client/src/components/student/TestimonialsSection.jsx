import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Aditi Sharma',
    role: 'Data Analyst, Bengaluru',
    rating: 5,
    feedback:
      'SkillRise helped me switch careers! Their data science courses were hands-on, practical, and aligned with real industry needs. The mentorship made all the difference.',
  },
  {
    name: 'Rohit Verma',
    role: 'Software Engineer Intern, Pune',
    rating: 4,
    feedback:
      "I signed up for SkillRise's Java Bootcamp during my final year. It gave me the confidence and skills to crack my internship interviews. Totally worth it!",
  },
  {
    name: 'Meenal Kapoor',
    role: 'UI/UX Designer, Remote Freelancer',
    rating: 5,
    feedback:
      'The UI/UX track was incredibly well-structured. The case studies felt real. It boosted my portfolio and helped me land several freelance gigs.',
  },
  {
    name: 'Arjun Nair',
    role: 'Full Stack Developer, Hyderabad',
    rating: 5,
    feedback:
      'I went from zero coding knowledge to building full-stack apps in 6 months. The projects are practical and the community support is amazing.',
  },
  {
    name: 'Sneha Iyer',
    role: 'Product Manager, Mumbai',
    rating: 4,
    feedback:
      'The product management course gave me exactly the frameworks I needed. I got promoted within 3 months of completing it. Highly recommend!',
  },
  {
    name: 'Karan Malhotra',
    role: 'DevOps Engineer, Remote',
    rating: 5,
    feedback:
      'The cloud and DevOps curriculum is top-notch. Real-world labs, hands-on with AWS and Docker. The instructor explains everything clearly.',
  },
  {
    name: 'Priya Desai',
    role: 'ML Engineer, Chennai',
    rating: 5,
    feedback:
      'I used SkillRise to transition from backend engineering into ML. The structured roadmap helped me know exactly what to learn next. Brilliant platform.',
  },
  {
    name: 'Riya Joshi',
    role: 'Frontend Developer, Ahmedabad',
    rating: 5,
    feedback:
      'As a self-taught developer, I always felt gaps in my knowledge. SkillRise filled them all. The React and Next.js courses are the best I have found online.',
  },
]

const avatarColors = [
  'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
]

const TestimonialsSection = () => {
  return (
    <section className="py-10 overflow-hidden">
      <style>{`
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee { animation: scroll 38s linear infinite; }
        .marquee-wrap:hover .marquee { animation-play-state: paused; }
      `}</style>

      <div className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            What our learners say
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
            Real stories from students who levelled up their careers with SkillRise.
          </p>
        </div>
      </div>

      {/* gradient fade masks on the edges */}
      <div
        className="marquee-wrap relative"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="flex gap-5 w-max marquee">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="w-72 shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-default"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5"
                    fill={s < t.rating ? '#f59e0b' : 'none'}
                    stroke={s < t.rating ? '#f59e0b' : '#d1d5db'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                {t.feedback}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${avatarColors[i % avatarColors.length]}`}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
