import Link from 'next/link'
import { cookies } from 'next/headers'
import { supabase, verifyToken } from '@/lib/db'
import { Navbar, Footer } from '@/components/Nav'
import PostFeed from '@/components/PostFeed'

export const revalidate = 0

// ── Fetch all posts server-side ──────────────────────────────────────
async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, content, category, audio_url, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getPosts error:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('getPosts unhandled:', err)
    return []
  }
}

// ── Check if viewer is the admin (server-side cookie read) ────────────
async function checkIsAdmin() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return false
    const payload = await verifyToken(token)
    return !!payload
  } catch {
    return false
  }
}

export default async function HomePage() {
  const [posts, isAdmin] = await Promise.all([getPosts(), checkIsAdmin()])

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-28 md:py-40 text-center"
        style={{ background: 'linear-gradient(160deg, #2d0810 0%, #4a0e1c 45%, #6b1429 75%, #8f1a37 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)', opacity: 0.05 }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, #e8c060 0%, transparent 70%)', opacity: 0.05 }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-6">
          <p
            className="section-label text-center mb-6 animate-fade-slide-up"
            style={{ color: '#c9993a' }}
          >
            A Personal Literary Space
          </p>

          <h1
            className="font-display font-light leading-none mb-4 animate-fade-slide-up delay-100"
            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: '#f0d080' }}
          >
            Chhaya's <em className="italic">Posts</em>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-6 animate-fade-slide-up delay-200">
            <div className="h-px w-12" style={{ background: 'rgba(200,155,58,0.5)' }} />
            <span className="font-display text-lg" style={{ color: '#c9993a' }}>❧</span>
            <div className="h-px w-12" style={{ background: 'rgba(200,155,58,0.5)' }} />
          </div>

          <p
            className="font-body text-lg md:text-xl leading-relaxed italic animate-fade-slide-up delay-300"
            style={{ color: 'rgba(240,208,128,0.8)' }}
          >
            Poems, reflections, and voice recordings — straight from the heart of Dr. Chhaya Chouksey.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap animate-fade-slide-up delay-400">
            <a href="#posts" className="btn-gold">Read the Posts</a>
            <Link
              href="/about"
              className="btn-secondary"
              style={{ color: 'rgba(240,208,128,0.75)', borderColor: 'rgba(200,155,58,0.35)' }}
            >
              About Chhaya
            </Link>
          </div>
        </div>
      </section>

      {/* ── Admin banner (only visible when signed in) ───────── */}
      {isAdmin && (
        <div
          className="py-3 px-6 text-center"
          style={{
            background: 'rgba(200,155,58,0.1)',
            borderBottom: '1px solid rgba(200,155,58,0.2)',
          }}
        >
          <p className="font-display text-sm" style={{ color: 'var(--gold-primary)' }}>
            ✍️ You are signed in as Chhaya.{' '}
            <Link
              href="/admin/dashboard"
              className="underline font-semibold"
              style={{ color: 'var(--burgundy-mid)' }}
            >
              Open the Publishing Studio →
            </Link>
          </p>
        </div>
      )}

      {/* ── Posts Feed ───────────────────────────────────────── */}
      <main id="posts" className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Latest</p>
          <h2
            className="font-display text-4xl font-light"
            style={{ color: 'var(--burgundy-deep)' }}
          >
            Words & Recordings
          </h2>
          <div className="gold-divider mt-4">
            <span className="ornament">✦</span>
          </div>
        </div>

        <PostFeed posts={posts} isAdmin={isAdmin} />
      </main>

      <Footer />
    </>
  )
}
