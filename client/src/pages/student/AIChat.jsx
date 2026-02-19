import { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import MarkdownRenderer from '../../components/chatbot/MarkDownRenderer';
import { assets } from '../../assets/assets';

const AIChat = () => {

  const { backendUrl, getToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [ sessionId, setSessionId ] = useState('')

  const [messages, setMessages] = useState([]);
  const [ chatHistory, setChatHistory ] = useState([])
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getToken().then( token => {
      return axios.post(
        `${backendUrl}/api/user/previous-chats`,{},
        {headers: {Authorization: `Bearer ${token}`}})
    })
    .then(response => setChatHistory(response.data.chats))
    .catch (error => toast.error(error.message))
  },[backendUrl, getToken])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversation = async (selectedSessionId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/user/${selectedSessionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setSessionId(selectedSessionId)
      setMessages(data.messages || [])
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteChat = async (selectedSessionId) => {
    try {
      const token = await getToken()
      const { data } = await axios.delete(
        `${backendUrl}/api/user/chat/${selectedSessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!data.success) {
        return toast.error(data.message || 'Failed to delete chat')
      }

      setChatHistory(prev => prev.filter(chat => chat.sessionId !== selectedSessionId))

      if (sessionId === selectedSessionId) {
        setSessionId('')
        setMessages([])
      }

      toast.success('Chat deleted')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { id: Date.now(), role: 'user', content: input }]);
    setInput('');
    setTyping(true);

    try {
    // Call your backend API
    const token = await getToken()
    const { data } = await axios.post(`${backendUrl}/api/user/ai-chat`,
      {content: input, sessionId},
      {headers: {Authorization: `Bearer ${token}`}})

      if(!sessionId){
        setSessionId(data.activeSessionId)
      }

    // Add AI response
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      role: 'assistant', 
      content: data.response 
      }]);
    } catch (error) {
    console.error('Error:', error);
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      role: 'assistant', 
      content: "Sorry, I'm having trouble connecting. Please try again." 
    }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-teal-50/40 via-white to-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white/90 border-r border-gray-200 flex-col backdrop-blur">
        {/* Logo + Home */}
        <div className="px-3 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 w-full group"
          >
            <img
              src={assets.logo_light}
              alt="SkillRise"
              className="w-full max-w-full transition-transform duration-150 group-hover:scale-[1.01]"
            />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-3 pb-3 border-b border-gray-100 space-y-2">
          <button className="w-full py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 text-sm md:text-base font-medium shadow-sm"
            onClick={() => {
              setMessages([])
              setInput('')
              setTyping(false)
              setSessionId('')
            }}>
            + New Chat
          </button>
          <p className="text-[11px] md:text-xs uppercase tracking-wide text-gray-400 font-semibold">
            Recent chats
          </p>
        </div>
        
        {/* History */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 space-y-1">
          {chatHistory.map(chat => (
            <div
              key={chat.sessionId}
              className={`w-full px-3 py-2 rounded-xl text-xs md:text-sm flex items-center justify-between gap-2 cursor-pointer ${
                sessionId === chat.sessionId
                  ? 'bg-teal-50 text-teal-800 border border-teal-100'
                  : 'hover:bg-gray-50 text-gray-700 border border-transparent'
              }`}
              onClick={() => fetchConversation(chat.sessionId)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {chat.messages}
                </div>
                <div className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                  {new Date(chat.updatedAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteChat(chat.sessionId)
                }}
                className="shrink-0 p-1 rounded-full hover:bg-red-50 text-xs text-red-500"
                aria-label="Delete chat"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 h-full bg-white/95 border-r border-gray-200 flex flex-col backdrop-blur">
            {/* Logo + Close */}
            <div className="px-3 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
              <button
                onClick={() => {
                  navigate('/')
                  setSidebarOpen(false)
                }}
                className="flex items-center gap-2 w-full group"
              >
                <img
                  src={assets.logo_light}
                  alt="SkillRise"
                  className="w-full max-w-full transition-transform duration-150 group-hover:scale-[1.01]"
                />
              </button>
              <button onClick={() => setSidebarOpen(false)} className="ml-2 p-2 hover:bg-gray-200 rounded-full text-gray-600">
                ✕
              </button>
            </div>

            {/* New Chat */}
            <div className="px-3 pt-3 pb-3 border-b border-gray-100 space-y-2">
              <button className="w-full py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 text-sm font-medium shadow-sm"
                onClick={() => {
                  setMessages([])
                  setInput('')
                  setTyping(false)
                  setSessionId('')
                  setSidebarOpen(false)
                }}>
                + New Chat
              </button>
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                Recent chats
              </p>
            </div>
            
            {/* History */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 space-y-1">
              {chatHistory.map(chat => (
                <div
                  key={chat.sessionId}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 cursor-pointer ${
                    sessionId === chat.sessionId
                      ? 'bg-teal-50 text-teal-800 border border-teal-100'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                  onClick={() => {
                    fetchConversation(chat.sessionId)
                    setSidebarOpen(false)
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {chat.messages}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(chat.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChat(chat.sessionId)
                    }}
                    className="shrink-0 p-1 rounded-full hover:bg-red-50 text-xs text-red-500"
                    aria-label="Delete chat"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-2 border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="max-w-3xl mx-auto">
            {/* Mobile top bar with hamburger */}
            <div className="flex items-center justify-between md:hidden mb-2">
              <button
                type="button"
                className="p-2 rounded-lg border border-gray-200 bg-white shadow-sm text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
              <span className="text-sm font-semibold text-gray-900">
                SkillRise AI
              </span>
            </div>

            {/* Original header for medium and up */}
            <div className="hidden md:block">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                SkillRise AI
              </p>
              <h1 className="mt-2 text-lg md:text-xl font-semibold text-gray-900">
                Ask anything about your learning, courses, or code.
              </h1>
              <p className="mt-1 text-xs md:text-sm text-gray-500">
                Get explanations, summaries, and step‑by‑step help tailored to your SkillRise content.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4 mt-2 h-full">
            {/* Mobile empty-state centered intro, hidden once there are messages */}
            {messages.length === 0 && (
              <div className="md:hidden h-full flex flex-col items-center justify-center text-center text-gray-600 px-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to SkillRise AI
                </h2>
                <p className="text-sm">
                  Ask about your courses, concepts you’re learning, or paste code to get help.
                </p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg._id || msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  msg.role === 'assistant' ? 'bg-teal-500' : 'bg-gray-600'
                }`}>
                  <span className="text-white text-sm">{msg.role === 'assistant' ? '🤖' : '👤'}</span>
                </div>
                <div className={`inline-block px-4 py-2 rounded-lg prose prose-neutral max-w-none markdown-body ${
                  msg.role === 'assistant' ? 'bg-gray-100' : 'bg-teal-500 text-white'
                }`}>
                  <MarkdownRenderer>{msg.content}</MarkdownRenderer>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or paste some code..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;