import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { createId, inputCls, Field, Toggle } from './CourseFormShared'

const LECTURE_DEFAULTS = {
  lectureTitle: '',
  lectureDuration: '',
  lectureUrl: '',
  isPreviewFree: false,
}

const LectureModal = ({ onClose, onAdd }) => {
  const [details, setDetails] = useState(LECTURE_DEFAULTS)

  const handleAdd = () => {
    if (!details.lectureTitle) {
      toast.error('Please add a lecture title')
      return
    }
    if (!details.lectureDuration || isNaN(details.lectureDuration)) {
      toast.error('Please add a valid duration')
      return
    }
    try {
      new URL(details.lectureUrl)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }
    onAdd(details)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Add Lecture</h3>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the lecture details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-xl hover:bg-gray-100"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field label="Lecture Title">
            <input
              autoFocus
              type="text"
              value={details.lectureTitle}
              onChange={(e) => setDetails((p) => ({ ...p, lectureTitle: e.target.value }))}
              placeholder="e.g. Introduction to React Hooks"
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (minutes)">
              <input
                type="number"
                min="0"
                value={details.lectureDuration}
                onChange={(e) => setDetails((p) => ({ ...p, lectureDuration: e.target.value }))}
                placeholder="0"
                className={inputCls}
              />
            </Field>
            <Field label="Free Preview">
              <div className="h-[42px] flex items-center gap-3">
                <Toggle
                  checked={details.isPreviewFree}
                  onChange={() => setDetails((p) => ({ ...p, isPreviewFree: !p.isPreviewFree }))}
                />
                <span className="text-sm text-gray-600">
                  {details.isPreviewFree ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </Field>
          </div>

          <Field label="Video URL">
            <input
              type="text"
              value={details.lectureUrl}
              onChange={(e) => setDetails((p) => ({ ...p, lectureUrl: e.target.value }))}
              placeholder="https://youtube.com/watch?v=..."
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">
              Supports YouTube, Vimeo, and direct video links
            </p>
          </Field>
        </div>

        <div className="flex items-center gap-3 px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition"
          >
            Add Lecture
          </button>
        </div>
      </div>
    </div>
  )
}

const ChapterList = ({ chapters, setChapters }) => {
  const newChapterRef = useRef(null)

  const [addingChapter, setAddingChapter] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [editingChapterId, setEditingChapterId] = useState(null)
  const [editingChapterTitle, setEditingChapterTitle] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const startAddingChapter = () => {
    setAddingChapter(true)
    setTimeout(() => newChapterRef.current?.focus(), 50)
  }

  const confirmAddChapter = () => {
    const title = newChapterTitle.trim()
    if (title) {
      setChapters((prev) => [
        ...prev,
        {
          chapterId: createId(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: prev.length + 1,
        },
      ])
    }
    setNewChapterTitle('')
    setAddingChapter(false)
  }

  const confirmEditChapter = () => {
    const title = editingChapterTitle.trim()
    if (title) {
      setChapters((prev) =>
        prev.map((c) => (c.chapterId === editingChapterId ? { ...c, chapterTitle: title } : c))
      )
    }
    setEditingChapterId(null)
  }

  const toggleChapter = (id) =>
    setChapters((prev) =>
      prev.map((c) => (c.chapterId === id ? { ...c, collapsed: !c.collapsed } : c))
    )
  const removeChapter = (id) => setChapters((prev) => prev.filter((c) => c.chapterId !== id))

  const removeLecture = (chapterId, li) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.chapterId !== chapterId) return c
        const content = [...c.chapterContent]
        content.splice(li, 1)
        return { ...c, chapterContent: content }
      })
    )
  }

  const addLecture = (details) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.chapterId !== currentChapterId) return c
        const lastOrder =
          c.chapterContent.length > 0
            ? c.chapterContent[c.chapterContent.length - 1].lectureOrder + 1
            : 1
        return {
          ...c,
          chapterContent: [
            ...c.chapterContent,
            { ...details, lectureOrder: lastOrder, lectureId: createId() },
          ],
        }
      })
    )
  }

  const openModal = (chapterId) => {
    setCurrentChapterId(chapterId)
    setShowModal(true)
  }

  return (
    <>
      <div className="space-y-3">
        {chapters.map((chapter, ci) => (
          <div
            key={chapter.chapterId}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gray-50 border-b border-gray-200 group">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.chapterId)}
                className="text-gray-400 hover:text-gray-600 transition shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-4 h-4 transition-transform duration-200 ${chapter.collapsed ? '' : 'rotate-90'}`}
                >
                  <path d="M10 17l5-5-5-5v10z" />
                </svg>
              </button>

              <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {ci + 1}
              </div>

              {/* double-click to rename */}
              {editingChapterId === chapter.chapterId ? (
                <input
                  autoFocus
                  type="text"
                  value={editingChapterTitle}
                  onChange={(e) => setEditingChapterTitle(e.target.value)}
                  onBlur={confirmEditChapter}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      confirmEditChapter()
                    }
                    if (e.key === 'Escape') setEditingChapterId(null)
                  }}
                  className="flex-1 text-sm font-semibold text-gray-800 bg-white border border-teal-400 rounded-lg px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              ) : (
                <button
                  type="button"
                  onDoubleClick={() => {
                    setEditingChapterId(chapter.chapterId)
                    setEditingChapterTitle(chapter.chapterTitle)
                  }}
                  className="flex-1 text-left text-sm font-semibold text-gray-800 truncate hover:text-teal-700 transition"
                  title="Double-click to rename"
                >
                  {chapter.chapterTitle}
                </button>
              )}

              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {chapter.chapterContent.length} lecture
                  {chapter.chapterContent.length !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => removeChapter(chapter.chapterId)}
                  className="text-gray-300 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
                  title="Remove chapter"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            </div>

            {!chapter.collapsed && (
              <div className="divide-y divide-gray-100">
                {chapter.chapterContent.length === 0 && (
                  <p className="px-4 py-3 text-xs text-gray-400 italic">No lectures yet</p>
                )}

                {chapter.chapterContent.map((lecture, li) => (
                  <div
                    key={li}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition group/lec"
                  >
                    <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-2.5 h-2.5 text-teal-600"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 flex-1 truncate">
                      {li + 1}. {lecture.lectureTitle}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {lecture.lectureDuration}m
                    </span>
                    {lecture.isPreviewFree && (
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-full shrink-0">
                        FREE
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeLecture(chapter.chapterId, li)}
                      className="text-gray-300 hover:text-red-500 transition shrink-0 opacity-0 group-hover/lec:opacity-100 p-1 rounded-lg hover:bg-red-50"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                ))}

                <div className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => openModal(chapter.chapterId)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Add Lecture
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {addingChapter ? (
          <div className="flex items-center gap-2.5 px-4 py-3 border-2 border-teal-400 rounded-xl bg-teal-50/30">
            <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              {chapters.length + 1}
            </div>
            <input
              ref={newChapterRef}
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  confirmAddChapter()
                }
                if (e.key === 'Escape') {
                  setAddingChapter(false)
                  setNewChapterTitle('')
                }
              }}
              placeholder="Chapter title…"
              className="flex-1 text-sm font-semibold text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
            />
            <button
              type="button"
              onClick={confirmAddChapter}
              className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setAddingChapter(false)
                setNewChapterTitle('')
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startAddingChapter}
            className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/20 transition flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Chapter
          </button>
        )}
      </div>

      {showModal && <LectureModal onClose={() => setShowModal(false)} onAdd={addLecture} />}
    </>
  )
}

export default ChapterList
