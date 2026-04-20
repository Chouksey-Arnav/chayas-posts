'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const reason       = searchParams.get('reason')

  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState(
    reason === 'unauthorized' ? 'Please log in to access the studio.' :
    reason === 'expired'      ? 'Your session has expired. Please log in again.' :
    null
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Incorrect password. Please try again.')
        setPassword('')
      }
    } catch {
      setError('Unable to connect. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: 'linear-gradient(160deg, #2d0810 0%, #4a0e1c 45%, #6b1429 75%, #8f1a37 100%)' }}
    >
      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)' }} />
      </div>

      {/* Back link */}
      <div className="relative mb-8 w-full max-w-sm">
        <Link
          href="/"
          className="font-display text-sm tracking-widest uppercase transition-colors"
          style={{ color: 'rgba(200,155,58,0.5)' }}
        >
          ← Back to Chhaya's Posts
        </Link>
      </div>

      {/* Login card */}
      <div
        className="relative w-full max-w-sm rounded-sm overflow-hidden animate-fade-slide-up"
        style={{
          background: 'linear-gradient(160deg, #fdfaf4 0%, #faf3e0 100%)',
          border: '1px solid rgba(200,155,58,0.2)',
          boxShadow: '0 32px 80px rgba(45,8,16,0.5), 0 8px 24px rgba(45,8,16,0.3)',
        }}
      >
        {/* Gold top bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #c9993a, transparent)' }} />

        <div className="p-8 md:p-10">
          {/* Icon + Title */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(143,26,55,0.12), rgba(200,155,58,0.08))',
                border: '1px solid rgba(200,155,58,0.2)',
              }}
            >
              🌹
            </div>

            <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: 'var(--burgundy-deep)' }}>
              Chhaya's Studio
            </h1>
            <p className="font-body text-sm" style={{ color: 'var(--ink-soft)' }}>
              Private publishing studio — admin only
            </p>

            <div className="gold-divider mt-4">
              <span className="ornament text-base">✦</span>
            </div>
          </div>

          {/* How to set your password — helpful info box */}
          <div
            className="mb-6 px-4 py-3 rounded-sm text-xs font-body leading-relaxed"
            style={{
              background: 'rgba(200,155,58,0.07)',
              border: '1px solid rgba(200,155,58,0.15)',
              color: 'var(--ink-soft)',
            }}
          >
            <p className="font-display text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--gold-primary)' }}>
              💡 Your Password
            </p>
            Your admin password is the <strong>ADMIN_PASSWORD</strong> you set in your Vercel Environment Variables.
            To change it, go to <strong>Vercel → Your Project → Settings → Environment Variables</strong>, update{' '}
            <code className="px-1 py-0.5 rounded" style={{ background: 'rgba(45,8,16,0.07)', fontFamily: 'monospace' }}>ADMIN_PASSWORD</code>,
            then redeploy.
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-sm text-sm font-body flex items-start gap-2"
              style={{ background: 'rgba(180,34,72,0.08)', color: '#b82248', border: '1px solid rgba(180,34,72,0.18)' }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-display text-xs tracking-widest uppercase"
                style={{ color: 'var(--ink-mid)' }}
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="literary-input pr-11"
                  placeholder="Enter your password…"
                  autoFocus
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base transition-opacity hover:opacity-80"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold w-full justify-center text-base py-3.5 mt-1"
              disabled={loading || !password.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 rounded-full animate-spin flex-shrink-0"
                    style={{ borderColor: 'rgba(45,8,16,0.25)', borderTopColor: 'var(--burgundy-deep)' }}
                  />
                  Signing in…
                </span>
              ) : (
                'Enter the Studio →'
              )}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-xs" style={{ color: 'var(--ink-soft)', opacity: 0.6 }}>
            This area is for Chhaya only. Viewers can enjoy her posts on the{' '}
            <Link href="/" className="underline" style={{ color: 'var(--gold-primary)' }}>home page</Link>.
          </p>
        </div>
      </div>

      <p className="relative mt-8 font-body text-xs" style={{ color: 'rgba(200,155,58,0.3)' }}>
        © {new Date().getFullYear()} Chhaya Chouksey
      </p>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #2d0810, #6b1429)' }}
      >
        <div className="font-display text-lg italic" style={{ color: 'rgba(200,155,58,0.5)' }}>
          Loading…
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
