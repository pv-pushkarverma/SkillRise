import Footer from '../../components/student/Footer'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Learners Worldwide', value: '50,000+' },
  { label: 'Expert Instructors', value: '500+' },
  { label: 'Courses Available', value: '1,000+' },
  { label: 'Countries Reached', value: '50+' },
]

const team = [
  { name: 'Pushkar Verma', role: 'Founder & CEO', initials: 'PV' },
  { name: 'Yogita Dhote', role: 'Co-Founder & Head of Design', initials: 'YD' },
  { name: 'Kajal Pal', role: 'Co-Founder & Head of Product', initials: 'KP' },
  { name: 'Vinayak Bhodekar', role: 'Co-Founder & Head of Engineering', initials: 'VB' },
]

const values = [
  {
    title: 'Quality First',
    desc: 'Every course is reviewed by our editorial team to meet our high standards of content and delivery.',
  },
  {
    title: 'Accessible Learning',
    desc: 'We believe education should be available to everyone, anywhere, at any time.',
  },
  {
    title: 'Practical Skills',
    desc: 'We focus on real-world, job-ready skills that make an immediate impact in your career.',
  },
  {
    title: 'Community Driven',
    desc: 'Learning is better together. Our community features connect students and educators globally.',
  },
]

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">About SkillRise</h1>
          <p className="text-lg text-teal-100 leading-relaxed max-w-2xl mx-auto">
            We're on a mission to empower every learner with the skills they need to thrive in a
            rapidly changing world.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg mb-4">
            SkillRise was founded with a simple but powerful belief: quality education should be
            accessible to everyone. We partner with industry experts to create courses that bridge
            the gap between theory and real-world application.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
            From web development and data science to design and business strategy, SkillRise offers
            a growing library of courses to help you upskill, reskill, and advance your career on
            your own terms.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 text-xl font-bold">
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-teal-600 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start learning?</h2>
        <p className="text-teal-100 mb-7 max-w-xl mx-auto">
          Join over 50,000 learners already growing their skills on SkillRise.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/course-list"
            className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition"
          >
            Browse Courses
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutUs
