import { useNavigate } from 'react-router-dom'
import Avatar from '../shared/Avatar'
import { timeAgo } from '../../utils/time'

const PostCard = ({ post, onUpvote, isLoggedIn, onAuthRequired }) => {
  const navigate = useNavigate()

  const handleUpvote = (e) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      onAuthRequired()
      return
    }
    onUpvote(post._id)
  }

  return (
    <div
      onClick={() => navigate(`/community/post/${post._id}`)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {post.group && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
            <span>{post.group.icon}</span>
            {post.group.name}
          </span>
        )}
        {post.isResolved && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
            ✓ Resolved
          </span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-snug group-hover:text-teal-700 transition-colors line-clamp-2 mb-2">
        {post.title}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
        {post.content}
      </p>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Avatar name={post.authorName} imageUrl={post.authorImage} size="sm" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">{post.authorName}</span>
            {' · '}
            {timeAgo(post.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 transition hover:text-teal-600 ${post.isUpvoted ? 'text-teal-600 font-semibold' : ''}`}
          >
            ↑ {post.upvoteCount}
          </button>
          <span className="flex items-center gap-1">💬 {post.replyCount}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
