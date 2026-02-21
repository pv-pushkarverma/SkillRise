import { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import MarkdownRenderer from '../../components/chatbot/MarkDownRenderer'

const SparkIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const HistoryList = ({ chatHistory, sessionId, onNewChat, onSelectChat, onDeleteChat }) => (
  <>
    <div className="p-4 border-b border-gray-100">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
        Chat History
      </p>
      <button
        onClick={onNewChat}
        className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition"
      >
        + New Chat
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {chatHistory.length === 0 ? (
        <p className="text-xs text-gray-400 text-center mt-6 px-3">No previous chats</p>
      ) : (
        chatHistory.map((chat) => (
          <div
            key={chat.sessionId}
            onClick={() => onSelectChat(chat.sessionId)}
            className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
              sessionId === chat.sessionId
                ? 'bg-teal-50 text-teal-800 border border-teal-100'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-xs">{chat.messages}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {new Date(chat.updatedAt).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteChat(chat.sessionId)
              }}
              className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-red-400 transition"
              aria-label="Delete chat"
            >
              <TrashIcon />
            </button>
          </div>
        ))
      )}
    </div>
  </>
)

const AIChat = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showMobileHistory, setShowMobileHistory] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    getToken()
      .then((token) =>
        axios.post(
          `${backendUrl}/api/user/previous-chats`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )
      .then((r) => setChatHistory(r.data.chats))
      .catch((e) => toast.error(e.message))
  }, [backendUrl, getToken])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea as user types
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [input])

  const startNewChat = () => {
    setMessages([])
    setInput('')
    setTyping(false)
    setSessionId('')
    setShowMobileHistory(false)
  }

  const fetchConversation = async (sid) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/${sid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSessionId(sid)
      setMessages(data.messages || [])
      setShowMobileHistory(false)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDeleteChat = async (sid) => {
    try {
      const token = await getToken()
      const { data } = await axios.delete(`${backendUrl}/api/user/chat/${sid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!data.success) return toast.error(data.message || 'Failed to delete chat')
      setChatHistory((prev) => prev.filter((c) => c.sessionId !== sid))
      if (sessionId === sid) {
        setSessionId('')
        setMessages([])
      }
      toast.success('Chat deleted')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: input }])
    setInput('')
    setTyping(true)
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/ai-chat`,
        { content: input, sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!sessionId) setSessionId(data.activeSessionId)
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: data.response },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-10 md:px-14 lg:px-36 py-10">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">SkillRise AI</h1>
          <p className="text-gray-500 mt-1">
            Ask about your courses, concepts, or paste code for help.
          </p>
        </div>

        {/* Chat card */}
        <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden h-[calc(100vh-240px)] min-h-[500px]">
          {/* History sidebar — desktop only */}
          <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-200">
            <HistoryList
              chatHistory={chatHistory}
              sessionId={sessionId}
              onNewChat={startNewChat}
              onSelectChat={fetchConversation}
              onDeleteChat={handleDeleteChat}
            />
          </aside>

          {/* Mobile history drawer */}
          {showMobileHistory && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowMobileHistory(false)}
              />
              <div className="relative w-72 bg-white flex flex-col h-full shadow-xl">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <p className="text-sm font-semibold text-gray-700">Chat History</p>
                  <button
                    onClick={() => setShowMobileHistory(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                    aria-label="Close history"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col flex-1 overflow-hidden border-t border-gray-100">
                  <HistoryList
                    chatHistory={chatHistory}
                    sessionId={sessionId}
                    onNewChat={startNewChat}
                    onSelectChat={fetchConversation}
                    onDeleteChat={handleDeleteChat}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile toolbar */}
            <div className="md:hidden px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setShowMobileHistory(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
                History
              </button>
              <button
                onClick={startNewChat}
                className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
              >
                + New Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center mb-3">
                    <SparkIcon className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="font-medium text-gray-700 mb-1">How can I help you?</h3>
                  <p className="text-sm text-gray-500">
                    Ask about your courses, paste code snippets, or explore any topic.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg._id || msg.id}
                      className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      {msg.role === 'assistant' ? (
                        <div className="w-8 h-8 shrink-0 rounded-full bg-teal-500 flex items-center justify-center">
                          <SparkIcon className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 shrink-0 rounded-full bg-slate-600 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-white"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Bubble */}
                      {msg.role === 'assistant' ? (
                        <div className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 markdown-body">
                          <MarkdownRenderer>{msg.content}</MarkdownRenderer>
                        </div>
                      ) : (
                        <div className="px-4 py-2.5 rounded-2xl bg-teal-600 text-white text-sm leading-relaxed whitespace-pre-wrap max-w-[75%]">
                          {msg.content}
                        </div>
                      )}
                    </div>
                  ))}

                  {typing && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-teal-500 flex items-center justify-center">
                        <SparkIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.15s' }}
                          />
                          <div
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.3s' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or paste some code..."
                  rows={1}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-gray-50 text-sm resize-none overflow-hidden"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm font-medium transition shrink-0"
                >
                  Send
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-1.5 text-right">Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat
