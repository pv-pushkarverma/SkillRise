import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

const fmt = (secs) => {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const QUALITIES = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: 'hd1080' },
  { label: '720p', value: 'hd720' },
  { label: '480p', value: 'large' },
  { label: '360p', value: 'medium' },
  { label: '240p', value: 'small' },
]

/* ── Icons ── */
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
)
const IconVolume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
)
const IconMute = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
)
const IconSkipBack = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </svg>
)
const IconSkipForward = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2z" />
  </svg>
)
const IconFullscreen = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
)
const IconExitFullscreen = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
)
const IconQuality = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
)

const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null)
  const containerRef = useRef(null)
  const hideTimer = useRef(null)
  const hintTimer = useRef(null)

  /* state */
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [seeking, setSeeking] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [showSpeeds, setShowSpeeds] = useState(false)
  const [quality, setQuality] = useState('auto')
  const [showQualities, setShowQualities] = useState(false)
  const [skipHint, setSkipHint] = useState(null) // '+10s' | '-10s' | null

  /* refs for use inside window event handlers (avoids stale closures) */
  const playedRef = useRef(0)
  const durationRef = useRef(0)
  const skipFnRef = useRef(null)
  const toggleFnRef = useRef(null)

  /* keep refs current */
  const keepControls = () => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 2500)
  }

  const showSkipHint = (label) => {
    setSkipHint(label)
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setSkipHint(null), 700)
  }

  const skipTo = (secs) => {
    if (!durationRef.current) return
    const newFrac = Math.max(0, Math.min(1, playedRef.current + secs / durationRef.current))
    setPlayed(newFrac)
    playedRef.current = newFrac
    playerRef.current?.seekTo(newFrac)
    showSkipHint(secs > 0 ? `+${secs}s` : `${secs}s`)
    keepControls()
  }

  const togglePlay = () => {
    setPlaying((p) => !p)
    keepControls()
  }

  /* always-fresh refs */
  skipFnRef.current = skipTo
  toggleFnRef.current = togglePlay

  /* keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        skipFnRef.current(-10)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        skipFnRef.current(10)
      }
      if (e.key === ' ') {
        e.preventDefault()
        toggleFnRef.current()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* progress / duration */
  const handleProgress = ({ played: p }) => {
    if (!seeking) {
      setPlayed(p)
      playedRef.current = p
    }
  }
  const handleDuration = (d) => {
    setDuration(d)
    durationRef.current = d
  }

  /* seek bar */
  const handleSeekDown = () => setSeeking(true)
  const handleSeekMove = (e) => setPlayed(parseFloat(e.target.value))
  const handleSeekUp = (e) => {
    setSeeking(false)
    playerRef.current?.seekTo(parseFloat(e.target.value))
  }

  /* fullscreen */
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const resolveUrl = (raw) =>
    raw?.includes('youtu.be')
      ? `https://www.youtube.com/watch?v=${raw.split('/').pop().split('?')[0]}`
      : raw

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden select-none"
      onMouseMove={keepControls}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* ReactPlayer — native controls hidden */}
      <div className="w-full aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={resolveUrl(url)}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={speed}
          controls={false}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={() => {
            setPlaying(false)
            setPlayed(0)
            setShowControls(true)
          }}
          config={{
            youtube: {
              playerVars: { modestbranding: 1, rel: 0, showinfo: 0, iv_load_policy: 3 },
            },
          }}
        />
      </div>

      {/* Click overlay — toggles play, sits above iframe but below controls */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ bottom: 56 }}
        onClick={togglePlay}
      />

      {/* Centre play icon when paused */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ bottom: 56 }}
        >
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <IconPlay />
          </div>
        </div>
      )}

      {/* Skip hint */}
      {skipHint && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ bottom: 56 }}
        >
          <div className="bg-black/70 backdrop-blur-sm text-white text-lg font-bold px-5 py-2 rounded-xl">
            {skipHint}
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-10 pb-3">
          {/* Seek bar */}
          <div className="relative h-4 flex items-center mb-2 cursor-pointer">
            <div className="absolute inset-y-0 flex items-center w-full pointer-events-none">
              <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full transition-none"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={played}
              onMouseDown={handleSeekDown}
              onChange={handleSeekMove}
              onMouseUp={handleSeekUp}
              onTouchStart={handleSeekDown}
              onTouchEnd={handleSeekUp}
              className="relative w-full opacity-0 cursor-pointer h-full z-10"
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between text-white">
            {/* Left: play + skip + mute + volume + time */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="hover:text-teal-400 transition"
                title="Play / Pause (Space)"
              >
                {playing ? <IconPause /> : <IconPlay />}
              </button>

              <button
                onClick={() => skipTo(-10)}
                className="hover:text-teal-400 transition flex items-center gap-0.5"
                title="Rewind 10s (←)"
              >
                <IconSkipBack />
                <span className="text-[10px] font-bold leading-none">10</span>
              </button>

              <button
                onClick={() => skipTo(10)}
                className="hover:text-teal-400 transition flex items-center gap-0.5"
                title="Forward 10s (→)"
              >
                <span className="text-[10px] font-bold leading-none">10</span>
                <IconSkipForward />
              </button>

              <button
                onClick={() => setMuted((m) => !m)}
                className="hover:text-teal-400 transition"
                title="Mute"
              >
                {muted || volume === 0 ? <IconMute /> : <IconVolume />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value))
                  setMuted(false)
                }}
                className="w-16 h-0.5 accent-teal-400 cursor-pointer hidden sm:block"
              />

              <span className="text-xs text-white/70 tabular-nums hidden sm:block">
                {fmt(played * duration)} / {fmt(duration)}
              </span>
            </div>

            {/* Right: speed + fullscreen */}
            <div className="flex items-center gap-3">
              {/* Quality selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowQualities((s) => !s)
                    setShowSpeeds(false)
                  }}
                  className="hover:text-teal-400 transition"
                  title="Video quality"
                >
                  <IconQuality />
                </button>
                {showQualities && (
                  <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <p className="text-[10px] text-white/40 uppercase tracking-wide px-4 pt-2 pb-1 font-semibold">
                      Quality
                    </p>
                    {QUALITIES.map((q) => (
                      <button
                        key={q.value}
                        onClick={() => {
                          setQuality(q.value)
                          setShowQualities(false)
                          const ip = playerRef.current?.getInternalPlayer()
                          if (ip?.setPlaybackQuality) ip.setPlaybackQuality(q.value)
                        }}
                        className={`block w-full px-5 py-1.5 text-xs text-left transition ${
                          quality === q.value
                            ? 'text-teal-400 font-bold bg-white/5'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Speed selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSpeeds((s) => !s)
                    setShowQualities(false)
                  }}
                  className="text-xs font-semibold hover:text-teal-400 transition w-8 text-center"
                  title="Playback speed"
                >
                  {speed}×
                </button>
                {showSpeeds && (
                  <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <p className="text-[10px] text-white/40 uppercase tracking-wide px-4 pt-2 pb-1 font-semibold">
                      Speed
                    </p>
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSpeed(s)
                          setShowSpeeds(false)
                        }}
                        className={`block w-full px-5 py-1.5 text-xs text-left transition ${
                          speed === s
                            ? 'text-teal-400 font-bold bg-white/5'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleFullscreen}
                className="hover:text-teal-400 transition"
                title="Fullscreen"
              >
                {isFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
