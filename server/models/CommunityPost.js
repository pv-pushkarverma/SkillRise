import mongoose from 'mongoose'

const communityPostSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorImage: { type: String, default: '' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityGroup', default: null },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    upvotes: [{ type: String }], // array of userIds
    replyCount: { type: Number, default: 0 },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

communityPostSchema.index({ groupId: 1, createdAt: -1 })
communityPostSchema.index({ createdAt: -1 })

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema)
export default CommunityPost
