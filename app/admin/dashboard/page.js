'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AudioRecorder } from '@/components/Audio'

/* ─── Speech-to-Text hook ───────────────────────────────────────────── */
function useSpeechToText({ onResult, onError, lang }) {
  const recogRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition))
  }, [])

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { onError?.('Use Chrome or Edge for dictation.'); return }

    const recog = new SR()
    recog.lang            = lang
    recog.interimResults  = true
    recog.continuous      = true
    recog.maxAlternatives = 1

    recog.onresult = (e) => {
      let interim = '', final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else interim += t
      }
      onResult?.({ final, interim })
    }
    recog.onerror = (e) => {
      const msgs = {
        'not-allowed': 'Microphone permission denied.',
        'no-speech':   'No speech detected — please speak louder.',
        'network':     'Network error during recognition.',
        'aborted':     null,
      }
      if (msgs[e.error]) onError?.(msgs[e.error])
      setListening(false)
    }
    recog.onend = () => setListening(false)

    recogRef.current = recog
    recog.start()
    setListening(true)
  }, [lang, onError, onResult])

  const stop = useCallback(() => {
    recogRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, supported, start, stop }
}

/* ─── Dashboard ─────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter()

  // Form
  const [title,     setTitle]     = useState('')
  const [content,   setContent]   = useState('')
  const [category,  setCategory]  = useState('poem')
  const [audioBlob, setAudioBlob] = useState(null)

  // Publish state — split so UI shows exactly which step is happening
  const [uploadProgress, setUploadProgress] = useState(null) // null | 'uploading' | 'done'
  const [publishing,     setPublishing]     = useState(false)
  const [success,        setSuccess]        = useState(false)
  const [error,          setError]          = useState(null)

  // Posts list
  const [posts,        setPosts]        = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [deletingId,   setDeletingId]   = useState(null)

  // Dictation
  const [dictLang,    setDictLang]    = useState('hi-IN')
  const [speechError, setSpeechError] = useState(null)
  const [interimText, setInterimText] = useState('')
  const textareaRef = useRef(null)
  const cursorRef   = useRef(0)

  // ── Load posts ───────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    try {
      const res  = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch { setPosts([]) }
    finally  { setLoadingPosts(false) }
  }, [])
  useEffect(() => { fetchPosts() }, [fetchPosts])

  // ── Speech handlers ──────────────────────────────────────────────────
  const handleSpeechResult = useCallback(({ final, interim }) => {
    setInterimText(interim)
    if (final) {
      setContent(prev => {
        const pos    = textareaRef.current?.selectionStart ?? prev.length
        const result = prev.slice(0, pos) + final + ' ' + prev.slice(pos)
        cursorRef.current = pos + final.length + 1
        return result
      })
      setInterimText('')
    }
  }, [])

  const { listening, supported: speechSupported, start: startSpeech, stop: stopSpeech } =
    useSpeechToText({ onResult: handleSpeechResult, onError: setSpeechError, lang: dictLang })

  const toggleDictation = () => {
    setSpeechError(null)
    if (listening) stopSpeech()
    else {
      cursorRef.current = textareaRef.current?.selectionStart ?? content.length
      startSpeech()
    }
  }

  // ── Audio extension helper ───────────────────────────────────────────
  const getExt = (blob) => {
    if (!blob) return 'webm'
    const t = (blob.type || '').split(';')[0].trim()
    if (t.includes('ogg'))  return 'ogg'
    if (t.includes('mp4'))  return 'mp4'
    if (t.includes('mpeg')) return 'mp3'
    if (t.includes('wav'))  return 'wav'
    return 'webm'
  }

  // ── PUBLISH ──────────────────────────────────────────────────────────
  const handlePublish = async (e) => {
    e.preventDefault()
    if (!title.trim())                 { setError('Please enter a title.'); return }
    if (!content.trim() && !audioBlob) { setError('Please add text or a voice recording.'); return }

    setPublishing(true)
    setError(null)
    setUploadProgress(null)

    try {
      let audioUrl = null

      // ── Step 1: Upload audio if present ──────────────────────────
      if (audioBlob) {
        setUploadProgress('uploading')

        const ext      = getExt(audioBlob)
        const formData = new FormData()
        formData.append('audio', audioBlob, `recording-${Date.now()}.${ext}`)

        // ✅ Do NOT set Content-Type — browser auto-sets multipart/form-data with boundary
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body:   formData,
        })

        if (!uploadRes.ok) {
          let errMsg = 'Audio upload failed.'
          try {
            const errData = await uploadRes.json()
            errMsg = errData.error || errMsg
          } catch {}
          setUploadProgress(null)
          throw new Error(errMsg)
        }

        const uploadData = await uploadRes.json()
        audioUrl = uploadData.url
        setUploadProgress('done')
      }

      // ── Step 2: Create post ───────────────────────────────────────
      const postRes = await fetch('/api/posts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title:     title.trim(),
          content:   content.trim(),
          category,
          audio_url: audioUrl,
        }),
      })

      if (!postRes.ok) {
        let errMsg = 'Failed to publish post.'
        try {
          const errData = await postRes.json()
          errMsg = errData.error || errMsg
        } catch {}
        throw new Error(errMsg)
      }

      // ── Step 3: Reset + refresh ───────────────────────────────────
      setTitle('')
      setContent('')
      setAudioBlob(null)
      setCategory('poem')
      setUploadProgress(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 6000)
      fetchPosts()

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setUploadProgress(null)
    } finally {
      setPublishing(false)
    }
  }

  // ── DELETE ───────────────────────────────────────────────────────────
  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Remove "${postTitle}" from the website?\n\nThis cannot be undone.`)) return

    setDeletingId(postId)
    try {
      const res = await fetch(`/api/posts?id=${postId}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId))
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to delete post.')
      }
    } catch {
      setError('Network error. Could not delete post.')
    } finally {
      setDeletingId(null)
    }
  }

  // ── LOGOUT ───────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await fetch('/api/auth', { method: 'DELETE' }) } finally {
      router.push('/')
      router.refresh()
    }
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  const categoryOptions = [
    { value: 'poem',       label: '🌸 Poem'       },
    { value: 'reflection', label: '🌿 Reflection'  },
    { value: 'story',      label: '📖 Story'       },
    { value: 'note',       label: '✍️  Note'        },
  ]

  const isPublishDisabled =
    publishing || !title.trim() || (!content.trim() && !audioBlob)

  return (
    <div className="min-h-screen" style={{ background: 'var(--parchment-light)' }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{ background: 'rgba(45,8,16,0.97)', borderBottom: '1px solid rgba(200,155,58,0.2)' }}
      >
        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #c9993a, transparent)' }} />
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-display text-xl" style={{ color: '#f0d080' }}>
              Chhaya's <span className="italic">Studio</span>
            </p>
            <p className="text-[0.6rem] font-display tracking-[0.25em] uppercase" style={{ color: '#c9993a' }}>
              Publishing Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-sm hidden md:block"
              style={{ color: 'rgba(200,155,58,0.55)' }}
            >
              View Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="font-display text-sm px-4 py-2 rounded-sm"
              style={{ color: 'rgba(200,155,58,0.7)', border: '1px solid rgba(200,155,58,0.2)' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ══ LEFT — Publishing Studio ════════════════════════ */}
          <div className="lg:col-span-3">

            {/* Success */}
            {success && (
              <div
                className="mb-6 px-5 py-4 rounded-sm font-display text-base animate-fade-slide-up flex items-center gap-3"
                style={{ background: 'rgba(30,100,60,0.1)', color: '#1a6040', border: '1px solid rgba(30,100,60,0.2)' }}
              >
                <span>✓</span>
                <span>Published! Your post is now live on the homepage.</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                className="mb-6 px-5 py-4 rounded-sm font-display text-base flex items-start gap-3"
                style={{ background: 'rgba(180,34,72,0.08)', color: '#b82248', border: '1px solid rgba(180,34,72,0.18)' }}
              >
                <span>⚠️</span>
                <span className="flex-1">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="opacity-60 hover:opacity-100 flex-shrink-0"
                >✕</button>
              </div>
            )}

            <div className="literary-card p-7 md:p-9">
              <div className="mb-7">
                <p className="section-label mb-1">Create a Post</p>
                <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--burgundy-deep)' }}>
                  Publishing Studio
                </h2>
                <div className="gold-divider mt-3">
                  <span className="ornament text-sm">✦</span>
                </div>
              </div>

              <form onSubmit={handlePublish} className="flex flex-col gap-6">

                {/* Title */}
                <div>
                  <label className="section-label block mb-2">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="literary-input"
                    placeholder="Name your poem or post…"
                    maxLength={200}
                    disabled={publishing}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="section-label block mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCategory(opt.value)}
                        disabled={publishing}
                        className="px-4 py-2 font-display text-sm rounded-sm transition-all"
                        style={{
                          background: category === opt.value
                            ? 'linear-gradient(135deg, var(--burgundy-mid), var(--burgundy-bright))'
                            : 'rgba(200,155,58,0.07)',
                          color:  category === opt.value ? '#f0d080' : 'var(--ink-mid)',
                          border: `1px solid ${category === opt.value ? 'rgba(200,155,58,0.3)' : 'rgba(200,155,58,0.15)'}`,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── LAYER 1: Text + Dictation ───────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <label className="section-label">
                      Text {!audioBlob && <span style={{ color: 'var(--burgundy-mid)' }}>*</span>}
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Language toggle */}
                      {speechSupported && (
                        <div
                          className="flex rounded-sm overflow-hidden"
                          style={{ border: '1px solid rgba(200,155,58,0.2)' }}
                        >
                          {[
                            { value: 'hi-IN', label: 'हिन्दी' },
                            { value: 'en-IN', label: 'English' },
                          ].map(l => (
                            <button
                              key={l.value}
                              type="button"
                              disabled={listening}
                              onClick={() => setDictLang(l.value)}
                              className="px-3 py-1 font-display text-xs transition-all"
                              style={{
                                background: dictLang === l.value ? 'rgba(200,155,58,0.18)' : 'transparent',
                                color: dictLang === l.value ? 'var(--gold-primary)' : 'var(--ink-soft)',
                              }}
                            >
                              {l.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Dictate button */}
                      <button
                        type="button"
                        onClick={toggleDictation}
                        disabled={!speechSupported || publishing}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-sm font-display text-xs tracking-widest uppercase transition-all"
                        style={{
                          background: listening ? 'rgba(180,34,72,0.12)' : 'rgba(200,155,58,0.07)',
                          color:      listening ? '#b82248' : 'var(--gold-primary)',
                          border:     `1px solid ${listening ? 'rgba(180,34,72,0.25)' : 'rgba(200,155,58,0.18)'}`,
                          opacity:    !speechSupported || publishing ? 0.4 : 1,
                          cursor:     !speechSupported || publishing ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {listening ? (
                          <>
                            <span
                              className="w-2 h-2 rounded-full recording-pulse"
                              style={{ background: '#b82248' }}
                            />
                            Stop
                          </>
                        ) : '🎤 Dictate'}
                      </button>
                    </div>
                  </div>

                  {!speechSupported && (
                    <div
                      className="mb-2 px-3 py-2 rounded-sm text-xs font-body"
                      style={{ background: 'rgba(200,155,58,0.06)', color: 'var(--ink-soft)' }}
                    >
                      💡 Dictation works in <strong>Chrome or Edge</strong> only.
                    </div>
                  )}
                  {speechError && (
                    <div
                      className="mb-2 px-3 py-2 rounded-sm text-xs font-body"
                      style={{ background: 'rgba(180,34,72,0.06)', color: '#b82248' }}
                    >
                      {speechError}
                    </div>
                  )}
                  {listening && (
                    <div
                      className="mb-2 px-3 py-2 rounded-sm text-xs font-body"
                      style={{ background: 'rgba(180,34,72,0.04)', color: 'var(--ink-mid)' }}
                    >
                      🎤 Listening in <strong>{dictLang === 'hi-IN' ? 'Hindi' : 'English'}</strong>…
                      {interimText && <em className="ml-1 opacity-60">{interimText}</em>}
                    </div>
                  )}

                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onClick={e => { cursorRef.current = e.target.selectionStart }}
                    onKeyUp={e  => { cursorRef.current = e.target.selectionStart }}
                    className="literary-textarea"
                    placeholder={
                      audioBlob
                        ? 'Optional — add text to go with your recording…'
                        : 'Write your poem or reflection here… or use Dictate to speak it in Hindi or English.'
                    }
                    style={{ minHeight: '220px' }}
                    disabled={publishing}
                  />
                  <p
                    className="text-right text-xs mt-1 font-display"
                    style={{ color: 'var(--ink-soft)', opacity: 0.5 }}
                  >
                    {content.length} characters
                  </p>
                </div>

                {/* ── LAYER 2: Audio Recording ────────────────── */}
                <div>
                  <label className="section-label block mb-1">
                    Voice Recording
                    <span
                      className="normal-case font-body text-xs tracking-normal ml-2"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      — optional, appears as a playable audio player in the post
                    </span>
                  </label>

                  {/* Upload progress */}
                  {uploadProgress === 'uploading' && (
                    <div
                      className="mb-3 flex items-center gap-3 px-4 py-2 rounded-sm"
                      style={{ background: 'rgba(200,155,58,0.08)', border: '1px solid rgba(200,155,58,0.2)' }}
                    >
                      <span
                        className="w-4 h-4 border-2 rounded-full animate-spin flex-shrink-0"
                        style={{ borderColor: 'rgba(200,155,58,0.3)', borderTopColor: 'var(--gold-primary)' }}
                      />
                      <span className="font-display text-sm" style={{ color: 'var(--gold-primary)' }}>
                        Uploading your voice recording…
                      </span>
                    </div>
                  )}
                  {uploadProgress === 'done' && (
                    <div
                      className="mb-3 flex items-center gap-2 px-4 py-2 rounded-sm"
                      style={{ background: 'rgba(30,100,60,0.08)', border: '1px solid rgba(30,100,60,0.2)' }}
                    >
                      <span>✓</span>
                      <span className="font-display text-sm" style={{ color: '#1a6040' }}>
                        Recording uploaded — creating post…
                      </span>
                    </div>
                  )}

                  <AudioRecorder
                    onRecorded={blob => setAudioBlob(blob)}
                    disabled={publishing}
                  />
                </div>

                {/* Publish button */}
                <button
                  type="submit"
                  disabled={isPublishDisabled}
                  className="btn-gold w-full justify-center text-lg py-4 mt-2"
                >
                  {publishing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span
                        className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: 'rgba(45,8,16,0.25)', borderTopColor: 'var(--burgundy-deep)' }}
                      />
                      {uploadProgress === 'uploading' ? 'Uploading recording…' : 'Publishing…'}
                    </span>
                  ) : 'Publish Post ✦'}
                </button>

                <p
                  className="text-center text-xs font-body"
                  style={{ color: 'var(--ink-soft)', opacity: 0.6 }}
                >
                  Your post appears on the homepage immediately after publishing.
                </p>

              </form>
            </div>
          </div>

          {/* ══ RIGHT — Manage Posts ════════════════════════════ */}
          <div className="lg:col-span-2">
            <div className="literary-card p-6 sticky top-24">
              <div className="mb-5">
                <p className="section-label mb-1">All Posts</p>
                <h3
                  className="font-display text-2xl font-semibold"
                  style={{ color: 'var(--burgundy-deep)' }}
                >
                  Manage & Take Down
                </h3>
              </div>

              {loadingPosts ? (
                <div
                  className="py-10 text-center font-display italic"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  Loading…
                </div>
              ) : posts.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="text-3xl mb-3 opacity-20">📜</div>
                  <p className="font-display text-lg italic" style={{ color: 'var(--ink-soft)' }}>
                    No posts yet.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[62vh] overflow-y-auto pr-1">
                  {posts.map(post => (
                    <div
                      key={post.id}
                      className="rounded-sm p-4 transition-all"
                      style={{
                        background: 'rgba(200,155,58,0.05)',
                        border: '1px solid rgba(200,155,58,0.12)',
                        opacity: deletingId === post.id ? 0.5 : 1,
                      }}
                    >
                      {/* Post info */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p
                          className="font-display text-base font-semibold leading-tight flex-1 min-w-0 truncate"
                          style={{ color: 'var(--burgundy-deep)' }}
                        >
                          {post.title}
                        </p>
                        {post.audio_url && (
                          <span
                            className="text-xs flex-shrink-0"
                            title="Has audio"
                            style={{ color: 'var(--gold-primary)' }}
                          >
                            🎙
                          </span>
                        )}
                      </div>

                      {/* Date + category */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span
                          className="text-[10px] font-display tracking-widest uppercase px-2 py-0.5 rounded-sm"
                          style={{ background: 'rgba(143,26,55,0.08)', color: 'var(--burgundy-mid)' }}
                        >
                          {post.category}
                        </span>
                        <span className="text-[11px] font-display" style={{ color: 'var(--ink-soft)' }}>
                          {formatDate(post.created_at)}
                        </span>
                      </div>

                      {/* Take Down button */}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={!!deletingId}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-sm font-display text-xs tracking-wide transition-all"
                        style={{
                          background: 'rgba(180,34,72,0.07)',
                          color: deletingId === post.id ? '#b82248' : 'rgba(180,34,72,0.6)',
                          border: '1px solid rgba(180,34,72,0.15)',
                          cursor: deletingId ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {deletingId === post.id ? (
                          <>
                            <span
                              className="w-3 h-3 border border-t-transparent rounded-full animate-spin"
                              style={{ borderColor: '#b82248', borderTopColor: 'transparent' }}
                            />
                            Removing…
                          </>
                        ) : '✕ Take Down Post'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="mt-5 pt-4 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(200,155,58,0.1)' }}
              >
                <span
                  className="font-display text-xs"
                  style={{ color: 'var(--ink-soft)', opacity: 0.6 }}
                >
                  {posts.length} post{posts.length !== 1 ? 's' : ''} published
                </span>
                <Link
                  href="/"
                  target="_blank"
                  className="font-display text-sm"
                  style={{ color: 'var(--gold-primary)' }}
                >
                  View site ↗
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
