import StageCard from './StageCard'

const RoadmapView = ({ roadmap, onRegenerate, regenerating }) => (
  <div>
    <div className="flex items-start gap-3 bg-gradient-to-r from-teal-50 to-white border border-teal-100 rounded-2xl px-5 py-4 mb-8">
      <span className="text-2xl shrink-0">💡</span>
      <p className="text-gray-700 leading-relaxed text-sm">{roadmap.summary}</p>
    </div>

    <div>
      {roadmap.stages?.map((stage, i) => (
        <StageCard key={stage.id || i} stage={stage} isLast={i === roadmap.stages.length - 1} />
      ))}
    </div>

    {onRegenerate && (
      <div className="flex justify-center mt-2">
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition disabled:opacity-40"
        >
          <span className={regenerating ? 'animate-spin inline-block' : ''}>↻</span>
          {regenerating ? 'Regenerating…' : 'Regenerate roadmap'}
        </button>
      </div>
    )}
  </div>
)

export default RoadmapView
