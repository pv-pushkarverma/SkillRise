import Purchase from '../../models/Purchase.js'
import User from '../../models/User.js'
import Course from '../../models/Course.js'

/**
 * Completes a purchase: enrolls the user in the course and marks the purchase
 * as completed. This is the single source of truth for enrollment — no other
 * part of the system should enroll users.
 *
 * Idempotent: calling this multiple times with the same purchaseId is safe.
 *
 * @param {string} purchaseId       - Our internal Purchase document _id
 * @param {string} providerPaymentId - Payment ID from Stripe or Razorpay
 */
export const completePurchase = async (purchaseId, providerPaymentId) => {
  const purchase = await Purchase.findById(purchaseId)

  if (!purchase) {
    console.warn(`completePurchase: purchase ${purchaseId} not found`)
    return
  }

  // Idempotency guard — webhook may fire more than once
  if (purchase.status === 'completed') return

  // Enroll user in course (addToSet prevents duplicates)
  await Course.findByIdAndUpdate(purchase.courseId, {
    $addToSet: { enrolledStudents: purchase.userId },
  })

  await User.findByIdAndUpdate(purchase.userId, {
    $addToSet: { enrolledCourses: purchase.courseId },
  })

  purchase.status = 'completed'
  purchase.providerPaymentId = providerPaymentId
  await purchase.save()
}
