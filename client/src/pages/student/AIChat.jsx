import { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios'
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import MarkdownRenderer from '../../components/chatbot/MarkDownRenderer';

const AIChat = () => {

  const { backendUrl, getToken } = useContext(AppContext)
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

  const fetchConversation = async (sessionId) => {
    try {
    const token = await getToken()
    const { data } = await axios.post(`${backendUrl}/api/user/${sessionId}`,
      {},
      {headers: {Authorization: `Bearer ${token}`}})
      setMessages(data.messages)
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
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-gray-50 border-r flex flex-col">
          {/* New Chat */}
          <div className="p-3 border-b flex items-center justify-between">
            <button className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              onClick={() => {
                setMessages([])
                setInput('')
                setTyping(false)
              }}>
              + New Chat
            </button>

            <button onClick={() => setSidebarOpen(false)} className="ml-2 p-3 hover:bg-gray-200 rounded-full">
              ✕
            </button>
        </div>
          
          {/* History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatHistory.map(chat => (
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
                <div className="text-sm font-medium truncate hover:cursor-pointer" onClick={() => {
                  fetchConversation(chat.sessionId)
                }}>{chat.messages}</div>
                <div className="text-xs text-gray-500 mt-1">{chat.updatedAt}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="fixed top-4 left-4 p-2 bg-white border rounded-lg shadow-sm"
            >
              ☰
            </button>
          )}

          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(msg => (
              <div key={msg._id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
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
        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
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