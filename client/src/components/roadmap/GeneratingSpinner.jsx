const GeneratingSpinner = ({ label = 'Crafting your roadmap…' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-teal-100 dark:border-teal-900/40" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
    </div>
    <div className="text-center">
      <p className="font-semibold text-gray-800 dark:text-gray-100">{label}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
        The AI is analyzing your data — this takes a few seconds
      </p>
    </div>
  </div>
)

export default GeneratingSpinner
