import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'

const STORAGE_KEY = 'skillrise_pending_time_session'

// only track time on these pages, others don't matter
const PAGE_NAMES = {
  '/community': 'Community',
  '/roadmap': 'Roadmap',
  '/ai-chat': 'SkillRise AI',
  '/my-enrollments': 'My Enrollments',
}

const getPageName = (pathname) => {
  if (PAGE_NAMES[pathname]) return PAGE_NAMES[pathname]
  if (pathname.startsWith('/player/')) return 'Learning'
  if (pathname.startsWith('/quiz/')) return 'Quiz'
  if (pathname.startsWith('/community/')) return 'Community'
  return null // ignore Home, Explore, Course Details, Analytics etc.
}

const useTimeTracker = () => {
  const location = useLocation()
  const { getToken } = useAuth()
  const { user } = useUser()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // refs to track time without causing re-renders
  const visibleStartRef = useRef(Date.now()) // when user started looking at this page
  const accumulatedRef = useRef(0) // seconds we already counted from before (tab was hidden etc.)
  const isHiddenRef = useRef(false)
  const currentPathRef = useRef(location.pathname)
  const tokenRef = useRef(null)

  // cache the token so we can use it in beforeunload (we can't await there)
  useEffect(() => {
    if (!user) return
    getToken()
      .then((t) => {
        tokenRef.current = t
      })
      .catch(() => {})
  }, [getToken, user])

  // calculates how many seconds the user has actually been on this page (visible time only)
  const getVisibleSeconds = useCallback(() => {
    let elapsed = accumulatedRef.current
    if (!isHiddenRef.current) {
      elapsed += (Date.now() - visibleStartRef.current) / 1000
    }
    return elapsed
  }, [])

  // sends the time data to backend — skips if under 5 seconds (probably just passing through)
  const sendTimeData = useCallback(
    async (path, durationSeconds) => {
      if (!user) return
      const pageName = getPageName(path)
      if (!pageName || durationSeconds < 5) return
      try {
        const token = tokenRef.current || (await getToken())
        tokenRef.current = token
        await axios.post(
          `${backendUrl}/api/user/track-time`,
          { page: pageName, path, duration: Math.round(durationSeconds) },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // eslint-disable-next-line no-unused-vars
      } catch (_) {
        // don't crash the app if tracking fails, it's not that important
      }
    },
    [user, getToken, backendUrl]
  )

  // on load, check if there's unsent data from the last session (tab was closed) and send it now
  useEffect(() => {
    if (!user) return
    const pending = localStorage.getItem(STORAGE_KEY)
    if (!pending) return
    try {
      const { page, path, duration } = JSON.parse(pending)
      localStorage.removeItem(STORAGE_KEY)
      if (page && path && duration >= 5) {
        getToken()
          .then((token) => {
            tokenRef.current = token
            return axios.post(
              `${backendUrl}/api/user/track-time`,
              { page, path, duration: Math.round(duration) },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          })
          .catch(() => {})
      }
      // eslint-disable-next-line no-unused-vars
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [backendUrl, getToken, user])

  // pause the timer when user switches to another tab, resume when they come back
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // tab went to background, stop counting
        if (!isHiddenRef.current) {
          accumulatedRef.current += (Date.now() - visibleStartRef.current) / 1000
          isHiddenRef.current = true
        }
      } else {
        // user is back, start counting again
        isHiddenRef.current = false
        visibleStartRef.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // if user closes the tab, save progress to localStorage so it gets sent next time they open the app
  useEffect(() => {
    const handleUnload = () => {
      const seconds = getVisibleSeconds()
      const pageName = getPageName(currentPathRef.current)
      if (!pageName || seconds < 5) return
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            page: pageName,
            path: currentPathRef.current,
            duration: Math.round(seconds),
          })
        )
        // eslint-disable-next-line no-unused-vars
      } catch (_) {
        /* empty */
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [getVisibleSeconds])

  // whenever user navigates to a different page, send the time for the previous page
  useEffect(() => {
    const prevPath = currentPathRef.current
    currentPathRef.current = location.pathname

    // first render — prevPath and pathname are the same, just start the timer
    if (prevPath === location.pathname) {
      visibleStartRef.current = Date.now()
      accumulatedRef.current = 0
      isHiddenRef.current = false
      return
    }

    // send how long they spent on the previous page
    const seconds = getVisibleSeconds()
    sendTimeData(prevPath, seconds)

    // reset timer for the new page
    visibleStartRef.current = Date.now()
    accumulatedRef.current = 0
    isHiddenRef.current = document.hidden
  }, [location.pathname, sendTimeData, getVisibleSeconds])

  // every 2 minutes, send an update so long sessions still get recorded properly
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden || !user) return
      const seconds = getVisibleSeconds()
      if (seconds < 60) return
      sendTimeData(currentPathRef.current, seconds)
      // reset so we don't count the same time twice next heartbeat
      visibleStartRef.current = Date.now()
      accumulatedRef.current = 0
    }, 120_000)
    return () => clearInterval(interval)
  }, [sendTimeData, getVisibleSeconds, user])
}

export default useTimeTracker
