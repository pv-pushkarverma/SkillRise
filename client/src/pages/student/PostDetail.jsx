/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import Avatar from '../../components/shared/Avatar'
import ReplyCard from '../../components/community/ReplyCard'
import { timeAgo } from '../../utils/time'

const PostDetail = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { backendUrl, getToken } = useContext(AppContext)
  const { user } = useUser()
  const { openSignIn } = useClerk()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const requireAuth = () => openSignIn()
  const isPostAuthor = user && post?.authorId === user.id

  const loadPost = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const headers = user ? { Authorization: `Bearer ${await getToken()}` } : {}
      const { data } = await axios.get(`${backendUrl}/api/community/posts/${postId}`, { headers })
      if (data.success) setPost(data.post)
      else setError(data.message)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }, [postId, user, backendUrl, getToken])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  const handlePostUpvote = async () => {
    if (!user) {
      requireAuth()
      return
    }
    // optimistic update
    setPost((p) => ({
      ...p,
      upvoteCount: p.isUpvoted ? p.upvoteCount - 1 : p.upvoteCount + 1,
      isUpvoted: !p.isUpvoted,
    }))
    try {
      const token = await getToken()
      await axios.post(
        `${backendUrl}/api/community/posts/${postId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (_) {
      setPost((p) => ({
        ...p,
        upvoteCount: p.isUpvoted ? p.upvoteCount + 1 : p.upvoteCount - 1,
        isUpvoted: !p.isUpvoted,
      }))
    }
  }

  const handleToggleResolve = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.patch(
        `${backendUrl}/api/community/posts/${postId}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) setPost((p) => ({ ...p, isResolved: data.isResolved }))
    } catch (_) {}
  }

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post and all its replies? This cannot be undone.')) return
    setDeleting(true)
    try {
      const token = await getToken()
      const { data } = await axios.delete(`${backendUrl}/api/community/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) navigate('/community', { replace: true })
    } catch (_) {}
    setDeleting(false)
  }

  const handleSubmitReply = async (e) => {
    e.preventDefault()
    if (!user) {
      requireAuth()
      return
    }
    if (!replyContent.trim()) return
    setSubmitting(true)
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/community/posts/${postId}/replies`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setPost((p) => ({
          ...p,
          replyCount: p.replyCount + 1,
          replies: [...(p.replies || []), data.reply],
        }))
        setReplyContent('')
      }
    } catch (_) {}
    setSubmitting(false)
  }

  const handleReplyUpvote = async (replyId) => {
    // optimistic update
    setPost((p) => ({
      ...p,
      replies: p.replies.map((r) =>
        r._id === replyId
          ? {
              ...r,
              upvoteCount: r.isUpvoted ? r.upvoteCount - 1 : r.upvoteCount + 1,
              isUpvoted: !r.isUpvoted,
            }
          : r
      ),
    }))
    try {
      const token = await getToken()
      await axios.post(
        `${backendUrl}/api/community/posts/${postId}/replies/${replyId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (_) {
      setPost((p) => ({
        ...p,
        replies: p.replies.map((r) =>
          r._id === replyId
            ? {
                ...r,
                upvoteCount: r.isUpvoted ? r.upvoteCount + 1 : r.upvoteCount - 1,
                isUpvoted: !r.isUpvoted,
              }
            : r
        ),
      }))
    }
  }

  const handleAcceptAnswer = async (replyId) => {
    try {
      const token = await getToken()
      const { data } = await axios.patch(
        `${backendUrl}/api/community/posts/${postId}/replies/${replyId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setPost((p) => ({
          ...p,
          isResolved: data.postResolved,
          replies: p.replies.map((r) => ({
            ...r,
            isAcceptedAnswer: r._id === replyId ? data.isAcceptedAnswer : false,
          })),
        }))
      }
    } catch (_) {}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="text-5xl">💬</div>
        <p className="text-gray-600">{error || 'Post not found'}</p>
        <Link to="/community" className="text-teal-600 hover:underline text-sm">
          ← Back to Community
        </Link>
      </div>
    )
  }

  const acceptedReply = post.replies?.find((r) => r.isAcceptedAnswer)
  const otherReplies = post.replies?.filter((r) => !r.isAcceptedAnswer) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-6">
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition mb-5"
        >
          <span>←</span>
          <span>Back to Community</span>
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.group && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  <span>{post.group.icon}</span>
                  {post.group.name}
                </span>
              )}
              {post.isResolved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
                  ✓ Resolved
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-4">
              {post.title}
            </h1>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap mb-5">
              {post.content}
            </p>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <Avatar name={post.authorName} imageUrl={post.authorImage} size="lg" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{post.authorName}</p>
                  <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={handlePostUpvote}
                  className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border transition ${
                    post.isUpvoted
                      ? 'border-teal-300 bg-teal-50 text-teal-700 font-semibold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ↑ {post.upvoteCount} {post.upvoteCount === 1 ? 'upvote' : 'upvotes'}
                </button>

                <span className="text-sm text-gray-500 px-3 py-2 border border-gray-200 rounded-xl">
                  💬 {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}
                </span>

                {isPostAuthor && (
                  <>
                    <button
                      onClick={handleToggleResolve}
                      className={`text-sm px-3 py-2 rounded-xl border transition ${
                        post.isResolved
                          ? 'border-teal-200 bg-teal-50 text-teal-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {post.isResolved ? '✓ Resolved' : 'Mark resolved'}
                    </button>
                    <button
                      onClick={handleDeletePost}
                      disabled={deleting}
                      className="text-sm px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                    >
                      {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            {post.replyCount} {post.replyCount === 1 ? 'Reply' : 'Replies'}
          </h2>

          {post.replies?.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <div className="text-3xl mb-2">💭</div>
              <p className="text-gray-500 text-sm">No replies yet — be the first to answer!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {acceptedReply && (
                <ReplyCard
                  key={acceptedReply._id}
                  reply={acceptedReply}
                  isPostAuthor={isPostAuthor}
                  currentUserId={user?.id}
                  onUpvote={handleReplyUpvote}
                  onAccept={handleAcceptAnswer}
                  onAuthRequired={requireAuth}
                />
              )}
              {otherReplies.map((reply) => (
                <ReplyCard
                  key={reply._id}
                  reply={reply}
                  isPostAuthor={isPostAuthor}
                  currentUserId={user?.id}
                  onUpvote={handleReplyUpvote}
                  onAccept={handleAcceptAnswer}
                  onAuthRequired={requireAuth}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            {user ? 'Your Reply' : 'Sign in to Reply'}
          </h3>

          {user ? (
            <form onSubmit={handleSubmitReply}>
              <div className="flex gap-3">
                <Avatar name={user.fullName || user.firstName || '?'} imageUrl={user.imageUrl} />
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your answer or thoughts…"
                    rows={4}
                    maxLength={3000}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{replyContent.length}/3000</span>
                    <button
                      type="submit"
                      disabled={submitting || !replyContent.trim()}
                      className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                    >
                      {submitting ? 'Posting…' : 'Post Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500 flex-1">Join the discussion by signing in.</p>
              <button
                onClick={() => openSignIn()}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail
