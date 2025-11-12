import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true, enum: ['system', 'user', 'assistant']},
    content: { type: String, required: true}
}, { timestamps: true})

const chatSessionSchema = new mongoose.Schema({
    
    userId: { type: String, required: true },
    sessionId: { type: String, required: true, unique: true},
    messages: [ messageSchema ]
}, { timestamps: true })

const ChatSession = mongoose.model('ChatSession', chatSessionSchema)

export default ChatSession