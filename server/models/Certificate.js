import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },

  certificateId: {
    type: String,
    required: true,
    unique: true,
  },

  issuedAt: {
    type: Date,
    default: Date.now,
  },

  pdfUrl: {
    type: String,
    required: true,
  },
})

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true })

const Certificate = mongoose.model('Certificate', certificateSchema)

export default Certificate
