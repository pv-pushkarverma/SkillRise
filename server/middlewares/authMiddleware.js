//Protect Educator Route
export const protectEducator = (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized Access' })
    }

    const role = req.auth.sessionClaims?.metadata?.role

    if (role !== 'educator') {
      return res.status(403).json({ success: false, message: 'Unauthorized Access' })
    }

    next()
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

//Protect Admin Route
export const protectAdmin = (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized Access' })
    }

    const role = req.auth.sessionClaims?.metadata?.role

    if (role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized Access' })
    }

    next()
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
