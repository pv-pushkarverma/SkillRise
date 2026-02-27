import { useState } from 'react'

const CreatePostForm = ({ groups, onSubmit, onCancel, creating }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [groupId, setGroupId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSubmit({ title, content, tags, groupId })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-5 shadow-sm"
    >
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">New Post</h3>

      <div className="flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title — be specific and clear"
          maxLength={200}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your question or share something useful with the community…"
          rows={4}
          maxLength={5000}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated): javascript, react…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">No group (global)</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.icon} {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={creating || !title.trim() || !content.trim()}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
        >
          {creating ? 'Posting…' : 'Post'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CreatePostForm
