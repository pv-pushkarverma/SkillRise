const GroupRow = ({ g, selectedId, onSelect, onToggleMembership, isLoggedIn, onAuthRequired }) => (
  <div
    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition group ${
      selectedId === g._id ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50 text-gray-700'
    }`}
    onClick={() => onSelect(selectedId === g._id ? null : g)}
  >
    <span className="text-base shrink-0">{g.icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{g.name}</p>
      <p className="text-xs text-gray-400 truncate">{g.memberCount} members</p>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation()
        isLoggedIn ? onToggleMembership(g) : onAuthRequired()
      }}
      className={`shrink-0 text-xs px-2 py-0.5 rounded-full border transition ${
        g.isMember
          ? 'border-teal-200 text-teal-600 bg-teal-50 hover:bg-teal-100'
          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {g.isMember ? 'Joined' : 'Join'}
    </button>
  </div>
)

const GroupsPanel = ({
  groups,
  selectedGroup,
  onSelectGroup,
  onToggleMembership,
  onCreateGroup,
  isLoggedIn,
  onAuthRequired,
}) => {
  const joined = groups.filter((g) => g.isMember)
  const selectedId = selectedGroup?._id

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Groups
        </span>
        <button
          onClick={() => (isLoggedIn ? onCreateGroup() : onAuthRequired())}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium transition"
        >
          + Create
        </button>
      </div>

      <div
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition ${
          !selectedGroup ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50 text-gray-700'
        }`}
        onClick={() => onSelectGroup(null)}
      >
        <span className="text-base">🏠</span>
        <span className="text-sm font-medium">All Posts</span>
      </div>

      {joined.length > 0 && (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 pt-3 pb-1">
            My Groups
          </p>
          {joined.map((g) => (
            <GroupRow
              key={g._id}
              g={g}
              selectedId={selectedId}
              onSelect={onSelectGroup}
              onToggleMembership={onToggleMembership}
              isLoggedIn={isLoggedIn}
              onAuthRequired={onAuthRequired}
            />
          ))}
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 pt-3 pb-1">
            All Groups
          </p>
        </>
      )}

      {groups.map((g) =>
        joined.some((j) => j._id === g._id) ? null : (
          <GroupRow
            key={g._id}
            g={g}
            selectedId={selectedId}
            onSelect={onSelectGroup}
            onToggleMembership={onToggleMembership}
            isLoggedIn={isLoggedIn}
            onAuthRequired={onAuthRequired}
          />
        )
      )}
    </div>
  )
}

export default GroupsPanel
