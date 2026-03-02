import { Link } from 'react-router-dom'
import logoLight from '../../assets/logo-light.svg'
import { FacebookIcon, TwitterIcon, InstagramIcon } from '../ui/social-icons'

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 py-8 border-b border-gray-100 dark:border-gray-800">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <img className="w-28" src={logoLight} alt="SkillRise" />
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Your platform for creating and delivering world-class online education.
            </p>
          </div>

          {/* Links grid */}
          <div className="flex flex-wrap gap-x-14 gap-y-6 text-sm">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Educator
              </h4>
              <ul className="flex flex-col gap-2 text-gray-400 dark:text-gray-500">
                <li>
                  <Link
                    to="/educator"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/educator/add-course"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Add Course
                  </Link>
                </li>
                <li>
                  <Link
                    to="/educator/my-courses"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    My Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/educator/students-enrolled"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Students
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company
              </h4>
              <ul className="flex flex-col gap-2 text-gray-400 dark:text-gray-500">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Legal
              </h4>
              <ul className="flex flex-col gap-2 text-gray-400 dark:text-gray-500">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2026 SkillRise™. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <FacebookIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <TwitterIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <InstagramIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
