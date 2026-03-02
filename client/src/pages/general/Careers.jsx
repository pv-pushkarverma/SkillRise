import Footer from '../../components/student/Footer'
import { Link } from 'react-router-dom'

const perks = [
  { title: 'Remote-First', desc: 'Work from anywhere in India. We trust you to get things done.' },
  { title: 'Learning Budget', desc: '₹30,000/year to spend on courses, books, or conferences.' },
  { title: 'Health Insurance', desc: 'Comprehensive health coverage for you and your family.' },
  { title: 'Flexible Hours', desc: 'Async-friendly culture with no rigid 9-to-5 requirement.' },
  { title: 'Equity', desc: 'ESOPs for all full-time employees from day one.' },
  { title: 'Team Retreats', desc: 'Annual offsite retreats to connect with the team in person.' },
]

const openings = [
  {
    title: 'Senior Full Stack Engineer',
    team: 'Engineering',
    location: 'Remote (India)',
    type: 'Full-time',
  },
  {
    title: 'Product Designer (UI/UX)',
    team: 'Design',
    location: 'Remote (India)',
    type: 'Full-time',
  },
  {
    title: 'Content Partnerships Manager',
    team: 'Education',
    location: 'Remote (India)',
    type: 'Full-time',
  },
  {
    title: 'Growth Marketing Specialist',
    team: 'Marketing',
    location: 'Remote (India)',
    type: 'Full-time',
  },
  {
    title: 'Customer Support Specialist',
    team: 'Operations',
    location: 'Remote (India)',
    type: 'Full-time',
  },
]

const Careers = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-5">Join the SkillRise Team</h1>
        <p className="text-teal-100 text-lg max-w-xl mx-auto">
          Help us build the future of education. We're looking for passionate people who want to
          make learning accessible to everyone.
        </p>
      </section>

      {/* Perks */}
      <section className="py-16 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Why Work With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800"
              >
                <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-1.5">
                  {perk.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
          <div className="flex flex-col gap-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition"
              >
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {job.team} · {job.location} · {job.type}
                  </p>
                </div>
                <a
                  href="mailto:careers@skillrise.com"
                  className="shrink-0 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-500 transition text-center"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Don't see a role that fits? Send your CV to{' '}
            <a
              href="mailto:careers@skillrise.com"
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              careers@skillrise.com
            </a>{' '}
            and we'll be in touch.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-gray-50 dark:bg-gray-900 text-center">
        <h2 className="text-xl font-bold mb-3">Have questions before applying?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          We're happy to chat about the roles or the team culture.
        </p>
        <Link
          to="/contact"
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition"
        >
          Contact Us
        </Link>
      </section>

      <Footer />
    </div>
  )
}

export default Careers
