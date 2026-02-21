/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useClerk, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import PostCard from '../../components/community/PostCard'
import CreatePostForm from '../../components/community/CreatePostForm'
import CreateGroupModal from '../../components/community/CreateGroupModal'
import GroupsPanel from '../../components/community/GroupsPanel'

const Community = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const { user } = useUser()
  const { openSignIn } = useClerk()

  const [groups, setGroups] = useState([])
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [tab, setTab] = useState('all')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [postsLoading, setPostsLoading] = useState(true)
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showGroupDrawer, setShowGroupDrawer] = useState(false)
  const [postCreating, setPostCreating] = useState(false)
  const [groupCreating, setGroupCreating] = useState(false)

  const pageRef = useRef(1)

  const requireAuth = () => openSignIn()

  const fetchGroups = useCallback(async () => {
    setGroupsLoading(true)
    try {
      const headers = user ? { Authorization: `Bearer ${await getToken()}` } : {}
      const { data } = await axios.get(`${backendUrl}/api/community/groups`, { headers })
      if (data.success) setGroups(data.groups)
    } catch (_) {}
    setGroupsLoading(false)
  }, [user, backendUrl, getToken])

  const fetchPosts = useCallback(
    async (reset = false) => {
      const p = reset ? 1 : pageRef.current
      if (reset) {
        setPostsLoading(true)
        setPosts([])
      } else setLoadingMore(true)

      try {
        const params = new URLSearchParams({ tab, page: p })
        if (selectedGroup) params.set('groupId', selectedGroup._id)
        const headers = user ? { Authorization: `Bearer ${await getToken()}` } : {}
        const { data } = await axios.get(`${backendUrl}/api/community/posts?${params}`, { headers })
        if (data.success) {
          setPosts((prev) => (reset ? data.posts : [...prev, ...data.posts]))
          setHasMore(data.hasMore)
          pageRef.current = p + 1
        }
      } catch (_) {}

      if (reset) setPostsLoading(false)
      else setLoadingMore(false)
    },
    [tab, selectedGroup, user, backendUrl, getToken]
  )

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    pageRef.current = 1
    fetchPosts(true)
  }, [tab, selectedGroup, user])

  const handleUpvote = async (postId) => {
    // optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              upvoteCount: p.isUpvoted ? p.upvoteCount - 1 : p.upvoteCount + 1,
              isUpvoted: !p.isUpvoted,
            }
          : p
      )
    )
    try {
      const token = await getToken()
      await axios.post(
        `${backendUrl}/api/community/posts/${postId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (_) {
      // revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                upvoteCount: p.isUpvoted ? p.upvoteCount + 1 : p.upvoteCount - 1,
                isUpvoted: !p.isUpvoted,
              }
            : p
        )
      )
    }
  }

  const handleCreatePost = async ({ title, content, tags, groupId }) => {
    setPostCreating(true)
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/community/posts`,
        { title, content, tags, groupId: groupId || null },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setShowCreatePost(false)
        pageRef.current = 1
        fetchPosts(true)
      }
    } catch (_) {}
    setPostCreating(false)
  }

  const handleCreateGroup = async ({ name, description, icon }) => {
    setGroupCreating(true)
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/community/groups`,
        { name, description, icon },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setGroups((prev) => [data.group, ...prev])
        setShowCreateGroup(false)
      }
    } catch (_) {}
    setGroupCreating(false)
  }

  const handleToggleMembership = async (group) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/community/groups/${group._id}/membership`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setGroups((prev) =>
          prev.map((g) =>
            g._id === group._id
              ? {
                  ...g,
                  isMember: data.isMember,
                  memberCount: data.isMember ? g.memberCount + 1 : g.memberCount - 1,
                }
              : g
          )
        )
        // deselect group if user just left it
        if (!data.isMember && selectedGroup?._id === group._id) setSelectedGroup(null)
      }
    } catch (_) {}
  }

  const groupPanelProps = {
    groups,
    selectedGroup,
    onSelectGroup: (g) => {
      setSelectedGroup(g)
      setShowGroupDrawer(false)
    },
    onToggleMembership: handleToggleMembership,
    onCreateGroup: () => setShowCreateGroup(true),
    isLoggedIn: !!user,
    onAuthRequired: requireAuth,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Ask questions, share knowledge, connect with fellow learners
              </p>
            </div>
            <button
              onClick={() => (user ? setShowCreatePost((v) => !v) : requireAuth())}
              className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md flex items-center gap-1.5 shrink-0"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">New Post</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-3 sticky top-20">
              {groupsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <GroupsPanel {...groupPanelProps} />
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowGroupDrawer(true)}
                className="flex items-center gap-1.5 text-sm border border-gray-200 bg-white px-3 py-2 rounded-xl hover:bg-gray-50 transition"
              >
                <span>📂</span>
                <span className="text-gray-700 font-medium">Groups</span>
              </button>
              {selectedGroup && (
                <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-sm px-3 py-1.5 rounded-xl">
                  <span>{selectedGroup.icon}</span>
                  <span className="font-medium truncate max-w-[120px]">{selectedGroup.name}</span>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="text-teal-400 hover:text-teal-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {showCreatePost && (
              <CreatePostForm
                groups={groups}
                onSubmit={handleCreatePost}
                onCancel={() => setShowCreatePost(false)}
                creating={postCreating}
              />
            )}

            <div className="flex gap-1 bg-white border border-gray-200 p-1 rounded-xl mb-5 w-fit">
              {[
                { id: 'all', label: 'All Posts' },
                { id: 'myGroups', label: 'My Groups', authRequired: true },
                { id: 'trending', label: '🔥 Trending' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    if (t.authRequired && !user) {
                      requireAuth()
                      return
                    }
                    setTab(t.id)
                  }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    tab === t.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {selectedGroup && (
              <div className="hidden lg:flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">Showing posts in</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  {selectedGroup.icon} {selectedGroup.name}
                </span>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 ml-1"
                >
                  Clear ×
                </button>
              </div>
            )}

            {postsLoading ? (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-3">💬</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">No posts yet</h3>
                <p className="text-gray-500 text-sm mb-5">
                  {tab === 'myGroups'
                    ? 'Posts from groups you join will appear here.'
                    : 'Be the first to start a discussion!'}
                </p>
                {user && (
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
                  >
                    Write the first post
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onUpvote={handleUpvote}
                    isLoggedIn={!!user}
                    onAuthRequired={requireAuth}
                  />
                ))}

                {hasMore && (
                  <button
                    onClick={() => fetchPosts(false)}
                    disabled={loadingMore}
                    className="text-sm text-gray-500 hover:text-gray-700 py-3 border border-gray-200 bg-white rounded-2xl transition hover:bg-gray-50 disabled:opacity-40"
                  >
                    {loadingMore ? 'Loading…' : 'Load more posts'}
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {showGroupDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowGroupDrawer(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Groups</h2>
              <button
                onClick={() => setShowGroupDrawer(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <GroupsPanel {...groupPanelProps} />
          </div>
        </div>
      )}

      {showCreateGroup && (
        <CreateGroupModal
          onSubmit={handleCreateGroup}
          onClose={() => setShowCreateGroup(false)}
          creating={groupCreating}
        />
      )}
    </div>
  )
}

export default Community
