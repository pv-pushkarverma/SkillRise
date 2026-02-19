import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-6 md:px-10 border-t border-gray-200 bg-white py-3'>

      <div className='flex items-center gap-4'>
        <img className='hidden md:block w-28' src={assets.logo_light} alt='Logo'/>

        <div className='hidden md:block h-7 w-px bg-gray-200'></div>

        <p className='py-1 text-center text-xs md:text-sm text-gray-500'>
          © 2025 SkillRise. All rights reserved.
        </p>
      </div>

      <div className='flex items-center gap-3 max-md:mt-2'>
        <a href='#'>
          <img src={assets.facebook_icon} alt='facebook_icon' />
        </a>
        <a href='#'>
          <img src={assets.twitter_icon} alt='twitter_icon' />
        </a>
        <a href='#'>
          <img src={assets.instagram_icon} alt='instagram_icon' />
        </a>
      </div>

    </footer>
  )
}

export default Footer
