import Avatar from '../shared/Avatar'
import { timeAgo } from '../../utils/time'

const ReplyCard = ({ reply, isPostAuthor, currentUserId, onUpvote, onAccept, onAuthRequired }) => {
  const handleUpvote = () => {
    if (!currentUserId) {
      onAuthRequired()
      return
    }
    onUpvote(reply._id)
  }

  return (
    <div
      className={`bg-white rounded-2xl border ${reply.isAcceptedAnswer ? 'border-teal-300 shadow-teal-50 shadow-md' : 'border-gray-200'} overflow-hidden`}
    >
      {reply.isAcceptedAnswer && (
        <div className="bg-teal-500 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-1.5">
          <span>✓</span>
          <span>Accepted Answer</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Avatar name={reply.authorName} imageUrl={reply.authorImage} />
          <div>
            <p className="text-sm font-semibold text-gray-800">{reply.authorName}</p>
            <p className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</p>
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>

        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 text-sm transition px-3 py-1.5 rounded-lg border ${
              reply.isUpvoted
                ? 'border-teal-200 bg-teal-50 text-teal-600 font-semibold'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>↑</span>
            <span>{reply.upvoteCount}</span>
          </button>

          {isPostAuthor && (
            <button
              onClick={() => onAccept(reply._id)}
              className={`flex items-center gap-1.5 text-sm transition px-3 py-1.5 rounded-lg border ${
                reply.isAcceptedAnswer
                  ? 'border-teal-300 bg-teal-50 text-teal-700 font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <span>✓</span>
              <span>{reply.isAcceptedAnswer ? 'Unaccept' : 'Accept answer'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReplyCard
