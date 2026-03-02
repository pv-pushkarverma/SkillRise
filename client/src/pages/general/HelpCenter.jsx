import Footer from '../../components/student/Footer'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const categories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    faqs: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign In" in the top navigation and choose to sign up with Google or your email. Your account is created instantly.',
      },
      {
        q: 'Is SkillRise free to use?',
        a: 'Browsing courses is free. Individual courses are paid. Once purchased, you have lifetime access to that course.',
      },
      {
        q: 'What devices can I use?',
        a: 'SkillRise works on any modern browser on desktop, tablet, or mobile. There is no app required.',
      },
    ],
  },
  {
    title: 'Courses & Learning',
    icon: '📚',
    faqs: [
      {
        q: 'How do I enroll in a course?',
        a: 'Go to any course page and click "Enroll Now". Complete the payment and you\'ll be redirected to the course player immediately.',
      },
      {
        q: 'Can I download course videos?',
        a: 'Currently, videos are available for streaming only and cannot be downloaded. You can access them anytime while your account is active.',
      },
      {
        q: 'How do certificates work?',
        a: 'After completing all lessons and passing the final quiz, a certificate is generated automatically. You can download or share it via a link.',
      },
      {
        q: 'What is the AI Tutor?',
        a: 'The AI Tutor is an in-platform chatbot that can answer questions about your course content, explain concepts, and help you debug code.',
      },
    ],
  },
  {
    title: 'Payments & Billing',
    icon: '💳',
    faqs: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Stripe and Razorpay.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Yes. We offer a full refund within 7 days of purchase, no questions asked. Contact support@skillrise.com with your order ID.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. Payments are processed by Stripe and Razorpay, both PCI-DSS compliant. We never store your card details.',
      },
    ],
  },
  {
    title: 'Account & Settings',
    icon: '⚙️',
    faqs: [
      {
        q: 'How do I change my profile information?',
        a: 'Click your profile picture in the top-right corner and go to Account Settings to update your name, photo, and preferences.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Contact support@skillrise.com with the subject "Account Deletion". We\'ll process your request within 5 business days.',
      },
      {
        q: 'How do I switch to dark mode?',
        a: 'Click the moon/sun icon in the top navigation bar to toggle between light and dark mode.',
      },
    ],
  },
]

const AccordionItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        {q}
        <span className={`ml-4 shrink-0 text-lg transition-transform ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && <p className="pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{a}</p>}
    </div>
  )
}

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
        <p className="text-teal-100 text-lg max-w-xl mx-auto">
          Find answers to common questions or reach out to our support team.
        </p>
      </section>

      {/* Categories */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="flex flex-col gap-10">
          {categories.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-xl font-bold">{cat.title}</h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-6 border border-gray-100 dark:border-gray-800">
                {cat.faqs.map((faq) => (
                  <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-14 text-center p-8 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-800">
          <h3 className="text-lg font-bold mb-2">Still need help?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            Our support team is available Monday to Friday, 9 AM – 6 PM IST.
          </p>
          <Link
            to="/contact"
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition"
          >
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HelpCenter
