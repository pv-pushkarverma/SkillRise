import mongoose from 'mongoose'

const educatorApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    professionalTitle: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    expertise: {
      type: [String],
      required: true,
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const EducatorApplication = mongoose.model('EducatorApplication', educatorApplicationSchema)

export default EducatorApplication
