import mongoose from 'mongoose'

const replySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityPost',
      required: true,
      index: true,
    },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorImage: { type: String, default: '' },
    content: { type: String, required: true },
    upvotes: [{ type: String }],
    isAcceptedAnswer: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Reply = mongoose.model('CommunityReply', replySchema)
export default Reply
