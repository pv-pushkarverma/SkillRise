import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-zinc-900 w-full mt-10">
      <div className="px-4 sm:px-10 md:px-14 lg:px-36">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-white/10">
          {/* Brand */}
          <div className="flex flex-col md:items-start items-center max-w-xs">
            <img className="w-36" src={assets.logo} alt="SkillRise" />
            <p className="mt-4 text-sm text-white/60 text-center md:text-left leading-relaxed">
              Empowering learners worldwide with quality, practical education.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:items-start items-center">
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/60">
              <li>
                <a href="#" className="hover:text-white/90 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white/90 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white/90 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white/90 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="hidden md:flex flex-col items-start max-w-xs">
            <h3 className="text-sm font-semibold text-white mb-2">Stay in the loop</h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <div className="flex w-full gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-9 px-3 rounded-lg text-sm bg-white/10 border border-white/10 text-white placeholder-white/40 outline-none focus:border-teal-500 transition"
              />
              <button className="h-9 px-4 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <p className="py-5 text-center text-xs text-white/40">
          Copyright 2025 SkillRise™. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
