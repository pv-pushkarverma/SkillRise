import Footer from '../../components/student/Footer'
import { useState } from 'react'
import { toast } from 'react-toastify'

const contactInfo = [
  {
    label: 'Email',
    value: 'support@skillrise.com',
    desc: 'We reply within 24 hours on business days.',
  },
  {
    label: 'Office',
    value: 'Betul, Madhya Pradesh, India',
    desc: 'Mon – Fri, 9 AM – 6 PM IST',
  },
  {
    label: 'Social',
    value: '@SkillRise',
    desc: 'Reach us on Twitter, Instagram, or Facebook.',
  },
]

const faqs = [
  {
    q: 'How do I enroll in a course?',
    a: 'Browse the course catalog, click on any course, and hit "Enroll Now". You can pay securely via card or UPI.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Yes, we offer a 7-day money-back guarantee on all courses. Contact support with your order ID.',
  },
  {
    q: 'How do I become an educator?',
    a: 'Click "Become an Educator" in the footer or navigation, fill in your application, and our team will review it within 3 business days.',
  },
  {
    q: 'Are certificates available?',
    a: 'Yes! A shareable certificate is issued automatically when you complete 100% of a course.',
  },
]

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setForm({ name: '', email: '', subject: '', message: '' })
      toast.success("Message sent! We'll get back to you soon.")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-teal-100 text-lg max-w-xl mx-auto">
          Have a question or need help? We're here for you.
        </p>
      </section>

      {/* Info cards */}
      <section className="py-12 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {contactInfo.map((info) => (
            <div
              key={info.label}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-800"
            >
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                {info.label}
              </p>
              <p className="font-semibold text-sm mb-1">{info.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{info.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us more about your issue or question..."
                  className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none focus:border-teal-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-5">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="border-b border-gray-100 dark:border-gray-800 pb-5 last:border-0"
                >
                  <p className="font-semibold text-sm mb-1.5">{faq.q}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ContactUs
