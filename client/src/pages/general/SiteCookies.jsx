import Footer from '../../components/student/Footer'
const sections = [
  {
    title: '1. What Are Cookies?',
    content: [
      'Cookies are small text files stored on your device by a website when you visit it.',
      'They help the website remember your preferences and improve your browsing experience.',
      'Cookies do not contain executable code and cannot access other files on your computer.',
    ],
  },
  {
    title: '2. Types of Cookies We Use',
    content: [
      'Essential Cookies: Required for the platform to function. These enable login sessions, shopping cart functionality, and security features. They cannot be disabled.',
      'Preference Cookies: Remember your settings such as dark mode, language, and notification preferences.',
      'Analytics Cookies: Help us understand how users interact with SkillRise so we can improve the experience. Data is aggregated and anonymised.',
      'Marketing Cookies: Used to show you relevant course recommendations and advertisements. These are optional.',
    ],
  },
  {
    title: '3. Third-Party Cookies',
    content: [
      'Some features on SkillRise use services from third parties (e.g., payment processors, video hosting) that may set their own cookies.',
      'These cookies are governed by the respective third-party privacy policies.',
      'We do not control third-party cookies and are not responsible for them.',
    ],
  },
  {
    title: '4. How to Manage Cookies',
    content: [
      'You can control cookies through your browser settings. Most browsers allow you to block or delete cookies.',
      'Disabling essential cookies may prevent you from logging in or using certain features of SkillRise.',
      "To opt out of analytics cookies, you can use browser extensions such as uBlock Origin or your browser's built-in tracking prevention.",
      'You can also manage cookie preferences on this page using the preferences panel (coming soon).',
    ],
  },
  {
    title: '5. Cookie Retention',
    content: [
      'Session cookies are deleted when you close your browser.',
      'Persistent cookies remain on your device for a set period (typically 30–365 days) or until you delete them.',
      'Authentication cookies expire after 30 days of inactivity for security.',
    ],
  },
  {
    title: '6. Updates to This Policy',
    content: [
      'We may update this Cookie Policy to reflect changes in technology or regulation.',
      'We will notify you of significant changes through the platform or by email.',
    ],
  },
  {
    title: '7. Contact',
    content: [
      'If you have questions about our use of cookies, contact us at privacy@skillrise.com.',
    ],
  },
]

const SiteCookies = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Cookie Policy</h1>
        <p className="text-teal-100 text-sm">Last updated: January 2026</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          This Cookie Policy explains what cookies are, how SkillRise uses them, and how you can
          manage your cookie preferences.
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

export default SiteCookies
