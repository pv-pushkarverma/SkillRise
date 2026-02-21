export const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const stripHtml = (html) => {
  const d = document.createElement('div')
  d.innerHTML = html
  return d.textContent || d.innerText || ''
}

export const inputCls =
  'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 bg-white transition placeholder-gray-400'

export const SectionCard = ({ children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
    {children}
  </div>
)

export const SectionHeader = ({ step, title, subtitle, complete }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${complete ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}
    >
      {complete ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ) : (
        step
      )}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
)

export const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
    {children}
  </div>
)

export const Toggle = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 cursor-pointer shrink-0 ${checked ? 'bg-teal-500' : 'bg-gray-200'}`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </div>
)
