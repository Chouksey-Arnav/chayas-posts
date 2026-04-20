'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AudioPlayer } from '@/components/Audio'

/* ─── Professional date formatter (client-side) ─────────────────────── */
function formatPostDate(iso) {
  const date     = new Date(iso)
  const now      = new Date()
  const diffMs   = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const full = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  })

  const time = date.toLocaleTimeString('en-IN', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  let relative = ''
  if (diffDays === 0)        relative = 'Today'
  else if (diffDays === 1)   relative = 'Yesterday'
  else if (diffDays < 7)     relative = `${diffDays} days ago`
  else if (diffDays < 30)    relative = `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  else if (diffDays < 365)   relative = `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
  else                       relative = `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`

  return { full, time, relative }
}

/* ─── Category badge ────────────────────────────────────────────────── */
function CategoryBadge({ category }) {
  const map = {
    poem:       { label: 'Poem',       bg: 'rgba(143,26,55,0.1)',  color: '#8f1a37' },
    reflection: { label: 'Reflection', bg: 'rgba(200,155,58,0.1)', color: '#7d5c1c' },
    story:      { label: 'Story',      bg: 'rgba(45,8,16,0.08)',   color: '#4a3f30' },
    note:       { label: 'Note',       bg: 'rgba(100,60,20,0.08)', color: '#4a3f30' },
  }
  const s = map[category] || map.note
  return (
    <span
      className="px-3 py-0.5 text-xs font-display tracking-widest uppercase rounded-sm"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

/* ─── Single Post Card ──────────────────────────────────────────────── */
function PostCard({ post, isAdmin, onDelete, deleting }) {
  const { full, time, relative } = formatPostDate(post.created_at)
  const [expanded, setExpanded] = useState(false)

  const isLong    = post.content && post.content.length > 500
  const showToggle = isLong && !post.audio_url
  const displayContent = (!expanded && isLong)
    ? post.content.slice(0, 480) + '…'
    : post.content

  return (
    <article
      className="literary-card p-6 md:p-8 animate-fade-slide-up"
      style={{ opacity: deleting ? 0.5 : 1, transition: 'opacity 0.3s' }}
    >
      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <CategoryBadge category={post.category} />
            {post.audio_url && (
              <span
                className="text-xs font-display tracking-widest uppercase px-2 py-0.5 rounded-sm"
                style={{ background: 'rgba(200,155,58,0.1)', color: '#c9993a' }}
              >
                🎙 Audio
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            className="font-display text-2xl md:text-3xl font-semibold leading-snug"
            style={{ color: 'var(--burgundy-deep)' }}
          >
            {post.title}
          </h2>
        </div>

        {/* Admin delete button */}
        {isAdmin && (
          <button
            onClick={() => onDelete(post.id, post.title)}
            disabled={deleting}
            title="Delete this post"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-display text-xs tracking-wide transition-all"
            style={{
              background: 'rgba(180,34,72,0.07)',
              color: 'rgba(180,34,72,0.65)',
              border: '1px solid rgba(180,34,72,0.15)',
            }}
          >
            {deleting ? (
              <span className="w-3 h-3 border border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'rgba(180,34,72,0.5)', borderTopColor: 'transparent' }} />
            ) : (
              '✕'
            )}
            {deleting ? 'Removing…' : 'Take Down'}
          </button>
        )}
      </div>

      {/* ── Professional Date ───────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(200,155,58,0.35), transparent)', maxWidth: '40px' }} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
          <span className="font-display text-sm font-medium" style={{ color: 'var(--gold-primary)', opacity: 0.9 }}>
            {full}
          </span>
          <span className="hidden sm:block text-xs" style={{ color: 'rgba(200,155,58,0.3)' }}>·</span>
          <span className="font-display text-xs" style={{ color: 'var(--ink-soft)', opacity: 0.7 }}>
            {time}
          </span>
          {relative && (
            <>
              <span className="hidden sm:block text-xs" style={{ color: 'rgba(200,155,58,0.3)' }}>·</span>
              <span
                className="font-display text-xs px-2 py-0.5 rounded-sm"
                style={{ background: 'rgba(200,155,58,0.07)', color: 'var(--ink-soft)', opacity: 0.8 }}
              >
                {relative}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Text Content ────────────────────────────────────────── */}
      {post.content && (
        <div>
          <p
            className="prose-literary"
            style={{ whiteSpace: 'pre-wrap', lineHeight: '1.9' }}
          >
            {displayContent}
          </p>
          {showToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 font-display italic text-sm transition-colors"
              style={{ color: 'var(--gold-primary)' }}
            >
              {expanded ? '↑ Show less' : '↓ Read more'}
            </button>
          )}
        </div>
      )}

      {/* ── Audio Player ────────────────────────────────────────── */}
      {post.audio_url && (
        <AudioPlayer url={post.audio_url} title={post.title} />
      )}
    </article>
  )
}

/* ─── Post Feed (main export) ───────────────────────────────────────── */
export default function PostFeed({ posts: initialPosts, isAdmin }) {
  const router              = useRouter()
  const [posts, setPosts]   = useState(initialPosts)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const handleDelete = useCallback(async (id, title) => {
    const confirmed = window.confirm(
      `Remove "${title}" from the site?\n\nThis cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(id)
    setDeleteError(null)

    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Optimistically remove from local state
        setPosts(prev => prev.filter(p => p.id !== id))
        // Refresh server component data
        router.refresh()
      } else {
        const data = await res.json()
        setDeleteError(data.error || 'Failed to delete post.')
      }
    } catch {
      setDeleteError('Network error. Could not delete post.')
    } finally {
      setDeletingId(null)
    }
  }, [router])

  if (posts.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-6 opacity-20">📜</div>
        <p className="font-display text-2xl italic mb-2" style={{ color: 'var(--ink-soft)' }}>
          The page is yet unwritten…
        </p>
        <p className="font-body text-base" style={{ color: 'var(--ink-soft)', opacity: 0.6 }}>
          Chhaya's first post will appear here soon.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Delete error banner */}
      {deleteError && (
        <div
          className="px-5 py-4 rounded-sm font-display text-sm flex items-center justify-between"
          style={{ background: 'rgba(180,34,72,0.08)', color: '#b82248', border: '1px solid rgba(180,34,72,0.18)' }}
        >
          <span>⚠️ {deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="ml-4 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {posts.map((post, i) => (
        <div key={post.id} style={{ animationDelay: `${i * 0.07}s` }}>
          <PostCard
            post={post}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            deleting={deletingId === post.id}
          />
        </div>
      ))}
    </div>
  )
}
