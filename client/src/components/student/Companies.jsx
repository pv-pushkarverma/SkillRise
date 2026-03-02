import microsoftLogo from '../../assets/microsoft_logo.svg'
import walmartLogo from '../../assets/walmart_logo.svg'
import accentureLogo from '../../assets/accenture_logo.svg'
import adobeLogo from '../../assets/adobe_logo.svg'
import paypalLogo from '../../assets/paypal_logo.svg'

const COMPANIES = [
  { name: 'Microsoft', src: microsoftLogo },
  { name: 'Walmart', src: walmartLogo },
  { name: 'Accenture', src: accentureLogo },
  { name: 'Adobe', src: adobeLogo },
  { name: 'PayPal', src: paypalLogo },
]

const Companies = ({ compact = false }) => {
  return (
    <div className={compact ? '' : 'pt-16'}>
      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
        Trusted by learners from
      </p>

      <div
        className={`flex flex-wrap items-center justify-center gap-6 md:gap-16 ${compact ? 'mt-6' : 'md:mt-10 mt-5'}`}
      >
        {COMPANIES.map(({ name, src }) => (
          <img
            key={name}
            src={src}
            alt={name}
            className="w-20 md:w-28 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition"
          />
        ))}
      </div>
    </div>
  )
}

export default Companies
