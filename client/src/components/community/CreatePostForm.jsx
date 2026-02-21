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
      className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">New Post</h3>

      <div className="flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title — be specific and clear"
          maxLength={200}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your question or share something useful with the community…"
          rows={4}
          maxLength={5000}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated): javascript, react…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">No group (global)</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.icon} {g.name}
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
          className="px-5 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CreatePostForm
