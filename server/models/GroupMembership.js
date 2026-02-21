import mongoose from 'mongoose'

const groupMembershipSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityGroup', required: true },
  },
  { timestamps: true }
)

groupMembershipSchema.index({ userId: 1, groupId: 1 }, { unique: true })

const GroupMembership = mongoose.model('GroupMembership', groupMembershipSchema)
export default GroupMembership
