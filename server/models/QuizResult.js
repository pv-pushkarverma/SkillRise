import mongoose from 'mongoose'

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    score: { type: Number, required: true }, // correct answers count
    total: { type: Number, required: true }, // total questions
    percentage: { type: Number, required: true },
    group: { type: String, enum: ['needs_review', 'on_track', 'mastered'], required: true },
    recommendations: { type: String, default: '' },
    answers: [{ type: Number }], // indices chosen by student
  },
  { timestamps: true }
)

const QuizResult = mongoose.model('QuizResult', quizResultSchema)
export default QuizResult
