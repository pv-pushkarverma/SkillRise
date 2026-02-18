import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoId: String,
  watchTime: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 }
}, { timestamps: true }); // for progress tracking


const userSchema = new mongoose.Schema(
    {
        _id: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true ,unique: true},
        imageUrl: {type: String, required: true},

        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        // streak 
        streak: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date }
  },

  // Calendar
  activityDates: [Date],

  // Video Progress
  videos: [videoSchema]
    }, {timestamps: true}
)

const User = mongoose.model('User', userSchema)

export default User