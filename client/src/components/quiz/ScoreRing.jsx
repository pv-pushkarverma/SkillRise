const ScoreRing = ({ pct, group }) => {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = group === 'mastered' ? '#14b8a6' : group === 'on_track' ? '#f59e0b' : '#f87171'
  const textColor =
    group === 'mastered'
      ? 'text-teal-600'
      : group === 'on_track'
        ? 'text-amber-600'
        : 'text-red-600'

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${textColor}`}>{pct}%</span>
      </div>
    </div>
  )
}

export default ScoreRing
