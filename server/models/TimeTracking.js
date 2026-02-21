import mongoose from 'mongoose'

const timeTrackingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  page: { type: String, required: true },
  path: { type: String, required: true },
  duration: { type: Number, required: true }, // seconds
  date: { type: Date, default: Date.now },
})

const TimeTracking = mongoose.model('TimeTracking', timeTrackingSchema)

export default TimeTracking
