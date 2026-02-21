import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '💬' },
    memberCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    createdBy: { type: String, default: 'system' },
    isOfficial: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Group = mongoose.model('CommunityGroup', groupSchema)
export default Group
