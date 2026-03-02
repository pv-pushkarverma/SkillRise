import Footer from '../../components/student/Footer'
const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using SkillRise, you agree to be bound by these Terms of Service and our Privacy Policy.',
      'If you do not agree to these terms, please do not use our platform.',
      'We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance.',
    ],
  },
  {
    title: '2. Account Registration',
    content: [
      'You must create an account to access most features of SkillRise.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You must provide accurate and complete information during registration.',
      'You may not create accounts on behalf of others without their consent.',
      'You must be at least 13 years of age to use SkillRise.',
    ],
  },
  {
    title: '3. Course Enrollment & Payments',
    content: [
      'Purchasing a course grants you a personal, non-transferable license to access the course content.',
      'All prices are displayed in INR or USD and are subject to change without notice.',
      'We offer a 7-day money-back guarantee on all courses. Refund requests must be submitted within 7 days of purchase.',
      'You may not share your account or course access with others.',
    ],
  },
  {
    title: '4. Intellectual Property',
    content: [
      'All course content, trademarks, logos, and platform materials are the property of SkillRise or its content providers.',
      'You may not copy, reproduce, distribute, or create derivative works from course content without explicit permission.',
      'Certificates issued by SkillRise may be shared for personal professional purposes only.',
    ],
  },
  {
    title: '5. User Conduct',
    content: [
      'You agree not to use SkillRise for any unlawful purpose.',
      'You may not attempt to gain unauthorised access to any part of the platform.',
      'You may not upload or transmit viruses, malware, or any harmful code.',
      'Community features must not be used to harass, bully, or harm other users.',
      'Spam, advertising, or promotional content in community areas is prohibited.',
    ],
  },
  {
    title: '6. Educator Terms',
    content: [
      'Educators agree that all content they publish is original or they have rights to publish it.',
      'Educators are responsible for keeping their course content accurate and up to date.',
      'SkillRise reserves the right to remove any course that violates our content standards.',
      'Revenue sharing terms are outlined separately in the Educator Agreement.',
    ],
  },
  {
    title: '7. Disclaimers',
    content: [
      'SkillRise is provided on an "as is" basis without warranties of any kind.',
      'We do not guarantee that courses will result in specific career outcomes or certifications.',
      'We are not responsible for third-party content linked from our platform.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    content: [
      'To the maximum extent permitted by law, SkillRise shall not be liable for any indirect, incidental, or consequential damages.',
      'Our total liability to you shall not exceed the amount you paid us in the 12 months prior to the event giving rise to the claim.',
    ],
  },
  {
    title: '9. Termination',
    content: [
      'We reserve the right to suspend or terminate your account for violation of these terms.',
      'You may delete your account at any time from your account settings.',
      'Upon termination, your license to access purchased course content will end.',
    ],
  },
  {
    title: '10. Governing Law',
    content: [
      'These terms are governed by the laws of India.',
      'Any disputes shall be resolved in the courts of Bengaluru, Karnataka, India.',
    ],
  },
  {
    title: '11. Contact',
    content: ['For questions about these Terms of Service, contact us at legal@skillrise.com.'],
  },
]

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
        <p className="text-teal-100 text-sm">Last updated: January 2026</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          These Terms of Service govern your use of the SkillRise platform and all associated
          services. Please read them carefully before using the platform.
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

export default TermsOfService
