'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

/* ══════════════════════════════════════════════════════════════════════
   AudioPlayer — custom beautiful player for a Supabase-hosted audio URL
   ══════════════════════════════════════════════════════════════════════ */
export function AudioPlayer({ url, title }) {
  const audioRef              = useRef(null)
  const [playing,   setPlaying]   = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [duration,  setDuration]  = useState(0)
  const [volume,    setVolume]    = useState(1)
  const [loading,   setLoading]   = useState(true)
  const [audioError, setAudioError] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime    = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    const onLoaded  = () => { setDuration(audio.duration); setLoading(false) }
    const onEnded   = () => { setPlaying(false); setProgress(0) }
    const onError   = () => { setAudioError(true); setLoading(false) }
    const onWaiting = () => setLoading(true)
    const onCanPlay = () => setLoading(false)

    audio.addEventListener('timeupdate',     onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended',          onEnded)
    audio.addEventListener('error',          onError)
    audio.addEventListener('waiting',        onWaiting)
    audio.addEventListener('canplay',        onCanPlay)

    return () => {
      audio.removeEventListener('timeupdate',     onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended',          onEnded)
      audio.removeEventListener('error',          onError)
      audio.removeEventListener('waiting',        onWaiting)
      audio.removeEventListener('canplay',        onCanPlay)
    }
  }, [url])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || audioError) return
    try {
      if (playing) {
        audio.pause()
        setPlaying(false)
      } else {
        await audio.play()
        setPlaying(true)
      }
    } catch {
      setAudioError(true)
    }
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const pct = parseFloat(e.target.value)
    audio.currentTime = (pct / 100) * audio.duration
    setProgress(pct)
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const formatTime = (s) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00'
    const m   = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const currentSecs = audioRef.current?.duration
    ? (progress / 100) * audioRef.current.duration
    : 0

  if (audioError) {
    return (
      <div
        className="rounded-sm px-4 py-3 mt-4 text-sm font-body italic"
        style={{ background: 'rgba(180,34,72,0.06)', color: 'var(--ink-soft)', border: '1px solid rgba(200,155,58,0.12)' }}
      >
        🎙 Audio recording — <a href={url} target="_blank" rel="noopener noreferrer"
          className="underline" style={{ color: 'var(--gold-primary)' }}>click to open</a>
      </div>
    )
  }

  return (
    <div
      className="rounded-sm p-4 mt-4"
      style={{
        background: 'linear-gradient(135deg, rgba(45,8,16,0.05), rgba(200,155,58,0.07))',
        border: '1px solid rgba(200,155,58,0.18)',
      }}
    >
      <audio ref={audioRef} src={url} preload="metadata" crossOrigin="anonymous" />

      {/* Title row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#c9993a]">🎙</span>
        <span className="font-display italic text-sm flex-1 truncate" style={{ color: 'var(--ink-soft)' }}>
          {title || 'Voice Recording'}
        </span>
        {loading && !playing && (
          <span className="text-xs font-display" style={{ color: 'var(--ink-soft)', opacity: 0.5 }}>
            Loading…
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={loading && !playing}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, var(--burgundy-mid), var(--burgundy-bright))',
            color: '#f0d080',
            boxShadow: '0 2px 8px rgba(45,8,16,0.2)',
            opacity: loading && !playing ? 0.6 : 1,
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {loading && !playing ? (
            <span className="w-3 h-3 border border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#f0d080', borderTopColor: 'transparent' }} />
          ) : playing ? (
            <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor">
              <rect x="0"  y="0" width="4" height="12" rx="1"/>
              <rect x="7" y="0" width="4" height="12" rx="1"/>
            </svg>
          ) : (
            <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor">
              <path d="M0.5 0.5L10.5 6.5L0.5 12.5V0.5Z"/>
            </svg>
          )}
        </button>

        {/* Progress + time */}
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range" min="0" max="100" step="0.1"
            value={progress}
            onChange={handleSeek}
            className="audio-progress"
          />
          <div className="flex justify-between text-[10px] font-display" style={{ color: 'var(--ink-soft)' }}>
            <span>{formatTime(currentSecs)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs" onClick={() => {
            const newV = volume === 0 ? 1 : 0
            setVolume(newV)
            if (audioRef.current) audioRef.current.volume = newV
          }} style={{ cursor: 'pointer', color: 'var(--ink-soft)' }}>
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <input
            type="range" min="0" max="1" step="0.05"
            value={volume}
            onChange={handleVolume}
            className="audio-progress w-14"
          />
        </div>
      </div>
    </div>
  )
}


/* ══════════════════════════════════════════════════════════════════════
   AudioRecorder — record audio in the browser, preview, then onRecorded(blob)
   ══════════════════════════════════════════════════════════════════════ */
