import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
)

const quizSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    chapterTitle: { type: String, default: '' },
    courseTitle: { type: String, default: '' },
    questions: [questionSchema],
  },
  { timestamps: true }
)

// Unique quiz per chapter per course
quizSchema.index({ courseId: 1, chapterId: 1 }, { unique: true })

const Quiz = mongoose.model('Quiz', quizSchema)
export default Quiz
