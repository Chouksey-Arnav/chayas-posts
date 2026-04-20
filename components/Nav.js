'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/',                label: 'Home'           },
  { href: '/about',           label: 'About'          },
  { href: '/accomplishments', label: 'Accomplishments'},
]

export function Navbar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [isAdmin,   setIsAdmin]   = useState(false)
  const [checking,  setChecking]  = useState(true)

  // Check if already logged in (cookie present & valid)
  useEffect(() => {
    fetch('/api/auth')
      .then(r => { setIsAdmin(r.ok); setChecking(false) })
      .catch(() => setChecking(false))
  }, [pathname])

  const handleSignOut = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    setIsAdmin(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Gold top accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9993a] to-transparent" />

      <nav
        className="backdrop-blur-md"
        style={{
          background: 'rgba(45,8,16,0.97)',
          borderBottom: '1px solid rgba(200,155,58,0.2)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

          {/* ── Brand ───────────────────────────────────── */}
          <Link
            href="/"
            className="flex flex-col leading-none"
            onClick={() => setMenuOpen(false)}
          >
            <span className="font-display text-2xl font-light tracking-wide" style={{ color: '#f0d080' }}>
              Chhaya<span className="font-semibold">'s</span>
            </span>
            <span className="text-[0.58rem] font-display tracking-[0.3em] uppercase" style={{ color: '#c9993a', marginTop: '-2px' }}>
              Posts
            </span>
          </Link>

          {/* ── Desktop nav links ────────────────────────── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-display text-base tracking-wide transition-all duration-300 pb-0.5"
                style={{
                  color: pathname === href ? '#e8c060' : 'rgba(240,208,128,0.65)',
                  borderBottom: pathname === href ? '1px solid #c9993a' : '1px solid transparent',
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Admin / Sign-in area ─────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {!checking && (
              isAdmin ? (
                // Logged in — show Studio + Sign Out
                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 px-4 py-1.5 rounded-sm font-display text-sm tracking-wide transition-all"
                    style={{
                      background: 'linear-gradient(135deg, rgba(200,155,58,0.15), rgba(200,155,58,0.08))',
                      color: '#e8c060',
                      border: '1px solid rgba(200,155,58,0.3)',
                    }}
                  >
                    <span>✍️</span> Studio
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="font-display text-xs tracking-widest uppercase transition-colors"
                    style={{ color: 'rgba(200,155,58,0.45)' }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                // Not logged in — show "Sign in as Chhaya"
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-1.5 rounded-sm font-display text-sm tracking-wide transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(143,26,55,0.4), rgba(107,20,41,0.4))',
                    color: 'rgba(240,208,128,0.8)',
                    border: '1px solid rgba(200,155,58,0.25)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(200,155,58,0.5)', display:'inline-block' }} />
                  Sign in as Chhaya
                </Link>
              )
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────── */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-[#e8c060] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-[#e8c060] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-[#e8c060] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* ── Mobile menu ──────────────────────────────── */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: 'rgba(200,155,58,0.12)', background: 'rgba(25,4,10,0.99)' }}
          >
            <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-lg tracking-wide py-1 border-b"
                  style={{
                    color: pathname === href ? '#e8c060' : 'rgba(240,208,128,0.7)',
                    borderColor: 'rgba(200,155,58,0.1)',
                  }}
                >
                  {label}
                </Link>
              ))}

              {/* Mobile: admin link */}
              {!checking && (
                isAdmin ? (
                  <div className="flex flex-col gap-3 pt-2">
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-base"
                      style={{ color: '#e8c060' }}
                    >
                      ✍️ Publishing Studio
                    </Link>
                    <button
                      onClick={() => { setMenuOpen(false); handleSignOut() }}
                      className="font-display text-sm text-left"
                      style={{ color: 'rgba(200,155,58,0.5)' }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-base pt-2"
                    style={{ color: 'rgba(200,155,58,0.75)' }}
                  >
                    🌹 Sign in as Chhaya
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer
      className="mt-24 py-12 text-center"
      style={{ background: 'rgba(45,8,16,0.97)', borderTop: '1px solid rgba(200,155,58,0.15)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9993a]" />
          <span className="text-[#c9993a] text-xl font-display">❧</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9993a]" />
        </div>

        <p className="font-display text-xl italic mb-1" style={{ color: '#f0d080' }}>
          Chhaya's Posts
        </p>
        <p className="font-body text-sm mb-6" style={{ color: 'rgba(200,155,58,0.55)' }}>
          Poems, reflections, and voice recordings — straight from the heart
        </p>

        <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-sm tracking-wider"
              style={{ color: 'rgba(240,208,128,0.4)' }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="font-display text-sm tracking-wider"
            style={{ color: 'rgba(200,155,58,0.25)' }}
          >
            Admin
          </Link>
        </div>

        <p className="text-xs font-body" style={{ color: 'rgba(200,155,58,0.25)' }}>
          © {new Date().getFullYear()} Chhaya Chouksey. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
