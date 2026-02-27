import { clerkClient } from '@clerk/express'

//Protect Educator Route
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    const clerkUser = await clerkClient.users.getUser(userId)

    if (clerkUser.publicMetadata.role !== 'educator') {
      return res.json({
        success: false,
        message: 'Unauthorized Access',
      })
    }

    next()
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}

//Protect Admin Route
export const protectAdmin = async (req, res, next) => {
  try {
    const userId = req.auth.userId
    const clerkUser = await clerkClient.users.getUser(userId)

    if (clerkUser.publicMetadata.role !== 'admin') {
      return res.json({
        success: false,
        message: 'Unauthorized Access',
      })
    }

    next()
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
}
