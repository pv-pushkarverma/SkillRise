import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    userId: {
      type: String,
      ref: 'User',
      required: true,
    },

    amount: { type: Number, required: true },

    currency: { type: String, default: 'INR' },

    paymentProvider: {
      type: String,
      enum: ['stripe', 'razorpay'],
      required: true,
    },

    providerOrderId: { type: String },

    providerPaymentId: { type: String },

    failureReason: { type: String },

    status: {
      type: String,
      enum: ['created', 'pending', 'completed', 'failed', 'refunded'],
      default: 'created',
    },
  },
  { timestamps: true }
)

const Purchase = mongoose.model('Purchase', purchaseSchema)
export default Purchase
