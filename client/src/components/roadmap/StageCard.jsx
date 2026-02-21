const STATUS = {
  completed: {
    dot: 'bg-teal-500 ring-teal-200',
    border: 'border-l-teal-500',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
    chip: 'bg-teal-100 text-teal-800',
    bar: 'bg-teal-500',
    label: 'Mastered',
    symbol: '✓',
  },
  current: {
    dot: 'bg-blue-500 ring-blue-200',
    border: 'border-l-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    chip: 'bg-blue-100 text-blue-800',
    bar: 'bg-blue-500',
    label: 'In Progress',
    symbol: '↻',
  },
  upcoming: {
    dot: 'bg-violet-500 ring-violet-200',
    border: 'border-l-violet-500',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    chip: 'bg-violet-100 text-violet-800',
    bar: 'bg-violet-500',
    label: 'Up Next',
    symbol: '→',
  },
  future: {
    dot: 'bg-amber-500 ring-amber-200',
    border: 'border-l-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    chip: 'bg-amber-100 text-amber-800',
    bar: 'bg-amber-500',
    label: 'Future',
    symbol: '✦',
  },
}

const Chip = ({ label, className }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
    {label}
  </span>
)

const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{children}</p>
)

const ReadinessBar = ({ value }) => {
  const color = value >= 70 ? 'bg-teal-500' : value >= 50 ? 'bg-blue-500' : 'bg-amber-500'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-500 tabular-nums w-8">{value}%</span>
    </div>
  )
}

const StageCard = ({ stage, isLast }) => {
  const cfg = STATUS[stage.status] || STATUS.upcoming

  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center shrink-0 w-9">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ring-4 shadow ${cfg.dot} z-10`}
        >
          {stage.icon || cfg.symbol}
        </div>
        {!isLast && <div className="w-px flex-1 mt-1 bg-gradient-to-b from-gray-300 to-gray-100" />}
      </div>

      <div
        className={`flex-1 mb-10 bg-white rounded-2xl border border-gray-200 border-l-4 ${cfg.border} shadow-sm overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{stage.label}</h3>
            {stage.description && (
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{stage.description}</p>
            )}
          </div>
          <span
            className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}
          >
            {cfg.label}
          </span>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          {stage.skills?.length > 0 && (
            <div>
              <SectionLabel>Skills</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {stage.skills.map((s) => (
                  <Chip key={s} label={s} className={cfg.chip} />
                ))}
              </div>
            </div>
          )}

          {stage.highlights?.length > 0 && (
            <div>
              <SectionLabel>Highlights</SectionLabel>
              <ul className="flex flex-col gap-1.5">
                {stage.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-500 font-bold shrink-0 mt-0.5">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage.courses?.length > 0 && (
            <div>
              <SectionLabel>Enrolled Courses</SectionLabel>
              <div className="flex flex-col gap-3">
                {stage.courses.map((c) => (
                  <div key={c.title} className="bg-gray-50 rounded-xl px-3 py-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-800">{c.title}</span>
                      <span className="text-gray-500 tabular-nums">{c.completion}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.bar}`}
                        style={{ width: `${c.completion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.recommendations?.length > 0 && (
            <div>
              <SectionLabel>Recommended Topics</SectionLabel>
              <div className="flex flex-col gap-2">
                {stage.recommendations.map((r) => (
                  <div
                    key={r.title}
                    className="flex items-start gap-3 bg-gray-50 rounded-xl px-3 py-2.5"
                  >
                    <span
                      className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${r.priority === 'high' ? 'bg-red-400' : 'bg-amber-400'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{r.title}</p>
                      {r.reason && <p className="text-xs text-gray-500 mt-0.5">{r.reason}</p>}
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold capitalize ${r.priority === 'high' ? 'text-red-500' : 'text-amber-600'}`}
                    >
                      {r.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.paths?.length > 0 && (
            <div>
              <SectionLabel>Career Destinations</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stage.paths.map((p) => (
                  <div
                    key={p.title}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-gray-800 mb-1">{p.title}</p>
                    {typeof p.readiness === 'number' && p.readiness > 0 && (
                      <ReadinessBar value={p.readiness} />
                    )}
                    {p.gap?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.gap.map((g) => (
                          <span
                            key={g}
                            className="text-xs bg-white border border-gray-200 text-gray-500 rounded-md px-2 py-0.5"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.timeEstimate && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⏱</span>
              <span className="text-sm text-gray-600">
                Estimated time:{' '}
                <span className="font-semibold text-gray-800">{stage.timeEstimate}</span>
              </span>
            </div>
          )}

          {stage.projects?.length > 0 && (
            <div>
              <SectionLabel>Project Ideas</SectionLabel>
              <ul className="flex flex-col gap-1.5">
                {stage.projects.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-violet-400 font-bold shrink-0 mt-0.5">◈</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage.resources?.length > 0 && (
            <div>
              <SectionLabel>Learning Resources</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {stage.resources.map((r) => (
                  <Chip key={r} label={r} className="bg-gray-100 text-gray-700" />
                ))}
              </div>
            </div>
          )}

          {stage.certifications?.length > 0 && (
            <div>
              <SectionLabel>Certifications to Pursue</SectionLabel>
              <ul className="flex flex-col gap-1.5">
                {stage.certifications.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-amber-500 shrink-0 mt-0.5">🏅</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StageCard