export function AudioRecorder({ onRecorded, disabled = false }) {
  const [status,   setStatus]   = useState('idle')     // idle | requesting | recording | preview
  const [seconds,  setSeconds]  = useState(0)
  const [audioURL, setAudioURL] = useState(null)
  const [error,    setError]    = useState(null)

  const mediaRef  = useRef(null)
  const chunksRef = useRef([])
  const timerRef  = useRef(null)
  const streamRef = useRef(null)

  // ── Pick the best supported MIME type ───────────────────────────────
  const getBestMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
    ]
    if (typeof MediaRecorder === 'undefined') return ''
    return candidates.find(m => {
      try { return MediaRecorder.isTypeSupported(m) } catch { return false }
    }) || ''
  }

  const startRecording = useCallback(async () => {
    setError(null)
    setStatus('requesting')

    // Request microphone
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount:    1,
          sampleRate:      44100,
          echoCancellation: true,
          noiseSuppression: true,
        }
      })
    } catch (err) {
      const msg =
        err.name === 'NotAllowedError'  ? 'Microphone permission was denied. Please click the 🔒 icon in your browser address bar and allow microphone access, then try again.' :
        err.name === 'NotFoundError'    ? 'No microphone found. Please connect a microphone and try again.' :
        err.name === 'NotReadableError' ? 'Your microphone is being used by another app. Please close other apps and try again.' :
                                          `Microphone error: ${err.message}`
      setError(msg)
      setStatus('idle')
      return
    }

    streamRef.current = stream

    // Create MediaRecorder
    const mimeType = getBestMimeType()
    let recorder
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    } catch {
      recorder = new MediaRecorder(stream) // fallback: no options
    }

    mediaRef.current  = recorder
    chunksRef.current = []

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      // Build final blob — use recorder's actual mimeType
      const actualMime = recorder.mimeType || mimeType || 'audio/webm'
      const blob       = new Blob(chunksRef.current, { type: actualMime })

      // Create preview URL
      const url = URL.createObjectURL(blob)
      setAudioURL(url)
      setStatus('preview')

      // Fire callback with blob
      onRecorded && onRecorded(blob)
    }

    recorder.onerror = (e) => {
      setError(`Recording error: ${e.error?.message || 'Unknown error'}`)
      stopRecording()
    }

    // Start collecting data every 250ms
    recorder.start(250)
    setStatus('recording')
    setSeconds(0)

    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }, [onRecorded])

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current)
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      try { mediaRef.current.stop() } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  const resetRecording = () => {
    stopRecording()
    if (audioURL) URL.revokeObjectURL(audioURL)
    setAudioURL(null)
    setStatus('idle')
    setSeconds(0)
    setError(null)
    onRecorded && onRecorded(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (audioURL) URL.revokeObjectURL(audioURL)
    }
  }, [audioURL])

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div
      className="rounded-sm p-5"
      style={{ background: 'rgba(45,8,16,0.03)', border: '1px solid rgba(200,155,58,0.15)' }}
    >
      <p className="section-label mb-3">Voice Recording</p>

      {/* Error */}
      {error && (
        <div
          className="mb-3 px-3 py-2 rounded-sm text-xs font-body leading-relaxed"
          style={{ background: 'rgba(180,34,72,0.08)', color: '#b82248', border: '1px solid rgba(180,34,72,0.15)' }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* IDLE */}
      {status === 'idle' && (
        <button
          onClick={startRecording}
          disabled={disabled}
          className="btn-primary w-full justify-center"
        >
          🎙 Start Recording
        </button>
      )}

      {/* REQUESTING (getting mic permission) */}
      {status === 'requesting' && (
        <div className="flex items-center justify-center gap-3 py-4">
          <span className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{ borderColor: 'rgba(200,155,58,0.3)', borderTopColor: 'var(--gold-primary)' }} />
          <span className="font-display text-base italic" style={{ color: 'var(--ink-soft)' }}>
            Waiting for microphone permission…
          </span>
        </div>
      )}

      {/* RECORDING */}
      {status === 'recording' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full recording-pulse flex-shrink-0"
              style={{ background: '#b81e30' }}
            />
            <span className="font-display text-lg" style={{ color: 'var(--ink-mid)' }}>
              Recording — {fmt(seconds)}
            </span>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={stopRecording} className="btn-secondary flex-1 justify-center">
              ⏹ Stop Recording
            </button>
            <button onClick={resetRecording} className="btn-secondary justify-center px-4"
              style={{ color: 'rgba(180,34,72,0.7)', borderColor: 'rgba(180,34,72,0.3)' }}
              title="Cancel">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {status === 'preview' && audioURL && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--gold-primary)' }}>✓</span>
            <span className="font-display italic text-sm" style={{ color: 'var(--gold-primary)' }}>
              Recording ready ({fmt(seconds)})
            </span>
          </div>
          <audio
            src={audioURL}
            controls
            className="w-full"
            style={{ height: '40px', borderRadius: '2px' }}
          />
          <button
            onClick={resetRecording}
            className="text-xs font-display underline text-left transition-colors"
            style={{ color: 'var(--ink-soft)' }}
          >
            ↺ Record again (replaces current recording)
          </button>
        </div>
      )}
    </div>
  )
}
