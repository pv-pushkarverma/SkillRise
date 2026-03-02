import { Link } from 'react-router-dom'
import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'
import { FacebookIcon, TwitterIcon, InstagramIcon } from '../ui/social-icons'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-14 lg:px-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-gray-200 dark:border-gray-800">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <img className="w-32 dark:hidden" src={logoLight} alt="SkillRise" />
            <img className="w-32 hidden dark:block" src={logoDark} alt="SkillRise" />
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              Empowering learners worldwide with quality, hands-on education from industry experts.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2 mt-1 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-9 px-3 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-teal-500 transition"
              />
              <button className="h-9 px-4 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-500 transition shrink-0">
                Subscribe
              </button>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-teal-900 transition"
              >
                <FacebookIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-teal-900 transition"
              >
                <TwitterIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-teal-900 transition"
              >
                <InstagramIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500 dark:text-gray-400">
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
                  to="/blog"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/become-educator"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Become an Educator
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Support & Legal
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500 dark:text-gray-400">
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

        {/* Bottom bar */}
        <div className="py-5 text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
          <p>© 2026 SkillRise™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
