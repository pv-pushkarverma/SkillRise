import { createOrder as stripeCreateOrder } from './stripe.service.js'
import { createOrder as razorpayCreateOrder } from './razorpay.service.js'

/**
 * Provider switch — delegates to the correct payment service.
 *
 * @param {'stripe' | 'razorpay'} provider
 * @param {object} data - Provider-specific input (see individual services)
 * @returns {Promise<object>} Provider-specific result (clientSecret or orderId/keyId)
 */
export const createOrder = async (provider, data) => {
  switch (provider) {
    case 'stripe':
      return stripeCreateOrder(data)
    case 'razorpay':
      return razorpayCreateOrder(data)
    default:
      throw new Error(`Unsupported payment provider: ${provider}`)
  }
}
