export const PAGE_COLORS = {
  Home: 'bg-teal-500',
  'Browse Courses': 'bg-blue-500',
  'My Enrollments': 'bg-indigo-500',
  Learning: 'bg-violet-500',
  'Course Details': 'bg-amber-500',
  'SkillRise AI': 'bg-pink-500',
  Analytics: 'bg-orange-500',
  Other: 'bg-gray-400',
}

export const PAGE_ICONS = {
  Home: '🏠',
  'Browse Courses': '📚',
  'My Enrollments': '🎓',
  Learning: '▶️',
  'Course Details': '📖',
  'SkillRise AI': '🤖',
  Analytics: '📊',
  Other: '📄',
}

export const getColor = (page) => PAGE_COLORS[page] || 'bg-gray-400'
export const getIcon = (page) => PAGE_ICONS[page] || '📄'
