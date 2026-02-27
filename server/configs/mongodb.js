import mongoose from 'mongoose'

//Database Connection
const connectDB = async () => {
  mongoose.connection.on('connected', () => console.info('Database Connected'))

  await mongoose.connect(`${process.env.MONGODB_URI}/SkillRise`)
}

export default connectDB
