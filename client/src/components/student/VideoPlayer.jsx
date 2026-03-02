import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Settings,
} from 'lucide-react'

const formatTime = (secs) => {
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
  const handleDuration = (totalDuration) => {
    setDuration(totalDuration)
    durationRef.current = totalDuration
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
            <Play className="w-5 h-5" />
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
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={() => skipTo(-10)}
                className="hover:text-teal-400 transition flex items-center gap-0.5"
                title="Rewind 10s (←)"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[10px] font-bold leading-none">10</span>
              </button>

              <button
                onClick={() => skipTo(10)}
                className="hover:text-teal-400 transition flex items-center gap-0.5"
                title="Forward 10s (→)"
              >
                <span className="text-[10px] font-bold leading-none">10</span>
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMuted((m) => !m)}
                className="hover:text-teal-400 transition"
                title="Mute"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
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
                {formatTime(played * duration)} / {formatTime(duration)}
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
                  <Settings className="w-4 h-4" />
                </button>
                {showQualities && (
                  <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <p className="text-[10px] text-white/40 uppercase tracking-wide px-4 pt-2 pb-1 font-semibold">
                      Quality
                    </p>
                    {QUALITIES.map((qualityOption) => (
                      <button
                        key={qualityOption.value}
                        onClick={() => {
                          setQuality(qualityOption.value)
                          setShowQualities(false)
                          const ip = playerRef.current?.getInternalPlayer()
                          if (ip?.setPlaybackQuality) ip.setPlaybackQuality(qualityOption.value)
                        }}
                        className={`block w-full px-5 py-1.5 text-xs text-left transition ${
                          quality === qualityOption.value
                            ? 'text-teal-400 font-bold bg-white/5'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {qualityOption.label}
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
                    {SPEEDS.map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          setSpeed(spd)
                          setShowSpeeds(false)
                        }}
                        className={`block w-full px-5 py-1.5 text-xs text-left transition ${
                          speed === spd
                            ? 'text-teal-400 font-bold bg-white/5'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {spd}×
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
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
