import Footer from '../../components/student/Footer'
const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'Account information: When you register, we collect your name, email address, and profile picture via your chosen authentication provider (Google, GitHub, etc.).',
      'Usage data: We collect information about how you interact with our platform, including courses viewed, quiz results, time spent learning, and community activity.',
      'Payment data: Payment transactions are processed by third-party providers (Stripe, Razorpay). We do not store your full card details.',
      'Device & technical data: IP address, browser type, operating system, and cookies to ensure platform functionality.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'To provide and personalise your learning experience.',
      'To process enrollments and payments.',
      'To send you course updates, receipts, and platform announcements.',
      'To improve our platform through aggregate analytics.',
      'To comply with legal obligations.',
    ],
  },
  {
    title: '3. Sharing of Information',
    content: [
      'We do not sell your personal data to third parties.',
      'We share data with service providers (e.g., payment processors, cloud hosting) strictly to deliver our services.',
      "We may disclose information when required by law or to protect SkillRise's rights.",
      'Course instructors can see aggregate, anonymised data about enrolled students.',
    ],
  },
  {
    title: '4. Cookies',
    content: [
      'We use cookies to keep you logged in, remember your preferences, and analyse site traffic.',
      'You can control cookie settings through your browser. Disabling cookies may affect platform functionality.',
      'For full details, please see our Cookie Policy.',
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      'We retain your account data for as long as your account is active or as needed to provide services.',
      'You may request deletion of your account and associated data by contacting support@skillrise.com.',
      'Some data may be retained to comply with legal obligations even after account deletion.',
    ],
  },
  {
    title: '6. Security',
    content: [
      'We use industry-standard encryption (TLS) to protect data in transit.',
      'Access to user data is restricted to authorised personnel only.',
      'While we take reasonable precautions, no system is completely secure. We encourage you to use a strong, unique password.',
    ],
  },
  {
    title: '7. Your Rights',
    content: [
      'Access: You can view and download your personal data from your account settings.',
      'Correction: You can update inaccurate information at any time.',
      'Deletion: You can request account deletion by contacting our support team.',
      'Opt-out: You can unsubscribe from marketing emails at any time via the link in the email.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website.',
      'Continued use of SkillRise after changes constitutes acceptance of the revised policy.',
    ],
  },
  {
    title: '9. Contact',
    content: [
      'If you have questions about this Privacy Policy, please contact us at privacy@skillrise.com or visit our Contact Us page.',
    ],
  },
]

const DataPrivacy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-teal-100 text-sm">Last updated: January 2026</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          At SkillRise, your privacy matters. This Privacy Policy explains what information we
          collect, how we use it, and the choices you have regarding your data. By using SkillRise,
          you agree to the practices described below.
        </p>

        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {section.content.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                  >
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default DataPrivacy
